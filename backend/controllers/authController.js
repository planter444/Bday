const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

// Register admin user
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const { data: newUser, error } = await supabase
      .from('admin_users')
      .insert([{ email, password: hashedPassword }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN 
    });
    
    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login admin user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN 
    });
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Verify token
const verifyToken = async (req, res) => {
  try {
    const user = req.user;
    res.json({ valid: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
};

module.exports = { register, login, verifyToken };
