import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/FriendList.css'
import FriendItem from './FriendItem';

const FriendList = (props) =>{
  

  

  return (
    <>
      <div className="freind-list-container">
          <input className='freind-list-search-button' type='button' value='친구 추가'/>
          <div className='freind-list-item-container'>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
            <FriendItem/>

            <FriendItem/>
            <FriendItem/>
            <FriendItem/>
          </div>
      </div>
    </>
  );
}

export default FriendList;