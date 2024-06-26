const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = (passport, UserAdm) => {
    passport.use(new LocalStrategy((username, password, done) => {
        UserAdm.findOne({ where: { username } })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Credenciais inválidas' });
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Credenciais inválidas' });
                    }
                });
            })
            .catch(err => {
                return done(err);
            });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        UserAdm.findByPk(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
};
