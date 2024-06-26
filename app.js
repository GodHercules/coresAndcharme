const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { engine } = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');

const sequelize = require('./config/db');
const UserAdm = require('./models/userAdm');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const mainRoutes = require('./routes/mainRoutes'); // Adicione esta linha


const app = express();

app.use(session({
    secret: 'admin123',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 1000 }
}));

app.set('view engine', 'handlebars');
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./middlewares/authMiddleware')(passport, UserAdm);

app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use(productRoutes);
app.use(userRoutes);
app.use(mainRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
