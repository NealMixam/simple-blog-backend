// const Router = require('express').Router
// const router = Router()
// const postController = require('../controllers/post.controller')
//
// router.post('/post', postController.createPost)
// router.get('/post', postController.getPostsByUser)
//
// module.exports = router
const Router = require('express').Router
const router = Router()
const postController = require('../controllers/post.controller')
const authMiddleware = require('../middleware/auth')

router.post('/post', authMiddleware, postController.createPost)
router.get('/post', authMiddleware, postController.getPostsByUser)
router.get('/posts', postController.getAllPosts)
router.put('/post/:id', authMiddleware, postController.updatePost)
router.delete('/post/:id', authMiddleware, postController.deletePost)

module.exports = router