const xml2js = require('xml2js');

async function parse(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err)
        return reject(err);

      const game = result.boardgames.boardgame[0];
      const statistics = game.statistics[0].ratings[0];

      return resolve({
        name: game.name.find(x => x.$.primary === 'true')._,
        year: game.yearpublished[0],
        age: game.age[0],

        minPlayers: game.minplayers[0],
        maxPlayers: game.maxplayers[0],

        minTime: game.minplaytime[0],
        maxTime: game.maxplaytime[0],

        baseGames: (game.boardgameexpansion || []).filter(m => m.$.inbound === 'true').map(m => m._),

        domains: (game.boardgamesubdomain || []).map(m => m._),
        categories: (game.boardgamecategory || []).map(m => m._),
        mechanics: (game.boardgamemechanic || []).map(m => m._),

        rating: statistics.average[0],
        ratingCount: statistics.usersrated[0],
        rank: statistics.ranks[0].rank.map(r => r.$).find(r => r.name === 'boardgame').value,
      });
    });
  });
}

module.exports = { parse };
