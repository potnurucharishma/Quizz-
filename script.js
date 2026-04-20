const questions = [
    { q: "What is the capital of France?", a: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
    { q: "Which planet is known as the Red Planet?", a: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
    { q: "What is 5 + 7?", a: ["10", "11", "12", "13"], correct: 2 },
    // ... I have added placeholders for 20 questions below
];

// Filling up to 20 questions for demonstration
for (let i = 4; i <= 20; i++) {
    questions.push({
        q: `Question ${i}: Who wrote 'Example Book'?`,
        a: ["Author A", "Author B", "Author C", "Author D"],
        correct: Math.floor(Math.random() * 4)
    });
}

let currentIdx = 0;
let score = 0;
let userAnswers = new Array(questions.length).fill(null);

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('answer-options');
const qNumDisplay = document.getElementById('question-number');
const progressBar = document.getElementById('progress');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function loadQuestion() {
    const currentQ = questions[currentIdx];
    questionText.innerText = currentQ.q;
    qNumDisplay.innerText = `Question ${currentIdx + 1}/${questions.length}`;
    progressBar.style.width = `${((currentIdx + 1) / questions.length) * 100}%`;
    
    optionsContainer.innerHTML = '';
    currentQ.a.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.classList.add('option-btn');
        if (userAnswers[currentIdx] === i) btn.classList.add('selected');
        btn.onclick = () => selectOption(i);
        optionsContainer.appendChild(btn);
    });

    prevBtn.disabled = currentIdx === 0;
    nextBtn.innerText = currentIdx === questions.length - 1 ? "Finish" : "Next / Skip";
}

function selectOption(index) {
    userAnswers[currentIdx] = index;
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.classList.remove('selected'));
    buttons[index].classList.add('selected');
}

function nextQuestion() {
    if (currentIdx < questions.length - 1) {
        currentIdx++;
        loadQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentIdx > 0) {
        currentIdx--;
        loadQuestion();
    }
}

function showResults() {
    // Calculate Score
    score = userAnswers.reduce((acc, answer, idx) => {
        return answer === questions[idx].correct ? acc + 1 : acc;
    }, 0);

    const modal = document.getElementById('result-modal');
    const scoreText = document.getElementById('score-text');
    scoreText.innerText = `You scored ${score} out of ${questions.length}!`;
    modal.style.display = 'flex';
}

// Initial Load
loadQuestion();