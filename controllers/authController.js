const passport = require('passport');
const bcrypt = require('bcrypt');
const UserAdm = require('../models/userAdm');

exports.getLogin = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.postLogin = passport.authenticate('local', {
    successRedirect: '/cadastro-de-produtos',
    failureRedirect: '/login',
    failureFlash: true
});

exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
};

exports.getRegister = (req, res) => {
    res.render('register', { title: 'Cadastro' });
};

exports.postRegister = (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Erro ao criptografar a senha:', err);
            res.render('cadastro-usuario', { error: 'Erro ao cadastrar usuário. Por favor, tente novamente.' });
        } else {
            UserAdm.create({ username, password: hash })
                .then(() => {
                    res.redirect('/login');
                })
                .catch(err => {
                    console.error('Erro ao cadastrar usuário:', err);
                    res.render('cadastro-usuario', { error: 'Erro ao cadastrar usuário. Por favor, tente novamente.' });
                });
        }
    });
};
