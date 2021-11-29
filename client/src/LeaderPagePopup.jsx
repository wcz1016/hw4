/* eslint-disable react/destructuring-assignment */
/* eslint-disable func-names */
/* eslint-disable react/prop-types */
import React from 'react';
import './LeaderPagePopup.css';
import './App.css';

const LeaderPagePopup = function (props) {
  const { leaders } = props;
  const { trigger } = props;

  return (trigger) ? (
    <div className="popupWindow">
      <div className="leaderList">
        <h3>Leaders</h3>
        <ul id="delete">
          {
                    leaders.map((player) => (
                      <li className="information">
                        {player.name}
                        {' '}
                        :
                        {' '}
                        {player.maxpoints}
                        {' '}
                        points
                        {' '}
                      </li>
                    ))
                }
        </ul>
        <button type="button" onClick={() => props.setTrigger(false)}>close</button>
      </div>
    </div>
  ) : '';
};

export default LeaderPagePopup;
