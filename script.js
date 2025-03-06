let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = {};
let userName = "";
let timerInterval;
const totalTime = 60 * 60; // 1 hour in seconds
let timeLeft = totalTime;

// Load questions from JSON file
fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        generateNavigationButtons();
    })
    .catch(error => console.error("Error loading questions:", error));

// Start the test
function startTest(name = null) {
    userName = name || document.getElementById("username-input").value.trim();
    if (!userName) {
        alert("Please enter or select a name to start the test.");
        return;
    }

    document.getElementById("username").innerText = userName;
    document.getElementById("username-selection").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    displayQuestion();
    startTimer();
}

// Display the current question
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

        // Highlight selected answer
        if (selectedAnswers[currentQuestionIndex] === option) {
            optionButton.classList.add("selected");
        }

        optionsContainer.appendChild(optionButton);
    });

    updateNavigationButtons();
    updateButtonsVisibility();
}

// Handle answer selection
function selectAnswer(answer) {
    selectedAnswers[currentQuestionIndex] = answer;
    displayQuestion(); // Refresh UI to highlight selection
}

// Move to the next question
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Move to the previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
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

// Update visibility of Previous, Next, and Submit buttons
function updateButtonsVisibility() {
    document.getElementById("prev-btn").style.display = currentQuestionIndex > 0 ? "block" : "none";
    document.getElementById("next-btn").style.display = currentQuestionIndex < questions.length - 1 ? "block" : "none";
    document.getElementById("submit-btn").style.display = currentQuestionIndex === questions.length - 1 ? "block" : "none";
}

// Start the countdown timer
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest();
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

// Update the timer display
function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("time-left").innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Submit the test and calculate the score
function submitTest() {
    clearInterval(timerInterval);

    let score = 0;
    questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.answer) {
            score++;
        }
    });

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("score").innerText = `Your Score: ${score} / ${questions.length}`;
}

// Review Answers - Show Correct Answers After Test Completion
function reviewAnswers() {
    document.getElementById("result-container").style.display = "none";
    document.getElementById("review-container").style.display = "block";

    let reviewContainer = document.getElementById("review-questions");
    reviewContainer.innerHTML = "";

    questions.forEach((question, index) => {
        let questionElement = document.createElement("div");
        questionElement.classList.add("review-question");
        questionElement.innerHTML = `
            <h3>${index + 1}. ${question.question}</h3>
            <p><strong>Your Answer:</strong> ${selectedAnswers[index] || "Not Answered"}</p>
            <p><strong>Correct Answer:</strong> ${question.answer}</p>
        `;
        reviewContainer.appendChild(questionElement);
    });
}

// Restart the test
function restartTest() {
    selectedAnswers = {};
    currentQuestionIndex = 0;
    timeLeft = totalTime;

    document.getElementById("review-container").style.display = "none";
    document.getElementById("result-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    generateNavigationButtons();
    displayQuestion();
    startTimer();
}
