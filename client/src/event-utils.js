//event-tuils.js


let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today, replace(pattern, replacement)


export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'Test for All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'test event 2',
    start: todayStr + 'T12:10:00',
    end: todayStr + 'T13:24:30'
  },
]



export function createEventId() {
  return String(eventGuid++)
}

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

{
  _id: ObjectId('672757a9e0c6b3d8b31c14d6'),
  title: '코딩',
  start: '2024-11-03T09:15:00+09:00',
  end: '2024-11-03T11:20:00+09:00',
  allDay: false,
  category: 'self-development',
  color: '#FF8C0A',
  __v: 0
},
{
  _id: ObjectId('672757dde0c6b3d8b31c14dd'),
  title: '운동',
  start: '2024-11-03T13:05:00+09:00',
  end: '2024-11-03T13:55:00+09:00',
  color: '#CD0000',
  allDay: false,
  category: 'exercise',
  __v: 0
},
{
  _id: ObjectId('672757e9e0c6b3d8b31c14df'),
  title: '친구만나기',
  start: '2024-11-03T14:55:00+09:00',
  end: '2024-11-03T17:05:00+09:00',
  color: '#1478CD',
  allDay: false,
  category: 'relationship',
  __v: 0
},
{
  _id: ObjectId('6727580fe0c6b3d8b31c14e1'),
  title: '핸드폰',
  start: '2024-11-03T11:20:00+09:00',
  end: '2024-11-03T12:15:00+09:00',
  color: 'gray',
  allDay: false,
  category: 'waste',
  __v: 0
},
{
  _id: ObjectId('67275825e0c6b3d8b31c14e3'),
  title: '코딩 2',
  start: '2024-11-03T17:15:00+09:00',
  end: '2024-11-03T19:10:00+09:00',
  allDay: false,
  category: 'self-development',
  color: '#FF8C0A',
  __v: 0
}