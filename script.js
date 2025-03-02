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
        
        // 生成新點
        generatePoints();
        
        // 啟動定時器
        gameState.timer = setInterval(() => {
            gameState.timeLeft--;
            elements.timerDisplay.textContent = `剩餘時間：${gameState.timeLeft} 秒`;
            if (gameState.timeLeft <= 0) endGame();
        }, 1000);
    }

    // 生成點位 (修正版)
    function generatePoints() {
        const container = elements.pointsContainer;
        const size = 20;
        const maxX = container.clientWidth - size;
        const maxY = container.clientHeight - size;

        // 第一個點
        const p1 = {
            x: Math.random() * maxX,
            y: Math.random() * maxY
        };
        elements.points.p1.style.left = `${p1.x}px`;
        elements.points.p1.style.top = `${p1.y}px`;

        // 第二個點 (修正距離檢查)
        let p2;
        const minDistance = 50;
        do {
            p2 = {
                x: Math.random() * maxX,
                y: Math.random() * maxY
            };
        } while (Math.hypot(p2.x - p1.x, p2.y - p1.y) < minDistance);
        
        elements.points.p2.style.left = `${p2.x}px`;
        elements.points.p2.style.top = `${p2.y}px`;
    }

    // 檢查三點一線 (修正版)
    function checkAlignment() {
        const parsePosition = (el) => ({
            x: parseFloat(el.style.left) || 0,
            y: parseFloat(el.style.top) || 0
        });

        const p1 = parsePosition(elements.points.p1);
        const p2 = parsePosition(elements.points.p2);
        const p3 = parsePosition(elements.points.p3);

        // 向量計算
        const vectorAB = { x: p2.x - p1.x, y: p2.y - p1.y };
        const vectorBC = { x: p3.x - p2.x, y: p3.y - p2.y };

        // 計算夾角 (修正計算公式)
        const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y;
        const magnitudeAB = Math.hypot(vectorAB.x, vectorAB.y);
        const magnitudeBC = Math.hypot(vectorBC.x, vectorBC.y);
        
        // 避免除以零
        if (magnitudeAB === 0 || magnitudeBC === 0) return false;
        
        const cosTheta = dotProduct / (magnitudeAB * magnitudeBC);
        const angle = Math.acos(cosTheta) * (180 / Math.PI);
        
        return Math.abs(angle) < 5; // 容許5度誤差
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

    // 點擊事件處理 (修正版)
    elements.pointsContainer.addEventListener('click', e => {
        if (!gameState.isRunning || elements.points.p3.style.display === 'block') return;

        const rect = elements.pointsContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // 設置第三點位置
        elements.points.p3.style.left = `${clickX}px`;
        elements.points.p3.style.top = `${clickY}px`;
        elements.points.p3.style.display = 'block';

        // 延遲檢查以確保樣式更新
        setTimeout(() => {
            if (checkAlignment()) {
                gameState.score += 100;
                updateScoreDisplay();
                startRound();
            } else {
                endGame();
            }
        }, 10);
    });

    // 按鈕綁定
    elements.startButton.addEventListener('click', initGame);
    elements.retryButton.addEventListener('click', initGame);
});
