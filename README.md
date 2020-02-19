# Register App
Browser based register application that interacts with a PostgreSQL database. Implemented in NodeJS with typescript, express, and the sequelize ORM.

## Development Environment Setup
First, install dev dependencies with `npm install`. Once this is done you will be able to lint with `npm run lint`. Make sure you correct all issues before you make a commit.

Next, create a file at the project root named `.env`. This is used to define local environment variables.   
Make sure to define the variable `DATABASE_URL=postgres://whatever`.   
If a `PORT` variable is not defined then the application will default to port 15100 (see ./src/app.ts).   
If you are connecting to the Heroku PostgreSQL database, or any other database requiring SSL, set `SEQUELIZE_USE_SSL=true`

## Running Locally

To start via the terminal navigate to the source code directory and run the following commands (after install `rebuild` will be run automatically)...
```bash
npm run rebuild
npm run start
```

## Deployed URL
http://register-app-titans.herokuapp.com/
