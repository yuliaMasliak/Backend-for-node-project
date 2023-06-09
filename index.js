require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/notes');

const app = express();
app.use(cors());
app.use(express.json());

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :body')
);

app.get('/', (req, res) => {
  res.send('Start page');
});
app.get('/info', (req, res) => {
  let date = new Date();
  res.send(`Pnhonebook has info for ${notes.length} people<br/>${date}`);
});

app.get('/persons', (req, res) => {
  Contact.find({}).then((result) => {
    res.json(result);
  });
});

app.get('/persons/:id', (req, res) => {
  Contact.find({ id: req.params.id }).then((contact) => {
    res.json(contact);
  });
});

app.delete('/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const array = notes.filter((el) => el.id !== id);
  notes = array;
  res.json(array);
});

app.post('/persons', (req, res) => {
  console.log('post');
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'data is missing'
    });
  }

  // Contact.find({}).then((result) => {
  //   result.forEach((contact) => {
  //     if (contact.name === req.body.name) {
  //       console.log('name must be unique');
  //       return res.status(404).json({ error: 'name must be unique' });
  //     }
  //   });
  // });

  const contact = new Contact({
    name: req.body.name,
    number: req.body.number
  });

  contact.save().then((result) => {
    res.json(result);
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT);
