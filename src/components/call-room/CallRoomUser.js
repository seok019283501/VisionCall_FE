import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/CallRoomUser.css'
import VisionCallContext from '../provider/VisionCallContext';

const CallRoomUser = (props) => {
  const { call_room_member_info, index } = props;
  const memberId = call_room_member_info.member_id;
  
  return (
    <div className="call-room-user-item-container">
      <div className="video">
        {index === 0 ? (
          // 첫 번째 사용자(나 자신) => 로컬 영상
          <video
            id="myLocalVideo"
            autoPlay
            playsInline
            muted   // 로컬 에코 방지
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          // 나머지 사용자 => 리모트 영상
          <video
            id={`remoteVideo-${memberId}`}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
      <div className="member-name">
        {call_room_member_info.nickname}
      </div>
    </div>
  );
};


export default CallRoomUser;