const express = require('express'); // 모듈 불러옴
const jwt = require('jsonwebtoken'); // 모듈 불러옴
const app = express();
const PORT = 3000;
const KEY = "test_key" // jwt 만들 때 시크릿키로 사용
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html'); // 실습을 위한 인덱스 파일
});

app.get('/sign_token', (req, res) => { // /sgin_token으로 GET 요청이 들어왔을 때 토큰을 생성
	let token = jwt.sign({ name: 'sancho', exp: parseInt(Date.now()/1000)+10 }, KEY);
    // jwt.sing이라는 함수로 name:'sancho'라는 데이터와 만료기간을 10초로 설정
    res.json({ token }); // token은 클라이언트로 반환
});

app.get('/check_token', (req, res) => { // 클라이언트에서 받은 토큰을 '검증'하는 코드
	let token = req.headers['token'];
	try {
		let payload = jwt.verify(token, KEY); // header에 있는 토큰을 꺼내 jwt.verify함수로 시크릿키 활용 -> 복호화 진행
		console.log('토큰 인증 성공', payload) // payload에는 name : 'sancho'값이 담기게 됨
		res.json({ msg: 'success' });
	} catch (err) { // 토큰이 없거나, 만료기간 지나면 에러
		console.log("인증 에러");
		res.status(405).json({ msg: 'error' });
		next(err)
	}
});

function errorHandler(err, req, res, next) {
	console.log("에러 처리 핸들러")
}
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:/${PORT}`);
});
