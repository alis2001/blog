document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.style.color = '#667eea';
    }
  });

  // Contact Modal Setup
  const fabBtn = document.getElementById('contactFabBtn');
  const overlay = document.getElementById('contactModalOverlay');
  const closeBtn = document.getElementById('contactModalCloseBtn');
  const contactForm = document.getElementById('contactForm');
  const modal = document.querySelector('.contact-modal');

  // Open modal
  if (fabBtn) {
    fabBtn.addEventListener('click', function() {
      overlay.style.display = 'flex';
      overlay.offsetHeight; // Trigger reflow
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close modal on X button
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
  }

  // Close modal on overlay click
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }

  // Prevent modal content click from closing
  if (modal) {
    modal.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Close modal function
  function closeModal() {
    overlay.classList.remove('active');
    setTimeout(function() {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
    
    // Reset form
    if (contactForm) {
      contactForm.reset();
    }
    var status = document.getElementById('contactFormStatus');
    if (status) {
      status.className = 'contact-form-status';
      status.textContent = '';
    }
  }

  // Form submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var submitBtn = document.getElementById('contactSubmitBtn');
      var status = document.getElementById('contactFormStatus');
      
      // Get form data
      var formData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        subject: document.getElementById('contactSubject').value.trim(),
        message: document.getElementById('contactMessage').value.trim()
      };
      
      // Basic validation
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        status.className = 'contact-form-status error';
        status.textContent = 'Please fill in all fields.';
        return;
      }
      
      // Disable button
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Send request
      fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.success) {
          status.className = 'contact-form-status success';
          status.textContent = data.message;
          contactForm.reset();
          
          // Close modal after 3 seconds
          setTimeout(function() {
            closeModal();
          }, 3000);
        } else {
          status.className = 'contact-form-status error';
          status.textContent = data.message || 'Failed to send message. Please try again.';
        }
      })
      .catch(function(error) {
        console.error('Contact form error:', error);
        status.className = 'contact-form-status error';
        status.textContent = 'An error occurred. Please try again later.';
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closeModal();
    }
  });
});

// Newsletter Subscription Handler
document.addEventListener('DOMContentLoaded', function() {
  const subscriptionForm = document.getElementById('subscriptionForm');
  
  if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const emailInput = document.getElementById('subscriptionEmail');
      const submitBtn = document.getElementById('subscriptionBtn');
      const status = document.getElementById('subscriptionStatus');
      
      const email = emailInput.value.trim();
      
      // Basic validation
      if (!email) {
        status.className = 'subscription-status error';
        status.textContent = 'Please enter your email address.';
        return;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        status.className = 'subscription-status error';
        status.textContent = 'Please enter a valid email address.';
        return;
      }
      
      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';
      status.className = 'subscription-status';
      status.textContent = '';
      
      // Send subscription request
      fetch('/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.success) {
          status.className = 'subscription-status success';
          status.textContent = data.message;
          emailInput.value = '';
        } else {
          status.className = 'subscription-status error';
          status.textContent = data.message || 'Failed to subscribe. Please try again.';
        }
      })
      .catch(function(error) {
        console.error('Subscription error:', error);
        status.className = 'subscription-status error';
        status.textContent = 'An error occurred. Please try again later.';
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe Free';
      });
    });
  }
});
