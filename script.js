document.addEventListener('DOMContentLoaded', () => {
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

    function initGame() {
        console.log('遊戲初始化完成');
        rounds = 0;
        isGameRunning = true;
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        endScreen.classList.add('hidden');
        startRound();
    }

function generateRandomPosition() {
    const pointX = Math.random() * (window.innerWidth - 40) + 20;
    const pointY = Math.random() * (window.innerHeight - 40) + 20;

    // 確保點在窗口範圍內
    return {
        x: Math.min(Math.max(pointX, 20), window.innerWidth - 20),
        y: Math.min(Math.max(pointY, 20), window.innerHeight - 20),
    };
}

function startRound() {
    clearInterval(timer);
    console.log('開始新一輪');
    rounds++;
    timeLeft = rounds <= 5 ? 10 : rounds <= 12 ? 5 : rounds <= 20 ? 3 : 1;
    timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;

    const point1Pos = generateRandomPosition();
    const point2Pos = generateRandomPosition();

    point1.style.left = `${point1Pos.x}px`;
    point1.style.top = `${point1Pos.y}px`;
    point2.style.left = `${point2Pos.x}px`;
    point2.style.top = `${point2Pos.y}px`;
    point3.style.display = 'none';

    timer = setInterval(updateTimer, 1000);
}

    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;
        if (timeLeft <= 0) {
            endGame();
        }
    }

    function checkLine() {
        const x1 = parseFloat(point1.style.left);
        const y1 = parseFloat(point1.style.top);
        const x2 = parseFloat(point2.style.left);
        const y2 = parseFloat(point2.style.top);
        const x3 = parseFloat(point3.style.left);
        const y3 = parseFloat(point3.style.top);

        const slope1 = (x2 - x1) !== 0 ? (y2 - y1) / (x2 - x1) : Infinity;
        const slope2 = (x3 - x2) !== 0 ? (y3 - y2) / (x3 - x2) : Infinity;
        const angle = Math.abs(Math.atan((slope2 - slope1) / (1 + slope1 * slope2)) * (180 / Math.PI));

        return angle <= 10;
    }

    function endGame() {
        clearInterval(timer);
        isGameRunning = false;
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
    }

    pointsContainer.addEventListener('click', (e) => {
        if (!isGameRunning) return;

        if (e.target.classList.contains('point')) {
            if (point3.style.display === 'none') {
                const rect = pointsContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                point3.style.left = `${x}px`;
                point3.style.top = `${y}px`;
                point3.style.display = 'block';

                if (checkLine()) {
                    startRound();
                } else {
                    endGame();
                }
            }
        }
    });

    startButton.addEventListener('click', initGame);
    retryButton.addEventListener('click', initGame);
});
