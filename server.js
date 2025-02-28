const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 6000;

let videos = [];

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

app.get('/videos', (req, res) => {
    console.log('GET /videos');
    res.json(videos);
});

app.post('/videos', (req, res) => {
    const video = req.body;
    videos.push(video);
    console.log('POST /videos', video);
    res.status(201).json(video);
});

app.delete('/videos', (req, res) => {
    const { link } = req.body;
    videos = videos.filter(video => video.link !== link);
    console.log('DELETE /videos', link);
    res.status(204).send();
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});