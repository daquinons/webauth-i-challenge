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

server.post('/api/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findBy({ username }).first();
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ message: 'Incorrect credentials' });
    } else {
      res.json({ message: `Welcome back, ${username}` });
    }
  } catch (error) {
    next(new Error(error.message));
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
