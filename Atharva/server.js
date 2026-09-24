require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const apiLimiter = require('./middleware/rateLimiter');

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Global Rate Limiting
app.use('/api/', apiLimiter);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', borrowRoutes); // Mounted at /api to support /api/books/my-history and /api/librarian/borrow-records

// Base Route
app.get('/', (req, res) => {
  res.send('Welcome to the Library Management API. Visit /api-docs for documentation.');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
