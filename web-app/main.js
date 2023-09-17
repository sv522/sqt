import R from "./ramda.js";
import Tetris from "./Tetris.js";
import Score from "./Score.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");

const cells = R.range(0, grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = R.range(0, grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const update_grid = function () {

    const currentScoreElement = document.getElementById("current-score");
    const linesClearedElement = document.getElementById("lines-cleared");
    const currentLevelElement = document.getElementById("current-level");

    // Update the HTML elements with score information
    currentScoreElement.textContent = game.score.score;
    linesClearedElement.textContent = game.score.lines_cleared;
    currentLevelElement.textContent = Score.level(game.score);

    // First display the grid of locked in blocks
    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    // Display ghost tetromino
    const ghost_game = R.reduce(Tetris.soft_drop, game, R.range(0, 22));
    Tetris.tetromino_coordiates(
        ghost_game.current_tetromino,
        ghost_game.position
    ).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell ghost ${ghost_game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );

    // Display currently dropping tetromino
    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );

    // Add code below to display the score information.

};

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    update_grid();
};

const timer_function = function () {
    const currentLevel = Score.level(game.score);
    const nextTurnTime = 2500 / (currentLevel + 4);

    game = Tetris.next_turn(game);
    update_grid();

    // Set the timer for the next turn
    setTimeout(timer_function, nextTurnTime);
};

// This first timeout starts the game. It's only called once.
// From here on, the timer_function above is called.
setTimeout(timer_function, 500);

