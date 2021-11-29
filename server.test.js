/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const request = require('supertest');
const profiles = require('./profiles');
// Import database operations
const dbLib = require('./dbOperationsMongo');
const webapp = require('./server');

let db;
let playerId;
// let updateId;

const clearDatabase = async (name) => {
  try {
    await db.collection('players').deleteOne({ name });
    const { deletedCount } = result;
    if (deletedCount >= 1) {
      console.log('info', 'Successfully deleted player');
    } else {
      console.log('warning', 'player was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

beforeAll(async () => {
  db = await dbLib.connect(profiles.url1);
  // await db.collection('players').deleteMany({});
});

// afterEach(async () => {
//   await clearDatabase();
// });

afterAll(async () => {
  await db.collection('players').deleteMany({});
});

describe('Create player/ get all players endpoint API & integration tests', () => {
  test('status code and response missing points', () => request(webapp).post('/player').send()
    .expect(400) // testing the response status code
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
    }));

  test('Create a player: Endpoint status code and response on success', () => request(webapp).post('/player/').send('name=playertest&points=0&maxpoints=0')
    .expect(201)
    .then((response) => {
      const playerInfo = JSON.parse(response.text).data;
      // console.log('user information is', playerInfo);
      expect(playerInfo.insertedId).not.toEqual(null);
    }));

  test('status code and response existed player', () => request(webapp).post('/player').send('name=playertest&points=0&maxpoints=0')
    .expect(409) // testing the response status code
    .then(async () => {
      await clearDatabase('playertest');
    }));
});

describe('get player by id endpoint API & integration tests', () => {
  test('status code and response missing points', () => request(webapp).post('/player').send('name=playertest&points=0&maxpoints=0')
    .expect(201)
    .then((response) => {
      const info = JSON.parse(response.text).data;
      expect(info.insertedId).not.toEqual(null);
      // console.log('user id is', playerId);
      playerId = info.insertedId;
    }));

  test('Get specific player by id', () => request(webapp).get(`/player/${playerId}`)
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.name).toBe('playertest');
    }));

  test('Get specific player by invalid id', () => request(webapp).get('/player/abscidhfdhfdhfk')
    .expect(404)
    .then(async (res) => {
      expect(JSON.parse(res.text).error).toBe('Player not found');
      await clearDatabase('playertest');
    }));
});

describe('get all players endpoint API & integration tests', () => {
  test('status code and response missing points', () => request(webapp).post('/player').send('name=playertest&points=0&maxpoints=0')
    .expect(201)
    .then((response) => {
      const info = JSON.parse(response.text).data;
      expect(info.insertedId).not.toEqual(null);
    }));

  test('Get all players', () => request(webapp).get('/players')
    .expect(200)
    .then(async (res) => {
      expect(JSON.parse(res.text).data.length).toEqual(1);
      console.log('The test player is', JSON.parse(res.text).data);
      expect(JSON.parse(res.text).data[0].name).toBe('playertest');
      await clearDatabase('playertest');
    }));
});

describe('update specific players endpoint API & integration tests', () => {
  test('status code and response missing points', () => request(webapp).post('/player').send('name=playertest&points=0&maxpoints=0')
    .expect(201)
    .then((response) => {
      const info = JSON.parse(response.text).data;
      expect(info.insertedId).not.toEqual(null);
      playerId = info.insertedId;
    }));

  test('update the player by specific id', () => request(webapp).put(`/player/${playerId}`).send(`id=${playerId}&points=2&maxpoints=6`)
    .expect(200)
    .then(async (res) => {
      console.log('The test player is', JSON.parse(res.text).data);
      expect(JSON.parse(res.text).data.modifiedCount).toBe(1);
      const updatedPlayer = await db.collection('players').findOne({ name: 'playertest' });
      expect(updatedPlayer.points).toEqual('2');
      expect(updatedPlayer.maxpoints).toEqual('6');
    }));

  test('update the player by invalid id', () => request(webapp).put('/player/sdfndnfjdfj').send(`id=${playerId}&points=2&maxpoints=6`)
    .expect(404)
    .then(async (res) => {
      expect(JSON.parse(res.text).error).toBe('Player not found');
      await clearDatabase('playertest');
    }));
});

describe('delete specific player endpoint API & integration tests', () => {
  test('status code and response missing points', () => request(webapp).post('/player').send('name=playertest&points=0&maxpoints=0')
    .expect(201)
    .then((response) => {
      const info = JSON.parse(response.text).data;
      expect(info.insertedId).not.toEqual(null);
      playerId = info.insertedId;
    }));

  test('delete the player by invalid id', () => request(webapp).delete('/player/sdfndnfjdfj').send(`id=${playerId}`)
    .expect(404)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('Player not found');
    }));

  test('delete the player by specific id', () => request(webapp).delete(`/player/${playerId}`).send(`id=${playerId}`)
    .expect(200)
    .then(async (res) => {
      console.log('The deleted player is', JSON.parse(res.text).data);
      expect(JSON.parse(res.text).data.deletedCount).toBe(1);
      const updatedPlayer = await db.collection('players').findOne({ name: 'playertest' });
      expect(updatedPlayer).toBe(null);
    }));
});

describe('get leaders endpoint API & integration tests', () => {
  test('add the player', () => request(webapp).post('/player').send('name=playertest&points=3&maxpoints=5')
    .expect(201)
    .then((response) => {
      const info = JSON.parse(response.text).data;
      expect(info.insertedId).not.toEqual(null);
      playerId = info.insertedId;
    }));

  test('add the player', () => request(webapp).post('/player').send('name=playertest1&points=3&maxpoints=2')
    .expect(201)
    .then((response) => {
      const info = JSON.parse(response.text).data;
      expect(info.insertedId).not.toEqual(null);
      playerId = info.insertedId;
    }));

  test('add the player', () => request(webapp).post('/player').send('name=playertest2&points=3&maxpoints=10')
    .expect(201)
    .then((response) => {
      const info = JSON.parse(response.text).data;
      expect(info.insertedId).not.toEqual(null);
      playerId = info.insertedId;
    }));

  test('get leaders', () => request(webapp).get('/leaders/5')
    .expect(400)
    .then((res) => {
      expect(JSON.parse(res.text).error).toBe('bad url');
    }));

  test('get leaders', () => request(webapp).get('/leaders/2')
    .expect(200)
    .then(async (res) => {
      const info = JSON.parse(res.text).data;
      expect(info.length).toEqual(2);
      expect(info[0].name).toBe('playertest2');
      expect(info[0].maxpoints).toEqual('10');
      expect(info[1].name).toBe('playertest');
      expect(info[1].maxpoints).toEqual('5');
    }));
});
