import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/FriendList.css'
import FriendItem from './FriendItem';
import VisionCallContext from '../../provider/VisionCallContext';

const FriendList = (props) =>{

  const {friendList} = useContext(VisionCallContext);

  return (
    <>
      <div className="freind-list-container">
          <input className='freind-list-search-button' type='button' value='친구 추가'/>
          <div className='freind-list-item-container'>
            {
              friendList.map((item,index)=>(
                <FriendItem key={index} friend_info={item}/>
              ))
            }
          </div>
      </div>
    </>
  );
}

export default FriendList;