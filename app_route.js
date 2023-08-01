var express = require('express');
var app = express();

var p1 = require('./routes/p1')(app);
app.use('/p1', p1);

app.use('/p1',router); 

var p2 = express.Router();
p2.get('/r1', function(req, res){
    res.send('Hello /p2/r1');
});
p2.get('/r2', function(req, res){
    res.send('Hello /p2/r2');
});
app.use('/p2', p2);

app.listen(3003, function(){
    console.log('connected');
});
