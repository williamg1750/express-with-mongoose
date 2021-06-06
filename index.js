const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const AppError = require('./AppError');

//used to get pass the get and post route
const methodOverride = require('method-override');
//mongoose connection to teh mongo db
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
//setting the views to work with ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
//need to use this mddleware to parse thru the req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy', 'baked goods'];

app.get('/products', async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render('products/index', { products, category });
  } else {
    const products = await Product.find({});
    res.render('products/index', { products, category: 'All' });
  }
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
  res.render('products/new', { categories });
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/show', { product });
});

app.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/edit', { product, categories });
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
  // res.send('UR ARE PUTTING');
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete();
  res.redirect('/products');
});

// app.get('*', async (req, res) => {
//   res.send('404 NOT FOUND');
// });
app.get('/error', (req, res) => {
  chicken.fly();
});

const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  if (password === 'chicken') {
    next();
  }
  res.status(404);
  throw new AppError('Password required', 404);
};

app.get('/secret', verifyPassword, (req, res) => {
  res.send('welcome back admin');
});

app.use((err, req, res, next) => {
  console.log('*****************************');
  console.log('***********ERROR*************');
  console.log('*****************************');
  next(err);
});

app.listen(8080, () => {
  console.log('APP IS LISTENING TO PORT 8080');
});
