// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const errorhandler = require('errorhandler')
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const morgan = require('morgan')
const methodOverride = require('method-override'); // Added method-override
const authRoutes = require("./routes/authRoutes");
const optimizationRoutes = require('./routes/optimizationRoutes'); // Import optimization routes
const dashboardRoutes = require('./routes/dashboardRoutes'); // Import dashboard routes
const productionPlanRoutes = require('./routes/productionPlanRoutes'); // Import production plan routes
const viewRoutes = require('./routes/viewRoutes'); // Reintroduced viewRoutes for general view routing

const countryApiRoutes = require('./routes/api/countryApiRoutes'); // Ensure API routes for contries are include
const dealerApiRoutes = require('./routes/api/dealerApiRoutes'); // Ensure API routes for dealers are include
const orderApiRoutes = require('./routes/api/orderApiRoutes'); // Ensure API routes for orders are include
const vehicleTypeApiRoutes = require('./routes/api/vehicleTypeApiRoutes'); // Ensure API routes for vehicle types are included
const warehouseApiRoutes = require('./routes/api/warehouseApiRoutes'); // Ensure API routes for warehouses are included

const countryViewRoutes = require('./routes/view/countryViewRoutes'); // Correctly separated view routes for countries
const dealerViewRoutes = require('./routes/view/dealerViewRoutes'); // Correctly separated view routes for dealers
const orderViewRoutes = require('./routes/view/orderViewRoutes'); // Correctly separated view routes for orders
const vehicleTypeViewRoutes = require('./routes/view/vehicleTypeViewRoutes'); // Correctly separated view routes for vehicle types
const warehouseViewRoutes = require('./routes/view/warehouseViewRoutes'); // Correctly separated view routes for warehouses

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(errorhandler())

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use method-override middleware
app.use(methodOverride('_method'));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

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

// API Routes
app.use('/api/countries', countryApiRoutes);
app.use('/api/dealers', dealerApiRoutes);
app.use('/api/orders', orderApiRoutes);
app.use('/api/vehicle-types', vehicleTypeApiRoutes);
app.use('/api/warehouses', warehouseApiRoutes);

// Optimization Routes - Registering optimization routes
app.use(optimizationRoutes);

// Dashboard Routes - Registering dashboard routes, accessible only for authenticated users
app.use(dashboardRoutes);

// Production Plan Routes - Registering production plan routes
app.use(productionPlanRoutes);

// View Routes for Overview Pages
app.use(countryViewRoutes); // Using separated view routes for dealers
app.use(dealerViewRoutes); // Using separated view routes for dealers
app.use(orderViewRoutes); // Using separated view routes for orders
app.use(vehicleTypeViewRoutes); // Using separated view routes for vehicle types
app.use(warehouseViewRoutes); // Using separated view routes for warehouse
app.use(viewRoutes); // Ensuring general view routes are still functional

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