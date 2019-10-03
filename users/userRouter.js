const express = require('express');
const userDB = require('./userDb');
const postDB = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const Data = req.body;

    userDB
    .insert(Data)
    .then(data => {
        res.status(201).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    req.body.user_id = req.params.id
    const Data = req.body;
    
    postDB
    .insert(Data)
    .then(data => {
        res.status(201).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    });
});

router.get('/', (req, res) => {
    userDB
    .get()
    .then(users => {
        res.status(200).json(users)
    })
   
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const id = req.params.id

    userDB
    .getUserPosts(id)
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => res.status(500).json({ error: "Error getting users"}))
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id

    userDB
    .remove(id)
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => res.status(500).json({ error: "Error getting users"}))
});

router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    const Data = req.body;

    userDB
    .update(id, Data)
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => res.status(500).json({ error: "Error getting users"}))
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id
    
    userDB
    .getById(id)
    .then(user => {
        user ? req.user = user
        : ''

        !user ? res.status(404).json({ message: "invalid user id"})
        : next()
    })
    .catch(error => res.status(500).json({ error: "Error getting users"}))
};

function validateUser(req, res, next) {
    const Data = req.body;
    Object.entries(Data).length === 0 ? res.status(400).json({ message: "missing user data" })
    : !Data.name ? res.status(400).json({ message: "missing required name field" })
    : next()
};

function validatePost(req, res, next) {
    const Data = req.body;
    Object.entries(Data).length === 0 ? res.status(400).json({ message: "missing post data" })
    : !Data.text ? res.status(400).json({ message: "missing required text field" })
    : next()
};

module.exports = router;

