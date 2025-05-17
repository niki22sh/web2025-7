CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    user_name VARCHAR(255),
    taken_at TIMESTAMP,
    returned_at TIMESTAMP
);






