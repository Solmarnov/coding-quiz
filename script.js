// DOM existing elements
const highScoresLink = $('#highscores-link');
const highscoresDisplay = $(".display-highscores");
const highscoresList = $(".highscores-list");
const returnBtn = $("#return");

const timer = $('#timer');
let timeLeft = null;

const startQuizSection = $('#start');
const startQuizBtn = $('#start-quiz');

const questionEl = $('#question');
const optionsEl = $('#options');

const quizCompleteSection = $('#quiz-complete');
const finalScore = $('#final-score');
const userInitials = $('#initials');
const submitScoreBtn = $('#submit-score');

// Array of queston objects
const questions = [
  {
    question: 'Commonly used data types DO NOT include:',
    options: ['Strings', 'Booleans', 'Alerts', 'Numbers'],
    answer: 2
  },
  {
    question: 'The condition in an if / else statement is enclosed within, what?',
    options: ['" Quotes "', '{ Curly brackets }', '( Parentheses )', '[ Square brackets ]'],
    answer: 2
  },
  {
    question: 'Arrays in JavaScript can be used to store:',
    options: ['Numbers and strings', 'Other arrays', 'Booleans', 'All of the above'],
    answer: 3
  },
  {
    question: 'What must string values be enclosed within when being assigned to variables?',
    options: ['Commas', 'Curly brackets', 'Quotes', 'Parentheses'],
    answer: 2
  },
  {
    question: 'A very useful tool used during development and debugging for printing content to the debugger is:',
    options: ['JavaScript', 'Terminal / Bash', 'for loops', 'console.log'],
    answer: 3
  }
];

// Variables to run quiz
let qIndex = 0;
let hasMoreQuestions = true;
let score = null;
let highscores = {
  initialsArray: [ ],
  scoresArray: [ ],
};

// ******ON CLICK EVENTS****** //
// View highscores 
$(highScoresLink).on('click', () => {
  $("tbody").empty();
  $(startQuizSection).attr('hidden', true);
  quizCompleteSection.attr("hidden", true);
  $("form").attr("hidden", true);
  highscoresDisplay.attr("hidden", false);
  qIndex = 0;
  hasMoreQuestions = true;
  score = null;
  getHighscores();
  renderHighscores();
});

// Return to main page
$(returnBtn).on('click', () => {
  quizCompleteSection.attr("hidden", true);
  $("form").attr("hidden", true);
  highscoresDisplay.attr("hidden", true);
  $(startQuizSection).attr('hidden', false);
});

// On click event listener for #start-quiz button
$(startQuizBtn).on('click', () => {
  // Hide #start section
  $(startQuizSection).attr('hidden', true);
  $("form").attr("hidden", false);
  // Start / Set timer 
  timeLeft = 60;
  $(timer).text(timeLeft);
  setTimer();
  // Get first question
  nextQuestion(qIndex);
});

// On click event listener for #optionsEl children
$(optionsEl).on('click', (event) => {
  event.preventDefault();
  // Increment qIndex ready for the next question set
  userChoice(qIndex);
  qIndex++;
  setHasMoreQuestions(qIndex);
  nextQuestion(qIndex);
});

// On click event listener for #submit-initials button
$(submitScoreBtn).on('click', (event) => {
  event.preventDefault();

  setInitials = userInitials.val();
  setScore = score; 

  getHighscores();
  setHighscores(setInitials, setScore);

  quizCompleteSection.attr("hidden", true);
  highscoresDisplay.attr("hidden", false);

  renderHighscores();

  qIndex = 0;
  hasMoreQuestions = true;
  score = null;

  userInitials.val('');
});

// ******LOCAL STORAGE FUNCTIONS****** //
function getHighscores() {
  // To prevent property push of null in setHighscores function when no localStorage has been set
  if (localStorage.getItem("Score set by") === null) {
    return;
  } else { // Otherwise, return localStorage
    highscores.initialsArray = JSON.parse(localStorage.getItem("Score set by"));
    highscores.scoresArray = JSON.parse(localStorage.getItem("Scores"))
  };
};

function setHighscores(initials, score) {
  highscores.initialsArray.push(initials);
  highscores.scoresArray.push(score);

  localStorage.setItem("Score set by", JSON.stringify(highscores.initialsArray));
  localStorage.setItem("Scores", JSON.stringify(highscores.scoresArray));
};

function renderHighscores() {
  $("tbody").empty();

  for (let i = 0; i < highscores.initialsArray.length; i++) {
    let highscoresRow = $('<tr>');
    let countCell = $('<td id="count">')
    let initialsCell = $('<td id="set-by">');
    let scoreCell = $('<td id="score">');

    countCell.text(i + 1);
    initialsCell.text(highscores.initialsArray[i]);
    scoreCell.text(highscores.scoresArray[i]);

    highscoresRow.append(countCell);
    highscoresRow.append(initialsCell);
    highscoresRow.append(scoreCell);
    $("tbody").append(highscoresRow);
  };
};

// ******TIMER FUNCTIONS****** //
function setTimer() {
  timeLeft = 60
  // 1. Set interval timer for #seconds
  const timerInterval = setInterval(function() {
    timeLeft--;
    $(timer).text(timeLeft);

    if (hasMoreQuestions === false) {
      clearInterval(timerInterval);
      timeLeft++;
      $(timer).text(timeLeft);
      score = timeLeft;
      timeLeft = 0;

      // Show time's up...

    } else if (timeLeft <= 0) {
      clearInterval(timerInterval);
      $(timer).text("00");
      timeLeft = 0;
    };
  }, 1000);
};

// ******QUIZ FUNCTIONS****** //

// Get the next question
function nextQuestion(qIndex) {
  // Delete questionEl & optionsEl children
  $(questionEl).empty();
  $(optionsEl).empty();

  // Assign question text from the questions object array
  if (hasMoreQuestions) {  
    questionEl.text(questions[qIndex].question);

    // For loop to create 'li' elements, assign their text content, and append 'li' to its parent #options 'ul'
    for (let i = 0; i < questions[qIndex].options.length; i++) {
      const option = $("<li>");
      option.attr("data-option", i);
      option.text(questions[qIndex].options[i]);
      optionsEl.append(option);
    };  
  } else { // Handle what happens when no more questions are left
    finalScore.text(timeLeft);
    $("<form>").attr("hidden", true);
    quizCompleteSection.attr("hidden", false);
  };
};

// Check user choice 
function userChoice(qIndex) {
  let choice = '';
  const option = event.target;
  choice = $(option).attr("data-option");

  if (+choice == questions[qIndex].answer) {
    // Show a screen prompt...
  } else {
    let adjustedTime = timeLeft - 15;
    timeLeft = adjustedTime;
    console.log(adjustedTime);
  };
};

// Set hasMoreQuestions flag
function setHasMoreQuestions(qIndex) {
  if (qIndex < questions.length) {
    return;
  } else {
    hasMoreQuestions = false;
  };
};
