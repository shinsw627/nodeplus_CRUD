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

// const postUsersSchema = Joi.object({
//     nickname: Joi.string().required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//     confirmPassword: Joi.string().required(),
// })

// router.post('/users', authMiddleware, async (req, res) => {
//     try {
//         let { nickname, email, password, confirmPassword } =
//             await postUsersSchema.validateAsync(req.body)

//         if (password !== confirmPassword) {
//             res.status(400).send({
//                 errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
//             })
//             return
//         }

//         const existUsers = await User.find({
//             $or: [{ email }, { nickname }],
//         })
//         if (existUsers.length) {
//             res.status(400).send({
//                 errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
//             })
//             return
//         }

//         const eng_check = /^[a-z]+[a-z0-9]{2,15}$/g
//         const pw_check = /^[a-z]+[a-z0-9]{3,19}$/g
//         const email_check =
//             /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

//         const id = email.split('@')[0]

//         const regex = new RegExp(id)

//         if (!eng_check.test(id)) {
//             res.status(400).send({
//                 errorMessage: '아이디는 영문자로 시작하는 3~16자여야만 합니다.',
//             })
//             return
//         }
//         if (!email_check.test(email)) {
//             res.status(400).send({
//                 errorMessage: '이메일 형식에 맞춰주세요',
//             })
//             return
//         }

//         if (!pw_check.test(password)) {
//             res.status(400).send({
//                 errorMessage:
//                     '비밀번호는 영문자로 시작하는 4~20자여야만 합니다.',
//             })
//             return
//         } else if (regex.test(password)) {
//             res.status(400).send({
//                 errorMessage:
//                     '패스워드에 아이디와 같은 값을 사용할 수 없습니다.',
//             })
//             return
//         }

//         const encryptedPassword = await bcrypt.hash(password, 10)
//         password = encryptedPassword

//         const user = new User({ email, nickname, password })
//         await user.save()

//         res.status(201).send({})
//     } catch (err) {
//         console.log(err)
//         res.status(400).send({
//             errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
//         })
//     }
// })

// router.post('/auth', async (req, res) => {
//     const { email, password } = req.body

//     const user = await User.findOne({
//         email: email,
//     })

//     if (!user) {
//         res.status(401).send({
//             errorMessage: '이메일 또는 패스워드가 잘못됐습니다.',
//         })
//         return
//     }

//     if (!bcrypt.compare(password, user.password)) {
//         res.status(401).send({
//             errorMessage: '이메일 또는 패스워드가 잘못됐습니다.',
//         })
//         return
//     }

//     const token = jwt.sign({ userId: user.userId }, 'my-secret-key')
//     res.send({
//         token,
//     })
// })

// router.get('/users/me', authMiddleware, async (req, res) => {
//     const { user } = res.locals

//     res.send({
//         user: {
//             email: user.email,
//             nickname: user.nickname,
//         },
//     })
// })

// router.get('/posts', async (req, res, next) => {
//     try {
//         const posts = await Posts.find({}).sort('-postId')
//         res.json({ posts: posts })
//     } catch (err) {
//         console.error(err)
//         next(err)
//     }
// })

// router.get('/posts/:postId', async (req, res) => {
//     const { postId } = req.params
//     posts = await Posts.findOne({ postId: postId })
//     res.json({ posts: posts })
// })

// //글 작성
// router.post('/write', async (req, res) => {
//     const { postId, userName, title, content, contentPw, date } = req.body
//     await Posts.create({ postId, userName, title, content, contentPw, date })

//     res.send({ result: 'success' })
// })

// //글 수정 PATCH
// router.patch('/posts/:postId', async (req, res) => {
//     console.log(req.params)
//     const { postId } = req.params
//     const { title, content } = req.body
//     const loadpost = await Posts.find({ postId })
//     console.log(loadpost)
//     if (loadpost.length > 0) {
//         await Posts.updateOne({ postId }, { $set: { title, content } })
//     }
//     res.send({ result: 'success' })
// })

// //글 삭제 DELETE
// router.delete('/posts/:postId', async (req, res) => {
//     const { postId } = req.params

//     const deletePost = await Posts.find({ postId })
//     if (deletePost.length > 0) {
//         await Posts.deleteOne({ postId })
//     }
//     res.send({ result: 'success' })
// })

app.listen(8080, () => {
    console.log('서버가 요청을 받을 준비가 됐어요')
})
