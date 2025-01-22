import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/SignIn.css'

const SignIn = (props) =>{
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const [signIn,setSignIn] = useState({
    username:'',
    password:''
  })

  // 로그인 실패 시 에러 메시지 상태
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsername = (e) => {
    setSignIn({...signIn,username:e.target.value});
  }

  const handlePassword = (e) => {
    setSignIn({...signIn,password:e.target.value});
  }

  const handleSignInError = () =>{
    setErrorMessage('아이디 혹은 비밀번호가 틀렸습니다.');
  }

  const handleSignIn = () =>{
    axios.post((`${rest_api_url}/open-api/auth/sign-in`),
      signIn
    ).then(res=>{
      localStorage.setItem("access_token",res.data.body.access_token);
      localStorage.setItem("refresh_token",res.data.body.refresh_token);
    }).catch(err=>{
      handleSignInError();
      console.log(err);
    })
  }

  return (
    <>
      <div className="sign-in-up-container">
        <div className='sign-in-up-in-sub-container'>
          <div className='sign-in-up-sub-title-container'>
            <div className='sign-in-up-sub-title'>
              로그인
            </div>
          </div>

          <div className='sign-in-input-container'>
            <input className='sign-in-input' onChange={handleUsername} value={signIn.username} type='text' placeholder='아이디를 입력해주세요.'/>
            <input className='sign-in-input' onChange={handlePassword} value={signIn.password} type='password' placeholder='비밀번호를 입력해주세요.'/>
            <input className='sign-in-up-button' type='button' onClick={handleSignIn} value='로그인'/>
          </div>

          
          <div className='sign-in-url'>
            <div className='sign-in-url-password'>비밀번호 찾기</div>
            <div>/</div>
            <div className='sign-in-url-sign-up'>회원가입</div>
          </div>
          {errorMessage && (
            <div className="sign-error-message">{errorMessage}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default SignIn;