var express = require('express'),
    dotenv = require('dotenv').config(),
    path = require('path'),
    User = require('./model/user'),
    indexRoute = require('./routes/api/routing'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    cors = require('cors'),
    port = process.env.PORT;

const app = express();
const http = require('http').Server(app);


app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
// Express session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
    })
)
// PASSPORT INTIALIZE
app.use(passport.initialize())
app.use(passport.session())
app.use(cors());


//serialize
passport.serializeUser(function (user, done) {
    done(null, user)
})
// deserialize
passport.deserializeUser(function (user, done) {
    done(null, user)
});

// authenticate customer 
passport.use('user', new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

    User.findOne({
        where: { email: email, is_deleted: 0, }
    }).then((user) => {
        if (!user) {
            return done(null, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(null, false, { message: err });
            }
            if (isMatch) {
                return done(null, user);
            } else if (!isMatch) {
                return done(null, false, { message: 'Your password is invalid.' });
            }
        });
    });
}));

//// header
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, application/json, text/plain',
    )
    res.setHeader(
        'Access-Control-Allow-Methods', 'GET, POST'
    )
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-salt=0, post-check=0, pre-check=0',
    )
    next()
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// public
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + "/public"));
//  routes use
app.use(indexRoute);

app.get('/', (req, res) => {
    res.send('app is running')
})

http.listen(port, () => {
    console.log(`App is Listening On ${port}, process ID: ${process.pid}`)
})