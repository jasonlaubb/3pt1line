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
        clearInterval(timer);
        rounds++;
        timeLeft = rounds <= 5 ? 10 : rounds <= 12 ? 5 : rounds <= 20 ? 3 : 1;
        timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;

        // 隨機生成兩個點
        let point1X, point1Y, point2X, point2Y;

        do {
            point1X = Math.random() * (window.innerWidth - 40) + 20;
            point1Y = Math.random() * (window.innerHeight - 40) + 20;

            point2X = Math.random() * (window.innerWidth - 40) + 20;
            point2Y = Math.random() * (window.innerHeight - 40) + 20;

            const distance = Math.sqrt(Math.pow(point2X - point1X, 2) + Math.pow(point2Y - point1Y, 2));
        } while (distance < 50); // 避免兩點過於接近

        point1.style.left = `${point1X}px`;
        point1.style.top = `${point1Y}px`;
        point2.style.left = `${point2X}px`;
        point2.style.top = `${point2Y}px`;
        point3.style.display = 'none'; // 隱藏第三個點

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

    // 檢查三點是否連成一線
    function checkLine() {
        const x1 = parseFloat(point1.style.left);
        const y1 = parseFloat(point1.style.top);
        const x2 = parseFloat(point2.style.left);
        const y2 = parseFloat(point2.style.top);
        const x3 = parseFloat(point3.style.left);
        const y3 = parseFloat(point3.style.top);

        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(x3) || isNaN(y3)) {
            console.error('無法檢測三點的坐標');
            return false;
        }

        const slope1 = (x2 - x1) !== 0 ? (y2 - y1) / (x2 - x1) : Infinity;
        const slope2 = (x3 - x2) !== 0 ? (y3 - y2) / (x3 - x2) : Infinity;

        const angle = Math.abs(Math.atan((slope2 - slope1) / (1 + slope1 * slope2)) * (180 / Math.PI));
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

        if (point3.style.display === 'none') {
            // 放置第三個點
            const rect = pointsContainer.getBoundingClientRect();
            const x = e.clientX - rect.left; // 將座標轉換為相對於 pointsContainer
            const y = e.clientY - rect.top;

            point3.style.left = `${x}px`;
            point3.style.top = `${y}px`;
            point3.style.display = 'block';

            // 檢查是否連成一線
            if (checkLine()) {
                startRound(); // 成功後開始新一輪
            } else {
                endGame(); // 未成功則遊戲結束
            }
        }
    });

    // 開始按鈕
    startButton.addEventListener('click', initGame);

    // 再試一次按鈕
    retryButton.addEventListener('click', initGame);
});
