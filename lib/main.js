'use strict';

// const welcomeButton = document.querySelector('#welcome-button');
// welcomeButton.addEventListener('click', passWelcome);

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
    var sectionElement = document.querySelector('section[data-section="' + e.target.dataset.selector + '"]');
    // const sectionAudioSrc = document.querySelector(`[data-section="${e.target.dataset.selector}"]`);

    // hide all sections
    sections.forEach(function (sectionElement) {
        sectionElement.classList.add('is-display-none');
    });

    // unhide selected section
    sectionElement.classList.remove('is-display-none');

    // remove active class from all selectors
    selectors.forEach(function (selector) {
        selector.classList.remove('is-active');
    });

    // make current selector active class
    e.target.classList.add('is-active');

    // messing with audio
    var audioSource = "./media/1.mp3";
    var moduleAudio = new Audio(audioSource);
    moduleAudio.pause();
    audioSource = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    moduleAudio = new Audio(audioSource);
    moduleAudio.play();
    console.log(moduleAudio);
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
        allQuestions: [{
            question: "Which programs are exempt from collecting Income Eligibility Applications?",
            choices: ["Only At-Risk Afterschool Centers and Emergency Shelters", "Only Emergency Shelters and Head Start Programs", "At-Risk Afterschool Centers, Emergency Shelters and Head Start Programs"],
            explanation: "At-Risk Afterschool Centers, Emergency Shelters and Head Start Programs including Migrant Head Start and Early Head Start programs are exempt from collecting IEAs",
            correct: 2
        }, {
            question: "For how long is a child IEA valid?",
            choices: ["3 years plus the current year", "One year from the date that it was signed by the parent or guardian", "For as long as the child is continuously enrolled in the center"],
            explanation: "Remember, child IEA is valid for one year from the date that it was signed by the parent or guardian",
            correct: 1
        }, {
            question: "Which of the following is a consequence of missing or incomplete IEAs?",
            choices: ["Your institution will be required to retake this training", "There will be reimbursement disallowances", "Your institution will be required to produce proper enrollment documentation within 30 days"],
            explanation: "Missing or incomplete IEAs could cost the center money as reimbursement is disallowed for participants without proper IEAs",
            correct: 1
        }, {
            question: "Which of the following describe information that must be recorded on IEA?",
            choices: ["The family’s household income", "The signature of the Eligibility Official", "The participant’s ethnic and racial data and categorical classification"],
            explanation: "The signature of the Eligibility Official is required",
            correct: 1
        }, {
            question: "What is the best practice when a child withdraws from the CACFP?",
            choices: ["Document the participant withdrawal date on the IEA", "Destroy the IEA to keep it confidential", "Send the IEA to the State agency explaining the withdrawal"],
            explanation: "When a child withdraws, write the participant’s withdrawal date on the IEA then re-file the documentation",
            correct: 0
        }, {
            question: "How long must IEAs be kept on file?",
            choices: ["One year after the participant withdraws", "30 days after the participant withdraws", "3 years plus the current year"],
            explanation: "IEAs must be maintained on file for 3 years plus the current year. Additionally, it is best practice to have a policy in place that specifies how the institution will retain the records for the required 3 years plus the current year",
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
                this.totalScore >= this.allQuestions.length * 0.75 ? vmQuiz.hideCertBtn = false : vmQuiz.hideRetakeBtn = false;
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