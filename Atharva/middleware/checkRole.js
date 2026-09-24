const verifyStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden: Requires student role' });
};

const verifyLibrarian = (req, res, next) => {
  if (req.user && req.user.role === 'librarian') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden: Requires librarian role' });
};

module.exports = { verifyStudent, verifyLibrarian };
