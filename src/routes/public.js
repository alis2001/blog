const express = require('express');
const router = express.Router();

const homeController = require('../controllers/public/homeController');
const articleController = require('../controllers/public/articleController');
const historyController = require('../controllers/public/historyController');
const newsController = require('../controllers/public/newsController');
const rezaPahlaviController = require('../controllers/public/rezaPahlaviController');

router.get('/', homeController.getHome);
router.get('/history', historyController.getHistoryPage);
router.get('/news', newsController.getNewsPage);
router.get('/reza-pahlavi', rezaPahlaviController.getRezaPahlaviPage);
router.get('/article/:slug', articleController.getArticle);
router.get('/category/:slug', articleController.getArticlesByCategory);

module.exports = router;

