import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/Item.css'
import { useNavigate } from 'react-router-dom';
import VisionCallContext from '../../provider/VisionCallContext';

const CallRoomItem = (props) =>{
  const {callRoomList, handleCallRoomListSearch} = useContext(VisionCallContext);
  const {key,call_room_info} = props;
  const navigator = useNavigate();
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const access_token = localStorage.getItem("access_token");

  const [modify,setModify] = useState(false);
  const [callRoomName, setCallRoomName] = useState('');

  useEffect(()=>{
    handleCallRoomName(call_room_info.room_name)
  },[])

  const handleCallRoomName = (name) =>{
    setCallRoomName(name)
    handleCallRoomListSearch('');
  }

  const handleCallRoomModify = () =>{
    axios.patch((`${rest_api_url}/api/call-room`),{
      "call_room_id": call_room_info.call_room_id,
      "room_name": callRoomName
    },{
      headers:{
        Authorization: access_token
      }
    })
    .then(res=>{
      handleCallRoomListSearch('');
      setModify(false);
    }).catch(err=>{
      console.log(err);
    })
  }
  
  return (
    <>
      <div className="item-container" onClick={()=>navigator(`/call-room/${call_room_info.call_room_id}`)} key={key}>
        <div className='item-sub-container'>
            <div className='item-nickname-container'>
              {
                modify ? 
                <>
                  <input type='text' className='nickname-input' value={callRoomName} onChange={(e)=>{handleCallRoomName(e.target.value)}}/>
                  <input type='button' value='확인' className='modify-button'onClick={handleCallRoomModify}/>
                </>
                :
                <>
                  <div className='item-nickname'>
                    {call_room_info.room_name}
                  </div>
                  <input type='button' value='수정' className='modify-button'onClick={()=>setModify(true)}/>
                </>
              
              }

              
            </div>
        </div>
         
      </div>
    </>
  );
}

export default CallRoomItem;