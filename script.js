let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = {};
let userName = "";

// Load questions.json
fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        displayQuestion();
        generateNavigationButtons();
    });

// Start test with selected username
function startTest(name) {
    userName = name;
    document.getElementById("username").innerText = name;
    document.getElementById("username-selection").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
}

// Display question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) return;

    let questionObj = questions[currentQuestionIndex];
    document.getElementById("question-text").innerText = `${currentQuestionIndex + 1}. ${questionObj.question}`;

    let optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    questionObj.options.forEach(option => {
        let optionButton = document.createElement("button");
        optionButton.classList.add("option");
        optionButton.innerText = option;
        optionButton.onclick = () => selectAnswer(option);
        if (selectedAnswers[currentQuestionIndex] === option) {
            optionButton.style.backgroundColor = "#a0e0a0"; // Highlight selected option
        }
        optionsContainer.appendChild(optionButton);
    });

    updateNavigationButtons();
}

// Select an answer
function selectAnswer(answer) {
    selectedAnswers[currentQuestionIndex] = answer;
    displayQuestion(); // Refresh question UI
}

// Move to next question
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }

    // Show submit button on last question
    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("submit-btn").style.display = "block";
    }
}

// Generate question navigation buttons
function generateNavigationButtons() {
    let navContainer = document.getElementById("question-navigation");
    navContainer.innerHTML = "";

    for (let i = 0; i < questions.length; i++) {
        let button = document.createElement("button");
        button.classList.add("nav-button", "unanswered");
        button.innerText = i + 1;
        button.onclick = () => goToQuestion(i);
        navContainer.appendChild(button);
    }
}

// Navigate to a specific question
function goToQuestion(index) {
    currentQuestionIndex = index;
    displayQuestion();
}

// Update navigation button colors
function updateNavigationButtons() {
    let navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach((button, index) => {
        button.classList.remove("answered", "unanswered");
        if (selectedAnswers[index]) {
            button.classList.add("answered");
        } else {
            button.classList.add("unanswered");
        }
    });
}

// Submit test and calculate score
function submitTest() {
    let score = 0;

    questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.answer) {
            score++;
        }
    });

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("score").innerText = score;
}
