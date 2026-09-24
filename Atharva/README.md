# 📚 Library Management API

A RESTful **Library Management API** built using **Node.js, Express.js, Firebase Firestore, JWT, bcryptjs, Rate Limiting, and Swagger**.

## 🚀 Live Deployment

[**https://assignment-6-library-management-api-ljl6.onrender.com**](https://assignment-6-library-management-api-ljl6.onrender.com)

## 🛠️ Tech Stack

* Node.js
* Express.js
* Firebase Firestore
* Firebase Admin SDK
* JWT Authentication
* bcryptjs
* Express Rate Limiting
* Swagger / OpenAPI

## ✨ Features

* User registration and login
* JWT-based authentication
* Student and Librarian role-based access
* Book CRUD operations
* Borrow and return books
* Borrowing history
* Firebase Firestore database
* API rate limiting
* Swagger API documentation

## 📖 Swagger Documentation

[**API Documentation**](https://assignment-6-library-management-api-ljl6.onrender.com/api-docs)

## 📌 Main API Routes

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/api/auth/register`    | Register a student     |
| POST   | `/api/auth/login`       | User login             |
| GET    | `/api/auth/profile`     | Get user profile       |
| GET    | `/api/books`            | View all books         |
| POST   | `/api/books`            | Add a book             |
| PUT    | `/api/books/:id`        | Update a book          |
| DELETE | `/api/books/:id`        | Delete a book          |
| POST   | `/api/books/:id/borrow` | Borrow a book          |
| POST   | `/api/books/:id/return` | Return a book          |
| GET    | `/api/books/my-history` | View borrowing history |

## 👨‍💻 Assignment

**Assignment 06 – Library Management API**

Backend Development Assignment.
