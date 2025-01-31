This is a full-stack social media application similar to Instagram, named Snapgram. The backend is built using Node.js, Express, MongoDB (Cloud), while the frontend is developed using React with various supporting libraries.

## Project Structure
### Backend
config -> Configuration files (e.g., database)
middleware -> Custom middleware (auth, error handling, validation, etc.)
models -> Mongoose models (User, Post, Like, Comment, etc.)
controllers -> Handles business logic for routes
routes -> Defines API endpoints (Auth, User, Post, etc.)
services -> Utility functions (JWT, email service, OAuth, etc.)
index.js -> Entry point of the backend server
package.json -> Node.js dependencies and scripts

### frontend
#### public
- icons
- images
#### src
- components
- _root (pages)
- store
- hooks
- context
- App.tsx
- main.tsx

## Features
### Backend (Node.js, Express, MongoDB)
#### Authentication & Authorization:
- User signup/login with email & password
- OAuth (Google, Facebook login)
- JWT-based authentication
- Email verification
- Password reset
- Remember me functionality
- Role-based authentication (Admin, User)
#### User Management:
- Profile creation & updates
- Follow/unfollow system
- Profile picture and bio management
#### Posts & Media:
- Create, edit, view, and delete posts
- Upload images/videos
- Like and comment on posts
- Like and comment on a comment
- Feed generation based on followers
- Saved posts
#### Security & Performance:
- Encrypted passwords (bcrypt)
- Rate limiting for API requests
- Data validation using middleware
- MongoDB indexing for efficient queries

### Frontend (React)
- User Authentication: Login, signup, social login
- Dashboard & Profile Pages
- Responsive Design & Dark Mode
- Optimized State Management (Redux or Context API)
- Media Upload & Display

## Tech Stack
### Backend:
- Node.js -> JavaScript runtime for the backend
- Express.js -> Framework for setting the server
- MongoDB (Cloud) -> NoSQL database for storing user data, posts, likes, and comments
- Mongoose (ODM for MongoDB) -> Object Data Modeling for MongoDB, managing schemas and models
- Passport.js -> Authentication middleware supporting OAuth for Google & Facebook login
- JSON Web Tokens (JWT) -> Secure authentication method for user sessions
- Bcrypt.js -> Password hashing to ensure security
- cors -> Middleware for handling cross-origin requests between frontend and backend
- nodemailer -> Sending emails for verification, password reset, and notifications
- dotenv -> Loading environment variables securely from a .env file
- express-rate-limit -> Protects API from brute-force attacks
- express-validator -> Middleware for validating and sanitizing user input

### Frontend:
- React.js -> Frontend UI framework
- React Router -> For handling navigation
- Redux / Context API -> For state management
- Axios / Fetch API	-> Making HTTP requests to the backend
- Tailwind CSS -> Styling
- OAuth Libraries	-> Handling Google/Facebook login on frontend

## Installation & Setups
Initialize the server:
  clone your_repo
  cd your_repo
  npm init
  npm install (This will install all necessary backend dependencies (Express, Mongoose, Passport.js, JWT, etc.))
start the server:
  npm run dec

## Connecting Backend and Frontend

## Deployment Process
The deployment process is done using Vercel, which is used for full-stack hosting.

## Security Considerations
- JWT expiration & refresh tokens
- Password hashing with bcrypt
- OAuth secured with Passport.js
- CORS configuration for frontend-backend communication
- Rate limiting & request sanitization

## Future Enhancements
- writing tests and handle more validations
- Real-Time Notifications
- Direct messaging
- AI-based content recommendations
- Mobile app version using React Native

## Contributors
Backend Developer: Abdelhady Mohammed, abdelhadymohammed1763@gmail.com
Frontend Developer: Otega Otite, 

## License
This project is licensed under the MIT License.
