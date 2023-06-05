const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :body')
);

let notes = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((el) => el.id === id);
  res.json(notes.find((el) => el.id === id));
});

app.get('/info', (req, res) => {
  let date = new Date();
  res.send(`Pnhonebook has info for ${notes.length} people<br/>${date}`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  let ids = notes.map((el) => {
    el.id;
  });
  if (ids.indexOf(id) < 0) {
    return res.status(400).json({
      error: 'id missing'
    });
  }
  notes.forEach((el, i) => {
    if (el.id == id) {
      res.json(el);
    }
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const array = notes.filter((el) => el.id !== id);
  console.log(array);
  res.json(array);
});

app.post('/api/persons', (req, res) => {
  const idGenerator = () => {
    return notes.length ? Math.max(...notes.map((note) => note.id)) + 1 : 0;
  };
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'data is missing'
    });
  }
  notes.forEach((el) => {
    if (el.name === req.body.name) {
      return res.status(400).json({
        error: 'name must be unique'
      });
    }
  });

  const note = {
    id: idGenerator(),
    name: req.body.name,
    number: req.body.number
  };

  notes = notes.concat(note);
  res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
