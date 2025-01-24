import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/Sidebar.css'
import FriendList from './friend/FriendList';
import VisionCallContext from '../provider/VisionCallContext';
import CallRoomList from './call-room/CallRoomList';

const Sidebar = (props) =>{
  const {handleFriendListSearch, handleCallRoomListSearch} = useContext(VisionCallContext);

  const [listStatus, setListStatus] = useState(false);
  
  useEffect(()=>{

    handleFriendListSearch("");
    handleCallRoomListSearch("");
  },[])

  const handleSearch = (e) =>{
    if(listStatus){
      handleFriendListSearch(e.target.value);
    }else{
      handleCallRoomListSearch(e.target.value);
    }
  }

  return (
    <>
      <div className="sidebar-container">
        <div className='sidebar-input-continaer'>
          <div className='sidebar-search-container'>
            <input className='sidebar-search' type='text' onChange={handleSearch} placeholder='검색'/>
          </div>
          <div className='sidebar-button-container'>
            <input className='sidebar-button' type='button' onClick={()=>setListStatus(false)} value='방 목록'/>
            <input className='sidebar-button' type='button' onClick={()=>setListStatus(true)} value='친구 목록'/>
          </div>
          <div className='sidebar-item-list-container'>
            {
              listStatus ? <FriendList/> :<CallRoomList/>
            }
            
          </div>
          <input className='sidebar-setting-button' type='button' value='설정'/>
        </div>
      </div>
    </>
  );
}

export default Sidebar;