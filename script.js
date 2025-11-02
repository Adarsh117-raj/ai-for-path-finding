const gridSize = 10;
const cellSize = 50;
let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
let start = null, goal = null, mode = 'start';

const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.fillStyle = grid[i][j] === -1 ? 'black' : 'white';
            if (start && start[0] === i && start[1] === j) ctx.fillStyle = 'green';
            if (goal && goal[0] === i && goal[1] === j) ctx.fillStyle = 'red';

            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

function setMode(newMode) {
    mode = newMode;
}

canvas.addEventListener('click', function(event) {
    let x = Math.floor(event.offsetY / cellSize);
    let y = Math.floor(event.offsetX / cellSize);

    if (mode === 'start') start = [x, y];
    else if (mode === 'goal') goal = [x, y];
    else if (mode === 'obstacle') grid[x][y] = -1;

    drawGrid();
});

function findPath() {
    if (!start || !goal) {
        alert("Set Start and Goal first!");
        return;
    }

    fetch('/find_path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid, start, goal })
    })
    .then(response => response.json())
    .then(data => drawPath(data.path));
}

function drawPath(path) {
    ctx.fillStyle = 'blue';
    for (let [x, y] of path) {
        ctx.fillRect(y * cellSize + 15, x * cellSize + 15, 20, 20);
    }
}

function resetGrid() {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    start = null; goal = null;
    drawGrid();
}

drawGrid();
