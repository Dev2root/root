// File: package.json
{
  "name": "user-management-crud",
  "version": "1.0.0",
  "description": "User Management CRUD operations with MongoDB",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/node": "^20.5.9",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  }
}

// File: tsconfig.json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}

// File: .env
MONGODB_URI=mongodb://localhost:27017/user_management
PORT=3000

// File: src/index.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/users', userRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('User Management CRUD API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// File: src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;

// File: src/controllers/userController.ts
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

// File: src/routes/userRoutes.ts
import express from 'express';
import { userController } from '../controllers/userController';

const router = express.Router();

// CRUD routes
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.get('/stats/city', userController.getUserStatsByCity);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;

// File: README.md
# User Management CRUD API

A TypeScript-based Express application with MongoDB for managing user profiles with CRUD operations.

## Features

- Create, Read, Update, Delete operations for user profiles
- Search functionality
- Filtering and pagination
- Advanced MongoDB aggregation for statistics
- TypeScript implementation with proper interfaces

## Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

## Installation and Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd user-management-crud
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/user_management
     PORT=3000
     ```

4. Start MongoDB (Ubuntu):
   ```
   sudo systemctl start mongod
   ```

## Running the Application

### Development Mode
```
npm run dev
```

### Production Mode
```
npm run build
npm start
```

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (supports filtering and pagination)
- `GET /api/users/:id` - Get a specific user by ID
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/users/search` - Search users by name or email
- `GET /api/users/stats/city` - Get user statistics by city

## Query Parameters for Filtering

- `city` - Filter users by city
- `isActive` - Filter by active status (true/false)
- `minAge` - Filter users with age greater than or equal to specified value
- `maxAge` - Filter users with age less than or equal to specified value
- `page` - Page number for pagination (default: 1)
- `limit` - Number of records per page (default: 10)
- `sort` - Field to sort by (prefix with - for descending order, e.g., -name)

## Sample Usage

### Creating a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "phone": "9876543210",
    "city": "Mumbai",
    "age": 28,
    "isActive": true
  }'
```

### Getting All Users with Filtering
```bash
curl "http://localhost:3000/api/users?city=Mumbai&minAge=25&page=1&limit=5&sort=name"
```

### Searching Users
```bash
curl "http://localhost:3000/api/users/search?query=rahul"
```

/* HOW TO RUN THIS PROJECT
1. SETUP ENVIRONMENT:
   - Ensure you have Node.js and npm installed:
     $ node --version
     $ npm --version
   
   - Ensure MongoDB is installed and running on Ubuntu:
     $ sudo systemctl status mongod
     $ sudo systemctl start mongod (if not running)

2. CREATE PROJECT STRUCTURE:
   - Create project directory:
     $ mkdir user-management-crud
     $ cd user-management-crud
   
   - Create the files with the contents shown above:
     $ mkdir -p src/models src/controllers src/routes
     $ touch package.json tsconfig.json .env README.md
     $ touch src/index.ts src/models/User.ts src/controllers/userController.ts src/routes/userRoutes.ts

3. INSTALL DEPENDENCIES:
   $ npm install

4. BUILD AND RUN THE PROJECT:
   - For development:
     $ npx ts-node src/index.ts
   
   - For production:
     $ npm run build
     $ npm start

5. TEST THE API:
   - Use curl, Postman, or any API testing tool to test the endpoints
   - Example to create a user:
     $ curl -X POST http://localhost:3000/api/users \
       -H "Content-Type: application/json" \
       -d '{
         "name": "Priya Patel",
         "email": "priya.patel@example.com",
         "phone": "9876543210",
         "city": "Bangalore",
         "age": 26,
         "isActive": true
       }'

6. ADDITIONAL COMMANDS:
   - MongoDB shell (if needed):
     $ mongosh
     > use user_management
     > db.users.find()
*/


