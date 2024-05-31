# Task Management Application

This is a simple task management application with user authentication, allowing users to register, log in, and manage their tasks.

## Features

- User Registration
- User Login
- Create, Read, Update, Delete (CRUD) tasks

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- HTML, CSS, JavaScript (Frontend)

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/VanessJames/Task_On.git
   cd Task_On

## Install dependencies
```sh
npm install

## Set up environment variables

Create a .env file in the root directory and add the following:
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret

## Start the server
node index.js

Open the application
Open your browser and navigate to http://localhost:5000

## Usage
Register a new account
Log in with your account
Manage your tasks


## File Structure
index.js - Entry point of the application
models/ - Mongoose models (User, Task)
routes/ - Express routes (auth, tasks)
index.html - Main HTML file
styles.css - CSS file for styling
script.js - JavaScript file for frontend logic


## Contributing
Feel free to fork this repository and submit pull requests.