-- Pashu Care Supabase Schema & Mock Data Seed (Idempotent)

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cows CASCADE;
DROP TABLE IF EXISTS gaushalas CASCADE;
DROP TABLE IF EXISTS vets CASCADE;
DROP TABLE IF EXISTS ambulances CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    name VARCHAR(255),
    location VARCHAR(255),
    active_hours INT DEFAULT 0,
    inventory_total INT DEFAULT 0,
    inventory_remaining INT DEFAULT 0,
    inventory_label VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_id VARCHAR(50) UNIQUE NOT NULL,
    species VARCHAR(100) DEFAULT 'Cow',
    breed VARCHAR(100),
    age INT,
    health VARCHAR(100),
    vaccination DATE,
    owner_name VARCHAR(255),
    aadhar VARCHAR(20),
    phone VARCHAR(15),
    address TEXT,
    strikes INT DEFAULT 0,
    seized BOOLEAN DEFAULT FALSE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gaushalas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(15),
    capacity INT
);

CREATE TABLE vets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    specialization VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(15),
    clinic TEXT
);

CREATE TABLE ambulances (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    vehicle VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(15)
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50), 
    description TEXT,
    location VARCHAR(255),
    reported_by VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEED MOCK DATA
INSERT INTO users (phone, role, name, location, active_hours, inventory_total, inventory_remaining, inventory_label) VALUES 
('9999999999', 'admin', 'Super Admin', 'HQ', 24, 0, 0, ''),
('1111111111', 'gaushala_manager', 'Raj Tiwari', 'Garhwa', 8, 100, 50, '?????? ??????'),
('2222222222', 'patrol_squad', 'Bishal', 'HQ', 12, 50, 20, '????? ?????'),
('3333333333', 'tagging_agent', 'XYZ', 'Field', 6, 200, 85, 'QR ???');

INSERT INTO cows (qr_id, breed, age, health, vaccination, owner_name, aadhar, phone, address) VALUES
('00', 'Gir (Demo)', 5, 'Good', '2026-01-15', 'Ramesh Kumar', '987654321012', '9876543210', 'Kisan Dairy Farm, Main Road');

INSERT INTO gaushalas (name, location, phone, capacity) VALUES
('Shri Krishna Gaushala', 'Garhwa', '9876543210', 150),
('Pashupati Nath Shelter', 'Garhwa', '8765432109', 80),
('Gau Mata Seva Ashram', 'Ranchi', '7654321098', 200);

INSERT INTO vets (name, specialization, location, phone, clinic) VALUES
('Dr. Rajesh Kumar', 'General Cattle Health', 'Garhwa', '9000100021', 'Pashu Chikitsalaya'),
('Dr. Sunita Sharma', 'Dairy Nutrition', 'Garhwa', '9000100022', 'Govt Vet Hospital');

INSERT INTO ambulances (name, vehicle, location, phone) VALUES
('Shiv Shankar Transport', 'Bolero Pickup', 'Garhwa', '9876000001'),
('Raju Tractor Sewa', 'Tractor Trolley', 'Garhwa', '9876000002');
