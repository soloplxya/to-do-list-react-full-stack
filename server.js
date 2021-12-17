const express = require('express');
const app = express(); 
const cors = require("cors")
const pool = require('./config/db')
const PORT = process.env.PORT || 5000;
const path = require("path")


// middleware 
app.use(cors());
app.use(express.json()); 


if (process.env.NODE_ENV === "production") {
  // for server to serve static content 
  app.use(express.static(path.join(__dirname, "front-end/build")));
}

// ROUTES
app.post("/todoes", async(req, res) => {
  try {
    const { description } = req.body 
    // query to insert data into the todoes database 
    // $1 allows us to put data into the query 
    const newTodo = await pool.query("INSERT INTO TODO (description) VALUES($1) RETURNING *", 
    [description]
    )
  } catch (err) {
      console.log(err.message)
  }
})

// create a todo 
app.get("/todoes", async(req, res) => {
  try {
      const allTodos = await pool.query("SELECT * FROM TODO");
      res.json(allTodos.rows);
  } catch (err) {
      console.log(err);
  }
})

//get a todo
app.get("/todoes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM TODO WHERE TODO_ID = $1", [
      id
    ]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo
app.put("/todoes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});


//delete a todo
app.delete("/todoes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});


// listening 
app.listen(PORT, () => console.log(`Server started on ${PORT}.`)); 
