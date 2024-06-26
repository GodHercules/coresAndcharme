const express = require('express');
const router = express.Router();
const Product = require('../models/produto');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/sobre', (req, res) => {
    res.render('sobre');
});

router.get('/contato', (req, res) => {
    res.render('contato');
});

router.get('/obrigado', (req, res) => {
    res.render('obrigado');
});

router.get('/cadastro-de-usuario', (req, res) => {
    res.render('cadastro-usuario');
});

router.get('/beneficios', (req, res) => {
    res.render('beneficios');
});

router.get('/produtos', (req, res) => {
    Product.findAll({
        attributes: ['id', 'name', 'description', 'price', 'imageUrl', 'createdAt', 'updatedAt']
    })
    .then(products => {
        const plainProducts = products.map(product => product.get({ plain: true }));
        console.log('Produtos recuperados:', plainProducts);
        res.render('produtos', { products: plainProducts });
    })
    .catch(err => {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).send('Erro interno do servidor');
    });
});

module.exports = router;
