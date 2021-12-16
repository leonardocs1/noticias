const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')

const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'
mongoose.Promise = global.Promise

const User = require('./models/user')

const restrito = require('./routes/restrito')
const noticias = require('./routes/noticias')
const auth = require('./routes/auth')
const pages = require('./routes/pages')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({ secret: 'fullstack-master' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use((req, res, next) => {
  if ('user' in req.session) {
    res.locals.user = req.session.user
  }
  next()
})

app.use('/restrito', (req, res, next) => {
  if ('user' in req.session) {
    return next()
  }
  res.redirect('/login')
})
app.use('/restrito', restrito)
app.use('/noticias', noticias)

app.use('/', auth)
app.use('/', pages)

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

mongoose
  .connect(mongo, {})
  .then(() => {
    createInitalUser()
    app.listen(port, () => console.log('listening on port: ' + port))
  })
  .catch(e => console.log(e))
