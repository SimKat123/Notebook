// fs, API, and server stuff
const fs = require("fs");
const express = require("express");
const path = require("path");

// link notes json file
const notes = require("./db/db.json");

const { v4: uuidv4 } = require("uuid");
const { info } = require("console");

const PORT = process.env.PORT || 3001;
const app = express();

// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET notes from json file
app.get("/api/notes", (req, res) => {
  res.send(notes);
  console.info(`${req.method} has been received`);
});

// POST notes to json file
app.post("/api/notes", (req, res) => {
  res.json(`${req.method} has been received`);
  console.info(`${req.method} has been received`);
  // Destructuring
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => (writeErr ? console.error(writeErr) : res.send(db))
        );
      }
    });
  } else {
    res.status(500).json("Error in adding notes");
  }
});

// DELETE notes from json file
// app.delete(`/api/notes/`, (req, res) => {
//   res.json(`${req.method} has been received`);
//   console.info(`${req.method} has been received`);
//   // Destructuring
//   const { title, text } = req.body;
//   if (title && text) {
//     const delNote= {
//       title,
//       text,
//       id: uuidv4(),
//     };
//     fs.readFile("./db/db.json", "utf8", (err, data) => {
//       if (err) {
//         console.error(err);
//       } else {
//         fs.unlink("./db/db.json", (err) => {
//             if (err) {
//             console.error(err);
//             delete notes.id;
            
//             console.log('Note deleted');
//         } else {

//         }
//         JSON.stringify(parsedNotes, null, 4),
//         (writeErr) => (writeErr ? console.error(writeErr) : res.send(db))
//     });
//         const parsedNotes = JSON.parse(data);
//         parsedNotes.push(delNote);
//       }
//     });
//   } else {
//     res.status(500).json("Error in adding notes");
//   }
// });

// wildcard route redirects to either index or notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
