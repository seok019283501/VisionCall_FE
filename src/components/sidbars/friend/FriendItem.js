import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/FriendItem.css'

const FriendItem = (props) =>{
  

  

  return (
    <>
      <div className="freind-item-container">
        <div className='freind-item-sub-container'>
          <div className='friend-item-on-off-line'/>
            <div className='friend-item-nickname-container'>
              <div className='friend-item-nickname'>
                홍길동
              </div>
            </div>
        </div>
         
      </div>
    </>
  );
}

export default FriendItem;