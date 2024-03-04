# Cashflow-Opti

Cashflow-Opti is a web-based application designed to optimize vehicle production plans across different countries, dealers, and warehouses. It leverages various technologies to efficiently calculate and suggest optimal production allocation, considering multiple factors such as dealer preferences, warehouse capacities, and delivery times.

## Overview

The project utilizes Node.js for the backend, with Express.js serving as the web framework. Data persistence is achieved through MongoDB, and Mongoose is used as the ODM. The front-end leverages EJS for templating. The application is structured around MVC principles, with models for users, vehicle types, dealers, warehouses, and orders.

## Features

- Dynamic production plan optimization using linear programming or heuristic methods.
- Monthly breakdown of orders to meet production and delivery schedules.
- Customizable dealer and warehouse preferences to influence the optimization process.
- User authentication for secure access to the system.

## Getting started

### Requirements

- Node.js
- MongoDB
- npm

### Quickstart

1. Clone the repository to your local machine.
2. Install dependencies with `npm install`.
3. Configure your environment variables based on the `.env.example` file.
4. Start the application with `npm start`.
5. Access the web application at `http://localhost:3000`.

### License

Copyright (c) 2024.