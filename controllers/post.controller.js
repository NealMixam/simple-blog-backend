// const db = require('../db')
//
// class PostController {
//     async createPost(req, res) {
//         const { title, content, userId } = req.body
//         const newPost = await db.query('INSERT INTO post (title, content, user_id) values ($1, $2, $3) RETURNING *', [title, content, userId])
//         res.json(newPost.rows[0])
//     }
//
//     async getPostsByUser(req, res) {
//         const id = req.query.id
//         const posts = await db.query('select * from post where user_id = $1', [id])
//         res.json(posts.rows)
//     }
// }
//
// module.exports = new PostController()
const db = require('../db')

class PostController {
    async createPost(req, res) {
        try {
            const { title, content } = req.body
            const userId = req.user.userId

            if (!title || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'Title and content are required'
                })
            }

            const newPost = await db.query(
                'INSERT INTO post (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
                [title, content, userId]
            )

            res.json({
                success: true,
                data: newPost.rows[0]
            })
        } catch (error) {
            console.error('Create post error:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async getPostsByUser(req, res) {
        try {
            const userId = req.user.userId

            const posts = await db.query(
                'SELECT * FROM post WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            )

            res.json({
                success: true,
                data: posts.rows
            })
        } catch (error) {
            console.error('Get posts error:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async getAllPosts(req, res) {
        try {
            const posts = await db.query(`
                SELECT p.*, u.username 
                FROM post p 
                JOIN users u ON p.user_id = u.id 
                ORDER BY p.created_at DESC
            `)

            res.json({
                success: true,
                data: posts.rows
            })
        } catch (error) {
            console.error('Get all posts error:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async updatePost(req, res) {
        try {
            const { id } = req.params
            const { title, content } = req.body
            const userId = req.user.userId

            const existingPost = await db.query(
                'SELECT * FROM post WHERE id = $1 AND user_id = $2',
                [id, userId]
            )

            if (existingPost.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found or access denied'
                })
            }

            const updatedPost = await db.query(
                'UPDATE post SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
                [title, content, id]
            )

            res.json({
                success: true,
                data: updatedPost.rows[0]
            })
        } catch (error) {
            console.error('Update post error:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async deletePost(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.userId

            const existingPost = await db.query(
                'SELECT * FROM post WHERE id = $1 AND user_id = $2',
                [id, userId]
            )

            if (existingPost.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found or access denied'
                })
            }

            await db.query('DELETE FROM post WHERE id = $1', [id])

            res.json({
                success: true,
                message: 'Post deleted successfully'
            })
        } catch (error) {
            console.error('Delete post error:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}

module.exports = new PostController()