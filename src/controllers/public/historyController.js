const Article = require('../../models/Article');
const Category = require('../../models/Category');

exports.getHistoryPage = async (req, res) => {
  try {
    const historyCategory = await Category.findOne({ slug: 'history', isActive: true });
    
    if (!historyCategory) {
      return res.status(404).render('public/error', {
        message: 'History section not found'
      });
    }
    
    const [featuredArticles, timelineArticles, biographyArticles, categories] = await Promise.all([
      Article.find({ 
        category: historyCategory._id, 
        status: 'published',
        isFeatured: true 
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .populate('category', 'name slug'),
      Article.find({ 
        category: historyCategory._id, 
        status: 'published',
        tags: 'timeline'
      })
        .sort({ publishedAt: -1 })
        .limit(6)
        .populate('category', 'name slug'),
      Article.find({ 
        category: historyCategory._id, 
        status: 'published',
        tags: 'biography'
      })
        .sort({ publishedAt: -1 })
        .limit(4)
        .populate('category', 'name slug'),
      Category.find({ isActive: true }).sort({ order: 1, name: 1 })
    ]);
    
    const allHistoryArticles = await Article.find({ 
      category: historyCategory._id, 
      status: 'published'
    })
      .sort({ publishedAt: -1 })
      .limit(12)
      .populate('category', 'name slug');
    
    res.render('public/history', {
      category: historyCategory,
      featuredArticles,
      timelineArticles,
      biographyArticles,
      allHistoryArticles,
      categories,
      pageTitle: 'History - Pahlavi Dynasty'
    });
  } catch (error) {
    console.error('History page error:', error);
    res.status(500).render('public/error', {
      message: 'Failed to load history page'
    });
  }
};

