/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */

const db = require('../../data/db-config')

async function find() {

  const rows = await db('users as u')
    .select('u.user_id', 'u.username')

  return rows

}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  const row = db('users as u')
    .where('u.username', filter)

  return row
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  const row = db('users as u')
    .select('u.user_id', 'u.username')
    .where ('u.user_id', user_id)

  return row
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const row = await db('users as u').insert({
    username: user.username,
    password: user.password
  })

  const newUser = await findById(row)
  return newUser[0]
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  find,
  findBy,
  findById,
  add
}