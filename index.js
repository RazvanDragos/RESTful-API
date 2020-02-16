const joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const products = [
    { id: 1, name: 'phone'},
    { id: 2, name: 'laptop'},
    { id: 3, name: 'desktop'}
];

app.get('/', (req, res) => {
    res.send('Products');
});

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
        name: req.body.name
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
        name: joi.string().min(3).required()
    };
    return joi.validate(product, schema);
}

app.listen(3000, () => console.log('Listeting on port 3000..'));