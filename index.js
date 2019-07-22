const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Users = require('./users/model');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 14);
  try {
    const response = await Users.create({
      username,
      password: hashedPassword
    });
    res.status(201).json(response);
  } catch (error) {
    next(new Error(error.message));
  }
});

server.post('/api/login', checkCredentialsInBody, async (req, res, next) => {
  try {
    const user = req.user;
    res.json({ message: `Welcome back, ${user.username}` });
  } catch (error) {
    next(new Error(error.message));
  }
});

server.get('/api/users', restricted, async (req, res, next) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    next(new Error(error.message));
  }
});

server.use('/api/restricted', restricted);

server.get('/api/restricted/users', async (req, res, next) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    next(new Error(error.message));
  }
});


async function checkCredentialsInBody(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ message: 'Incorrect credentials' });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(new Error(error.message));
  }
};

async function restricted(req, res, next) {
  try {
    const { username, password } = req.headers;
    if (username && password) {
      const user = await Users.findBy({ username }).first();
      if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401).json({ message: 'Incorrect credentials' });
      } else {
        req.user = user;
        next();
      }
    } else {
      res.status(401).json({ message: 'You are not identified'});
    }
  } catch (error) {
    next(new Error(error.message));
  }
};

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
