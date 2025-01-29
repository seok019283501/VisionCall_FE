import {  useRef, useState } from "react";
import VisionCallContext from "./VisionCallContext";
import axios from "axios";
const VisionCallProvider = (props) =>{
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");

  
  const [roomMember, setRoomMember] = useState([]);

  //친구 목록
  const [friendList, setFriendList] = useState([]);

  //방 목록
  const [callRoomList, setCallRoomList] = useState([]);

  const [roomNumber, setRoomNumber] = useState();


  //친구 목록 조회
  const handleFriendListSearch = async (nickname) => {

    await axios.get((`${rest_api_url}/api/friend?nickname=${nickname}`),{
      headers:{
        Authorization: access_token
      }
    }).then(res=>{
      console.log(res.data.body);
      setFriendList(res.data.body.friend_list);
    }).catch(err=>{
      console.log(err);
    })
  }

  //통화방 목록 조회
  const handleCallRoomListSearch = async (search) => {

    await axios.get((`${rest_api_url}/api/call-room?search=${search}`),{
      headers:{
        Authorization: access_token
      }
    }).then(res=>{
      console.log(res.data.body);
      setCallRoomList(res.data.body.call_room_list);
    }).catch(err=>{
      console.log(err);
    })
  }

  //통화방 번호
  const handleRoomNumber = (number) =>{
    setRoomNumber(number)
  }

  const handleRoomMemberList= async (roomNumber) => {
    await axios.get((`${rest_api_url}/api/call-room/member/${roomNumber}`),{
      headers:{
        Authorization: access_token
      }
    }).then(res=>{
      console.log(res.data.body);
      setRoomMember(res.data.body.call_room_member_list);
      handleRoomNumber(roomNumber)
    }).catch(err=>{
      console.log(err);
    })
  }

  return (
    <VisionCallContext.Provider value={{friendList, handleFriendListSearch, callRoomList, handleCallRoomListSearch, roomNumber, handleRoomNumber, roomMember, handleRoomMemberList}}>
        {props.children}
    </VisionCallContext.Provider>
  );
};

export default VisionCallProvider;