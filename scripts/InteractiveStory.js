const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');

let correctAnswers = 0;
let currentPatch = 0;
let retryCount = { patch0: 0, patch1: 0, patch2: 0 };

// Feedback messages for each patch
const feedbackMessages = {
    patch0: {
        correct: "The crocodile retreats, and you cross safely",
        wrong: "You must backtrack and lose time",
        correctImage: "../images/CorrectFeedback0.png",
        wrongImage: "../images/WrongFeedback0.png"
    },
    patch1: {
        correct: "You find a trail and head toward safely", 
        wrong: "You fall and land in a muddy pit",
        correctImage: "../images/CorrectFeedback1.png",
        wrongImage: "../images/WrongFeedback1.png"
    },
    patch2: {
        correct: "You cross the bridge safely",
        wrong: "The bridge snaps, and you fall into the river", 
        correctImage: "../images/CorrectFeedback2.png",
        wrongImage: "../images/WrongFeedback2.png"
    }
};

const gameStory = [
    { id: "start", 
      text: "You are Leo, a curious student who wandered into the jungle during a school field trip. To find your way back, you must solve a series of jungle-themed math puzzles. With every correct answer, you move forward; with every wrong answer, you face an obstacle or delay.", 
      options: [
          { text: "Follow the riverbank.", nextStep: 0, choosePath: 0 },
          { text: "Climb a nearby tree to look around.", nextStep: 1, choosePath: 1 }
      ], 
      backgroundImage: "../images/PremiseOpenScene.png" 
    },
    
    // Path 0 questions
    { id: 0, text: "You follow the flowing river, hearing wildlife in the distance. A crocodile blocks your way! To distract it, solve: ( 4 × 2 ) + 6 ÷ 3.", 
      options: [
          { text: "10", nextStep: 2, isCorrect: true }, 
          { text: "5.3", nextStep: 2, isCorrect: false },
          { text: "14", nextStep: 2, isCorrect: false },
          { text: "6", nextStep: 2, isCorrect: false }
      ], 
      backgroundImage: "../images/Path0.png" 
    },
    { id: 3, text: "( 12 ÷ 4 ) + 7 × 2 (Retry 1)", 
      options: [
          { text: "20", nextStep: 2, isCorrect: false }, 
          { text: "17", nextStep: 2, isCorrect: true },
          { text: "11", nextStep: 2, isCorrect: false },
          { text: "23", nextStep: 2, isCorrect: false }
      ], 
      backgroundImage: "../images/Path0.png" 
    },
    { id: 4, text: " 20 − ( 5 × 3 ) + 8 ÷ 2 (Retry 2)", 
      options: [
          { text: "9", nextStep: 2, isCorrect: true }, 
          { text: "26.5", nextStep: "gameOver", isCorrect: false },
          { text: "13", nextStep: "gameOver", isCorrect: false },
          { text: "7", nextStep: "gameOver", isCorrect: false }
      ], 
      backgroundImage: "../images/Path0.png" 
    },
    
    // Path 1 questions  
    { id: 1, text: "From the treetop, you spot smoke in the distance—a possible campsite. To calculate the safest direction, solve: ( 18 ÷ 3 ) + ( 2 × 4 ).", 
      options: [
          { text: "12", nextStep: 2, isCorrect: false }, 
          { text: "14", nextStep: 2, isCorrect: true },
          { text: "16", nextStep: 2, isCorrect: false },
          { text: "22", nextStep: 2, isCorrect: false }
      ], 
      backgroundImage: "../images/Path1.png" 
    },
    { id: 5, text: "( 25 ÷ 5 ) + ( 3 × 6 ) (Retry 1)", 
      options: [
          { text: "23", nextStep: 2, isCorrect: true }, 
          { text: "48", nextStep: 2, isCorrect: false },
          { text: "20", nextStep: 2, isCorrect: false },
          { text: "33", nextStep: 2, isCorrect: false }
      ], 
      backgroundImage: "../images/Path1.png" 
    },
    { id: 6, text: "( 4 × 7 ) − ( 12 ÷ 2 ) (Retry 2)", 
      options: [
          { text: "8", nextStep: "gameOver", isCorrect: false }, 
          { text: "22", nextStep: 2, isCorrect: true },
          { text: "34", nextStep: "gameOver", isCorrect: false },
          { text: "16", nextStep: "gameOver", isCorrect: false }
      ], 
      backgroundImage: "../images/Path1.png" 
    },
    
    // Final path questions
    { id: 2, text: "You arrive at a vine bridge that sways with the wind. A final puzzle awaits before you cross: Solve: ( 6 × 3 ) + ( 12 ÷ 2 ) – 4.", 
      options: [
          { text: "20", nextStep: "gameOver", isCorrect: true }, 
          { text: "11", nextStep: "gameOver", isCorrect: false },
          { text: "18", nextStep: "gameOver", isCorrect: false },
          { text: "24", nextStep: "gameOver", isCorrect: false }
      ], 
      backgroundImage: "../images/Path2.png" 
    },
    { id: 7, text: "( 7 × 5 ) + ( 20 ÷ 4 ) − 9 (Retry 1)", 
      options: [
          { text: "4.75", nextStep: "gameOver", isCorrect: false }, 
          { text: "31", nextStep: "gameOver", isCorrect: true },
          { text: "26", nextStep: "gameOver", isCorrect: false },
          { text: "40", nextStep: "gameOver", isCorrect: false }
      ], 
      backgroundImage: "../images/Path2.png" 
    },
    { id: 8, text: "( 30 ÷ 6 ) + ( 8 × 2 ) − 7 (Retry 2)", 
      options: [
          { text: "14", nextStep: "gameOver", isCorrect: true }, 
          { text: "19", nextStep: "gameOver", isCorrect: false },
          { text: "12", nextStep: "gameOver", isCorrect: false },
          { text: "21", nextStep: "gameOver", isCorrect: false }
      ], 
      backgroundImage: "../images/Path2.png" 
    },
    
    { id: "gameOver", text: "", 
      options: [{ text: "Restart", nextStep: "restart" }], 
      backgroundImage: "./images/Endings.webp" 
    }
];

