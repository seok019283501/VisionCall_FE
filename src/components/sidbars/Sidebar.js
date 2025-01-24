import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/Sidebar.css'
import FriendList from './friend/FriendList';

const Sidebar = (props) =>{
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const [signIn,setSignIn] = useState({
    username:'',
    password:''
  })

  // 로그인 실패 시 에러 메시지 상태
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsername = (e) => {
    setSignIn({...signIn,username:e.target.value});
  }

  

  return (
    <>
      <div className="sidebar-container">
        <div className='sidebar-input-continaer'>
          <div className='sidebar-search-container'>
            <input className='sidebar-search' type='text' placeholder='검색'/>
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