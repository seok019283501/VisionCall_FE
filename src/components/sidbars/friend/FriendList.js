import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/FriendList.css'
import FriendItem from './FriendItem';
import VisionCallContext from '../../provider/VisionCallContext';
import FriendAdd from '../../common/FriendAdd';

const FriendList = (props) =>{

  const {friendList} = useContext(VisionCallContext);

  const [friendAddVisible, setFriendAddVisible] = useState(false);

  const handleFriendAddVisible = (bool) => {
    setFriendAddVisible(bool);
  }

  return (
    <>
      <div className="freind-list-container">
          {friendAddVisible ? <FriendAdd handleFriendAddVisible={handleFriendAddVisible}/> : null}
          <input className='freind-list-search-button' type='button' onClick={()=>{handleFriendAddVisible(true)}} value='친구 추가'/>
          <div className='freind-list-item-container'>
            {
              friendList.map((item,index)=>(
                <FriendItem key={index} friend_info={item}/>
              ))
            }
          </div>
      </div>
    </>
  );
}

export default FriendList;