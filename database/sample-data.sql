-- ====================================================================
-- AI-Powered Criminal Network Analysis System
-- Synthetic Demo Dataset
-- All entities and records are strictly fictional and for educational demo.
-- ====================================================================

USE criminal_network_db;

-- System Users (Default password: Password@123)
-- BCrypt: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
INSERT INTO users (username, email, password_hash, full_name, badge_number, department, role, is_active) VALUES
('admin', 'admin@demo.local', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Elena Vance', 'BADGE-ADM-01', 'Special Investigations Directorate', 'ROLE_ADMIN', TRUE),
('investigator', 'investigator@demo.local', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Marcus Holloway', 'BADGE-INV-44', 'Organized Crime Division', 'ROLE_INVESTIGATOR', TRUE),
('analyst', 'analyst@demo.local', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sophia Sterling', 'BADGE-ANA-19', 'Intelligence & Network Analytics', 'ROLE_ANALYST', TRUE),
('viewer', 'viewer@demo.local', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'David Chen', 'BADGE-VIE-08', 'Auditing & Oversight Branch', 'ROLE_VIEWER', TRUE);

-- 15 Demo Cases
INSERT INTO cases (case_number, title, case_type, lead_investigator, priority, status, incident_date, incident_location, assigned_team, description, notes) VALUES
('CASE-2026-0001', 'Warehouse High-Value Cargo Theft', 'Commercial Theft', 'Marcus Holloway', 'HIGH', 'ACTIVE', '2026-01-14', 'North Docklands Terminal 4', 'Alpha Tactical', 'Organized freight interception involving coordinated logistics manipulation and cloned RFID manifests.', 'Key suspect observed coordinating multiple transport trucks.'),
('CASE-2026-0002', 'Fraudulent Shell Invoice Syndicate', 'Financial Fraud', 'Sophia Sterling', 'CRITICAL', 'UNDER_INVESTIGATION', '2026-02-03', 'Downtown Financial District', 'Financial Forensics', 'Circulation of layered multi-jurisdictional shell invoices routed through simulated supply vendors.', 'High network centrality detected around Orion Logistics Ltd.'),
('CASE-2026-0003', 'Luxury Vehicle Transshipment Network', 'Vehicle Theft', 'Marcus Holloway', 'HIGH', 'ACTIVE', '2026-02-19', 'Westside Auto Yard & Rail', 'Metro Taskforce', 'Systematic interception of luxury export vehicles with altered chassis identifiers and fake carrier manifests.', 'Cross-references suspect DEMO-P003 and DEMO-P007.'),
('CASE-2026-0004', 'Automated Cyber Wire Diversion', 'Cyber Fraud', 'Sophia Sterling', 'CRITICAL', 'ACTIVE', '2026-03-01', 'Virtual Banking Gateway / Node 12', 'Cyber Intelligence', 'Spear-phishing and API token abuse redirecting corporate vendor settlements into encrypted liquidity pools.', 'Repeated IP overlaps with Apex Data Services.'),
('CASE-2026-0005', 'Organized High-End Electronics Theft', 'Property Theft', 'Marcus Holloway', 'MEDIUM', 'REVIEW', '2026-03-12', 'Harbor View Industrial Park', 'Special Ops B', 'Sequential depot burglaries exploiting scheduled security guard rotation lapses and signal jammers.', 'Recovered 40 stolen server modules at storage unit 88.'),
('CASE-2026-0006', 'Pharmaceutical Supply Diversion', 'Contraband Diversion', 'Marcus Holloway', 'HIGH', 'UNDER_INVESTIGATION', '2026-03-28', 'Midtown Medical Warehouse', 'Public Health Taskforce', 'Diversion of regulated medical inventory through falsified hospital requisition orders.', 'Linked to medical freight operator DEMO-P015.'),
('CASE-2026-0007', 'Identity Laundering Syndicate', 'Identity Fraud', 'Sophia Sterling', 'MEDIUM', 'ACTIVE', '2026-04-10', 'Metro Civil Documentation Office', 'ID Fraud Squad', 'Fabrication of synthetic corporate directors used to open non-resident business accounts.', 'Associated with 8 registered shell corporations.'),
('CASE-2026-0008', 'Port Container Smuggling Ring', 'Cross-Border Smuggling', 'Marcus Holloway', 'CRITICAL', 'ACTIVE', '2026-04-22', 'International Port Basin Quay 7', 'Maritime Interdiction', 'Smuggling contraband concealed in modified industrial refrigeration compressors across shipping routes.', 'Major connectivity bridge between Maritime Logistics and North Hub.'),
('CASE-2026-0009', 'Securities Front Trading Network', 'Securities Fraud', 'Sophia Sterling', 'MEDIUM', 'ON_HOLD', '2026-05-04', 'Capital Plaza Tower 2', 'Financial Forensics', 'Pre-arranged option volume spikes prior to corporate acquisition announcements across disposable trading entities.', 'Awaiting broker audit response.'),
('CASE-2026-0010', 'Counterfeit Luxury Goods Transit', 'IP & Trademark Theft', 'Marcus Holloway', 'LOW', 'REVIEW', '2026-05-18', 'Eastside Cargo Depot', 'Customs Enforcement', 'Bulk import of high-grade imitation goods disguised as raw textile shipments.', 'Two distribution warehouses raided.'),
('CASE-2026-0011', 'Industrial Heavy Equipment Theft', 'Equipment Theft', 'Marcus Holloway', 'MEDIUM', 'ACTIVE', '2026-06-02', 'Suburban Bypass Construction Yard', 'Commercial Ops', 'Midnight removal of tracked hydraulic excavators and generators using falsified lease return documentation.', 'GPS tracking deactivated via Faraday shielding.'),
('CASE-2026-0012', 'Crypto ATM SIM-Swapping Syndicate', 'Telecom Cybercrime', 'Sophia Sterling', 'HIGH', 'ACTIVE', '2026-06-15', 'Citywide Telecom Retail Outlets', 'Cyber Forensics', 'Bribed mobile carrier retail staff executing unauthorized SIM swaps to drain multi-sig wallet authorization codes.', 'Cross-case telecom records overlap with CASE-2026-0004.'),
('CASE-2026-0013', 'Maritime Fuel Bunkering Scheme', 'Resource Fraud', 'Marcus Holloway', 'MEDIUM', 'UNDER_INVESTIGATION', '2026-07-01', 'Southern Offshore Anchorage', 'Maritime Unit', 'Unreported offshore fuel transfers from automated barges into uninspected coastal transport vessels.', 'Analysis of AIS telemetry records underway.'),
('CASE-2026-0014', 'Government Grant Falsification Syndicate', 'Public Procurement Fraud', 'Sophia Sterling', 'LOW', 'CLOSED', '2026-07-20', 'Civic Administration Annex', 'Oversight Integrity Unit', 'Submitting fraudulent environmental cleanup invoices for phantom land parcels.', 'Investigation finalized. Recovered institutional funds.'),
('CASE-2026-0015', 'Precious Metal Refinery Skimming', 'Commercial Embezzlement', 'Marcus Holloway', 'HIGH', 'NEW', '2026-08-11', 'Northern Industrial Foundry', 'Special Crimes Alpha', 'Systematic calibration manipulation on scrap metal weigh scales diverting platinum-group slag.', 'Discrepancy audit flagged 4.2kg variance.');

-- 40 Synthetic Persons of Interest (DEMO-P001 to DEMO-P040)
INSERT INTO persons (person_id, name, alias, age, gender, primary_location, status, occupation, risk_level, notes) VALUES
('DEMO-P001', 'Arjun Rao', 'The Architect', 42, 'Male', 'North Docklands', 'SUSPECT', 'Logistics Broker', 'HIGH', 'Coordinates shipping lane schedules; frequent contact across commercial transport hubs.'),
('DEMO-P002', 'Devika Nair', 'Cipher', 31, 'Female', 'Downtown Financial District', 'SUSPECT', 'Financial Systems Consultant', 'CRITICAL', 'Expert in digital payment routing and automated escrow layers.'),
('DEMO-P003', 'Vikram Malhotra', 'V-Six', 38, 'Male', 'Westside Industrial Zone', 'SUSPECT', 'Freight Forwarder', 'HIGH', 'Registered owner of commercial fleet transport vehicles.'),
('DEMO-P004', 'Rohan Mehta', 'Ghost Operator', 35, 'Male', 'Harbor View', 'PERSON_OF_INTEREST', 'Customs Clearance Agent', 'MEDIUM', 'Provides documentation stamps for incoming manifests.'),
('DEMO-P005', 'Ananya Sharma', 'The Broker', 29, 'Female', 'Capital Plaza', 'PERSON_OF_INTEREST', 'Accountant', 'MEDIUM', 'Manages corporate ledger books for several shell entities.'),
('DEMO-P006', 'Kavita Menon', 'Vanguard', 45, 'Female', 'Central Maritime Hub', 'SUSPECT', 'Port Terminal Inspector', 'HIGH', 'Authorizes container exit gates during off-peak night shifts.'),
('DEMO-P007', 'Tariq Al-Mansoor', 'Falcon', 39, 'Male', 'Westside Auto Yard', 'SUSPECT', 'Automotive Import Specialist', 'HIGH', 'Oversees high-end vehicle repair and transshipment operations.'),
('DEMO-P008', 'Samantha Reed', 'Silver', 34, 'Female', 'East End Quarters', 'ASSOCIATE', 'Warehouse Manager', 'MEDIUM', 'Keyholder for North Docklands Terminal 4 secure bay.'),
('DEMO-P009', 'Naveen Patel', 'Spark', 27, 'Male', 'Silicon Corridor', 'PERSON_OF_INTEREST', 'Software Developer', 'HIGH', 'Contractor hired to develop custom SIM-swap tooling scripts.'),
('DEMO-P010', 'Carlos Ortiz', 'El Martillo', 48, 'Male', 'South River Basin', 'SUSPECT', 'Scrap Metal Wholesaler', 'HIGH', 'Operates foundry storage yard with furnace capabilities.'),
('DEMO-P011', 'Mira Kulkarni', 'Oracle', 36, 'Female', 'Midtown Central', 'WITNESS', 'Hospital Supply Auditor', 'LOW', 'Whistleblower who reported missing pharmaceutical lots.'),
('DEMO-P012', 'Zackary Stone', 'The Courier', 32, 'Male', 'City Transit Hub', 'ASSOCIATE', 'Private Dispatcher', 'MEDIUM', 'Transports encrypted drives and paper bills of lading.'),
('DEMO-P013', 'Priya Deshmukh', 'Duchess', 41, 'Female', 'Uptown Heights', 'SUSPECT', 'Art & Antique Dealer', 'HIGH', 'Provides appraisal certificates for high-value transshipments.'),
('DEMO-P014', 'Farhan Qureshi', 'Anchor', 50, 'Male', 'Coastal Anchorage', 'PERSON_OF_INTEREST', 'Barge Captain', 'MEDIUM', 'Commands coastal tugs and auxiliary fuel transport vessels.'),
('DEMO-P015', 'Dr. Harold Vance', 'Chemist', 56, 'Male', 'Midtown Medical Hub', 'SUSPECT', 'Clinical Researcher', 'HIGH', 'Authorizes restricted chemical inventory requisitions.'),
('DEMO-P016', 'Sunita Reddy', 'Ledger', 37, 'Female', 'Civic District', 'ASSOCIATE', 'Notary Public', 'LOW', 'Notarized documentation for contested shell incorporations.'),
('DEMO-P017', 'Leonidas Drake', 'The Bridge', 44, 'Male', 'Central Intermodal Terminal', 'SUSPECT', 'Intermodal Coordinator', 'CRITICAL', 'Identified as a critical network bridge connecting three independent transport clusters.'),
('DEMO-P018', 'Aiden Campbell', 'Tech-Zero', 26, 'Male', 'Cyber Hub Annex', 'PERSON_OF_INTEREST', 'Telecom Counter Rep', 'MEDIUM', 'Facilitated illicit customer SIM card reassignment requests.'),
('DEMO-P019', 'Fatima Zahra', 'Spectre', 33, 'Female', 'Airport Cargo Zone', 'ASSOCIATE', 'Air Freight Dispatcher', 'LOW', 'Assists priority cargo routing through regional air hubs.'),
('DEMO-P020', 'Girish Verma', 'G-Force', 40, 'Male', 'Northern Highway Bypass', 'SUSPECT', 'Heavy Hauler Owner', 'MEDIUM', 'Provides lowboy trailers for unregistered heavy equipment moving.'),
('DEMO-P021', 'Elena Rostova', 'Baroness', 47, 'Female', 'Offshore Banking Center', 'SUSPECT', 'Trust Officer', 'HIGH', 'Controls nominee accounts across offshore fiduciary structures.'),
('DEMO-P022', 'Ravi Shankar', 'Lens', 30, 'Male', 'Harbor View', 'WITNESS', 'CCTV Maintenance Tech', 'LOW', 'Provided technical evidence regarding camera blindspots in Bay 4.'),
('DEMO-P023', 'Chloe Dubois', 'Siren', 32, 'Female', 'Westside Promenade', 'ASSOCIATE', 'VIP Hospitality Coordinator', 'LOW', 'Arranged off-the-record meetings at private club venues.'),
('DEMO-P024', 'Suresh Nair', 'Ironclad', 46, 'Male', 'Foundry Row', 'PERSON_OF_INTEREST', 'Industrial Crane Operator', 'MEDIUM', 'Assisted in night loading of heavy containers at the rail head.'),
('DEMO-P025', 'Amara Okafor', 'Nexus', 35, 'Female', 'Financial District', 'PERSON_OF_INTEREST', 'Compliance Analyst', 'LOW', 'Flagged multiple suspicious transactions before dismissal.'),
('DEMO-P026', 'Marcus Brody', 'The Mechanic', 43, 'Male', 'Industrial Park West', 'ASSOCIATE', 'Heavy Machinery Technician', 'MEDIUM', 'Specialist in disabling OEM GPS tracking transponders.'),
('DEMO-P027', 'Geeta Joshi', 'Penny', 28, 'Female', 'Midtown Commercial', 'ASSOCIATE', 'Retail Bank Teller', 'LOW', 'Assisted with high-frequency cash deposits below reporting threshold.'),
('DEMO-P028', 'Dmitri Volkov', 'Hammer', 52, 'Male', 'Port Basin Pier 9', 'SUSPECT', 'Stevedore Supervisor', 'HIGH', 'Oversees dock container movement and unmanifested pallet storage.'),
('DEMO-P029', 'Maya Lin', 'Pixel', 25, 'Female', 'Metro Tech Center', 'CLEARED', 'Junior QA Engineer', 'LOW', 'Questioned regarding firmware repositories; cleared of wrongdoing.'),
('DEMO-P030', 'Kiran Bedi', 'Eagle Eye', 39, 'Male', 'Downtown Traffic Control', 'WITNESS', 'Traffic Camera Dispatcher', 'LOW', 'Preserved automated license plate recognition camera records.'),
('DEMO-P031', 'Lucas Bennett', 'Keyhole', 37, 'Male', 'Northside Warehouse', 'PERSON_OF_INTEREST', 'Locksmith & Access Specialist', 'MEDIUM', 'Dispatched to duplicate master keycards for secure perimeter doors.'),
('DEMO-P032', 'Zoya Khan', 'Silk', 34, 'Female', 'Fashion District Annex', 'PERSON_OF_INTEREST', 'Boutique Wholesaler', 'MEDIUM', 'Received shipping pallets containing counterfeit designer textiles.'),
('DEMO-P033', 'Patrick O’Connor', 'Paddy', 49, 'Male', 'Coastal Fuel Jetty', 'ASSOCIATE', 'Tugboat Pilot', 'MEDIUM', 'Navigated auxiliary fuel vessels during nocturnal rendezvous.'),
('DEMO-P034', 'Nalini Swaminathan', 'Archivist', 53, 'Female', 'State Records Archive', 'WITNESS', 'Municipal Records Keeper', 'LOW', 'Verified historical property deed records in grant audit case.'),
('DEMO-P035', 'Felix Ramos', 'Shadow', 31, 'Male', 'South Industrial Zone', 'SUSPECT', 'Darknet Marketplace Vendor', 'HIGH', 'Brokered digital login credentials and cloned gate passes.'),
('DEMO-P036', 'Divya Sundaram', 'Echo', 29, 'Female', 'Central Telemetry Lab', 'ASSOCIATE', 'Radio Frequency Technician', 'MEDIUM', 'Sold portable handheld GPS signal dampeners.'),
('DEMO-P037', 'Brandon Walker', 'Diesel', 41, 'Male', 'Truck Stop Oasis 12', 'ASSOCIATE', 'Long-Haul Interstate Driver', 'MEDIUM', 'Transported sealed refrigerated containers without bill of lading.'),
('DEMO-P038', 'Kareem Mansoor', 'The Scribe', 38, 'Male', 'Commercial Square', 'PERSON_OF_INTEREST', 'Corporate Secretary', 'MEDIUM', 'Drafted shareholder meeting minutes for inactive holding entities.'),
('DEMO-P039', 'Trisha Roy', 'Nova', 28, 'Female', 'Suburban Co-working Space', 'PERSON_OF_INTEREST', 'Graphic Designer', 'LOW', 'Created corporate logos and invoice templates for fictitious vendors.'),
('DEMO-P040', 'Victor Sterling', 'Old Guard', 62, 'Male', 'Hilltop Manor', 'SUSPECT', 'Retired Board Member', 'HIGH', 'Beneficiary of offshore family trust tied to Orion Holdings.');

-- 10 Synthetic Organizations
INSERT INTO organizations (organization_id, name, org_type, location, status, description) VALUES
('ORG-0001', 'Orion Logistics International', 'Logistics', 'North Docklands Terminal 4', 'ACTIVE', 'Major freight handling and intermodal carrier firm under review.'),
('ORG-0002', 'Apex Data Services Ltd', 'Shell Company', 'Capital Plaza Suite 400', 'ACTIVE', 'IT advisory firm routing consulting fees without observable operations.'),
('ORG-0003', 'Silverline Automotive Exports', 'Commercial', 'Westside Industrial Park', 'SUSPENDED', 'Used auto dealership and overseas shipping consignment depot.'),
('ORG-0004', 'BlueWave Maritime Bunkering', 'Logistics', 'Coastal Anchorage Berth 12', 'ACTIVE', 'Offshore marine fuel bunkering and vessel refueling services.'),
('ORG-0005', 'Novartis Pharma Distributors (Demo)', 'Commercial', 'Midtown Medical Hub', 'ACTIVE', 'Wholesale pharmaceutical distributor operating regional temperature-controlled hubs.'),
('ORG-0006', 'Vanguard Security Systems', 'Commercial', 'Harbor View Blvd 101', 'ACTIVE', 'Contractor providing access control and guard monitoring services.'),
('ORG-0007', 'Kestrel Capital Holdings', 'Financial', 'Downtown Financial Tower', 'ACTIVE', 'Private investment vehicle holding equity stakes across transit entities.'),
('ORG-0008', 'IronClad Heavy Metal Scrap', 'Commercial', 'South River Industrial Row', 'ACTIVE', 'Large industrial metal sorting and reclamation facility.'),
('ORG-0009', 'AeroSpeed Express Cargo', 'Logistics', 'Airport Cargo Zone 3', 'ACTIVE', 'Regional air express cargo handler and bonded customs warehouse.'),
('ORG-0010', 'The Obsidian Social Club', 'Club', 'Westside Promenade', 'ACTIVE', 'Private member dining club frequented by logistics executives.');

-- 15 Synthetic Vehicles
INSERT INTO vehicles (vehicle_id, registration_number, vehicle_type, brand, model, color, owner_name, owner_person_id, case_id, last_known_location) VALUES
('VEH-0001', 'TN-00-DEMO-001', 'Heavy Truck', 'Volvo', 'FH16 Semi-Trailer', 'Midnight Blue', 'Orion Logistics', 1, 1, 'North Docklands Terminal 4'),
('VEH-0002', 'TN-00-DEMO-002', 'SUV', 'Land Rover', 'Defender 110', 'Matte Black', 'Arjun Rao', 1, 1, 'Harbor View Drive'),
('VEH-0003', 'TN-00-DEMO-003', 'Sedan', 'Audi', 'A8 L', 'Silver', 'Devika Nair', 2, 2, 'Financial District Parking'),
('VEH-0004', 'TN-00-DEMO-004', 'Flatbed Hauler', 'Mercedes-Benz', 'Actros 2645', 'White', 'Vikram Malhotra', 3, 3, 'Westside Auto Yard'),
('VEH-0005', 'TN-00-DEMO-005', 'Van', 'Ford', 'Transit 350 High Roof', 'Grey', 'Samantha Reed', 8, 1, 'North Docklands Gate 2'),
('VEH-0006', 'TN-00-DEMO-006', 'Sports Coupe', 'Porsche', '911 Carrera', 'Guards Red', 'Tariq Al-Mansoor', 7, 3, 'Westside Promenade'),
('VEH-0007', 'TN-00-DEMO-007', 'Refrigerated Truck', 'Isuzu', 'Giga Cool Carrier', 'White', 'Novartis Pharma Distributors', 15, 6, 'Midtown Medical Hub'),
('VEH-0008', 'TN-00-DEMO-008', 'Tugboat', 'Damen', 'Stan Tug 1606', 'Yellow/Blue', 'Farhan Qureshi', 14, 13, 'Southern Offshore Anchorage'),
('VEH-0009', 'TN-00-DEMO-009', 'Excavator Transporter', 'Scania', 'R580 Heavy Hauler', 'Orange', 'Girish Verma', 20, 11, 'Northern Highway Bypass'),
('VEH-0010', 'TN-00-DEMO-010', 'Cargo Van', 'Mercedes-Benz', 'Sprinter 516', 'Dark Grey', 'Zackary Stone', 12, 5, 'City Transit Hub'),
('VEH-0011', 'TN-00-DEMO-011', 'SUV', 'BMW', 'X7 M60i', 'Alpine White', 'Victor Sterling', 40, 2, 'Hilltop Manor Lane'),
('VEH-0012', 'TN-00-DEMO-012', 'Utility Van', 'Renault', 'Master WorkVan', 'Navy Blue', 'Ravi Shankar', 22, 1, 'Bay 4 Maintenance Bay'),
('VEH-0013', 'TN-00-DEMO-013', 'Motorcycle', 'Ducati', 'Multistrada V4', 'Red', 'Naveen Patel', 9, 4, 'Silicon Corridor Garage'),
('VEH-0014', 'TN-00-DEMO-014', 'Flatbed Truck', 'Tata', 'Prima 4028.S', 'Green', 'Carlos Ortiz', 10, 15, 'Foundry Row Yard'),
('VEH-0015', 'TN-00-DEMO-015', 'Sedan', 'Tesla', 'Model S Plaid', 'Deep Blue', 'Ananya Sharma', 5, 2, 'Capital Plaza P1');

-- 20 Synthetic Incidents (realistic coordinates around demo metropolitan zone: 13.0827, 80.2707)
INSERT INTO incidents (incident_id, incident_type, incident_date, incident_time, location, latitude, longitude, description, case_id, case_number, status) VALUES
('INC-2026-0001', 'Freight Manifest Tampering', '2026-01-14', '02:15:00', 'North Docklands Terminal 4', 13.092400, 80.298000, 'Physical security seal breached and replacement digital RFID tag attached to outbound container.', 1, 'CASE-2026-0001', 'VERIFIED'),
('INC-2026-0002', 'Unauthorized Escrow Redirect', '2026-02-03', '16:42:00', 'Financial District Core', 13.081100, 80.282000, 'Batch clearing instruction altered at gateway server triggering wire transfer to non-resident bank.', 2, 'CASE-2026-0002', 'INVESTIGATING'),
('INC-2026-0003', 'GPS Jammer Deployment', '2026-02-19', '23:30:00', 'Westside Auto Yard Gate B', 13.075000, 80.245000, 'High-power frequency jammer activated as two luxury export vehicles departed the compound.', 3, 'CASE-2026-0003', 'VERIFIED'),
('INC-2026-0004', 'Corporate API Key Compromise', '2026-03-01', '04:10:00', 'Silicon Corridor Tech Park', 13.064000, 80.231000, 'Compromised admin credentials used to dump client payout hashes onto foreign staging bucket.', 4, 'CASE-2026-0004', 'VERIFIED'),
('INC-2026-0005', 'Electronics Warehouse Breach', '2026-03-12', '01:50:00', 'Harbor View Industrial Park', 13.089000, 80.289000, 'Rear emergency exit unlatched from interior; 40 enterprise compute blades loaded into cargo van.', 5, 'CASE-2026-0005', 'RESOLVED'),
('INC-2026-0006', 'Restricted Chemical Stock Discrepancy', '2026-03-28', '11:00:00', 'Midtown Medical Warehouse', 13.078000, 80.260000, 'Internal inventory review revealed 1,200 vials missing from cold chain lot B-9.', 6, 'CASE-2026-0006', 'INVESTIGATING'),
('INC-2026-0007', 'Fictitious Corporate Registry Filing', '2026-04-10', '14:20:00', 'Civic Administration Annex', 13.084000, 80.275000, 'Fraudulent director identities used to register 3 limited companies with forged lease agreements.', 7, 'CASE-2026-0007', 'INVESTIGATING'),
('INC-2026-0008', 'Refrigerated Container Modification', '2026-04-22', '03:15:00', 'International Port Basin Pier 7', 13.098000, 80.301000, 'Dual false wall discovered inside ISO container cooling unit housing unregistered cargo.', 8, 'CASE-2026-0008', 'VERIFIED'),
('INC-2026-0009', 'Abnormal Call Option Surge', '2026-05-04', '09:45:00', 'Capital Plaza Exchange', 13.080500, 80.283500, 'Pre-market order book flooded with out-of-the-money call contracts from offshore shell IP.', 9, 'CASE-2026-0009', 'REVIEW'),
('INC-2026-0010', 'Customs Declaration Mismatch', '2026-05-18', '17:00:00', 'Eastside Cargo Depot', 13.086000, 80.292000, 'Shipment manifested as polyester yarn found to contain boxed designer accessories.', 10, 'CASE-2026-0010', 'RESOLVED'),
('INC-2026-0011', 'Excavator Tracking Deactivation', '2026-06-02', '22:05:00', 'Highway 4 Construction Site', 13.050000, 80.210000, 'Telematics transponder sheared off Caterpillar 330 excavator and dropped into concrete footer.', 11, 'CASE-2026-0011', 'INVESTIGATING'),
('INC-2026-0012', 'Unauthorized SIM Replacement Raid', '2026-06-15', '19:40:00', 'Metro Telecom Flagship Store', 13.072000, 80.252000, 'Employee override passcode used to issue 6 replacement SIM cards without customer identity verification.', 12, 'CASE-2026-0012', 'VERIFIED'),
('INC-2026-0013', 'Offshore Marine Valve Tampering', '2026-07-01', '02:40:00', 'Coastal Anchorage Berth 12', 13.110000, 80.315000, 'Fuel transfer line connected between licensed supply barge and unflagged coastal vessel.', 13, 'CASE-2026-0013', 'INVESTIGATING'),
('INC-2026-0014', 'Ineligible Grant Disbursement', '2026-07-20', '10:15:00', 'Civic Council Office', 13.083500, 80.276000, 'State environmental restoration subsidy approved based on computer-generated soil test reports.', 14, 'CASE-2026-0014', 'RESOLVED'),
('INC-2026-0015', 'Weighbridge Sensor Calibration Shift', '2026-08-11', '08:30:00', 'Northern Foundry Gate 1', 13.102000, 80.265000, 'Strain gauge load cells modified with resistor clamp, under-reporting gross incoming truck weight by 6%.', 15, 'CASE-2026-0015', 'INVESTIGATING'),
('INC-2026-0016', 'Midnight Shunting Activity', '2026-08-25', '01:10:00', 'Westside Rail Yard Siding 3', 13.076000, 80.241000, 'Locomotive shunted 4 unlogged rail boxcars to private siding without train dispatcher clearance.', 3, 'CASE-2026-0003', 'INVESTIGATING'),
('INC-2026-0017', 'Phishing Portal Infrastructure Spinup', '2026-09-02', '13:00:00', 'Central Internet Exchange Point', 13.067000, 80.240000, 'DNS redirection rules established mirroring regional credit union corporate portal.', 4, 'CASE-2026-0004', 'RESOLVED'),
('INC-2026-0018', 'Encrypted Hard Drive Drop', '2026-09-10', '18:15:00', 'City Center Transit Lockers', 13.081800, 80.274000, 'Courier deposited briefcase with hardware security tokens and handwritten transport routes.', 5, 'CASE-2026-0005', 'VERIFIED'),
('INC-2026-0019', 'Hospital Cold-Storage Alarm Bypass', '2026-09-18', '21:50:00', 'Metro General Hospital Annex', 13.079500, 80.258000, 'Thermal sensor wiring bridged with 10k resistor to prevent low-temp alarm during removal of vials.', 6, 'CASE-2026-0006', 'INVESTIGATING'),
('INC-2026-0020', 'Secret VIP Meeting Gathering', '2026-09-24', '20:30:00', 'The Obsidian Social Club', 13.074500, 80.246500, 'Unscheduled meeting observed between logistics directors, financial consultants, and port officials.', 1, 'CASE-2026-0001', 'REVIEW');

-- 25 Synthetic Evidence Records
INSERT INTO evidence (evidence_id, case_id, case_number, evidence_type, description, collected_by, collected_date, source, storage_reference, integrity_hash, status, notes) VALUES
('EV-0001', 1, 'CASE-2026-0001', 'Physical Item', 'Cloned high-frequency RFID gate transponder tag', 'Marcus Holloway', '2026-01-15', 'Docklands Terminal Gate 4', 'VAULT-SEC-01/BIN-14', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'VERIFIED', 'Matches serial signature found in suspect vehicle VEH-0001.'),
('EV-0002', 1, 'CASE-2026-0001', 'Digital File', 'Container manifest PDF with altered weights and forged seal hashes', 'Sophia Sterling', '2026-01-16', 'Port EDI Server', 'SAN-EVID-04/DIR-CASE1', 'a58b29f0e1c073a697669d67963cf3e8e9dc9d9369f417539f9b5a034989e5a1', 'VERIFIED', 'Digital certificate issued under name of Orion Logistics Ltd.'),
('EV-0003', 1, 'CASE-2026-0001', 'Video', 'Security surveillance footage showing night cargo movement at Bay 4', 'Marcus Holloway', '2026-01-17', 'Terminal Bay 4 CCTV', 'NAS-MEDIA/CAM04-NIGHT.mp4', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', 'VERIFIED', 'Shows VEH-0005 arriving at 02:10 AM.'),
('EV-0004', 2, 'CASE-2026-0002', 'Document', 'Invoices billed from Apex Data Services totaling 4.2M demo credits', 'Sophia Sterling', '2026-02-05', 'Commercial Bank Forensics', 'VAULT-DOC-02/FILE-89', 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d', 'VERIFIED', 'Identified identical bank routing account across 14 dummy vendors.'),
('EV-0005', 2, 'CASE-2026-0002', 'Digital File', 'Encrypted memory dump from compromised escrow server', 'Sophia Sterling', '2026-02-08', 'Escrow Gateway Host 1', 'SAN-CYBER/GATEWAY-RAM.raw', '7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451', 'UNDER_REVIEW', 'Extracted API authorization tokens matching user Devika Nair.'),
('EV-0006', 3, 'CASE-2026-0003', 'Physical Item', 'Handheld 16-band radio frequency jammer', 'Marcus Holloway', '2026-02-20', 'Perimeter ditch at Westside Auto Yard', 'VAULT-ELEC-01/SHELF-3', 'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f', 'VERIFIED', 'Fingerprint partial matches suspect Tariq Al-Mansoor.'),
('EV-0007', 3, 'CASE-2026-0003', 'Vehicle Record', 'Forged European transport transit declaration documents', 'Marcus Holloway', '2026-02-23', 'Vehicle Glovebox VEH-0004', 'VAULT-DOC-01/FILE-112', '1b2cf535f27731c974343645a3985ec6e1c451a9e52f1067d169f765e11b72aa', 'COLLECTED', 'Chassis numbers altered using laser etching.'),
('EV-0008', 4, 'CASE-2026-0004', 'Digital File', 'Reverse proxy access logs recording API session hijacking', 'Sophia Sterling', '2026-03-03', 'Cloudflare Audit Export', 'SAN-CYBER/LOG-APEX.csv', '2c624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972', 'VERIFIED', 'Source IP traces to rented VPN node in Frankfurt.'),
('EV-0009', 4, 'CASE-2026-0004', 'Communication Record', 'Exported encrypted chat log between user dev_spark and cipher_99', 'Sophia Sterling', '2026-03-05', 'Recovered Mobile Device', 'SAN-INTEL/CHAT-EXPORT.json', '4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2', 'UNDER_REVIEW', 'Discusses fee distribution percentage for cyber gateway operation.'),
('EV-0010', 5, 'CASE-2026-0005', 'Physical Item', 'Recovered enterprise blade servers (4 units)', 'Marcus Holloway', '2026-03-14', 'Lockup unit 88, Harbor View', 'WAREHOUSE-EVID/PALLET-09', '11f6ad8ec52a2984abaafd7c3b516503785c2072454ce161315e97d6204c4d51', 'VERIFIED', 'Serial numbers match stolen shipment from Harbor View Industrial.'),
('EV-0011', 5, 'CASE-2026-0005', 'Image', 'High-resolution still of cargo van departing industrial park', 'Marcus Holloway', '2026-03-15', 'City Traffic Cam 42', 'NAS-MEDIA/CAM42-VAN.jpg', '6a992d5529f459a44fee58c7332f618834ca10322b1f77d2d0e417a531cd49f4', 'COLLECTED', 'Shows partial license plate TN-00-DEMO-010.'),
('EV-0012', 6, 'CASE-2026-0006', 'Document', 'Falsified hospital requisition slip for clinical trial vials', 'Marcus Holloway', '2026-03-30', 'Hospital Supply Receiving', 'VAULT-DOC-03/FILE-402', '8012b35048f07015f6ad4e84b802a450410ff3725f543666d9263a23a3f5a153', 'VERIFIED', 'Authorized by signature stamp of Dr. Harold Vance.'),
('EV-0013', 7, 'CASE-2026-0007', 'Document', 'Notarized articles of incorporation for offshore subsidiary', 'Sophia Sterling', '2026-04-12', 'State Corporate Registry', 'VAULT-LEGAL/INC-8812', 'e5a1a1e4c026b484557924fecc37b420042d326f634b3f81e3a6c2306788a1be', 'VERIFIED', 'Notary seal corresponds to Sunita Reddy.'),
('EV-0014', 8, 'CASE-2026-0008', 'Physical Item', 'Custom welded aluminum cooling compartment partition', 'Marcus Holloway', '2026-04-24', 'Quay 7 Cold Storage Yard', 'CONTAINER-YARD/SEC-7A', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'VERIFIED', 'Built by industrial welding team at Foundry Row.'),
('EV-0015', 9, 'CASE-2026-0009', 'Transaction Record', 'Brokerage trade execution timestamps for front-run options', 'Sophia Sterling', '2026-05-06', 'National Securities Clearing', 'SAN-FIN/TRADE-RUN-99.csv', 'b079965a3979eaec6c58ef6e61284d7d91df130a4be3cae537d9953d619ad4ee', 'UNDER_REVIEW', 'Demonstrates 99.4% timing correlation with board memo release.'),
('EV-0016', 10, 'CASE-2026-0010', 'Physical Item', 'Seized shipping carton with 140 counterfeit designer handbags', 'Marcus Holloway', '2026-05-20', 'Eastside Cargo Depot Bay 1', 'VAULT-SEIZED/CARTON-01', 'ccc83543e323a0fd7ab22460320a5043a670ca10709b5c31937e99fef9ae3b63', 'COLLECTED', 'Labelled as raw textile samples addressed to Zoya Khan.'),
('EV-0017', 11, 'CASE-2026-0011', 'Physical Item', 'Severed GPS antenna assembly with magnetic mount', 'Marcus Holloway', '2026-06-04', 'Highway 4 site drainage culvert', 'VAULT-ELEC-02/TAG-77', '581179d675b31f99c27945c7198bb6c559868779b5c00e1227181c002241cfb2', 'VERIFIED', 'Tool marks match specialized crimping pliers found in VEH-0009.'),
('EV-0018', 12, 'CASE-2026-0012', 'Digital File', 'Carrier retail CRM access logs for unauthorized SIM re-burns', 'Sophia Sterling', '2026-06-18', 'Carrier Security Center', 'SAN-CYBER/SIM-AUDIT.json', '6f9c4f932822a9446dfdfd43c220f866ce6ac9654101e4a3623d6a9e88383e7f', 'VERIFIED', 'User ID corresponds to Aiden Campbell.'),
('EV-0019', 13, 'CASE-2026-0013', 'Location Record', 'Satellite AIS transponder track history with 4-hour blackout zone', 'Marcus Holloway', '2026-07-03', 'Coastal Coast Guard Radar Base', 'SAN-MARITIME/AIS-TRACK.gpx', '140c878939c148cf4910cfab5ef878cb1bf00742f3844f2ffbc071d0532247ba', 'VERIFIED', 'Vessel stopped within 50 meters of unflagged barge.'),
('EV-0020', 14, 'CASE-2026-0014', 'Document', 'Falsified laboratory soil remediation certificates', 'Sophia Sterling', '2026-07-22', 'Civic Council Archives', 'VAULT-DOC-04/FILE-GRANT', 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f', 'VERIFIED', 'Report referenced defunct testing laboratory.'),
('EV-0021', 15, 'CASE-2026-0015', 'Physical Item', 'Weighbridge shunt resistor circuit box with toggle switch', 'Marcus Holloway', '2026-08-13', 'Northern Foundry weigh cabin', 'VAULT-ELEC-03/SHUNT-01', '81b7a7f8cb7bb2b7c6c496150244670081d6f54c935b6028b030ee77c8e030a5', 'VERIFIED', 'Decreased recorded weight by calibrated offset of 6%.'),
('EV-0022', 1, 'CASE-2026-0001', 'Audio', 'Voicemail recording discussing delivery schedule at Terminal 4', 'Marcus Holloway', '2026-01-20', 'Recorded wiretap consent line', 'AUDIO-ARCHIVE/VM-2026-01.wav', '2b624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972', 'UNDER_REVIEW', 'Caller voice matches Arjun Rao.'),
('EV-0023', 2, 'CASE-2026-0002', 'Transaction Record', 'Wire transfer receipt to Kestrel Capital Holdings', 'Sophia Sterling', '2026-02-12', 'State Central Bank', 'VAULT-DOC-FIN/WT-88192', '3c624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972', 'VERIFIED', 'Signed by authorized proxy Ananya Sharma.'),
('EV-0024', 3, 'CASE-2026-0003', 'Document', 'Bill of lading for containerized automotive components', 'Marcus Holloway', '2026-02-28', 'Westside Rail Freight Office', 'VAULT-DOC-01/BL-4421', '4c624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972', 'VERIFIED', 'Consignee marked as Silverline Automotive Exports.'),
('EV-0025', 4, 'CASE-2026-0004', 'Digital File', 'Decrypted private key for liquidity pool management contract', 'Sophia Sterling', '2026-03-10', 'Seized Hardware Ledger', 'SAN-CYBER/KEY-DUMP.sec', '5c624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972', 'UNDER_REVIEW', 'Associated with address receiving diverted customer settlements.');

-- 70 Synthetic Relationships (creating high-connectivity clusters, bridge nodes, diverse entity types)
INSERT INTO relationships (source_entity_type, source_entity_id, target_entity_type, target_entity_id, relationship_type, strength, description, first_observed, last_observed, case_id, source_reference, verification_status) VALUES
-- Cluster A: Logistics & Port Theft (Arjun Rao, Vikram, Samantha, Kavita, Leonidas)
('Person', 'DEMO-P001', 'Organization', 'ORG-0001', 'EMPLOYED_BY', 90, 'Arjun Rao operates as chief logistics broker for Orion Logistics.', '2025-06-01', '2026-09-20', 1, 'EV-0002', 'VERIFIED'),
('Person', 'DEMO-P001', 'Person', 'DEMO-P008', 'ASSOCIATED_WITH', 85, 'Direct operational coordination regarding Terminal 4 warehouse keys.', '2025-08-10', '2026-08-15', 1, 'EV-0022', 'VERIFIED'),
('Person', 'DEMO-P001', 'Person', 'DEMO-P003', 'COMMUNICATED_WITH', 78, 'Frequent coordination regarding transport trailer schedules.', '2025-09-01', '2026-09-12', 1, 'COMM-RECORD-01', 'VERIFIED'),
('Person', 'DEMO-P001', 'Person', 'DEMO-P006', 'CONTACTED', 72, 'Discussions regarding port gate clearance authorizations.', '2025-11-05', '2026-07-14', 1, 'COMM-RECORD-02', 'UNDER_REVIEW'),
('Person', 'DEMO-P001', 'Vehicle', 'VEH-0002', 'OWNS', 95, 'Registered owner of SUV seen at multiple depot sites.', '2024-01-01', '2026-09-25', 1, 'DMV-RECORD-01', 'VERIFIED'),
('Person', 'DEMO-P008', 'Vehicle', 'VEH-0005', 'OWNS', 80, 'Driver and registered registrant of transit van.', '2025-01-10', '2026-09-18', 1, 'EV-0003', 'VERIFIED'),
('Person', 'DEMO-P003', 'Organization', 'ORG-0003', 'EMPLOYED_BY', 88, 'Fleet director for Silverline Automotive.', '2024-05-15', '2026-08-20', 3, 'CORP-REG-03', 'VERIFIED'),
('Person', 'DEMO-P003', 'Person', 'DEMO-P007', 'ASSOCIATED_WITH', 82, 'Joint operations at Westside Auto Yard transshipment.', '2025-03-12', '2026-08-11', 3, 'EV-0006', 'VERIFIED'),
('Person', 'DEMO-P007', 'Vehicle', 'VEH-0006', 'OWNS', 92, 'Owner of sports coupe observed at Westside meetings.', '2024-10-01', '2026-09-22', 3, 'DMV-RECORD-06', 'VERIFIED'),
('Person', 'DEMO-P006', 'Organization', 'ORG-0001', 'ASSOCIATED_WITH', 65, 'Inspection officer handling Orion clearance manifests.', '2025-02-01', '2026-06-30', 1, 'EV-0002', 'UNDER_REVIEW'),

-- Bridge Entity: Leonidas Drake (DEMO-P017 connects Cluster A, Cluster B, Cluster C)
('Person', 'DEMO-P017', 'Person', 'DEMO-P001', 'COMMUNICATED_WITH', 82, 'Intermodal schedule synchronization and freight container routing.', '2025-04-10', '2026-09-15', 1, 'COMM-RECORD-03', 'VERIFIED'),
('Person', 'DEMO-P017', 'Person', 'DEMO-P002', 'ASSOCIATED_WITH', 79, 'Settlement accounts linked to intermodal terminal gate billing.', '2025-07-22', '2026-08-30', 2, 'EV-0004', 'VERIFIED'),
('Person', 'DEMO-P017', 'Person', 'DEMO-P010', 'TRAVELLED_WITH', 75, 'Shared transport to northern foundry railhead facility.', '2025-10-18', '2026-08-14', 15, 'INC-2026-0015', 'UNDER_REVIEW'),
('Person', 'DEMO-P017', 'Organization', 'ORG-0001', 'EMPLOYED_BY', 85, 'Senior intermodal operations consultant.', '2024-03-01', '2026-09-25', 1, 'CORP-REG-01', 'VERIFIED'),
('Person', 'DEMO-P017', 'Organization', 'ORG-0007', 'ASSOCIATED_WITH', 68, 'Receives consulting advisory fees from Kestrel Capital.', '2025-01-15', '2026-07-10', 2, 'EV-0023', 'UNDER_REVIEW'),

-- Cluster B: Financial Syndicate & Shell Fraud (Devika Nair, Ananya, Naveen, Victor Sterling)
('Person', 'DEMO-P002', 'Organization', 'ORG-0002', 'EMPLOYED_BY', 94, 'Technical director and founder of Apex Data Services.', '2024-02-01', '2026-09-20', 2, 'CORP-REG-02', 'VERIFIED'),
('Person', 'DEMO-P002', 'Person', 'DEMO-P005', 'ASSOCIATED_WITH', 86, 'Joint administration of corporate accounts and ledger reconciliations.', '2025-01-11', '2026-09-02', 2, 'EV-0004', 'VERIFIED'),
('Person', 'DEMO-P002', 'Person', 'DEMO-P009', 'CONTACTED', 81, 'Commissioned Naveen for custom API automation scripts.', '2025-11-20', '2026-08-25', 4, 'EV-0009', 'VERIFIED'),
('Person', 'DEMO-P002', 'Person', 'DEMO-P040', 'RELATED_TO', 60, 'Fiduciary advisory relation to Victor Sterling offshore trust.', '2024-11-01', '2026-07-15', 2, 'BANK-DOC-02', 'UNDER_REVIEW'),
('Person', 'DEMO-P005', 'Organization', 'ORG-0007', 'EMPLOYED_BY', 83, 'Senior accountant managing fund dispersal at Kestrel Capital.', '2024-08-15', '2026-08-19', 2, 'EV-0023', 'VERIFIED'),
('Person', 'DEMO-P005', 'Person', 'DEMO-P016', 'CONTACTED', 69, 'Coordinated document notarization for shell filings.', '2025-05-14', '2026-04-12', 7, 'EV-0013', 'VERIFIED'),
('Person', 'DEMO-P009', 'Person', 'DEMO-P018', 'COMMUNICATED_WITH', 84, 'Coordinated retail telecom SIM swapping attacks.', '2026-01-10', '2026-06-16', 12, 'EV-0018', 'VERIFIED'),
('Person', 'DEMO-P040', 'Organization', 'ORG-0007', 'OWNS', 95, 'Beneficial owner and principal shareholder of Kestrel Capital.', '2022-01-01', '2026-09-25', 2, 'CORP-REG-07', 'VERIFIED'),

-- Cluster C: Heavy Industry, Foundries & Equipment (Carlos Ortiz, Girish, Suresh, Marcus Brody)
('Person', 'DEMO-P010', 'Organization', 'ORG-0008', 'OWNS', 96, 'Owner and managing director of IronClad Heavy Metal Scrap.', '2020-04-01', '2026-09-25', 15, 'CORP-REG-08', 'VERIFIED'),
('Person', 'DEMO-P010', 'Person', 'DEMO-P024', 'EMPLOYED_BY', 82, 'Suresh operates heavy cranes at IronClad yard.', '2023-02-15', '2026-08-12', 15, 'PAYROLL-08', 'VERIFIED'),
('Person', 'DEMO-P010', 'Person', 'DEMO-P026', 'ASSOCIATED_WITH', 74, 'Marcus Brody performs mechanical modifications on heavy equipment.', '2025-04-19', '2026-08-10', 11, 'EV-0017', 'VERIFIED'),
('Person', 'DEMO-P020', 'Person', 'DEMO-P026', 'ASSOCIATED_WITH', 78, 'Brody modified transponders for Girish Verma heavy haulers.', '2025-06-01', '2026-06-05', 11, 'EV-0017', 'VERIFIED'),
('Person', 'DEMO-P020', 'Vehicle', 'VEH-0009', 'OWNS', 90, 'Owner of Scania heavy hauler.', '2023-09-10', '2026-08-20', 11, 'DMV-RECORD-09', 'VERIFIED'),

-- Cluster D: Maritime & Coastal Operations (Farhan, Patrick, Dmitri)
('Person', 'DEMO-P014', 'Organization', 'ORG-0004', 'EMPLOYED_BY', 89, 'Master of auxiliary bunker vessel for BlueWave Maritime.', '2023-01-10', '2026-09-10', 13, 'MARITIME-LIC-14', 'VERIFIED'),
('Person', 'DEMO-P014', 'Person', 'DEMO-P033', 'ASSOCIATED_WITH', 80, 'Joint navigation coordination during night fuel transfers.', '2025-05-15', '2026-07-02', 13, 'EV-0019', 'VERIFIED'),
('Person', 'DEMO-P014', 'Vehicle', 'VEH-0008', 'OWNS', 88, 'Operator of Damen tugboat.', '2023-06-01', '2026-09-15', 13, 'MARITIME-REG-08', 'VERIFIED'),
('Person', 'DEMO-P028', 'Organization', 'ORG-0001', 'EMPLOYED_BY', 77, 'Stevedore supervisor handling Orion Port Basin Quay containers.', '2024-04-01', '2026-08-30', 8, 'EV-0014', 'VERIFIED'),
('Person', 'DEMO-P028', 'Person', 'DEMO-P006', 'ASSOCIATED_WITH', 71, 'Dockside clearance coordination with Port Terminal Inspector.', '2025-02-14', '2026-07-28', 8, 'PORT-LOG-28', 'UNDER_REVIEW'),

-- Cluster E: Medical & Pharmaceutical Diversion (Harold Vance, Mira, Zackary)
('Person', 'DEMO-P015', 'Organization', 'ORG-0005', 'EMPLOYED_BY', 91, 'Chief clinical advisor for Novartis Pharma Distributors.', '2022-08-01', '2026-08-28', 6, 'EV-0012', 'VERIFIED'),
('Person', 'DEMO-P015', 'Person', 'DEMO-P012', 'CONTACTED', 76, 'Employed Zackary as private courier for cold chain packages.', '2025-10-01', '2026-04-02', 6, 'COMM-RECORD-05', 'VERIFIED'),
('Person', 'DEMO-P011', 'Organization', 'ORG-0005', 'EMPLOYED_BY', 80, 'Auditor who documented stock variance in cold chain lot B-9.', '2023-03-01', '2026-03-29', 6, 'INC-2026-0006', 'VERIFIED'),

-- Case Involvements
('Person', 'DEMO-P001', 'Case', 'CASE-2026-0001', 'INVOLVED_IN_CASE', 85, 'Named key subject in warehouse freight interception.', '2026-01-14', '2026-09-25', 1, 'CASE-FILE-01', 'VERIFIED'),
('Person', 'DEMO-P002', 'Case', 'CASE-2026-0002', 'INVOLVED_IN_CASE', 90, 'Primary subject of financial shell syndicate probe.', '2026-02-03', '2026-09-25', 2, 'CASE-FILE-02', 'VERIFIED'),
('Person', 'DEMO-P003', 'Case', 'CASE-2026-0003', 'INVOLVED_IN_CASE', 88, 'Transport coordinator in vehicle theft investigation.', '2026-02-19', '2026-09-25', 3, 'CASE-FILE-03', 'VERIFIED'),
('Person', 'DEMO-P009', 'Case', 'CASE-2026-0004', 'INVOLVED_IN_CASE', 79, 'Technical subject in cyber wire diversion investigation.', '2026-03-01', '2026-09-25', 4, 'CASE-FILE-04', 'VERIFIED'),
('Person', 'DEMO-P010', 'Case', 'CASE-2026-0015', 'INVOLVED_IN_CASE', 86, 'Foundry manager examined in weighbridge sensor probe.', '2026-08-11', '2026-09-25', 15, 'CASE-FILE-15', 'VERIFIED'),
('Person', 'DEMO-P017', 'Case', 'CASE-2026-0001', 'INVOLVED_IN_CASE', 82, 'Intermodal coordinator linked across freight manifests.', '2026-01-14', '2026-09-25', 1, 'CASE-FILE-01', 'VERIFIED'),
('Person', 'DEMO-P017', 'Case', 'CASE-2026-0002', 'INVOLVED_IN_CASE', 74, 'Linked to consultant invoices from Kestrel Capital.', '2026-02-03', '2026-09-25', 2, 'CASE-FILE-02', 'UNDER_REVIEW'),

-- Additional Interconnecting Edges
('Person', 'DEMO-P004', 'Organization', 'ORG-0001', 'EMPLOYED_BY', 80, 'Customs clearance agent processing Orion manifests.', '2024-06-01', '2026-08-10', 1, 'PORT-REC-04', 'VERIFIED'),
('Person', 'DEMO-P004', 'Person', 'DEMO-P001', 'ASSOCIATED_WITH', 77, 'Manifest stamping meetings at Docklands café.', '2025-05-10', '2026-07-22', 1, 'SURV-04', 'VERIFIED'),
('Person', 'DEMO-P012', 'Vehicle', 'VEH-0010', 'OWNS', 85, 'Dispatcher driving Sprinter van.', '2024-07-01', '2026-09-20', 5, 'DMV-RECORD-10', 'VERIFIED'),
('Person', 'DEMO-P013', 'Organization', 'ORG-0010', 'ASSOCIATED_WITH', 82, 'Frequent patron and event sponsor at The Obsidian Club.', '2024-01-01', '2026-09-24', 1, 'CLUB-LOG-13', 'VERIFIED'),
('Person', 'DEMO-P023', 'Organization', 'ORG-0010', 'EMPLOYED_BY', 90, 'Hospitality manager at Obsidian Club.', '2023-11-01', '2026-09-25', 1, 'CLUB-STAFF-23', 'VERIFIED'),
('Person', 'DEMO-P001', 'Organization', 'ORG-0010', 'ASSOCIATED_WITH', 74, 'Attended off-record dinners at Obsidian Club.', '2025-09-12', '2026-09-24', 1, 'INC-2026-0020', 'VERIFIED'),
('Person', 'DEMO-P002', 'Organization', 'ORG-0010', 'ASSOCIATED_WITH', 70, 'Observed at Obsidian Club private lounge with Victor Sterling.', '2025-10-14', '2026-09-24', 2, 'INC-2026-0020', 'UNDER_REVIEW'),
('Person', 'DEMO-P021', 'Organization', 'ORG-0007', 'ASSOCIATED_WITH', 88, 'Trust officer managing offshore nominee accounts.', '2023-08-01', '2026-08-15', 2, 'BANK-REC-21', 'VERIFIED'),
('Person', 'DEMO-P022', 'Organization', 'ORG-0006', 'EMPLOYED_BY', 83, 'CCTV technician servicing Bay 4 cameras.', '2024-02-01', '2026-01-18', 1, 'EV-0003', 'VERIFIED'),
('Person', 'DEMO-P031', 'Person', 'DEMO-P008', 'CONTACTED', 65, 'Locksmith called to configure backup keypad codes.', '2025-12-01', '2026-01-12', 1, 'PHONE-REC-31', 'UNDER_REVIEW'),
('Person', 'DEMO-P032', 'Person', 'DEMO-P004', 'ASSOCIATED_WITH', 72, 'Textile import clearance handled by customs agent.', '2025-08-20', '2026-05-19', 10, 'EV-0016', 'VERIFIED'),
('Person', 'DEMO-P035', 'Person', 'DEMO-P009', 'COMMUNICATED_WITH', 85, 'Darknet credentials transaction for compromised API portals.', '2026-01-05', '2026-03-02', 4, 'EV-0008', 'VERIFIED'),
('Person', 'DEMO-P036', 'Person', 'DEMO-P026', 'CONTACTED', 79, 'Sold handheld GPS signal dampeners used in excavator thefts.', '2025-11-10', '2026-06-01', 11, 'EV-0006', 'VERIFIED'),
('Person', 'DEMO-P037', 'Person', 'DEMO-P003', 'COMMUNICATED_WITH', 81, 'Long-haul truck dispatch coordination for auto shipments.', '2025-06-15', '2026-08-19', 3, 'TRUCK-LOG-37', 'VERIFIED'),
('Person', 'DEMO-P038', 'Organization', 'ORG-0002', 'ASSOCIATED_WITH', 73, 'Drafted administrative filings for Apex Data Services.', '2025-03-10', '2026-04-10', 7, 'EV-0013', 'VERIFIED'),
('Person', 'DEMO-P039', 'Person', 'DEMO-P005', 'COMMUNICATED_WITH', 68, 'Delivered corporate invoice PDF layout templates.', '2025-08-01', '2026-02-04', 2, 'EV-0004', 'VERIFIED'),
('Location', 'North Docklands Terminal 4', 'Case', 'CASE-2026-0001', 'LOCATED_AT', 90, 'Primary venue for freight interception incidents.', '2026-01-14', '2026-09-25', 1, 'INC-2026-0001', 'VERIFIED'),
('Location', 'Capital Plaza Suite 400', 'Case', 'CASE-2026-0002', 'LOCATED_AT', 88, 'Registered address for Apex Data Services.', '2026-02-03', '2026-09-25', 2, 'INC-2026-0002', 'VERIFIED'),
('Location', 'Westside Auto Yard', 'Case', 'CASE-2026-0003', 'LOCATED_AT', 85, 'Staging hub for transshipped luxury vehicles.', '2026-02-19', '2026-09-25', 3, 'INC-2026-0003', 'VERIFIED'),
('Incident', 'INC-2026-0001', 'Case', 'CASE-2026-0001', 'INVOLVED_IN_CASE', 95, 'Primary incident report triggering investigation.', '2026-01-14', '2026-01-14', 1, 'POLICE-REP-01', 'VERIFIED'),
('Incident', 'INC-2026-0002', 'Case', 'CASE-2026-0002', 'INVOLVED_IN_CASE', 95, 'Primary wire diversion trigger incident.', '2026-02-03', '2026-02-03', 2, 'POLICE-REP-02', 'VERIFIED'),
('Evidence', 'EV-0001', 'Case', 'CASE-2026-0001', 'INVOLVED_IN_CASE', 95, 'RFID tag recovered from Terminal Gate 4.', '2026-01-15', '2026-01-15', 1, 'CHAIN-OF-CUST-01', 'VERIFIED'),
('Evidence', 'EV-0004', 'Case', 'CASE-2026-0002', 'INVOLVED_IN_CASE', 95, 'Dummy invoice files recovered from escrow server.', '2026-02-05', '2026-02-05', 2, 'CHAIN-OF-CUST-04', 'VERIFIED'),
('Person', 'DEMO-P001', 'Person', 'DEMO-P017', 'ASSOCIATED_WITH', 84, 'Frequent joint appearances at intermodal transport conferences.', '2024-09-10', '2026-08-11', 1, 'CONF-LOG-01', 'VERIFIED'),
('Person', 'DEMO-P002', 'Person', 'DEMO-P017', 'COMMUNICATED_WITH', 76, 'Secure telephone exchanges regarding payment gateway routing.', '2025-11-04', '2026-09-01', 2, 'COMM-RECORD-07', 'VERIFIED'),
('Person', 'DEMO-P003', 'Person', 'DEMO-P017', 'TRAVELLED_WITH', 73, 'Joint travel to rail junction cargo depots.', '2025-08-12', '2026-07-19', 3, 'RAIL-TICKET-03', 'VERIFIED'),
('Person', 'DEMO-P010', 'Person', 'DEMO-P003', 'COMMUNICATED_WITH', 71, 'Discussions regarding scrap metal flatbed logistics.', '2025-07-01', '2026-08-05', 15, 'COMM-RECORD-08', 'UNDER_REVIEW'),
('Person', 'DEMO-P007', 'Person', 'DEMO-P026', 'ASSOCIATED_WITH', 80, 'Collaborated on vehicle diagnostic reset procedures.', '2025-04-10', '2026-08-22', 3, 'GARAGE-LOG-07', 'VERIFIED'),
('Person', 'DEMO-P019', 'Person', 'DEMO-P001', 'COMMUNICATED_WITH', 69, 'Priority routing queries for bonded airport freight.', '2025-10-15', '2026-06-18', 1, 'AIR-LOG-19', 'UNDER_REVIEW'),
('Person', 'DEMO-P027', 'Person', 'DEMO-P005', 'CONTACTED', 72, 'Assisted with daily over-the-counter deposit slips.', '2025-09-01', '2026-03-15', 2, 'BANK-DEP-27', 'VERIFIED');

-- 30 Synthetic Communication Records
INSERT INTO communications (source_entity, target_entity, communication_type, duration_minutes, case_id, context_notes) VALUES
('DEMO-P001 (Arjun Rao)', 'DEMO-P008 (Samantha Reed)', 'Call', 14, 1, 'Discussion regarding Terminal 4 security rotation times.'),
('DEMO-P001 (Arjun Rao)', 'DEMO-P003 (Vikram Malhotra)', 'Meeting', 45, 1, 'In-person meeting at Docklands Diner regarding lowboy trailer availability.'),
('DEMO-P001 (Arjun Rao)', 'DEMO-P017 (Leonidas Drake)', 'Call', 8, 1, 'Intermodal rail scheduling sync.'),
('DEMO-P002 (Devika Nair)', 'DEMO-P005 (Ananya Sharma)', 'Message', 0, 2, 'Encrypted message sharing batch payment hash.'),
('DEMO-P002 (Devika Nair)', 'DEMO-P009 (Naveen Patel)', 'Call', 22, 4, 'Technical requirements for API script execution.'),
('DEMO-P002 (Devika Nair)', 'DEMO-P017 (Leonidas Drake)', 'Call', 11, 2, 'Billing coordination for transit logistics fees.'),
('DEMO-P003 (Vikram Malhotra)', 'DEMO-P007 (Tariq Al-Mansoor)', 'Meeting', 60, 3, 'Dinner meeting at Westside Auto Yard office.'),
('DEMO-P003 (Vikram Malhotra)', 'DEMO-P037 (Brandon Walker)', 'Call', 16, 3, 'Highway route instructions avoiding inspection stations.'),
('DEMO-P007 (Tariq Al-Mansoor)', 'DEMO-P026 (Marcus Brody)', 'Call', 19, 3, 'Discussion of electronic immobilizer bypass modules.'),
('DEMO-P008 (Samantha Reed)', 'DEMO-P031 (Lucas Bennett)', 'Call', 6, 1, 'Inquiry regarding keycard lock cylinder replacement.'),
('DEMO-P009 (Naveen Patel)', 'DEMO-P018 (Aiden Campbell)', 'Message', 0, 12, 'Transmitted list of 6 phone numbers for SIM reissue.'),
('DEMO-P009 (Naveen Patel)', 'DEMO-P035 (Felix Ramos)', 'Email', 0, 4, 'Encrypted file delivery with access keys.'),
('DEMO-P010 (Carlos Ortiz)', 'DEMO-P024 (Suresh Nair)', 'Call', 5, 15, 'Instructions on rail gantry crane operation hours.'),
('DEMO-P010 (Carlos Ortiz)', 'DEMO-P017 (Leonidas Drake)', 'Meeting', 30, 15, 'Inspection of scrap metal siding tracks.'),
('DEMO-P014 (Farhan Qureshi)', 'DEMO-P033 (Patrick O’Connor)', 'Call', 25, 13, 'Tugboat position alignment outside territorial boundary.'),
('DEMO-P015 (Harold Vance)', 'DEMO-P012 (Zackary Stone)', 'Meeting', 20, 6, 'Handover of temperature-monitored courier case.'),
('DEMO-P015 (Harold Vance)', 'DEMO-P011 (Mira Kulkarni)', 'Email', 0, 6, 'Formal reply regarding pharmaceutical audit discrepancy.'),
('DEMO-P016 (Sunita Reddy)', 'DEMO-P005 (Ananya Sharma)', 'Call', 12, 7, 'Confirmation of notarized power of attorney documents.'),
('DEMO-P017 (Leonidas Drake)', 'DEMO-P010 (Carlos Ortiz)', 'Call', 15, 15, 'Weighbridge maintenance timing coordination.'),
('DEMO-P020 (Girish Verma)', 'DEMO-P026 (Marcus Brody)', 'Call', 9, 11, 'Confirmation of GPS module removal on excavator.'),
('DEMO-P021 (Elena Rostova)', 'DEMO-P040 (Victor Sterling)', 'Call', 35, 2, 'Quarterly report on fiduciary asset holding structure.'),
('DEMO-P023 (Chloe Dubois)', 'DEMO-P001 (Arjun Rao)', 'Message', 0, 1, 'VIP dining room reservation confirmation at Obsidian Club.'),
('DEMO-P023 (Chloe Dubois)', 'DEMO-P013 (Priya Deshmukh)', 'Message', 0, 1, 'Private gallery tasting event invitation.'),
('DEMO-P025 (Amara Okafor)', 'DEMO-P002 (Devika Nair)', 'Email', 0, 2, 'Internal compliance audit notification memo.'),
('DEMO-P027 (Geeta Joshi)', 'DEMO-P005 (Ananya Sharma)', 'Call', 4, 2, 'Deposit slip verification query.'),
('DEMO-P028 (Dmitri Volkov)', 'DEMO-P006 (Kavita Menon)', 'Call', 18, 8, 'Container inspection bay schedule for evening crane shift.'),
('DEMO-P032 (Zoya Khan)', 'DEMO-P004 (Rohan Mehta)', 'Call', 14, 10, 'Customs clearance release stamp status inquiry.'),
('DEMO-P036 (Divya Sundaram)', 'DEMO-P026 (Marcus Brody)', 'Message', 0, 11, 'Delivery confirmation for electronic signal dampener.'),
('DEMO-P038 (Kareem Mansoor)', 'DEMO-P002 (Devika Nair)', 'Meeting', 40, 7, 'Corporate minutes signing for Apex Data Services.'),
('DEMO-P039 (Trisha Roy)', 'DEMO-P005 (Ananya Sharma)', 'Email', 0, 2, 'Revised graphics files for vendor billing forms.');

-- 20 Synthetic Intelligence Alerts
INSERT INTO alerts (alert_id, alert_level, case_id, case_number, reason, supporting_records_count, analytical_level, status, assigned_investigator) VALUES
('ALT-2026-0001', 'HIGH', 1, 'CASE-2026-0001', 'High Network Centrality: Subject DEMO-P017 exhibits betweenness score bridging three separate logistics clusters.', 6, 'Betweenness Centrality Metric', 'NEW', 'Marcus Holloway'),
('ALT-2026-0002', 'CRITICAL', 2, 'CASE-2026-0002', 'Cross-Case Entity Overlap: Apex Data Services linked to escrow accounts investigated in CASE-2026-0004.', 4, 'Multi-Case Link Discovery', 'UNDER_REVIEW', 'Sophia Sterling'),
('ALT-2026-0003', 'HIGH', 3, 'CASE-2026-0003', 'Sudden Surge in Vehicle Re-registration Requests across Westside Auto Yard nodes.', 8, 'Frequency Anomaly Detection', 'NEW', 'Marcus Holloway'),
('ALT-2026-0004', 'MEDIUM', 4, 'CASE-2026-0004', 'Repeated IP Subnet Overlap detected between cyber gateway hits and corporate VPN accounts.', 5, 'Network Telemetry Correlator', 'REVIEWED', 'Sophia Sterling'),
('ALT-2026-0005', 'HIGH', 1, 'CASE-2026-0001', 'Unusual Nocturnal Meeting Detected at The Obsidian Social Club involving key logistics subjects.', 3, 'Temporal Co-occurrence Alert', 'NEW', 'Marcus Holloway'),
('ALT-2026-0006', 'MEDIUM', 6, 'CASE-2026-0006', 'Audit Discrepancy: Hospital supply reports 1,200 missing doses while courier activity spiked.', 4, 'Inventory-Communication Correlator', 'UNDER_REVIEW', 'Marcus Holloway'),
('ALT-2026-0007', 'LOW', 7, 'CASE-2026-0007', 'Shared Notary Signature: 3 corporate registration filings exhibit identical notary stamps.', 3, 'Document Entity Clustering', 'REVIEWED', 'Sophia Sterling'),
('ALT-2026-0008', 'CRITICAL', 8, 'CASE-2026-0008', 'Quay 7 Container Manifest Discrepancy: Physical tare weight deviates by 1,400 kg from manifest.', 2, 'Physical Sensor Variance', 'NEW', 'Marcus Holloway'),
('ALT-2026-0009', 'MEDIUM', 9, 'CASE-2026-0009', 'Trading Volume Spikes 840% ahead of public acquisition filing.', 5, 'Financial Time-Series Anomaly', 'REVIEWED', 'Sophia Sterling'),
('ALT-2026-0010', 'LOW', 10, 'CASE-2026-0010', 'Customs Classification Code Switch on incoming textile air freight pallets.', 2, 'Trade Data Rule Trigger', 'DISMISSED', 'Marcus Holloway'),
('ALT-2026-0011', 'HIGH', 11, 'CASE-2026-0011', 'Simultaneous GPS Signal Drop on two heavy equipment transponders within 500m radius.', 3, 'Geographic Sensor Blackout', 'NEW', 'Marcus Holloway'),
('ALT-2026-0012', 'CRITICAL', 12, 'CASE-2026-0012', '6 Unauthorized SIM Card Swaps executed within 40 minutes at retail terminal.', 6, 'High Velocity Pattern Match', 'NEW', 'Sophia Sterling'),
('ALT-2026-0013', 'MEDIUM', 13, 'CASE-2026-0013', 'Vessel AIS Transponder turned off for 240 minutes in coastal fuel anchorage sector.', 2, 'AIS Sensor Gap Analysis', 'UNDER_REVIEW', 'Marcus Holloway'),
('ALT-2026-0014', 'LOW', 14, 'CASE-2026-0014', 'Grant Application matches previously denied environmental cleanup documentation.', 3, 'Textual Similarity Match', 'REVIEWED', 'Sophia Sterling'),
('ALT-2026-0015', 'HIGH', 15, 'CASE-2026-0015', 'Weighbridge Calibration Variance: 6% offset consistently recorded for inbound metal scrap.', 4, 'Sensor Calibration Anomaly', 'NEW', 'Marcus Holloway'),
('ALT-2026-0016', 'MEDIUM', 1, 'CASE-2026-0001', 'New Relationship Discovered: Shared phone contact between DEMO-P008 and DEMO-P031.', 2, 'Communication Triangulation', 'NEW', 'Marcus Holloway'),
('ALT-2026-0017', 'HIGH', 2, 'CASE-2026-0002', 'High-Risk Fund Transfer: 850k transfer executed to offshore trust managed by DEMO-P021.', 3, 'Fiduciary Risk Indicator', 'UNDER_REVIEW', 'Sophia Sterling'),
('ALT-2026-0018', 'LOW', 3, 'CASE-2026-0003', 'Vehicle Movement Pattern: Repeating midnight transit between Westside yard and rail junction.', 7, 'Trajectory Clustering', 'REVIEWED', 'Marcus Holloway'),
('ALT-2026-0019', 'MEDIUM', 4, 'CASE-2026-0004', 'Darknet Credential Hash Match: Recovered API credentials match data leaked on hacker forum.', 3, 'External Threat Match', 'NEW', 'Sophia Sterling'),
('ALT-2026-0020', 'HIGH', 1, 'CASE-2026-0001', 'Potential Network Bridge: Leonidas Drake linked to both commercial freight and financial clearing.', 5, 'Centrality Bridge Indicator', 'NEW', 'Marcus Holloway');

-- Initial AI Relationship Suggestions
INSERT INTO ai_suggestions (title, source_entity_type, source_entity_id, source_entity_name, target_entity_type, target_entity_id, target_entity_name, intermediate_entity, reason, supporting_signals, analytical_score, status) VALUES
('Potential Link: Arjun Rao ↔ Devika Nair via Leonidas Drake', 'Person', 'DEMO-P001', 'Arjun Rao', 'Person', 'DEMO-P002', 'Devika Nair', 'DEMO-P017 (Leonidas Drake)', 'Both entities maintain high-strength verified relationships with Leonidas Drake across independent logistics and settlement frameworks.', 'Shared intermediary entity, repeated teleconference timestamps, co-attendance at Obsidian Social Club', 84, 'PENDING'),
('Potential Link: Vikram Malhotra ↔ Carlos Ortiz via Heavy Transport Yard', 'Person', 'DEMO-P003', 'Vikram Malhotra', 'Person', 'DEMO-P010', 'Carlos Ortiz', 'ORG-0008 (IronClad Metal)', 'Vikram Malhotra freight fleet vehicles logged multiple deliveries at Carlos Ortiz foundry yard despite lacking formal transport contract.', '4 shared vehicle sightings, overlapping cellular tower pings, shared mechanic associate Marcus Brody', 76, 'PENDING'),
('Potential Link: Harold Vance ↔ Devika Nair via Medical Escrow Account', 'Person', 'DEMO-P015', 'Dr. Harold Vance', 'Person', 'DEMO-P002', 'Devika Nair', 'ORG-0002 (Apex Data Services)', 'Medical warehouse software licensed from Apex Data Services with direct escrow fees redirected to consulting pool.', 'Software licensing ledger, overlapping bank routing prefix, single point of digital contact', 71, 'PENDING'),
('Potential Link: Tariq Al-Mansoor ↔ Girish Verma via Equipment Transport', 'Person', 'DEMO-P007', 'Tariq Al-Mansoor', 'Person', 'DEMO-P020', 'Girish Verma', 'DEMO-P026 (Marcus Brody)', 'Both subjects utilized Marcus Brody for electronic diagnostic and GPS transponder suppression within a 2-week window.', 'Shared technician, identical GPS jamming hardware recovered, concurrent yard sightings', 82, 'ACCEPTED');

-- Initial Audit Logs
INSERT INTO audit_logs (username, action, entity_type, entity_id, ip_address, details) VALUES
('admin', 'LOGIN', 'USER', 'admin', '127.0.0.1', 'Administrator logged into system.'),
('investigator', 'LOGIN', 'USER', 'investigator', '127.0.0.1', 'Investigator session initiated.'),
('investigator', 'CREATE_CASE', 'CASE', 'CASE-2026-0001', '127.0.0.1', 'Created case CASE-2026-0001: Warehouse High-Value Cargo Theft.'),
('investigator', 'ADD_EVIDENCE', 'EVIDENCE', 'EV-0001', '127.0.0.1', 'Logged physical evidence item EV-0001 into custody.'),
('analyst', 'RUN_AI_ANALYSIS', 'CASE', 'CASE-2026-0001', '127.0.0.1', 'Executed network centrality and community detection analysis.'),
('analyst', 'ACCEPT_AI_SUGGESTION', 'SUGGESTION', 'SUG-0004', '127.0.0.1', 'Investigator accepted AI suggested relationship Tariq Al-Mansoor ↔ Girish Verma.');
