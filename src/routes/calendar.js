const express = require('express');
const calendarController = require('../controller/calendarController');

const calendarRouter = express.Router();

calendarRouter.get('/list', calendarController.listEvents);

calendarRouter.post('/add', calendarController.addEvent);

calendarRouter.patch('/update/:eventId', calendarController.updateEvent);

calendarRouter.delete('/delete/:eventId', calendarController.deleteEvent);

module.exports = calendarRouter;