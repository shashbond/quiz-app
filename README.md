# Online Quiz Application

A comprehensive online quiz platform with participant interface and admin dashboard featuring real-time timer, MCQ questions, scoring system, file uploads, and leaderboards.

## Features

### For Participants
- **User Authentication**: Secure registration and login system
- **Quiz Interface**: Clean, intuitive quiz-taking experience
- **Real-time Timer**: Countdown timer with automatic submission
- **MCQ Questions**: Multiple choice questions with 4 options
- **Scoring System**: +1 mark for correct answers, -0.25 for wrong answers
- **Leaderboard**: View rankings and compare performance
- **Quiz History**: Track previous attempts and scores

### For Administrators
- **Admin Dashboard**: Comprehensive quiz management interface
- **Quiz Creation**: Create and configure quizzes with various settings
- **Question Management**: Add, edit, and delete questions
- **File Upload**: Import questions from Word documents (.docx)
- **Media Support**: Add images and videos to questions
- **Real-time Monitoring**: Track quiz progress and participant activity
- **Results Analysis**: View detailed analytics and leaderboards

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: Database for storing users, quizzes, questions, and results
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **Socket.io**: Real-time communication
- **Multer**: File upload handling
- **Mammoth**: Word document processing

### Frontend
- **React**: User interface library
- **Material-UI**: Component library for modern design
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API calls
- **Socket.io Client**: Real-time features
- **React Timer Hook**: Timer functionality
- **React Dropzone**: File upload interface

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quiz-app
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database and collections

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your `.env` file

### 5. Create Upload Directory
```bash
# From the backend directory
mkdir uploads
```

### 6. Start the Application

#### Development Mode (Both frontend and backend)
```bash
# From the root directory
npm run dev
```

#### Start Backend Only
```bash
cd backend
npm run dev
```

#### Start Frontend Only
```bash
cd frontend
npm start
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Usage Guide

### Creating Your First Admin Account
1. Navigate to http://localhost:3000
2. Click "Register"
3. Fill in your details and select "Admin" as role
4. Login with your credentials

### Creating a Quiz
1. Login as admin
2. Go to "Manage Quizzes"
3. Click "Create New Quiz"
4. Fill in quiz details (title, duration, etc.)
5. Save the quiz

### Adding Questions
1. From quiz management, click "Manage Questions"
2. Click "Add Question" or "Upload Document"
3. Enter question text and 4 options
4. Mark the correct answer
5. Save the question

### Document Upload Format
When uploading Word documents, format questions as:
```
1. What is the capital of France?
a) London
b) Berlin
c) Paris*
d) Madrid

2. Which planet is closest to the Sun?
a) Mercury*
b) Venus
c) Earth
d) Mars
```
*Mark correct answers with an asterisk (*)

### Taking a Quiz (Participants)
1. Register/Login as participant
2. Browse available quizzes
3. Click "Start Quiz"
4. Answer questions within the time limit
5. Submit to see results and leaderboard position

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Quiz Management
- `GET /api/quiz` - Get all quizzes
- `POST /api/quiz` - Create new quiz (Admin)
- `GET /api/quiz/:id` - Get quiz details
- `PUT /api/quiz/:id` - Update quiz (Admin)
- `DELETE /api/quiz/:id` - Delete quiz (Admin)

### Question Management
- `GET /api/quiz/:quizId/questions` - Get quiz questions
- `POST /api/quiz/:quizId/questions` - Add question (Admin)
- `PUT /api/quiz/questions/:questionId` - Update question (Admin)
- `DELETE /api/quiz/questions/:questionId` - Delete question (Admin)
- `POST /api/quiz/upload` - Upload questions from document (Admin)

### Quiz Attempts
- `POST /api/attempt/:quizId/start` - Start quiz attempt
- `POST /api/attempt/:attemptId/answer` - Submit answer
- `POST /api/attempt/:attemptId/finish` - Finish quiz
- `GET /api/attempt/:attemptId` - Get attempt details
- `GET /api/attempt/user/attempts` - Get user's attempts

### Leaderboard
- `GET /api/quiz/:quizId/leaderboard` - Get quiz leaderboard

## Project Structure

```
quiz-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication & validation
│   │   ├── config/         # Database configuration
│   │   └── server.js       # Entry point
│   ├── uploads/            # File uploads
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── public/
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity for Atlas

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes using the port

3. **File Upload Issues**
   - Ensure `uploads` directory exists
   - Check file permissions
   - Verify file size limits

4. **Timer Not Working**
   - Check system clock
   - Ensure Socket.io connection is established
   - Verify network connectivity

### Logs and Debugging

- Backend logs: Check console output when running `npm run dev`
- Frontend logs: Open browser developer tools
- Database logs: Check MongoDB logs for connection issues

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support and questions:
1. Check this README for common solutions
2. Review the troubleshooting section
3. Create an issue in the repository
4. Contact the development team

---

**Note**: This application is designed for educational and small-scale use. For production deployment, additional security measures, performance optimizations, and scalability considerations should be implemented.