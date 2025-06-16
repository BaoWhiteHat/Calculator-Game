const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');

let correctAnswers = 0;
let currentPatch = 0;
let retryState = {
    0: 0,
    1: 0,
    2: 0
};

// Feedback messages and backgrounds for each patch
const feedbackMessages = {
    0: {
        correct: {
            text: "The crocodile retreats, and you cross safely",
            background: "../images/CorrectFeedback0.png"
        },
        wrong: {
            text: "You must backtrack and lose time",
            background: "../images/WrongFeedback0.png"
        }
    },
    1: {
        correct: {
            text: "You find a trail and head toward safely",
            background: "../images/CorrectFeedback1.png"
        },
        wrong: {
            text: "You fall and land in a muddy pit",
            background: "../images/WrongFeedback1.png"
        }
    },
    2: {
        correct: {
            text: "You cross the bridge safely",
            background: "../images/CorrectFeedback2.png"
        },
        wrong: {
            text: "The bridge snaps, and you fall into the river",
            background: "../images/WrongFeedback2.png"
        }
    }
};

const textNodes = [
    // Premise - Choose initial path
    { id: "premise", text: "You are Leo, a curious student who wandered into the jungle during a school field trip. To find your way back, you must solve a series of jungle-themed math puzzles. With every correct answer, you move forward; with every wrong answer, you face an obstacle or delay.", 
      options: [
          { text: "Follow the riverbank.", nextText: 0, selectPatch: 0 },
          { text: "Climb a nearby tree to look around.", nextText: 1, selectPatch: 1 }
      ], 
      background: "../images/PremiseOpenScene.png" 
    },

    // Patch 0 - Left path
    { id: 0, text: "You follow the flowing river, hearing wildlife in the distance. A crocodile blocks your way! To distract it, solve: ( 4 × 2 ) + 6 ÷ 3.", options: [ { text: "10", nextText: 2, correct: true }, { text: "5.3", nextText: 2 } ], background: "../images/Path0.png" },
    { id: 3, text: "( 12 ÷ 4 ) + 7 × 2 (Retry 1)", options: [ { text: "20", nextText: 2 }, { text: "17", nextText: 2, correct: true } ], background: "../images/Path0.png" },
    { id: 4, text: " 20 − ( 5 × 3 ) + 8 ÷ 2 (Retry 2)", options: [ { text: "9", nextText: 2, correct: true }, { text: "26.5", nextText: "ending" } ], background: "../images/Path0.png" },

    // Patch 1 - Right path
    { id: 1, text: "From the treetop, you spot smoke in the distance—a possible campsite. To calculate the safest direction, solve: ( 18 ÷ 3 ) + ( 2 × 4 ).", options: [ { text: "12", nextText: 2 }, { text: "14", nextText: 2, correct: true } ], background: "../images/Path1.png" },
    { id: 5, text: "( 25 ÷ 5 ) + ( 3 × 6 ) (Retry 1)", options: [ { text: "23", nextText: 2, correct: true }, { text: "48", nextText: 2 } ], background: "../images/Path1.png" },
    { id: 6, text: "( 4 × 7 ) − ( 12 ÷ 2 ) (Retry 2)", options: [ { text: "8", nextText: "ending" }, { text: "22", nextText: 2, correct: true } ], background: "../images/Path1.png" },

    // Patch 2 - Final path (common for both)
    { id: 2, text: "You arrive at a vine bridge that sways with the wind. A final puzzle awaits before you cross: Solve: ( 6 × 3 ) + ( 12 ÷ 2 ) – 4.", options: [ { text: "20", nextText: "ending", correct: true }, { text: "11", nextText: "ending" } ], background: "../images/Path2.png" },
    { id: 7, text: "( 7 × 5 ) + ( 20 ÷ 4 ) − 9 (Retry 1)", options: [ { text: "4.75", nextText: "ending" }, { text: "31", nextText: "ending", correct: true } ], background: "../images/Path2.png" },
    { id: 8, text: "( 30 ÷ 6 ) + ( 8 × 2 ) − 7 (Retry 2)", options: [ { text: "14", nextText: "ending", correct: true }, { text: "19", nextText: "ending" } ], background: "../images/Path2.png" },

    { id: "ending", text: "", options: [ { text: "Restart", nextText: -1 } ], background: "./images/Endings.webp" }
];

// Change the background image of the body
function changeBackground(url) {
    // Purpose: Updates the body's background image to the specified URL
    document.body.style.backgroundImage = `url('${url}')`;
}

