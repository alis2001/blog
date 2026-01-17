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
      pageTitle: 'Pahlavi for Iran - Iran Revolution 2026 News & Pahlavi Dynasty History',
      metaDescription: 'Latest news about Iran Revolution 2026, democratic reforms, and comprehensive history of the Pahlavi dynasty. Stay informed about the fight for freedom, democracy and justice in Iran.',
      metaKeywords: 'Iran Revolution 2026, Pahlavi Dynasty, Reza Pahlavi, Iran News, Iranian Protests, Democracy Iran, Freedom Iran, Mohammad Reza Shah, Reza Shah, Persian History',
      canonicalUrl: 'https://pahlaviforiran.com/',
      ogType: 'website'
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).render('public/error', {
      message: 'Failed to load page'
    });
  }
};

