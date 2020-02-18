const joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const products = [
    { id: 1, name: 'iPhone', details: 'This is an iPhone', price: 3500},
    { id: 2, name: 'Samsung', details: 'This is a Samsung', price: 3000},
    { id: 3, name: 'Laptop HP', details: 'This is a HP Laptop', price: 5000},
    { id: 4, name: 'Laptop Asus', details: 'This is a Asus Laptop', price: 5200},
    { id: 6, name: 'Laptop Dell', details: 'This is a Dell Laptop', price: 4700},
    { id: 7, name: 'Desktop gaming', details: 'This is a gaming desktop', price: 6000},
    { id: 8, name: 'Desktop office', details: 'This is a office desktop', price: 3500}
];

//get all products
app.get('/api/products', (req, res) => {
    res.send(products);
})

//get product by id
app.get('/api/products/:id', (req, res) => {
    const product = products.find(c => c.id === parseInt(req.params.id));
    if (!product) {
        res.status(404).send('The product with the given id was not found!');
    }
    res.send(product);
});

//add product
app.post('/api/products', (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const product = {
        id: products.length + 1,
        name: req.body.name,
        details: req.body.details,
        price: req.body.price
    };
    products.push(product); //add to products list
    res.send(product);
});

//update product
app.put('/api/products/:id', (req, res) => {
    //Look up the product
    //if not existing, return 404
    const product = products.find(c => c.id === parseInt(req.params.id));
    if (!product) {
        res.status(404).send('The product with the given id was not found!');
    }

    //validate
    //if invalid, return 400 bad request
    const { error } = validateProduct(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //update product
    //return the updated product
    product.name = req.body.name;
    product.details = req.body.details;
    product.price = req.body.price;
    res.send(product);
});

app.delete('/api/products/:id', (req, res) => {
    //Lookup the product
    //if not existing, return 404
    const product = products.find(c => c.id === parseInt(req.params.id));
    if (!product) {
        res.status(404).send('The product with the given id was not found!');
    }

    //Delete
    const index = products.indexOf(product);
    products.splice(index, 1);

    //return the same product
    res.send(product);
})

function validateProduct(product) {
    const schema = {
        name: joi.string().min(3).required(),
        details: joi.string().required(),
        price: joi.number().required()
    };
    return joi.validate(product, schema);
}

app.listen(3000, () => console.log('Listeting on port 3000..'));