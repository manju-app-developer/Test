let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = {};
let username = "";

async function loadQuestions() {
    const response = await fetch("questions.json");
    questions = await response.json();
    displayQuestion();
    updateNavigation();
}

function startTest(user) {
    username = user;
    document.getElementById("user-selection").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("user-name").innerText = `Welcome, ${username}`;
    loadQuestions();
}

function displayQuestion() {
    const questionData = questions[currentQuestionIndex];
    document.getElementById("question-text").innerText = questionData.question;
    
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    questionData.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => selectAnswer(option);
        button.classList.add("option-btn");
        
        if (selectedAnswers[currentQuestionIndex] === option) {
            button.style.background = "green";
            button.style.color = "white";
        }
        
        optionsContainer.appendChild(button);
    });

    updateNavigation();
}

function selectAnswer(answer) {
    selectedAnswers[currentQuestionIndex] = answer;
    displayQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function updateNavigation() {
    const navContainer = document.getElementById("question-navigation");
    navContainer.innerHTML = "";

    questions.forEach((_, index) => {
        const btn = document.createElement("button");
        btn.innerText = index + 1;
        btn.classList.add("question-btn");

        if (selectedAnswers[index]) btn.classList.add("answered");
        else btn.classList.add("unanswered");

        if (index === currentQuestionIndex) btn.classList.add("current");

        btn.onclick = () => {
            currentQuestionIndex = index;
            displayQuestion();
        };

        navContainer.appendChild(btn);
    });
}

function submitTest() {
    let score = 0;
    questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.answer) {
            score++;
        }
    });

    document.getElementById("result").innerText = `You scored: ${score}/50`;
    document.getElementById("result").style.display = "block";
                            }
