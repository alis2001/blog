const Subscription = require('../../models/Subscription');
const { body, validationResult } = require('express-validator');
const { sendWelcomeEmail } = require('../../utils/emailService');

exports.subscribe = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }

    try {
      const { email } = req.body;

      // Check if email already exists
      const existingSubscription = await Subscription.findOne({ email });

      if (existingSubscription) {
        if (existingSubscription.isActive) {
          return res.status(400).json({ 
            success: false, 
            message: 'This email is already subscribed to our newsletter.' 
          });
        } else {
          // Reactivate subscription
          existingSubscription.isActive = true;
          existingSubscription.subscribedAt = new Date();
          existingSubscription.unsubscribedAt = undefined;
          await existingSubscription.save();
          
          // Send welcome email for reactivated subscription
          sendWelcomeEmail(email).catch(err => {
            console.error('Failed to send welcome email:', err);
          });
          
          return res.status(200).json({ 
            success: true, 
            message: 'Welcome back! Your subscription has been reactivated.' 
          });
        }
      }

      // Create new subscription
      const newSubscription = new Subscription({ email });
      await newSubscription.save();

      // Send welcome email (don't wait for it to complete)
      sendWelcomeEmail(email).catch(err => {
        console.error('Failed to send welcome email:', err);
      });

      res.status(201).json({ 
        success: true, 
        message: 'Thank you for subscribing! You will receive updates about the Iranian Revolution 2026.' 
      });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to process subscription. Please try again later.' 
      });
    }
  }
];
