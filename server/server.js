//server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const UserData = require('./models/UserData');
const { ObjectId } = require('mongodb');
const session = require('express-session');
const passport = require('./config/passport/googleStrategy'); // Import Passport configuration


const cors = require('cors');



mongoose.connect('mongodb://localhost:27017/calendarApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

const app = express();
const PORT = 4000;

app.use(cors({
    origin: 'http://localhost:5173', // React 개발 서버 주소
    credentials: true
  }));



app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 요청 처리
app.use(express.static(path.join(__dirname, '../client', 'dist')));


//session 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24시간
    }
  })
);


  // Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());





// Google OAuth login
app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ] // Request profile and email info
    })
  );
  
  // Google OAuth callback
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // Successful login
      res.redirect('/dashboard');
    }
  );
  
  // Dashboard route 수정
  app.get('/api/dashboard', isLoggedIn, (req, res) => {
    res.json({
      googleId: req.user.googleId,
      displayName: req.user.displayName,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      photo: req.user.photo,
      events: req.user.events
    });
  });
  
  // Logout route
  app.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) return next(err);
      res.redirect('/');
    });
  });
  
  // Middleware to check if user is logged in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }



  ////여기까지 passport




// 이벤트 저장
app.post('/api/events', async (req, res) => {
    const { id, title, start, end, color, allDay, category } = req.body;
    try {
        const newEvent = new UserData({ id, title, allDay, start, end, color, category });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: 'Event could not be saved.' });
    }
});

// 이벤트 가져오기
app.get('/api/events', async (req, res) => {
    try {
        const events = await UserData.find({});
        console.log(events)
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ error: 'Events could not be retrieved.' });
    }
});




// 이벤트 삭제
app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await UserData.findOneAndDelete({ _id: new ObjectId(id) }); // Use _id and convert to ObjectId
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(400).json({ error: 'Event could not be deleted.' });
    }
});

// 이벤트 수정
app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const updatedEvent = await UserData.findOneAndUpdate(
            { _id: new ObjectId(id) },  // Use _id and convert to ObjectId
            updatedData,
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' }); // Ensure a valid response
          }
          res.status(200).json(updatedEvent); // Valid JSON response
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ error: 'Event could not be updated.' });
    }
});

//이거는 리액트 페이지 부르는거
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.
click here http://localhost:${PORT}/`);
});
