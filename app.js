const WebSocket = require('ws')
const http = require('http')

const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const connect = require('./schemas')
connect()
const postsRouter = require('./routers/router')
app.use('/api', postsRouter)

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

app.get('/board', (req, res) => {
    res.render('board')
})

app.get('/write', (req, res) => {
    res.render('write')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/detail', (req, res) => {
    let postId = req.query.name
    res.render('detail', { postId })
})
app.get('/rewrite', (req, res) => {
    let postId = req.query.name
    res.render('rewrite', { postId })
})

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const sockets = []

function onSocketClose() {
    console.log('소켓연결이 해제되었습니다.')
}
//이벤트를 받아주는 부분
wss.on('connection', (socket) => {
    sockets.push(socket) //소켓들을 소켓즈라는 배열에 담아 보관
    console.log('서버에 연결 되었습니다!') //connection 됨을 알려주기

    //소켓 연결 끊었을 경우
    socket.on('close', onSocketClose)

    //메세지 이벤트를 받아서 처리하는 부분
    socket.on('message', (message) => {
        const parsed = JSON.parse(message)
        console.log(parsed, message)
        const sendMessage = parsed.nickname + ' :  ' + parsed.payload
        sockets.forEach((aSocket) => aSocket.send(sendMessage)) //asocket에서 받은 메세지를 각각의 소켓들에게 전달.
        // socket.send(message.toString("utf8")); //프론트엔드로 전달
        // console.log(message.toString("utf8")); //백엔드에서 표시
    })
    socket.send(
        '환영합니다! 악성행위는 하지 말아주세요! \n 로그인 하면 자신의 닉네임으로 대화할 수 있습니다!'
    )
})
const handleListen = () =>
    console.log(`서버가 요청을 받을 준비가 됐어요
  http://localhost:8080`)

server.listen(8080, handleListen)

// app.listen(8080, () => {
//     console.log('서버가 요청을 받을 준비가 됐어요')
// })
