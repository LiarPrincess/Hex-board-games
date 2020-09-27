const fs = require('fs').promises;

const api = require('./board-game-geek-api');
const cache = require('./cache');
const parser = require('./response-parser');

(async () => {
  try {
    const inputFilePath = './input.txt';
    const inputFileContent = await fs.readFile(inputFilePath, 'utf8');

    for (const gameUrl of inputFileContent.split('\n')) {
      const gameId = api.getGameId(gameUrl);

      if (gameId == null) {
        console.log(gameUrl);
        continue;
      }

      let gameData = await cache.get(gameId);
      if (!gameData) {
        gameData = await api.getGameData(gameId);
        cache.put(gameId, gameData);
      }

      const game = await parser.parse(gameData);
      const domains = game.domains.join(', ');
      const categories = game.categories.join(', ');
      const mechanics = game.mechanics.join(', ');
      const baseGames = game.baseGames.join(', ');

      console.log(`${game.name}\t${baseGames}\t${game.year}\t${game.age}\t${game.minPlayers}\t${game.maxPlayers}\t${game.minTime}\t${game.maxTime}\t${game.rank}\t${game.rating}\t${game.ratingCount}\t${domains}\t${categories}\t${mechanics}\t${gameUrl}`);
    }
  } catch (e) {
    console.error(e.stack);
    process.exitCode = 1;
  }
})();
