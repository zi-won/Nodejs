var express = require('express');
var cookieParser = require('cookie-parser'); // cookie-parser 모듈을 변수에 담음
var app = express();
app.use(cookieParser('12121212@@')); // 안에 들어있는 값은 키 (열쇠) 값임. 암호화된 값을 쿠키에 굽게된다는

var products = { // DB 대용으로 사용
    1:{title:'The gistory of web 1'},
    2:{title:'The next web'}
}
app.get('/products', function(req, res) {
    var output = ''; // output이라고 하는 문자
    for( var name in products ) { // for는 products 안에 있는 값들을 순회시키는 역할
        output += `<li>
        <a href = "/cart/${name}">${products[name].title}</a>
        </li>`
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href = "/cart">Cart</a>`);
});

/*
cart = {
    1:2,
    2:1,
    3:0
}
*/
app.get('/cart/:id', function(req, res) {
    var id = req.params.id; // parameter를 받아와야 함
    if(req.signedCookies.cart) {
        var cart = req.signedCookies.cart;
    }
    else {
        var cart = {}; // 비어있는 최초의 값이 cookie의 값이 되는 것
    }
    if(!cart[id]) {
        cart[id] = 0;
    }
    cart[id] = parseInt(cart[id]) + 1; // 기본형이 문자형이므로 parseInt를 통해 강제로 숫자 형 변환을 함
    res.cookie('cart', cart, {signed:true}); // cookie에 cart라는 이름으로 cart의 변수에 들어있는 객체를 넣어줌
    res.redirect('/cart'); // cart에 담겨진 목록으로 사용자를 redirect(다른 URL로 재요청하라고 지시하는 것)
});
app.get('/cart', function(req, res) {
    var cart = req.cookies.cart;
    if(!cart) {
        res.send('Empty!');
    }
    else {
        var output = ''; // 1. 비어있는 값 만들고
        for(var id in cart) {
            output += `<li>${products[id].title} (${cart[id]})</li>`;
        }
    }
    res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href = "/products">Products List</a>`); // 2
});

app.get('/count', function(req, res) {
    if(req.signedCookies.count) { // cookie의 값이 있다면, signedcookies는 키 값으로 해독해주는 역할
        var count = parseInt(req.signedCookies.count); // count에 쿠키의 값 넣기
    }
    else {
        var count = 0; // cookie의 값이 없다면 0으로 초기화
    }
    count = count + 1;
    res.cookie('count', count, {signed:true}); // cookie-parser로 인해서 cookie라는 메소드가 생김
    res.send('count : ' + req.cookies.count); // 웹브라우저가 웹 서버에게 전송한 쿠키 값으로 바뀌게 됨
})
app.listen(3003, function() {
console.log('Connected 3003 port!!!');
});
