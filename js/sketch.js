// Tic Tac Toe AI with Minimax Algorithm
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/154-tic-tac-toe-minimax.html
// https://youtu.be/I64-UTORVfU
// https://editor.p5js.org/codingtrain/sketches/0zyUhZdJD

var firebaseConfig = {
    apiKey: "AIzaSyDGRhHYAFRqP0tjHYtV1u1WmOct5lVuyaU",
    authDomain: "trial-1cd60.firebaseapp.com",
    databaseURL: "https://trial-1cd60.firebaseio.com",
    projectId: "trial-1cd60",
    storageBucket: "trial-1cd60.appspot.com",
    messagingSenderId: "169024788730",
    appId: "1:169024788730:web:738318b34e6f0043a99143",
    measurementId: "G-9NTKE56GSZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
console.log(firebase);
var database = firebase.database();
console.log(database)
var ref = database.ref('score')



ref.on('value', gotData, erData)

function gotData(data) {
    console.log(data.val());
    var scores = data.val();
    var keys = Object.keys(scores);
    console.log(keys)
    const namess = []
    const scoress = []
    for (var i = 0; i < keys.length; i = i + 1) {
        namess.push(scores[keys[i]].name);
        scoress.push(scores[keys[i]].score);
    }
    let ii = scoress.indexOf(Math.max(...scoress));
    console.log(ii)
    console.log(scoress[ii], namess[ii])
    console.log(scoress)

    sttr.innerHTML = ' Highest score:: ' + scoress[ii] + ' by ' + namess[ii];
    document.getElementById('canvas-container').appendChild(sttr);
}


function erData(err) {
    console.log(err);
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
let pp = document.createElement('p');

let ppp = document.getElementById('score');
let submit_button = document.getElementById('submit');
let sttr = document.createElement('h3')
submit_button.addEventListener('click', fnc);

function fnc() {
    console.log(score);
    console.log(document.getElementById('input').value)
    var data = {
        name: document.getElementById('input').value,
        score: score
    }
    ref.push(data)
    score = 0;
    ppp.innerHTML = "Your score is submitted"
}


function setup() {
    createCanvas(500, 400).parent("canvas-container");
    resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', reset);
    resultP = document.getElementById('winner');
    DifficultySlider = select("#difficulty");
    DifficultySlider.input(() => {
        if (difficulty != DifficultySlider.value()) {
            difficulty = DifficultySlider.value() - 1
        }
    });
    console.log(difficulty)
    let pp = document.createElement('p');
    pp.innerHTML = "</h3><br><h3>Difficulty levels explained</h3><ol><li>almost completly random</li><li>significant randomness in moves</li><li>major randomness in moves</li><li>minor randomness in moves</li><li>insignificant randomness in moves</li><li>Unbeatable</li></ol>";
    document.getElementById('info-bar').appendChild(pp);
    board = create2DArray(n, n, "");
    w = width / n;
    h = height / n;
    console.log(document.getElementById('input_check').checked)
    if (document.getElementById('input_check').checked) {
        bestMove();
        currentPlayer = human;
    }
}


function reset() {
    ppp.innerHTML = "Your Score is " + score
    draw()
    resultP.innerHTML = ''
    board = create2DArray(n, n, "");
    w = width / n;
    h = height / n;
    console.log(document.getElementById('input_check').checked)
    if (document.getElementById('input_check').checked) {
        bestMove();

    }
    currentPlayer = human;
    console.log(result)
    if (result == human) {
        console.log('dfef')
        score = score + 10 * difficulty
        console.log(score);
        ppp.innerHTML = "Your Score is " + score
    }

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
    if (diagonal) return first
    first = board[0][n - 1];
    let back_diag = first != "";
    for (let i = 1; i <= n; i++) {
        if (board[i - 1][n - i] != first) {
            back_diag = false
            break
        }
    }
    if (back_diag) return first

    for (let i = 0; i < n; i++) {
        first = board[i][0]
        let sideways = first != ""
        for (let j = 0; j < n; j++) {
            if (board[i][j] != first) {
                sideways = false
                break
            }
        }
        if (sideways)
            return first
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
        if (sideways)
            return first
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
    if (currentPlayer == human) {
        // Human make turn
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        // If valid turn
        if (i >= 0 && i < n) {
            if (board[i][j] == '') {
                board[i][j] = human;
                currentPlayer = ai;
                bestMove();
            }
        }
    }
});

function draw() {
    background(255);
    strokeWeight(4);
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
                ellipse(x, y, r * 2);
            } else if (spot == ai) {
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