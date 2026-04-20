/**
 * JAVASCRIPT TERMINAL QUIZ - LOGIC ENGINE
 */

// 1. QUESTION DATABASE (20 Questions)
const questions = [
    { q: "What is the result of 0.1 + 0.2 === 0.3?", a: ["true", "false", "NaN", "undefined"], c: 1 },
    { q: "Which keyword is used to check if a property exists in an object?", a: ["exists", "within", "in", "has"], c: 2 },
    { q: "What does 'typeof NaN' return?", a: ["'number'", "'NaN'", "'undefined'", "'object'"], c: 0 },
    { q: "Which method converts a JSON string into a JS object?", a: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.objectify()"], c: 1 },
    { q: "What is the result of '5' - 3?", a: ["'53'", "2", "NaN", "Error"], c: 1 },
    { q: "Which of the following is NOT a primitive data type?", a: ["String", "Boolean", "Object", "Symbol"], c: 2 },
    { q: "What is the purpose of the 'Array.map()' method?", a: ["Mutates original array", "Creates a new array with results", "Filters out elements", "Sorts the array"], c: 1 },
    { q: "How do you stop a setInteral() timer?", a: ["stopTimer()", "endTimeout()", "clearInterval()", "clearTimer()"], c: 2 },
    { q: "What does the 'break' statement do in a loop?", a: ["Skips one iteration", "Exits the loop entirely", "Restarts the loop", "Pauses the loop"], c: 1 },
    { q: "Which symbol is used for the logical 'Nullish Coalescing' operator?", a: ["||", "&&", "??", "!!"], c: 2 },
    { q: "What is the output of 'console.log(1 < 2 < 3)'?", a: ["true", "false", "undefined", "Error"], c: 0 },
    { q: "How do you define an arrow function?", a: ["function => {}", "() => {}", "arrow function() {}", "=> {}"], c: 1 },
    { q: "What is hoisting in JavaScript?", a: ["Lifting elements in DOM", "Moving declarations to the top", "Increasing memory limit", "None of the above"], c: 1 },
    { q: "Which operator is used to spread an array into individual elements?", a: ["...", "---", "&&&", "***"], c: 0 },
    { q: "What does the 'bind' method do?", a: ["Executes a function immediately", "Creates a new function with a specific 'this'", "Merges two objects", "Validates syntax"], c: 1 },
    { q: "Which of these is a 'falsy' value?", a: ["' ' (space)", "[] (empty array)", "0", "42"], c: 2 },
    { q: "What is the default value of a variable that is declared but not initialized?", a: ["null", "0", "undefined", "NaN"], c: 2 },
    { q: "How do you find the highest number in a list using Math?", a: ["Math.max()", "Math.high()", "Math.top()", "Math.ceil()"], c: 0 },
    { q: "What is an IIFE?", a: ["Immediately Invoked Function Expression", "Internal Iterative File Entry", "Integrated Interface for Elements", "Its a type of array"], c: 0 },
    { q: "Which company originally created JavaScript?", a: ["Microsoft", "Netscape", "Oracle", "Google"], c: 1 }
];

// 2. STATE MANAGEMENT
let currentIdx = 0;
let userAnswers = new Array(questions.length).fill(null); // Stores indices of selected answers

// 3. DOM ELEMENTS
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('answer-options');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const quizWindow = document.getElementById('quiz-window');
const resultScreen = document.getElementById('result-screen');
const scoreReport = document.getElementById('score-report');

// 4. THE CODING BACKGROUND (Matrix-style)
function initBackground() {
    const bg = document.getElementById('codeBg');
    const codeSnippets = [
        "const x = 10;", "function init() {", "return true;", "map(val => val * 2)", 
        "process.env", "git push origin", "npm run dev", "await fetch(url)", 
        "console.log('debug')", "Object.keys(data)", "Array.from(list)", "while(loading)"
    ];

    // Create 25 floating code strands
    for (let i = 0; i < 25; i++) {
        let div = document.createElement('div');
        div.className = 'code-line';
        div.innerText = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        div.style.left = Math.random() * 100 + 'vw';
        div.style.top = '-20px';
        div.style.fontSize = (Math.random() * 10 + 12) + 'px';
        div.style.animationDuration = (Math.random() * 8 + 4) + 's'; // Varied speed
        div.style.animationDelay = (Math.random() * 5) + 's';
        bg.appendChild(div);
    }
}

// 5. QUIZ CORE FUNCTIONS
function renderQuestion() {
    const q = questions[currentIdx];
    
    // Update question text and progress indicator
    questionText.innerText = q.q;
    progress.innerText = `Step: ${currentIdx + 1} / ${questions.length}`;
    
    // Clear old options
    optionsGrid.innerHTML = '';

    // Create new option buttons
    q.a.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.innerText = option;
        
        // Check if user previously selected this option
        if (userAnswers[currentIdx] === index) {
            btn.classList.add('selected');
        }

        btn.onclick = () => selectOption(index);
        optionsGrid.appendChild(btn);
    });

    // Handle Navigation Button states
    prevBtn.disabled