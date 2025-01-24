import { useState } from 'react'
import axios from "axios";
import '../../styles/FriendAdd.css'
const FriendAdd = (props) => {
  const {handleFriendAddVisible} = props
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");

  const [email,setEmail] = useState('');

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleFriendAdd = () =>{
    axios.post((`${rest_api_url}/api/friend`),{
      to_member_id:email
    },{
      headers:{
        Authorization: access_token
      }
    })
    .then(res=>{
      handleFriendAddVisible(false)
      console.log(res.data.body);
    }).catch(err=>{
      console.log(err);
    })
  };

  return(
    <>
      <div className="friend-add-container">
        <div className="friend-add-title">친구 추가</div>
        <div className="friend-add-input-button-container">
          <div className='friend-add-input-container'>
            <input className='friend-add-input' type='text' onChange={handleEmail} placeholder='이메일을 적어주세요.'/>
          </div>
          <div className='friend-add-button-container'>
            <input className='add-button' type='button' value='추가' onClick={handleFriendAdd}/>
            <input className='close-button' type='button' value='닫힘' onClick={()=>{handleFriendAddVisible(false)}}/>
          </div>
        </div>
      </div>
    </>
  )
}
export default FriendAdd;