const express = require("express");//to create a web app
const mongoose = require("mongoose");//to deal with Mongodb 
const methodOverride = require("method-override");//to allow us to use delete & put
const path = require("path");

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/test", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose schema and model
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: Date,
});
const Note = mongoose.model("Note", noteSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));//covert the data (come from post) to req.body
app.use(methodOverride("_method"));//to add _method to the end of url
app.set("view engine", "ejs");//to determinate the ejs is laugauge of show
app.set("views", path.join(__dirname, "views"));//to set the location of views contain html and ejs folders

// Routes
app.get("/", (req, res) => {
  Note.find()
    .then((result) => {
      res.render("home", { mytitle: "Home Page", arr: result });//it take mytitle & arr to hom.ejs and can use it there 
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to retrieve notes");
    });
});

app.post("/notes", (req, res) => {//to save the newNote to db 
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
    createdAt: req.body.createdAt,
  });
  newNote.save()
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to save note");
    });
});

app.delete("/notes/:id", (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to delete note");
    });
});

app.put("/notes/:id", (req, res) => {
  const updatedData = {
    title: req.body.title,
    content: req.body.content,
    createdAt: req.body.createdAt,
  };
  Note.findByIdAndUpdate(req.params.id, updatedData)
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to update note");
    });
});

// Server listener
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});