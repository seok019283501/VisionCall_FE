import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/Item.css'
import { useNavigate } from 'react-router-dom';

const CallRoomItem = (props) =>{
  
  const {key,call_room_info} = props;
  const navigator = useNavigate();

  
  return (
    <>
      <div className="item-container" onClick={()=>navigator(`/call-room/${call_room_info.call_room_id}`)} key={key}>
        <div className='item-sub-container'>
            <div className='item-nickname-container'>
              <div className='item-nickname'>
                {call_room_info.room_name}
              </div>
            </div>
        </div>
         
      </div>
    </>
  );
}

export default CallRoomItem;