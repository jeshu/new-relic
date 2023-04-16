const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const indexRouter = require('./routes/index');
const videosRouter = require('./routes/videos');
const { APP_LOG_LEVEL, PORT } = require('./config');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Upload Video API",
      description: "Upload video api information",
      contact: {
        name: "Brijesh kuamr <brijesh.kumar@publicissapient.com>"
      },
      servers: [`http://localhost:${PORT}`]
    }
  },
  apis: ["./src/app.js", "./src/routes/*.js"]
};

const app = express();


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(logger(APP_LOG_LEVEL));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


app.use('/', indexRouter);
app.use('/api/v1/video', videosRouter);
module.exports = app;
