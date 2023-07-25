var express = require('express');
var cookieParser = require('cookie-parser'); // cookie-parser 모듈을 변수에 담음
var app = express();
app.use(cookieParser());
app.get('/count', function(req, res) {
    if(req.cookies.count) { // cookie의 값이 있다면
        var count = parseInt(req.cookies.count); // count에 쿠키의 값 넣기
    }
    else {
        var count = 0; // cookie의 값이 없다면 0으로 초기화
    }
    count = count + 1;
    res.cookie('count', count); // cookie-parser로 인해서 cookie라는 메소드가 생김
    res.send('count : ' + req.cookies.count); // 웹브라우저가 웹 서버에게 전송한 쿠키 값으로 바뀌게 됨
})
app.listen(3003, function() {
console.log('Connected 3003 port!!!');
});
