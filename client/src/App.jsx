/* eslint-disable func-names */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import './App.css';
import React, { useState, useEffect } from 'react';
import {
  getAllPlayers, deleteUser, getLeaders, createNewPlayer, updateUserScore,
} from './API';
import checkName from './HelperFunction';
import ScoreSection from './ScoreSection';
import CurrentQuestion from './CurrentQuestion';
import QuestionImage from './QuestionImage';
import QuestionText from './QuestionText';
import LeaderPagePopup from './LeaderPagePopup';

const App = function () {
  const questions = [
    {
      questionText: 'Who is she?',
      answerOptions: [
        { answerText: 'Emma Whatson', isCorrect: false },
        { answerText: 'Jessica Cannes', isCorrect: false },
        { answerText: 'Taylor Swift', isCorrect: true },
        { answerText: 'Aviril Lavignes', isCorrect: false },
      ],
    },
    {
      questionText: 'Who is she?',
      answerOptions: [
        { answerText: 'Britney Spears', isCorrect: false },
        { answerText: 'Aviril Lavignes', isCorrect: true },
        { answerText: 'Hailey Bieber', isCorrect: false },
        { answerText: 'Taylor Swift', isCorrect: false },
      ],
    },

    {
      questionText: 'Who is he',
      answerOptions: [
        { answerText: 'Lee Pace', isCorrect: true },
        { answerText: 'Tom Holland', isCorrect: false },
        { answerText: 'Robert John Downey Jr.', isCorrect: false },
        { answerText: 'Eddie Redmayne', isCorrect: false },
      ],
    },

    {
      questionText: 'Who is he',
      answerOptions: [
        { answerText: 'Eddie Redmayne', isCorrect: false },
        { answerText: 'Leonardo DiCaprio', isCorrect: false },
        { answerText: 'Robert John Downey Jr.', isCorrect: false },
        { answerText: 'Tom Holland', isCorrect: true },
      ],
    },

    {
      questionText: 'Who is she',
      answerOptions: [
        { answerText: 'G.E.M', isCorrect: false },
        { answerText: 'Mika Nakashima', isCorrect: false },
        { answerText: 'Nakajima Miyuki', isCorrect: false },
        { answerText: 'ayumi hamasaki', isCorrect: true },
      ],
    },

    {
      questionText: 'Who is he',
      answerOptions: [
        { answerText: 'Lee Pace', isCorrect: false },
        { answerText: 'Robert John Downey Jr.', isCorrect: false },
        { answerText: 'Tom Hiddleston', isCorrect: true },
        { answerText: 'Leonardo DiCaprio', isCorrect: false },
      ],
    },

    {
      questionText: 'Who is she',
      answerOptions: [
        { answerText: 'Aviril Lavignes', isCorrect: false },
        { answerText: 'Emma Watson', isCorrect: true },
        { answerText: 'Emily White', isCorrect: false },
        { answerText: 'Taylor Swift', isCorrect: false },
      ],
    },

    {
      questionText: 'Who is she',
      answerOptions: [
        { answerText: 'Angelina Jolie', isCorrect: false },
        { answerText: 'Jennifer Lawrence', isCorrect: false },
        { answerText: 'Scarlett Johansson', isCorrect: false },
        { answerText: 'Jessica Chastain', isCorrect: true },
      ],
    },

    {
      questionText: 'Who is he',
      answerOptions: [
        { answerText: 'Eddie Redmayne', isCorrect: true },
        { answerText: 'Tom Hiddleston', isCorrect: false },
        { answerText: 'Leonardo DiCaprio', isCorrect: false },
        { answerText: 'Tom Holland', isCorrect: false },
      ],
    },

    {
      questionText: 'Who is he',
      answerOptions: [
        { answerText: 'Eddie Redmayne', isCorrect: false },
        { answerText: 'Leonardo DiCaprio', isCorrect: true },
        { answerText: 'Lee Pace', isCorrect: false },
        { answerText: 'Tom Hiddleston', isCorrect: false },
      ],
    },
  ];

  const pic = [
    'Taylor-Swift.jpg', 'Aviril Lavignes.jfif', 'Lee Pace.jfif', 'tom-holland.jpg', 'Bin-Qibu.jpg', 'Dousen.jpg',
    'Emma.jpg', 'LaoMoJie.JPEG', 'xiaoqueban.JPG', 'lizi.jpg',
  ];

  // Intial all the states
  const [count, setCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [image, setImage] = useState(null);
  const [startQuiz, setStartQuiz] = useState(false);
  const [askedQuestion, setAskedQuestion] = useState([true, false, false, false, false, false, false, false, false, false]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const [currentUserBestScore, setcurrentUserBestScore] = useState(0);
  const [informationMap, setInformationMap] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  // get the image from the local environment
  useEffect(() => {
    fetch('Taylor-Swift.jpg')
      .then((response) => response.blob())
      .then((data) => {
        // Create a local URL of that image
        const localUrl = URL.createObjectURL(data);
        setImage(localUrl);
      });
  }, []);

  async function AnswerClick(isCorrect) {
    let finalQuestionCorrect = false;
    setCount(count + 1);

    if (isCorrect) {
      setCurrentScore(currentScore + 1);

      if (count === questions.length - 1) {
        finalQuestionCorrect = true;
      }
    }

    // prevent the repeat questions
    if (count < questions.length - 1) {
      let randomNum = Math.floor(Math.random() * questions.length);
      while (askedQuestion[randomNum]) {
        randomNum = Math.floor(Math.random() * questions.length);
      }
      askedQuestion[randomNum] = true;
      setAskedQuestion(askedQuestion);
      setCurrentQuestion(randomNum);
      setImage(pic[randomNum]);
    } else {
      setShowScore(true);
      // update the current user points
      if (finalQuestionCorrect) {
        await updateUserScore(currentUserId, currentScore + 1, currentScore + 1);
        // update the current user max score
        setcurrentUserBestScore(currentScore + 1);
      } else {
        await updateUserScore(currentUserId, currentScore, currentScore);
        // update the current user max score
        setcurrentUserBestScore(currentScore);
      }
      // get the leaders from the database
      console.log('Get leaders:');
      const bestPerson = await getLeaders(1);
      console.log('Leaders are', leaders.data);
      // get the overall best score
      setBestScore(bestPerson.data[0].maxpoints);
      const allPlayers = await getAllPlayers();
      console.log(allPlayers);
      setInformationMap(allPlayers.data);

      // get leaders
      console.log('now has', allPlayers.data.length, 'players');
      if (allPlayers.data.length < 10) {
        const LeaderList = await getLeaders(allPlayers.data.length);
        console.log(LeaderList.data[0]);
        setLeaders(LeaderList.data);
      } else {
        const LeaderList = await getLeaders(10);
        setLeaders(LeaderList.data);
      }
    }
  }

  // update the current user name
  const updateName = (e) => {
    setCurrentUser(e.target.value);
  };

  // to start the quiz and store the users in the local storage
  async function start() {
    // check if valid input name
    const check = await checkName(currentUser);
    if (!(check === null)) {
      // start the quiz
      setStartQuiz(true);
      console.log('Start, current user is', currentUser);
      const newUser = await createNewPlayer(currentUser, 0, 0);
      setCurrentUserId(newUser.data.insertedId);
      console.log('The userId is', newUser.data.insertedId);
    }
  }

  // delete player
  async function deletePlayer(id) {
    await deleteUser(id);
    const allPlayers = await getAllPlayers();
    if (allPlayers.data.length === 0) {
      setLeaders([]);
    } else if (allPlayers.data.length < 10 && allPlayers.data.length > 0) {
      const LeaderList = await getLeaders(allPlayers.data.length);
      setLeaders(LeaderList.data);
    } else {
      const LeaderList = await getLeaders(10);
      setLeaders(LeaderList.data);
    }
  }

  return (
    <div className="container">

      {startQuiz === false ? (
        <>
          <header className="header">Celebrities Quiz</header>
          <div>
            <p className="enter">Enter Your Name: </p>
            <input className="inputBox" type="text" onChange={(e) => updateName(e)} />

          </div>
          <div className="startButton">
            <button type="button" className="start" onClick={() => start()}>Start Quiz</button>
          </div>
        </>
      ) : (
        <>
          {showScore ? (
            <>
              <ScoreSection currentUser={currentUser} currentScore={currentScore} questions={questions} currentUserBestScore={currentUserBestScore} bestScore={bestScore} />
              <div>
                <p className="Players">Players and Scores</p>
                <ul id="delete">
                  {
                    informationMap.map((player) => (
                      <li className="information">
                        {player.name}
                        {' '}
                        :
                        {' '}
                        {player.maxpoints}
                        {' '}
                        points
                        {' '}
                        <button
                          type="button"
                          onClick={() => {
                            deletePlayer(player._id);
                            document.getElementById('delete').innerHTML = 'Successfully delete';
                          }}
                        >
                          Delete

                        </button>
                      </li>
                    ))
                }
                </ul>
                <button type="button" className="start" onClick={() => setPopupOpen(true)}>Leaders</button>
              </div>
              <LeaderPagePopup leaders={leaders} trigger={popupOpen} setTrigger={setPopupOpen} />
            </>
          ) : (
            <>
              <div className="Question-Part">
                <CurrentQuestion count={count} questions={questions} currentScore={currentScore} />
                <QuestionImage image={image} />
                <QuestionText questions={questions} currentQuestion={currentQuestion} />
              </div>

              <div className="Answer-Part">
                {questions[currentQuestion].answerOptions.map((answerOption) => (
                  <button type="button" className="Answer-Button" onClick={() => AnswerClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
