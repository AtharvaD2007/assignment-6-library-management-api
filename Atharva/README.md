# Library Management API

This is the solution for Assignment 06: Library Management API with Firebase, Rate Limiting & Swagger.

## Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env` and configure your secrets.
    ```bash
    cp .env.example .env
    ```

3.  **Firebase Configuration:**
    Place your `serviceAccountKey.json` from the Firebase Console into the root directory of this project. The `.gitignore` file is set up to ensure it is not committed to version control.

4.  **Run the Server:**
    ```bash
    npm run dev
    ```
    (Note: ensure you have a `dev` script in `package.json` like `"dev": "nodemon server.js"`)
    Or just run:
    ```bash
    npx nodemon server.js
    ```

5.  **View Swagger Docs:**
    Navigate to [http://localhost:5000/api-docs](http://localhost:5000/api-docs) in your browser to view and interact with the Swagger API documentation.
