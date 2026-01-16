const Message = require('../../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const { filter } = req.query;
    
    let query = { isArchived: false };
    
    if (filter === 'unread') {
      query.isRead = false;
    } else if (filter === 'read') {
      query.isRead = true;
    } else if (filter === 'archived') {
      query = { isArchived: true };
    }
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .populate('readBy', 'email');
    
    const unreadCount = await Message.countDocuments({ isRead: false, isArchived: false });
    
    res.render('admin/messages/list', {
      user: req.user,
      messages,
      unreadCount,
      currentFilter: filter || 'all'
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load messages',
      user: req.user
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('readBy', 'email');
    
    if (!message) {
      return res.status(404).render('admin/error', {
        message: 'Message not found',
        user: req.user
      });
    }
    
    // Mark as read if not already
    if (!message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      message.readBy = req.user._id;
      await message.save();
    }
    
    res.render('admin/messages/view', {
      user: req.user,
      message
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load message',
      user: req.user
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    message.isRead = true;
    message.readAt = new Date();
    message.readBy = req.user._id;
    await message.save();
    
    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message'
    });
  }
};

exports.markAsUnread = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    message.isRead = false;
    message.readAt = null;
    message.readBy = null;
    await message.save();
    
    res.json({
      success: true,
      message: 'Message marked as unread'
    });
  } catch (error) {
    console.error('Mark as unread error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message'
    });
  }
};

exports.archiveMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    message.isArchived = true;
    await message.save();
    
    res.json({
      success: true,
      message: 'Message archived'
    });
  } catch (error) {
    console.error('Archive message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive message'
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { isRead: false, isArchived: false },
      { 
        isRead: true, 
        readAt: new Date(),
        readBy: req.user._id 
      }
    );
    
    res.json({
      success: true,
      message: 'All messages marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ isRead: false, isArchived: false });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, count: 0 });
  }
};
