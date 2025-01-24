import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById('root'));
const rest_api_url = process.env.REACT_APP_REST_API_URL;
axios.interceptors.response.use(
    (res)=>{
  
      return res;
  
    },
    async (err)=>{
      
      const refresh_token = localStorage.getItem("refresh_token");
      console.log(refresh_token)
      if(err.response.status===401){
        await axios.post(`${rest_api_url}/api/auth/reissue-token` ,{},{
          headers: {
            Authorization: `${refresh_token}`
        }}).then(async(res)=>{
            console.log(res);
            localStorage.setItem("access_token",res.data.body.access_token);
        }).catch((err)=>{
          console.log(err);
          window.location.replace('/sign-in');
  
        });
        const access_token = localStorage.getItem("access_token");
  
        err.config.headers = {
          'Content-Type': 'application/json',
          Authorization: `${access_token}`,
        };
  
        // 중단된 요청을(에러난 요청)을 토큰 갱신 후 재요청
        const response = await axios.request(err.config);
        return response;
      }
      return Promise.reject(err);
    }
  )
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
