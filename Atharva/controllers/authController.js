const { db } = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res, role) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role,
      createdAt: new Date().toISOString()
    };

    const docRef = await usersRef.add(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: docRef.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerStudent = async (req, res) => {
  return registerUser(req, res, 'student');
};

const registerLibrarian = async (req, res) => {
  const { secretKey } = req.body;
  if (secretKey !== (process.env.LIBRARIAN_SECRET || 'supersecretkey')) {
    return res.status(403).json({ success: false, message: 'Invalid secret key' });
  }
  return registerUser(req, res, 'librarian');
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { uid: userDoc.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, token, role: user.role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userData = doc.data();
    delete userData.password;
    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerStudent, registerLibrarian, login, getProfile };
