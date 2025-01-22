import { useEffect, useState, useContext, useCallback } from 'react';
import axios from "axios";
import '../../styles/SignIn.css'

const SignIn = (props) =>{

  

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
            <input className='sign-in-input' type='text' placeholder='아이디를 입력해주세요.'/>
            <input className='sign-in-input' type='password' placeholder='비밀번호를 입력해주세요.'/>
            <input className='sign-in-up-button' type='button' value='로그인'/>
          </div>

          <div className='sign-in-url'>
            <div className='sign-in-url-password'>비밀번호 찾기</div>
            <div>/</div>
            <div className='sign-in-url-sign-up'>회원가입</div>
        </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;