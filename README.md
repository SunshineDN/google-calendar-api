# Google Calendar API + Kommo API

## Rotas e Métodos
- GET /list
- POST /add
- PATCH /update/:eventId
- DELETE /delete/:eventId

## Req Body & Params
- /list: none
- /add: {
          "summary": TITULO,
          "description": DESCRIÇÃO,
          "start": DATA E HORA INICIAL
        }
- /update/:eventId: {
                      "summary": TITULO,
                      "description": DESCRIÇÃO,
                      "start": DATA E HORA INICIAL
                    }
- /delete/:eventId: none