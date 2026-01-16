const Article = require('../../models/Article');
const Category = require('../../models/Category');

exports.getHome = async (req, res) => {
  try {
    const [featuredArticles, latestArticles, categories] = await Promise.all([
      Article.find({ status: 'published', isFeatured: true })
        .sort({ publishedAt: -1 })
        .limit(3)
        .populate('category', 'name slug'),
      Article.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(6)
        .populate('category', 'name slug'),
      Category.find({ isActive: true }).sort({ order: 1, name: 1 })
    ]);
    
    res.render('public/home', {
      featuredArticles,
      latestArticles,
      categories,
      pageTitle: 'Pahlavi for Iran - History and News'
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).render('public/error', {
      message: 'Failed to load page'
    });
  }
};

