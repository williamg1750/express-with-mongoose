const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose
  .connect('mongodb://localhost:27017/farmStand', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MONGO connection open');
  })
  .catch((err) => {
    console.log('OH NO MONGO CONNECTION ERROR');
    console.log(err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//need to use this mddleware to parse thru the req.body
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
  const products = await Product.find({});
  res.render('products/index', { products });
});

app.post('/products', async (req, res) => {
  const { name, price, category } = req.body;
  const newProduct = new Product({
    name: name,
    price: price,
    category: category,
  });
  await newProduct.save();
  console.log(newProduct);
  res.redirect(`products/${newProduct.id}`);
});

app.get('/products/new', (req, res) => {
  res.render('products/new');
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/show', { product });
});

// app.patch('/products/:id', async (req, res) => {
//   const { id } = req.params;
//   const product = await Product.findOneAndUpdate(id);

//   res.render('products/show', { product });
// });

app.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate(id);
  res.render('products/edit', { product });
});

app.get('*', async (req, res) => {
  res.send('404 NOT FOUND');
});

app.listen(8080, () => {
  console.log('APP IS LISTENING TO PORT 8080');
});
