document.addEventListener('DOMContentLoaded', () => {
    // 元素選取
    const elements = {
        startScreen: document.getElementById('start-screen'),
        gameScreen: document.getElementById('game-screen'),
        endScreen: document.getElementById('end-screen'),
        startButton: document.getElementById('start-button'),
        retryButton: document.getElementById('retry-button'),
        timerDisplay: document.getElementById('timer'),
        currentScoreDisplay: document.getElementById('current-score'),
        finalScoreDisplay: document.getElementById('final-score'),
        pointsContainer: document.getElementById('points'),
        points: {
            p1: document.getElementById('point1'),
            p2: document.getElementById('point2'),
            p3: document.getElementById('point3')
        }
    };

    // 遊戲狀態
    let gameState = {
        timer: null,
        timeLeft: 10,
        rounds: 0,
        score: 0,
        isRunning: false
    };

    // 遊戲初始化
    function initGame() {
        gameState.rounds = 0;
        gameState.score = 0;
        gameState.isRunning = true;
        elements.startScreen.classList.add('hidden');
        elements.gameScreen.classList.remove('hidden');
        elements.endScreen.classList.add('hidden');
        updateScoreDisplay();
        startRound();
    }

    // 回合開始
    function startRound() {
        clearInterval(gameState.timer);
        gameState.rounds++;
        
        // 時間計算
        gameState.timeLeft = gameState.rounds <= 5 ? 10 :
                           gameState.rounds <= 12 ? 5 :
                           gameState.rounds <= 20 ? 3 : 1;
        
        // 更新介面
        elements.timerDisplay.textContent = `剩餘時間：${gameState.timeLeft} 秒`;
        elements.points.p3.style.display = 'none';
        elements.points.p3.removeAttribute('style');
        
        // 生成新點
        generatePoints();
        
        // 啟動定時器
        gameState.timer = setInterval(() => {
            gameState.timeLeft--;
            elements.timerDisplay.textContent = `剩餘時間：${gameState.timeLeft} 秒`;
            if (gameState.timeLeft <= 0) endGame();
        }, 1000);
    }

    // 生成點位
    function generatePoints() {
        const size = 20;
        const getPos = () => ({
            x: Math.random() * (window.innerWidth - size),
            y: Math.random() * (window.innerHeight - size)
        });

        // 第一個點
        const p1 = getPos();
        elements.points.p1.style.left = `${p1.x}px`;
        elements.points.p1.style.top = `${p1.y}px`;

        // 第二個點（確保距離）
        let p2;
        do {
            p2 = getPos();
        } while (Math.hypot(p2.x - p1.x, p2.y - p1.y) < 50);
        
        elements.points.p2.style.left = `${p2.x}px`;
        elements.points.p2.style.top = `${p2.y}px`;
    }

    // 檢查三點一線
    function checkAlignment() {
        const parse = el => ({
            x: parseFloat(el.style.left),
            y: parseFloat(el.style.top)
        });

        const [p1, p2, p3] = ['p1', 'p2', 'p3'].map(p => parse(elements.points[p]));
        
        // 計算斜率差
        const slope = (a, b) => (b.y - a.y) / (b.x - a.x || 0.0001);
        const angle = Math.abs(Math.atan((slope(p2,p3) - slope(p1,p2)) / (1 + slope(p1,p2)*slope(p2,p3)));
        return angle * (180/Math.PI) < 10;
    }

    // 更新分數顯示
    function updateScoreDisplay() {
        elements.currentScoreDisplay.textContent = `得分：${gameState.score}`;
        elements.finalScoreDisplay.textContent = `最終得分：${gameState.score}`;
    }

    // 結束遊戲
    function endGame() {
        clearInterval(gameState.timer);
        gameState.isRunning = false;
        elements.gameScreen.classList.add('hidden');
        elements.endScreen.classList.remove('hidden');
    }

    // 點擊事件處理
    elements.pointsContainer.addEventListener('click', e => {
        if (!gameState.isRunning || elements.points.p3.style.display === 'block') return;

        const rect = elements.pointsContainer.getBoundingClientRect();
        elements.points.p3.style.left = `${e.clientX - rect.left}px`;
        elements.points.p3.style.top = `${e.clientY - rect.top}px`;
        elements.points.p3.style.display = 'block';

        if (checkAlignment()) {
            gameState.score += 100;
            updateScoreDisplay();
            startRound();
        } else {
            endGame();
        }
    });

    // 按鈕綁定
    elements.startButton.addEventListener('click', initGame);
    elements.retryButton.addEventListener('click', initGame);
});
