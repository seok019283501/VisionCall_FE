import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/CallRoom.css'
import VisionCallContext from '../provider/VisionCallContext';
import CallRoomUser from './CallRoomUser';
import CallRoomChat from './CallRoomChat';
import { useParams } from 'react-router-dom';

const CallRoom = (props) =>{
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");
  const [visible, setVisible] = useState(false);
  const {handleRoomNumber, handleRoomMemberList, roomMember} = useContext(VisionCallContext);
  const { room_number } = useParams();

  const handleVisible = (bool) =>{
    setVisible(bool)
  }

  useEffect(()=>{
    handleRoomMemberList(room_number);
  },[room_number])


  
  return (
    <>
      <div className="call-room-container">
          <div className='call-room-user-container'>
          {
              roomMember.map((item,index)=>(
                <CallRoomUser key={index} call_room_member_info={item}/>
              ))
            }
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