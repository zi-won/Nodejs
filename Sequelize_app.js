const express = require('express');
const path = require('path');
const morgan = require('morgan');

// index.js에 있는 db.sequelize 객체 모듈을 구조분해로 불러온다.
const { sequelize } = require('./models');
const app = express();

app.set('port', process.env.PORT || 3000);

// PUG 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// ? force : true는 모델을 수정하면, 이를 db에 반영하기 위한 옵션이다.
// ? 단, 테이블을 지웠다 다시 생성하는 것이라서 기존 데이터가 날아간다
// ? 따라서 alter : true 옵션을 통해 기존 데이터를 유지하면서 테이블을 업데이트 할 수 있다.
// ? 다만 필드를 새로 추가할 때 필드가 notnull이면 제약조건에 따라서 오류가 나는 등 대처를 해야 한다.
sequelize.sync({ force: false })
   .then(() => {
      console.log('데이터베이스 연결됨.');
   }).catch((err) => {
      console.error(err);
   });

app.use(morgan('dev')); // 로그
app.use(express.static(path.join(__dirname, 'public'))); // 요청시 기본 경로 설정
app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: false })); // uri 파싱

// 일부러 에러 발생시키기 TEST용
app.use((req, res, next) => {
   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
   error.status = 404;
   next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
   // 템플릿 변수 설정
   res.locals.message = err.message;
   res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 배포용이 아니라면 err설정 아니면 빈 객체

   res.status(err.status || 500);
   res.render('error'); // 템플릿 엔진을 렌더링 하여 응답
});

// 서버 실행
app.listen(app.get('port'), () => {
   console.log(app.get('port'), '번 포트에서 대기 중');
});
