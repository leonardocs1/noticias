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
const Noticia = require('./models/noticia')

const restrito = require('./routes/restrito')
const noticias = require('./routes/noticias')
const auth = require('./routes/auth')
const pages = require('./routes/pages')
const admin = require('./routes/admin')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({ secret: 'fullstack-master' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', auth)
app.use('/', pages)

app.use('/restrito', restrito)
app.use('/noticias', noticias)
app.use('/admin', admin)

const createInitalUser = async () => {
  const total = await User.count({})
  if (total === 0) {
    const user1 = new User({
      username: 'user1',
      password: '1234',
      roles: ['restrito', 'admin']
    })
    await user1.save()

    const user2 = new User({
      username: 'user2',
      password: '1234',
      roles: ['restrito']
    })
    await user2.save()

    console.log('user created')
  } else {
    console.log('user created skipped')
  }

  /*const noticia = new Noticia({
    title: 'Notícia Pública ' + new Date().getTime(),
    content: 'Content',
    category: 'public'
  })
  await noticia.save()

  const noticia2 = new Noticia({
    title: 'Notícia Privada ' + new Date().getTime(),
    content: 'Content',
    category: 'private'
  })
  await noticia2.save()*/
}

mongoose
  .connect(mongo, {})
  .then(() => {
    createInitalUser()
    app.listen(port, () => console.log('listening on port: ' + port))
  })
  .catch(e => console.log(e))
