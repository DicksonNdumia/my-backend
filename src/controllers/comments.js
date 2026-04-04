import pool from "../config/db.config.js";
// This is also a map
// CREATE TABLE comments (
//     id SERIAL PRIMARY KEY,
//     event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
//     comment TEXT NOT NULL,
//     created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// );

export const addComments = async (req, res, next) => {
  try {
    if (!req.user.id) {
      return res.status(404).json({
        message: "Failed you are not authorized to do this",
      });
    }

    const { event_id } = req.params;
    const created_by = req.user.id;

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

    const { comment } = req.body;

    const insertComment = await pool.query(
      `INSERT INTO comments (event_id,comment,created_by) VALUES ($1,$2, $3) RETURNING * `,
      [event_id, comment, created_by],
    );

    const result = insertComment.rows[0];

    res.status(201).json({
      message: "Comment made succesful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const created_by = req.user.id;
    if (!id) {
      return res.status(400).json({
        message: "Provide the right id",
      });
    }

    if (!created_by) {
      return res.status(401).json({ error: "Unauthorized You can't delete" });
    }

    //check if you are the one who comments \
    const validityOfComment = await pool.query(
      `SELECT * FROM comments WHERE id=$1 AND created_by =$2`,
      [id, created_by],
    );
    if (validityOfComment.rows.length === 0) {
      return res.status(400).json({
        message: "Sorry You can't delete anyones comment",
      });
    }

    //delete if all passes
    const deleteResults = await pool.query(
      `DELETE FROM comments WHERE id=$1 RETURNING *`,
      [id],
    );

    const result = deleteResults.rows[0];

    res.status(200).json({
      message: "Okay then the comment was deleted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const { id } = req.body;

    const created_by = req.user.id;

    if (!event_id) {
      return res.status(400).json({
        message: "Provide the right id",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Comment id is required",
      });
    }

    if (!created_by) {
      return res.status(401).json({ error: "Unauthorized You can't delete" });
    }

    //check if you are the one who comments \
    const validityOfComment = await pool.query(
      `SELECT * FROM comments WHERE id=$1  AND created_by =$2`,
      [id, created_by],
    );
    if (validityOfComment.rows.length === 0) {
      return res.status(400).json({
        message: "Sorry You can't edit anyones comment",
      });
    }

    //then update the comment
    const { comment } = req.body;
    const updateQuery = await pool.query(
      `
  UPDATE comments  SET comment= COALESCE($1,comment) WHERE id=$2 RETURNING *
  `,
      [comment, id],
    );

    if (updateQuery.rows.length === 0) {
      return res.status(400).json({
        message: "Not Found Or unauthorized",
      });
    }

    const result = updateQuery.rows;

    res.status(201).json({
      message: "Comment updated successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyComments = async (req, res, next) => {
  try {
    const created_by = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        c.id,
        c.comment,
        c.created_at,
        e.title AS event_title,
        e.date AS event_date,
        e.location AS event_location
      FROM comments c
      JOIN events e ON c.event_id = e.id
      WHERE c.created_by = $1
      ORDER BY c.created_at DESC;
      `,
      [created_by],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "You haven't made any comments yet",
      });
    }

    res.status(200).json({
      message: "Here are your comments",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
