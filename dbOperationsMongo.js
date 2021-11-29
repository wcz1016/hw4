/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const connect = async (url) => {
  try {
    const tmp = (await MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )).db();
    // Connected to db
    // console.log(`Connected to database: ${tmp.databaseName}`);
    return tmp;
  } catch (err) {
    console.error(err.message);
    throw new Error('could not connect to the db');
  }
};

// get all players
async function getPlayers(db) {
  try {
    const results = await db.collection('players').find({}).toArray();
    // console.log('Get all players');
    // console.log(`Players: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

// create a new player
async function addPlayer(db, newPlayer) {
  try {
    const res = await db.collection('players').insertOne(newPlayer);
    // console.log(`Create player with id: ${res.insertedId}`);
    return res;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
}

// get player by name
async function getPlayerByName(db, name) {
  // console.log('get player by name');
  try {
    const res = await db.collection('players').findOne({ name });
    // console.log(`User: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

// get user by id
async function getPlayerById(db, id) {
  // console.log('in getPlayer by id');
  try {
    const res = await db.collection('players').findOne({ _id: ObjectId(id) });
    // console.log(`User: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
}

// update user points and maxpoints
async function updatePlayer(db, id, points, maxpoints) {
  try {
    // update that player with the given points
    const data = await db.collection('players').updateOne(
      { _id: ObjectId(id) },
      { $set: { points, maxpoints } },
    );
    // console.log('Update user is', data);
    return data;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}
// delete player by name
async function deletePlayer(db, id) {
  try {
    // delete by id
    const deleted = await db.collection('players').deleteOne({ _id: ObjectId(id) });
    // console.log(`Deleted: ${JSON.stringify(deleted)}`);
    return deleted;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

// const operations = async () => {
//   const db = await connect(serverUrl);
//   await getPlayers(db);
//   await addPlayer(db, {name: 'test7', points: 2, maxpoints:5});
//   await updatePlayer(db, '61a1c5ba70f55f7f67baced2', 6, 8);
//   await getPlayers(db);
//   await getPlayerById(db,'61a1c5ba70f55f7f67baced2');
//   await deletePlayer(db, '61a1c5498d12f7f112212fdd');
//   await getPlayers(db);
// };

// operations();

module.exports = {
  connect, getPlayers, getPlayerById, getPlayerByName, addPlayer, deletePlayer, updatePlayer,
};
