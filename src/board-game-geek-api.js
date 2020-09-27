const https = require('https');

const gameIdPattern = /https:\/\/boardgamegeek\.com\/boardgame\/(\d*)/i;
const expansionIdPattern = /https:\/\/boardgamegeek\.com\/boardgameexpansion\/(\d*)/i;

function getGameId(url) {
  const gameMatches = url.match(gameIdPattern);
  if (gameMatches !== null)
    return gameMatches[1];

  const expansionMatches = url.match(expansionIdPattern);
  if (expansionMatches !== null)
    return expansionMatches[1];

  return null;
}

async function getGameData(gameId) {
  const url = `https://www.boardgamegeek.com/xmlapi/boardgame/${gameId}?stats=1`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (data) => { body += data; });
      res.on('end', () => resolve(body));
    }).on('error', (err) => reject(err));
  });
}

module.exports = { getGameId, getGameData };
