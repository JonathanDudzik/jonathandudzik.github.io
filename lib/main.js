'use strict';

/***************************************
* Side-menu hiding/unhiding sections
**************************************/
// get all elements as an array that will act as a selector
var selectors = Array.from(document.querySelectorAll('[data-selector]'));

// get all elements that are sections
var sections = Array.from(document.querySelectorAll('[data-section]'));

// give each selector an event listener, remove active class
selectors.forEach(function (selector) {
  selector.addEventListener('click', toggleSections);
});

function toggleSections(e) {

  // selected section
  var section = document.querySelector('[data-section="' + e.target.dataset.selector + '"]');

  // hide all sections
  sections.forEach(function (section) {
    section.classList.add('my-display-none');
  });

  // unhide selected section
  section.classList.remove('my-display-none');

  // remove active class from all selectors
  selectors.forEach(function (selector) {
    selector.classList.remove('is-active');
  });

  // make current selector active class
  e.target.classList.add('is-active');

  // move focus to the first paragraph of the unhidden section
  section.focus();
}

/***************************************
 * Pie chart Logic
 **************************************/
function PieChart(canvasId, data) {
  // setup data and canvas
  this.data = data;
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext("2d");

  // changing canvas standard styles
  this.context.textBaseline = "middle";
  this.context.font = 'bold 12pt serif';
  this.context.strokeStyle = "black";

  // sizing and locating created objects
  this.canvasPadding = 15;
  this.legendWidth = this.getLegendWidth();
  this.pieAreaX = this.canvas.width - this.legendWidth;
  this.pieAreaY = this.canvas.height;
  this.pieLocationX = this.pieAreaX / 2;
  this.pieLocationY = this.pieAreaY / 2;
  this.pieRadius = Math.min(this.pieAreaX, this.pieAreaY / 2 - this.canvasPadding - 5);

  // drawing the things
  this.drawPieBorder();
  this.drawLegend();
  this.drawPieSlice();
}

PieChart.prototype.getLegendWidth = function () {
  var context = this.context,
      data = this.data;

  var labelWidth = 0;
  data.forEach(function (property) {
    labelWidth = Math.max(labelWidth, context.measureText(property.label).width);
  });
  return labelWidth + this.canvasPadding * 4;
};

PieChart.prototype.drawPieBorder = function () {
  var context = this.context;

  context.save();
  context.beginPath();
  context.fillStyle = "white";
  context.borderSize = 5;
  context.shadowColor = "#777";
  context.shadowBlur = 10;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 2;
  context.arc(this.pieLocationX, this.pieLocationY, this.pieRadius + context.borderSize, 0, Math.PI * 2);
  context.fill();
  context.closePath();
  context.restore();
};

PieChart.prototype.drawPieSlice = function () {
  var _this = this;

  var context = this.context,
      data = this.data;

  var totalValue = this.getTotalValue();
  var sliceStartAngle = 0;
  context.save();

  data.forEach(function (property) {
    var sliceAngle = 2 * Math.PI * property.value / totalValue;
    var sliceEndAngle = sliceStartAngle + sliceAngle;
    context.fillStyle = property.color;
    context.beginPath();
    context.moveTo(_this.pieLocationX, _this.pieLocationY);
    context.arc(_this.pieLocationX, _this.pieLocationY, _this.pieRadius, sliceStartAngle, sliceEndAngle, false);
    context.fill();
    context.stroke();
    context.closePath();
    sliceStartAngle = sliceEndAngle;
  });

  context.restore();
};

PieChart.prototype.getTotalValue = function () {
  var data = this.data;

  var initialValue = 0;
  var totalValue = data.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.value;
  }, initialValue);
  return totalValue;
};

PieChart.prototype.drawLegend = function () {
  var _this2 = this;

  var context = this.context,
      data = this.data;

  context.save();
  data.forEach(function (property) {
    context.beginPath();
    context.rect(_this2.pieAreaX, _this2.canvasPadding, 20, 20);
    context.closePath();
    context.fillStyle = property.color;
    context.fill();
    context.stroke();
    context.fillText(property.label, _this2.pieAreaX + 30, _this2.canvasPadding + 12);
    _this2.canvasPadding += 30;
  });
  context.restore();
};

window.onload = function () {
  var firstData = [{
    label: "JavaScript",
    value: 20,
    color: "red"
  }, {
    label: "HTML",
    value: 20,
    color: "blue"
  }, {
    label: "CSS",
    value: 20,
    color: "green"
  }, {
    label: "Audio",
    value: 10,
    color: "orange"
  }, {
    label: "Captions",
    value: 10,
    color: "yellow"
  }, {
    label: "Video",
    value: 10,
    color: "violet"
  }];

  var secondData = [{
    label: "Work Ethic",
    value: 20,
    color: "green"
  }, {
    label: "Timelyness",
    value: 20,
    color: "yellow"
  }, {
    label: "CSS",
    value: 20,
    color: "green"
  }, {
    label: "collaboration",
    value: 60,
    color: "orange"
  }, {
    label: "teamwork",
    value: 10,
    color: "red"
  }, {
    label: "Video",
    value: 10,
    color: "brown"
  }];

  var data = firstData;

  var pieChart = new PieChart("myCanvas", data);
};

