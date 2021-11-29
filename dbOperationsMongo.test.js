/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const lib = require('./dbOperationsMongo');

const profiles = require('./profiles');

let db;
beforeAll(async () => {
  db = await lib.connect(profiles.url1);
  await db.collection('players').deleteMany({});
});

describe('Database operations test addPlayer', () => {
  test('addPlayer inserts a new player', async () => {
    db = await lib.connect(profiles.url1);
    await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
    // find new user in the DB
    const insertedUser = await db.collection('players').findOne({ name: 'testuser' });
    expect(insertedUser.name).toEqual('testuser');
  });

  // massing parameters!
  test('addPlayer with missing params', async () => {
    db = await lib.connect(profiles.url1);
    try {
      await lib.addPlayer(db, { name: 'test1', points: 0 });
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });

  // this does not trigger error for create!
  test('createPlayer exception with wrong db', async () => {
    db = await lib.connect(profiles.url2);
    try {
      await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });
});

describe('Database operations test getPlayerByName', () => {
  test('getPlayerByName for the existed player', async () => {
    db = await lib.connect(profiles.url1);
    await lib.addPlayer(db, { name: 'testuser', points: 2, maxpoints: 6 });
    // find the inserted user in the DB
    const insertedUser = await lib.getPlayerByName(db, 'testuser');
    expect(insertedUser.points).toEqual(2);
    expect(insertedUser.maxpoints).toEqual(6);

    const fakeUser = await lib.getPlayerByName(db, 'fakePlayer');
    expect(fakeUser).toEqual(null);
  });

  test('getPlayerByName exception', async () => {
    db = await lib.connect(profiles.url2);
    try {
      await lib.getPlayerByName(db, 'testuser');
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });
});

describe('Database operations test getPlayers', () => {
  test('getPlayers to get all the players information from database', async () => {
    db = await lib.connect(profiles.url1);
    await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
    await lib.addPlayer(db, { name: 'testplayer1', points: 0, maxpoints: 6 });
    await lib.addPlayer(db, { name: 'testplayer2', points: 3, maxpoints: 8 });
    await lib.addPlayer(db, { name: 'testplayer3', points: 6, maxpoints: 10 });
    // get all the players in the DB
    const allPlayers = await lib.getPlayers(db);
    expect(allPlayers.length).toEqual(4);
    expect(allPlayers[0].name).toEqual('testuser');
    expect(allPlayers[1].points).toEqual(0);
    expect(allPlayers[2].maxpoints).toEqual(8);
    expect(allPlayers[3].name).toEqual('testplayer3');
  });

  test('getPlayers to get all the players information from fake server url', async () => {
    db = await lib.connect(profiles.url2);
    try {
      await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
      await lib.addPlayer(db, { name: 'testplayer1', points: 0, maxpoints: 6 });
      await lib.addPlayer(db, { name: 'testplayer2', points: 3, maxpoints: 8 });
      await lib.addPlayer(db, { name: 'testplayer3', points: 6, maxpoints: 10 });
      await lib.getPlayers(db);
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });
});

describe('Database operations test updatePlayer', () => {
  test('updatePlayer to update scores of the specifc player', async () => {
    db = await lib.connect(profiles.url1);
    await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
    await lib.addPlayer(db, { name: 'testplayer1', points: 0, maxpoints: 6 });
    await lib.addPlayer(db, { name: 'testplayer2', points: 3, maxpoints: 8 });
    await lib.addPlayer(db, { name: 'testplayer3', points: 6, maxpoints: 10 });
    // get all the players in the DB
    const allPlayers = await lib.getPlayers(db);

    await lib.updatePlayer(db, allPlayers[0]._id, 2, 3);
    await lib.updatePlayer(db, allPlayers[0]._id, 3, 3);
    await lib.updatePlayer(db, allPlayers[2]._id, 6, 8);

    const updatePlayers = await lib.getPlayers(db);
    expect(updatePlayers.length).toEqual(4);
    expect(updatePlayers[0].points).toEqual(3);
    expect(updatePlayers[0].maxpoints).toEqual(3);
    expect(updatePlayers[2].maxpoints).toEqual(8);
    expect(updatePlayers[2].points).toEqual(6);

    const updateFakeUser = await lib.updatePlayer(db, '61a3c0ce1c8364921a37be22', 4, 6);
    expect(updateFakeUser.modifiedCount).toEqual(0);
  });

  test('updatePlayer to update scores of the specifc player in a fake database', async () => {
    db = await lib.connect(profiles.url2);
    try {
      await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
      await lib.updatePlayer(db, '61a3c0ce1c8364921a37be1b', 2, 2);
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });
});

describe('Database operations test getPlayerById', () => {
  test('getPlayerById to update scores of the specifc player', async () => {
    db = await lib.connect(profiles.url1);
    await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
    await lib.addPlayer(db, { name: 'testplayer1', points: 0, maxpoints: 6 });
    await lib.addPlayer(db, { name: 'testplayer2', points: 3, maxpoints: 8 });
    await lib.addPlayer(db, { name: 'testplayer3', points: 6, maxpoints: 10 });
    // get all the players in the DB
    const allPlayers = await lib.getPlayers(db);

    const player = await lib.getPlayerById(db, allPlayers[0]._id);
    // console.log('Player is', player);
    expect(player.name).toBe('testuser');
  });
});

describe('Database operations test deletePlayer', () => {
  test('deletePlayer to delete the specific player by id', async () => {
    db = await lib.connect(profiles.url1);
    await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
    await lib.addPlayer(db, { name: 'testplayer1', points: 0, maxpoints: 6 });
    await lib.addPlayer(db, { name: 'testplayer2', points: 3, maxpoints: 8 });
    await lib.addPlayer(db, { name: 'testplayer3', points: 6, maxpoints: 10 });
    // get all the players in the DB
    const allPlayers = await lib.getPlayers(db);

    await lib.deletePlayer(db, allPlayers[0]._id);
    await lib.deletePlayer(db, allPlayers[1]._id);
    await lib.deletePlayer(db, allPlayers[2]._id);

    const updatePlayers = await lib.getPlayers(db);
    expect(updatePlayers.length).toEqual(1);
    expect(updatePlayers[0].points).toEqual(6);
    expect(updatePlayers[0].maxpoints).toEqual(10);
    expect(updatePlayers[0].name).toEqual('testplayer3');

    const updateFakeUser = await lib.deletePlayer(db, '61a3c0ce1c836ddd21a37be22', 4, 6);
    expect(updateFakeUser).toEqual(null);
  });

  test('deletePlayer to delete a player in a fake database', async () => {
    db = await lib.connect(profiles.url2);
    try {
      await lib.addPlayer(db, { name: 'testuser', points: 0, maxpoints: 0 });
      await lib.deletePlayer(db, '61a3c0ce1c8364921a37be1b', 2, 2);
    } catch (err) {
      expect(err.message).toBe('Error executing the query');
    }
  });
});

const clearCollection = async (db) => {
  try {
    const results = await db.collection('players').deleteMany({});
    const { deletedCount } = results;
    if (deletedCount >= 1) {
      console.log('info', 'Successfully deleted a test player');
    } else {
      console.log('warning', 'Test player was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

afterEach(async () => {
  await clearCollection(db);
});
