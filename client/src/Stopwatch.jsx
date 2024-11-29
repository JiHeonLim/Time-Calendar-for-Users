//Stopwatch.jsx
import React, { useState, useEffect, useRef } from 'react';

const Stopwatch = ({ setEvents, events, saveEvent }) => { 
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [startTime, setStartTime] = useState(0);
  const requestRef = useRef(null); // requestAnimationFrame ID 저장용
  const previousTimeRef = useRef(null); // 이전의 타임스탬프 저장용
  const [category, setCategory] = useState("select-category"); // New state for category


  const formatTime = (time) => {
    const totalSeconds = Math.floor(time / 1000); 
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const runningTime = formatTime(elapsedTime);

  const updateElapsedTime = (time) => {
    if (previousTimeRef.current != null) {
      const deltaTime = time - previousTimeRef.current; 
      setElapsedTime((prevElapsedTime) => prevElapsedTime + deltaTime); 
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updateElapsedTime);
  };

  const handleStart = () => {
    if (!isRunning) {
      setElapsedTime(0);
      setStartTime(Date.now()); 
      setIsRunning(true);
      requestRef.current = requestAnimationFrame(updateElapsedTime);
    }
  };

  const getColorByCategory = (category) => {
    switch (category) {
      case 'self-development':
        return '#FF8C0A';
      case 'exercise':
        return '#CD0000';
      case 'relationship':
        return '#1478CD';
      case 'work':
        return '#00008C	';
      case 'hobby':
        return '#8d508d';
      case 'waste':
        return 'gray';
      default:
        return '#ffffff'; // Default color
    }
  };


  const handleStop = () => {
    if (isRunning) {
        setIsRunning(false);
        const endTime = Date.now();
        const title = prompt('title을 입력하세요.') || '임시';
        cancelAnimationFrame(requestRef.current); // 타이머 정지
        const newEvent = {
          // id: createEventId(), 
          title, 
          start: new Date(startTime).toLocaleString('sv-SE').split('.')[0],
          end: new Date(endTime).toLocaleString('sv-SE').split('.')[0],
          allDay: false,
          category: category, // Set selected category
          color: getColorByCategory(category), // Set color based on category
        };
        // setEvents([...events, newEvent]); 
        saveEvent(newEvent);
        setElapsedTime(0); 
        previousTimeRef.current = null
      }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <>
      <div>
      <label htmlFor="category" className='mr-2'>Category:</label>
        <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="select-category">Select Category</option>
          <option value="self-development">Self-Development</option>
          <option value="exercise">Exercise</option>
          <option value="relationship">Relationship</option>
          <option value="hobby">Hobby</option>
          <option value="work">Work (Business)</option>
          <option value="waste">Waste</option>
        </select> 
        <div><span className='font-bold'>진행 시간: {runningTime}</span>
          <br />
          <button className={`m-1 p-1 w-14 rounded ${category === "select-category" || isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-lime-600 hover:bg-lime-800"} focus:outline-none focus:ring text-white font-bold`} disabled={category === "select-category"} 
         onClick={handleStart}>시작</button>
          <button className={`p-1 w-14 rounded ${category === "select-category" || (!isRunning) ? "bg-gray-400 cursor-not-allowed" : "bg-lime-600 hover:bg-lime-800"} focus:outline-none focus:ring text-white font-bold`} disabled={category === "select-category" || (!isRunning)} onClick={handleStop}>그만</button>
        </div>
      </div>
    </>
  );
};

export default Stopwatch;