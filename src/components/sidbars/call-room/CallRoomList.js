import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/List.css'
import CallRoomItem from './CallRoomItem';
import VisionCallContext from '../../provider/VisionCallContext';
import FriendAdd from '../../common/FriendAdd';

const CallRoomList = (props) =>{
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");
  const {callRoomList, handleCallRoomListSearch} = useContext(VisionCallContext);

  const handleAddCallRoom = (bool) => {
    axios.post((`${rest_api_url}/api/call-room`),{
    },{
      headers:{
        Authorization: access_token
      }
    })
    .then(res=>{
      console.log(res.data.body);
      handleCallRoomListSearch('')
    }).catch(err=>{
      console.log(err);
    })
  }


  
  return (
    <>
      <div className="list-container">
          <input className='list-search-button' type='button' onClick={handleAddCallRoom} value='통화방 생성'/>
          <div className='list-item-container'>
            {
              callRoomList.map((item,index)=>(
                <CallRoomItem key={index} call_room_info={item}/>
              ))
            }
          </div>
      </div>
    </>
  );
}

export default CallRoomList;