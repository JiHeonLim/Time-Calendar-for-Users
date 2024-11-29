import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    fetch('/api/dashboard', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(async response => {
      if (!response.ok) {
        throw new Error('인증되지 않은 사용자')}
        const data = await response.json();
        console.log(data)

        if (data) {
        navigate('/dashboard'); // 인증된 사용자는 대시보드로 리다이렉트
      }
    })
    .catch(err => {
      console.error('인증 확인 실패:', err);
    });
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  return (
    <div className="login-container">
      <button onClick={handleGoogleLogin} className="p-1 m-1 font-thin rounded-md px-4 py-2 shadow-md hover:shadow-xl hover:bg-blue-500/50 " >
        Google로 로그인
      </button>
    </div>)
};

export default Login;