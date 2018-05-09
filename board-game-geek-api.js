const https = require('https');
const async = require('async');
const xml2js = require('xml2js');

const gameIdPattern = /https:\/\/boardgamegeek\.com\/boardgame\/(\d*)/i;

function getGameId(url) {
  const matches = url.match(gameIdPattern);
  return matches == null ? null : matches[1];
}

function requestGameData(gameId, cb) {
  const dataUrl = `https://www.boardgamegeek.com/xmlapi/boardgame/${gameId}?stats=1`;

  https.get(dataUrl, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (data) => { body += data; });
    res.on('end', () => { cb(null, body); });
  }).on('error', cb);
}

function parseGameDataResponse(xml, cb) {
  xml2js.parseString(xml, (err, result) => {
    if (err) return cb(err);

    const game = result.boardgames.boardgame[0];
    const statistics = game.statistics[0].ratings[0];

    return cb(null, {
      name: game.name.find(x => x.$.primary === 'true')._,
      year: game.yearpublished[0],
      age: game.age[0],

      minPlayers: game.minplayers[0],
      maxPlayers: game.maxplayers[0],

      minTime: game.minplaytime[0],
      maxTime: game.maxplaytime[0],

      domains: (game.boardgamesubdomain || []).map(m => m._),
      categories: (game.boardgamecategory || []).map(m => m._),
      mechanics: (game.boardgamemechanic || []).map(m => m._),

      rating: statistics.average[0],
      ratingCount: statistics.usersrated[0],
      rank: statistics.ranks[0].rank.map(r => r.$).find(r => r.name === 'boardgame').value,
    });
  });
}

function getGameData(gameId, cb) {
  async.waterfall([
    asyncCb             => requestGameData(gameId, asyncCb),
    (gameData, asyncCb) => parseGameDataResponse(gameData, asyncCb),
  ], cb);
}

module.exports = { getGameId, getGameData };
