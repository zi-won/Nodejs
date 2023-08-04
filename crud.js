var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

let memos = [];

app.post('/memos', (req, res) => {
  const { title, content } = req.body;
  const newMemo = { id: Date.now(), title, content };
  memos.push(newMemo);
  res.json(newMemo);
});

app.get('/memos', (req, res) => {
  res.json(memos);
});

app.put('/memos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const memoToUpdate = memos.find((memo) => memo.id === id);
  if (!memoToUpdate) {
    return res.status(404).json({ message: 'Memo not found' });
  }

  memoToUpdate.title = title;
  memoToUpdate.content = content;

  res.json(memoToUpdate);
});

app.delete('/memos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  memos = memos.filter((memo) => memo.id !== id);

  res.sendStatus(204);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
