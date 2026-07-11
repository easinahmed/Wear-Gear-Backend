const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, updateUserRole } = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
