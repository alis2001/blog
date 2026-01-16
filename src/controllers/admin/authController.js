const User = require('../../models/User');

exports.getLogin = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', {
    error: null,
    email: ''
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.render('admin/login', {
        error: 'Invalid email or password',
        email
      });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    req.session.userId = user._id;
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('admin/login', {
      error: 'An error occurred. Please try again.',
      email: req.body.email || ''
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
};

exports.getDashboard = async (req, res) => {
  try {
    const Article = require('../../models/Article');
    const Category = require('../../models/Category');
    
    const [totalArticles, publishedArticles, draftArticles, totalCategories] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      Article.countDocuments({ status: 'draft' }),
      Category.countDocuments({ isActive: true })
    ]);
    
    const recentArticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category', 'name')
      .populate('author', 'email');
    
    res.render('admin/dashboard', {
      user: req.user,
      stats: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalCategories
      },
      recentArticles
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load dashboard',
      user: req.user
    });
  }
};

