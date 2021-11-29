/* eslint-disable no-console */
// server url
let url = 'http://localhost:5000';

// get all players
async function getAllPlayers() {
  url = 'http://localhost:5000/players';
  const fetchData = await fetch(url)
    .then((response) => response.json())
    .then((result) => result);
  return fetchData;
}

// create a new player and return the id
async function createNewPlayer(name, points, maxpoints) {
  url = 'http://localhost:5000/player';
  const newPlayerInfo = {};
  newPlayerInfo.name = name;
  newPlayerInfo.points = points;
  newPlayerInfo.maxpoints = maxpoints;

  try {
    const fetchData = await fetch(url, { method: 'POST', body: JSON.stringify(newPlayerInfo), headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then((result) => result);
    return fetchData;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

// update score of the user
async function updateUserScore(id, newScore, newMaxScore) {
  const playerInfoUpdate = {};
  playerInfoUpdate.points = newScore;
  playerInfoUpdate.maxpoints = newMaxScore;

  url = `http://localhost:5000/player/${id}`;

  try {
    const data = await fetch(url, { method: 'PUT', body: JSON.stringify(playerInfoUpdate), headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then((result) => result);
    return data;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

// get the leaders
async function getLeaders(number) {
  url = `http://localhost:5000/leaders/${number}`;
  try {
    const leaders = await fetch(url)
      .then((response) => response.json())
      .then((result) => result);
    return leaders;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

// delete players event
async function deleteUser(id) {
  url = `http://localhost:5000/player/${id}`;
  try {
    const data = await fetch(url, { method: 'DELETE' })
      .then((response) => response.json())
      .then((result) => result);
    return data;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
}

module.exports = {
  getAllPlayers, createNewPlayer, updateUserScore, getLeaders, deleteUser,
};
