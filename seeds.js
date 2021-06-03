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

// const p = new Product({
//   name: 'Ruby Grapefruit',
//   price: 1.99,
//   category: 'fruit',
// });

// p.save()
//   .then((p) => {
//     console.log(p);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const seedProducts = [
  { name: 'orange', price: 1, category: 'fruit' },
  { name: 'milk', price: 2.99, category: 'dairy' },
  { name: 'cheese', price: 5.99, category: 'dairy' },
  { name: 'salad mix', price: 2.99, category: 'vegetable' },
];

Product.insertMany(seedProducts)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
