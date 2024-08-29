const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const notes = require('./db/db.json');

const app = express();
const PORT = 3001;

console.log('hello');

app.use(express.static('public'));
app.use(express.json());

const dbLocation = path.join(__dirname, 'db', 'db.json');

app.get('/', (req, res) => {
  console.log('hello2');
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  console.log('hello3');
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  const readFile = fs.readFileSync(dbLocation, 'utf8');
  const parser = JSON.parse(readFile);
  res.json(parser);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved to add a post`)

  const { title, text } = req.body;

  if (title && text) {
    const newPost = {
      title,
      text,
      id: uuidv4(),
    };
    const response = {
      status: 'success',
      body: newPost,
    };
    console.log(response);
    res.status(201).json(response);

    const readFile = fs.readFileSync(dbLocation, 'utf8');
    const parser = JSON.parse(readFile);
    const count = parser.push(newPost);
    console.log(`There are ${count} objects in your array.`)
    console.log(parser);
    const conjoinedFile = JSON.stringify(parser);

    fs.writeFileSync(dbLocation, conjoinedFile);
  } else {
    res.status(500).json('Cannot post note')
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});