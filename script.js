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
        rounds = 0;
        isGameRunning = true;
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        endScreen.classList.add('hidden');
        startRound();
    }

    function startRound() {
        clearInterval(timer); // 清理掉之前的計時器
        rounds++;
        timeLeft = rounds <= 5 ? 10 : rounds <= 12 ? 5 : rounds <= 20 ? 3 : 1;
        timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;

        // 隨機生成兩個點
        generatePoints();

        // 重置 point3 狀態
        point3.style.display = 'none';
        point3.style.left = '0px';
        point3.style.top = '0px';

        // 啟動新的計時器
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;
        } else {
            endGame(); // 時間結束時，結束遊戲
        }
    }

    function generatePoints() {
        const pointSize = 20; // 點的大小

        // 隨機生成 point1 的位置
        const point1X = Math.random() * (window.innerWidth - pointSize);
        const point1Y = Math.random() * (window.innerHeight - pointSize);
        point1.style.left = `${point1X}px`;
        point1.style.top = `${point1Y}px`;

        // 隨機生成 point2 的位置
        let point2X, point2Y, distance;
        do {
            point2X = Math.random() * (window.innerWidth - pointSize);
            point2Y = Math.random() * (window.innerHeight - pointSize);

            // 確保 point1 和 point2 之間的距離不過近
            distance = Math.sqrt(Math.pow(point2X - point1X, 2) + Math.pow(point2Y - point1Y, 2));
        } while (distance < 50); // 避免兩點過於接近

        point2.style.left = `${point2X}px`;
        point2.style.top = `${point2Y}px`;
    }

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

    function endGame() {
        clearInterval(timer);
        isGameRunning = false;
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
    }

    pointsContainer.addEventListener('click', (e) => {
        if (!isGameRunning) return;

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
    });

    startButton.addEventListener('click', initGame);
    retryButton.addEventListener('click', initGame);
});
