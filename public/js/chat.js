// const User = require('../../models/user')

const socket = io()

let userNickname
setTimeout(function () {
    userNickname = user.nickname
    socket.emit('join', userNickname)
}, 100)

const chatList = document.querySelector('.chatting-list')
const chatInput = document.querySelector('.chatting-input')
const sendButton = document.querySelector('.send-button')
const displayContainer = document.querySelector('.display-container')
const userContainer = document.querySelector('.user-container')

//엔터로 메세지 보내기
chatInput.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
        sendMsg()
    }
})

//처음으로 메시지를 프론트에서 보내는 함수
function sendMsg() {
    if (chatInput.value == '') {
        return
    }
    const param = {
        nickname: userNickname,
        msg: chatInput.value,
    }
    //처음 프론트에서 보내기
    socket.emit('sendMsg', param)
    chatInput.value = ''
}
//클릭해서 메세지 보내기
sendButton.addEventListener('click', sendMsg)

//접속자 리스트 받기
socket.on('currentOn', (data) => {
    userContainer.innerHTML = ''
    const userListLabel = document.createElement('label')
    userListLabel.innerText = `접속유저(${data.length}명):`
    userContainer.appendChild(userListLabel)
    for (let i = 0; i < data.length; i++) {
        const h = document.createElement('h5')
        h.innerText = '⠀' + data[i] + ` 님`
        userContainer.appendChild(h)
    }

    const dom = `<a class="navbar-brand" href="/" id="homebutton">
                    <img
                        src="https://i.pinimg.com/564x/b5/70/d8/b570d831b240df6c033a4e2f8d2b7740.jpg"
                        width="60"
                        height="60"
                        alt=""
                    />
                </a>`
    //?? 제이쿼리 쓰니까 이렇게 편해??
    $('.user-container').append(dom)
})

//네번째 프론트에서 받기
socket.on('receiveMsg', (data) => {
    const { nickname, msg, time } = data
    const item = new LiModel(nickname, msg, time) //LiModel을 초기화
    item.makeLi()
    displayContainer.scrollTo(0, displayContainer.scrollHeight)
})

//채팅로그 받아서 만들기
socket.on('chatLog', (data) => {
    console.log(data)
    for (let i = data.length - 1; i >= 0; i--) {
        const chatInfo = data[i]

        const { nickname, msg, time } = chatInfo
        const item = new LiModel(nickname, msg, time)
        item.makeLi()
    }
    displayContainer.scrollTo(0, displayContainer.scrollHeight)
})

function LiModel(nickname, msg, time) {
    this.name = nickname
    this.msg = msg
    this.time = time

    this.makeLi = () => {
        const li = document.createElement('li')
        li.classList.add(nickname == userNickname ? 'sent' : 'received')
        const dom = `<span class="profile">
                        <span class="user">${this.name}</span>
                        <img
                        class="image"
                        src="https://placeimg.com/50/50/any"
                        alt="any"
                        srcset=""
                        />
                    </span>
                    <span class="message">${this.msg}</span>
                    <span class="time">${this.time}</span>`
        li.innerHTML = dom
        chatList.appendChild(li)
    }
}

console.log(socket)
