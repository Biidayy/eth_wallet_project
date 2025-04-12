const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route tạo user mới
router.post('/create', userController.createUser);

// Route lấy danh sách user
router.get('/users', userController.getUsers);

// Route chuyển ETH
router.post('/transfer', userController.transferETH);

// Route lấy lịch sử giao dịch
router.get('/transactions', userController.getTransactionHistory);

// Route lấy số dư ví
router.get('/balance/:address', userController.getBalance);

module.exports = router;
