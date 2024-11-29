import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/dashboard', {  // 상대 경로 사용
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('인증되지 않은 사용자');
        }
        const data = await response.json();
        console.log(data)
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
        navigate('/'); // 에러 발생시 로그인 페이지로 리다이렉트
 
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/logout', {
        credentials: 'include'
      });
      
      if (response.ok) {
        navigate('/');
      }
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div>
      {user && (
        <div className="login-container">
            <button onClick={handleLogout}
            className="p-1 m-1 font-thin rounded-md px-4 py-2 shadow-md hover:shadow-xl hover:bg-blue-500/50">
            로그아웃
          </button>
          <div className="text-sm">
          <div className=""><img src={user.photo} alt="" />{user.displayName}님 환영합니다!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;