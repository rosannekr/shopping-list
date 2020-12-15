# Smart Shopping List

An app that generates a weekly shopping list based on your previous purchases. Built as a 'Feature Extension' project during CodeOp's full stack development bootcamp. I inherited code from someone else and added additional features:

- User authentication & authorization with JSON Web Tokens and React Router
- Improvements of existing SQL queries to get better item suggestions
- Search bar to search items that were previously added
- Styling with Bootstrap

Here's a sneak peek:

![screenshot](/screenshot.png)

## Technologies

- React
- Node
- Express
- MySQL
- Bootstrap

## Setup

### Dependencies

Run `npm install` on the root folder to install dependencies related to Express.

`cd client` and run `npm install` to install dependencies related to React.

### Database Prep

Create a database in MySQL.

Create an `.env` file in the project directory and add

```
DB_NAME=YOUR_DATABASE
DB_PASS=YOUR_PASSWORD
SUPER_SECRET=YOUR_SECRET
```

JSON Web Tokens are used for user authorization. The secret in your `.env` file is used to sign the tokens.

Run `npm run migrate` in the project directory to create the tables.
Run `npm run seed` in the project directory to add seed data to the tables.

### Development

- Run `npm start` in the project directory to start the Express server on port 5000.
- `cd client` and run `npm start` to start the client server in development mode with hot reloading in port 3000.
- Client is configured so all API calls will be proxied to port 5000.

_This is a student project that was created at [CodeOp](http://codeop.tech), a full stack development bootcamp in Barcelona._
