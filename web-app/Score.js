/**
 * @namespace Score
 * @author A. Freddie Page
 * @version 2022.23
 * @description Provides the scoring system for a Tetris Game.
 */
 const Score = {};

 /**
  * Represents the score, lines cleared, and last clear status in a Tetris game.
  * @typedef {Object} Score_Object
  * @property {number} score - Current score of the game.
  * @property {number} lines_cleared - Total number of lines cleared.
  * @property {boolean} last_cleared_tetris - Indicates if the last cleared
  * //lines were a Tetris (4 lines).
  * @memberof Score
  */
 /**
  * Initializes a new score object for a Tetris game.
  * @function
  * @memberof Score
  * @returns {Score.Score_Object} Initialized score object.
  */
 Score.new_score = function () {
     return {
         "score": 0,
         "lines_cleared": 0,
         "last_cleared_tetris": false
     };
 };
 /**
  * Computes the current level based on lines cleared.
  * @memberof Score
  * @param {Score.Score_Object} score - Current score object.
  * @returns {number} Current level.
  */
 Score.level = function (score) {
     return Math.floor(score.lines_cleared / 10) + 1;
 };
 /**
 * Adds cleared lines to the score and calculates the new score.
 * @function
 * @memberof Score
 * @param {number} numLines - The number of lines cleared in the game.
 * @param {Score.Score_Object} currentScore - The current game score object.
 * @returns {Score.Score_Object} The updated game score object.
 */
  Score.cleared_lines = function (numLines, currentScore) {

    if (numLines === 4) { 
        currentScore.last_cleared_tetris = true; //set the last_cleared_tetris
        //to true
    } else {
        currentScore.last_cleared_tetris = false;  //set the
        //last_cleared_tetris to false
    }

    // Calculate the points based on the number of lines cleared
    //and the current level
    let points = 0;
    if (numLines === 1) {
        points = 100 * Score.level(currentScore);
    } else if (numLines === 2){
        points = 300 * Score.level(currentScore);
    } else if (numLines === 3){
        points = 500 * Score.level(currentScore);
    } else if (numLines === 4){ 
        if (currentScore.last_cleared_tetris){
        // Score for a tetris, and additional points for back-to-back tetrises
            points = 1200 * Score.level(currentScore);
        } else {
            points = 800 * Score.level(currentScore);
            }
    }
    return {
        ...currentScore,
        score: currentScore.score + points,
        lines_cleared: currentScore.lines_cleared + numLines,
        last_cleared_tetris: numLines === 4
    };
 };

 /**
  * Adds points to the current score.
  * @memberof Score
  * @param {number} points_to_be_added - Points to be added.
  * @param {Score.Score_Object} currentScore - Current score object.
  * @returns {Score.Score_Object} Updated score object with added points.
  */
 Score.add_points = function(points_to_be_added, currentScore) {
     return {
         ...currentScore,
         score: currentScore.score + points_to_be_added
     };
 };
 export default Object.freeze(Score);