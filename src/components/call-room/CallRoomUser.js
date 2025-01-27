import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/CallRoomUser.css'
import VisionCallContext from '../provider/VisionCallContext';

const CallRoomUser = (props) =>{
  const {call_room_member_info, key} = props;
  return (
    <>
      <div className="call-room-user-item-container">
        <div className='video'>

        </div>
        <div className='member-name'>
          {call_room_member_info.nickname}
        </div>
      </div>
    </>
  );
}

export default CallRoomUser;