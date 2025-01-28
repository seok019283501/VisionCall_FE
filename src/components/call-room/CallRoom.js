// src/components/call/CallRoom.js
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

  // **내 userId를 저장**할 state
  const [myUserId, setMyUserId] = useState(null);

  // STOMP 클라이언트
  const [stompClient, setStompClient] = useState(null);

  // 로컬 스트림
  const localStreamRef = useRef(null);

  // peerConnectionsRef: { [상대방 userId]: RTCPeerConnection }
  const peerConnectionsRef = useRef({});

  // 아직 remoteDescription이 세팅되지 않은 상태에서 도착한 ICE를 임시 보관
  // 예: { [senderUserId]: [candidate1, candidate2, ...] }
  const pendingCandidatesRef = useRef({});

  //----------------------------------------------------------------------
  // 1) 컴포넌트 초기화:
  //    - 내 회원 아이디 조회 -> 방 멤버 목록 조회 -> 로컬 스트림 획득 -> STOMP 연결
  //----------------------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        // 1. 내 회원 아이디 조회
        const res = await axios.get(`${rest_api_url}/api/member`, {
          headers: {
            Authorization: access_token,
          },
        });
        const user_id = res.data.body.member_id; // 백엔드 응답 구조에 맞게
        setMyUserId(user_id);

        // 2. 방 멤버 목록 조회
        await handleRoomMemberList(room_number);

        // 3. 로컬 스트림 획득
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;

        // 내 로컬 영상 태그에 stream 주입
        const myVideo = document.getElementById('myLocalVideo');
        if (myVideo) {
          myVideo.srcObject = stream;
        }

        // 4. STOMP(WebSocket) 연결
        connectStomp(user_id);
      } catch (err) {
        console.error('Error in init:', err);
      }
    };

    init();

    // 언마운트 시 정리
    return () => {
      // PeerConnection 종료
      Object.values(peerConnectionsRef.current).forEach((pc) => {
        pc.close();
      });
      peerConnectionsRef.current = {};

      // STOMP 종료
      if (stompClient) {
        stompClient.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room_number]); // room_number 변경 시 재호출

  //----------------------------------------------------------------------
  // 2) STOMP 연결 함수
  //----------------------------------------------------------------------
  const connectStomp = (userId) => {
    const signalingUrl = `${rest_api_url}/ws`; 

    const socket = new SockJS(signalingUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('STOMP connected');

        // 2-1) 구독
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

        // 2-2) 방에 들어온 후, 다른 유저에게 Offer를 보낼지 말지 결정
        //      여기서는 예시로 "나를 제외한 모든 유저에게 Offer 보낸다"
        sendOfferToOthers();
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });

    client.activate();
    setStompClient(client);
  };

  //----------------------------------------------------------------------
  // 3) 나를 제외한 모든 유저에게 Offer 생성 & 전송
  //----------------------------------------------------------------------
  const sendOfferToOthers = async () => {
    if (!stompClient || !localStreamRef.current || !myUserId) return;
    if (!roomMember || roomMember.length < 2) return;

    for (const member of roomMember) {
      // member.member_id 로 백엔드가 식별자를 준다고 가정
      if (member.member_id === myUserId) continue; // 자기 자신은 제외
      const remoteUserId = member.member_id;
      await createOffer(remoteUserId);
    }
  };

  //----------------------------------------------------------------------
  // 4) createOffer
  //----------------------------------------------------------------------
  const createOffer = async (remoteUserId) => {
    const pc = createPeerConnection(remoteUserId);

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Offer 전송
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

  //----------------------------------------------------------------------
  // 5) createPeerConnection (공통 함수)
  //----------------------------------------------------------------------
  const createPeerConnection = (remoteUserId) => {
    // 이미 PC가 있으면 재사용
    if (peerConnectionsRef.current[remoteUserId]) {
      return peerConnectionsRef.current[remoteUserId];
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // TURN 서버 필요 시 추가
      ],
    });

    // onicecandidate: ICE Candidate를 STOMP로 전송
    pc.onicecandidate = (event) => {
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

    // ontrack: 상대방 트랙을 수신하면 해당 video 태그에 stream 할당
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      const remoteVideo = document.getElementById(`remoteVideo-${remoteUserId}`);
      if (remoteVideo && remoteStream) {
        remoteVideo.srcObject = remoteStream;
      }
    };

    // 로컬 스트림을 PeerConnection에 추가
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    peerConnectionsRef.current[remoteUserId] = pc;
    return pc;
  };

  //----------------------------------------------------------------------
  // 6) handleReceiveOffer
  //----------------------------------------------------------------------
  const handleReceiveOffer = async (data) => {
    const { sdp, sender, receiver } = data;
    if (!myUserId || receiver !== myUserId) return; // 내게 온 offer만 처리

    console.log("Received Offer:", data);

    const pc = createPeerConnection(sender);
    try {
      // 먼저 RemoteDescription 세팅
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      // 만약 아직 버퍼링된 ICE candidate가 있다면, 지금 처리
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

  //----------------------------------------------------------------------
  // 7) handleReceiveAnswer
  //----------------------------------------------------------------------
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

      // 만약 버퍼링된 ICE candidate가 있다면, 여기서 처리
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

  //----------------------------------------------------------------------
  // 8) handleReceiveCandidate
  //----------------------------------------------------------------------
  const handleReceiveCandidate = async (data) => {
    const { candidate, sender, receiver } = data;

    // 내게 온 candidate만 처리
    if (!myUserId || receiver !== myUserId) {
      return;
    }
    console.log("Received ICE candidate:", data);

    const pc = peerConnectionsRef.current[sender];
    if (!pc) {
      console.error('PeerConnection not found for user:', sender);
      return;
    }

    // 아직 remoteDescription이 없으면 candidate 버퍼링
    if (!pc.remoteDescription || !pc.remoteDescription.type) {
      console.warn(`RemoteDescription not set yet. Buffering candidate from sender=${sender}`);
      if (!pendingCandidatesRef.current[sender]) {
        pendingCandidatesRef.current[sender] = [];
      }
      pendingCandidatesRef.current[sender].push(candidate);
      return;
    }

    // remoteDescription이 세팅되어 있다면 바로 addIceCandidate
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('Error adding received ice candidate', err);
    }
  };

  //----------------------------------------------------------------------
  // 9) 화면 렌더링 (영상/채팅 UI)
  //----------------------------------------------------------------------
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