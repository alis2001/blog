const User = require('../../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('approvedBy', 'email')
      .sort({ createdAt: -1 });
    
    res.render('admin/users/list', {
      user: req.user,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load users',
      user: req.user
    });
  }
};

exports.approveUser = async (req, res) => {
  try {
    if (!req.user.isMainAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only main admin can approve users'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.isActive = true;
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: 'User approved successfully'
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve user'
    });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    if (!req.user.isMainAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only main admin can reject users'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.isMainAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete main admin'
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'User rejected and removed'
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject user'
    });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    if (!req.user.isMainAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only main admin can deactivate users'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.isMainAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate main admin'
      });
    }
    
    user.isActive = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user'
    });
  }
};

