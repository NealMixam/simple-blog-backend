// // const express = require('express')
// // const userRouter = require('./routes/user.routes')
// // const postRouter = require('./routes/post.routes')
// //
// // const PORT = process.env.PORT || 8080
// //
// // const app = express()
// // app.use(express.json())
// // app.use('/api', userRouter)
// // app.use('/api', postRouter)
// //
// // app.listen(PORT, () => {
// //     console.log(`Listening on port ${PORT}`);
// // })
// // index.js
// // const express = require('express')
// // const config = require('./config')
// //
// // const userRouter = require('./routes/user.routes')
// // const postRouter = require('./routes/post.routes')
// //
// // const app = express()
// //
// // app.use(express.json())
// // app.use('/api', userRouter)
// // app.use('/api', postRouter)
// //
// // app.listen(config.server.port, () => {
// //     console.log(`🚀 Server running on port ${config.server.port} in ${config.server.nodeEnv} mode`)
// // })
// // index.js (бэкенд)
// // index.js (альтернативный вариант)
// const express = require('express')
// const cors = require('cors')
// const config = require('./config')
//
// const postRouter = require('./routes/post.routes')
// const authRouter = require('./routes/auth.routes')
//
// const app = express()
//
// // Простая настройка CORS
// app.use(cors({
//     origin: [
//         'http://localhost:3000', // для локальной разработки
//         'https://nealmixam.github.io' // URL твоего фронтенда на GitHub Pages
//     ],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true // если используешь куки/JWT в куки
// }))
//
// // Или более конкретная настройка:
// // app.use(cors({
// //   origin: 'http://localhost:3000',
// //   optionsSuccessStatus: 200
// // }))
//
// app.use(express.json())
// app.use('/api', postRouter)
// app.use('/api/auth', authRouter)
//
// app.listen(config.server.port, () => {
//     console.log(`🚀 Server running on port ${config.server.port} in ${config.server.nodeEnv} mode`)
// })
const express = require('express')
const cors = require('cors')
const config = require('./config')

const postRouter = require('./routes/post.routes')
const authRouter = require('./routes/auth.routes')

const app = express()

// Настройка CORS
app.use(cors({
    origin: [
        'http://localhost:3000',           // локальный фронт
        'https://nealmixam.github.io'      // GitHub Pages
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

// Парсинг JSON
app.use(express.json())

// Мидлвар для логирования всех запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})

// Роуты
app.use('/api', postRouter)
app.use('/api/auth', authRouter)

// Мидлвар для отлова ошибок
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERROR:`, err)
    res.status(500).json({ message: 'Internal Server Error' })
})

app.listen(config.server.port, () => {
    console.log(`🚀 Server running on port ${config.server.port} in ${config.server.nodeEnv} mode`)
})
