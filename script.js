// script.js
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const retryButton = document.getElementById('retry-button');
const timerDisplay = document.getElementById('timer');
const pointsContainer = document.getElementById('points');
const point1 = document.getElementById('point1');
const point2 = document.getElementById('point2');
const point3 = document.getElementById('point3');

let timer;
let timeLeft;
let rounds = 0;
let isGameRunning = false;

// 遊戲初始化
function initGame() {
    rounds = 0;
    isGameRunning = true;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
    startRound();
}

// 開始新一輪
function startRound() {
    rounds++;
    if (rounds <= 5) {
        timeLeft = 10;
    } else if (rounds <= 12) {
        timeLeft = 5;
    } else if (rounds <= 20) {
        timeLeft = 3;
    } else {
        timeLeft = 1;
    }
    timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;

    // 隨機生成兩個點
    const point1X = Math.random() * (window.innerWidth - 40) + 20;
    const point1Y = Math.random() * (window.innerHeight - 40) + 20;
    const point2X = Math.random() * (window.innerWidth - 40) + 20;
    const point2Y = Math.random() * (window.innerHeight - 40) + 20;

    point1.style.left = `${point1X}px`;
    point1.style.top = `${point1Y}px`;
    point2.style.left = `${point2X}px`;
    point2.style.top = `${point2Y}px`;
    point3.style.display = 'none';

    // 啟動計時器
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

// 更新計時器
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;
    if (timeLeft <= 0) {
        endGame();
    }
}

// 檢查三點是否連成一線（傾斜度不超過 10 度）
function checkLine() {
    const x1 = parseFloat(point1.style.left);
    const y1 = parseFloat(point1.style.top);
    const x2 = parseFloat(point2.style.left);
    const y2 = parseFloat(point2.style.top);
    const x3 = parseFloat(point3.style.left);
    const y3 = parseFloat(point3.style.top);

    const slope1 = (y2 - y1) / (x2 - x1);
    const slope2 = (y3 - y2) / (x3 - x2);
    const angle = Math.abs(Math.atan((slope2 - slope1) / (1 + slope1 * slope2)) * (180 / Math.PI);

    return angle <= 10;
}

// 遊戲結束
function endGame() {
    clearInterval(timer);
    isGameRunning = false;
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
}

// 點擊事件
pointsContainer.addEventListener('click', (e) => {
    if (!isGameRunning) return;

    if (e.target.classList.contains('point')) {
        if (point3.style.display === 'none') {
            // 放置第三個點
            const rect = pointsContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            point3.style.left = `${x}px`;
            point3.style.top = `${y}px`;
            point3.style.display = 'block';

            // 檢查是否連成一線
            if (checkLine()) {
                startRound();
            } else {
                endGame();
            }
        }
    }
});

// 開始按鈕
startButton.addEventListener('click', initGame);

// 再試一次按鈕
retryButton.addEventListener('click', initGame);
