require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM restaurants");
    console.log(result);
    res.status(200).json({
      status: "success",
      data: result.rows,
      results: result.rows.length,
    });
  } catch (error) {
    console.log(error);
  }
});

// Get a Resturant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  console.log(req.params);
  try {
    const result = await db.query("SELECT * FROM restaurants WHERE id=$1", [
      req.params.id,
    ]);
    console.log("GEt a restaurant : ", result);
    res.status(200).send({
      status: "success",
      results: result.rowCount,
      data: result.rows[0],
    });
  } catch (error) {}
});

// Create a resturant
app.post("/api/v1/restaurants", async (req, res) => {
  try {
    console.log(req.body);
    const result = await db.query(
      "INSERT INTO restaurants(name,price_range,location) VALUES($1,$2,$3) returning *",
      [req.body.name, req.body.price_range, req.body.location]
    );
    console.log("DB Response", result);
    res.status(200).send({
      results: result.rowCount,
      data: result.rows[0],
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});
app.post("/a", (req, res) => {
  console.log("Oki");
});

// Update a Resturant
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE restaurants SET name=$1, price_range=$2, location=$3 WHERE id=$4 returning *",
      [req.body.name, req.body.price_range, req.body.location, req.params.id]
    );
    res.status(200).send({
      status: "success",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete a Resturant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM  restaurants WHERE id=$1 returning *",
      [req.params.id]
    );
    res.status(200).send({
      status: "success",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

// Add Review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    console.log(newReview);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`App is listening on PORT ${port}`);
});
