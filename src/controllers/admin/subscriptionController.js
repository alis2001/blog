const Subscription = require('../../models/Subscription');
const { body, validationResult } = require('express-validator');
const { sendWelcomeEmail } = require('../../utils/emailService');

// Get all subscriptions with search and filter
exports.getSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    // Search by email
    if (req.query.search) {
      filter.email = { $regex: req.query.search, $options: 'i' };
    }
    
    // Filter by status
    if (req.query.status === 'active') {
      filter.isActive = true;
    } else if (req.query.status === 'inactive') {
      filter.isActive = false;
    }
    
    const [subscriptions, total, activeCount, inactiveCount] = await Promise.all([
      Subscription.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Subscription.countDocuments(filter),
      Subscription.countDocuments({ isActive: true }),
      Subscription.countDocuments({ isActive: false })
    ]);
    
    res.render('admin/subscriptions/list', {
      user: req.user,
      subscriptions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      filters: req.query,
      stats: {
        total: activeCount + inactiveCount,
        active: activeCount,
        inactive: inactiveCount
      }
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).render('admin/error', {
      message: 'Failed to load subscriptions',
      user: req.user
    });
  }
};

// Add subscription manually
exports.postAddSubscription = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('sendWelcome')
    .optional()
    .isBoolean(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }

    try {
      const { email, sendWelcome } = req.body;

      // Check if email already exists
      const existingSubscription = await Subscription.findOne({ email });

      if (existingSubscription) {
        if (existingSubscription.isActive) {
          return res.status(400).json({ 
            success: false, 
            message: 'This email is already subscribed.' 
          });
        } else {
          // Reactivate subscription
          existingSubscription.isActive = true;
          existingSubscription.subscribedAt = new Date();
          existingSubscription.unsubscribedAt = undefined;
          await existingSubscription.save();
          
          // Send welcome email if requested
          if (sendWelcome === true || sendWelcome === 'true') {
            sendWelcomeEmail(email).catch(err => {
              console.error('Failed to send welcome email:', err);
            });
          }
          
          return res.status(200).json({ 
            success: true, 
            message: 'Subscription reactivated successfully.' 
          });
        }
      }

      // Create new subscription
      const newSubscription = new Subscription({ email });
      await newSubscription.save();

      // Send welcome email if requested
      if (sendWelcome === true || sendWelcome === 'true') {
        sendWelcomeEmail(email).catch(err => {
          console.error('Failed to send welcome email:', err);
        });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Subscription added successfully.' 
      });
    } catch (error) {
      console.error('Add subscription error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to add subscription. Please try again.' 
      });
    }
  }
];

// Delete subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Subscription not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Subscription deleted successfully' 
    });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete subscription' 
    });
  }
};

// Toggle subscription status (activate/deactivate)
exports.toggleSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Subscription not found' 
      });
    }
    
    subscription.isActive = !subscription.isActive;
    
    if (subscription.isActive) {
      subscription.subscribedAt = new Date();
      subscription.unsubscribedAt = undefined;
    } else {
      subscription.unsubscribedAt = new Date();
    }
    
    await subscription.save();
    
    res.json({ 
      success: true, 
      message: `Subscription ${subscription.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: subscription.isActive
    });
  } catch (error) {
    console.error('Toggle subscription status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update subscription status' 
    });
  }
};
