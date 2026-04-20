const quizData = [
    { q: "Which language runs in a web browser?", a: "Java", b: "C", c: "Python", d: "JavaScript", correct: "d" },
    { q: "What does CSS stand for?", a: "Central Style Sheets", b: "Cascading Style Sheets", c: "Cascading Simple Sheets", d: "Cars SUVs Sailboats", correct: "b" },
    { q: "What does HTML stand for?", a: "Hypertext Markup Language", b: "Hypertext Markdown Language", c: "Hyperloop Machine Language", d: "Helicopters Terminals Motorboats", correct: "a" },
    { q: "Which year was JavaScript launched?", a: "1996", b: "1995", c: "1994", d: "none of the above", correct: "b" },
    { q: "What is the correct way to write a comments in HTML?", a: "// comment", b: "/* comment */", c: "", d: "<! comment >", correct: "c" },
    // Adding placeholder questions to reach 20
    { q: "Which operator is used to assign a value to a variable?", a: "*", b: "x", c: "=", d: "-", correct: "c" },
    { q: "How do you call a function named 'myFunction'?", a: "call myFunction()", b: "myFunction()", c: "call function myFunction()", d: "hey Function!", correct: "b" },
    { q: "How to write an IF statement in JavaScript?", a: "if i = 5 then", b: "if i == 5 then", c: "if (i == 5)", d: "if i = 5", correct: "c" },
    { q: "Which event occurs when the user clicks on an HTML element?", a: "onchange", b: "onclick", c: "onmouseclick", d: "onmouseover", correct: "b" },
    { q: "How do you declare a JavaScript variable?", a: "v carName", b: "variable carName", c: "var carName", d: "set carName", correct: "c" },
    { q: "Which company developed JavaScript?", a: "Netscape", b: "Google", c: "Microsoft", d: "Apple", correct: "a" },
    { q: "Inside which HTML element do we put the JavaScript?", a: "<js>", b: "<scripting>", c: "<script>", d: "<javascript>", correct: "c" },
    { q: "What is the default value of an uninitialized variable?", a: "0", b: "null", c: "undefined", d: "NaN", correct: "c" },
    { q: "Which symbol is used for ID in CSS?", a: ".", b: "#", c: "&", d: "*", correct: "b" },
    { q: "How do you create a function in JavaScript?", a: "function:myFunction()", b: "function myFunction()", c: "function = myFunction()", d: "func myFunction()", correct: "b" },
    { q: "Is JavaScript case-sensitive?", a: "Yes", b: "No", c: "Only for variables", d: "Depends on browser", correct: "a" },
    { q: "Which HTML tag is used to define an internal style sheet?", a: "<css>", b: "<style>", d: "<script>", d: "<design>", correct: "b" },
    { q: "Which property is used to change the background color?", a: "bgcolor", b: "color", c: "background-color", d: "pattern", correct: "c" },
    { q: "How do you round 7.25 to the nearest integer?", a: "Math.rnd(7.25)", b: "round(7.25)", c: "Math.round(7.25)", d: "rnd(7.25)", correct: "c" },
    { q: "Which array method adds an element to the end?", a: "pop()", b: "push()", c: "shift()", d: "join()", correct: "b" }
];

let currentIdx = 0;
let score = 0;
let userAnswers = new Array(quizData.length).fill(null);
let timeLeft = 900; // 15 minutes

const questionEl = document.getElementById('question');
const answerList = document.getElementById('answer-list');
const progressEl = document.getElementById('progress');
const timerEl = document.getElementById('timer');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const barFill = document.getElementById('bar-fill');

function startTimer() {
    const timerInterval = setInterval(() => {
        timeLeft--;
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        timerEl.innerText = `Time: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResults();
        }
    }, 1000);
}

function loadQuiz() {
    const currentQuiz = quizData[currentIdx];
    questionEl.innerText = currentQuiz.q;
    answerList.innerHTML = '';
    
    ['a', 'b', 'c', 'd'].forEach(letter => {
        const li = document.createElement('li');
        li.innerText = `${letter.toUpperCase()}: ${currentQuiz[letter]}`;
        if(userAnswers[currentIdx] === letter) li.classList.add('selected');
        li.onclick = () => selectAnswer(li, letter);
        answerList.appendChild(li);
    });

    progressEl.innerText = `Question ${currentIdx + 1}/${quizData.length}`;
    barFill.style.width = `${((currentIdx + 1) / quizData.length) * 100}%`;
    prevBtn.disabled = currentIdx === 0;
    nextBtn.innerText = currentIdx === quizData.length - 1 ? "Finish" : "Next / Skip";
}

function selectAnswer(el, letter) {
    const options = document.querySelectorAll('#answer-list li');
    options.forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    userAnswers[currentIdx] = letter;
}

nextBtn.onclick = () => {
    if (currentIdx < quizData.length - 1) {
        currentIdx++;
        loadQuiz();
    } else {
        calculateScore();
        showResults();
    }
};

prevBtn.onclick = () => {
    if (currentIdx > 0) {
        currentIdx--;
        loadQuiz();
    }
};

function calculateScore() {
    score = 0;
    userAnswers.forEach((ans, i) => {
        if (ans === quizData[i].correct) score++;
    });
}

function showResults() {
    document.getElementById('quiz').classList.add('hide');
    const resultContainer = document.getElementById('result-container');
    resultContainer.classList.remove('hide');
    document.getElementById('final-score').innerText = `You got ${score} out of ${quizData.length} correct.`;
}

// Init
startTimer();
loadQuiz();