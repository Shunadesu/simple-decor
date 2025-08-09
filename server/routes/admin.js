const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock admin database (trong thực tế sẽ dùng MongoDB)
let admins = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@zuna.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'super_admin',
    permissions: ['manage_users', 'manage_content', 'manage_products', 'manage_blog', 'manage_settings'],
    createdAt: new Date(),
    lastLogin: null
  }
];

// Mock settings data
let settings = {
  general: {
    siteName: 'Zuna Simple Decor',
    siteDescription: 'The Green Path Forward',
    contactEmail: 'cs@simpledecor.vn',
    contactPhone: '+84-989809313',
    address: 'Ho Chi Minh City, Vietnam'
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  },
  appearance: {
    primaryColor: '#16a34a',
    secondaryColor: '#0ea5e9',
    logo: '',
    favicon: ''
  },
  email: {
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    fromEmail: 'noreply@zuna.com',
    fromName: 'Zuna Simple Decor'
  }
};

// Mock about data
let aboutData = {
  story: {
    title: 'Our Story',
    content: 'Zuna Simple Decor was founded with a vision to bring sustainable and beautiful home decor to every household.',
    image: ''
  },
  mission: {
    title: 'Our Mission',
    content: 'To provide high-quality, eco-friendly home decor products that enhance living spaces while protecting our environment.',
    image: ''
  },
  vision: {
    title: 'Our Vision',
    content: 'To become the leading provider of sustainable home decor solutions, inspiring conscious living worldwide.',
    image: ''
  },
  values: [
    {
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and materials'
    },
    {
      title: 'Quality',
      description: 'Delivering premium products that last'
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our products and processes'
    }
  ],
  team: [
    {
      name: 'John Doe',
      position: 'CEO',
      image: ''
    },
    {
      name: 'Jane Smith',
      position: 'Design Director',
      image: ''
    }
  ],
  achievements: []
};

// Create admin
router.post('/create', async (req, res) => {
  try {
    const { username, email, password, role, permissions } = req.body;

    // Validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if admin already exists
    const existingAdmin = admins.find(admin => 
      admin.username === username || admin.email === email
    );

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = {
      id: admins.length + 1,
      username,
      email,
      password: hashedPassword,
      role,
      permissions: permissions || [],
      createdAt: new Date(),
      lastLogin: null
    };

    admins.push(newAdmin);

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = newAdmin;

    res.status(201).json({
      message: 'Admin created successfully',
      admin: adminWithoutPassword
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all admins
router.get('/list', (req, res) => {
  try {
    // Remove passwords from response
    const adminsWithoutPasswords = admins.map(admin => {
      const { password, ...adminWithoutPassword } = admin;
      return adminWithoutPassword;
    });

    res.json(adminsWithoutPasswords);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = admins.find(a => a.username === username || a.email === username);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();

    // Create JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role,
        permissions: admin.permissions 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    res.json({
      message: 'Login successful',
      token,
      user: adminWithoutPassword
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// POST /api/admin/refresh-token - Refresh access token
router.post('/refresh-token', verifyToken, (req, res) => {
  try {
    const admin = admins.find(a => a.id === req.user.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Generate new token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role,
        permissions: admin.permissions 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current admin profile
router.get('/profile', verifyToken, (req, res) => {
  try {
    const admin = admins.find(a => a.id === req.user.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const { password, ...adminWithoutPassword } = admin;
    res.json(adminWithoutPassword);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Settings routes
router.get('/settings', verifyToken, (req, res) => {
  try {
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/settings', verifyToken, (req, res) => {
  try {
    settings = { ...settings, ...req.body };
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// About routes
router.get('/about', verifyToken, (req, res) => {
  try {
    res.json(aboutData);
  } catch (error) {
    console.error('Error fetching about data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/about', verifyToken, (req, res) => {
  try {
    aboutData = { ...aboutData, ...req.body };
    res.json({ message: 'About data updated successfully', aboutData });
  } catch (error) {
    console.error('Error updating about data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 