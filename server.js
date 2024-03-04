// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const vehicleTypeRoutes = require('./routes/vehicleTypeRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes'); // Import warehouse routes
const orderRoutes = require('./routes/orderRoutes'); // Import order routes
const countryRoutes = require('./routes/countryRoutes'); // Import country routes
const optimizationRoutes = require('./routes/optimizationRoutes'); // Import optimization routes
const dashboardRoutes = require('./routes/dashboardRoutes'); // Import dashboard routes
const productionPlanRoutes = require('./routes/productionPlanRoutes'); // Import production plan routes

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// Vehicle Type Routes
app.use(vehicleTypeRoutes);

// Dealer Routes
app.use(dealerRoutes);

// Warehouse Routes - Registering warehouse routes
app.use(warehouseRoutes);

// Order Routes - Registering order routes
app.use(orderRoutes);

// Country Routes - Registering country routes
app.use(countryRoutes);

// Optimization Routes - Registering optimization routes
app.use(optimizationRoutes);

// Dashboard Routes - Registering dashboard routes, accessible only for authenticated users
app.use(dashboardRoutes);

// Production Plan Routes - Registering production plan routes
app.use(productionPlanRoutes);

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// General Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});