// npm packages
var express = require('express')
var bodyparser = require('body-parser')
var path = require('path')
var morgan = require('morgan')
var expresshbs = require('express-handlebars')
var mongoose = require('mongoose')
var cheerio = require('cheerio')
var request = require('request')
var mongojs = require('mongojs')
var Article = require('./models/article.js')
var Note = require('./models/note.js')


// new express app
var app = express()

// middleware
app.use(morgan('dev'))
app.engine('hbs', expresshbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// mongoose connection
mongoose.connect('mongodb://admin:admin@ds037395.mlab.com:37395/scraper')

var db = mongoose.connection

// var db = mongojs('newsScraper', ['news'])


// scrape the data from nyt site
request('https://www.nytimes.com/section/technology', function (e, r, html) {
  if (e) throw e

  var $ = cheerio.load(html)

  $('h2.headline').each(function (i, element) {
    var title = $(element).html()
    var link = $(element).attr('href')
    db.news.insert({
      title: title,
      link: link
    })
    
  })
})
app.get('/scrape', function (req, res) {
  db.news.find(function(error, docs){
    res.json(docs)
  })
})
app.get('/', function (req, res) {
  res.render('index')
})

app.get('/articles', function(req, res){
  Article.find({}, function(error, docs){
    if(error) throw error

    res.send(docs)
  })
})

app.get('/articles/:id', function(req, res){
  Article.find({_id: req.params.id}).populate('Comment').exec(function(error, docs){
    res.send(docs)
  })
})

app.post('/articles/:id', function(req, res){
  Article.find({_id: req.params.id}, {$set:{saved: 'true'}}, function(error, docs){
    res.send(docs)
  })
})

app.get('/saved', function(req, res){
  Article.find({
    saved: true
  }, function(error, docs){
    if(e) throw e
    
    res.send(docs)
  })
})


var PORT = process.env.PORT || 3000
// listening port
app.listen(PORT, function (e) {
  if (e) throw e
})
