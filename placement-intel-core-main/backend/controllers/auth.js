import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'placement-intel-super-secret-key-2024';

// In-memory mock database for users (for demo purposes)
const usersDB = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@pes.edu',
    passwordHash: '$2b$10$7bgJfiUa3d/6VeXbkC1/Oe6I4oIaYy6ltIZSc9U7QSMukdLlnb7OK', 
    role: 'admin'
  }
];

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = usersDB.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ success: true, token, user: payload });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (usersDB.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: usersDB.length + 1,
      name,
      email,
      passwordHash,
      role: 'user'
    };

    usersDB.push(newUser);

    const payload = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ success: true, token, user: payload });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is populated by the auth middleware
    const user = usersDB.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ success: true, user: payload });
  } catch (error) {
    next(error);
  }
};
