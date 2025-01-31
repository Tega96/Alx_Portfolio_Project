This is a full-stack social media application similar to Instagram, named Snapgram. The backend is built using Node.js, Express, MongoDB (Cloud), while the frontend is developed using React with various supporting libraries.

## Project Structure
backend
│   ├── config -> 
│   ├── middleware
│   │   ├── authMiddleware.js
│   ├── models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Like.js
│   │   ├── Comment.js
│   │   ├── Follower.js
│   │   ├── Message.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── post.js
│   │   ├── like.js
│   │   ├── comment.js
│   │   ├── message.js
│   ├── server.js
│── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── store
│   │   ├── hooks
│   │   ├── App.js
│   │   ├── index.js
│── README.md
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
- Create, edit, and delete posts
- Upload images/videos
- Like and comment on posts
- Feed generation based on followers
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
- Node.js & Express.js -> setting the server
- MongoDB (Cloud) -> for database management
- Mongoose (ODM for MongoDB) -> for models
- Passport.js (OAuth authentication) 
- JSON Web Tokens (JWT) -> for secure authentication
- Bcrypt.js -> for password hashing
- cors ->
- nodemailer -> 

### Frontend:
- React.js ->
- React Router
- Redux (or Context API) for state management
- Axios for API requests
- Tailwind CSS or Styled Components


Notifications system
Real-Time Notifications & Messaging
Direct messaging
