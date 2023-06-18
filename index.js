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

app.put('/persons/:id', (req, res, next) => {
  const { name, number } = req.body;
  Contact.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(200).end();
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/persons', (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'data is missing'
    });
  }
  let existingContact = false;
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      if (contact.name === req.body.name) {
        existingContact = true;
      }
    });
  });
  if (existingContact) {
    console.log('name must be unique');
    res.status(404).json({ error: 'name must be unique' }).end();
  } else {
    const contact = new Contact({
      name: req.body.name,
      number: req.body.number
    });

    contact
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        next(error);
      });
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.name);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response
      .status(400)
      .send({
        error: 'Min length of the name 2 characters,  number - 5 characters'
      });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT);
