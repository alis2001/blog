exports.getRezaPahlaviPage = async (req, res) => {
  try {
    res.render('public/reza-pahlavi', {
      pageTitle: 'Reza Pahlavi - Crown Prince of Iran'
    });
  } catch (error) {
    console.error('Reza Pahlavi page error:', error);
    res.status(500).render('public/error', {
      message: 'Failed to load page'
    });
  }
};

