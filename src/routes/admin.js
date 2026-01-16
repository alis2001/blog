const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { validateArticle, validateCategory, validateLogin, handleValidationErrors } = require('../middleware/validation');
const upload = require('../middleware/upload');
const { loginLimiter } = require('../config/security');

const authController = require('../controllers/admin/authController');
const articleController = require('../controllers/admin/articleController');
const categoryController = require('../controllers/admin/categoryController');
const registrationController = require('../controllers/admin/registrationController');
const userController = require('../controllers/admin/userController');
const messageController = require('../controllers/admin/messageController');
const subscriptionController = require('../controllers/admin/subscriptionController');

router.get('/login', authController.getLogin);
router.post('/login', loginLimiter, validateLogin, handleValidationErrors, authController.postLogin);
router.get('/register', registrationController.getRegister);
router.post('/register', loginLimiter, registrationController.postRegister);
router.get('/logout', authController.logout);

router.use(requireAuth);

router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', authController.getDashboard);

router.get('/articles', articleController.getArticles);
router.get('/articles/create', articleController.getCreateArticle);
router.post('/articles/create', upload.single('featuredImage'), validateArticle, handleValidationErrors, articleController.postCreateArticle);
router.get('/articles/edit/:id', articleController.getEditArticle);
router.post('/articles/edit/:id', upload.single('featuredImage'), validateArticle, handleValidationErrors, articleController.postEditArticle);
router.delete('/articles/:id', articleController.deleteArticle);

router.get('/categories', categoryController.getCategories);
router.get('/categories/create', categoryController.getCreateCategory);
router.post('/categories/create', validateCategory, handleValidationErrors, categoryController.postCreateCategory);
router.get('/categories/edit/:id', categoryController.getEditCategory);
router.post('/categories/edit/:id', validateCategory, handleValidationErrors, categoryController.postEditCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

router.get('/users', userController.getUsers);
router.post('/users/:id/approve', userController.approveUser);
router.post('/users/:id/reject', userController.rejectUser);
router.post('/users/:id/deactivate', userController.deactivateUser);

// Messages
router.get('/messages', messageController.getMessages);
router.post('/messages/mark-all-read', messageController.markAllAsRead);
router.get('/messages/unread-count', messageController.getUnreadCount);
router.get('/messages/:id', messageController.getMessage);
router.post('/messages/:id/read', messageController.markAsRead);
router.post('/messages/:id/unread', messageController.markAsUnread);
router.post('/messages/:id/archive', messageController.archiveMessage);
router.delete('/messages/:id', messageController.deleteMessage);

// Subscriptions
router.get('/subscriptions', subscriptionController.getSubscriptions);
router.post('/subscriptions/add', subscriptionController.postAddSubscription);
router.post('/subscriptions/:id/toggle', subscriptionController.toggleSubscriptionStatus);
router.delete('/subscriptions/:id', subscriptionController.deleteSubscription);

module.exports = router;

