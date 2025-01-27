import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/CallRoom.css'
import VisionCallContext from '../provider/VisionCallContext';
import CallRoomUser from './CallRoomUser';
import CallRoomChat from './CallRoomChat';
import CallRoomInvite from '../common/CallRoomInvite';

const CallRoom = (props) =>{
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");
  const [visible, setVisible] = useState(false);
  const {callRoomList, handleCallRoomListSearch} = useContext(VisionCallContext);
  
  const handleVisible = (bool) =>{
    setVisible(bool)
  }

  
  return (
    <>
      <div className="call-room-container">
          {visible ? <CallRoomInvite handleVisible={handleVisible}/> : null}
          <div className='invite-member' onClick={()=>{handleVisible(true)}}>참여자 초대</div>
          <div className='call-room-user-container'>
            <CallRoomUser/>
            <CallRoomUser/>
            <CallRoomUser/>
            <CallRoomUser/>
            <CallRoomUser/>
            <CallRoomUser/>
          </div>
          <div className='call-room-chat-container'>
            <CallRoomChat/>
            <CallRoomChat/>
            <CallRoomChat/>
            <CallRoomChat/>
          </div>
          <div className='call-room-chat-input-container'>
            <input className='chat' type='text'/>
            <input className='chat-send-button' type='button' value='전송'/>
          </div>
      </div>
    </>
  );
}

export default CallRoom;