/* eslint-disable no-alert */
import {
  getAllPlayers,
} from './API';

async function checkName(currentUser) {
  if (!currentUser.match('^[a-zA-Z0-9]*$')) {
    alert('Please enter a valid user name (alphanumeric)');
    return null;
  }

  // check if the user is existed
  const players = await getAllPlayers();
  for (let i = 0; i < players.data.length; i += 1) {
    if (players.data[i].name === currentUser) {
      alert('User already exist! Please enter another name!');
      return null;
    }
  }
  return players;
}

export default checkName;
