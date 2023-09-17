import Tetris from "../Tetris.js";
import Score from "../Score.js";
import R from "../ramda.js";

const example_game = Tetris.new_game();
const field_string = `----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
-S--------
SSS-------
SSSZ-IOOJJ
TSZZ-IOOJJ
TTZL-IOOJJ
TLLL-IOOJJ`;
example_game.field = field_string.split("\n").map(
    (s) => s.replace(/-/g, " ").split("")
);

describe("Score", function () {
    it(
        `A new tetris game
        * Starts on level one
        * With no lines cleared
        * With a score of zero`,
        function () {
            const new_game = Tetris.new_game();
            const score = new_game.score;
            if (Score.level(score) !== 1) {
                throw new Error("New games should start on level one");
            }
            if (score.lines_cleared !== 0) {
                throw new Error("New games should have no lines cleared");
            }
            if (score.score !== 0) {
                throw new Error("New games should have a zero score");
            }
        }
    );

    it(
        `The score tracks the lines that get cleared`,
        function () {
            let game = example_game;
            // Slot an I tetromino into the hole and drop.
            game.current_tetromino = Tetris.I_tetromino;
            game = Tetris.rotate_ccw(game);
            game = Tetris.hard_drop(game);

            if (game.score.lines_cleared !== 4) {
                throw new Error("Expecting 4 lines to clear");
            }
        }
    );

    it(
        `A single line clear scores 100 × level`,
        function () {
            let game = example_game;
            // Slot a T tetromino into the hole and drop.
            // This can only go one deep.
            game.current_tetromino = Tetris.Z_tetromino;

            // I could use hard_drop here, but that would also score.
            // Instead wait for it to drop 22 times.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });

            if (game.score.score !== 100) {
                throw new Error("A single row cleared should score 100");
            }
        }
    );

    it(
        `A double line clear scores 300 × level`,
        function () {
            let game = example_game;
        // Slot a T tetromino into the hole and drop it twice.
            game.current_tetromino = Tetris.Z_tetromino;

        // Wait for it to drop 22 times to clear one line.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });

            if (game.score.score !== 300) {
                throw new Error("A double line clear should score 300");
            }
        }
    );

    it(
        `A triple line clear scores 500 × level`,
        function () {
            let game = example_game;
            // Slot a T tetromino into the hole and drop it three times.
            game.current_tetromino = Tetris.Z_tetromino;
    
            // Wait for it to drop 22 times to clear one line.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
    
            if (game.score.score !== 500) {
                throw new Error("A triple line clear should score 500");
            }
        }
    );

    it(
        `A tetris scores 800 × level`,
        function () {
            let game = example_game;
        // Slot a T tetromino into the hole and drop it four times.
            game.current_tetromino = Tetris.Z_tetromino;

        // Wait for it to drop 22 times to clear four lines.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });

            if (game.score.score !== 800) {
                throw new Error("A tetris should score 800");
            }
        }
    );

    it(
        `Back to back tetrises score 1200 × level`,
        function () {
            let game = example_game;
        // Slot a T tetromino into the hole and drop it four times to get a tetris.
            game.current_tetromino = Tetris.T_tetromino;

        // Wait for it to drop 22 times to clear four lines.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });

        // Start a new game and do the same again for back-to-back tetrises.
            game = Tetris.new_game();
            game.current_tetromino = Tetris.T_tetromino;
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });

            if (game.score.score !== 1200) {
                throw new Error("Back-to-back tetrises should score 1200");
            }
        }
    );

    it(
        `A soft drop score 1 point per cell descended`,
        function () {
            // Creates a new game instance.
            let game = example_game;
            // Gets the initial score.
            const initialScore = game.score.score;
            // Performs a soft drop once.
            const gameAfterSoftDrop = Tetris.soft_drop(game);
            // Gets the updated score.
            const updatedScore = gameAfterSoftDrop.score.score;
            // Calculates the expected score increase (1 point per cell).
            const expectedScoreIncrease = game.current_tetromino.grid.length;
    
            // Verifies that the score increased by the expected amount.
            if (updatedScore !== initialScore + expectedScoreIncrease) {
                throw new Error("Soft drop should score 1 point per cell descended");
            }
        }
    );

    it(
        `A hard drop score 2 point per cell descended`,
        function () {
            let game = example_game;
            // Gets the initial score.
            const initialScore = game.score.score;
            // Performs a soft drop once.
            const gameAfterHardDrop = Tetris.hard_drop(game);
            // Gets the updated score.
            const updatedScore = gameAfterHardDrop.score.score;
            // Calculates the expected score increase (2 points per cell).
            const expectedScoreIncrease = 2*(game.current_tetromino.grid.length);
    
            // Verifies that the score increased by the expected amount.
            if (updatedScore !== initialScore + expectedScoreIncrease) {
                throw new Error("Soft drop should score 1 point per cell descended");
            }
        }
    );

    it(
        `Advancing the turn without manually dropping scores nothing.`,
        function () {
            let game = example_game;
            // Slot a T tetromino into the hole and advance the turn without dropping.
            game.current_tetromino = Tetris.T_tetromino;
            game = Tetris.next_turn(game);
    
            if (game.score.score !== 0) {
                throw new Error("Advancing the turn without manually dropping should score 0");
            }
        }
    );
});
