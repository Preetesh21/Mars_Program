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

let score = 0;

const ele = document.getElementById('canvas');
stt = document.createElement('H1')
str = document.getElementById('trial')
score_button = document.getElementById('score_button')
submit_button = document.getElementById('submit_button')

sttr = document.createElement('H1')

score_button.addEventListener('click', () => {
    score += 1;
    console.log(score)
    stt.innerHTML = ' I am ur score:: ' + score;
    ele.appendChild(stt);
})

submit_button.addEventListener('click', () => {

    stt.innerHTML = 'Thank you !!!';
    sttr.innerHTML = ''
    ele.appendChild(stt);
    console.log(document.getElementById('fnames').value)
    name = document.getElementById('fnames').value
    var data = {
        name: name,
        score: score
    }
    ref.push(data)
    score = 0;
})

str.addEventListener('mouseover', () => {
    submit_button.style.color = 'red'
    score_button.style.color = 'green'

})

str.addEventListener('mouseout', () => {
    submit_button.style.color = 'black'
    score_button.style.color = 'black'
})

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
    ele.appendChild(sttr);
}


function erData(err) {
    console.log(err);
}