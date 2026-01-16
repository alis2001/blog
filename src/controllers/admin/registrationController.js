const User = require('../../models/User');

exports.getRegister = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/register', {
    error: null,
    success: null,
    formData: {}
  });
};

exports.postRegister = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      return res.render('admin/register', {
        error: 'Passwords do not match',
        success: null,
        formData: { email }
      });
    }
    
    if (password.length < 6) {
      return res.render('admin/register', {
        error: 'Password must be at least 6 characters',
        success: null,
        formData: { email }
      });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.render('admin/register', {
        error: 'An account with this email already exists',
        success: null,
        formData: { email }
      });
    }
    
    await User.create({
      email: email.toLowerCase(),
      password: password,
      role: 'editor',
      isActive: false,
      isMainAdmin: false
    });
    
    res.render('admin/register', {
      error: null,
      success: 'Registration submitted! Your account is pending approval by the administrator.',
      formData: {}
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.render('admin/register', {
      error: 'An error occurred during registration. Please try again.',
      success: null,
      formData: { email: req.body.email || '' }
    });
  }
};

