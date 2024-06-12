const express = require('express');
const calendarRouter = require('./src/routes/calendar');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3002;

app.use(bodyParser.json());
app.use('/', calendarRouter);

app.listen(PORT, () => {
  console.log('Server running on port '+ PORT);
});