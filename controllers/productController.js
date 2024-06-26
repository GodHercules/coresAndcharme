const Product = require('../models/produto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'public/img';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('Usuário não autenticado, redirecionando para /login');
    res.redirect('/login');
};

exports.getProducts = (req, res) => {
    Product.findAll()
        .then(products => {
            const plainProducts = products.map(product => product.get({ plain: true }));
            res.render('add-product', { products: plainProducts });
        })
        .catch(err => {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).send('Erro interno do servidor');
        });
};

exports.createProduct = [upload.single('image'), (req, res) => {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? '/img/' + req.file.filename : null;

    Product.create({ name, description, price, imageUrl })
        .then(() => {
            return Product.findAll();
        })
        .then(products => {
            const plainProducts = products.map(product => product.get({ plain: true }));
            res.render('add-product', { products: plainProducts });
        })
        .catch(err => {
            console.error('Erro ao cadastrar o produto:', err);
            res.render('add-product', { error: 'Erro ao cadastrar o produto. Por favor, tente novamente.' });
        });
}];

exports.getEditProduct = (req, res) => {
    Product.findByPk(req.params.id)
        .then(product => {
            if (product) {
                res.render('edit-product', { product: product.get({ plain: true }) });
            } else {
                res.redirect('/cadastro-de-produtos');
            }
        })
        .catch(err => {
            console.error('Erro ao buscar produto:', err);
            res.redirect('/cadastro-de-produtos');
        });
};

exports.editProduct = [upload.single('image'), (req, res) => {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? '/img/' + req.file.filename : null;

    Product.findByPk(req.params.id)
        .then(product => {
            if (product) {
                product.name = name;
                product.description = description;
                product.price = price;
                if (imageUrl) {
                    product.imageUrl = imageUrl;
                }
                return product.save();
            }
        })
        .then(() => {
            res.redirect('/cadastro-de-produtos');
        })
        .catch(err => {
            console.error('Erro ao editar o produto:', err);
            res.redirect('/cadastro-de-produtos');
        });
}];

exports.deleteProduct = (req, res) => {
    Product.findByPk(req.params.id)
        .then(product => {
            if (product) {
                return product.destroy();
            }
        })
        .then(() => {
            res.redirect('/cadastro-de-produtos');
        })
        .catch(err => {
            console.error('Erro ao deletar o produto:', err);
            res.redirect('/cadastro-de-produtos');
        });
};
