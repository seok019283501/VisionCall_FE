import { useState } from 'react'
import axios from "axios";
import '../../styles/Add.css'
const CallRoomInvite = (props) => {
  const {handleVisible} = props
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");



  return(
    <>
      <div className="add-container">
        <div className="add-title">멤버 초대</div>
        <div className="add-input-button-container">
          <div className='add-input-container'>
            <input className='add-input' type='text' placeholder='이메일을 적어주세요.'/>
          </div>
          <div className='add-button-container'>
            <input className='add-button' type='button' value='초대'/>
            <input className='close-button' type='button' value='닫힘' onClick={()=>{handleVisible(false)}}/>
          </div>
        </div>
      </div>
    </>
  )
}
export default CallRoomInvite;