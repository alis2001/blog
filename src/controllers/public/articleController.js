const Article = require('../../models/Article');
const Category = require('../../models/Category');

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: 'published'
    })
      .populate('category', 'name slug')
      .populate('author', 'email');
    
    if (!article) {
      return res.status(404).render('public/error', {
        message: 'Article not found'
      });
    }
    
    article.views += 1;
    await article.save();
    
    const relatedArticles = await Article.find({
      category: article.category._id,
      status: 'published',
      _id: { $ne: article._id }
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .populate('category', 'name slug');
    
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    
    res.render('public/article', {
      article,
      relatedArticles,
      categories,
      pageTitle: article.title
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).render('public/error', {
      message: 'Failed to load article'
    });
  }
};

exports.getArticlesByCategory = async (req, res) => {
  try {
    const categorySlug = req.params.slug;
    
    if (categorySlug === 'news') {
      return res.redirect('/news');
    }
    
    if (categorySlug === 'history') {
      return res.redirect('/history');
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    
    const category = await Category.findOne({ slug: categorySlug, isActive: true });
    
    if (!category) {
      return res.status(404).render('public/error', {
        message: 'Category not found'
      });
    }
    
    const [articles, total, categories] = await Promise.all([
      Article.find({ category: category._id, status: 'published' })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name slug'),
      Article.countDocuments({ category: category._id, status: 'published' }),
      Category.find({ isActive: true }).sort({ order: 1 })
    ]);
    
    res.render('public/category', {
      category,
      articles,
      categories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      pageTitle: category.name
    });
  } catch (error) {
    console.error('Get category articles error:', error);
    res.status(500).render('public/error', {
      message: 'Failed to load category'
    });
  }
};

