let currentRound = 1;
let playerTotalScore = 0;
let aiTotalScore = 0;
let playerHistory = [];
let aiHistory = [];

const strategies = {
    'baixar': '🔻 Baixar Preço',
    'manter': '➖ Manter Preço',
    'aumentar': '🔺 Aumentar Preço'
};

function playerChoice(choice) {
    disableButtons();

    const aiChoice = getAIChoice();

    playerHistory.push(choice);
    aiHistory.push(aiChoice);

    const result = calculateResult(choice, aiChoice);

    displayResult(choice, aiChoice, result);

    playerTotalScore += result.playerProfit;
    aiTotalScore += result.aiProfit;

    updateScores();

    document.getElementById('nextBtn').disabled = false;
}

function getAIChoice() {
    if (playerHistory.length < 3) {
        const choices = ['baixar', 'manter', 'aumentar'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    const recentMoves = playerHistory.slice(-3);
    const lowPriceCount = recentMoves.filter(m => m === 'baixar').length;

    if (lowPriceCount >= 2) {
        return Math.random() > 0.3 ? 'baixar' : 'manter';
    } else if (recentMoves[recentMoves.length - 1] === 'aumentar') {
        return Math.random() > 0.4 ? 'baixar' : 'aumentar';
    }

    const choices = ['baixar', 'manter', 'aumentar'];
    return choices[Math.floor(Math.random() * choices.length)];
}

function calculateResult(playerChoice, aiChoice) {
    const resultMatrix = {
        'baixar': {
            'baixar': {
                playerProfit: 5,
                aiProfit: 5,
                playerClients: 50,
                message: 'Guerra de preços! Ambas empresas conquistaram clientes, mas com lucro muito baixo.'
            },
            'manter': {
                playerProfit: 15,
                aiProfit: 8,
                playerClients: 70,
                message: 'Você conquistou mais clientes com preço baixo enquanto o concorrente manteve!'
            },
            'aumentar': {
                playerProfit: 20,
                aiProfit: 3,
                playerClients: 85,
                message: 'Excelente! Você dominou o mercado com preço baixo enquanto o concorrente aumentou!'
            }
        },
        'manter': {
            'baixar': {
                playerProfit: 8,
                aiProfit: 15,
                playerClients: 40,
                message: 'O concorrente ganhou clientes com preço baixo. Você perdeu mercado.'
            },
            'manter': {
                playerProfit: 12,
                aiProfit: 12,
                playerClients: 50,
                message: 'Equilíbrio! Ambas empresas mantiveram preços e tiveram lucro moderado.'
            },
            'aumentar': {
                playerProfit: 18,
                aiProfit: 6,
                playerClients: 65,
                message: 'Boa estratégia! Você ganhou clientes enquanto o concorrente aumentou demais.'
            }
        },
        'aumentar': {
            'baixar': {
                playerProfit: 3,
                aiProfit: 20,
                playerClients: 25,
                message: 'Péssimo resultado. O concorrente dominou com preço baixo.'
            },
            'manter': {
                playerProfit: 6,
                aiProfit: 18,
                playerClients: 35,
                message: 'Você perdeu clientes para o concorrente que manteve preço competitivo.'
            },
            'aumentar': {
                playerProfit: 10,
                aiProfit: 10,
                playerClients: 45,
                message: 'Ambas aumentaram preços. Lucro médio, mas perderam mercado juntas.'
            }
        }
    };

    return resultMatrix[playerChoice][aiChoice];
}

function displayResult(playerChoice, aiChoice, result) {
    document.getElementById('playerChoice').textContent = strategies[playerChoice];
    document.getElementById('aiChoice').textContent = strategies[aiChoice];
    document.getElementById('playerProfit').textContent = '+' + result.playerProfit;
    document.getElementById('playerClients').textContent = result.playerClients;
    document.getElementById('resultMessage').textContent = result.message;

    document.getElementById('resultArea').classList.add('show');
}

function updateScores() {
    document.getElementById('playerScore').textContent = playerTotalScore;
    document.getElementById('aiScore').textContent = aiTotalScore;
}

function disableButtons() {
    const buttons = document.querySelectorAll('.strategy-btn');
    buttons.forEach(btn => {
        btn.classList.add('disabled');
        btn.style.pointerEvents = 'none';
    });
}

function enableButtons() {
    const buttons = document.querySelectorAll('.strategy-btn');
    buttons.forEach(btn => {
        btn.classList.remove('disabled');
        btn.style.pointerEvents = 'auto';
    });
}

function nextRound() {
    currentRound++;

    document.getElementById('resultArea').classList.remove('show');
    document.getElementById('nextBtn').disabled = true;

    if (currentRound > 5) {
        endGame();
        return;
    }

    document.getElementById('currentRound').textContent = currentRound;
    const progress = ((currentRound - 1) / 5) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    enableButtons();
}

function endGame() {
    document.getElementById('strategyButtons').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';

    document.getElementById('finalScore').textContent = playerTotalScore + ' pontos';
    document.getElementById('finalResult').classList.add('show');

    document.getElementById('progressFill').style.width = '100%';
}

function restartGame() {
    currentRound = 1;
    playerTotalScore = 0;
    aiTotalScore = 0;
    playerHistory = [];
    aiHistory = [];

    document.getElementById('currentRound').textContent = '1';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('aiScore').textContent = '0';

    document.getElementById('strategyButtons').style.display = 'grid';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('finalResult').classList.remove('show');
    document.getElementById('resultArea').classList.remove('show');

    enableButtons();
}