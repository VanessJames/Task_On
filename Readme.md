# Task Management Application

This is a simple task management application with user authentication, allowing users to register, log in, and manage their tasks.

## Features

- User Registration
- User Login
- Create, Read, Update, Delete (CRUD) tasks

## Technologies Used

- Node.js
- Express.js
- EJS
- MongoDB
- Mongoose
- HTML, CSS, JavaScript (Frontend)

project
├── src
│ ├── config.js
│ └── index.js
├── views
│ ├── home.ejs
│ ├── index.ejs
│ ├── login.ejs
│ └── signup.ejs
├── public
│ ├── images
│ ├── script.js
│ ├── style.css
│ └── styles.css
├── .gitignore
├── package.json
└── package-lock.json

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
PORT=5000;

## Start the server
node index.js

Open the application
Open your browser and navigate to http://localhost:5000

## Usage
Register a new account
Log in with your account
Manage your tasks


## File Structure
src: Contains the main server configuration and entry point.

config.js: Configuration settings for the application.
index.js: Main entry point for the application.
views: Contains the EJS templates for rendering HTML pages.

home.ejs: Home page view.
index.ejs: Main index view.
login.ejs: Login page view.
signup.ejs: Signup page view.
public: Contains public assets like JavaScript, CSS, and images.

images: Directory for images used in the application.
script.js: Main JavaScript file for client-side logic.
style.css and styles.css: Stylesheets for the application.
.gitignore: Specifies files and directories to be ignored by Git.

package.json: Lists dependencies and scripts for the application.

package-lock.json: Locks the versions of dependencies installed.


## Contributing
Feel free to fork this repository and submit pull requests.