const Users = require('../users/users-model')

function restricted( req, res, next) {
  if(req.session && req.session.user) {
    next()
  } else {
    res.status(401).json({message: "You shall not pass!"})
  }
}

async function checkUsernameFree(req, res, next) {
  const userCompare = await Users.findBy(req.body.username)
  if (userCompare[0]) {
    res.status(422).json({message: "Username taken"})
  } else {
    next()
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const userCheck = await Users.findBy(req.body.username)
  if(!userCheck[0]) {
    res.status(401).json({message:"Invalid credentials"})
  } else {
    next()
  }
}

function checkPasswordLength(req, res, next) {
  const password = req.body.password
  if (!password || password.length <= 3) {
    res.status(422).json({message: "Password must be longer than 3 chars"})
  } else {
    next()
  }
}



// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}