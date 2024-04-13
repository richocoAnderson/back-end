const User = require('../controller/adminModel');

async function register(req, res) {
  const { email, password, userName } = req.body;
  const result = await User.createUser({ email, password, userName });
  if (result.error) {
    return res.status(400).json({ message: result.error });
  } else {
    return res.status(200).json({ message: result.message });
  }
}

async function login(req, res){
    try {
      const { email, password } = req.body;
      const result = await User.loginUser(email, password);
      res.status(200).json({ message: 'Login successful', user: result.user });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  };
  
module.exports = {
  register,
  login
};
