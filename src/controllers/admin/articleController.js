const Article = require('../../models/Article');
const Category = require('../../models/Category');
const sanitizeHtml = require('sanitize-html');

exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const [articles, total, categories] = await Promise.all([
      Article.find(filter)
        .populate('category', 'name')
        .populate('author', 'email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(filter),
      Category.find({ isActive: true }).sort({ name: 1 })
    ]);
    
    res.render('admin/articles/list', {
      user: req.user,
      articles,
      categories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      filters: req.query
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load articles',
      user: req.user
    });
  }
};

exports.getCreateArticle = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    res.render('admin/articles/create', {
      user: req.user,
      categories,
      errors: req.validationErrors || [],
      formData: {}
    });
  } catch (error) {
    console.error('Get create article error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load create form',
      user: req.user
    });
  }
};

exports.postCreateArticle = async (req, res) => {
  try {
    if (req.validationErrors) {
      const categories = await Category.find({ isActive: true }).sort({ name: 1 });
      return res.render('admin/articles/create', {
        user: req.user,
        categories,
        errors: req.validationErrors,
        formData: req.body
      });
    }
    
    const sanitizedContent = sanitizeHtml(req.body.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'title'],
        a: ['href', 'target', 'rel']
      }
    });
    
    const sourceData = {};
    if (req.body.sourceType && req.body.sourceType !== 'original') {
      sourceData.type = req.body.sourceType;
      if (req.body.sourceName) sourceData.name = req.body.sourceName;
      if (req.body.sourceUrl) sourceData.url = req.body.sourceUrl;
      if (req.body.sourceAuthor) sourceData.author = req.body.sourceAuthor;
      if (req.body.sourceDate) sourceData.originalPublishDate = new Date(req.body.sourceDate);
    } else {
      sourceData.type = 'original';
    }

    const article = new Article({
      title: req.body.title,
      content: sanitizedContent,
      excerpt: req.body.excerpt,
      category: req.body.category,
      author: req.user._id,
      status: req.body.status || 'draft',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      featuredImage: req.file ? `/uploads/${req.file.filename}` : null,
      isFeatured: req.body.isFeatured === 'on',
      source: sourceData
    });
    
    await article.save();
    res.redirect('/admin/articles');
  } catch (error) {
    console.error('Create article error:', error);
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.render('admin/articles/create', {
      user: req.user,
      categories,
      errors: [{ msg: 'Failed to create article' }],
      formData: req.body
    });
  }
};

exports.getEditArticle = async (req, res) => {
  try {
    const [article, categories] = await Promise.all([
      Article.findById(req.params.id).populate('category'),
      Category.find({ isActive: true }).sort({ name: 1 })
    ]);
    
    if (!article) {
      return res.status(404).render('admin/error', {
        message: 'Article not found',
        user: req.user
      });
    }
    
    res.render('admin/articles/edit', {
      user: req.user,
      article,
      categories,
      errors: req.validationErrors || []
    });
  } catch (error) {
    console.error('Get edit article error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load article',
      user: req.user
    });
  }
};

exports.postEditArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).render('admin/error', {
        message: 'Article not found',
        user: req.user
      });
    }
    
    if (req.validationErrors) {
      const categories = await Category.find({ isActive: true }).sort({ name: 1 });
      return res.render('admin/articles/edit', {
        user: req.user,
        article: { ...article.toObject(), ...req.body },
        categories,
        errors: req.validationErrors
      });
    }
    
    const sanitizedContent = sanitizeHtml(req.body.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'title'],
        a: ['href', 'target', 'rel']
      }
    });
    
    article.title = req.body.title;
    article.content = sanitizedContent;
    article.excerpt = req.body.excerpt;
    article.category = req.body.category;
    article.status = req.body.status;
    article.tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];
    if (req.file) {
      article.featuredImage = `/uploads/${req.file.filename}`;
    }
    article.isFeatured = req.body.isFeatured === 'on';
    
    if (req.body.sourceType && req.body.sourceType !== 'original') {
      article.source = {
        type: req.body.sourceType,
        name: req.body.sourceName || '',
        url: req.body.sourceUrl || '',
        author: req.body.sourceAuthor || '',
        originalPublishDate: req.body.sourceDate ? new Date(req.body.sourceDate) : null
      };
    } else {
      article.source = { type: 'original' };
    }
    
    await article.save();
    res.redirect('/admin/articles');
  } catch (error) {
    console.error('Edit article error:', error);
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    const article = await Article.findById(req.params.id);
    res.render('admin/articles/edit', {
      user: req.user,
      article,
      categories,
      errors: [{ msg: 'Failed to update article' }]
    });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete article' });
  }
};

