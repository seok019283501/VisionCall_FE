import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/FriendItem.css'

const FriendItem = (props) =>{
  
  const {key,friend_info} = props;
  

  return (
    <>
      <div className="freind-item-container" key={key}>
        <div className='freind-item-sub-container'>
          <div className='friend-item-on-off-line'/>
            <div className='friend-item-nickname-container'>
              <div className='friend-item-nickname'>
                {friend_info.nickname}
              </div>
              {
                friend_info.friend_status === "REQUEST" ?
                  <div>
                    추가 중
                  </div>
                  : null
              }
              
            </div>
        </div>
         
      </div>
    </>
  );
}

export default FriendItem;