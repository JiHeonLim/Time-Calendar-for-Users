//App.jsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Stopwatch from './Stopwatch';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';



export default function App() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [slotMinTime, setSlotMinTime] = useState('00:00:00');
  const [slotMaxTime, setSlotMaxTime] = useState('24:00:00');
  const [events, setEvents] = useState([]);
  const [action, setAction] = useState('delete');


  


  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }




  // 서버에서 이벤트를 불러오는 함수
  const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };


  useEffect(() => {
    fetchEvents();
  }, []);

  // 새로운 이벤트를 서버에 저장하는 함수
  const saveEvent = async (newEvent, userEmail) => {
    try {
      const response = await axios.post('/api/events', newEvent);
      setEvents([...events, response.data]);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  // 이벤트를 삭제하는 함수
  const handleEventClick = async (clickInfo) => {
    const eventId = clickInfo.event.extendedProps._id; // Access `_id` directly from event's extended properties

    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        try {
          await axios.delete(`/api/events/${eventId}`);
          clickInfo.event.remove();
          setEvents(events.filter(event => event._id !== eventId));
        } catch (error) {
          console.error("Error deleting event:", error);
        }
      }
    } else if (action === 'edit') {
      const newTitle = prompt(`Enter a new title for '${clickInfo.event.title}'`);
      if (newTitle) {
        try {
          const updatedEvent = {
            ...events.find(event => event._id.toString() === eventId.toString()),
            title: newTitle
          };

          await axios.put(`/api/events/${eventId}`, updatedEvent);
          clickInfo.event.setProp('title', newTitle);
          setEvents(events.map(event => 
            event._id.toString() === eventId.toString() ? updatedEvent : event
        ));
        } catch (error) {
          console.error("Error updating event:", error);
        }
      }
    }
  };
  
  // 새로운 이벤트 생성
  function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event');
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent = {
        // id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        color: '#429F6B'
      };

      saveEvent(newEvent);
    }
  }


  function handleEvents(events) {
    setCurrentEvents(events);
  }

  return (
    <div className='app'>
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
        slotMinTime={slotMinTime}
        setSlotMinTime={setSlotMinTime}
        slotMaxTime={slotMaxTime}
        setSlotMaxTime={setSlotMaxTime}
        setEvents={setEvents}
        events={events}
        action={action}
        setAction={setAction}
        saveEvent={saveEvent} // 새로운 상태 전달
      />
      <div className='app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView='timeGridWeek'
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          slotMinTime={slotMinTime}
          slotMaxTime={slotMaxTime}
          weekends={weekendsVisible}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          height={"100%"}
          contentHeight={"50%"}
        />
      </div>
    </div>
  );
}

function Sidebar({
  weekendsVisible,
  handleWeekendsToggle,
  currentEvents,
  slotMinTime,
  setSlotMinTime,
  slotMaxTime,
  setSlotMaxTime,
  setEvents,
  events,
  action,
  setAction,
  saveEvent,
   // 새로운 상태 받기
}) {
  return (
    <div className='app-sidebar'>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
      <div className='app-sidebar-section'>
        <Stopwatch setEvents={setEvents} events={events} saveEvent={saveEvent} />
        </div>


      <div className='app-sidebar-section'>
        <h3>Edit Select</h3>
        <div className='flex items-center'>
        <input id='delete'
            type='radio'
            value='delete'
            checked={action === 'delete'}
            onChange={() => setAction('delete')} 
            className='peer/delete'
          />
        <label htmlFor='delete' className="cursor-pointer peer-checked/delete:text-lime-600">Delete Event
        </label>
        </div>
        <div className='flex items-center'>
        <input
            id='edit'
            type='radio'
            value='edit'
            checked={action === 'edit'}
            onChange={() => setAction('edit')}
            className='peer/edit'
          />
        <label htmlFor='edit' className="cursor-pointer peer-checked/edit:text-lime-600">
          Edit Title
        </label>
        </div>
      </div>
      <div className='app-sidebar-section'>
        <label className='flex'>
          <input
            type='checkbox'
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
            className='accent-lime-400 m-1'
          ></input>
          주말 활성화
        </label>
      </div>
      <div className='app-sidebar-section'>
        <label>
          <select value={slotMinTime} onChange={(e) => setSlotMinTime(e.target.value)}>
            <option value="00:00:00">00:00</option>
            <option value="04:00:00">04:00</option>
            <option value="05:00:00">05:00</option>
            <option value="06:00:00">06:00</option>
            <option value="07:00:00">07:00</option>
            <option value="08:00:00">08:00</option>
            <option value="09:00:00">09:00</option>
          </select>
          시 부터
        </label>
        <label>
          <select value={slotMaxTime} onChange={(e) => setSlotMaxTime(e.target.value)}>
            <option value="24:00:00">24:00</option>
            <option value="23:00:00">23:00</option>
            <option value="22:00:00">22:00</option>
          </select>
          시 까지 볼래요
        </label>
      </div>
      <div className='app-sidebar-section hidden'>
        <h2>사이드바</h2>
        <ul>
          <li>간단한 설명1</li>
          <li>간단한 설명2</li>
        </ul>
      </div>
    </div>
  );
}
