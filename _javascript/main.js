/***************************************
* Side-menu hiding/unhiding sections
**************************************/
// get all elements as an array that will act as a selector
const selectors = Array.from(document.querySelectorAll('[data-selector]'));

// give each selector an event listener, remove active class
selectors.forEach(function(selector) {
  selector.addEventListener('click', toggleSections);
});

function toggleSections(e) {
  // get all elements that are sections
  const sections = Array.from(document.querySelectorAll('[data-section]'));

  // get selected section
  const section = document.querySelector(`[data-section="${e.target.dataset.selector}"]`);

  // hide all sections
  sections.forEach(function(section) {
      section.classList.add('my-display-none');
  });

  // unhide selected section
  section.classList.remove('my-display-none');

  // remove active class from all selectors
  selectors.forEach(function(selector) {
      selector.classList.remove('is-active');
  });

  // make current selector active class
  e.target.classList.add('is-active');

  // move focus to the first paragraph of the unhidden section
  section.focus();

  // get all video elements and pause them
  const allVideos = document.querySelectorAll("video");
  allVideos.forEach(video => {
      if(video.paused === false) {
        video.pause();
      } 
  });
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
  this.context.font = '28pt Times';
  this.context.strokeStyle = "black";

  // sizing and locating created objects
  this.canvasPadding = 15;
  this.legendWidth = this.getLegendWidth();
  this.pieAreaX = this.canvas.width - this.legendWidth;
  this.pieAreaY = this.canvas.height
  this.pieLocationX = this.pieAreaX / 2;
  this.pieLocationY = this.pieAreaY / 2;
  this.pieRadius = Math.min(this.pieAreaX, this.pieAreaY / 2 - this.canvasPadding - 5);

  // drawing the things
  this.drawPieBorder();
  this.drawLegend();
  this.drawPieSlice();
}

PieChart.prototype.getLegendWidth = function() {
  let { context, data } = this;
  let labelWidth = 0;
  data.forEach(function(property) {
    labelWidth = Math.max(labelWidth, context.measureText(property.label).width);
  });
  return labelWidth + this.canvasPadding * 4
}

PieChart.prototype.drawPieBorder = function() {
  let { context } = this;
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
}

PieChart.prototype.drawPieSlice = function() {
  let { context, data } = this;
  let totalValue = this.getTotalValue()
  let sliceStartAngle = 0;
  context.save();

	data.forEach((property) => {
	    let sliceAngle = 2 * Math.PI * property.value / totalValue;
	    let sliceEndAngle = sliceStartAngle + sliceAngle;
      context.fillStyle = property.color;
	    context.beginPath();
	    context.moveTo(this.pieLocationX, this.pieLocationY);
	    context.arc(this.pieLocationX, this.pieLocationY, this.pieRadius, sliceStartAngle, sliceEndAngle, false);
	    context.fill();
	    context.stroke();
	    context.closePath();
	    sliceStartAngle = sliceEndAngle
	  });
	
  context.restore();
}

PieChart.prototype.getTotalValue = function() {
	let { data } = this;
  let initialValue = 0;
  let totalValue = data.reduce((accumulator, currentValue) => accumulator + currentValue.value , initialValue);
  return totalValue;
}

PieChart.prototype.drawLegend = function() {
  let { context, data } = this;
  context.save();
  data.forEach(property => {
    context.beginPath();
    context.rect(this.pieAreaX, this.canvasPadding, 20, 20);
    context.closePath();
    context.fillStyle = property.color;
    context.fill();
    context.stroke();
    context.fillText(property.label, this.pieAreaX + 30, this.canvasPadding + 12);
		this.canvasPadding += 30;
  }); 
  context.restore();
}

