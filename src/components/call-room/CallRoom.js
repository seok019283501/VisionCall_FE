import React, { useEffect, useRef, useState, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

import VisionCallContext from '../provider/VisionCallContext';
import CallRoomUser from './CallRoomUser';
import CallRoomChat from './CallRoomChat';

import { useParams } from 'react-router-dom';
import '../../styles/CallRoom.css';

const CallRoom = () => {
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");

  // 방 번호 (예: /call-room/:room_number)
  const { room_number } = useParams();

  // Context에서 제공하는 함수/멤버 (방 멤버 목록)
  const { handleRoomMemberList, roomMember } = useContext(VisionCallContext);

  // **내 userId**를 저장
  const [myUserId, setMyUserId] = useState(null);

  // STOMP 클라이언트
  const [stompClient, setStompClient] = useState(null);

  // 로컬 스트림
  const localStreamRef = useRef(null);

  // peerConnectionsRef: { [상대방 userId]: RTCPeerConnection }
  const peerConnectionsRef = useRef({});

  // ICE Candidate 버퍼링: { [senderUserId]: [candidate1, candidate2,...] }
  const pendingCandidatesRef = useRef({});

  //--------------------------------------------------------
  // 1) 컴포넌트 초기화
  //--------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        // 1. 내 회원 아이디 조회
        const res = await axios.get(`${rest_api_url}/api/member`, {
          headers: { Authorization: access_token },
        });
        const user_id = res.data.body.member_id;
        setMyUserId(user_id);

        // 2. 방 멤버 목록 조회
        await handleRoomMemberList(room_number);

        // 3. 로컬 스트림 획득
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;

        // 로컬 영상 <video>에 stream 연결
        const myVideo = document.getElementById('myLocalVideo');
        if (myVideo) {
          myVideo.srcObject = stream;
        }

        // 4. STOMP 연결
        connectStomp(user_id);
      } catch (err) {
        console.error('Error in init:', err);
      }
    };
    init();

    // 언마운트 시 PeerConnection, STOMP 정리
    return () => {
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      peerConnectionsRef.current = {};

      if (stompClient) {
        stompClient.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room_number]);

  //--------------------------------------------------------
  // 2) STOMP 연결
  //--------------------------------------------------------
  const connectStomp = (userId) => {
    const signalingUrl = `${rest_api_url}/ws`;

    const socket = new SockJS(signalingUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('STOMP connected');

        // 2-1) 구독: Notice (새 유저 입장 알림)
        client.subscribe(`/sub/notice/${room_number}`, (message) => {
          const data = JSON.parse(message.body);
          handleReceiveNotice(data);
        });

        // 2-2) 구독: Offer, Answer, ICE
        client.subscribe(`/sub/offer/${room_number}`, (message) => {
          const data = JSON.parse(message.body);
          handleReceiveOffer(data);
        });

        client.subscribe(`/sub/answer/${room_number}`, (message) => {
          const data = JSON.parse(message.body);
          handleReceiveAnswer(data);
        });

        client.subscribe(`/sub/ice-candidate/${room_number}`, (message) => {
          const data = JSON.parse(message.body);
          handleReceiveCandidate(data);
        });

        // [방법 B] "내가 새로 들어온 유저"라면 notice 발행
        // (기존 유저도 같은 코드가 실행되지만, 굳이 상관은 없음.
        //  이 로직은 "나는 새로운 유저"라고 서버/방 전체에 알리는 역할)
        client.publish({
          destination: `/pub/notice/${room_number}`,
          body: JSON.stringify({
            notice: 'join',
            userId: userId,
          }),
        });

        // [주의] 기존 코드의 "sendOfferToOthers()"는 제거/주석
        // (방법 B에서는 "후입장자가 아닌, 기존 유저가 offer를 보냄")
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });

    client.activate();
    setStompClient(client);
  };

  //--------------------------------------------------------
  // 3) Notice 수신 (새 유저가 들어왔다는 알림)
  //--------------------------------------------------------
  const handleReceiveNotice = (data) => {
    const { notice, userId: newUserId } = data;
    // 예: { notice: 'join', userId: 'abc' }

    // 만약 notice='join'이고, newUserId != myUserId => "내가" Offer를 보낸다(기존 유저 -> 새 유저)
    if (notice === 'join' && newUserId !== myUserId) {
      console.log(`[NOTICE] 새 유저(${newUserId})가 들어옴 → 내가 Offer 보냄`);
      createOffer(newUserId);
    }
  };

  //--------------------------------------------------------
  // 4) createOffer (기존 유저가 새 유저에게 Offer)
  //--------------------------------------------------------
  const createOffer = async (remoteUserId) => {
    if (!stompClient) {
      console.warn('createOffer called but no stompClient. Maybe not connected yet?');
      return;
    }
    const pc = createPeerConnection(remoteUserId);
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Offer 전송: sender=me, receiver=remoteUser
      stompClient.publish({
        destination: `/pub/offer/${room_number}`,
        body: JSON.stringify({
          sdp: offer,
          sender: myUserId,
          receiver: remoteUserId,
        }),
      });
    } catch (err) {
      console.error('createOffer error:', err);
    }
  };

  //--------------------------------------------------------
  // 5) createPeerConnection
  //--------------------------------------------------------
  const createPeerConnection = (remoteUserId) => {
    // 이미 있으면 재활용
    if (peerConnectionsRef.current[remoteUserId]) {
      return peerConnectionsRef.current[remoteUserId];
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // TURN 서버 필요 시 추가
      ],
    });

    // ICE candidate → STOMP 전송
    pc.onicecandidate = (event) => {
      if (!stompClient) {
        console.warn('onicecandidate fired but no stompClient. Skip publishing ICE...');
        return;
      }
      if (event.candidate) {
        stompClient.publish({
          destination: `/pub/ice-candidate/${room_number}`,
          body: JSON.stringify({
            candidate: event.candidate,
            sender: myUserId,
            receiver: remoteUserId,
          }),
        });
      }
    };

    // remote track → <video> 태그에 연결
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      const remoteVideo = document.getElementById(`remoteVideo-${remoteUserId}`);
      if (remoteVideo && remoteStream) {
        remoteVideo.srcObject = remoteStream;
      }
    };

    // 로컬 스트림을 pc에 추가
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    peerConnectionsRef.current[remoteUserId] = pc;
    return pc;
  };

  //--------------------------------------------------------
  // 6) handleReceiveOffer
  //--------------------------------------------------------
  const handleReceiveOffer = async (data) => {
    const { sdp, sender, receiver } = data;
    if (!myUserId || receiver !== myUserId) return;

    console.log("Received Offer:", data);

    const pc = createPeerConnection(sender);

    try {
      // remoteDescription 세팅
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      // 버퍼링된 candidate가 있으면 여기서 add
      if (pendingCandidatesRef.current[sender]) {
        for (const c of pendingCandidatesRef.current[sender]) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          } catch (err) {
            console.error('Error adding buffered candidate', err);
          }
        }
        pendingCandidatesRef.current[sender] = [];
      }

      // Answer 생성 & 전송
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      stompClient.publish({
        destination: `/pub/answer/${room_number}`,
        body: JSON.stringify({
          sdp: answer,
          sender: myUserId,
          receiver: sender,
        }),
      });
    } catch (err) {
      console.error('handleReceiveOffer error:', err);
    }
  };

  //--------------------------------------------------------
  // 7) handleReceiveAnswer
  //--------------------------------------------------------
  const handleReceiveAnswer = async (data) => {
    const { sdp, sender, receiver } = data;
    if (!myUserId || receiver !== myUserId) return;

    console.log("Received Answer:", data);

    const pc = peerConnectionsRef.current[sender];
    if (!pc) {
      console.error('PeerConnection not found for user:', sender);
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      // 버퍼링된 candidate 처리
      if (pendingCandidatesRef.current[sender]) {
        for (const c of pendingCandidatesRef.current[sender]) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          } catch (err) {
            console.error('Error adding buffered candidate', err);
          }
        }
        pendingCandidatesRef.current[sender] = [];
      }
    } catch (err) {
      console.error('handleReceiveAnswer error:', err);
    }
  };

  //--------------------------------------------------------
  // 8) handleReceiveCandidate
  //--------------------------------------------------------
  const handleReceiveCandidate = async (data) => {
    const { candidate, sender, receiver } = data;
    if (!myUserId || receiver !== myUserId) return;

    console.log("Received ICE candidate:", data);

    const pc = peerConnectionsRef.current[sender];
    if (!pc) {
      console.error('PeerConnection not found for user:', sender);
      return;
    }

    // remoteDescription이 없으면 버퍼링
    if (!pc.remoteDescription || !pc.remoteDescription.type) {
      console.warn(`RemoteDescription not set. Buffering candidate from sender=${sender}`);
      if (!pendingCandidatesRef.current[sender]) {
        pendingCandidatesRef.current[sender] = [];
      }
      pendingCandidatesRef.current[sender].push(candidate);
      return;
    }

    // 바로 add
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('Error adding received ice candidate', err);
    }
  };

  //--------------------------------------------------------
  // 9) 화면 렌더링
  //--------------------------------------------------------
  return (
    <div className="call-room-container">
      <div className="call-room-user-container">
        {roomMember.map((item, index) => (
          <CallRoomUser
            key={item.member_id}
            call_room_member_info={item}
            index={index}
          />
        ))}
      </div>
      <div className="call-room-chat-container">
        <CallRoomChat />
        <CallRoomChat />
        <CallRoomChat />
        <CallRoomChat />
      </div>
      <div className="call-room-chat-input-container">
        <input className="chat" type="text" />
        <input className="chat-send-button" type="button" value="전송" />
      </div>
    </div>
  );
};

export default CallRoom;