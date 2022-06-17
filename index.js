const multer = require("multer");
const path = require("path");
const express = require("express");
const app = express();

// folder destination
const UPLOAD_FOLDER = "./file_uplaod/";

// storage property for controlling storage-folder, fileName, id adding, extension
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, UPLOAD_FOLDER);
	},
	filename: (req, file, callback) => {
		let fileExt = path.extname(file.originalname);
		let fileName =
			file.originalname
				.replace(fileExt, "")
				.toLowerCase()
				.split(" ")
				.join("-") +
			"-" +
			Date.now();
		callback(null, fileName + fileExt);
	},
});

const upload = multer({
	// dest: UPLOAD_FOLDER, // folder destination
	storage: storage,
	limits: {
		fileSize: 1000000, // 1 mb upload restriction
	},
	fileFilter: (req, file, callback) => {
		// checking for 2 input box
		if (file.fieldname === "avatar") {
			if (
				file.mimetype === "image/jpg" ||
				file.mimetype === "image/png" ||
				file.mimetype === "image/jpeg"
			) {
				callback(null, true);
			} else {
				callback(new Error("Only jpg, png, jpeg format supported"));
			}
		} else if (file.fieldname === "doc") {
			if (file.mimetype === "application/pdf") {
				callback(null, true);
			} else {
				callback(new Error("Only pdf format supported"));
			}
		} else {
			callback(new Error("Unknown error"));
		}
	},
});

//upload single file
app.post("/", upload.single("avatar"), (req, res) => {
	res.send("Uploaded successfully");
});

// control multiple input file using multer
app.post(
	"/",
	upload.fields([
		{ name: "avatar", maxCount: 2 },
		{ name: "doc", maxCount: 1 },
	]),
	(req, res) => {
		console.log(req.files);
		res.send("Uploaded successfully");
	}
);

// form data using multer and we will get that data into (req.body.name)
app.post("/", upload.none(), (req, res) => {
	let name = req.body.name;
	res.send(name);
});

// error middleware (Here i override the default error handler)
app.use((err, req, res, next) => {
	if (err) {
		res.status(500).send(err.message);
	} else {
		res.send("Success");
	}
});

// server listening
app.listen(8080, () => {
	console.log("Server running at http://localhost:8080");
});
