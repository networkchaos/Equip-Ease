-- CREATE DATABASE
DROP DATABASE IF EXISTS equip_ease;
CREATE DATABASE equip_ease;

-- CONNECT TO DATABASE
\c equip_ease;

-- TABLE CREATION AND SEQUENCES
-- USERS
CREATE TABLE public.users (
    users_user_id SERIAL PRIMARY KEY,
    users_name VARCHAR(100),
    users_email VARCHAR(100) UNIQUE NOT NULL,
    users_password TEXT NOT NULL,
    users_role VARCHAR(20) NOT NULL CHECK (users_role IN ('farmer', 'owner', 'admin')),
    reset_token TEXT,
    reset_token_expiry TIMESTAMP
);

-- EQUIPMENT
CREATE TABLE public.equipment (
    equipment_equipment_id SERIAL PRIMARY KEY,
    equipment_owner_id INT,
    equipment_name VARCHAR(100),
    equipment_type VARCHAR(50),
    equipment_description TEXT,
    equipment_location VARCHAR(100),
    equipment_price_per_day NUMERIC,
    equipment_image_url TEXT,
    equipment_availability VARCHAR(20),
    equipment_price NUMERIC,
    equipment_status TEXT,
    equipment_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    equipment_maintenance_date DATE,
    users_user_id INT,
    CONSTRAINT equipment_equipment_owner_id_fkey FOREIGN KEY (equipment_owner_id) REFERENCES public.users(users_user_id) ON DELETE CASCADE,
    CONSTRAINT fk_equipment_user FOREIGN KEY (users_user_id) REFERENCES public.users(users_user_id) ON DELETE SET NULL
);

-- BOOKINGS
CREATE TABLE public.bookings (
    bookings_booking_id SERIAL PRIMARY KEY,
    bookings_equipment_id INT,
    bookings_farmer_id INT,
    bookings_start_date DATE,
    bookings_end_date DATE,
    bookings_status VARCHAR(20),
    bookings_total_amount NUMERIC,
    FOREIGN KEY (bookings_equipment_id) REFERENCES public.equipment(equipment_equipment_id) ON DELETE CASCADE,
    FOREIGN KEY (bookings_farmer_id) REFERENCES public.users(users_user_id) ON DELETE CASCADE
);

-- PAYMENTS
CREATE TABLE public.payments (
    payments_payment_id SERIAL PRIMARY KEY,
    payments_booking_id INT,
    payments_amount NUMERIC,
    payments_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payments_status VARCHAR(20),
    payments_receipt_url TEXT
);

-- REVIEWS
CREATE TABLE public.reviews (
    reviews_review_id SERIAL PRIMARY KEY,
    reviews_booking_id INT,
    reviews_rating INT CHECK (reviews_rating >= 1 AND reviews_rating <= 5),
    reviews_comment TEXT,
    reviews_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMMUNITY POSTS
CREATE TABLE public.communityposts (
    communityposts_post_id SERIAL PRIMARY KEY,
    communityposts_user_id INT,
    communityposts_content TEXT NOT NULL,
    communityposts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (communityposts_user_id) REFERENCES public.users(users_user_id) ON DELETE CASCADE
);

-- COMMENTS
CREATE TABLE public.comments (
    comments_comment_id SERIAL PRIMARY KEY,
    comments_post_id INT,
    comments_user_id INT,
    comments_content TEXT NOT NULL,
    comments_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comments_post_id) REFERENCES public.communityposts(communityposts_post_id) ON DELETE CASCADE,
    FOREIGN KEY (comments_user_id) REFERENCES public.users(users_user_id) ON DELETE CASCADE
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
    notifications_notification_id SERIAL PRIMARY KEY,
    notifications_user_id INT,
    notifications_message TEXT,
    notifications_read_status BOOLEAN DEFAULT FALSE,
    notifications_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notifications_user_id) REFERENCES public.users(users_user_id) ON DELETE CASCADE
);

-- STK PUSH SESSIONS
CREATE TABLE public.stkpushsessions (
    id SERIAL PRIMARY KEY,
    checkout_request_id TEXT UNIQUE,
    phone TEXT,
    amount NUMERIC,
    equipment_id INT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRANSACTIONS
CREATE TABLE public.transactions (
    transaction_id SERIAL PRIMARY KEY,
    phone VARCHAR(20),
    amount INT,
    checkout_id TEXT,
    equipment_id INT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20)
);

-- DATA INSERTIONS
INSERT INTO public.users (users_user_id, users_name, users_email, users_password, users_role, reset_token, reset_token_expiry) VALUES
(3, 'Test User', 'test@example.com', '$2b$10$FXTtxjItIRoECBLmAfhQe.M40y3xLV.ePKxSgKFeR8JpoRlbUQSU2', 'farmer', NULL, NULL),
(7, 'Kamau mkulima', 'kamau@gmail.com', '$2b$10$cwKJWaP6uDTo9zgf3epZ9OCQJ3DdIR9Q8ujn3jEHW98lFlc.xPwv2', 'admin', NULL, NULL),
(6, 'george Kinyanjui', 'Gruchathi@gmail.com', '$2b$10$FHBh4753Hr8./mh78iL3A.WXBft3yYzpCnKUZoDp/bus3YK2y3bvO', 'farmer', 'f7243b4f256f19e258006cd7cd3d2666d3df1e475b8b1512f88fe8eb20d83e7b', '2025-07-29 23:07:30.438');

INSERT INTO public.equipment VALUES 
(2, NULL, 'Tractor Top Tier', 'Tractor', 'Tractor Top Tier', 'kiambu', 20, '1753302329896_tactor1.jpg', 'Available', NULL, NULL, NULL, '2025-07-23 23:25:30.130861', '2025-07-09', NULL),
(3, NULL, 'MonkeyD.Dragon', 'Harvester', 'MonkeyD.Dragon', 'kiambu', 20, '1753305299049_tactor1.jpg', 'Available', NULL, NULL, NULL, '2025-07-24 00:14:59.206244', '2025-07-24', NULL);

INSERT INTO public.communityposts VALUES
(2, 6, 'This is George’s first community post!', '2025-07-23 01:59:04.550802'),
(4, 7, 'hello', '2025-07-23 22:37:17.732772'),
(5, 7, 'good website', '2025-07-29 11:38:50.926167');