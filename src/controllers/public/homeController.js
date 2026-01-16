const Article = require('../../models/Article');
const Category = require('../../models/Category');

exports.getHome = async (req, res) => {
  try {
    // Get news category
    const newsCategory = await Category.findOne({ slug: 'news' });
    
    const [featuredArticles, latestArticles, latestNews, categories] = await Promise.all([
      Article.find({ status: 'published', isFeatured: true })
        .sort({ publishedAt: -1 })
        .limit(3)
        .populate('category', 'name slug'),
      Article.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(6)
        .populate('category', 'name slug'),
      // Get latest 3 news articles
      newsCategory ? Article.find({ 
        status: 'published', 
        category: newsCategory._id 
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .populate('category', 'name slug') : Promise.resolve([]),
      Category.find({ isActive: true }).sort({ order: 1, name: 1 })
    ]);
    
    res.render('public/home', {
      featuredArticles,
      latestArticles,
      latestNews,
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

