/* eslint-disable react/prop-types */
/* eslint-disable func-names */
import React from 'react';
import './App.css';

const QuestionImage = function (props) {
  const { image } = props;
  return (
    <div>
      <img className="image" src={image} alt="question" />
    </div>
  );
};

export default QuestionImage;
