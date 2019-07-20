/***************************************
* ei11 Array.from & forEach polyfills
**************************************/
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };
  
      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;
  
        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);
  
        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
  
        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }
  
          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }
  
        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);
  
        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method 
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
  
        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
  }
  
  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.io/#x15.4.4.18
  if (!Array.prototype.forEach) {
  
    Array.prototype.forEach = function(callback/*, thisArg*/) {
  
      var T, k;
  
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }
  
      // 1. Let O be the result of calling toObject() passing the
      // |this| value as the argument.
      var O = Object(this);
  
      // 2. Let lenValue be the result of calling the Get() internal
      // method of O with the argument "length".
      // 3. Let len be toUint32(lenValue).
      var len = O.length >>> 0;
  
      // 4. If isCallable(callback) is false, throw a TypeError exception. 
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
  
      // 5. If thisArg was supplied, let T be thisArg; else let
      // T be undefined.
      if (arguments.length > 1) {
        T = arguments[1];
      }
  
      // 6. Let k be 0.
      k = 0;
  
      // 7. Repeat while k < len.
      while (k < len) {
  
        var kValue;
  
        // a. Let Pk be ToString(k).
        //    This is implicit for LHS operands of the in operator.
        // b. Let kPresent be the result of calling the HasProperty
        //    internal method of O with argument Pk.
        //    This step can be combined with c.
        // c. If kPresent is true, then
        if (k in O) {
  
          // i. Let kValue be the result of calling the Get internal
          // method of O with argument Pk.
          kValue = O[k];
  
          // ii. Call the Call internal method of callback with T as
          // the this value and argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined.
    };
  }

/***************************************
* Side-menu hiding/unhiding sections
**************************************/
// get all elements as an array that will act as a selector
const selectors = Array.from(document.querySelectorAll('[data-selector]'));

// get all elements that are sections
const sections = Array.from(document.querySelectorAll('[data-section]'));

// give each selector an event listener, remove active class
selectors.forEach(function(selector) {
    selector.addEventListener('click', toggleSections);
});

function toggleSections(e) {

    // selected section
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
                question: "Which programs are exempt from collecting Income Eligibility Applications?",
                choices: ["Only At-Risk Afterschool Centers and Emergency Shelters", "Only Emergency Shelters and Head Start Programs", "At-Risk Afterschool Centers, Emergency Shelters and Head Start Programs"],
                explanation: "At-Risk Afterschool Centers, Emergency Shelters and Head Start Programs including Migrant Head Start and Early Head Start programs are exempt from collecting IEAs",
                correct: 2
            },
            {
                question: "For how long is a child IEA valid?",
                choices: ["3 years plus the current year", "One year from the date that it was signed by the parent or guardian", "For as long as the child is continuously enrolled in the center"],
                explanation: "Remember, child IEA is valid for one year from the date that it was signed by the parent or guardian",
                correct: 1
            },
            {
                question: "Which of the following is a consequence of missing or incomplete IEAs?",
                choices: ["Your institution will be required to retake this training", "There will be reimbursement disallowances", "Your institution will be required to produce proper enrollment documentation within 30 days"],
                explanation: "Missing or incomplete IEAs could cost the center money as reimbursement is disallowed for participants without proper IEAs",
                correct: 1
            },
            {
                question: "Which of the following describe information that must be recorded on IEA?",
                choices: ["The family’s household income", "The signature of the Eligibility Official", "The participant’s ethnic and racial data and categorical classification"],
                explanation: "The signature of the Eligibility Official is required",
                correct: 1
            },
            {
                question: "What is the best practice when a child withdraws from the CACFP?",
                choices: ["Document the participant withdrawal date on the IEA", "Destroy the IEA to keep it confidential", "Send the IEA to the State agency explaining the withdrawal"],
                explanation: "When a child withdraws, write the participant’s withdrawal date on the IEA then re-file the documentation",
                correct: 0
            },
            {
                question: "How long must IEAs be kept on file?",
                choices: ["One year after the participant withdraws", "30 days after the participant withdraws", "3 years plus the current year"],
                explanation: "IEAs must be maintained on file for 3 years plus the current year. Additionally, it is best practice to have a policy in place that specifies how the institution will retain the records for the required 3 years plus the current year",
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
                this.totalScore >= (this.allQuestions.length*0.75) ? vmQuiz.hideCertBtn = false : vmQuiz.hideRetakeBtn = false;
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