import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../../styles/List.css'
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
      <div className="list-container">
          {friendAddVisible ? <FriendAdd handleFriendAddVisible={handleFriendAddVisible}/> : null}
          <input className='list-search-button' type='button' onClick={()=>{handleFriendAddVisible(true)}} value='친구 추가'/>
          <div className='list-item-container'>
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