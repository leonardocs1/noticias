const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const User = require('./models/user')

const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

const createInitalUser = async () => {
  const total = await User.count({ username: 'root' })
  if (total === 0) {
    const user = new User({
      username: 'root',
      password: 'abc123'
    })
    await user.save()
    console.log('user created')
  } else {
    console.log('user created skipped')
  }
}

app.get('/', (req, res) => res.render('index'))

mongoose
  .connect(mongo, {})
  .then(() => {
    createInitalUser()
    app.listen(port, () => console.log('listening on port: ' + port))
  })
  .catch(e => console.log(e))
