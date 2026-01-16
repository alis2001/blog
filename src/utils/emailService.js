const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send welcome email to new subscriber
const sendWelcomeEmail = async (email) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Pahlavi for Iran <pahlaviforiran@gmail.com>',
      to: email,
      subject: 'Welcome to Pahlavi for Iran Newsletter!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #239F40 0%, #ffffff 50%, #DA0000 100%);
              padding: 30px;
              text-align: center;
              color: #000000;
            }
            .header h1 {
              margin: 0;
              font-weight: 300;
              font-size: 28px;
              letter-spacing: 2px;
            }
            .content {
              padding: 30px;
              background: #ffffff;
            }
            .content h2 {
              color: #000000;
              font-weight: 300;
              font-size: 22px;
              margin-bottom: 15px;
            }
            .content p {
              font-weight: 300;
              line-height: 1.8;
              margin-bottom: 15px;
            }
            .cta-button {
              display: inline-block;
              padding: 14px 32px;
              background: #000000;
              color: #ffffff;
              text-decoration: none;
              margin: 20px 0;
              font-weight: 300;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999999;
              border-top: 1px solid #e5e5e5;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PAHLAVI FOR IRAN</h1>
          </div>
          <div class="content">
            <h2>Welcome to Our Newsletter!</h2>
            <p>Thank you for subscribing to Pahlavi for Iran newsletter. We are committed to keeping you informed about the Iranian Revolution 2026 and the ongoing fight for freedom, democracy, and justice in Iran.</p>
            
            <p><strong>What you'll receive:</strong></p>
            <ul>
              <li>Breaking news about the Iranian Revolution 2026</li>
              <li>Analysis and updates on developments in Iran</li>
              <li>Historical context and information about the Pahlavi dynasty</li>
              <li>Stories of courage and resistance from the Iranian people</li>
            </ul>
            
            <p>You will be notified immediately when new articles are published, so you never miss important updates.</p>
            
            <a href="${process.env.SITE_URL || 'http://localhost:3001'}" class="cta-button">Visit Website</a>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">This is a free service. You can unsubscribe at any time by contacting us.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Pahlavi for Iran. All rights reserved.</p>
            <p>You received this email because you subscribed to our newsletter.</p>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send news notification to subscribers
const sendNewsNotification = async (article, subscribers) => {
  try {
    const transporter = createTransporter();
    
    const articleUrl = `${process.env.SITE_URL || 'http://localhost:3001'}/article/${article.slug}`;
    
    // Send emails in batches to avoid overwhelming the server
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const batch of batches) {
      const emailPromises = batch.map(async (subscriber) => {
        try {
          const mailOptions = {
            from: process.env.EMAIL_FROM || 'Pahlavi for Iran <pahlaviforiran@gmail.com>',
            to: subscriber.email,
            subject: `New Article: ${article.title}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body {
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background: linear-gradient(135deg, #239F40 0%, #ffffff 50%, #DA0000 100%);
                    padding: 30px;
                    text-align: center;
                    color: #000000;
                  }
                  .header h1 {
                    margin: 0;
                    font-weight: 300;
                    font-size: 24px;
                    letter-spacing: 2px;
                  }
                  .content {
                    padding: 30px;
                    background: #ffffff;
                  }
                  .article-title {
                    color: #000000;
                    font-weight: 300;
                    font-size: 26px;
                    margin-bottom: 20px;
                    line-height: 1.4;
                  }
                  .article-excerpt {
                    font-weight: 300;
                    line-height: 1.8;
                    margin-bottom: 20px;
                    color: #555555;
                  }
                  .article-image {
                    width: 100%;
                    height: auto;
                    margin-bottom: 20px;
                  }
                  .cta-button {
                    display: inline-block;
                    padding: 14px 32px;
                    background: #000000;
                    color: #ffffff;
                    text-decoration: none;
                    margin: 20px 0;
                    font-weight: 300;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                  }
                  .meta-info {
                    padding: 15px;
                    background: #f5f5f5;
                    margin-bottom: 20px;
                    font-size: 14px;
                  }
                  .footer {
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                    border-top: 1px solid #e5e5e5;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>NEW ARTICLE PUBLISHED</h1>
                </div>
                <div class="content">
                  ${article.featuredImage ? `<img src="${article.featuredImage}" alt="${article.title}" class="article-image">` : ''}
                  
                  <h2 class="article-title">${article.title}</h2>
                  
                  <div class="meta-info">
                    <strong>Category:</strong> ${article.category?.name || 'News'}<br>
                    <strong>Published:</strong> ${new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    ${article.source?.name ? `<br><strong>Source:</strong> ${article.source.name}` : ''}
                  </div>
                  
                  ${article.excerpt ? `<p class="article-excerpt">${article.excerpt}</p>` : ''}
                  
                  <a href="${articleUrl}" class="cta-button">Read Full Article</a>
                  
                  <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    Stay informed about the Iranian Revolution 2026 and the fight for freedom in Iran.
                  </p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Pahlavi for Iran. All rights reserved.</p>
                  <p>You received this email because you subscribed to our newsletter.</p>
                  <p>To unsubscribe, please contact us at ${process.env.EMAIL_USER}</p>
                </div>
              </body>
              </html>
            `
          };
          
          await transporter.sendMail(mailOptions);
          successCount++;
        } catch (error) {
          console.error(`Failed to send email to ${subscriber.email}:`, error.message);
          failCount++;
        }
      });
      
      await Promise.all(emailPromises);
      
      // Wait a bit between batches
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`News notification sent: ${successCount} successful, ${failCount} failed`);
    return { success: true, successCount, failCount };
  } catch (error) {
    console.error('Error sending news notifications:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNewsNotification
};
