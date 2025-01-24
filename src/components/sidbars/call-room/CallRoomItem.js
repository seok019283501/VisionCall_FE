import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/Item.css'

const CallRoomItem = (props) =>{
  
  const {key,call_room_info} = props;
  

  return (
    <>
      <div className="item-container" key={key}>
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