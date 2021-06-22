const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

// set multer storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    chechFileType(file, cb);
    function chechFileType(file, cb) {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      const mimetype = fileTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb("Error", "images only");
      }
    }
  },
}).single("myImage");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", { msg: err });
    } else {
      if (req.file == undefined) {
        res.render("index", { msg: "nofile selected" });
      } else {
        res.render("index", {
          msg: "file Uploaded",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});
app.listen(port, () => {
  console.log(`go to ${8000}`);
});
