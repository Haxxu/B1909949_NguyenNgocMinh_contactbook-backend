const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const contactsRouter = require('./app/routes/contact.route');
const usersRouter = require('./app/routes/user.route');
const authRouter = require('./app/routes/auth.route');
const ApiError = require('./app/api-error');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to contact book application.' });
});

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// Handle 404 response
app.use((req, res, next) => {
    // Code ở đây sẽ chạy khi không có route được định nghĩa nào
    // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
    return next(new ApiError(404, 'Resource not found'));
});

// Define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong các đoạn code xử lý ở các route, gọi next(error)
    // sẽ chuyển về middleware xử lý lỗi này
    return res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Interval Server Error' });
});

module.exports = app;
