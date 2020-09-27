Local pub with board games published [list of all of the games they have](https://docs.google.com/spreadsheets/d/1xcsecSVpFqqQvRc6MJ4TRziD9Q9xhd9diuJZuMxsVZM/edit?usp=sharing).

This script will fetch details of each game from `boardgamegeek.com` and add it to this sheet.

# Instructions

1. Usual Node things (`npm i` etc.)
2. Copy column with `boardgamegeek.com` links from Google sheet to `./input.txt`
3. `node ./src/app > ./output.txt`
4. Copy content of `./output.txt` to Google sheet
