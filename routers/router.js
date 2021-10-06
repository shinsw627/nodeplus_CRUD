const express = require('express')
const Posts = require('../models/posts')
const User = require('../models/user')
const Comments = require('../models/comment')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/auth-middleware')
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// const postUsersSchema = Joi.object({
//     nickname: Joi.string().min(3).max(20).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(4).required(),
//     confirmPassword: Joi.string().min(4).required(),
// })

router.post('/users', async (req, res) => {
    try {
        console.log(req.body)
        let { nickname, email, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            res.status(400).send({
                errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
            })
            return
        }

        const existEmail = await User.find({ email })
        const existNickname = await User.find({ nickname })
        if (existEmail.length) {
            res.status(400).send({
                errorMessage: '이미 가입된 이메일 입니다.',
            })
            return
        }
        if (existNickname.length) {
            res.status(400).send({
                errorMessage: '이미 가입된 닉네임 입니다.',
            })
            return
        }
        const nick_check = /^[a-zA-Z가-힣]+[a-zA-z가-힣0-9]{3,7}$/g
        const eng_check = /^[a-zA-Z]+[a-z0-9]{2,15}$/g
        const pw_check = /^[a-zA-Z]+[a-z0-9~!@#$%^&*()_+<>?:{}]{3,15}$/g
        const email_check =
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

        const id = email.split('@')[0]

        const regex = new RegExp(id)
        const regexnick = new RegExp(nickname)
        if (!nick_check.test(nickname)) {
            res.status(400).send({
                errorMessage:
                    '닉네임은 한글,영어로 시작하는 숫자를 이용한 4~16자여야만합니다.',
            })
            return
        }
        if (!eng_check.test(id)) {
            res.status(400).send({
                errorMessage: '아이디는 영문자로 시작하는 3~16자여야만 합니다.',
            })
            return
        }
        if (!email_check.test(email)) {
            res.status(400).send({
                errorMessage: '이메일 형식에 맞춰주세요',
            })
            return
        }

        if (!pw_check.test(password)) {
            res.status(400).send({
                errorMessage:
                    '비밀번호는 영문자로 시작하며 4~20자여야만 합니다.',
            })
            return
        } else if (regex.test(password) || regexnick.test(password)) {
            res.status(400).send({
                errorMessage:
                    '패스워드에 아이디나 닉네임과 같은 값을 사용할 수 없습니다.',
            })
            return
        }

        const encryptedPassword = bcrypt.hashSync(password, 10)
        password = encryptedPassword

        const user = new User({ email, nickname, password })
        await user.save()

        res.status(201).send({})
    } catch (err) {
        console.log(err)
        res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        })
    }
})

router.post('/auth', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({
        email: email,
    })
    console.log(user)
    if (!user) {
        res.status(401).send({
            errorMessage: '이메일 또는 패스워드가 잘못됐습니다.',
        })
        return
    }

    if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).send({
            errorMessage: '이메일 또는 패스워드가 잘못됐습니다.',
        })
        return
    }

    const token = jwt.sign({ userId: user.userId }, 'my-secret-key')
    res.send({
        token,
    })
})

router.get('/users/me', authMiddleware, async (req, res) => {
    const { user } = res.locals
    console.log(res.locals)
    res.send({
        user: {
            email: user.email,
            nickname: user.nickname,
        },
    })
})

router.get('/posts', async (req, res, next) => {
    try {
        const posts = await Posts.find({}).sort('-postId')
        res.json({ posts: posts })
    } catch (err) {
        console.error(err)
        next(err)
    }
})
//글 상세 조회
router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params
    posts = await Posts.findOne({ postId: postId })
    comments = await Comments.find({ postId: postId }).sort('-postId')
    res.json({ posts: posts, comments: comments })
})

//글 작성
router.post('/write', async (req, res) => {
    const { postId, nickname, title, content, contentPw, date } = req.body
    await Posts.create({ postId, nickname, title, content, contentPw, date })

    res.send({ result: 'success' })
})

//글 수정 PATCH
router.patch('/posts/:postId', async (req, res) => {
    const { postId } = req.params
    const { title, content } = req.body
    const loadpost = await Posts.find({ postId })
    console.log(loadpost)
    if (loadpost.length > 0) {
        await Posts.updateOne({ postId }, { $set: { title, content } })
    }
    res.send({ result: 'success' })
})

//글 삭제 DELETE
router.delete('/posts/:postId', async (req, res) => {
    const { postId } = req.params

    const deletePost = await Posts.find({ postId })
    if (deletePost.length > 0) {
        await Posts.deleteOne({ postId })
    }
    res.send({ result: 'success' })
})

//댓글 작성
router.post('/writecomments', async (req, res) => {
    const { postId, commentId, nickname, content, date } = req.body
    await Comments.create({ postId, commentId, nickname, content, date })

    res.send({ result: 'success' })
})

//댓글삭제
router.delete('/comments/:postId', async (req, res) => {
    const { commentId } = req.body
    const deleteComment = await Comments.findOne({ commentId: commentId })
    console.log(deleteComment)
    if (deleteComment != undefined) {
        await Comments.deleteOne({ commentId })
    } else {
        res.status(401).send({ result: 'error' })
        return
    }
    res.send({ result: 'success' })
})

//댓글 수정
router.patch('/comments/:postId', async (req, res) => {
    const { content, commentId } = req.body
    const loadcontent = await Comments.find({ commentId })

    if (loadcontent.length > 0) {
        await Comments.updateOne({ commentId }, { $set: { content } })
    }
    res.send({ result: 'success' })
})

module.exports = router
