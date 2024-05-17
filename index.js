const express = require('express');
const calendarRouter = require('./src/routes/calendar');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use('/', calendarRouter);

app.listen(3000, () => {
  console.log('Server running on: http://localhost:3000');
});