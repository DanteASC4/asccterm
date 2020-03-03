require('dotenv').config();
var path = require('path')
var express = require('express')
var colors = require('colors/safe')
var cookieParser = require('cookie-parser');
const dbGod = require('./dbGod')


var flagCount = 0;
const flag = (info) => {
    flagCount++;
    console.log(`${colors.yellow("ROUTING_Flag num:" + flagCount)}\n${[...info]}`)
}


var app = express();

// view engine setup
app.set('views', [__dirname + '/views', __dirname + process.env.PATH_TO_VIEWS]);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.CK));

app.get('/', (req, res) => {
    res.clearCookie(process.env.CK)
    res.render('home')
})

app.get('/c', (req, res) =>{
    res.clearCookie(process.env.CK)
    res.redirect('/')
})

app.get('/try', (req, res, next) => {
    res.redirect('/');
})

app.get('/failure', (req, res, next) => {
    res.render('denied')
})

app.post('/try', (req, res, next) => {
    dbGod.attempt(req.body.attempt).then(v => {
        flag(['l54, inside .then', v])
        if(v[0] === true){
            if(v[1].id === 3){
                res.cookie('passed','true',{signed:true,maxAge: 60000});
                res.redirect('/s1');
            }
        }
        if(v[0] === false){
            res.redirect('/failure')
        }
    }).catch(e => console.error(e))
})

const Gatekeeper = (req, res, next) => {
    if(req.signedCookies.passed === 'false' || !req.signedCookies.passed || req.signedCookies.passed === null || req.signedCookies.passed !== 'true'){
        res.redirect('/')
    }
    else if (req.signedCookies.passed === 'true') {
        next();
    }
}

app.use(Gatekeeper)

app.get('/s1', (req, res, next) =>{
    res.render('secret_one')
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(colors.underline.magenta(`\nListening on port: ${port}`)));