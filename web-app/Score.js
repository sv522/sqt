/**
 * @namespace Score
 * @author A. Freddie Page
 * @version 2022.23
 * This module provides the scoring system for a Tetris Game.
 */
const Score = {};


/**
 * The score object contains information about the score of the game.
 * Currently it is implemented as a single number,
 * but could include other information such as the number of lines cleared.
 * @typedef {object} Score
 * @memberof Score
 * @property {number} score The current score in the game.
 * @property {number} lines_cleared The number of lines cleared in the game.
 * @property {boolean} last_cleared_tetris Indicates if the last line cleared was a tetris.
 */

/**
 * Returns a game state for a new Tetris Game.
 * @function
 * @memberof Score
 * @returns {Score.Score} The new game.
 */
Score.new_score = function () {
    return {
        "score": 0, //score is initially set to 0
        "lines_cleared": 0, //lines cleared is initially set to 0
        last_cleared_tetris: false // Initialize last_cleared_tetris as false
    };
};

/**
 * Returns the level based on the number of lines cleared in the game.
 * You start at level 1, and advance a level every 10 lines cleared.
 * @function
 * @memberof Score
 * @param {Score.Score} score - The game score object.
 * @returns {number} Returns the current level.
 */
 Score.level = function (score) {
    // Calculate the level based on the number of lines cleared.
    return Math.floor(score.lines_cleared / 10) + 1;
};

/**
 * Adds cleared lines to the score and calculates the new score.
 * @function
 * @memberof Score
 * @param {number} linesCleared - The number of lines cleared in the game.
 * @param {Score.Score} currentScore - The current game score object.
 * @returns {Score.Score} The updated game score object.
 */
 Score.cleared_lines = function (linesCleared, currentScore) {
    const newScore = { ...currentScore }; // A copu of the current score object is created 

    // Checking if the last cleared lines were a tetris (4 lines)
    if (linesCleared === 4) { 
        newScore.last_cleared_tetris = true; //set the last_cleared_tetris to true 
    } else {
        newScore.last_cleared_tetris = false;  //set the last_cleared_tetris to false
    }

    // Calculate the points based on the number of lines cleared and the current level
    let points = 0;
    if (linesCleared === 1) {
        points = 100 * Score.level(newScore);
    } else if (linesCleared === 2){
        points = 300 * Score.level(newScore);
    } else if (linesCleared === 3){
        points = 500 * Score.level(newScore);
    } else {
        if (linesCleared === 4 && newScore.last_cleared_tetris){
            // Score for a tetris, and additional points for back-to-back tetrises
            points = 1200 * Score.level(newScore);
        } else {
            points = 800 * Score.level(newScore);
            }
    }

    // Update the properties in the new score object
    newScore.lines_cleared += linesCleared;
    newScore.score += points;

    return newScore;
};
/**
 * Adds a given number of points to the score.
 * @function
 * @memberof Score
 * @param {Score.Score} score - The current game score object.
 * @param {number} points - The number of points to add.
 * @returns {Score.Score} The updated game score object.
 */
 Score.add_points = function (score, points) {
    const newScore = { ...score }; // Create a copy of the current score object
    newScore.score += points; // Add the points to the score
    return newScore; // Return the updated score object
};


export default Object.freeze(Score);

