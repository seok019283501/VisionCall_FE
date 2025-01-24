import '../../styles/FriendAdd.css'
const FriendAdd = (props) => {
  const {handleFriendAddVisible} = props

  return(
    <>
      <div className="friend-add-container">
        <div className="friend-add-title">친구 추가</div>
        <div className="friend-add-input-button-container">
          <div className='friend-add-input-container'>
            <input className='friend-add-input' type='text' placeholder='이메일을 적어주세요.'/>
          </div>
          <div className='friend-add-button-container'>
            <input className='add-button' type='button' value='추가'/>
            <input className='close-button' type='button' value='닫힘' onClick={()=>{handleFriendAddVisible(false)}}/>
          </div>
        </div>
      </div>
    </>
  )
}
export default FriendAdd;