/***************************************
 * Quiz Logic
 **************************************/
var vmQuiz = new Vue({
  el: "#multi-choice-quiz-vue",

  data: {
    currentQuestion: 0,
    totalScore: 0,
    showModalClass: false,
    quizModalHeading: 'That is incorrect.',
    quizModalBody: '',
    hideQuizContent: false,
    hideRetakeBtn: true,
    hideCertBtn: true,

    // ARRAY OF QUESTION OBJECTS
    allQuestions: [{
      question: "Bananas are highest in which of the following minerals?",
      choices: ["Calcium", "Iron", "Potassium"],
      explanation: "At-Risk Afterschool Centers, Emergency Shelters and Head Start Programs including Migrant Head Start and Early Head Start programs are exempt from collecting IEAs",
      correct: 2
    }, {
      question: "Which of the below quotes are part of The Declaration of Independence?",
      choices: ["We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.", "You have been the veterans of creative suffering. Continue to work with the faith that unearned suffering is redemptive.", "The British Empire and the French Republic, linked together in their cause and in their need, will defend to the death their native soil, aiding each other like good comrades to the utmost of their strength."],
      explanation: 'The Declaration began by stating these "self-evident" truths and went on to announced that the Thirteen Colonies at war with the Kingdom of Great Britain would regard themselves as thirteen independent sovereign states, no longer under British rule.',
      correct: 0
    }, {
      question: "Babe Ruth is associated with which sport?",
      choices: ["Tennis", "Competitive swimming", "Baseball"],
      explanation: 'George Herman "Babe" Ruth Jr. was an American professional baseball player whose career in Major League Baseball spanned 22 seasons, from 1914 through 1935.',
      correct: 2
    }]
  },

  computed: {
    questionTxt: function questionTxt() {
      return this.allQuestions[this.currentQuestion].question;
    },
    choice1: function choice1() {
      return this.allQuestions[this.currentQuestion].choices[0];
    },
    choice2: function choice2() {
      return this.allQuestions[this.currentQuestion].choices[1];
    },
    choice3: function choice3() {
      return this.allQuestions[this.currentQuestion].choices[2];
    }
  },

  methods: {
    quizSubmit: function quizSubmit() {

      // user's selected radio button
      var selectedChoice = document.querySelector('input[name="answer"]:checked').value;

      // all checkboxes in quiz
      var quizCheckboxes = Array.from(document.forms["quizForm"]["answer"]);

      // display defaults in case of incorrect answer
      if (selectedChoice !== this.allQuestions[this.currentQuestion].correct) {
        this.quizModalHeading = 'That is incorrect.';
        this.quizModalBody = '';
      };

      // change feedback and increase score if correct answer
      if (selectedChoice == this.allQuestions[this.currentQuestion].correct) {
        this.quizModalHeading = "That is correct!";
        this.quizModalBody = this.allQuestions[this.currentQuestion].explanation;
        this.totalScore++;
      };

      // show the quiz modal with feedback
      this.showModalClass = true;

      // do something if end of quiz has been reached
      if (this.currentQuestion == this.allQuestions.length - 1) {
        this.totalScore == this.allQuestions.length ? vmQuiz.hideCertBtn = false : vmQuiz.hideRetakeBtn = false;
        this.hideQuizContent = true;
        return;
      };

      // move to the next question (will not increment if end of quiz has been reached)
      this.currentQuestion++;

      // goes through the form and UNchecks each answer
      quizCheckboxes.forEach(function (quizCheckbox) {
        quizCheckbox.checked = false;
      });
    },
    reloadQuiz: function reloadQuiz() {
      this.currentQuestion = 0;
      this.totalScore = 0;
      this.hideQuizContent = false;
      this.hideRetakeBtn = true;
    }
  }
});

/***************************************
 * Certificate Date Logic
 **************************************/
var app = new Vue({
  el: '#app',
  data: {
    currentDate: ''
  },

  methods: {
    returnDate: function returnDate() {
      var fullDate = new Date();
      var currentDay = fullDate.getDate();
      var currentMonth = fullDate.getMonth();
      var currentYear = fullDate.getFullYear();

      this.currentDate = currentMonth + 1 + "/" + currentDay + "/" + currentYear;

      //BROKE IN EI11 this.currentDate = `${currentMonth + 1}/${currentDay}/${currentYear}`;
    }
  }
});
// run the above vue script that prints the current date
app.returnDate();