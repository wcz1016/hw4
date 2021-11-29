/* eslint-disable react/prop-types */
/* eslint-disable func-names */
import React from 'react';
import './App.css';

const ScoreSection = function (props) {
  const { currentUser } = props;
  const { currentScore } = props;
  const { questions } = props;
  const { currentUserBestScore } = props;
  const { bestScore } = props;

  return (
    <div className="score-section">
      <p className="showCurrent">
        {' '}
        {currentUser}
        , your current score is
        {' '}
        {' '}
        {currentScore}
        {' '}
        out of
        {' '}
        {questions.length}
        {' '}
      </p>
      <p className="userBest">
        {' '}
        The best score you have is
        {' '}
        {currentUserBestScore}
      </p>
      <div>
        <p className="showBest">
          Best Score Overall:
          {' '}
          {bestScore}
        </p>
      </div>
    </div>

  );
};

export default ScoreSection;
