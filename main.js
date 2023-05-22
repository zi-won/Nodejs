const express = require('express');
const axios = require('axios');

const app = express();

const GOOGLE_CLIENT_ID = '798827144104-fe4ep6butpqhjg6e66cf6b3dfmh523qm.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_LOGIN_REDIRECT_URI = 'http://localhost:3000/login/redirect';
const GOOGLE_SIGNUP_REDIRECT_URI = 'http://localhost:3000/signup/redirect';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
app.get('/', (req, res) => {
    res.send(`
        <h1>OAuth</h1>
        <a href="/login">Log in</a>
        <a href="/signup">Sign up</a>
    `);
});

app.get('/login', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${GOOGLE_CLIENT_ID}`
    url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`
    url += '&response_type=code'
    url += '&scope=email profile'
    res.redirect(url);
});

app.get('/signup', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${GOOGLE_CLIENT_ID}`
    url += `&redirect_uri=${GOOGLE_SIGNUP_REDIRECT_URI}`
    url += '&response_type=code'
    url += '&scope=email profile'    
    res.redirect(url);
});

app.get('/login/redirect', (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);
    res.send('ok');
});

app.get('/signup/redirect', async (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);

    const resp = await axios.post(GOOGLE_TOKEN_URL, {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
        grant_type: 'authorization_code',
    });

    const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${resp.data.access_token}`,
        },
    });
    res.json(resp2.data);
});

app.listen(3000, () => {
    console.log('server is running at 3000');
});
