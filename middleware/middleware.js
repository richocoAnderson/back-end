const apiKey = 'sayaLaparBang123'; // Ganti dengan API key Anda

const Middleware = (req, res, next) => {
  // Dapatkan API key dari header atau query parameter
  const providedApiKey = req.header('x-api-key') || req.query.api_key;

  // Periksa apakah API key ada dan valid
  if (!providedApiKey || providedApiKey !== apiKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

module.exports = Middleware;
