const SHEET_URLS = {
    "Clase 6": 'https://docs.google.com/spreadsheets/d/1_zyDdNFB2K6xz4I4CdgOPhDChqy1drBrPJwA-9Hy7Ag/pub?output=csv',
    "Clase 7": 'https://docs.google.com/spreadsheets/d/17OGUPM0djxN6LweVHa2CWHgf31GYherET482JmBLJxk/pub?output=csv'
};

let questions = []; // Declare globally so all functions can access it.

async function fetchQuestions(className) {
    try {
        const response = await fetch(SHEET_URLS[className]);
        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(","));
        
        questions = []; // Reset questions before fetching new ones.

        for (let i = 2; i < rows.length; i++) { // Start from index 2 (B3)
            const row = rows[i].map(cell => cell.trim());
            let questionText = row[1];
            let answers = row.slice(2).filter(answer => answer !== "");

            if (questionText && answers.length > 0) {
                questions.push({ text: questionText, answers });
            }
        }

        loadQuestions(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function revealAnswers() {
    questions.forEach((question, index) => {
        question.answers.forEach((correctAnswer, i) => {
            const inputField = document.getElementById(`q${index + 1}_${i + 1}`);
            if (inputField) {
                inputField.value = correctAnswer;  // Fill in correct answer
                inputField.style.borderColor = 'purple';  // Highlight answer
            }
        });
    });
}

function hideAnswers() {
    questions.forEach((question, index) => {
        question.answers.forEach((_, i) => {
            const inputField = document.getElementById(`q${index + 1}_${i + 1}`);
            if (inputField) {
                inputField.value = '';  // Clear answer
                inputField.style.borderColor = '';  // Clear highlight
            }
        });
    });
}

// Load last selected class or default to "Clase 6"
window.onload = function() {
    const savedClass = localStorage.getItem('selectedClass') || "Clase 6";
    document.getElementById('class-selector').value = savedClass;
    fetchQuestions(savedClass);
};

document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        event.preventDefault(); // Prevents default browser behavior
        if (event.code === "KeyS") {
            revealAnswers();
        } else if (event.code === "KeyH") {
            hideAnswers();
        }
    }
});
