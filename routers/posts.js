const express = require('express')
const Posts = require('../schemas/posts')

const router = express.Router()

router.get('/posts', async (req, res, next) => {
    try {
        const posts = await Posts.find({}).sort('-postId')
        res.json({ posts: posts })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params
    posts = await Posts.findOne({ postId: postId })
    res.json({ posts: posts })
})

//글 작성
router.post('/write', async (req, res) => {
    const { postId, userName, title, content, contentPw, date } = req.body
    await Posts.create({ postId, userName, title, content, contentPw, date })

    res.send({ result: 'success' })
})

//글 수정 PATCH
router.patch('/posts/:postId', async (req, res) => {
    console.log(req.params)
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

module.exports = router
