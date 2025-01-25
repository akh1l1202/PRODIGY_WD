const modeSelection = document.getElementById('mode-selection');
const gameArea = document.getElementById('game-area');
const board = document.getElementById('board');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const modeBtnChange = document.getElementById('mode-btn');
const pvpBtn = document.getElementById('pvp-btn');
const pvcBtn = document.getElementById('pvc-btn');
const xTurn = document.querySelector('.turn.x');
const oTurn = document.querySelector('.turn.o');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = '';

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
    [0, 4, 8], [2, 4, 6]  // Diagonals
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = clickedCell.getAttribute('data-index');

    if (gameBoard[cellIndex] !== '' || !gameActive) return;

    gameBoard[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    if (checkResult()) return;

    if (gameMode === 'pvc' && currentPlayer === 'X') {
        currentPlayer = 'O';
        updateStatus();
        setTimeout(computerMove, 500);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function computerMove() {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const computerCell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
        gameBoard[randomIndex] = 'O';
        computerCell.textContent = 'O';
        computerCell.classList.add('o');
        
        checkResult();
        currentPlayer = 'X';
        updateStatus();
    }
}

function checkResult() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameBoard[a] && 
            gameBoard[a] === gameBoard[b] && 
            gameBoard[a] === gameBoard[c]
        ) {
            xTurn.classList.remove('active');
            oTurn.classList.remove('active');
            status.textContent = `${currentPlayer} Wins!`;
            gameActive = false;
            return true;
        }
    }

    if (!gameBoard.includes('')) {
        xTurn.classList.remove('active');
        oTurn.classList.remove('active');
        status.textContent = "It's a Draw!";
        gameActive = false;
        return true;
    }
    return false;
}

function updateStatus() {
    if (gameActive) {
        if (currentPlayer === 'X') {
            xTurn.classList.add('active');
            oTurn.classList.remove('active');
        } else {
            oTurn.classList.add('active');
            xTurn.classList.remove('active');
        }
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });

    xTurn.classList.add('active');
    oTurn.classList.remove('active');

    if (gameMode === 'pvc') {
        setTimeout(() => {
            if (Math.random() < 0.5) {
                computerMove();
            }
        }, 0);
    }
}

function changeMode() {
    modeSelection.style.display = 'flex';
    gameArea.style.display = 'none';
    gameMode = '';
}

pvpBtn.addEventListener('click', () => {
    gameMode = 'pvp';
    modeSelection.style.display = 'none';
    gameArea.style.display = 'block';
    resetGame();
});

pvcBtn.addEventListener('click', () => {
    gameMode = 'pvc';
    modeSelection.style.display = 'none';
    gameArea.style.display = 'block';
    resetGame();
});

board.addEventListener('click', handleCellClick);
resetBtn.addEventListener('click', resetGame);
modeBtnChange.addEventListener('click', changeMode);