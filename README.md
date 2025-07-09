# Blogveda – Full-Stack Blogging Platform

**Blogveda** is a complete blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to register, log in, create blogs, search content, comment, like posts, filter by tags or authors, and toggle between light and dark modes. This application is fully deployed and mobile-responsive.

**Live Demo:** [https://blogveda.vercel.app](https://blogveda.vercel.app)

---

## Features

- User authentication using JWT
- Register and login functionality
- Create, edit, and delete blogs (CRUD)
- Search blogs by title or content
- Like and comment on blogs
- Filter blogs by tag and author
- Protected routes for logged-in users
- Dark mode toggle
- Responsive layout for all screen sizes
- Loading skeletons and error handling
- Deployment using Vercel (frontend) and Render (backend)

---

## Tech Stack

**Frontend:**
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT)
- CORS

**Deployment:**
- Vercel (Frontend)
- Render (Backend)
- Environment variables via `.env`

---

## Folder Structure

Blogveda/
├── client/ # Frontend (React + Vite)
│ ├── pages/
│ ├── components/
│ ├── services/
│ ├── App.jsx
│ └── main.jsx
│
├── server/ # Backend (Node + Express)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
│
└── README.md # Project documentation

---

## What I Learned

- Built a full-stack MERN application from scratch
- Implemented JWT-based authentication and protected routes
- Integrated REST APIs using Axios in a React frontend
- Designed a responsive UI with Tailwind CSS
- Managed deployment of frontend and backend on separate platforms
- Resolved cross-origin, token, and environment setup issues

---

## Author

**Rithika Senthil**  

Email: rithikasenthil5@gmail.com  


---

## Future Enhancements

- Pagination for blogs
- Rich text editor for blog content
- Admin dashboard for blog moderation
- Blog view tracking and analytics
- Bookmark/favorite blog functionality
