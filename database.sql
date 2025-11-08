--
-- create TABLE person(
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(256),
--     surname VARCHAR(256)
-- );
--
-- create TABLE post(
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(256),
--     content VARCHAR(256),
--     user_id INTEGER,
--     FOREIGN KEY (user_id) REFERENCES person (id)
-- );
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post (
                      id SERIAL PRIMARY KEY,
                      title VARCHAR(255) NOT NULL,
                      content TEXT,
                      user_id INTEGER NOT NULL,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_user_id ON post(user_id);
CREATE INDEX idx_posts_created_at ON post(created_at);

INSERT INTO users (username, email, password) VALUES
    ('testuser', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: password