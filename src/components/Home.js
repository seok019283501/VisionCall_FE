import {  useEffect, useRef, useState } from "react";
import axios from "axios";
const Home = (props) =>{
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");

  useEffect(()=>{
    handleMemberInfo()
  },[])
  const handleMemberInfo= async () => {
    await axios.get((`${rest_api_url}/api/member`),{
      headers:{
        Authorization: access_token
      }
    }).then(res=>{
      console.log(res.data.body);
      localStorage.setItem("member_id",res.data.body.member_id);
    }).catch(err=>{
      console.log(err);
    })
  }

  return (
  <>
  </>
  );
};

export default Home;