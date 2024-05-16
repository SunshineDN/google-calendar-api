require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const app = express();
const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

app.get('/', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly']
  });
  console.log('URL:', url);
  console.log('OAuth2Client:', oauth2Client);
  res.redirect(url);
});

app.get('/redirect', (req, res) => {
  const code = req.query.code;
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error retrieving access token', err);
      return res.send('Error retrieving access token');
    }
    oauth2Client.setCredentials(token);
    res.send('Token retrieved successfully');
  });
});

app.get('/calendar', (req, res) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  calendar.calendarList.list({}, (err, calendarList) => {
    if (err) {
      console.error('Error fetching calendar list', err);
      return res.send('Error fetching calendar list');
    }
    const calendars = calendarList.data.items;
    res.json(calendars);
  });
});

app.get('/events', (req, res) => {
  const calendarId = req.query.calendarId ?? 'primary';
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  calendar.events.list({
    calendarId,
    timeMin: (new Date()).toISOString(),
    maxResults: 15,
    singleEvents: true,
    orderBy: 'startTime'
  }, (err, events) => {
    if (err) {
      console.error('Error fetching events', err);
      return res.send('Error fetching events');
    }
    const eventsList = events.data.items;
    res.json(eventsList);
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});