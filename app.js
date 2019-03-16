const path = require("path");

const express = require('express');

const postsRoutes = require('./routes/posts');

const usersRoutes = require('./routes/users');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();

mongoose.connect(
	"mongodb+srv://mo:"+ process.env.MONGO_ATLAS_PW +"@cluster0-m5uy7.mongodb.net/mean-app"
	)
	.then(() => {
		console.log('Connected to database!');
	})
	.catch(() => {
		console.log(process.env.MONGO_ATLAS_PW);
		console.log('Connection failed!');
	});

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");

	res.setHeader(
		"Access-Control-Allow-Headers", 
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);

	res.setHeader("Access-Control-Allow-Methods", 
		"GET, POST, PATCH, PUT, DELETE, OPTIONS");	
	next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/posts", postsRoutes);

app.use("/api/users", usersRoutes);

module.exports = app;