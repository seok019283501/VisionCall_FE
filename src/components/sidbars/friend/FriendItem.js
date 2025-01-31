import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/Item.css'
import VisionCallContext from '../../provider/VisionCallContext';
import { useLocation } from 'react-router-dom';

const FriendItem = (props) =>{
  
  const {key,friend_info} = props;
  const location = useLocation();
  const {roomNumber, handleRoomMemberList, handleFriendListSearch} = useContext(VisionCallContext);
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");

  const hanleInvite = async() =>{
    console.log(roomNumber)
    axios.post((`${rest_api_url}/api/call-room/member/invite`),{
      call_room_id: Number(roomNumber),
      member_id: Number(friend_info.member_id)
    },{
      headers:{
        Authorization: access_token
      }
    })
    .then(res=>{
      console.log(res.data.body);
      handleFriendListSearch('');
    }).catch(err=>{
      console.log(err);
    })
  }

  const handleDelete = () =>{
    console.log(friend_info.friend_id)
    axios.delete((`${rest_api_url}/api/friend/${friend_info.friend_id}`),{
      headers:{
        Authorization: access_token
      }
    })
    .then(res=>{
      handleFriendListSearch('');
    }).catch(err=>{
      console.log(err);
    })
  }

  const handleAccpt = () =>{
    axios.patch((`${rest_api_url}/api/friend/accept`),{
      "friend_id": friend_info.friend_id
    },{
      headers:{
        Authorization: access_token
      }
    })
    .then(res=>{
      handleFriendListSearch('');
    }).catch(err=>{
      console.log(err);
    })
  }

  return (
    <>
      <div className="item-container" key={key}>
        <div className='item-sub-container'>
          <div className='item-on-off-line'/>
            <div className='item-nickname-container'>
              <div className='item-nickname'>
                {friend_info.nickname}
              </div>
              {
                friend_info.friend_status === "REQUEST" ?
                  <div>
                    추가 중
                  </div>
                  : location.pathname.includes('/call-room/') ? 
                  <input className='invite' type='button' onClick={hanleInvite} value='초대'/>
                  :null
              }
              <input type='button' className='friend-delete-button' value='삭제' onClick={handleDelete}/>
              {
                friend_info.request && friend_info.friend_status === "REQUEST" ?
                <input type='button' value='수락' className='modify-button'onClick={handleAccpt}/>
                :null
              }
              
            </div>
        </div>
         
      </div>
    </>
  );
}

export default FriendItem;