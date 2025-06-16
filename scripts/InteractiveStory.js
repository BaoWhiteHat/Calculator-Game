const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');

let correctAnswers = 0;
let currentPatch = 0;
let retryState = {
    0: 0,
    1: 0,
    2: 0
};

// Feedback messages và backgrounds cho từng patch
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
    // Patch 0
    { id: 0, text: "Câu hỏi 1", options: [ { text: "Câu trả lời đúng", nextText: 1, correct: true }, { text: "Câu trả lời sai", nextText: 1 } ], background: "../images/PremiseOpenScene.png" },
    { id: 3, text: "Câu hỏi 4", options: [ { text: "Câu trả lời sai", nextText: 1 }, { text: "Câu trả lời đúng", nextText: 1, correct: true } ], background: "../images/PremiseOpenScene.png" },
    { id: 4, text: "Câu hỏi 5", options: [ { text: "Câu trả lời đúng", nextText: 1, correct: true }, { text: "Câu trả lời sai", nextText: "ending" } ], background: "../images/PremiseOpenScene.png" },

    // Patch 1
    { id: 1, text: "Câu hỏi 2", options: [ { text: "Câu trả lời sai", nextText: 2 }, { text: "Câu trả lời đúng", nextText: 2, correct: true } ], background: "../images/Path1.webp" },
    { id: 5, text: "Câu hỏi 6", options: [ { text: "Câu trả lời đúng", nextText: 2, correct: true }, { text: "Câu trả lời sai", nextText: 2 } ], background: "../images/Path1.webp" },
    { id: 6, text: "Câu hỏi 7", options: [ { text: "Câu trả lời sai", nextText: "ending" }, { text: "Câu trả lời đúng", nextText: 2, correct: true } ], background: "../images/Path1.webp" },

    // Patch 2
    { id: 2, text: "Câu hỏi 3", options: [ { text: "Câu trả lời đúng", nextText: "ending", correct: true }, { text: "Câu trả lời sai", nextText: "ending" } ], background: "../images/Path2.webp" },
    { id: 7, text: "Câu hỏi 8", options: [ { text: "Câu trả lời sai", nextText: "ending" }, { text: "Câu trả lời đúng", nextText: "ending", correct: true } ], background: "../images/Path2.webp" },
    { id: 8, text: "Câu hỏi 9", options: [ { text: "Câu trả lời đúng", nextText: "ending", correct: true }, { text: "Câu trả lời sai", nextText: "ending" } ], background: "../images/Path2.webp" },

    { id: "ending", text: "", options: [ { text: "Restart", nextText: -1 } ], background: "./images/Endings.webp" }
];

function changeBackground(url) {
    document.body.style.backgroundImage = `url('${url}')`;
}

function resetUI() {
    textElement.innerHTML = "";
    optionButtonsElement.innerHTML = "";
}

function createOptionButtons(options) {
    options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option.text;
        button.classList.add("btn");
        button.addEventListener("click", () => selectOption(option));
        optionButtonsElement.appendChild(button);
    });
}

function showTextNode(nodeId) {
    resetUI();
    const node = textNodes.find(n => n.id === nodeId);
    if (!node) return;
    textElement.innerHTML = node.text;
    createOptionButtons(node.options);
    changeBackground(node.background);
}

function selectOption(option) {
    const nextId = option.nextText;
    
    // Xử lý nút Restart trước
    if (nextId < 0) {
        resetGame();
        return;
    }
    
    // Hiển thị feedback trước khi chuyển sang bước tiếp theo
    showFeedback(option);
}

function showFeedback(option) {
    resetUI();
    
    let feedbackText = "";
    let feedbackBackground = "";
    let isCorrect = option.correct;
    
    // Lấy feedback message và background dựa trên patch hiện tại
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
    
    // Tạo nút "Tiếp tục"
    const continueButton = document.createElement("button");
    continueButton.innerText = "Tiếp tục";
    continueButton.classList.add("btn");
    continueButton.addEventListener("click", () => proceedAfterFeedback(option));
    optionButtonsElement.appendChild(continueButton);
}

function proceedAfterFeedback(option) {
    const nextId = option.nextText;
    
    // Xử lý câu trả lời đúng
    if (option.correct) {
        correctAnswers++;
        if (nextId === "ending") {
            showEnding();
        } else {
            currentPatch++;
            showTextNode(nextId);
        }
    } else {
        // Xử lý câu trả lời sai
        handleWrongAnswer();
    }
}

function handleWrongAnswer() {
    // Không hiển thị alert nữa vì đã có feedback
    if (retryState[currentPatch] < 2) {
        retryState[currentPatch]++;
        const retryCount = retryState[currentPatch];
        const retryNodeId = 3 + currentPatch * 2 + (retryCount - 1); // Retry node ID
        showTextNode(retryNodeId);
    } else {
        // Hết lượt retry
        showEnding(true); // Bắt buộc kết thúc tệ
    }
}

function showEnding(forceBad = false) {
    resetUI();
    let endingText = "";

    if (forceBad || correctAnswers === 0) {
        endingText = "⚠️ Kết thúc tệ.";
    } else if (countRetriesUsed() > 0) {
        // Nếu đã sử dụng retry (trả lời sai) ở bất kỳ patch nào
        endingText = "✨ Kết thúc tốt nhưng chông gai.";
    } else {
        // Chỉ khi không sử dụng retry nào (trả lời đúng tất cả từ lần đầu)
        endingText = "🏆 Kết thúc tốt.";
    }

    const node = textNodes.find(n => n.id === "ending");
    node.text = endingText;
    showTextNode("ending");
}

function countRetriesUsed() {
    return retryState[0] + retryState[1] + retryState[2];
}

function resetGame() {
    correctAnswers = 0;
    retryState = { 0: 0, 1: 0, 2: 0 };
    currentPatch = 0;
    showTextNode(0);
}

function startGame() {
    resetGame();
}

startGame();