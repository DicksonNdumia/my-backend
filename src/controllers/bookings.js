import pool from "../config/db.config.js";

export const bookAnEvent = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const created_by = req.user.id;

    // check if the user has an account
    if (!req.user.id) {
      return res.status(400).json({
        message: "Please login or register account!",
      });
    }

    //checking if event is already booked
    const checkIfUserHasBooked = await pool.query(
      `SELECT * FROM bookings WHERE event_id=$1 AND created_by=$2`,
      [event_id, created_by],
    );
    if (checkIfUserHasBooked.rows.length > 0) {
      return res.status(400).json({
        message: "You can't book twice my friend",
      });
    }

    //Validate the event id if it is inputed
    if (!event_id) {
      return res.status(400).json({
        message: "Please input the id for the event",
      });
    }

    //checking if the event exists

    const eventQuery = await pool.query(`SELECT * FROM events WHERE id=$1`, [
      event_id,
    ]);
    if (eventQuery.rows.length === 0) {
      return res.status(400).json({
        message: "The event does not exist create another one",
      });
    }

    // if all is correct now the event can be booked
    const insertQuery = await pool.query(
      `INSERT INTO bookings (event_id,created_by) VALUES($1, $2) RETURNING * `,
      [event_id, created_by],
    );

    const result = insertQuery.rows[0];

    res.status(201).json({
      message: "Booking of the event was successful see you there",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventAndBooking = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const user_id = req.user?.id;

    // 1. Check if the user is authenticated
    if (!user_id) {
      return res.status(401).json({
        message: "Please login or register account!",
      });
    }

    // 2. Check if THIS specific user has booked THIS specific event
    // FIX: Added both event_id and user_id to the array
    const checkIfUserHasBooked = await pool.query(
      `SELECT id FROM bookings WHERE event_id = $1 AND created_by = $2`,
      [event_id, user_id],
    );

    if (checkIfUserHasBooked.rows.length === 0) {
      return res.status(404).json({
        message: "You have not booked this event yet.",
      });
    }

    // 3. Fetch details
    // FIX: Added a missing comma between attendee_name and u.email
    // FIX: Added a WHERE clause so you only get the details for THIS booking
    const checkQueryForEvents = await pool.query(
      `SELECT 
        b.id AS booking_id, 
        b.created_at AS booking_date, 
        e.title AS event_title, 
        e.location AS event_location, 
        e.date AS event_date, 
        u.name AS attendee_name, 
        u.email AS attendee_email 
      FROM bookings b 
      JOIN events e ON b.event_id = e.id 
      JOIN users u ON b.created_by = u.id 
      WHERE b.event_id = $1 AND b.created_by = $2`,
      [event_id, user_id],
    );

    const result = checkQueryForEvents.rows[0];

    res.status(200).json({
      message: "Boom! Event details fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAlleventsDetails = async (req, res, next) => {
  try {
    const user_id = req.user?.id;
    const role_id = req.user?.role_id;

    // 1. Check if the user is authenticated
    if (!user_id || role_id !== 2) {
      return res.status(401).json({
        message: "Not Authorized!",
      });
    }

    const checkQueryForEvents = await pool.query(
      `SELECT 
        b.id AS booking_id, 
        b.created_at AS booking_date, 
        e.title AS event_title, 
        e.image_url AS image,
        e.location AS event_location, 
        e.date AS event_date, 
        u.name AS attendee_name, 
        u.email AS attendee_email 
      FROM bookings b 
      JOIN events e ON b.event_id = e.id 
      JOIN users u ON b.created_by = u.id 
      `,
    );

    const result = checkQueryForEvents.rows;

    res.status(200).json({
      message: "Boom! Event details fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBookings = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    if (!event_id)
      return res.status(400).json({ error: "Provide the id for the booking!" });

    // 1. Checking if is moderator a
    if (!req.user || (req.user.role_id !== 2 && 3)) {
      return res.status(401).json({ error: "Unauthorized You can't delete" });
    }

    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
      event_id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking  not found" });
    }

    const deleteResults = await pool.query(
      `DELETE FROM bookings WHERE id=$1 RETURNING* `,
      [event_id],
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
