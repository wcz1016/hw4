/* eslint-disable import/no-extraneous-dependencies *//* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-console */
// Create express app
const express = require('express');

const webapp = express();
const cors = require('cors');
const profiles = require('./profiles');

webapp.use(cors());
webapp.use(express.json());
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);

const lib = require('./dbOperationsMongo');

let db;

// Start server
const port = process.env.PORT || 5000;
const server = webapp.listen(port, async () => {
  db = await lib.connect(profiles.url1);
  // console.log(`Server running on port:${port}`);
});

// Root endpoint
// TODO: Will need to alter this for deployment
webapp.get('/', (_req, res) => {
  res.json({ message: 'Welcome to HW4 Backend' });
});

// TODO: define all endpoints as specified in REST API
webapp.post('/player', async (req, res) => {
  try {
    console.log('Create a new player');
    // check the required params
    if (req.body.name === undefined) {
      // console.log('req body missing params');
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }

    // check the exist name
    const existName = await lib.getPlayerByName(db, req.body.name);
    if (existName) {
      // console.log(`Player with name ${req.body.name}  already exists!`);
      res.status(409).json({ error: 'name already exists!' });
      return;
    }
    // create a new player
    const newPlayerInfo = {
      name: req.body.name,
      points: req.body.points,
      maxpoints: req.body.maxpoints,
    };
    const newPlayer = await lib.addPlayer(db, newPlayerInfo);
    res.status(201).json({ data: newPlayer });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// get all users
webapp.get('/players', async (_req, res) => {
  try {
    const players = await lib.getPlayers(db);
    res.status(200).json({ data: players });
  } catch (err) {
    res.status(400).json({ error: 'bad url' });
  }
});

// get player by Id
webapp.get('/player/:id', async (req, res) => {
  // console.log('Get player by id');
  const player = await lib.getPlayerById(db, req.params.id);
  console.log('get Player by Id', player);
  if (player === null) {
    res.status(404).json({ error: 'Player not found' });
  } else {
    res.status(200).json({ data: player });
  }
});

// update player score
webapp.put('/player/:id', async (req, res) => {
  // console.log('update player score');
  const updatePlayer = await lib.updatePlayer(db, req.params.id, req.body.points, req.body.maxpoints);
  if (updatePlayer === null) {
    res.status(404).json({ error: 'Player not found' });
  } else {
    res.status(200).json({ data: updatePlayer });
  }
});

// delete the player by id
webapp.delete('/player/:id', async (req, res) => {
  // console.log('delete the player by id');
  const deletedPlayer = await lib.deletePlayer(db, req.params.id);
  if (deletedPlayer === null) {
    res.status(404).json({ error: 'Player not found' });
  } else {
    res.status(200).json({ data: deletedPlayer });
  }
});

// get leaders
webapp.get('/leaders/:n', async (req, res) => {
  // console.log('get leaders');
  let players = await lib.getPlayers(db);
  players = players.sort((a, b) => b.maxpoints - a.maxpoints);
  // return the sorted leaders
  if (req.params.n > players.length) {
    res.status(400).json({ error: 'bad url' });
  } else {
    players = players.slice(0, req.params.n);
    res.status(200).json({ data: players });
  }
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = server;
