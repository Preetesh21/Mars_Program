const express = require('express');
const Datastore = require('nedb');
const app = express();
app.listen(3000, () => { console.log("Listening on port 3000") })
app.use(express.static('public'))
app.use(express.json({ limit: '2mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

const database2 = new Datastore('database2.db');
database2.loadDatabase();

app.post('/api', (request, response) => {
    console.log(request.body);
    const timestamp = Date.now();
    const data = request.body;
    data.timestamp = timestamp;
    database.insert(data);
})

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end()
            return;
        }
        response.json(data);
    });
});

app.post('/api2', (request, response) => {
    console.log(request.body);
    const timestamp = Date.now();
    const data = request.body;
    data.timestamp = timestamp;
    database2.insert(data);
})

app.get('/api2', (request, response) => {
    database2.find({}, (err, data) => {
        if (err) {
            response.end()
            return;
        }
        response.json(data);
    });
});