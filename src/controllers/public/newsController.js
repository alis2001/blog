const Article = require('../../models/Article');
const Category = require('../../models/Category');

exports.getNewsPage = async (req, res) => {
  try {
    const newsCategory = await Category.findOne({ slug: 'news', isActive: true });
    
    if (!newsCategory) {
      return res.status(404).render('public/error', {
        message: 'News section not found'
      });
    }
    
    const [breakingNews, recentNews, categories] = await Promise.all([
      Article.find({ 
        category: newsCategory._id, 
        status: 'published',
        isFeatured: true 
      })
        .sort({ publishedAt: -1 })
        .limit(1)
        .populate('category', 'name slug'),
      Article.find({ 
        category: newsCategory._id, 
        status: 'published'
      })
        .sort({ publishedAt: -1 })
        .limit(20)
        .populate('category', 'name slug'),
      Category.find({ isActive: true }).sort({ order: 1, name: 1 })
    ]);
    
    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeek = recentNews.filter(article => 
      new Date(article.publishedAt) >= last7Days
    );
    
    const thisMonth = recentNews.filter(article => 
      new Date(article.publishedAt) >= last30Days && 
      new Date(article.publishedAt) < last7Days
    );
    
    const older = recentNews.filter(article => 
      new Date(article.publishedAt) < last30Days
    );
    
    res.render('public/news', {
      category: newsCategory,
      breakingNews: breakingNews[0] || null,
      thisWeek,
      thisMonth,
      older,
      categories,
      pageTitle: 'News - Latest Updates'
    });
  } catch (error) {
    console.error('News page error:', error);
    res.status(500).render('public/error', {
      message: 'Failed to load news page'
    });
  }
};

