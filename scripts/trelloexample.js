// Description:
//   A simple testscript demonstrating trello API
//
// Commands:
//   hubot trello status - displays lists in trello and number of cards
//
// See https://developers.trello.com/reference/ for more calls


const fetch = require('node-fetch');

const API_BASE = 'https://api.trello.com/1';

function getJson(response) {
  return response.json();
}

const logError = e => { console.log(e); }

const getCards = (boardId, applicationKey, token) => {
  return fetch(
    `${API_BASE}/boards/${boardId}/cards?key=${applicationKey}&token=${token}`
  )
    .then(getJson)
    .catch(logError);
};

const getLists = (boardId, applicationKey, token) => {
  return fetch(
    `${API_BASE}/boards/${boardId}/lists?key=${applicationKey}&token=${token}`
  )
    .then(getJson)
    .catch(logError);
};

function hubotFunctions(robot) {
  robot.respond(/trello status/, function(res){
    const token = robot.getVariable('TRELLO_TOKEN');
    if (!token) {
      return robot.complainAboutMissingVariable(
        res, 'TRELLO_TOKEN', 'your-trello-token', 'The token can be generated from https://trello.com/app-key');
    }
    const applicationKey = robot.getVariable('TRELLO_APPLICATION_KEY');
    if (!applicationKey) {
      return robot.complainAboutMissingVariable(
        res, 'TRELLO_APPLICATION_KEY', 'your-trello_application_key', 'The key can be found at https://trello.com/app-key')
    }
    const boardId = robot.getVariable('TRELLO_BOARD_ID');
    if (!boardId) {
      return robot.complainAboutMissingVariable(
        res, 'TRELLO_BOARD_ID', 'your-trello_board_id',
        `The board id
         can be found at by adding /reports.json to your shorturl,
         e.g. https://trello.com/b/3XtA4yi2/reports.json`)
    }

    let lists = {};

    getLists(boardId, applicationKey, token).then(json => {
      json.forEach(list => {
        lists[list.id] = list;
      });

      getCards(boardId, applicationKey, token).then(cards => {
        let fields = [];
        Object.keys(lists).forEach(idList => {
          fields.push(
            {
              "title": lists[idList].name,
              "value": cards.filter(card => card.idList === idList && !card.closed).length,
              "short": true
            }
          );
        });
        let total = cards.filter(c => !c.closed).length;
        res.send({
          attachments: [
            {
              "pretext": "Number of tickets on different boards:",
              "title": `Trello ticket count ${total}`,
              "title_link": `https://trello.com/b/${boardId}/dev`,
              "fields": fields
            }
          ]
        });
      });
    });
  });
}

module.exports = hubotFunctions;
