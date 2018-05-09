const fs = require('fs');
const async = require('async');
const api = require('./board-game-geek-api');

function processUrl(url, cb) {
  const gameId = api.getGameId(url);

  if (gameId == null) {
    console.log(url);
    return cb();
  }

  api.getGameData(gameId, (err, d) => {
    if (err) return cb(err);

    const domains = d.domains.join(', ');
    const categories = d.categories.join(', ');
    const mechanics = d.mechanics.join(', ');

    console.log(`${d.name}\t${d.year}\t${d.age}\t${d.minPlayers}\t${d.maxPlayers}\t${d.minTime}\t${d.maxTime}\t${d.rank}\t${d.rating}\t${d.ratingCount}\t${domains}\t${categories}\t${mechanics}`);
    return cb();
  });
}

// const url = 'https://boardgamegeek.com/boardgame/6249/alhambra';
// processUrl(url, (e) => { if (e) console.error(e); });

fs.readFile('./data/input.txt', 'utf8', (err, data) => {
  if (err) return console.log(err);

  const urls = data.split('\n');
  return async.eachSeries(urls, processUrl, (e) => { if (e) console.error(e); });
});
