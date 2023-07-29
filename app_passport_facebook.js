var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '1234abcdef!@#$%^',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '1234',
        database: 'app_session_mysql'
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/count', function (req, res) {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});

app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('/welcome');
});

app.get('/welcome', function (req, res) {
    if (req.user && req.user.displayName) {
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
            <a href="/auth/logout">logout</a>
        `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a>
        `);
    }
});

var salt = '@#$%^&*(';
var users = [
    {
        username: 'jiwon',
        password: 'aUtt4OWG/wHtHz675PqYuHXbT3+ASN+Tkc9/8Jtmj/caf+JectaKpeqBoFu2tT04li1KKTRIYTIbrxoshlbHbQnBAGrQ+Fz1trm9nM7i4yKpS/IUdGbX0DVGcuwYnNH9Hh++ZiubQTDIt1T4MmOncBPhxH3btPORqKEN0y2Ksjc=',
        salt: 'p2xboC5ARwdk1GrGrFaQbHr2TpykcoLHt/6kwsyhExONjKBnabW2mVUjKtmSneCaNza4PbfmqVzvyXK0E3vNYQ==',
        displayName: 'Jiwon'
    }
];

passport.use(new LocalStrategy(
    function(username, password, done){
        var user = users.find((u) => u.username === username);

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        hasher({ password: password, salt: user.salt }, function (err, pass, salt, hash) {
            if (hash === user.password) {
                console.log('LocalStrategy', user);
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    }
));
passport.use(new FacebookStrategy({
    clientID: '1423274298465129',
    clientSecret: '035e0c8bf607b431844ab545c42d1b62',
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    var authId = 'facebook:' + profile.id;
    for(var i = 0; i < users.length; i++) {
        var user = usres[i];
        if(user.authId === authId) {
            return done(null, user);
        }
    }
    var newuser = {
        'authId':authId,
        'displayName' : profile.displayName
    };
    users.push(newuser);
    done(null, newuser);
  }
));

passport.serializeUser(function(user, done) {
    console.log('seriallizeUser', user);
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    console.log('deserializeUser', username);
    var user = users.find((u) => u.username === username);
    done(null, user);
});

app.post('/auth/login', 
    passport.authenticate('local', { 
        successRedirect : '/welcome',
        failureRedirect : '/auth/login',
        failureFlash : false 
    })
);
app.get(
    '/auth/facebook',
    passport.authenticate(
        'facebook'
    )
);
app.get(
    '/auth/facebook/callback',
    passport.authenticate(
        'facebook',
        {
            successRedirect : '/welcome',
            failureRedirect : '/auth/login'
        }
    )
);
app.get('/auth/login', function (req, res) {
    var output = `
        <h1>Login</h1>
        <form action="/auth/login" method="post">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        <a href = "/auth/facebook">facebook</a>
    `;
    res.send(output);
});


app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('/welcome');
});

app.listen(3003, function () {
    console.log('Connected 3003 port!!!');
});
