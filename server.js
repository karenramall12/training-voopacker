const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

let videos = [];

app.use(bodyParser.json());
app.use(cors());

app.get('/videos', (req, res) => {
    res.json(videos);
});

app.post('/videos', (req, res) => {
    const video = req.body;
    videos.push(video);
    res.status(201).json(video);
});

app.delete('/videos', (req, res) => {
    const { link } = req.body;
    videos = videos.filter(video => video.link !== link);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});