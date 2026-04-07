-- =========================
-- ROLES TABLE
-- =========================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    age INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- EVENTS TABLE
-- =========================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    image_public_id TEXT,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- COMMENTS TABLE
-- =========================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- REVIEWS TABLE
-- =========================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    review TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- =========================
--Bookings TABLE
-- =========================
CREATE TABLE bookings (
     id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL
     created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),

);




-- =========================
-- INserting Into roles
-- =========================
INSERT INTO roles (name, description)
VALUES 
    ('admin', 'Full access to all resources'),
    ('moderator', 'Can manage events and comments'),
    ('user', 'Regular user with limited access');

-- =========================
-- GENERIC TRIGGER FUNCTION FOR updated_at
-- =========================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- ATTACH TRIGGERS TO TABLES
-- =========================
CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER events_updated_at_trigger
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comments_updated_at_trigger
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reviews_updated_at_trigger
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


---To prevent a person from making two booking on ine event
ALTER TABLE bookings ADD CONSTRAINT unique_user_event UNIQUE (event_id, created_by);