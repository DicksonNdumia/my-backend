// This is also a map
// CREATE TABLE comments (
//     id SERIAL PRIMARY KEY,
//     event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
//     comment TEXT NOT NULL,
//     created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// );
