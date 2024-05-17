// 2 OPCOES DE DATAS MAIS PROXIMO DA DATA ATUAL
// REAGENDAR: RETIRAR O EVENTO DA DATA ATUAL E ADICIONAR EM OUTRA DATA
// CANCELAR: RETIRAR O EVENTO DA DATA ATUAL
// ADICIONAR EVENTO: ADICIONAR EVENTO EM UMA DATA
const { google } = require('googleapis');
const { parse } = require('date-fns');

const serviceAccount = require('../credentials/credentials.json');

const auth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar']
});

class CalendarController {
  async listEvents(req, res) {
    auth.authorize((err) => {
      if (err) {
        console.error('Erro na autenticação:', err);
        return res.status(500).send('Erro na autenticação');
      }
      const calendar = google.calendar({ version: 'v3', auth });
      calendar.events.list(
        {
          calendarId: 'clinicadentalsante@gmail.com',
          timeMin: new Date().toISOString(),
          maxResults: 50,
          singleEvents: true,
          orderBy: 'startTime',
        },
        (err, result) => {
          if (err) {
            console.error('Erro ao listar eventos do calendário:', err);
            return res.status(500).send('Erro ao listar eventos do calendário');
          }
          const events = result.data.items;
          if (events.length) {
            console.log('\nEventos encontrados:');
            events.map((event, i) => {
              const start = new Date(event.start.dateTime) || new Date(event.start.date);
              console.log(`${start} - ${event.summary}`);
              // Calculo para pegar a duracao do evento
              const startDate = new Date(event.start.dateTime);
              const endDate = new Date(event.end.dateTime);
              let duration = (endDate - startDate) / 60000;
              if (duration >= 60) {
                duration = `${Math.floor(duration / 60)}h${duration % 60}m`;
              }
              console.log(`Duração: ${duration} minutos\n`);
            });
            res.json(events);
          } else {
            res.json({ message: 'Nenhum evento encontrado.' });
          }
        }
      );
    });
  };

  async addEvent(req, res) {
    console.log('Adicionando evento...');
    console.log(req.body);
    const { summary, description, start } = req.body;
    const startDateTime = parse(start, 'dd/MM/yyyy HH:mm', new Date());
    let endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    auth.authorize((err) => {
      if (err) {
        console.error('Erro na autenticação:', err);
        return res.status(500).send('Erro na autenticação');
      }
      const calendar = google.calendar({ version: 'v3', auth });
      calendar.events.insert(
        {
          calendarId: 'clinicadentalsante@gmail.com',
          resource: {
            summary,
            description,
            start: {
              dateTime: startDateTime.toISOString(),
            },
            end: {
              dateTime: endDateTime.toISOString(),
            },
          },
        },
        (err, result) => {
          if (err) {
            console.error('Erro ao adicionar evento:', err);
            return res.status(500).send('Erro ao adicionar evento');
          }
          console.log('Evento adicionado:', result.data.htmlLink);
          res.json(result.data);
        });
    });
  };

  async updateEvent(req, res) {
    console.log('Atualizando evento...');
    console.log(req.body);
    const { summary, description, start } = req.body;
    const { eventId } = req.params;
    const startDateTime = parse(start, 'dd/MM/yyyy HH:mm', new Date());
    let endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    auth.authorize((err) => {
      if (err) {
        console.error('Erro na autenticação:', err);
        return res.status(500).send('Erro na autenticação');
      }
      const calendar = google.calendar({ version: 'v3', auth });
      calendar.events.update(
        {
          calendarId: 'clinicadentalsante@gmail.com',
          eventId,
          resource: {
            summary,
            description,
            start: {
              dateTime: startDateTime.toISOString(),
            },
            end: {
              dateTime: endDateTime.toISOString(),
            },
          },
        },
        (err, result) => {
          if (err) {
            console.error('Erro ao atualizar evento:', err);
            return res.status(500).send('Erro ao atualizar evento');
          }
          console.log('Evento atualizado:', result.data.htmlLink);
          res.json(result.data);
        });
    });
  }

  async deleteEvent(req, res) {
    console.log('Deletando evento...');
    const { eventId } = req.params;

    auth.authorize((err) => {
      if (err) {
        console.error('Erro na autenticação:', err);
        return res.status(500).send('Erro na autenticação');
      }
      const calendar = google.calendar({ version: 'v3', auth });
      calendar.events.delete(
        {
          calendarId: 'clinicadentalsante@gmail.com',
          eventId,
        },
        (err, result) => {
          if (err) {
            console.error('Erro ao deletar evento:', err);
            return res.status(500).send('Erro ao deletar evento');
          }
          console.log('Evento deletado com sucesso.');
          res.json(result.data);
        });
    });
  }
};

module.exports = new CalendarController();