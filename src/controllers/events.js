import cloudinary from "../config/cloudinaryConfig.js";
import pool from "../config/db.config.js";
import fs from "fs";

export const createEvent = async (req, res, next) => {
  try {
    if (!req.user || req.user?.role_id !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const created_by = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        error: "Please upload an image",
      });
    }

    const { title, location, date, description } = req.body;

    if (!title || !location || !date || !description) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Library",
    });

    const insertIntoEvents = await pool.query(
      `INSERT INTO events (title, location, image_url, date, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
      [title, location, result.secure_url, date, description, created_by],
    );

    res.status(201).json({
      message: "Event uploaded successfully",
      data: insertIntoEvents.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
export const getEvents = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM events`);
    const resultData = result.rows;

    return res.status(200).json({
      message: "The events are as follows",
      resultData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvents = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ error: "Provide the id for the event" });

    // 1. Auth Check
    if (!req.user || req.user.role_id !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Fetch Existing
    const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const existingEvent = result.rows[0];

    // 3. Handle incoming data (Defaulting to existing if body is empty)
    const { title, location, date, description } = req.body;

    let imageUrl = existingEvent.image_url;
    let imagePublicId = existingEvent.image_public_id;

    // 4. Handle Image Update
    if (req.file) {
      // Upload new image
      const imageResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "Library",
      });

      // Delete old image from Cloudinary if it exists
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId);
      }

      imageUrl = imageResult.secure_url;
      imagePublicId = imageResult.public_id;

      // Clean up temp file
      fs.unlinkSync(req.file.path);
    }

    // 5. Final Update
    const updateQuery = `
      UPDATE events
      SET 
        title = COALESCE($1, title),
        location = COALESCE($2, location),
        date = COALESCE($3, date),
        description = COALESCE($4, description),
        image_url = $5,
        image_public_id = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *`;

    const finalUpdate = await pool.query(updateQuery, [
      title,
      location,
      date,
      description,
      imageUrl,
      imagePublicId,
      id,
    ]);

    res.status(200).json({
      message: "Event updated Successfully",
      data: finalUpdate.rows[0],
    });
  } catch (error) {
    // If upload happened but DB failed, we should handle the temp file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const getEventsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ error: "Provide the id for the event" });

    const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const existingEvent = result.rows[0];

    res.status(200).json({
      message: "The event by id is here",
      data: existingEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ error: "Provide the id for the event" });

    // 1. Auth Check
    if (!req.user || req.user.role_id !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const deleteResults = await pool.query(
      `DELETE FROM events WHERE id=$1 RETURNING* `,
      [id],
    );
    const delivery = deleteResults.rows[0];

    res.status(200).json({
      message: "If your were sure about that then successfully deleted",
      delivery,
    });
  } catch (error) {
    next(error);
  }
};
