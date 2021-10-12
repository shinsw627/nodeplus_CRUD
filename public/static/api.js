const socket = io()

const welcome = document.getElementById('welcome')
const form = welcome.querySelector('form')
const room = document.getElementById('room')

room.hidden = true

let roomName

function addMessage(message) {
    const ul = room.querySelector('ul')
    const li = document.createElement('li')
    li.innerText = message
    ul.appendChild(li)
}

function handleMessageSubmit(event) {
    event.preventDefault()
    const input = room.querySelector('#msg input')
    const value = input.value
    socket.emit('new_message', input.value, roomName, () => {
        addMessage(`nick: ${value}`)
    })
    input.value = ''
}

function handleNicknameSubmit(event) {
    event.preventDefault()
    const input = room.querySelector('#name input')
    const value = input.value
    socket.emit('nickname', value)
}

function showRoom() {
    welcome.hidden = true
    room.hidden = false
    const h3 = room.querySelector('h3')
    h3.innerText = `방 ${roomName}`
    const msgForm = room.querySelector('#msg')
    const nameForm = room.querySelector('#name')
    msgForm.addEventListener('submit', handleMessageSubmit)
    nameForm.addEventListener('submit', handleNicknameSubmit)
}

function handleRoomSubmit(event) {
    event.preventDefault()
    const input = form.querySelector('input')
    socket.emit('enter_room', input.value, showRoom)
    roomName = input.value
    input.value = ''
}

form.addEventListener('submit', handleRoomSubmit)

socket.on('welcome', (user, newCount) => {
    const h3 = room.querySelector('h3')
    h3.innerText = `방 ${roomName} (${newCount})`
    addMessage(`${user} 입장하셨습니다!`)
})

socket.on('bye', (left, newCount) => {
    const h3 = room.querySelector('h3')
    h3.innerText = `방 ${roomName} (${newCount})`
    addMessage(`${left} 나가셨습니다.`)
})

socket.on('new_message', addMessage)

socket.on('room_change', (rooms) => {
    const roomList = welcome.querySelector('ul')
    if (rooms.length === 0) {
        roomList.innerHTML = ''
        return
    }

    rooms.forEach((room) => {
        const li = document.createElement('li')
        li.innerText = room
        roomList.append(li)
    })
})

// message.toString()
// const messageList = document.querySelector('ul')
// const messageForm = document.querySelector('#message')

// const socket = new WebSocket(`ws://${window.location.host}`)

// function makeMessage(nickname, payload) {
//     const msg = { nickname, payload }
//     return JSON.stringify(msg)
// }
// function makeNickname(nickname) {
//     const msg = { nickname }
//     return JSON.stringify(msg)
// }

// socket.addEventListener('open', () => {
//     console.log('Connected to Server ')
// })

// socket.addEventListener('message', (message) => {
//     const li = document.createElement('li')
//     console.log(message.data)

//     li.innerText = message.data
//     messageList.append(li)
//     document.getElementById('messageArea').scrollTop =
//         document.getElementById('messageArea').scrollHeight
// })

// socket.addEventListener('close', () => {
//     console.log('Disconnected from Server')
// })

// function handleSubmit(event) {
//     event.preventDefault()
//     const input = messageForm.querySelector('input')
//     socket.send(makeMessage(user.nickname, input.value))
//     input.value = ''
// }
// messageForm.addEventListener('submit', handleSubmit)
// function handleNickSubmit(event) {
//     event.preventDefault()
//     const userinfo = user
//     socket.send(userinfo)
// }

// nickForm.addEventListener('submit', handleNickSubmit)

/////////////////////////////////////////////////
function postOrder(user, order) {
    if (!order.length) {
        return
    }

    socket.emit('BUY', {
        nickname: user.nickname,
        goodsId: order[0].goods.goodsId,
        goodsName:
            order.length > 1
                ? `${order[0].goods.name} 외 ${order.length - 1}개의 상품`
                : order[0].goods.name,
    })
}

function makeLogoutButton() {
    try {
        if (user.nickname) {
        }
    } catch (err) {
        let loginButtonHtml = `<button
                                    type="button"
                                    class="btn btn-outline-sparta"
                                    id="homeButton"
                                    onclick="signOut()"
                                >
                                    로그인하기
                                </button>`
        $('#signOutButton').replaceWith(loginButtonHtml)
    }
}

function changeLogoutButton() {
    try {
        if (user.nickname) {
            let signOutButtonHTML = `<button
                                    type="button"
                                    class="btn btn-outline-sparta"
                                    id="signOutButton"
                                    onclick="signOut()"
                                >
                                    로그아웃하기
                                </button>`
            $('#homeButton').replaceWith(signOutButtonHTML)
        }
    } catch (err) {}
}

function getSelf(callback) {
    $.ajax({
        type: 'GET',
        url: '/api/users/me',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        success: function (response) {
            callback(response.user)
        },
        error: function (status, error) {
            if (status == 401) {
                alert('로그인이 필요합니다.')
            } else {
                localStorage.clear()
                alert('로그인 후 이용하세요.')
            }
            window.location.href = '/'
        },
    })
}
function getSelfNoAuth(callback) {
    $.ajax({
        type: 'GET',
        url: '/api/users/me',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        success: function (response) {
            callback(response.user)
        },
        error: function (xhr, status, error) {
            if (status == 401) {
                alert('로그인이 필요합니다.')
            } else {
                localStorage.clear()
                alert('손님이시군요! 손님은 기능에 제한이 있을 수 있습니다.')
            }
        },
    })
}

function signOut() {
    localStorage.clear()
    window.location.href = '/'
}

function makeBuyNotification(targetNickname, goodsName, goodsId, date) {
    const messageHtml = `${targetNickname}님이 방금 <a href="/detail.html?goodsId=${goodsId}" class="alert-link">${goodsName}</a>을 구매했어요! <br /><small>(${date})</small>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>`
    const alt = $('#customerAlert')
    if (alt.length) {
        alt.html(messageHtml)
    } else {
        const htmlTemp = `<div class="alert alert-sparta alert-dismissible show fade" role="alert" id="customerAlert">${messageHtml}</div>`
        $('body').append(htmlTemp)
    }
}

function addToCart(goodsId, quantity, callback) {
    $.ajax({
        type: 'PUT',
        url: `/api/goods/${goodsId}/cart`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
            quantity,
        },
        error: function (xhr, status, error) {
            if (status == 400) {
                alert('존재하지 않는 상품입니다.')
            }
            window.location.href = '/goods.html'
        },
        success: function () {
            callback()
        },
    })
}

function buyLocation(params) {
    sessionStorage.setItem('ordered', JSON.stringify(params))
    location.href = 'order.html'
}

function getCarts(callback) {
    $.ajax({
        type: 'GET',
        url: `/api/goods/cart`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        success: function (response) {
            callback(response.cart)
        },
    })
}

function deleteCart(goodsId, callback) {
    $.ajax({
        type: 'DELETE',
        url: `/api/goods/${goodsId}/cart`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        success: function () {
            callback()
        },
    })
}
