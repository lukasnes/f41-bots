const express = require("express");
const path = require('path')
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: 'd0945a727369446dafc1f530393cc7ba',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

rollbar.log('Hello world!')


const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
app.use(express.static('public'))

app.get('/', (req,res) => {
  res.status(200).sendFile(path.join(__dirname,'./public/index.html'))
})

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
    rollbar.info('Someone requested all bots')
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
    rollbar.critical('Requesting all bots has failed')
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
    rollbar.info("Let the game begin!")
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
    rollbar.critical("Player cannot begin game!")
  }
});

app.post("/api/duel", (req, res) => {
  try {
    rollbar.log('A duel has started!')
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
      rollbar.log("Player lost the duel")
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
      rollbar.log("Player won the duel")
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
    rollbar.warning("Duel has failed.")
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
    rollbar.info(`The player has ${playerRecord.wins} wins and ${playerRecord.losses} losses`)
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
