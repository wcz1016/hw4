/* eslint-disable react/prop-types */
/* eslint-disable func-names */
import React from 'react';
import './App.css';

const QuestionText = function (props) {
  const { questions } = props;
  const { currentQuestion } = props;
  return (
    <div className="question-text">{questions[currentQuestion].questionText}</div>
  );
};

export default QuestionText;
