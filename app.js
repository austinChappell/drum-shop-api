const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      ejs = require('ejs'),
      mongoose = require('mongoose');

require('dotenv').config();

const Item = require('./model/item');

let port = process.env.PORT || 4000;
const url = 'mongodb://localhost:27017/drum_shop';

mongoose.connect(url, ({ useMongoClient: true }));

app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  var origin = 'http://localhost:4000/';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  Item.find({}, (err, items) => {
    if (err) {
      throw err;
    } else {
      console.log(items);
      res.render('index', { items });
    }
  })
});

app.post('/add_inventory', (req, res) => {
  console.log(req.body);
  Item.create(req.body, (err, item) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(item);
      res.redirect('/');
    }
  })
});

app.get('/edit_inventory/:id', (req, res) => {

  function createOptions(valueArray, selectedValue) {
    let output = '';
    valueArray.forEach((value) => {
      if (value === selectedValue) {
        output += `<option value="${value}" selected>${value}</option>`
      } else {
        output += `<option value="${value}">${value}</option>`
      }
    })
    return output;
  }

  itemValueArray = ['Drums', 'Cymbals', 'Hardware'];

  Item.findById(req.params.id, (err, item) => {
    if (err) {
      throw err;
    } else {
      console.log(item);
      const options = createOptions(itemValueArray, item.category);
      res.render('edit', { item, options });
    }
  })
});

app.post('/edit_inventory/:id', (req, res) => {
  updateObject = req.body;
  Item.findByIdAndUpdate(req.params.id, updateObject, (err, item) => {
    if (err) {
      throw err;
    } else {
      console.log('UPDATED ITEM', req.params.id, item);
      res.redirect('/');
    }
  })
});

app.post('/delete_inventory/:id', (req, res) => {
  Item.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      throw err;
    } else {
      res.redirect('/');
    }
  })
});

app.get('/api/:category?', (req, res) => {

  if (req.params.category) {
    let searchTerm = req.params.category;
    let category = searchTerm[0].toUpperCase() + searchTerm.slice(1, searchTerm.length).toLowerCase();
    Item.find({ category: category }, (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log('API RESULTS', results);
        res.json(results);
      }
    })
  } else {
    Item.find({}, (err, results) => {
      if (err) {
        throw err;
      } else {
        res.json(results);
      }
    })
  }
})

app.listen(port, () => {
  console.log(`Your app is running on PORT ${ port }.`);
});
