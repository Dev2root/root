import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// Controller methods for User CRUD operations
export const userController = {
  // Create a new user
  createUser: async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: savedUser,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create user',
      });
    }
  },

  // Get all users with optional filtering and pagination
  getAllUsers: async (req: Request, res: Response) => {
    try {
      // Extract query parameters
      const { city, isActive, minAge, maxAge, page = '1', limit = '10', sort = 'name' } = req.query;
      
      // Build filter object
      const filter: any = {};
      
      // Add filters if provided
      if (city) filter.city = city;
      if (isActive !== undefined) filter.isActive = isActive === 'true';
      if (minAge || maxAge) {
        filter.age = {};
        if (minAge) filter.age.$gte = parseInt(minAge as string);
        if (maxAge) filter.age.$lte = parseInt(maxAge as string);
      }
      
      // Parse pagination parameters
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;
      
      // Create sort object
      const sortField = (sort as string).startsWith('-') 
        ? { [(sort as string).substring(1)]: -1 } 
        : { [sort as string]: 1 };
      
      // Execute query with filters, pagination, and sorting
      const users = await User.find(filter)
        .sort(sortField)
        .skip(skip)
        .limit(limitNum);
      
      const totalUsers = await User.countDocuments(filter);
      
      res.status(200).json({
        success: true,
        count: users.length,
        total: totalUsers,
        page: pageNum,
        pages: Math.ceil(totalUsers / limitNum),
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch users',
      });
    }
  },

  // Get a single user by ID
  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch user',
      });
    }
  },

  // Update a user
  updateUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update user',
      });
    }
  },

  // Delete a user
  deleteUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete user',
      });
    }
  },

  // Search users by name or email
  searchUsers: async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }
      
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      });
      
      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Search operation failed',
      });
    }
  },

  // Get user statistics by city
  getUserStatsByCity: async (req: Request, res: Response) => {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: '$city',
            count: { $sum: 1 },
            avgAge: { $avg: '$age' },
            activeUsers: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);
      
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get user statistics',
      });
    }
  }
};