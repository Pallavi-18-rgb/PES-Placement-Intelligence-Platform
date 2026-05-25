const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mock middleware behaviour for JWT verification (simplified for demo)
const extractUserIdFromAuth = (req) => {
  // In a real scenario, validate JWT and extract user ID.
  // For now, we look for a custom header or default to a mock ID
  return req.headers['x-user-id'] || 'mock-user-uuid';
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = extractUserIdFromAuth(req);
    
    // In dev mode without real DB data, we'll return mock data if not found
    let user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      // Return mock user for demonstration purposes if DB is empty
      user = {
        id: userId,
        name: "Jane Doe",
        email: "jane.doe@university.edu",
        role: "student",
        cgpa: 8.5,
        branch: "Computer Science",
        active_backlogs: 0
      };
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { cgpa, active_backlogs, branch } = req.body;

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        ...(cgpa !== undefined && { cgpa }),
        ...(active_backlogs !== undefined && { active_backlogs }),
        ...(branch !== undefined && { branch })
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    // If user doesn't exist in our mock setup
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
