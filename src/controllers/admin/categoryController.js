const Category = require('../../models/Category');
const Article = require('../../models/Article');

exports.getCategories = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const categories = await Category.find(query).sort({ order: 1, name: 1 });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const articleCount = await Article.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          articleCount
        };
      })
    );
    
    res.render('admin/categories/list', {
      user: req.user,
      categories: categoriesWithCount,
      search: search || '',
      status: status || ''
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load categories',
      user: req.user
    });
  }
};

exports.getCreateCategory = (req, res) => {
  res.render('admin/categories/create', {
    user: req.user,
    errors: req.validationErrors || [],
    formData: {}
  });
};

exports.postCreateCategory = async (req, res) => {
  try {
    if (req.validationErrors) {
      return res.render('admin/categories/create', {
        user: req.user,
        errors: req.validationErrors,
        formData: req.body
      });
    }
    
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      order: req.body.order || 0,
      isActive: req.body.isActive !== 'off'
    });
    
    await category.save();
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Create category error:', error);
    res.render('admin/categories/create', {
      user: req.user,
      errors: [{ msg: error.code === 11000 ? 'Category name already exists' : 'Failed to create category' }],
      formData: req.body
    });
  }
};

exports.getEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).render('admin/error', {
        message: 'Category not found',
        user: req.user
      });
    }
    
    res.render('admin/categories/edit', {
      user: req.user,
      category,
      errors: req.validationErrors || []
    });
  } catch (error) {
    console.error('Get edit category error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load category',
      user: req.user
    });
  }
};

exports.postEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).render('admin/error', {
        message: 'Category not found',
        user: req.user
      });
    }
    
    if (req.validationErrors) {
      return res.render('admin/categories/edit', {
        user: req.user,
        category: { ...category.toObject(), ...req.body },
        errors: req.validationErrors
      });
    }
    
    category.name = req.body.name;
    category.description = req.body.description;
    category.order = req.body.order || 0;
    category.isActive = req.body.isActive !== 'off';
    
    await category.save();
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Edit category error:', error);
    const category = await Category.findById(req.params.id);
    res.render('admin/categories/edit', {
      user: req.user,
      category,
      errors: [{ msg: error.code === 11000 ? 'Category name already exists' : 'Failed to update category' }]
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const articleCount = await Article.countDocuments({ category: req.params.id });
    
    if (articleCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${articleCount} articles`
      });
    }
    
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};

