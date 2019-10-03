const express = require('express');
const server = express();
const usersRouter = require('./users/userRouter')
const postsRouter = require('./posts/postRouter')

server.use(express.json());
server.use(logger)
server.use('/api/users', usersRouter)
server.use('/api/posts', postsRouter)

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

function logger(req, res, next) {
  const info = {
    req_method: req.method,
    req_url: req.url,
    timestamp: Date.now()
  }
  console.log('')
  console.log(info)
  next();
};

module.exports = server;