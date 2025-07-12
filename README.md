# Natours - Node.js, Express & MongoDB Tour Booking App

Natours is a full-featured tour booking web application built with Node.js, Express, MongoDB, and Pug. It demonstrates modern web development practices, including authentication, authorization, RESTful APIs, file uploads, and more.

## Features

-   User authentication & authorization (JWT, cookies)
-   Tour listing, details, and booking
-   User signup, login, logout, and profile management
-   Review system for tours
-   Admin and guide roles with restricted access
-   Secure API (rate limiting, sanitization, helmet, etc.)
-   Image upload and processing
-   Email notifications (welcome, password reset)
-   Responsive UI with Pug templates
-   Modern frontend (Parcel bundler, Leaflet maps)

## Getting Started

### Prerequisites

-   Node.js >= 10.0.0
-   MongoDB database (local or Atlas)

### Installation

1. Clone the repository:
    ```sh
    git clone <your-repo-url>
    cd complete-node-bootcamp-master/4-natours/starter
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file (or edit `config.env`) with your environment variables:
    ```env
    DATABASE=<your-mongodb-connection-string>
    DATABASE_PASSWORD=<your-db-password>
    JWT_SECRET=<your-jwt-secret>
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES=90
    EMAIL_USERNAME=<your-email-username>
    EMAIL_PASSWORD=<your-email-password>
    EMAIL_HOST=<your-email-host>
    EMAIL_PORT=<your-email-port>
    EMAIL_FROM=<your-email-from-address>
    ```

### Running the App

-   Development mode (with nodemon):
    ```sh
    npm run dev
    ```
-   Production mode:
    ```sh
    npm run start:prod
    ```
-   Build frontend assets:
    ```sh
    npm run build:js
    ```

## Folder Structure

-   `app.js` - Main Express app
-   `server.js` - App entry point
-   `controllers/` - Route controllers
-   `models/` - Mongoose models
-   `routes/` - Express routes
-   `public/` - Static assets (JS, CSS, images)
-   `views/` - Pug templates
-   `utils/` - Utility modules
-   `dev-data/` - Sample data

## API Endpoints

-   `/api/v1/tours` - Tour CRUD
-   `/api/v1/users` - User CRUD, auth
-   `/api/v1/reviews` - Review CRUD
-   `/api/v1/booking` - Booking CRUD

## Frontend Pages

-   `/` - Overview of tours
-   `/login` - Login page
-   `/signup` - Signup page
-   `/me` - User account
-   `/tour/:slug` - Tour details
-   `/bookingCheckout` - Booking checkout
-   `/my-tours` - User's booked tours

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

ISC

---

Made by Rahul Chavda (GEC Bhavnagar)
