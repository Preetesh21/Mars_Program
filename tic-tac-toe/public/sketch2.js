var colors = ["#FFDF00", '#bb0000', '#ffffff'];

getData();

async function getData() {
    const response = await fetch('/api2');
    const datass = await response.json();
    console.log(datass);
    const namesss = []
    const scoresss = []
    for (items in datass) {
        namesss.push(datass[items].name1);
        scoresss.push(datass[items].score1);
        namesss.push(datass[items].name2);
        scoresss.push(datass[items].score2);
    }
    console.log(scoresss, namesss)
    let ii = scoresss.indexOf(Math.max(...scoresss));
    console.log(scoresss[ii], namesss[ii]);
    document.getElementById('high-score').innerHTML = ' Highest score:: ' + scoresss[ii] + ' by ' + namesss[ii];
    document.getElementById('high-score2').innerHTML = ' Highest score:: ' + scoresss[ii] + ' by ' + namesss[ii];
}

function create2DArray(rows, cols, filler = 0) {
    return new Array(rows).fill().map(() => new Array(cols).fill(filler));
}

let difficulties = [20, 15, 10, 5, 1, 0]

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

var w; // = width / 3;
var h; // = height / 3;
var result;
let ai = 'X';
let human = 'O';
let currentPlayer = human;
let n = 3;
let resultP;
let DifficultySlider;
let difficulty = 5;
let DifficultyInfo;
let resetButton;
let score = 0;
let score2 = 0;
let pp = document.createElement('p');

let ppp = document.getElementById('score');
let pppp = document.getElementById('score2');
let submit_button = document.getElementById('submit');
let sttr = document.createElement('h3')
submit_button.addEventListener('click', () => {
    if (document.getElementById('input').value != '' && document.getElementById('input1').value != '') {
        fnc();
        document.getElementById('input').value = '';
        document.getElementById('input1').value = '';
    } else {
        alert('Please write your name');
    }

});

document.getElementById('hint-button').addEventListener('click', () => {
    if (document.getElementById('input_check').checked) {
        bestMove2(true);
    } else {
        bestMove2(false);
    }
});

function fnc() {
    var data = {
            name1: document.getElementById('input').value,
            score1: score,
            name2: document.getElementById('input1').value,
            score2: score2
        }
        // ref.push(data)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/api2', options);

    score = 0;
    score2 = 0;
    ppp.innerHTML = "Your score is submitted";
    pppp.innerHTML = 'Your score is submitted';
    getData();

}


function setup() {
    var cnv = createCanvas(500, 400);
    cnv.parent("canvas-container");
    cnv.id("canvas");
    var canv = document.getElementById("canvas");

    canv.style.width = "30vw";
    canv.style.height = "30vw";

    resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', reset);
    resultP = document.getElementById('winner');
    difficulty = 5;
    board = create2DArray(n, n, "");
    w = width / n;
    h = height / n;
    if (document.getElementById('input_check').checked) {
        //bestMove();
        currentPlayer = ai;
    }
}


function reset() {
    ppp.innerHTML = "Score:" + score;
    pppp.innerHTML = "Score:" + score2;
    draw()
    resultP.innerHTML = ''
    board = create2DArray(n, n, "");
    w = width / n;
    h = height / n;
    if (document.getElementById('input_check').checked) {
        currentPlayer = ai;
    } else
        currentPlayer = human
    if (result == human)
        score = score + 10;

    else if (result == ai)
        score2 = score2 + 10;
    pppp.innerHTML = "Score:" + score;
    ppp.innerHTML = "Score:" + score2;

}

function equals3(a, b, c) {
    return a == b && b == c && a != '';
}

function checkWin(board) {
    let first = board[0][0];
    let diagonal = first != ""
    let n = board.length;
    for (let i = 0; i < n; i++) {
        if (board[i][i] != first) {
            diagonal = false
            break
        }
    }
    if (diagonal) {
        if (first == human) { stroke(255, 0, 0); } else { stroke(0, 0, 255); }
        line(0, 0, w, h);
        line(w, h, 2 * w, 2 * h);
        line(2 * w, 2 * h, 3 * w, 3 * h);
        return first;
    }
    first = board[0][n - 1];
    let back_diag = first != "";
    for (let i = 1; i <= n; i++) {
        if (board[i - 1][n - i] != first) {
            back_diag = false
            break
        }
    }
    if (back_diag) {
        if (first == human) { stroke(255, 0, 0); } else { stroke(0, 0, 255); }
        line(0, 3 * h, w, 2 * h);
        line(w, 2 * h, 2 * w, h);
        line(2 * w, h, 3 * w, 0);
        return first;
    }
    for (let i = 0; i < n; i++) {
        first = board[i][0]
        let sideways = first != ""
        for (let j = 0; j < n; j++) {
            if (board[i][j] != first) {
                sideways = false
                break
            }
        }
        if (sideways) {
            if (first == human) { stroke(255, 0, 0); } else { stroke(0, 0, 255); }
            line(i * w + w / 2, 0, i * w + w / 2, 3 * h);
            return first
        }

    }

    for (let i = 0; i < n; i++) {
        first = board[0][i]
        let sideways = first != ""
        for (let j = 0; j < n; j++) {
            if (board[j][i] != first) {
                sideways = false
                break
            }
        }
        if (sideways) {
            if (first == human) { stroke(255, 0, 0); } else { stroke(0, 0, 255); }
            line(0, i * h + h / 2, 3 * w, i * h + h / 2);
            return first;
        }
    }

    let openSpots = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] == '') {
                openSpots++;
            }
        }
    }

    if (openSpots == 0) {
        return 'tie';
    }
    return null;
}

function checkWinner() {
    return checkWin(board)
}


window.addEventListener('click', e => {
    if (!checkWinner()) {
        if (currentPlayer == human) {
            // Human make turn
            let i = floor(mouseX / w);
            let j = floor(mouseY / h);
            // If valid turn
            if (i >= 0 && i < n) {
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let result = checkWinner();
                    if (result !== null) {
                        return scores[result];
                    }
                    currentPlayer = ai;
                }
            }
        } else {
            console.log('hh')
            let i = floor(mouseX / w);
            let j = floor(mouseY / h);
            // If valid turn
            if (i >= 0 && i < n) {
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let result = checkWinner();
                    if (result !== null) {
                        return scores[result];
                    }
                    currentPlayer = human;
                }
            }
        }
    }
});

function draw() {
    background(0);
    strokeWeight(4);
    fill(0);
    stroke(255);
    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, width, h);
    line(0, h * 2, width, h * 2);

    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = board[i][j];
            textSize(32);
            let r = w / 4;
            if (spot == human) {
                stroke(255, 0, 0);
                ellipse(x, y, r * 2);
            } else if (spot == ai) {
                stroke(0, 0, 255);
                line(x - r, y - r, x + r, y + r);
                line(x + r, y - r, x - r, y + r);
            }
        }
    }

    result = checkWinner();
    if (result != null) {
        resultP.style.fontSize = '32px';
        if (result == 'tie') {
            resultP.innerHTML = 'Tie!';

        } else {

            resultP.innerHTML = `${result} wins!`;
        }
    }
}