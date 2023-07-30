// Required modules
var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bkfd2Password = require('pbkdf2-password');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require('body-parser');

var app = express();

// Middleware configurations
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: '1234abcdef!@#$%^',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '1234',
      database: 'app_session_mysql',
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ...

// Passport local strategy
passport.use(
  new LocalStrategy(function (username, password, done) {
    var uname = username;
    var pwd = password;
    var sql = 'select * from users where authId=?';
    conn.query(sql, ['local:' + uname], function (err, results) {
      if (err) {
        return done('There is no user');
      }

      var user = results[0];
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
    });
  })
);

// Passport Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook app ID
      clientSecret: 'YOUR_FACEBOOK_APP_SECRET', // Replace with your Facebook app secret
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'update_time', 'verified', 'displayName'],
    },
    function (accessToken, refreshToken, profile, done) { // Added 'done' parameter
      console.log(profile);
      var authId = 'facebook:' + profile.id;
      var sql = 'select * from users where authId=?';
      conn.query(sql, [authId], function (err, results) {
        if (err) {
          done(err);
        } else {
          if (results.length > 0) {
            done(null, results[0]);
          } else {
            var sql = 'insert into users set ?';
            conn.query(sql, { authId: authId, displayName: profile.displayName, email: profile.emails[0].value }, function (err, results) {
              var newuser = {
                authId: authId,
                displayName: profile.displayName,
                email: profile.emails[0].value,
              };
              done(null, newuser);
            });
          }
        }
      });
    }
  )
);
// Routes
app.post(
  '/auth/login',
  passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/auth/login',
    failureFlash: false,
  })
);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/welcome',
    failureRedirect: '/auth/login',
  })
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
        <a href="/auth/facebook">facebook</a>
    `;
  res.send(output);
});

app.get('/auth/logout', function (req, res) {
  req.logout();
  res.redirect('/welcome');
});

app.get('/count', function (req, res) {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : ' + req.session.count);
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

app.listen(3003, function () {
  console.log('Connected 3003 port!!!');
});