function showGameStep(stepId) {
    // Find the story step we want to show
    const currentStep = gameStory.find(step => step.id === stepId);
    if (!currentStep) return;
    
    // Clear screen and show new content
    textElement.innerHTML = currentStep.text;
    optionButtonsElement.innerHTML = "";
    document.body.style.backgroundImage = `url('${currentStep.backgroundImage}')`;
    
    // Create buttons for each option
    currentStep.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option.text;
        button.classList.add("btn");
        button.addEventListener("click", () => handlePlayerChoice(option));
        optionButtonsElement.appendChild(button);
    });
}

function handlePlayerChoice(playerChoice) {
    // Handle restart
    if (playerChoice.nextStep === "restart") {
        restartGame();
        return;
    }
    
    // Handle choosing initial path
    if (playerChoice.choosePath !== undefined) {
        currentPatch = playerChoice.choosePath;
        showGameStep(playerChoice.nextStep);
        return;
    }
    
    // Handle answering questions
    showFeedbackToPlayer(playerChoice);
}

function showFeedbackToPlayer(playerChoice) {
    // Get the right feedback message
    const patchName = `patch${currentPatch}`;
    const feedbackData = feedbackMessages[patchName];
    
    let feedbackText = "";
    let feedbackImage = "";
    
    if (playerChoice.isCorrect) {
        feedbackText = feedbackData.correct;
        feedbackImage = feedbackData.correctImage;
    } else {
        feedbackText = feedbackData.wrong;
        feedbackImage = feedbackData.wrongImage;
    }
    
    // Show feedback
    textElement.innerHTML = feedbackText;
    optionButtonsElement.innerHTML = "";
    document.body.style.backgroundImage = `url('${feedbackImage}')`;
    
    // Add continue button
    const continueButton = document.createElement("button");
    continueButton.innerText = "Continue";
    continueButton.classList.add("btn");
    continueButton.addEventListener("click", () => continueAfterFeedback(playerChoice));
    optionButtonsElement.appendChild(continueButton);
}

function continueAfterFeedback(playerChoice) {
    if (playerChoice.isCorrect) {
        // Correct answer - move forward
        correctAnswers++;
        
        if (playerChoice.nextStep === "gameOver") {
            showGameEnding();
        } else if (playerChoice.nextStep === 2) {
            // Moving to final bridge section
            currentPatch = 2;
            showGameStep(playerChoice.nextStep);
        } else {
            showGameStep(playerChoice.nextStep);
        }
    } else {
        // Wrong answer - handle retry or game over
        handleWrongAnswer();
    }
}

function handleWrongAnswer() {
    const patchName = `patch${currentPatch}`;
    
    if (retryCount[patchName] < 2) {
        // Give player another chance
        retryCount[patchName]++;
        const retryStepId = getRetryStepId();
        showGameStep(retryStepId);
    } else {
        // No more chances - game over
        showGameEnding(true);
    }
}

function getRetryStepId() {
    const retryNumber = retryCount[`patch${currentPatch}`];
    return 3 + currentPatch * 2 + (retryNumber - 1);
}

function showGameEnding(forceBadEnding = false) {
    let endingMessage = "";
    const totalRetries = retryCount.patch0 + retryCount.patch1 + retryCount.patch2;

    if (forceBadEnding || correctAnswers === 0) {
        endingMessage = "⚠️You never made it back. A rescue team finds you days later, and you vow to study harder next time.";
    } else if (totalRetries > 0) {
        endingMessage = "✨You made it back after facing many setbacks. You're tired, wet, and covered in mud—but alive and wiser.";
    } else {
        endingMessage = "🏆 You solved the puzzles, avoided danger, and safely returned to camp. Your classmates celebrate your cleverness.";
    }

    const gameOverStep = gameStory.find(step => step.id === "gameOver");
    gameOverStep.text = endingMessage;
    showGameStep("gameOver");
}

function restartGame() {
    correctAnswers = 0;
    retryCount = { patch0: 0, patch1: 0, patch2: 0 };
    currentPatch = 0;
    showGameStep("start");
}

// Start the game
restartGame();