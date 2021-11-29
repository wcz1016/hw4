/* eslint-disable react/prop-types */
/* eslint-disable func-names */
import React from 'react';
import './App.css';

const CurrentQuestion = function (props) {
  const { count, questions, currentScore } = props;

  return (
    <>
      <div>
        <p className="Question-Count">
          Question
          {count + 1}
          {' '}
          /
          {questions.length}
        </p>
      </div>
      <div>
        <span className="currentScore">
          Your Current Score is
          {currentScore}
        </span>
      </div>
    </>

  );
};

export default CurrentQuestion;
