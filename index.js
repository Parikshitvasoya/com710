const express = require("express");
const sqlite = require("sqlite3").verbose();

const app = express();



app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.render("index");
});

app.get("/registration", (request, response) => {
  response.render("registration");
});

app.get("/speakers", (request, response) => {
  database.all("SELECT id, name, workplace FROM speaker_table", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    response.render("speakers", { speakers: rows });
  });
});

app.post("/speakers", (request, response) => {
  const { name, title, about, workplace } = request.body;
  database.run(
    `INSERT INTO speaker_table (name, title, about, workplace) VALUES (?, ?, ?, ?)`,
    [name, title, about, workplace],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Inserted a row.");
      }
    }
  );
  response.redirect("/speakers");
});

app.get("/speaker/:id", (request, response) => {
  database.get(
    `SELECT * FROM speaker_table WHERE id = "${request.params.id}" limit 1`,
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      response.render("speaker", { speaker: row });
    }
  );
});

app.get("/update/:id", (request, response) => {
  database.get(
    `SELECT * FROM speaker_table WHERE id = "${request.params.id}" limit 1`,
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      response.render("update", { speaker: row });
    }
  );
});

app.post("/speaker/update/:id", (request, response) => {
  const { name, title, about, workplace } = request.body;
  database.run(
    `UPDATE speaker_table SET name = ?, title = ?, about = ?, workplace = ? WHERE id = ?`,
    [name, title, about, workplace, request.params.id],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Updated a row.");
      }
    }
  );
  response.redirect("/speakers");
});

app.get("/speaker/delete/:id", (request, response) => {
  database.run(
    `DELETE FROM speaker_table WHERE id = ${request.params.id}`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Deleted a row.");
    }
  );
  response.redirect("/speakers");
});

const database = new sqlite.Database(":memory:", (error) => {
  if (error) {
    return console.error(error.message);
  }
  console.log("Connected to SQlite database.");
});

database.serialize(function () {
  database.run(
    "CREATE TABLE speaker_table (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, title TEXT NOT NULL, about TEXT NOT NULL, workplace TEXT NOT NULL)",
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Speaker table created.");
    }
  );

  const insertQuery = `INSERT INTO speaker_table (name, title, about, workplace) VALUES (?, ?, ?, ?)`;
  database.run(
    insertQuery,
    ["Tom Hanks", "Actor", "Tom Hanks is an actor.", "USA"],
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Inserted a row.");
    }
  );

  database.run(
    insertQuery,
    ["Brad Pitt", "Actor", "Brad Pitt is an actor.", "USA"],
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Inserted a row.");
    }
  );

  database.run(
    insertQuery,
    [
      "Alexandra Daddario",
      "Actress",
      "Alexandra Daddario is an actress.",
      "USA",
    ],
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Inserted a row.");
    }
  );

  database.run(
    insertQuery,
    ["John Doe", "Actor", "John Doe is an actor.", "USA"],
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Inserted a row.");
    }
  );

  database.run(
    insertQuery,
    ["Jane Doe", "Actress", "Jane Doe is an actress.", "USA"],
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Inserted a row.");
    }
  );
});

app.get("/api/speakers", (request, response) => {
  database.all("SELECT * FROM speaker_table", (error, rows) => {
    if (error) {
      return console.error(error.message);
    }
    response.send(rows);
  });
});

app.get("/api/speaker/:id", (request, response) => {
  database.get(
    `SELECT * FROM speaker_table WHERE id = ${request.params.id}`,
    (error, row) => {
      if (error) {
        return console.error(error.message);
      }
      response.send(row);
    }
  );
});

app.post("/api/speaker", (request, response) => {
  const { name, title, about, workplace } = request.body;
  database.run(
    `INSERT INTO speaker_table (name, title, about, workplace) VALUES (?, ?, ?, ?)`,
    [name, title, about, workplace],
    (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log("Successfully inserted row.");
      }
    }
  );
  response.status(200).send({ message: "Successfully inserted data." });
});

app.put("/api/speaker", (request, response) => {
  const { id, name, title, about, workplace } = request.body;
  database.run(
    `UPDATE speaker_table SET name = ?, title = ?, about = ?, workplace = ? WHERE id = ?`,
    [name, title, about, workplace, id],
    (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log("Successfully updated row.");
      }
    }
  );
  response.status(200).send({ message: "Successfully updated data." });
});

app.delete("/api/speaker/:id", (request, response) => {
  database.run(
    `DELETE FROM speaker_table WHERE id = ${request.params.id}`,
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Deleted a row.");
    }
  );
  response.status(200).send({ message: "Successfully deleted speaker!" });
});

app.listen(5000, () => {
  console.log("Server IP address and port runs here... http://localhost:5000");
});