window.onload = function() {
  const data = [{
    label: "JavaScript",
    value: 15,
    color: "#754607"
  }, 
  {
    label: "PowerPoint",
    value: 40,
    color: "#CC494E"
  }, 
  {
    label: "Cloud storage",
    value: 15,
    color: "#A61C90"
  }, 
  {
    label: "xAPI",
    value: 5,
    color: "#F56127"
  },
  {
    label: "EPUB texts",
    value: 5,
    color: "#070E69"
  },
  {
    label: "SCORM",
    value: 20,
    color: "#07695B"
  }];

  const pieChart = new PieChart("myCanvas", data);
  const btnFoward = document.getElementById("forward");
  const btnReverse = document.getElementById("reverse");

  btnFoward.addEventListener ("click", function () {
    TweenMax.to(data[0], 4, {value: 25});
    TweenMax.to(data[1], 4, {value: 5});
    TweenMax.to(data[2], 4, {value: 20});
    TweenMax.to(data[3], 4, {value: 20});
    TweenMax.to(data[4], 4, {value: 15});
    TweenMax.to(data[5], 4, {value: 1});
  });

  btnReverse.addEventListener ("click", function () {
    TweenMax.to(data[0], 4, {value: 15});
    TweenMax.to(data[1], 4, {value: 40});
    TweenMax.to(data[2], 4, {value: 15});
    TweenMax.to(data[3], 4, {value: 5});
    TweenMax.to(data[4], 4, {value: 5});
    TweenMax.to(data[5], 4, {value: 20});
  });


  TweenMax.ticker.addEventListener("tick", redrawCanvas);
  
  function redrawCanvas() {
    pieChart.drawPieSlice();
    if(data[0].value == 40) {
      TweenMax.ticker.removeEventListener("tick", redrawCanvas);
    };
  };
  

  // data.forEach(property => {
  //   var newData = secondData[0].value
  //   TweenMax.to(property, 15, {value: () => newData});
  // });
}


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
        allQuestions: [
            {
                question: "Bananas are highest in which of the following minerals?",
                choices: ["Calcium", "Iron", "Potassium"],
                explanation: "At-Risk Afterschool Centers, Emergency Shelters and Head Start Programs including Migrant Head Start and Early Head Start programs are exempt from collecting IEAs",
                correct: 2
            },
            {
                question: "Which of the below quotes are part of The Declaration of Independence?",
                choices: ["We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.", "You have been the veterans of creative suffering. Continue to work with the faith that unearned suffering is redemptive.", "The British Empire and the French Republic, linked together in their cause and in their need, will defend to the death their native soil, aiding each other like good comrades to the utmost of their strength."],
                explanation: 'The Declaration began by stating these "self-evident" truths and went on to announced that the Thirteen Colonies at war with the Kingdom of Great Britain would regard themselves as thirteen independent sovereign states, no longer under British rule.',
                correct: 0
            },
            {
                question: "Babe Ruth is associated with which sport?",
                choices: ["Tennis", "Competitive swimming", "Baseball"],
                explanation: 'George Herman "Babe" Ruth Jr. was an American professional baseball player whose career in Major League Baseball spanned 22 seasons, from 1914 through 1935.',
                correct: 2
            }
        ],
    },

    computed: {
        questionTxt() {
          return this.allQuestions[this.currentQuestion].question
        },
        choice1() {
          return this.allQuestions[this.currentQuestion].choices[0];
        },
        choice2() {
          return this.allQuestions[this.currentQuestion].choices[1];
        },
        choice3() {
          return this.allQuestions[this.currentQuestion].choices[2];
        }
    },

    methods: {
        quizSubmit() {

            // user's selected radio button
            const selectedChoice = document.querySelector('input[name="answer"]:checked').value;
            
            // all checkboxes in quiz
            const quizCheckboxes = Array.from(document.forms["quizForm"]["answer"]);
            
            // display defaults in case of incorrect answer
            if (selectedChoice !== this.allQuestions[this.currentQuestion].correct) {
                this.quizModalHeading = 'That is incorrect.';
                this.quizModalBody = '';
            };
            
            // change feedback and increase score if correct answer
            if (selectedChoice == this.allQuestions[this.currentQuestion].correct) {
                this.quizModalHeading = "That is correct!";
                this.quizModalBody = (this.allQuestions[this.currentQuestion].explanation);
                this.totalScore ++;
            };

            // show the quiz modal with feedback
            this.showModalClass = true;
            
            // do something if end of quiz has been reached
            if (this.currentQuestion == this.allQuestions.length -1 ) {
                this.totalScore == (this.allQuestions.length) ? vmQuiz.hideCertBtn = false : vmQuiz.hideRetakeBtn = false;
                this.hideQuizContent = true;
                return
            };
            
            // move to the next question (will not increment if end of quiz has been reached)
            this.currentQuestion ++;

            // goes through the form and UNchecks each answer
            quizCheckboxes.forEach(function(quizCheckbox) {
                quizCheckbox.checked = false;
            }); 
        },

        reloadQuiz() {
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
const app = new Vue({
  el: '#app',
  data: {
      currentDate: ''
  },

  methods: {
      returnDate: function() {
          const fullDate = new Date();
          const currentDay = fullDate.getDate(); 
          const currentMonth = fullDate.getMonth(); 
          const currentYear = fullDate.getFullYear(); 

          this.currentDate = (currentMonth + 1) + "/" + currentDay + "/" + currentYear;

          //BROKE IN EI11 this.currentDate = `${currentMonth + 1}/${currentDay}/${currentYear}`;
          
      } 
  }
})
// run the above vue script that prints the current date
app.returnDate();