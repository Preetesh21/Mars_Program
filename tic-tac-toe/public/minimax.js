function bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // Is the spot available?
            if (board[i][j] == '') {
                board[i][j] = ai;
                let score = minimax(board, 0, false);

                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };

                }
            }
        }
    }
    board[move.i][move.j] = ai;
    currentPlayer = human;

}

function bestMove2(x) {
    // AI to make its turn
    if (x)
        var d = 25;
    else
        d = -25;
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // Is the spot available?
            if (board[i][j] == '') {
                board[i][j] = ai;
                let score = minimax2(board, d, x);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };

                }
            }
        }
    }
    if (move != null)
        console.log(move.j, move.i, 'human')
        //return (move.j, move.i);
    alert("HINT:-\n" + "You can have your next move at ("+move.j + ","+move.i+").\n ie X axis : " + move.j + ' and Y axis : ' + move.i + "\n\n Note: This is only a Hint.");
}


let scores = {
    X: 10,
    O: -10,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // Is the spot available?
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false) + random(-difficulties[difficulty], difficulties[difficulty]);
                    board[i][j] = '';
                    bestScore = max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // Is the spot available?
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true) + random(-difficulties[difficulty], difficulties[difficulty]);
                    board[i][j] = '';
                    bestScore = min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}



function minimax2(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // Is the spot available?
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = minimax2(board, depth + 1, false) + random(-difficulties[5], difficulties[5]);
                    board[i][j] = '';
                    bestScore = max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // Is the spot available?
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = minimax2(board, depth + 1, true) + random(-difficulties[5], difficulties[5]);
                    board[i][j] = '';
                    bestScore = min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}
