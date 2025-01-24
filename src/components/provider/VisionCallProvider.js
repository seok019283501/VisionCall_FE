import {  useRef, useState } from "react";
import VisionCallContext from "./VisionCallContext";
import axios from "axios";
const VisionCallProvider = (props) =>{
  const rest_api_url = process.env.REACT_APP_REST_API_URL;

  //친구 목록
  const [friendList, setFriendList] = useState([]);

  //친구 목록 조회
  const handleFriendListSearch = (nickname) => {
    const access_token = localStorage.getItem("access_token");

    axios.get((`${rest_api_url}/api/friend?nickname=${nickname}`),{
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

  return (
    <VisionCallContext.Provider value={{friendList, handleFriendListSearch}}>
        {props.children}
    </VisionCallContext.Provider>
  );
};

export default VisionCallProvider;