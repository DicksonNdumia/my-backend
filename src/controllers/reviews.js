// CREATE TABLE reviews (
//     id SERIAL PRIMARY KEY,
//     event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
//     review TEXT NOT NULL,
//     created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// );

import pool from "../config/db.config.js";

export const createReview = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const created_by = req.user.id;
    if (!req.user.id) {
      return res.status(404).json({
        message: "Failed you are not authorized to do this",
      });
    }

    if (!event_id) {
      return res.status(400).json({
        message: "Provide the right event_id",
      });
    }

    //checking if the event exists
    const checkIfEventExists = await pool.query(
      `SELECT * FROM events WHERE id=$1 `,
      [event_id],
    );

    if (checkIfEventExists.rows.length === 0) {
      return res.status(400).json({
        message: "There is no such event in the database",
      });
    }

    //checking if event is already booked
    const checkIfUserHasBooked = await pool.query(
      `SELECT * FROM bookings WHERE event_id=$1 AND created_by=$2`,
      [event_id, created_by],
    );
    if (checkIfUserHasBooked.rows.length === 0) {
      return res.status(400).json({
        message: "You heven't booked the event  my friend 😂😂😂",
      });
    }

    //check if the date of the event has already  reached to make a review
    const eventDate = await pool.query(
      `SELECT id FROM events 
   WHERE id = $1 
   AND date < NOW()`,
      [event_id],
    );

    if (eventDate.rows.length === 0) {
      // If no row is returned, it's either a fake ID or the event is in the future
      return res.status(400).json({
        message: "You can only review an event once it has finished.",
      });
    }
    const { review } = req.body;

    //check if already a review is made
    const checkIfReviewIsMade = await pool.query(
      `SELECT * FROM reviews WHERE event_id=$1 AND created_by=$2`,
      [event_id, created_by],
    );

    if (checkIfReviewIsMade.rows.length > 0) {
      return res.status(400).json({
        message: "Man You already made a review!",
      });
    }

    const addReview = await pool.query(
      `INSERT INTO reviews (event_id,review,created_by) VALUES ($1,$2,$3) RETURNING*`,
      [event_id, review, created_by],
    );
    const result = addReview.rows[0];

    res.status(201).json({
      message: "Review made successfull",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const getReviews = await pool.query(
      `SELECT
      r.id,
      r.review,

      
      e.title AS event_title,
      e.location AS event_location,
      
      u.name AS author,
      u.email AS author_email

      FROM reviews r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON r.created_by = u.id
      ORDER BY r.created_at DESC;
      `,
    );

    const result = getReviews.rows;
    if (getReviews.rows.length === 0) {
      return res.status(404).json({
        message: "No reviews available",
      });
    }

    res.status(200).json({
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const created_by = req.user.id;

    if (!id)
      return res.status(400).json({
        error: "Provide the id for the review",
      });
    if (!created_by) {
      return res.status(401).json({
        error: "Unauthorized You can't delete",
      });
    }

    //check if you are the one who comments \
    const validity = await pool.query(
      `SELECT * FROM reviews WHERE id=$1 AND created_by =$2`,
      [id, created_by],
    );
    if (validity.rows.length === 0) {
      return res.status(400).json({
        message: "Sorry review is  missing or you didn't make it",
      });
    }

    //delete if all passes
    const deleteResults = await pool.query(
      `DELETE FROM reviews WHERE id=$1 RETURNING *`,
      [id],
    );

    const result = deleteResults.rows[0];

    res.status(200).json({
      message: "Okay then the review was deleted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const editReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const created_by = req.user.id;

    if (!id)
      return res.status(400).json({
        error: "Provide the id for the review",
      });
    if (!created_by) {
      return res.status(401).json({
        error: "Unauthorized You can't delete",
      });
    }

    //check if you are the one who comments \
    const validity = await pool.query(
      `SELECT * FROM reviews WHERE id=$1 AND created_by =$2`,
      [id, created_by],
    );
    if (validity.rows.length === 0) {
      return res.status(400).json({
        message: "Sorry review is  missing or you didn't make it",
      });
    }

    const { review } = req.body;
    const updateQuery = await pool.query(
      `
  UPDATE reviews  SET review= COALESCE($1,review) WHERE id=$2 RETURNING *
  `,
      [review, id],
    );

    if (updateQuery.rows.length === 0) {
      return res.status(400).json({
        message: "Failed to update the review try again!",
      });
    }

    const result = updateQuery.rows;

    res.status(200).json({
      message: "Review successfuly updated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
