const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const Users = require('../users/users-model')
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require('./auth-middleware')

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try { 
    let { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8)
    password = hash
    const newUser = await Users.add({username, password})
    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }
})

router.post('/login', checkUsernameExists,  async (req, res, next) => {
  try {
    let { username, password } = req.body
    const loginUser = await Users.findBy(username)
    if (loginUser && bcrypt.compareSync(password, loginUser[0].password)) {
      req.session.user = loginUser;
      res.status(200).json({message: `Welcome ${username}!`})
    } else {
      res.status(401).json({message: 'Invalid credentials!'})
    }
  } catch (err) {
    next(err)
  }
})

router.get('/logout', (req, res) => {
  if(req.session && req.session.user){
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({message: err.message})
      } else {
        res.status(200).json({message: 'Logged out'})
      }
    })
  } else {
    res.status(200).json({message: 'no session'})
  }
})
 
module.exports = router