// Clear the text and option buttons from the UI
function resetUI() {
    // Purpose: Resets the text and option buttons elements by clearing their HTML content
    textElement.innerHTML = "";
    optionButtonsElement.innerHTML = "";
}

// Create and append option buttons to the UI
function createOptionButtons(options) {
    // Purpose: Generates and appends button elements for each option to the optionButtonsElement
    options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option.text;
        button.classList.add("btn");
        button.addEventListener("click", () => selectOption(option));
        optionButtonsElement.appendChild(button);
    });
}

// Display the current text node and its options
function showTextNode(nodeId) {
    // Purpose: Displays the text and options for the given node ID, updating the UI and background
    resetUI();
    const node = textNodes.find(n => n.id === nodeId);
    if (!node) return;
    textElement.innerHTML = node.text;
    createOptionButtons(node.options);
    changeBackground(node.background);
}

// Handle player choice and transition to the next state
function selectOption(option) {
    // Purpose: Processes the player's option selection, handling restarts, path changes, or feedback
    const nextId = option.nextText;
    
    if (nextId < 0) {
        resetGame();
        return;
    }
    
    if (option.selectPatch !== undefined) {
        currentPatch = option.selectPatch;
        showTextNode(nextId);
        return;
    }
    
    showFeedback(option);
}

// Display feedback based on correct or wrong answer
function showFeedback(option) {
    // Purpose: Shows feedback message and background based on whether the answer was correct or wrong
    resetUI();
    
    let feedbackText = "";
    let feedbackBackground = "";
    let isCorrect = option.correct;
    
    const patchFeedback = feedbackMessages[currentPatch];
    
    if (isCorrect) {
        feedbackText = patchFeedback.correct.text;
        feedbackBackground = patchFeedback.correct.background;
    } else {
        feedbackText = patchFeedback.wrong.text;
        feedbackBackground = patchFeedback.wrong.background;
    }
    
    textElement.innerHTML = feedbackText;
    changeBackground(feedbackBackground);
    
    const continueButton = document.createElement("button");
    continueButton.innerText = "Continue";
    continueButton.classList.add("btn");
    continueButton.addEventListener("click", () => proceedAfterFeedback(option));
    optionButtonsElement.appendChild(continueButton);
}

// Proceed to the next step after feedback
function proceedAfterFeedback(option) {
    // Purpose: Advances the game state based on the player's answer, handling correct or wrong responses
    const nextId = option.nextText;
    
    if (option.correct) {
        correctAnswers++;
        if (nextId === "ending") {
            showEnding();
        } else if (nextId === 2) {
            currentPatch = 2;
            showTextNode(nextId);
        } else {
            showTextNode(nextId);
        }
    } else {
        handleWrongAnswer();
    }
}

// Manage the logic for a wrong answer, including retries
function handleWrongAnswer() {
    // Purpose: Handles incorrect answers, providing retry options or forcing an ending if retries are exhausted
    if (retryState[currentPatch] < 2) {
        retryState[currentPatch]++;
        const retryCount = retryState[currentPatch];
        const retryNodeId = 3 + currentPatch * 2 + (retryCount - 1);
        showTextNode(retryNodeId);
    } else {
        showEnding(true);
    }
}

// Display the ending based on performance
function showEnding(forceBad = false) {
    // Purpose: Displays the game ending based on the number of correct answers and retries used
    resetUI();
    let endingText = "";

    if (forceBad || correctAnswers === 0) {
        endingText = "⚠️You never made it back. A rescue team finds you days later, and you vow to study harder next time.";
    } else if (countRetriesUsed() > 0) {
        endingText = "✨You made it back after facing many setbacks. You're tired, wet, and covered in mud—but alive and wiser.";
    } else {
        endingText = "🏆 You solved the puzzles, avoided danger, and safely returned to camp. Your classmates celebrate your cleverness.";
    }

    const node = textNodes.find(n => n.id === "ending");
    node.text = endingText;
    showTextNode("ending");
}

// Calculate total retries used across all patches
function countRetriesUsed() {
    // Purpose: Returns the total number of retries used across all patches
    return retryState[0] + retryState[1] + retryState[2];
}

// Reset game state to initial conditions
function resetGame() {
    // Purpose: Resets all game variables to their initial state and restarts the game
    correctAnswers = 0;
    retryState = { 0: 0, 1: 0, 2: 0 };
    currentPatch = 0;
    showTextNode("premise");
}

// Initialize the game
function startGame() {
    // Purpose: Starts the game by calling the reset function
    resetGame();
}

startGame();
