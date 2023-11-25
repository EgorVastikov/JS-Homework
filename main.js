function generateArray() {
    let array = [];
    for (let i = 1; i <= 8; i++) {
        array.push(i, i);
    }
    return array;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCardElement(number) {
    let card = document.createElement('div');
    card.classList.add("card");
    card.setAttribute("data-num", number);
    card.setAttribute("data-open", "false");
    return card;
}

function createButton() {
    const button = document.createElement("button");
    const containerButton = document.querySelector(".button");
    button.textContent = "Играть снова";
    containerButton.append(button)

    button.addEventListener("click", () => {
        location.reload();
    });
}

function formatTime(time) {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function updateTimer(display) {
    if (--timer < 0) {
        clearInterval(intervalId);
        display.textContent = "Время вышло! Вы проиграли";
        isCheckingCards = true;
        createButton();
    } else {
        display.textContent = formatTime(timer);
    }
}

function startTimer(duration, display) {
    timer = duration;
    display.textContent = formatTime(timer);

    const intervalId = setInterval(function () {
        updateTimer(display);
    }, 1000);

    return intervalId;
}

const timerDisplay = document.querySelector(".timer");
const initialTime = 60;

const intervalId = startTimer(initialTime, timerDisplay);

let array = generateArray();
const shuffledArray = shuffleArray(array);
const cardsContainer = document.querySelector(".cards");
const cardsCount = shuffledArray.length;

let isCheckingCards = false;
let activeCard = null;
let openCardsCount = 0;

function checkCardsMatch(cardElem, num) {
    const numberToMatch = activeCard.getAttribute("data-num");

    if (numberToMatch === String(num)) {
        // совпадение карточек
        cardElem.setAttribute("data-open", "true");
        activeCard.setAttribute("data-open", "true");
        activeCard = null;
        openCardsCount += 2;

        if (openCardsCount === cardsCount) {
            timerDisplay.textContent = "Вы победили!";
            clearInterval(intervalId);
            createButton();
        }
    } else {
        // несовпадение карточек
        isCheckingCards = true;
        setTimeout(() => {
            activeCard.textContent = '';
            cardElem.textContent = '';
            activeCard = null;
            isCheckingCards = false;
        }, 300);
    }
}

for (const num of shuffledArray) {
    const cardElem = createCardElement(num);
    cardElem.addEventListener("click", () => {
        if (isCheckingCards || cardElem.getAttribute("data-open") === "true" || cardElem === activeCard) {
            return;
        }

        cardElem.textContent = num;

        if (!activeCard) {
            activeCard = cardElem;
        } else {
            checkCardsMatch(cardElem, num);
        }
    });
    cardsContainer.appendChild(cardElem);
}