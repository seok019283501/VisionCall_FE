import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/Sidebar.css'
import FriendList from './friend/FriendList';
import VisionCallContext from '../provider/VisionCallContext';

const Sidebar = (props) =>{
  const {handleFriendListSearch} = useContext(VisionCallContext);
  
  useEffect(()=>{
    handleFriendListSearch("");
  },[])

  const handleSearch = (e) =>{
    handleFriendListSearch(e.target.value);
  }

  return (
    <>
      <div className="sidebar-container">
        <div className='sidebar-input-continaer'>
          <div className='sidebar-search-container'>
            <input className='sidebar-search' type='text' onChange={handleSearch} placeholder='검색'/>
          </div>
          <div className='sidebar-button-container'>
            <input className='sidebar-button' type='button' value='방 목록'/>
            <input className='sidebar-button' type='button' value='친구 목록'/>
          </div>
          <div className='sidebar-item-list-container'>
            <FriendList/>
          </div>
          <input className='sidebar-setting-button' type='button' value='설정'/>
        </div>
      </div>
    </>
  );
}

export default Sidebar;