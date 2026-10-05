package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.*;
import com.intelligence.criminalnetwork.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Service
public class DataInitializerService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializerService.class);

    @Autowired private UserRepository userRepository;
    @Autowired private CaseRepository caseRepository;
    @Autowired private PersonRepository personRepository;
    @Autowired private RelationshipRepository relationshipRepository;
    @Autowired private EvidenceRepository evidenceRepository;
    @Autowired private EvidenceCustodyRepository evidenceCustodyRepository;
    @Autowired private IncidentRepository incidentRepository;
    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private CommunicationRepository communicationRepository;
    @Autowired private IntelligenceAlertRepository alertRepository;
    @Autowired private AiSuggestionRepository suggestionRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private LocationRepository locationRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private CaseActivityRepository caseActivityRepository;
    @Autowired private InvestigationNoteRepository noteRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private DataSourceRepository dataSourceRepository;
    @Autowired private PublicDataRecordRepository publicDataRecordRepository;
    @Autowired private ScraperLogRepository scraperLogRepository;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedCases();
        seedPersons();
        seedOrganizations();
        seedVehicles();
        seedIncidents();
        seedLocations();
        seedEvidence();
        seedRelationships();
        seedCommunications();
        seedAlerts();
        seedNotes();
        seedCaseActivities();
        seedNotifications();
        seedAuditLogs();
        seedDataSources();
        seedPublicDataRecords();
        seedScraperLogs();
        logger.info("Investigation Platform Data Initialization Completed: Real database records loaded across all modules including Live Public Data Engine.");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.save(new User("admin", "admin@demo.local", passwordEncoder.encode("Password@123"), "Elena Vance", "BADGE-ADM-01", "Special Investigations Directorate", "ROLE_ADMIN"));
        userRepository.save(new User("investigator", "investigator@demo.local", passwordEncoder.encode("Password@123"), "Marcus Holloway", "BADGE-INV-44", "Organized Crime Division", "ROLE_INVESTIGATOR"));
        userRepository.save(new User("analyst", "analyst@demo.local", passwordEncoder.encode("Password@123"), "Sophia Sterling", "BADGE-ANA-19", "Intelligence & Network Analytics", "ROLE_ANALYST"));
        userRepository.save(new User("viewer", "viewer@demo.local", passwordEncoder.encode("Password@123"), "David Chen", "BADGE-VIE-08", "Auditing & Oversight Branch", "ROLE_VIEWER"));
    }

    private void seedCases() {
        if (caseRepository.count() > 0) return;

        createCase("CASE-2026-0001", "Warehouse High-Value Cargo Theft", "Commercial Theft", "Marcus Holloway", "HIGH", "ACTIVE", LocalDate.of(2026, 1, 14), "North Docklands Terminal 4", "Alpha Tactical", "Organized freight interception involving coordinated logistics manipulation and cloned RFID manifests.", "Key suspect observed coordinating multiple transport trucks.");
        createCase("CASE-2026-0002", "Fraudulent Shell Invoice Syndicate", "Financial Fraud", "Sophia Sterling", "CRITICAL", "UNDER_INVESTIGATION", LocalDate.of(2026, 2, 3), "Downtown Financial District", "Financial Forensics", "Circulation of layered multi-jurisdictional shell invoices routed through simulated supply vendors.", "High network centrality detected around Orion Logistics Ltd.");
        createCase("CASE-2026-0003", "Luxury Vehicle Transshipment Network", "Vehicle Theft", "Marcus Holloway", "HIGH", "ACTIVE", LocalDate.of(2026, 2, 19), "Westside Auto Yard & Rail", "Metro Taskforce", "Systematic interception of luxury export vehicles with altered chassis identifiers and fake carrier manifests.", "Cross-references suspect DEMO-P003 and DEMO-P007.");
        createCase("CASE-2026-0004", "Automated Cyber Wire Diversion", "Cyber Fraud", "Sophia Sterling", "CRITICAL", "ACTIVE", LocalDate.of(2026, 3, 1), "Virtual Banking Gateway / Node 12", "Cyber Intelligence", "Spear-phishing and API token abuse redirecting corporate vendor settlements into encrypted liquidity pools.", "Repeated IP overlaps with Apex Data Services.");
        createCase("CASE-2026-0005", "Organized High-End Electronics Theft", "Property Theft", "Marcus Holloway", "MEDIUM", "REVIEW", LocalDate.of(2026, 3, 12), "Harbor View Industrial Park", "Special Ops B", "Sequential depot burglaries exploiting scheduled security guard rotation lapses and signal jammers.", "Recovered 40 stolen server modules at storage unit 88.");
        createCase("CASE-2026-0006", "Pharmaceutical Supply Diversion", "Contraband Diversion", "Marcus Holloway", "HIGH", "UNDER_INVESTIGATION", LocalDate.of(2026, 3, 28), "Midtown Medical Warehouse", "Public Health Taskforce", "Diversion of regulated medical inventory through falsified hospital requisition orders.", "Linked to medical freight operator DEMO-P015.");
        createCase("CASE-2026-0007", "Identity Laundering Syndicate", "Identity Fraud", "Sophia Sterling", "MEDIUM", "ACTIVE", LocalDate.of(2026, 4, 10), "Metro Civil Documentation Office", "ID Fraud Squad", "Fabrication of synthetic corporate directors used to open non-resident business accounts.", "Associated with 8 registered shell corporations.");
        createCase("CASE-2026-0008", "Port Container Smuggling Ring", "Cross-Border Smuggling", "Marcus Holloway", "CRITICAL", "ACTIVE", LocalDate.of(2026, 4, 22), "International Port Basin Quay 7", "Maritime Interdiction", "Smuggling contraband concealed in modified industrial refrigeration compressors across shipping routes.", "Major connectivity bridge between Maritime Logistics and North Hub.");
        createCase("CASE-2026-0009", "Securities Front Trading Network", "Securities Fraud", "Sophia Sterling", "MEDIUM", "ON_HOLD", LocalDate.of(2026, 5, 4), "Capital Plaza Tower 2", "Financial Forensics", "Pre-arranged option volume spikes prior to corporate acquisition announcements across disposable trading entities.", "Awaiting broker audit response.");
        createCase("CASE-2026-0010", "Counterfeit Luxury Goods Transit", "IP & Trademark Theft", "Marcus Holloway", "LOW", "REVIEW", LocalDate.of(2026, 5, 18), "Eastside Cargo Depot", "Customs Enforcement", "Bulk import of high-grade imitation goods disguised as raw textile shipments.", "Two distribution warehouses raided.");
        createCase("CASE-2026-0011", "Industrial Heavy Equipment Theft", "Equipment Theft", "Marcus Holloway", "MEDIUM", "ACTIVE", LocalDate.of(2026, 6, 2), "Suburban Bypass Construction Yard", "Commercial Ops", "Midnight removal of tracked hydraulic excavators and generators using falsified lease return documentation.", "GPS tracking deactivated via Faraday shielding.");
        createCase("CASE-2026-0012", "Crypto ATM SIM-Swapping Syndicate", "Telecom Cybercrime", "Sophia Sterling", "HIGH", "ACTIVE", LocalDate.of(2026, 6, 15), "Citywide Telecom Retail Outlets", "Cyber Forensics", "Bribed mobile carrier retail staff executing unauthorized SIM swaps to drain multi-sig wallet authorization codes.", "Cross-case telecom records overlap with CASE-2026-0004.");
        createCase("CASE-2026-0013", "Maritime Fuel Bunkering Scheme", "Resource Fraud", "Marcus Holloway", "MEDIUM", "UNDER_INVESTIGATION", LocalDate.of(2026, 7, 1), "Southern Offshore Anchorage", "Maritime Unit", "Unreported offshore fuel transfers from automated barges into uninspected coastal transport vessels.", "Analysis of AIS telemetry records underway.");
        createCase("CASE-2026-0014", "Government Grant Falsification Syndicate", "Public Procurement Fraud", "Sophia Sterling", "LOW", "CLOSED", LocalDate.of(2026, 7, 20), "Civic Administration Annex", "Oversight Integrity Unit", "Submitting fraudulent environmental cleanup invoices for phantom land parcels.", "Investigation finalized. Recovered institutional funds.");
        createCase("CASE-2026-0015", "Precious Metal Refinery Skimming", "Commercial Embezzlement", "Marcus Holloway", "HIGH", "NEW", LocalDate.of(2026, 8, 11), "Northern Industrial Foundry", "Special Crimes Alpha", "Systematic calibration manipulation on scrap metal weigh scales diverting platinum-group slag.", "Discrepancy audit flagged 4.2kg variance.");
    }

    private void createCase(String num, String title, String type, String lead, String priority, String status, LocalDate date, String loc, String team, String desc, String notes) {
        CaseEntity c = new CaseEntity();
        c.setCaseNumber(num);
        c.setTitle(title);
        c.setCaseType(type);
        c.setLeadInvestigator(lead);
        c.setPriority(priority);
        c.setStatus(status);
        c.setIncidentDate(date);
        c.setIncidentLocation(loc);
        c.setAssignedTeam(team);
        c.setDescription(desc);
        c.setNotes(notes);
        caseRepository.save(c);
    }

    private void seedPersons() {
        if (personRepository.count() > 0) return;

        createPerson("DEMO-P001", "Arjun Rao", "The Architect", 42, "Male", "North Docklands", "SUSPECT", "Logistics Broker", "HIGH", "Coordinates shipping lane schedules; frequent contact across commercial transport hubs.");
        createPerson("DEMO-P002", "Devika Nair", "Cipher", 31, "Female", "Downtown Financial District", "SUSPECT", "Financial Systems Consultant", "CRITICAL", "Expert in digital payment routing and automated escrow layers.");
        createPerson("DEMO-P003", "Vikram Malhotra", "V-Six", 38, "Male", "Westside Industrial Zone", "SUSPECT", "Freight Forwarder", "HIGH", "Registered owner of commercial fleet transport vehicles.");
        createPerson("DEMO-P004", "Rohan Mehta", "Ghost Operator", 35, "Male", "Harbor View", "PERSON_OF_INTEREST", "Customs Clearance Agent", "MEDIUM", "Provides documentation stamps for incoming manifests.");
        createPerson("DEMO-P005", "Ananya Sharma", "The Broker", 29, "Female", "Capital Plaza", "PERSON_OF_INTEREST", "Accountant", "MEDIUM", "Manages corporate ledger books for several shell entities.");
        createPerson("DEMO-P006", "Kavita Menon", "Vanguard", 45, "Female", "Central Maritime Hub", "SUSPECT", "Port Terminal Inspector", "HIGH", "Authorizes container exit gates during off-peak night shifts.");
        createPerson("DEMO-P007", "Tariq Al-Mansoor", "Falcon", 39, "Male", "Westside Auto Yard", "SUSPECT", "Automotive Import Specialist", "HIGH", "Oversees high-end vehicle repair and transshipment operations.");
        createPerson("DEMO-P008", "Samantha Reed", "Silver", 34, "Female", "East End Quarters", "ASSOCIATE", "Warehouse Manager", "MEDIUM", "Keyholder for North Docklands Terminal 4 secure bay.");
        createPerson("DEMO-P009", "Naveen Patel", "Spark", 27, "Male", "Silicon Corridor", "PERSON_OF_INTEREST", "Software Developer", "HIGH", "Contractor hired to develop custom SIM-swap tooling scripts.");
        createPerson("DEMO-P010", "Carlos Ortiz", "El Martillo", 48, "Male", "South River Basin", "SUSPECT", "Scrap Metal Wholesaler", "HIGH", "Operates foundry storage yard with furnace capabilities.");
        createPerson("DEMO-P011", "Mira Kulkarni", "Oracle", 36, "Female", "Midtown Central", "WITNESS", "Hospital Supply Auditor", "LOW", "Whistleblower who reported missing pharmaceutical lots.");
        createPerson("DEMO-P012", "Zackary Stone", "The Courier", 32, "Male", "City Transit Hub", "ASSOCIATE", "Private Dispatcher", "MEDIUM", "Transports encrypted drives and paper bills of lading.");
        createPerson("DEMO-P013", "Priya Deshmukh", "Duchess", 41, "Female", "Uptown Heights", "SUSPECT", "Art & Antique Dealer", "HIGH", "Provides appraisal certificates for high-value transshipments.");
        createPerson("DEMO-P014", "Farhan Qureshi", "Anchor", 50, "Male", "Coastal Anchorage", "PERSON_OF_INTEREST", "Barge Captain", "MEDIUM", "Commands coastal tugs and auxiliary fuel transport vessels.");
        createPerson("DEMO-P015", "Dr. Harold Vance", "Chemist", 56, "Male", "Midtown Medical Hub", "SUSPECT", "Clinical Researcher", "HIGH", "Authorizes restricted chemical inventory requisitions.");
        createPerson("DEMO-P016", "Sunita Reddy", "Ledger", 37, "Female", "Civic District", "ASSOCIATE", "Notary Public", "LOW", "Notarized documentation for contested shell incorporations.");
        createPerson("DEMO-P017", "Leonidas Drake", "The Bridge", 44, "Male", "Central Intermodal Terminal", "SUSPECT", "Intermodal Coordinator", "CRITICAL", "Identified as a critical network bridge connecting three independent transport clusters.");
        createPerson("DEMO-P018", "Aiden Campbell", "Tech-Zero", 26, "Male", "Cyber Hub Annex", "PERSON_OF_INTEREST", "Telecom Counter Rep", "MEDIUM", "Facilitated illicit customer SIM card reassignment requests.");
        createPerson("DEMO-P019", "Fatima Zahra", "Spectre", 33, "Female", "Airport Cargo Zone", "ASSOCIATE", "Air Freight Dispatcher", "LOW", "Assists priority cargo routing through regional air hubs.");
        createPerson("DEMO-P020", "Girish Verma", "G-Force", 40, "Male", "Northern Highway Bypass", "SUSPECT", "Heavy Hauler Owner", "MEDIUM", "Provides lowboy trailers for unregistered heavy equipment moving.");
        createPerson("DEMO-P021", "Elena Rostova", "Baroness", 47, "Female", "Offshore Banking Center", "SUSPECT", "Trust Officer", "HIGH", "Controls nominee accounts across offshore fiduciary structures.");
        createPerson("DEMO-P022", "Ravi Shankar", "Lens", 30, "Male", "Harbor View", "WITNESS", "CCTV Maintenance Tech", "LOW", "Provided technical evidence regarding camera blindspots in Bay 4.");
        createPerson("DEMO-P023", "Chloe Dubois", "Siren", 32, "Female", "Westside Promenade", "ASSOCIATE", "VIP Hospitality Coordinator", "LOW", "Arranged off-the-record meetings at private club venues.");
        createPerson("DEMO-P024", "Suresh Nair", "Ironclad", 46, "Male", "Foundry Row", "PERSON_OF_INTEREST", "Industrial Crane Operator", "MEDIUM", "Assisted in night loading of heavy containers at the rail head.");
        createPerson("DEMO-P025", "Amara Okafor", "Nexus", 35, "Female", "Financial District", "PERSON_OF_INTEREST", "Compliance Analyst", "LOW", "Flagged multiple suspicious transactions before dismissal.");
        createPerson("DEMO-P026", "Marcus Brody", "The Mechanic", 43, "Male", "Industrial Park West", "ASSOCIATE", "Heavy Machinery Technician", "MEDIUM", "Specialist in disabling OEM GPS tracking transponders.");
        createPerson("DEMO-P027", "Geeta Joshi", "Penny", 28, "Female", "Midtown Commercial", "ASSOCIATE", "Retail Bank Teller", "LOW", "Assisted with high-frequency cash deposits below reporting threshold.");
        createPerson("DEMO-P028", "Dmitri Volkov", "Hammer", 52, "Male", "Port Basin Pier 9", "SUSPECT", "Stevedore Supervisor", "HIGH", "Oversees dock container movement and unmanifested pallet storage.");
        createPerson("DEMO-P029", "Maya Lin", "Pixel", 25, "Female", "Metro Tech Center", "CLEARED", "Junior QA Engineer", "LOW", "Questioned regarding firmware repositories; cleared of wrongdoing.");
        createPerson("DEMO-P030", "Kiran Bedi", "Eagle Eye", 39, "Male", "Downtown Traffic Control", "WITNESS", "Traffic Camera Dispatcher", "LOW", "Preserved automated license plate recognition camera records.");
        createPerson("DEMO-P031", "Lucas Bennett", "Keyhole", 37, "Male", "Northside Warehouse", "PERSON_OF_INTEREST", "Locksmith & Access Specialist", "MEDIUM", "Dispatched to duplicate master keycards for secure perimeter doors.");
        createPerson("DEMO-P032", "Zoya Khan", "Silk", 34, "Female", "Fashion District Annex", "PERSON_OF_INTEREST", "Boutique Wholesaler", "MEDIUM", "Received shipping pallets containing counterfeit designer textiles.");
        createPerson("DEMO-P033", "Patrick O’Connor", "Paddy", 49, "Male", "Coastal Fuel Jetty", "ASSOCIATE", "Tugboat Pilot", "MEDIUM", "Navigated auxiliary fuel vessels during nocturnal rendezvous.");
        createPerson("DEMO-P034", "Nalini Swaminathan", "Archivist", 53, "Female", "State Records Archive", "WITNESS", "Municipal Records Keeper", "LOW", "Verified historical property deed records in grant audit case.");
        createPerson("DEMO-P035", "Felix Ramos", "Shadow", 31, "Male", "South Industrial Zone", "SUSPECT", "Darknet Marketplace Vendor", "HIGH", "Brokered digital login credentials and cloned gate passes.");
        createPerson("DEMO-P036", "Divya Sundaram", "Echo", 29, "Female", "Central Telemetry Lab", "ASSOCIATE", "Radio Frequency Technician", "MEDIUM", "Sold portable handheld GPS signal dampeners.");
        createPerson("DEMO-P037", "Brandon Walker", "Diesel", 41, "Male", "Truck Stop Oasis 12", "ASSOCIATE", "Long-Haul Interstate Driver", "MEDIUM", "Transported sealed refrigerated containers without bill of lading.");
        createPerson("DEMO-P038", "Kareem Mansoor", "The Scribe", 38, "Male", "Commercial Square", "PERSON_OF_INTEREST", "Corporate Secretary", "MEDIUM", "Drafted shareholder meeting minutes for inactive holding entities.");
        createPerson("DEMO-P039", "Trisha Roy", "Nova", 28, "Female", "Suburban Co-working Space", "PERSON_OF_INTEREST", "Graphic Designer", "LOW", "Created corporate logos and invoice templates for fictitious vendors.");
        createPerson("DEMO-P040", "Victor Sterling", "Old Guard", 62, "Male", "Hilltop Manor", "SUSPECT", "Retired Board Member", "HIGH", "Beneficiary of offshore family trust tied to Orion Holdings.");
    }

    private void createPerson(String pid, String name, String alias, int age, String gender, String loc, String status, String occ, String risk, String notes) {
        Person p = new Person();
        p.setPersonId(pid);
        p.setName(name);
        p.setAlias(alias);
        p.setAge(age);
        p.setGender(gender);
        p.setPrimaryLocation(loc);
        p.setStatus(status);
        p.setOccupation(occ);
        p.setRiskLevel(risk);
        p.setNotes(notes);
        personRepository.save(p);
    }

    private void seedOrganizations() {
        if (organizationRepository.count() > 0) return;

        createOrg("ORG-0001", "Orion Logistics International", "Logistics", "North Docklands Terminal 4", "Major freight handling and intermodal carrier firm under review.");
        createOrg("ORG-0002", "Apex Data Services Ltd", "Shell Company", "Capital Plaza Suite 400", "IT advisory firm routing consulting fees without observable operations.");
        createOrg("ORG-0003", "Silverline Automotive Exports", "Commercial", "Westside Industrial Park", "Used auto dealership and overseas shipping consignment depot.");
        createOrg("ORG-0004", "BlueWave Maritime Bunkering", "Logistics", "Coastal Anchorage Berth 12", "Offshore marine fuel bunkering and vessel refueling services.");
        createOrg("ORG-0005", "Novartis Pharma Distributors (Demo)", "Commercial", "Midtown Medical Hub", "Wholesale pharmaceutical distributor operating regional temperature-controlled hubs.");
        createOrg("ORG-0006", "Vanguard Security Systems", "Commercial", "Harbor View Blvd 101", "Contractor providing access control and guard monitoring services.");
        createOrg("ORG-0007", "Kestrel Capital Holdings", "Financial", "Downtown Financial Tower", "Private investment vehicle holding equity stakes across transit entities.");
        createOrg("ORG-0008", "IronClad Heavy Metal Scrap", "Commercial", "South River Industrial Row", "Large industrial metal sorting and reclamation facility.");
        createOrg("ORG-0009", "AeroSpeed Express Cargo", "Logistics", "Airport Cargo Zone 3", "Regional air express cargo handler and bonded customs warehouse.");
        createOrg("ORG-0010", "The Obsidian Social Club", "Club", "Westside Promenade", "Private member dining club frequented by logistics executives.");
    }

    private void createOrg(String oid, String name, String type, String loc, String desc) {
        Organization o = new Organization();
        o.setOrganizationId(oid);
        o.setName(name);
        o.setOrgType(type);
        o.setLocation(loc);
        o.setDescription(desc);
        organizationRepository.save(o);
    }

    private void seedVehicles() {
        if (vehicleRepository.count() > 0) return;

        createVeh("VEH-0001", "TN-00-DEMO-001", "Heavy Truck", "Volvo", "FH16 Semi-Trailer", "Midnight Blue", "Orion Logistics", 1L, 1L, "North Docklands Terminal 4");
        createVeh("VEH-0002", "TN-00-DEMO-002", "SUV", "Land Rover", "Defender 110", "Matte Black", "Arjun Rao", 1L, 1L, "Harbor View Drive");
        createVeh("VEH-0003", "TN-00-DEMO-003", "Sedan", "Audi", "A8 L", "Silver", "Devika Nair", 2L, 2L, "Financial District Parking");
        createVeh("VEH-0004", "TN-00-DEMO-004", "Flatbed Hauler", "Mercedes-Benz", "Actros 2645", "White", "Vikram Malhotra", 3L, 3L, "Westside Auto Yard");
        createVeh("VEH-0005", "TN-00-DEMO-005", "Van", "Ford", "Transit 350 High Roof", "Grey", "Samantha Reed", 8L, 1L, "North Docklands Gate 2");
        createVeh("VEH-0006", "TN-00-DEMO-006", "Sports Coupe", "Porsche", "911 Carrera", "Guards Red", "Tariq Al-Mansoor", 7L, 3L, "Westside Promenade");
        createVeh("VEH-0007", "TN-00-DEMO-007", "Refrigerated Truck", "Isuzu", "Giga Cool Carrier", "White", "Novartis Pharma Distributors", 15L, 6L, "Midtown Medical Hub");
        createVeh("VEH-0008", "TN-00-DEMO-008", "Tugboat", "Damen", "Stan Tug 1606", "Yellow/Blue", "Farhan Qureshi", 14L, 13L, "Southern Offshore Anchorage");
        createVeh("VEH-0009", "TN-00-DEMO-009", "Excavator Transporter", "Scania", "R580 Heavy Hauler", "Orange", "Girish Verma", 20L, 11L, "Northern Highway Bypass");
        createVeh("VEH-0010", "TN-00-DEMO-010", "Cargo Van", "Mercedes-Benz", "Sprinter 516", "Dark Grey", "Zackary Stone", 12L, 5L, "City Transit Hub");
        createVeh("VEH-0011", "TN-00-DEMO-011", "SUV", "BMW", "X7 M60i", "Alpine White", "Victor Sterling", 40L, 2L, "Hilltop Manor Lane");
        createVeh("VEH-0012", "TN-00-DEMO-012", "Utility Van", "Renault", "Master WorkVan", "Navy Blue", "Ravi Shankar", 22L, 1L, "Bay 4 Maintenance Bay");
        createVeh("VEH-0013", "TN-00-DEMO-013", "Motorcycle", "Ducati", "Multistrada V4", "Red", "Naveen Patel", 9L, 4L, "Silicon Corridor Garage");
        createVeh("VEH-0014", "TN-00-DEMO-014", "Flatbed Truck", "Tata", "Prima 4028.S", "Green", "Carlos Ortiz", 10L, 15L, "Foundry Row Yard");
        createVeh("VEH-0015", "TN-00-DEMO-015", "Sedan", "Tesla", "Model S Plaid", "Deep Blue", "Ananya Sharma", 5L, 2L, "Capital Plaza P1");
    }

    private void createVeh(String vid, String reg, String type, String brand, String model, String col, String owner, Long ownerId, Long caseId, String loc) {
        Vehicle v = new Vehicle();
        v.setVehicleId(vid);
        v.setRegistrationNumber(reg);
        v.setVehicleType(type);
        v.setBrand(brand);
        v.setModel(model);
        v.setColor(col);
        v.setOwnerName(owner);
        v.setOwnerPersonId(ownerId);
        v.setCaseId(caseId);
        v.setLastKnownLocation(loc);
        vehicleRepository.save(v);
    }

    private void seedIncidents() {
        if (incidentRepository.count() > 0) return;

        createInc("INC-2026-0001", "Freight Manifest Tampering", LocalDate.of(2026, 1, 14), LocalTime.of(2, 15), "North Docklands Terminal 4", new BigDecimal("13.092400"), new BigDecimal("80.298000"), "Physical security seal breached and replacement digital RFID tag attached to outbound container.", 1L, "CASE-2026-0001", "VERIFIED");
        createInc("INC-2026-0002", "Unauthorized Escrow Redirect", LocalDate.of(2026, 2, 3), LocalTime.of(16, 42), "Financial District Core", new BigDecimal("13.081100"), new BigDecimal("80.282000"), "Batch clearing instruction altered at gateway server triggering wire transfer to non-resident bank.", 2L, "CASE-2026-0002", "INVESTIGATING");
        createInc("INC-2026-0003", "GPS Jammer Deployment", LocalDate.of(2026, 2, 19), LocalTime.of(23, 30), "Westside Auto Yard Gate B", new BigDecimal("13.075000"), new BigDecimal("80.245000"), "High-power frequency jammer activated as two luxury export vehicles departed the compound.", 3L, "CASE-2026-0003", "VERIFIED");
        createInc("INC-2026-0004", "Corporate API Key Compromise", LocalDate.of(2026, 3, 1), LocalTime.of(4, 10), "Silicon Corridor Tech Park", new BigDecimal("13.064000"), new BigDecimal("80.231000"), "Compromised admin credentials used to dump client payout hashes onto foreign staging bucket.", 4L, "CASE-2026-0004", "VERIFIED");
        createInc("INC-2026-0005", "Electronics Warehouse Breach", LocalDate.of(2026, 3, 12), LocalTime.of(1, 50), "Harbor View Industrial Park", new BigDecimal("13.089000"), new BigDecimal("80.289000"), "Rear emergency exit unlatched from interior; 40 enterprise compute blades loaded into cargo van.", 5L, "CASE-2026-0005", "RESOLVED");
        createInc("INC-2026-0006", "Restricted Chemical Stock Discrepancy", LocalDate.of(2026, 3, 28), LocalTime.of(11, 0), "Midtown Medical Warehouse", new BigDecimal("13.078000"), new BigDecimal("80.260000"), "Internal inventory review revealed 1,200 vials missing from cold chain lot B-9.", 6L, "CASE-2026-0006", "INVESTIGATING");
        createInc("INC-2026-0007", "Fictitious Corporate Registry Filing", LocalDate.of(2026, 4, 10), LocalTime.of(14, 20), "Civic Administration Annex", new BigDecimal("13.084000"), new BigDecimal("80.275000"), "Fraudulent director identities used to register 3 limited companies with forged lease agreements.", 7L, "CASE-2026-0007", "INVESTIGATING");
        createInc("INC-2026-0008", "Refrigerated Container Modification", LocalDate.of(2026, 4, 22), LocalTime.of(3, 15), "International Port Basin Pier 7", new BigDecimal("13.098000"), new BigDecimal("80.301000"), "Dual false wall discovered inside ISO container cooling unit housing unregistered cargo.", 8L, "CASE-2026-0008", "VERIFIED");
        createInc("INC-2026-0009", "Abnormal Call Option Surge", LocalDate.of(2026, 5, 4), LocalTime.of(9, 45), "Capital Plaza Exchange", new BigDecimal("13.080500"), new BigDecimal("80.283500"), "Pre-market order book flooded with out-of-the-money call contracts from offshore shell IP.", 9L, "CASE-2026-0009", "REVIEW");
        createInc("INC-2026-0010", "Customs Declaration Mismatch", LocalDate.of(2026, 5, 18), LocalTime.of(17, 0), "Eastside Cargo Depot", new BigDecimal("13.086000"), new BigDecimal("80.292000"), "Shipment manifested as polyester yarn found to contain boxed designer accessories.", 10L, "CASE-2026-0010", "RESOLVED");
        createInc("INC-2026-0011", "Excavator Tracking Deactivation", LocalDate.of(2026, 6, 2), LocalTime.of(22, 5), "Highway 4 Construction Site", new BigDecimal("13.050000"), new BigDecimal("80.210000"), "Telematics transponder sheared off Caterpillar 330 excavator and dropped into concrete footer.", 11L, "CASE-2026-0011", "INVESTIGATING");
        createInc("INC-2026-0012", "Unauthorized SIM Replacement Raid", LocalDate.of(2026, 6, 15), LocalTime.of(19, 40), "Metro Telecom Flagship Store", new BigDecimal("13.072000"), new BigDecimal("80.252000"), "Employee override passcode used to issue 6 replacement SIM cards without customer identity verification.", 12L, "CASE-2026-0012", "VERIFIED");
        createInc("INC-2026-0013", "Offshore Marine Valve Tampering", LocalDate.of(2026, 7, 1), LocalTime.of(2, 40), "Coastal Anchorage Berth 12", new BigDecimal("13.110000"), new BigDecimal("80.315000"), "Fuel transfer line connected between licensed supply barge and unflagged coastal vessel.", 13L, "CASE-2026-0013", "INVESTIGATING");
        createInc("INC-2026-0014", "Ineligible Grant Disbursement", LocalDate.of(2026, 7, 20), LocalTime.of(10, 15), "Civic Council Office", new BigDecimal("13.083500"), new BigDecimal("80.276000"), "State environmental restoration subsidy approved based on computer-generated soil test reports.", 14L, "CASE-2026-0014", "RESOLVED");
        createInc("INC-2026-0015", "Weighbridge Sensor Calibration Shift", LocalDate.of(2026, 8, 11), LocalTime.of(8, 30), "Northern Foundry Gate 1", new BigDecimal("13.102000"), new BigDecimal("80.265000"), "Strain gauge load cells modified with resistor clamp, under-reporting gross incoming truck weight by 6%.", 15L, "CASE-2026-0015", "INVESTIGATING");
        createInc("INC-2026-0016", "Midnight Shunting Activity", LocalDate.of(2026, 8, 25), LocalTime.of(1, 10), "Westside Rail Yard Siding 3", new BigDecimal("13.076000"), new BigDecimal("80.241000"), "Locomotive shunted 4 unlogged rail boxcars to private siding without train dispatcher clearance.", 3L, "CASE-2026-0003", "INVESTIGATING");
        createInc("INC-2026-0017", "Phishing Portal Infrastructure Spinup", LocalDate.of(2026, 9, 2), LocalTime.of(13, 0), "Central Internet Exchange Point", new BigDecimal("13.067000"), new BigDecimal("80.240000"), "DNS redirection rules established mirroring regional credit union corporate portal.", 4L, "CASE-2026-0004", "RESOLVED");
        createInc("INC-2026-0018", "Encrypted Hard Drive Drop", LocalDate.of(2026, 9, 10), LocalTime.of(18, 15), "City Center Transit Lockers", new BigDecimal("13.081800"), new BigDecimal("80.274000"), "Courier deposited briefcase with hardware security tokens and handwritten transport routes.", 5L, "CASE-2026-0005", "VERIFIED");
        createInc("INC-2026-0019", "Hospital Cold-Storage Alarm Bypass", LocalDate.of(2026, 9, 18), LocalTime.of(21, 50), "Metro General Hospital Annex", new BigDecimal("13.079500"), new BigDecimal("80.258000"), "Thermal sensor wiring bridged with 10k resistor to prevent low-temp alarm during removal of vials.", 6L, "CASE-2026-0006", "INVESTIGATING");
        createInc("INC-2026-0020", "Secret VIP Meeting Gathering", LocalDate.of(2026, 9, 24), LocalTime.of(20, 30), "The Obsidian Social Club", new BigDecimal("13.074500"), new BigDecimal("80.246500"), "Unscheduled meeting observed between logistics directors, financial consultants, and port officials.", 1L, "CASE-2026-0001", "REVIEW");
    }

    private void createInc(String iid, String type, LocalDate d, LocalTime t, String loc, BigDecimal lat, BigDecimal lng, String desc, Long cid, String cnum, String stat) {
        Incident inc = new Incident();
        inc.setIncidentId(iid);
        inc.setIncidentType(type);
        inc.setIncidentDate(d);
        inc.setIncidentTime(t);
        inc.setLocation(loc);
        inc.setLatitude(lat);
        inc.setLongitude(lng);
        inc.setDescription(desc);
        inc.setCaseId(cid);
        inc.setCaseNumber(cnum);
        inc.setStatus(stat);
        incidentRepository.save(inc);
    }

    private void seedEvidence() {
        if (evidenceRepository.count() > 0) return;

        createEv("EV-0001", 1L, "CASE-2026-0001", "Physical Item", "Cloned high-frequency RFID gate transponder tag", "Marcus Holloway", LocalDate.of(2026, 1, 15), "Docklands Terminal Gate 4", "VAULT-SEC-01/BIN-14", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "VERIFIED", "Matches serial signature found in suspect vehicle VEH-0001.");
        createEv("EV-0002", 1L, "CASE-2026-0001", "Digital File", "Container manifest PDF with altered weights and forged seal hashes", "Sophia Sterling", LocalDate.of(2026, 1, 16), "Port EDI Server", "SAN-EVID-04/DIR-CASE1", "a58b29f0e1c073a697669d67963cf3e8e9dc9d9369f417539f9b5a034989e5a1", "VERIFIED", "Digital certificate issued under name of Orion Logistics Ltd.");
        createEv("EV-0003", 1L, "CASE-2026-0001", "Video", "Security surveillance footage showing night cargo movement at Bay 4", "Marcus Holloway", LocalDate.of(2026, 1, 17), "Terminal Bay 4 CCTV", "NAS-MEDIA/CAM04-NIGHT.mp4", "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", "VERIFIED", "Shows VEH-0005 arriving at 02:10 AM.");
        createEv("EV-0004", 2L, "CASE-2026-0002", "Document", "Invoices billed from Apex Data Services totaling 4.2M demo credits", "Sophia Sterling", LocalDate.of(2026, 2, 5), "Commercial Bank Forensics", "VAULT-DOC-02/FILE-89", "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", "VERIFIED", "Identified identical bank routing account across 14 dummy vendors.");
        createEv("EV-0005", 2L, "CASE-2026-0002", "Digital File", "Encrypted memory dump from compromised escrow server", "Sophia Sterling", LocalDate.of(2026, 2, 8), "Escrow Gateway Host 1", "SAN-CYBER/GATEWAY-RAM.raw", "7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", "UNDER_REVIEW", "Extracted API authorization tokens matching user Devika Nair.");
        createEv("EV-0006", 3L, "CASE-2026-0003", "Physical Item", "Handheld 16-band radio frequency jammer", "Marcus Holloway", LocalDate.of(2026, 2, 20), "Perimeter ditch at Westside Auto Yard", "VAULT-ELEC-01/SHELF-3", "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f", "VERIFIED", "Fingerprint partial matches suspect Tariq Al-Mansoor.");
        createEv("EV-0007", 3L, "CASE-2026-0003", "Vehicle Record", "Forged European transport transit declaration documents", "Marcus Holloway", LocalDate.of(2026, 2, 23), "Vehicle Glovebox VEH-0004", "VAULT-DOC-01/FILE-112", "1b2cf535f27731c974343645a3985ec6e1c451a9e52f1067d169f765e11b72aa", "COLLECTED", "Chassis numbers altered using laser etching.");
        createEv("EV-0008", 4L, "CASE-2026-0004", "Digital File", "Reverse proxy access logs recording API session hijacking", "Sophia Sterling", LocalDate.of(2026, 3, 3), "Cloudflare Audit Export", "SAN-CYBER/LOG-APEX.csv", "2c624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972", "VERIFIED", "Source IP traces to rented VPN node in Frankfurt.");
        createEv("EV-0009", 4L, "CASE-2026-0004", "Communication Record", "Exported encrypted chat log between user dev_spark and cipher_99", "Sophia Sterling", LocalDate.of(2026, 3, 5), "Recovered Mobile Device", "SAN-INTEL/CHAT-EXPORT.json", "4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2", "UNDER_REVIEW", "Discusses fee distribution percentage for cyber gateway operation.");
        createEv("EV-0010", 5L, "CASE-2026-0005", "Physical Item", "Recovered enterprise blade servers (4 units)", "Marcus Holloway", LocalDate.of(2026, 3, 14), "Lockup unit 88, Harbor View", "WAREHOUSE-EVID/PALLET-09", "11f6ad8ec52a2984abaafd7c3b516503785c2072454ce161315e97d6204c4d51", "VERIFIED", "Serial numbers match stolen shipment from Harbor View Industrial.");
        createEv("EV-0011", 5L, "CASE-2026-0005", "Image", "High-resolution still of cargo van departing industrial park", "Marcus Holloway", LocalDate.of(2026, 3, 15), "City Traffic Cam 42", "NAS-MEDIA/CAM42-VAN.jpg", "6a992d5529f459a44fee58c7332f618834ca10322b1f77d2d0e417a531cd49f4", "COLLECTED", "Shows partial license plate TN-00-DEMO-010.");
        createEv("EV-0012", 6L, "CASE-2026-0006", "Document", "Falsified hospital requisition slip for clinical trial vials", "Marcus Holloway", LocalDate.of(2026, 3, 30), "Hospital Supply Receiving", "VAULT-DOC-03/FILE-402", "8012b35048f07015f6ad4e84b802a450410ff3725f543666d9263a23a3f5a153", "VERIFIED", "Authorized by signature stamp of Dr. Harold Vance.");
        createEv("EV-0013", 7L, "CASE-2026-0007", "Document", "Notarized articles of incorporation for offshore subsidiary", "Sophia Sterling", LocalDate.of(2026, 4, 12), "State Corporate Registry", "VAULT-LEGAL/INC-8812", "e5a1a1e4c026b484557924fecc37b420042d326f634b3f81e3a6c2306788a1be", "VERIFIED", "Notary seal corresponds to Sunita Reddy.");
        createEv("EV-0014", 8L, "CASE-2026-0008", "Physical Item", "Custom welded aluminum cooling compartment partition", "Marcus Holloway", LocalDate.of(2026, 4, 24), "Quay 7 Cold Storage Yard", "CONTAINER-YARD/SEC-7A", "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb", "VERIFIED", "Built by industrial welding team at Foundry Row.");
        createEv("EV-0015", 9L, "CASE-2026-0009", "Transaction Record", "Brokerage trade execution timestamps for front-run options", "Sophia Sterling", LocalDate.of(2026, 5, 6), "National Securities Clearing", "SAN-FIN/TRADE-RUN-99.csv", "b079965a3979eaec6c58ef6e61284d7d91df130a4be3cae537d9953d619ad4ee", "UNDER_REVIEW", "Demonstrates 99.4% timing correlation with board memo release.");
        createEv("EV-0016", 10L, "CASE-2026-0010", "Physical Item", "Seized shipping carton with 140 counterfeit designer handbags", "Marcus Holloway", LocalDate.of(2026, 5, 20), "Eastside Cargo Depot Bay 1", "VAULT-SEIZED/CARTON-01", "ccc83543e323a0fd7ab22460320a5043a670ca10709b5c31937e99fef9ae3b63", "COLLECTED", "Labelled as raw textile samples addressed to Zoya Khan.");
        createEv("EV-0017", 11L, "CASE-2026-0011", "Physical Item", "Severed GPS antenna assembly with magnetic mount", "Marcus Holloway", LocalDate.of(2026, 6, 4), "Highway 4 site drainage culvert", "VAULT-ELEC-02/TAG-77", "581179d675b31f99c27945c7198bb6c559868779b5c00e1227181c002241cfb2", "VERIFIED", "Tool marks match specialized crimping pliers found in VEH-0009.");
        createEv("EV-0018", 12L, "CASE-2026-0012", "Digital File", "Carrier retail CRM access logs for unauthorized SIM re-burns", "Sophia Sterling", LocalDate.of(2026, 6, 18), "Carrier Security Center", "SAN-CYBER/SIM-AUDIT.json", "6f9c4f932822a9446dfdfd43c220f866ce6ac9654101e4a3623d6a9e88383e7f", "VERIFIED", "User ID corresponds to Aiden Campbell.");
        createEv("EV-0019", 13L, "CASE-2026-0013", "Location Record", "Satellite AIS transponder track history with 4-hour blackout zone", "Marcus Holloway", LocalDate.of(2026, 7, 3), "Coastal Coast Guard Radar Base", "SAN-MARITIME/AIS-TRACK.gpx", "140c878939c148cf4910cfab5ef878cb1bf00742f3844f2ffbc071d0532247ba", "VERIFIED", "Vessel stopped within 50 meters of unflagged barge.");
        createEv("EV-0020", 14L, "CASE-2026-0014", "Document", "Falsified laboratory soil remediation certificates", "Sophia Sterling", LocalDate.of(2026, 7, 22), "Civic Council Archives", "VAULT-DOC-04/FILE-GRANT", "d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f", "VERIFIED", "Report referenced defunct testing laboratory.");
        createEv("EV-0021", 15L, "CASE-2026-0015", "Physical Item", "Weighbridge shunt resistor circuit box with toggle switch", "Marcus Holloway", LocalDate.of(2026, 8, 13), "Northern Foundry weigh cabin", "VAULT-ELEC-03/SHUNT-01", "81b7a7f8cb7bb2b7c6c496150244670081d6f54c935b6028b030ee77c8e030a5", "VERIFIED", "Decreased recorded weight by calibrated offset of 6%.");
        createEv("EV-0022", 1L, "CASE-2026-0001", "Audio", "Voicemail recording discussing delivery schedule at Terminal 4", "Marcus Holloway", LocalDate.of(2026, 1, 20), "Recorded wiretap consent line", "AUDIO-ARCHIVE/VM-2026-01.wav", "2b624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972", "UNDER_REVIEW", "Caller voice matches Arjun Rao.");
        createEv("EV-0023", 2L, "CASE-2026-0002", "Transaction Record", "Wire transfer receipt to Kestrel Capital Holdings", "Sophia Sterling", LocalDate.of(2026, 2, 12), "State Central Bank", "VAULT-DOC-FIN/WT-88192", "3c624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972", "VERIFIED", "Signed by authorized proxy Ananya Sharma.");
        createEv("EV-0024", 3L, "CASE-2026-0003", "Document", "Bill of lading for containerized automotive components", "Marcus Holloway", LocalDate.of(2026, 2, 28), "Westside Rail Freight Office", "VAULT-DOC-01/BL-4421", "4c624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972", "VERIFIED", "Consignee marked as Silverline Automotive Exports.");
        createEv("EV-0025", 4L, "CASE-2026-0004", "Digital File", "Decrypted private key for liquidity pool management contract", "Sophia Sterling", LocalDate.of(2026, 3, 10), "Seized Hardware Ledger", "SAN-CYBER/KEY-DUMP.sec", "5c624232cdd221771294dfbb310aca000a0df6ec9b5feb983f1489885b835972", "UNDER_REVIEW", "Associated with address receiving diverted customer settlements.");

        // Also add custody timeline events for EV-0001 and EV-0002
        createCustody(1L, "Officer Ryan Miller", "Evidence Custodian Dave Vance", "Initial recovery at scene and secure bagging", "VAULT-SEC-01", "Barcode tag 00192 applied.");
        createCustody(1L, "Evidence Custodian Dave Vance", "Forensic Analyst Dr. Lee", "Submitted for digital radio frequency frequency spectrum cloning analysis", "RF-FORENSICS-LAB", "Integrity seal verified intact.");
        createCustody(1L, "Forensic Analyst Dr. Lee", "Evidence Custodian Dave Vance", "Analysis completed; returned to permanent storage locker", "VAULT-SEC-01/BIN-14", "Report filed under EV-0001.");
    }

    private void createEv(String eid, Long cid, String cnum, String type, String desc, String colBy, LocalDate d, String src, String stRef, String hash, String stat, String notes) {
        Evidence e = new Evidence();
        e.setEvidenceId(eid);
        e.setCaseId(cid);
        e.setCaseNumber(cnum);
        e.setEvidenceType(type);
        e.setDescription(desc);
        e.setCollectedBy(colBy);
        e.setCollectedDate(d);
        e.setSource(src);
        e.setStorageReference(stRef);
        e.setIntegrityHash(hash);
        e.setStatus(stat);
        e.setNotes(notes);
        evidenceRepository.save(e);
    }

    private void createCustody(Long evId, String by, String to, String reason, String loc, String notes) {
        EvidenceCustody ec = new EvidenceCustody();
        ec.setEvidenceId(evId);
        ec.setTransferredBy(by);
        ec.setReceivedBy(to);
        ec.setReason(reason);
        ec.setLocation(loc);
        ec.setNotes(notes);
        evidenceCustodyRepository.save(ec);
    }

    private void seedRelationships() {
        if (relationshipRepository.count() > 0) return;

        // Cluster A: Logistics
        createRel("Person", "DEMO-P001", "Organization", "ORG-0001", "EMPLOYED_BY", 90, "Arjun Rao operates as chief logistics broker for Orion Logistics.", LocalDate.of(2025, 6, 1), LocalDate.of(2026, 9, 20), 1L, "EV-0002", "VERIFIED");
        createRel("Person", "DEMO-P001", "Person", "DEMO-P008", "ASSOCIATED_WITH", 85, "Direct operational coordination regarding Terminal 4 warehouse keys.", LocalDate.of(2025, 8, 10), LocalDate.of(2026, 8, 15), 1L, "EV-0022", "VERIFIED");
        createRel("Person", "DEMO-P001", "Person", "DEMO-P003", "COMMUNICATED_WITH", 78, "Frequent coordination regarding transport trailer schedules.", LocalDate.of(2025, 9, 1), LocalDate.of(2026, 9, 12), 1L, "COMM-RECORD-01", "VERIFIED");
        createRel("Person", "DEMO-P001", "Person", "DEMO-P006", "CONTACTED", 72, "Discussions regarding port gate clearance authorizations.", LocalDate.of(2025, 11, 5), LocalDate.of(2026, 7, 14), 1L, "COMM-RECORD-02", "UNDER_REVIEW");
        createRel("Person", "DEMO-P001", "Vehicle", "VEH-0002", "OWNS", 95, "Registered owner of SUV seen at multiple depot sites.", LocalDate.of(2024, 1, 1), LocalDate.of(2026, 9, 25), 1L, "DMV-RECORD-01", "VERIFIED");
        createRel("Person", "DEMO-P008", "Vehicle", "VEH-0005", "OWNS", 80, "Driver and registered registrant of transit van.", LocalDate.of(2025, 1, 10), LocalDate.of(2026, 9, 18), 1L, "EV-0003", "VERIFIED");
        createRel("Person", "DEMO-P003", "Organization", "ORG-0003", "EMPLOYED_BY", 88, "Fleet director for Silverline Automotive.", LocalDate.of(2024, 5, 15), LocalDate.of(2026, 8, 20), 3L, "CORP-REG-03", "VERIFIED");
        createRel("Person", "DEMO-P003", "Person", "DEMO-P007", "ASSOCIATED_WITH", 82, "Joint operations at Westside Auto Yard transshipment.", LocalDate.of(2025, 3, 12), LocalDate.of(2026, 8, 11), 3L, "EV-0006", "VERIFIED");
        createRel("Person", "DEMO-P007", "Vehicle", "VEH-0006", "OWNS", 92, "Owner of sports coupe observed at Westside meetings.", LocalDate.of(2024, 10, 1), LocalDate.of(2026, 9, 22), 3L, "DMV-RECORD-06", "VERIFIED");
        createRel("Person", "DEMO-P006", "Organization", "ORG-0001", "ASSOCIATED_WITH", 65, "Inspection officer handling Orion clearance manifests.", LocalDate.of(2025, 2, 1), LocalDate.of(2026, 6, 30), 1L, "EV-0002", "UNDER_REVIEW");

        // Bridge Node: Leonidas Drake DEMO-P017
        createRel("Person", "DEMO-P017", "Person", "DEMO-P001", "COMMUNICATED_WITH", 82, "Intermodal schedule synchronization and freight container routing.", LocalDate.of(2025, 4, 10), LocalDate.of(2026, 9, 15), 1L, "COMM-RECORD-03", "VERIFIED");
        createRel("Person", "DEMO-P017", "Person", "DEMO-P002", "ASSOCIATED_WITH", 79, "Settlement accounts linked to intermodal terminal gate billing.", LocalDate.of(2025, 7, 22), LocalDate.of(2026, 8, 30), 2L, "EV-0004", "VERIFIED");
        createRel("Person", "DEMO-P017", "Person", "DEMO-P010", "TRAVELLED_WITH", 75, "Shared transport to northern foundry railhead facility.", LocalDate.of(2025, 10, 18), LocalDate.of(2026, 8, 14), 15L, "INC-2026-0015", "UNDER_REVIEW");
        createRel("Person", "DEMO-P017", "Organization", "ORG-0001", "EMPLOYED_BY", 85, "Senior intermodal operations consultant.", LocalDate.of(2024, 3, 1), LocalDate.of(2026, 9, 25), 1L, "CORP-REG-01", "VERIFIED");
        createRel("Person", "DEMO-P017", "Organization", "ORG-0007", "ASSOCIATED_WITH", 68, "Receives consulting advisory fees from Kestrel Capital.", LocalDate.of(2025, 1, 15), LocalDate.of(2026, 7, 10), 2L, "EV-0023", "UNDER_REVIEW");

        // Cluster B: Financial Syndicate & Cyber
        createRel("Person", "DEMO-P002", "Organization", "ORG-0002", "EMPLOYED_BY", 94, "Technical director and founder of Apex Data Services.", LocalDate.of(2024, 2, 1), LocalDate.of(2026, 9, 20), 2L, "CORP-REG-02", "VERIFIED");
        createRel("Person", "DEMO-P002", "Person", "DEMO-P005", "ASSOCIATED_WITH", 86, "Joint administration of corporate accounts and ledger reconciliations.", LocalDate.of(2025, 1, 11), LocalDate.of(2026, 9, 2), 2L, "EV-0004", "VERIFIED");
        createRel("Person", "DEMO-P002", "Person", "DEMO-P009", "CONTACTED", 81, "Commissioned Naveen for custom API automation scripts.", LocalDate.of(2025, 11, 20), LocalDate.of(2026, 8, 25), 4L, "EV-0009", "VERIFIED");
        createRel("Person", "DEMO-P002", "Person", "DEMO-P040", "RELATED_TO", 60, "Fiduciary advisory relation to Victor Sterling offshore trust.", LocalDate.of(2024, 11, 1), LocalDate.of(2026, 7, 15), 2L, "BANK-DOC-02", "UNDER_REVIEW");
        createRel("Person", "DEMO-P005", "Organization", "ORG-0007", "EMPLOYED_BY", 83, "Senior accountant managing fund dispersal at Kestrel Capital.", LocalDate.of(2024, 8, 15), LocalDate.of(2026, 8, 19), 2L, "EV-0023", "VERIFIED");
        createRel("Person", "DEMO-P005", "Person", "DEMO-P016", "CONTACTED", 69, "Coordinated document notarization for shell filings.", LocalDate.of(2025, 5, 14), LocalDate.of(2026, 4, 12), 7L, "EV-0013", "VERIFIED");
        createRel("Person", "DEMO-P009", "Person", "DEMO-P018", "COMMUNICATED_WITH", 84, "Coordinated retail telecom SIM swapping attacks.", LocalDate.of(2026, 1, 10), LocalDate.of(2026, 6, 16), 12L, "EV-0018", "VERIFIED");
        createRel("Person", "DEMO-P040", "Organization", "ORG-0007", "OWNS", 95, "Beneficial owner and principal shareholder of Kestrel Capital.", LocalDate.of(2022, 1, 1), LocalDate.of(2026, 9, 25), 2L, "CORP-REG-07", "VERIFIED");

        // Cluster C: Heavy Industry
        createRel("Person", "DEMO-P010", "Organization", "ORG-0008", "OWNS", 96, "Owner and managing director of IronClad Heavy Metal Scrap.", LocalDate.of(2020, 4, 1), LocalDate.of(2026, 9, 25), 15L, "CORP-REG-08", "VERIFIED");
        createRel("Person", "DEMO-P010", "Person", "DEMO-P024", "EMPLOYED_BY", 82, "Suresh operates heavy cranes at IronClad yard.", LocalDate.of(2023, 2, 15), LocalDate.of(2026, 8, 12), 15L, "PAYROLL-08", "VERIFIED");
        createRel("Person", "DEMO-P010", "Person", "DEMO-P026", "ASSOCIATED_WITH", 74, "Marcus Brody performs mechanical modifications on heavy equipment.", LocalDate.of(2025, 4, 19), LocalDate.of(2026, 8, 10), 11L, "EV-0017", "VERIFIED");
        createRel("Person", "DEMO-P020", "Person", "DEMO-P026", "ASSOCIATED_WITH", 78, "Brody modified transponders for Girish Verma heavy haulers.", LocalDate.of(2025, 6, 1), LocalDate.of(2026, 6, 5), 11L, "EV-0017", "VERIFIED");
        createRel("Person", "DEMO-P020", "Vehicle", "VEH-0009", "OWNS", 90, "Owner of Scania heavy hauler.", LocalDate.of(2023, 9, 10), LocalDate.of(2026, 8, 20), 11L, "DMV-RECORD-09", "VERIFIED");

        // Cluster D: Maritime
        createRel("Person", "DEMO-P014", "Organization", "ORG-0004", "EMPLOYED_BY", 89, "Master of auxiliary bunker vessel for BlueWave Maritime.", LocalDate.of(2023, 1, 10), LocalDate.of(2026, 9, 10), 13L, "MARITIME-LIC-14", "VERIFIED");
        createRel("Person", "DEMO-P014", "Person", "DEMO-P033", "ASSOCIATED_WITH", 80, "Joint navigation coordination during night fuel transfers.", LocalDate.of(2025, 5, 15), LocalDate.of(2026, 7, 2), 13L, "EV-0019", "VERIFIED");
        createRel("Person", "DEMO-P014", "Vehicle", "VEH-0008", "OWNS", 88, "Operator of Damen tugboat.", LocalDate.of(2023, 6, 1), LocalDate.of(2026, 9, 15), 13L, "MARITIME-REG-08", "VERIFIED");
        createRel("Person", "DEMO-P028", "Organization", "ORG-0001", "EMPLOYED_BY", 77, "Stevedore supervisor handling Orion Port Basin Quay containers.", LocalDate.of(2024, 4, 1), LocalDate.of(2026, 8, 30), 8L, "EV-0014", "VERIFIED");
        createRel("Person", "DEMO-P028", "Person", "DEMO-P006", "ASSOCIATED_WITH", 71, "Dockside clearance coordination with Port Terminal Inspector.", LocalDate.of(2025, 2, 14), LocalDate.of(2026, 7, 28), 8L, "PORT-LOG-28", "UNDER_REVIEW");

        // Cluster E: Medical & Pharma
        createRel("Person", "DEMO-P015", "Organization", "ORG-0005", "EMPLOYED_BY", 91, "Chief clinical advisor for Novartis Pharma Distributors.", LocalDate.of(2022, 8, 1), LocalDate.of(2026, 8, 28), 6L, "EV-0012", "VERIFIED");
        createRel("Person", "DEMO-P015", "Person", "DEMO-P012", "CONTACTED", 76, "Employed Zackary as private courier for cold chain packages.", LocalDate.of(2025, 10, 1), LocalDate.of(2026, 4, 2), 6L, "COMM-RECORD-05", "VERIFIED");
        createRel("Person", "DEMO-P011", "Organization", "ORG-0005", "EMPLOYED_BY", 80, "Auditor who documented stock variance in cold chain lot B-9.", LocalDate.of(2023, 3, 1), LocalDate.of(2026, 3, 29), 6L, "INC-2026-0006", "VERIFIED");

        // Case Involvements
        createRel("Person", "DEMO-P001", "Case", "CASE-2026-0001", "INVOLVED_IN_CASE", 85, "Named key subject in warehouse freight interception.", LocalDate.of(2026, 1, 14), LocalDate.of(2026, 9, 25), 1L, "CASE-FILE-01", "VERIFIED");
        createRel("Person", "DEMO-P002", "Case", "CASE-2026-0002", "INVOLVED_IN_CASE", 90, "Primary subject of financial shell syndicate probe.", LocalDate.of(2026, 2, 3), LocalDate.of(2026, 9, 25), 2L, "CASE-FILE-02", "VERIFIED");
        createRel("Person", "DEMO-P003", "Case", "CASE-2026-0003", "INVOLVED_IN_CASE", 88, "Transport coordinator in vehicle theft investigation.", LocalDate.of(2026, 2, 19), LocalDate.of(2026, 9, 25), 3L, "CASE-FILE-03", "VERIFIED");
        createRel("Person", "DEMO-P009", "Case", "CASE-2026-0004", "INVOLVED_IN_CASE", 79, "Technical subject in cyber wire diversion investigation.", LocalDate.of(2026, 3, 1), LocalDate.of(2026, 9, 25), 4L, "CASE-FILE-04", "VERIFIED");
        createRel("Person", "DEMO-P010", "Case", "CASE-2026-0015", "INVOLVED_IN_CASE", 86, "Foundry manager examined in weighbridge sensor probe.", LocalDate.of(2026, 8, 11), LocalDate.of(2026, 9, 25), 15L, "CASE-FILE-15", "VERIFIED");
        createRel("Person", "DEMO-P017", "Case", "CASE-2026-0001", "INVOLVED_IN_CASE", 82, "Intermodal coordinator linked across freight manifests.", LocalDate.of(2026, 1, 14), LocalDate.of(2026, 9, 25), 1L, "CASE-FILE-01", "VERIFIED");
        createRel("Person", "DEMO-P017", "Case", "CASE-2026-0002", "INVOLVED_IN_CASE", 74, "Linked to consultant invoices from Kestrel Capital.", LocalDate.of(2026, 2, 3), LocalDate.of(2026, 9, 25), 2L, "CASE-FILE-02", "UNDER_REVIEW");

        // Remaining interconnecting relationships
        createRel("Person", "DEMO-P004", "Organization", "ORG-0001", "EMPLOYED_BY", 80, "Customs clearance agent processing Orion manifests.", LocalDate.of(2024, 6, 1), LocalDate.of(2026, 8, 10), 1L, "PORT-REC-04", "VERIFIED");
        createRel("Person", "DEMO-P004", "Person", "DEMO-P001", "ASSOCIATED_WITH", 77, "Manifest stamping meetings at Docklands café.", LocalDate.of(2025, 5, 10), LocalDate.of(2026, 7, 22), 1L, "SURV-04", "VERIFIED");
        createRel("Person", "DEMO-P012", "Vehicle", "VEH-0010", "OWNS", 85, "Dispatcher driving Sprinter van.", LocalDate.of(2024, 7, 1), LocalDate.of(2026, 9, 20), 5L, "DMV-RECORD-10", "VERIFIED");
        createRel("Person", "DEMO-P013", "Organization", "ORG-0010", "ASSOCIATED_WITH", 82, "Frequent patron and event sponsor at The Obsidian Club.", LocalDate.of(2024, 1, 1), LocalDate.of(2026, 9, 24), 1L, "CLUB-LOG-13", "VERIFIED");
        createRel("Person", "DEMO-P023", "Organization", "ORG-0010", "EMPLOYED_BY", 90, "Hospitality manager at Obsidian Club.", LocalDate.of(2023, 11, 1), LocalDate.of(2026, 9, 25), 1L, "CLUB-STAFF-23", "VERIFIED");
        createRel("Person", "DEMO-P001", "Organization", "ORG-0010", "ASSOCIATED_WITH", 74, "Attended off-record dinners at Obsidian Club.", LocalDate.of(2025, 9, 12), LocalDate.of(2026, 9, 24), 1L, "INC-2026-0020", "VERIFIED");
        createRel("Person", "DEMO-P002", "Organization", "ORG-0010", "ASSOCIATED_WITH", 70, "Observed at Obsidian Club private lounge with Victor Sterling.", LocalDate.of(2025, 10, 14), LocalDate.of(2026, 9, 24), 2L, "INC-2026-0020", "UNDER_REVIEW");
        createRel("Person", "DEMO-P021", "Organization", "ORG-0007", "ASSOCIATED_WITH", 88, "Trust officer managing offshore nominee accounts.", LocalDate.of(2023, 8, 1), LocalDate.of(2026, 8, 15), 2L, "BANK-REC-21", "VERIFIED");
        createRel("Person", "DEMO-P022", "Organization", "ORG-0006", "EMPLOYED_BY", 83, "CCTV technician servicing Bay 4 cameras.", LocalDate.of(2024, 2, 1), LocalDate.of(2026, 1, 18), 1L, "EV-0003", "VERIFIED");
        createRel("Person", "DEMO-P031", "Person", "DEMO-P008", "CONTACTED", 65, "Locksmith called to configure backup keypad codes.", LocalDate.of(2025, 12, 1), LocalDate.of(2026, 1, 12), 1L, "PHONE-REC-31", "UNDER_REVIEW");
        createRel("Person", "DEMO-P032", "Person", "DEMO-P004", "ASSOCIATED_WITH", 72, "Textile import clearance handled by customs agent.", LocalDate.of(2025, 8, 20), LocalDate.of(2026, 5, 19), 10L, "EV-0016", "VERIFIED");
        createRel("Person", "DEMO-P035", "Person", "DEMO-P009", "COMMUNICATED_WITH", 85, "Darknet credentials transaction for compromised API portals.", LocalDate.of(2026, 1, 5), LocalDate.of(2026, 3, 2), 4L, "EV-0008", "VERIFIED");
        createRel("Person", "DEMO-P036", "Person", "DEMO-P026", "CONTACTED", 79, "Sold handheld GPS signal dampeners used in excavator thefts.", LocalDate.of(2025, 11, 10), LocalDate.of(2026, 6, 1), 11L, "EV-0006", "VERIFIED");
        createRel("Person", "DEMO-P037", "Person", "DEMO-P003", "COMMUNICATED_WITH", 81, "Long-haul truck dispatch coordination for auto shipments.", LocalDate.of(2025, 6, 15), LocalDate.of(2026, 8, 19), 3L, "TRUCK-LOG-37", "VERIFIED");
        createRel("Person", "DEMO-P038", "Organization", "ORG-0002", "ASSOCIATED_WITH", 73, "Drafted administrative filings for Apex Data Services.", LocalDate.of(2025, 3, 10), LocalDate.of(2026, 4, 10), 7L, "EV-0013", "VERIFIED");
        createRel("Person", "DEMO-P039", "Person", "DEMO-P005", "COMMUNICATED_WITH", 68, "Delivered corporate invoice PDF layout templates.", LocalDate.of(2025, 8, 1), LocalDate.of(2026, 2, 4), 2L, "EV-0004", "VERIFIED");
        createRel("Location", "North Docklands Terminal 4", "Case", "CASE-2026-0001", "LOCATED_AT", 90, "Primary venue for freight interception incidents.", LocalDate.of(2026, 1, 14), LocalDate.of(2026, 9, 25), 1L, "INC-2026-0001", "VERIFIED");
        createRel("Location", "Capital Plaza Suite 400", "Case", "CASE-2026-0002", "LOCATED_AT", 88, "Registered address for Apex Data Services.", LocalDate.of(2026, 2, 3), LocalDate.of(2026, 9, 25), 2L, "INC-2026-0002", "VERIFIED");
        createRel("Location", "Westside Auto Yard", "Case", "CASE-2026-0003", "LOCATED_AT", 85, "Staging hub for transshipped luxury vehicles.", LocalDate.of(2026, 2, 19), LocalDate.of(2026, 9, 25), 3L, "INC-2026-0003", "VERIFIED");
        createRel("Incident", "INC-2026-0001", "Case", "CASE-2026-0001", "INVOLVED_IN_CASE", 95, "Primary incident report triggering investigation.", LocalDate.of(2026, 1, 14), LocalDate.of(2026, 1, 14), 1L, "POLICE-REP-01", "VERIFIED");
        createRel("Incident", "INC-2026-0002", "Case", "CASE-2026-0002", "INVOLVED_IN_CASE", 95, "Primary wire diversion trigger incident.", LocalDate.of(2026, 2, 3), LocalDate.of(2026, 2, 3), 2L, "POLICE-REP-02", "VERIFIED");
        createRel("Evidence", "EV-0001", "Case", "CASE-2026-0001", "INVOLVED_IN_CASE", 95, "RFID tag recovered from Terminal Gate 4.", LocalDate.of(2026, 1, 15), LocalDate.of(2026, 1, 15), 1L, "CHAIN-OF-CUST-01", "VERIFIED");
        createRel("Evidence", "EV-0004", "Case", "CASE-2026-0002", "INVOLVED_IN_CASE", 95, "Dummy invoice files recovered from escrow server.", LocalDate.of(2026, 2, 5), LocalDate.of(2026, 2, 5), 2L, "CHAIN-OF-CUST-04", "VERIFIED");
        createRel("Person", "DEMO-P001", "Person", "DEMO-P017", "ASSOCIATED_WITH", 84, "Frequent joint appearances at intermodal transport conferences.", LocalDate.of(2024, 9, 10), LocalDate.of(2026, 8, 11), 1L, "CONF-LOG-01", "VERIFIED");
        createRel("Person", "DEMO-P002", "Person", "DEMO-P017", "COMMUNICATED_WITH", 76, "Secure telephone exchanges regarding payment gateway routing.", LocalDate.of(2025, 11, 4), LocalDate.of(2026, 9, 1), 2L, "COMM-RECORD-07", "VERIFIED");
        createRel("Person", "DEMO-P003", "Person", "DEMO-P017", "TRAVELLED_WITH", 73, "Joint travel to rail junction cargo depots.", LocalDate.of(2025, 8, 12), LocalDate.of(2026, 7, 19), 3L, "RAIL-TICKET-03", "VERIFIED");
        createRel("Person", "DEMO-P010", "Person", "DEMO-P003", "COMMUNICATED_WITH", 71, "Discussions regarding scrap metal flatbed logistics.", LocalDate.of(2025, 7, 1), LocalDate.of(2026, 8, 5), 15L, "COMM-RECORD-08", "UNDER_REVIEW");
        createRel("Person", "DEMO-P007", "Person", "DEMO-P026", "ASSOCIATED_WITH", 80, "Collaborated on vehicle diagnostic reset procedures.", LocalDate.of(2025, 4, 10), LocalDate.of(2026, 8, 22), 3L, "GARAGE-LOG-07", "VERIFIED");
        createRel("Person", "DEMO-P019", "Person", "DEMO-P001", "COMMUNICATED_WITH", 69, "Priority routing queries for bonded airport freight.", LocalDate.of(2025, 10, 15), LocalDate.of(2026, 6, 18), 1L, "AIR-LOG-19", "UNDER_REVIEW");
        createRel("Person", "DEMO-P027", "Person", "DEMO-P005", "CONTACTED", 72, "Assisted with daily over-the-counter deposit slips.", LocalDate.of(2025, 9, 1), LocalDate.of(2026, 3, 15), 2L, "BANK-DEP-27", "VERIFIED");
    }

    private void createRel(String st, String sid, String tt, String tid, String type, int str, String desc, LocalDate d1, LocalDate d2, Long cid, String ref, String stat) {
        Relationship r = new Relationship();
        r.setSourceEntityType(st);
        r.setSourceEntityId(sid);
        r.setTargetEntityType(tt);
        r.setTargetEntityId(tid);
        r.setRelationshipType(type);
        r.setStrength(str);
        r.setDescription(desc);
        r.setFirstObserved(d1);
        r.setLastObserved(d2);
        r.setCaseId(cid);
        r.setSourceReference(ref);
        r.setVerificationStatus(stat);
        r.setCreatedBy("SYSTEM");
        relationshipRepository.save(r);
    }

    private void seedCommunications() {
        if (communicationRepository.count() > 0) return;

        createComm("DEMO-P001 (Arjun Rao)", "DEMO-P008 (Samantha Reed)", "Call", 14, 1L, "Discussion regarding Terminal 4 security rotation times.");
        createComm("DEMO-P001 (Arjun Rao)", "DEMO-P003 (Vikram Malhotra)", "Meeting", 45, 1L, "In-person meeting at Docklands Diner regarding lowboy trailer availability.");
        createComm("DEMO-P001 (Arjun Rao)", "DEMO-P017 (Leonidas Drake)", "Call", 8, 1L, "Intermodal rail scheduling sync.");
        createComm("DEMO-P002 (Devika Nair)", "DEMO-P005 (Ananya Sharma)", "Message", 0, 2L, "Encrypted message sharing batch payment hash.");
        createComm("DEMO-P002 (Devika Nair)", "DEMO-P009 (Naveen Patel)", "Call", 22, 4L, "Technical requirements for API script execution.");
        createComm("DEMO-P002 (Devika Nair)", "DEMO-P017 (Leonidas Drake)", "Call", 11, 2L, "Billing coordination for transit logistics fees.");
        createComm("DEMO-P003 (Vikram Malhotra)", "DEMO-P007 (Tariq Al-Mansoor)", "Meeting", 60, 3L, "Dinner meeting at Westside Auto Yard office.");
        createComm("DEMO-P003 (Vikram Malhotra)", "DEMO-P037 (Brandon Walker)", "Call", 16, 3L, "Highway route instructions avoiding inspection stations.");
        createComm("DEMO-P007 (Tariq Al-Mansoor)", "DEMO-P026 (Marcus Brody)", "Call", 19, 3L, "Discussion of electronic immobilizer bypass modules.");
        createComm("DEMO-P008 (Samantha Reed)", "DEMO-P031 (Lucas Bennett)", "Call", 6, 1L, "Inquiry regarding keycard lock cylinder replacement.");
        createComm("DEMO-P009 (Naveen Patel)", "DEMO-P018 (Aiden Campbell)", "Message", 0, 12L, "Transmitted list of 6 phone numbers for SIM reissue.");
        createComm("DEMO-P009 (Naveen Patel)", "DEMO-P035 (Felix Ramos)", "Email", 0, 4L, "Encrypted file delivery with access keys.");
        createComm("DEMO-P010 (Carlos Ortiz)", "DEMO-P024 (Suresh Nair)", "Call", 5, 15L, "Instructions on rail gantry crane operation hours.");
        createComm("DEMO-P010 (Carlos Ortiz)", "DEMO-P017 (Leonidas Drake)", "Meeting", 30, 15L, "Inspection of scrap metal siding tracks.");
        createComm("DEMO-P014 (Farhan Qureshi)", "DEMO-P033 (Patrick O’Connor)", "Call", 25, 13L, "Tugboat position alignment outside territorial boundary.");
        createComm("DEMO-P015 (Harold Vance)", "DEMO-P012 (Zackary Stone)", "Meeting", 20, 6L, "Handover of temperature-monitored courier case.");
        createComm("DEMO-P015 (Harold Vance)", "DEMO-P011 (Mira Kulkarni)", "Email", 0, 6L, "Formal reply regarding pharmaceutical audit discrepancy.");
        createComm("DEMO-P016 (Sunita Reddy)", "DEMO-P005 (Ananya Sharma)", "Call", 12, 7L, "Confirmation of notarized power of attorney documents.");
        createComm("DEMO-P017 (Leonidas Drake)", "DEMO-P010 (Carlos Ortiz)", "Call", 15, 15L, "Weighbridge maintenance timing coordination.");
        createComm("DEMO-P020 (Girish Verma)", "DEMO-P026 (Marcus Brody)", "Call", 9, 11L, "Confirmation of GPS module removal on excavator.");
        createComm("DEMO-P021 (Elena Rostova)", "DEMO-P040 (Victor Sterling)", "Call", 35, 2L, "Quarterly report on fiduciary asset holding structure.");
        createComm("DEMO-P023 (Chloe Dubois)", "DEMO-P001 (Arjun Rao)", "Message", 0, 1L, "VIP dining room reservation confirmation at Obsidian Club.");
        createComm("DEMO-P023 (Chloe Dubois)", "DEMO-P013 (Priya Deshmukh)", "Message", 0, 1L, "Private gallery tasting event invitation.");
        createComm("DEMO-P025 (Amara Okafor)", "DEMO-P002 (Devika Nair)", "Email", 0, 2L, "Internal compliance audit notification memo.");
        createComm("DEMO-P027 (Geeta Joshi)", "DEMO-P005 (Ananya Sharma)", "Call", 4, 2L, "Deposit slip verification query.");
        createComm("DEMO-P028 (Dmitri Volkov)", "DEMO-P006 (Kavita Menon)", "Call", 18, 8L, "Container inspection bay schedule for evening crane shift.");
        createComm("DEMO-P032 (Zoya Khan)", "DEMO-P004 (Rohan Mehta)", "Call", 14, 10L, "Customs clearance release stamp status inquiry.");
        createComm("DEMO-P036 (Divya Sundaram)", "DEMO-P026 (Marcus Brody)", "Message", 0, 11L, "Delivery confirmation for electronic signal dampener.");
        createComm("DEMO-P038 (Kareem Mansoor)", "DEMO-P002 (Devika Nair)", "Meeting", 40, 7L, "Corporate minutes signing for Apex Data Services.");
        createComm("DEMO-P039 (Trisha Roy)", "DEMO-P005 (Ananya Sharma)", "Email", 0, 2L, "Revised graphics files for vendor billing forms.");
    }

    private void createComm(String src, String tgt, String type, int dur, Long cid, String notes) {
        CommunicationRecord c = new CommunicationRecord();
        c.setSourceEntity(src);
        c.setTargetEntity(tgt);
        c.setCommunicationType(type);
        c.setDurationMinutes(dur);
        c.setCaseId(cid);
        c.setContextNotes(notes);
        communicationRepository.save(c);
    }

    private void seedAlerts() {
        if (alertRepository.count() > 0) return;

        createAlt("ALT-2026-0001", "HIGH", 1L, "CASE-2026-0001", "High Network Centrality: Subject DEMO-P017 exhibits betweenness score bridging three separate logistics clusters.", 6, "Betweenness Centrality Metric", "NEW", "Marcus Holloway");
        createAlt("ALT-2026-0002", "CRITICAL", 2L, "CASE-2026-0002", "Cross-Case Entity Overlap: Apex Data Services linked to escrow accounts investigated in CASE-2026-0004.", 4, "Multi-Case Link Discovery", "UNDER_REVIEW", "Sophia Sterling");
        createAlt("ALT-2026-0003", "HIGH", 3L, "CASE-2026-0003", "Sudden Surge in Vehicle Re-registration Requests across Westside Auto Yard nodes.", 8, "Frequency Anomaly Detection", "NEW", "Marcus Holloway");
        createAlt("ALT-2026-0004", "MEDIUM", 4L, "CASE-2026-0004", "Repeated IP Subnet Overlap detected between cyber gateway hits and corporate VPN accounts.", 5, "Network Telemetry Correlator", "REVIEWED", "Sophia Sterling");
        createAlt("ALT-2026-0005", "HIGH", 1L, "CASE-2026-0001", "Unusual Nocturnal Meeting Detected at The Obsidian Social Club involving key logistics subjects.", 3, "Temporal Co-occurrence Alert", "NEW", "Marcus Holloway");
        createAlt("ALT-2026-0006", "MEDIUM", 6L, "CASE-2026-0006", "Audit Discrepancy: Hospital supply reports 1,200 missing doses while courier activity spiked.", 4, "Inventory-Communication Correlator", "UNDER_REVIEW", "Marcus Holloway");
        createAlt("ALT-2026-0007", "LOW", 7L, "CASE-2026-0007", "Shared Notary Signature: 3 corporate registration filings exhibit identical notary stamps.", 3, "Document Entity Clustering", "REVIEWED", "Sophia Sterling");
        createAlt("ALT-2026-0008", "CRITICAL", 8L, "CASE-2026-0008", "Quay 7 Container Manifest Discrepancy: Physical tare weight deviates by 1,400 kg from manifest.", 2, "Physical Sensor Variance", "NEW", "Marcus Holloway");
        createAlt("ALT-2026-0009", "MEDIUM", 9L, "CASE-2026-0009", "Trading Volume Spikes 840% ahead of public acquisition filing.", 5, "Financial Time-Series Anomaly", "REVIEWED", "Sophia Sterling");
        createAlt("ALT-2026-0010", "LOW", 10L, "CASE-2026-0010", "Customs Classification Code Switch on incoming textile air freight pallets.", 2, "Trade Data Rule Trigger", "DISMISSED", "Marcus Holloway");
        createAlt("ALT-2026-0011", "HIGH", 11L, "CASE-2026-0011", "Simultaneous GPS Signal Drop on two heavy equipment transponders within 500m radius.", 3, "Geographic Sensor Blackout", "NEW", "Marcus Holloway");
        createAlt("ALT-2026-0012", "CRITICAL", 12L, "CASE-2026-0012", "6 Unauthorized SIM Card Swaps executed within 40 minutes at retail terminal.", 6, "High Velocity Pattern Match", "NEW", "Sophia Sterling");
        createAlt("ALT-2026-0013", "MEDIUM", 13L, "CASE-2026-0013", "Vessel AIS Transponder turned off for 240 minutes in coastal fuel anchorage sector.", 2, "AIS Sensor Gap Analysis", "UNDER_REVIEW", "Marcus Holloway");
        createAlt("ALT-2026-0014", "LOW", 14L, "CASE-2026-0014", "Grant Application matches previously denied environmental cleanup documentation.", 3, "Textual Similarity Match", "REVIEWED", "Sophia Sterling");
        createAlt("ALT-2026-0015", "HIGH", 15L, "CASE-2026-0015", "Weighbridge Calibration Variance: 6% offset consistently recorded for inbound metal scrap.", 4, "Sensor Calibration Anomaly", "NEW", "Marcus Holloway");
        createAlt("ALT-2026-0016", "MEDIUM", 1L, "CASE-2026-0001", "New Relationship Discovered: Shared phone contact between DEMO-P008 and DEMO-P031.", 2, "Communication Triangulation", "NEW", "Marcus Holloway");
        createAlt("ALT-2026-0017", "HIGH", 2L, "CASE-2026-0002", "High-Risk Fund Transfer: 850k transfer executed to offshore trust managed by DEMO-P021.", 3, "Fiduciary Risk Indicator", "UNDER_REVIEW", "Sophia Sterling");
        createAlt("ALT-2026-0018", "LOW", 3L, "CASE-2026-0003", "Vehicle Movement Pattern: Repeating midnight transit between Westside yard and rail junction.", 7, "Trajectory Clustering", "REVIEWED", "Marcus Holloway");
        createAlt("ALT-2026-0019", "MEDIUM", 4L, "CASE-2026-0004", "Darknet Credential Hash Match: Recovered API credentials match data leaked on hacker forum.", 3, "External Threat Match", "NEW", "Sophia Sterling");
        createAlt("ALT-2026-0020", "HIGH", 1L, "CASE-2026-0001", "Potential Network Bridge: Leonidas Drake linked to both commercial freight and financial clearing.", 5, "Centrality Bridge Indicator", "NEW", "Marcus Holloway");
    }

    private void createAlt(String aid, String lvl, Long cid, String cnum, String reason, int recCount, String anLvl, String stat, String inv) {
        IntelligenceAlert a = new IntelligenceAlert();
        a.setAlertId(aid);
        a.setAlertLevel(lvl);
        a.setCaseId(cid);
        a.setCaseNumber(cnum);
        a.setReason(reason);
        a.setSupportingRecordsCount(recCount);
        a.setAnalyticalLevel(anLvl);
        a.setStatus(stat);
        a.setAssignedInvestigator(inv);
        alertRepository.save(a);
    }

    private void seedSuggestions() {
        if (suggestionRepository.count() > 0) return;

        createSug("Potential Link: Arjun Rao ↔ Devika Nair via Leonidas Drake", "Person", "DEMO-P001", "Arjun Rao", "Person", "DEMO-P002", "Devika Nair", "DEMO-P017 (Leonidas Drake)", "Both entities maintain high-strength verified relationships with Leonidas Drake across independent logistics and settlement frameworks.", "Shared intermediary entity, repeated teleconference timestamps, co-attendance at Obsidian Social Club", 84, "PENDING");
        createSug("Potential Link: Vikram Malhotra ↔ Carlos Ortiz via Heavy Transport Yard", "Person", "DEMO-P003", "Vikram Malhotra", "Person", "DEMO-P010", "Carlos Ortiz", "ORG-0008 (IronClad Metal)", "Vikram Malhotra freight fleet vehicles logged multiple deliveries at Carlos Ortiz foundry yard despite lacking formal transport contract.", "4 shared vehicle sightings, overlapping cellular tower pings, shared mechanic associate Marcus Brody", 76, "PENDING");
        createSug("Potential Link: Harold Vance ↔ Devika Nair via Medical Escrow Account", "Person", "DEMO-P015", "Dr. Harold Vance", "Person", "DEMO-P002", "Devika Nair", "ORG-0002 (Apex Data Services)", "Medical warehouse software licensed from Apex Data Services with direct escrow fees redirected to consulting pool.", "Software licensing ledger, overlapping bank routing prefix, single point of digital contact", 71, "PENDING");
        createSug("Potential Link: Tariq Al-Mansoor ↔ Girish Verma via Equipment Transport", "Person", "DEMO-P007", "Tariq Al-Mansoor", "Person", "DEMO-P020", "Girish Verma", "DEMO-P026 (Marcus Brody)", "Both subjects utilized Marcus Brody for electronic diagnostic and GPS transponder suppression within a 2-week window.", "Shared technician, identical GPS jamming hardware recovered, concurrent yard sightings", 82, "ACCEPTED");
    }

    private void createSug(String title, String st, String sid, String sname, String tt, String tid, String tname, String inter, String reason, String sig, int score, String stat) {
        AiSuggestion s = new AiSuggestion();
        s.setTitle(title);
        s.setSourceEntityType(st);
        s.setSourceEntityId(sid);
        s.setSourceEntityName(sname);
        s.setTargetEntityType(tt);
        s.setTargetEntityId(tid);
        s.setTargetEntityName(tname);
        s.setIntermediateEntity(inter);
        s.setReason(reason);
        s.setSupportingSignals(sig);
        s.setAnalyticalScore(score);
        s.setStatus(stat);
        suggestionRepository.save(s);
    }

    private void seedLocations() {
        if (locationRepository.count() > 0) return;

        createLoc("LOC-2026-0001", "North Docklands Terminal 4", "Gate 12, Terminal Basin 4", "Chennai", "Chennai Central", "Tamil Nadu", new BigDecimal("13.0900"), new BigDecimal("80.2950"), "CASE-2026-0001", "INC-2026-0001", "DEMO-P001, DEMO-P008", "ACTIVE", "Monitored deep-water shipping container loading terminal.");
        createLoc("LOC-2026-0002", "Downtown Financial District Tower", "44 Anna Salai, Commercial Corridor", "Chennai", "Chennai South", "Tamil Nadu", new BigDecimal("13.0600"), new BigDecimal("80.2500"), "CASE-2026-0002", "INC-2026-0002", "DEMO-P002, DEMO-P005", "ACTIVE", "Offices of simulated financial shell vendors and corporate escrows.");
        createLoc("LOC-2026-0003", "Westside Auto Yard & Rail Junction", "Plot 88 Industrial Link Road", "Chennai", "Ambattur", "Tamil Nadu", new BigDecimal("13.0450"), new BigDecimal("80.2100"), "CASE-2026-0003", "INC-2026-0003", "DEMO-P003, DEMO-P007", "ACTIVE", "Transshipment auto staging depot with freight rail connection.");
        createLoc("LOC-2026-0004", "Harbor View Industrial Park", "Wharf Road Sector B", "Chennai", "Royapuram", "Tamil Nadu", new BigDecimal("13.1100"), new BigDecimal("80.3000"), "CASE-2026-0005", "INC-2026-0005", "DEMO-P004, DEMO-P022", "ACTIVE", "High-density warehouse depot storing commercial electronics.");
        createLoc("LOC-2026-0005", "Midtown Medical Distribution Center", "12 Healthcare Avenue", "Chennai", "Kilpauk", "Tamil Nadu", new BigDecimal("13.0700"), new BigDecimal("80.2600"), "CASE-2026-0006", "INC-2026-0006", "DEMO-P015, DEMO-P011", "ACTIVE", "Cold-chain pharmaceutical warehouse storage.");
        createLoc("LOC-2026-0006", "International Port Basin Quay 7", "Outer Port Basin Gate 3", "Chennai", "Tondiarpet", "Tamil Nadu", new BigDecimal("13.1200"), new BigDecimal("80.3100"), "CASE-2026-0008", "INC-2026-0008", "DEMO-P006, DEMO-P028", "MONITORED", "Bulk maritime container offloading quay under active surveillance.");
        createLoc("LOC-2026-0007", "Capital Plaza Corporate Tower", "77 Mount Road Commercial Center", "Chennai", "Guindy", "Tamil Nadu", new BigDecimal("13.0827"), new BigDecimal("80.2707"), "CASE-2026-0009", "INC-2026-0009", "DEMO-P005, DEMO-P040", "ACTIVE", "Corporate trust offices and executive boardrooms.");
        createLoc("LOC-2026-0008", "South River Basin Metal Foundry", "Canal Road Industrial Sector", "Chennai", "Madhavaram", "Tamil Nadu", new BigDecimal("13.0100"), new BigDecimal("80.2300"), "CASE-2026-0015", "INC-2026-0015", "DEMO-P010, DEMO-P024", "MONITORED", "Scrap metal processing furnace and heavy weighbridge.");
        createLoc("LOC-2026-0009", "Coastal Fuel Jetty & Anchorage", "Marine Terminal Road", "Chennai", "Ennore", "Tamil Nadu", new BigDecimal("13.1350"), new BigDecimal("80.3250"), "CASE-2026-0013", "INC-2026-0013", "DEMO-P014, DEMO-P033", "ACTIVE", "Coastal barge refueling dock and auxiliary tug moorings.");
        createLoc("LOC-2026-0010", "Suburban Bypass Railhead Depot", "National Highway 48 Rail Spur", "Chennai", "Sriperumbudur", "Tamil Nadu", new BigDecimal("13.1400"), new BigDecimal("80.1800"), "CASE-2026-0011", "INC-2026-0011", "DEMO-P020, DEMO-P026", "ACTIVE", "Heavy industrial machinery storage yard.");
        createLoc("LOC-2026-0011", "The Obsidian Social Club", "18 Poes Garden Enclave", "Chennai", "Teynampet", "Tamil Nadu", new BigDecimal("13.0550"), new BigDecimal("80.2650"), "CASE-2026-0001", "INC-2026-0020", "DEMO-P023, DEMO-P001", "MONITORED", "Private member social establishment used for off-record meetings.");
        createLoc("LOC-2026-0012", "Metro Civil Documentation Registry", "Government Complex Annex", "Chennai", "George Town", "Tamil Nadu", new BigDecimal("13.0800"), new BigDecimal("80.2800"), "CASE-2026-0007", "INC-2026-0007", "DEMO-P016, DEMO-P038", "ACTIVE", "Public records archive and business incorporation filings.");
        createLoc("LOC-2026-0013", "East End Cargo Air Depot", "Air Cargo Terminal Complex", "Chennai", "Meenambakkam", "Tamil Nadu", new BigDecimal("13.0950"), new BigDecimal("80.2850"), "CASE-2026-0010", "INC-2026-0010", "DEMO-P019, DEMO-P032", "ACTIVE", "Air freight transit zone for priority imports.");
        createLoc("LOC-2026-0014", "Cyber Forensics & Telemetry Lab", "IT Expressway Phase 1", "Chennai", "OMR Thoraipakkam", "Tamil Nadu", new BigDecimal("13.0650"), new BigDecimal("80.2400"), "CASE-2026-0004", "INC-2026-0004", "DEMO-P009, DEMO-P018", "ACTIVE", "Data center gateway monitoring telecom switching anomalies.");
        createLoc("LOC-2026-0015", "Northern Foundry Metal Yard", "Periyapalayam Industrial Belt", "Chennai", "Tiruvallur", "Tamil Nadu", new BigDecimal("13.1500"), new BigDecimal("80.2200"), "CASE-2026-0015", "INC-2026-0015", "DEMO-P010, DEMO-P017", "ACTIVE", "Heavy rail cargo siding for unrefined ore.");
    }

    private void createLoc(String id, String name, String addr, String city, String dist, String state, BigDecimal lat, BigDecimal lng, String cases, String incs, String persons, String status, String notes) {
        Location loc = new Location(id, name, addr, city, dist, state, lat, lng, cases, incs, persons, status, notes);
        locationRepository.save(loc);
    }

    private void seedNotes() {
        if (noteRepository.count() > 0) return;

        createNote("Initial Surveillance Report at Terminal 4", "Night shift observation confirmed unmanifested freight container transferred to unmarked commercial transport truck.", "Marcus Holloway", 1L, 1L, "HIGH", true);
        createNote("RFID Cloned Manifest Analysis", "Forensic analysis of the physical manifest indicates RFID chip ID was duplicated from a legitimate European container.", "Marcus Holloway", 1L, 8L, "MEDIUM", false);
        createNote("Shell Company Financial Trail", "Auditing of Orion Logistics records reveals layered corporate accounts across three offshore banking centers.", "Sophia Sterling", 2L, 2L, "CRITICAL", true);
        createNote("Luxury Vehicle VIN Tampering Modus Operandi", "Vehicles have their primary VIN plates etched over using acid and replaced with synthetic chassis codes.", "Marcus Holloway", 3L, 7L, "HIGH", false);
        createNote("API Token Authentication Leak", "The attack vector utilized an expired API developer token stolen from a third-party billing platform.", "Sophia Sterling", 4L, 9L, "CRITICAL", true);
        createNote("Hospital Inventory Discrepancy", "Whistleblower provided pharmacy reconciliation sheets showing 1,200 vials diverted before dock inspection.", "Marcus Holloway", 6L, 15L, "MEDIUM", false);
        createNote("Quay 7 Weight Discrepancy", "Automated crane scales registered 1,400 kg deviation between the physical container and the electronic customs declaration.", "Marcus Holloway", 8L, 6L, "HIGH", true);
        createNote("Tugboat AIS Signal Gap", "AIS transponder was deliberately deactivated for 4 hours while barge was anchored 3 miles offshore.", "Marcus Holloway", 13L, 14L, "MEDIUM", false);
        createNote("Scrap Scale Calibration Tampering", "Physical audit of the foundry weighbridge uncovered a mechanical shim under the load cell causing a 6% weight reduction.", "Marcus Holloway", 15L, 10L, "HIGH", false);
    }

    private void createNote(String title, String content, String by, Long caseId, Long personId, String priority, boolean pinned) {
        InvestigationNote note = new InvestigationNote();
        note.setTitle(title);
        note.setContent(content);
        note.setCreatedBy(by);
        note.setRelatedCaseId(caseId);
        note.setRelatedPersonId(personId);
        note.setPriority(priority);
        note.setPinned(pinned);
        noteRepository.save(note);
    }

    private void seedCaseActivities() {
        if (caseActivityRepository.count() > 0) return;

        createAct(1L, "CASE-2026-0001", "CASE_CREATED", "Case Dossier Initiated", "Case CASE-2026-0001 created for Warehouse High-Value Cargo Theft.", "Marcus Holloway", LocalDateTime.now().minusDays(20));
        createAct(1L, "CASE-2026-0001", "INVESTIGATOR_ASSIGNED", "Lead Investigator Assigned", "Marcus Holloway designated as Lead Investigator for Operation Cargo Intercept.", "Elena Vance", LocalDateTime.now().minusDays(19));
        createAct(1L, "CASE-2026-0001", "PERSON_LINKED", "Subject Linked to Case", "Subject DEMO-P001 (Arjun Rao) linked as key person of interest.", "Marcus Holloway", LocalDateTime.now().minusDays(18));
        createAct(1L, "CASE-2026-0001", "EVIDENCE_ADDED", "Forensic Artifact Vaulted", "Physical evidence item EV-0001 (Cloned Shipping Manifest) registered.", "Marcus Holloway", LocalDateTime.now().minusDays(17));
        createAct(1L, "CASE-2026-0001", "RELATIONSHIP_CREATED", "Relational Association Established", "Verified link between Arjun Rao and Samantha Reed (Terminal Bay 4).", "Marcus Holloway", LocalDateTime.now().minusDays(16));
        createAct(1L, "CASE-2026-0001", "EVIDENCE_TRANSFERRED", "Custody Transfer Executed", "Evidence EV-0001 transferred to State Forensics Vault for ink analysis.", "Evidence Control Officer", LocalDateTime.now().minusDays(14));
        createAct(1L, "CASE-2026-0001", "STATUS_CHANGED", "Investigation Status Elevated", "Case moved to ACTIVE investigation status following container recovery.", "Marcus Holloway", LocalDateTime.now().minusDays(10));
        createAct(1L, "CASE-2026-0001", "NOTE_ADDED", "Investigator Note Logged", "Surveillance notes added regarding Obsidian Club off-record meeting.", "Marcus Holloway", LocalDateTime.now().minusDays(5));

        createAct(2L, "CASE-2026-0002", "CASE_CREATED", "Case Dossier Initiated", "Case CASE-2026-0002 initiated regarding Fraudulent Shell Invoice Syndicate.", "Sophia Sterling", LocalDateTime.now().minusDays(18));
        createAct(2L, "CASE-2026-0002", "PERSON_LINKED", "Financial Consultant Identified", "Devika Nair identified as principal architect of payment routing.", "Sophia Sterling", LocalDateTime.now().minusDays(16));
        createAct(2L, "CASE-2026-0002", "EVIDENCE_ADDED", "Digital Evidence Secured", "Encrypted USB Ledger drive EV-0002 secured from accounting suite.", "Sophia Sterling", LocalDateTime.now().minusDays(14));
        createAct(2L, "CASE-2026-0002", "PRIORITY_CHANGED", "Priority Escalated to CRITICAL", "Cross-jurisdiction wire activity triggered immediate executive escalation.", "Elena Vance", LocalDateTime.now().minusDays(8));

        createAct(3L, "CASE-2026-0003", "CASE_CREATED", "Case Dossier Initiated", "Case CASE-2026-0003 opened for Luxury Vehicle Transshipment Network.", "Marcus Holloway", LocalDateTime.now().minusDays(15));
        createAct(3L, "CASE-2026-0003", "EVIDENCE_ADDED", "Vehicle Tracking GPS Recovered", "Recovered 16-band radio jammer EV-0006 cataloged.", "Marcus Holloway", LocalDateTime.now().minusDays(12));
        createAct(3L, "CASE-2026-0003", "RELATIONSHIP_CREATED", "Vehicle Network Connection", "Linked vehicle TN-00-DEMO-001 to Westside Auto Yard staging depot.", "Marcus Holloway", LocalDateTime.now().minusDays(7));
    }

    private void createAct(Long cid, String cnum, String action, String title, String desc, String by, LocalDateTime time) {
        CaseActivity a = new CaseActivity(cid, cnum, action, title, desc, by, time);
        caseActivityRepository.save(a);
    }

    private void seedNotifications() {
        if (notificationRepository.count() > 0) return;

        notificationRepository.save(new Notification("ALL", "New Case Assigned: CASE-2026-0001", "Marcus Holloway assigned as lead investigator for Warehouse High-Value Cargo Theft.", "CASE", "CASE", "CASE-2026-0001"));
        notificationRepository.save(new Notification("ALL", "High Priority Alert Triggered", "Cross-case entity overlap detected: Apex Data Services linked to escrow accounts.", "ALERT", "ALERT", "ALT-2026-0002"));
        notificationRepository.save(new Notification("ALL", "Evidence Vault Intake Verified", "Evidence EV-0001 (Cloned Shipping Manifest) has been secured in Vault B-12.", "EVIDENCE", "EVIDENCE", "EV-0001"));
        notificationRepository.save(new Notification("ALL", "Chain of Custody Transfer Pending", "Evidence EV-0003 transfer request awaiting review by Evidence Control.", "EVIDENCE", "EVIDENCE", "EV-0003"));
        notificationRepository.save(new Notification("ALL", "New Relationship Link Established", "Strong relational link verified between Arjun Rao and Leonidas Drake.", "RELATIONSHIP", "RELATIONSHIP", "rel-1"));
        notificationRepository.save(new Notification("ALL", "Case Priority Elevated", "Case CASE-2026-0004 priority elevated to CRITICAL by Lead Analyst.", "CASE", "CASE", "CASE-2026-0004"));
        notificationRepository.save(new Notification("ALL", "Investigation Note Logged", "Marcus Holloway added classified surveillance notes to CASE-2026-0001.", "NOTE", "CASE", "CASE-2026-0001"));
        notificationRepository.save(new Notification("ALL", "Intelligence Dossier Exported", "Case Summary Report generated for CASE-2026-0002.", "REPORT", "REPORT", "REP-0001"));
    }

    private void seedAuditLogs() {
        if (auditLogRepository.count() > 0) return;

        auditLogRepository.save(new AuditLog("admin", "LOGIN", "USER", "admin", "System session initialized with administrative privileges."));
        auditLogRepository.save(new AuditLog("investigator", "LOGIN", "USER", "investigator", "Investigator session initiated."));
        auditLogRepository.save(new AuditLog("investigator", "CREATE_CASE", "CASE", "CASE-2026-0001", "Created case CASE-2026-0001: Warehouse High-Value Cargo Theft."));
        auditLogRepository.save(new AuditLog("investigator", "ADD_EVIDENCE", "EVIDENCE", "EV-0001", "Logged physical evidence item EV-0001 into secure custody."));
        auditLogRepository.save(new AuditLog("investigator", "TRANSFER_EVIDENCE", "EVIDENCE", "EV-0001", "Transferred evidence EV-0001 to State Forensics Vault."));
        auditLogRepository.save(new AuditLog("analyst", "EVALUATE_DATABASE_RULES", "ALERTS", "SYSTEM", "Executed database business rules and evaluated 20 active alerts."));
        auditLogRepository.save(new AuditLog("analyst", "VERIFY_RELATIONSHIP", "RELATIONSHIP", "rel-004", "Investigator verified manual relationship Tariq Al-Mansoor ↔ Girish Verma."));
        auditLogRepository.save(new AuditLog("investigator", "GENERATE_REPORT", "REPORT", "REP-0001", "Generated formal case summary dossier for CASE-2026-0001."));
    }

    private void seedDataSources() {
        if (dataSourceRepository.count() > 0) return;

        DataSource s1 = new DataSource();
        s1.setSourceName("National Crime Records Bureau (NCRB) Open Data");
        s1.setSourceType("JSON");
        s1.setBaseUrl("https://ncrb.gov.in/api/v1/crime-statistics-aggregate");
        s1.setCountry("India");
        s1.setCategory("AGGREGATE_STATISTICS");
        s1.setApiAvailable(true);
        s1.setScrapingAllowed(true);
        s1.setRobotsChecked(true);
        s1.setTermsChecked(true);
        s1.setTermsReviewedBy("SecOps Research Team");
        s1.setTermsReviewedAt(LocalDateTime.now().minusDays(3));
        s1.setLicense("Government Open Data License (GODL-India)");
        s1.setScrapingPermissionNotes("Official open government statistical releases. Machine-readable JSON.");
        s1.setUpdateFrequency("WEEKLY");
        s1.setStatus("APPROVED");
        s1.setHealthStatus("ONLINE");
        s1.setLastSync(LocalDateTime.now().minusHours(8));
        s1.setLastSuccess(LocalDateTime.now().minusHours(8));
        s1.setNextSync(LocalDateTime.now().plusDays(6));
        s1.setRecordsImported(14);
        s1.setRecordsSkipped(2);
        s1.setErrorCount(0);
        s1.setSourceBadge("OPEN DATA");
        s1.setReliabilityLevel("Official Government Source");
        dataSourceRepository.save(s1);

        DataSource s2 = new DataSource();
        s2.setSourceName("CERT-In Cyber Security Public Advisories");
        s2.setSourceType("RSS");
        s2.setBaseUrl("https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES01");
        s2.setCountry("India");
        s2.setCategory("CYBER_FRAUD");
        s2.setApiAvailable(false);
        s2.setScrapingAllowed(true);
        s2.setRobotsChecked(true);
        s2.setTermsChecked(true);
        s2.setTermsReviewedBy("Cyber Intelligence Unit");
        s2.setTermsReviewedAt(LocalDateTime.now().minusDays(5));
        s2.setLicense("Public Domain / CERT-In Circular Notice");
        s2.setScrapingPermissionNotes("Official public cybersecurity vulnerability and financial phishing circulars.");
        s2.setUpdateFrequency("DAILY");
        s2.setStatus("APPROVED");
        s2.setHealthStatus("ONLINE");
        s2.setLastSync(LocalDateTime.now().minusHours(4));
        s2.setLastSuccess(LocalDateTime.now().minusHours(4));
        s2.setNextSync(LocalDateTime.now().plusHours(20));
        s2.setRecordsImported(18);
        s2.setRecordsSkipped(3);
        s2.setErrorCount(0);
        s2.setSourceBadge("RSS");
        s2.setReliabilityLevel("Official Government Source");
        dataSourceRepository.save(s2);

        DataSource s3 = new DataSource();
        s3.setSourceName("PIB Home Affairs Public Safety Bulletins");
        s3.setSourceType("RSS");
        s3.setBaseUrl("https://pib.gov.in/RssMain.aspx?ModId=1");
        s3.setCountry("India");
        s3.setCategory("PUBLIC_SAFETY");
        s3.setApiAvailable(false);
        s3.setScrapingAllowed(true);
        s3.setRobotsChecked(true);
        s3.setTermsChecked(true);
        s3.setTermsReviewedBy("Admin Auditor");
        s3.setTermsReviewedAt(LocalDateTime.now().minusDays(7));
        s3.setLicense("Public Press Releases (GODL-India)");
        s3.setScrapingPermissionNotes("National public safety alerts and interstate enforcement notices.");
        s3.setUpdateFrequency("DAILY");
        s3.setStatus("APPROVED");
        s3.setHealthStatus("ONLINE");
        s3.setLastSync(LocalDateTime.now().minusHours(6));
        s3.setLastSuccess(LocalDateTime.now().minusHours(6));
        s3.setNextSync(LocalDateTime.now().plusHours(18));
        s3.setRecordsImported(12);
        s3.setRecordsSkipped(1);
        s3.setErrorCount(0);
        s3.setSourceBadge("RSS");
        s3.setReliabilityLevel("Official Government Source");
        dataSourceRepository.save(s3);

        DataSource s4 = new DataSource();
        s4.setSourceName("State Crime Trends & District Metrics");
        s4.setSourceType("CSV");
        s4.setBaseUrl("https://data.gov.in/resource/state-crime-trends-csv");
        s4.setCountry("India");
        s4.setCategory("AGGREGATE_STATISTICS");
        s4.setApiAvailable(true);
        s4.setScrapingAllowed(true);
        s4.setRobotsChecked(true);
        s4.setTermsChecked(true);
        s4.setTermsReviewedBy("State Data Cell");
        s4.setTermsReviewedAt(LocalDateTime.now().minusDays(10));
        s4.setLicense("Open Government Data License");
        s4.setScrapingPermissionNotes("Curated district-level metrics for vehicle theft, cyber fraud, and property crime.");
        s4.setUpdateFrequency("WEEKLY");
        s4.setStatus("APPROVED");
        s4.setHealthStatus("ONLINE");
        s4.setLastSync(LocalDateTime.now().minusHours(12));
        s4.setLastSuccess(LocalDateTime.now().minusHours(12));
        s4.setNextSync(LocalDateTime.now().plusDays(5));
        s4.setRecordsImported(10);
        s4.setRecordsSkipped(0);
        s4.setErrorCount(0);
        s4.setSourceBadge("OPEN DATA");
        s4.setReliabilityLevel("Official Government Source");
        dataSourceRepository.save(s4);

        DataSource s5 = new DataSource();
        s5.setSourceName("National Cyber Crime Reporting Portal Advisories");
        s5.setSourceType("HTML");
        s5.setBaseUrl("https://cybercrime.gov.in/Webform/Crime_Autho_List.aspx");
        s5.setCountry("India");
        s5.setCategory("CYBER_FRAUD");
        s5.setApiAvailable(false);
        s5.setScrapingAllowed(true);
        s5.setRobotsChecked(true);
        s5.setTermsChecked(true);
        s5.setTermsReviewedBy("SecOps Lead");
        s5.setTermsReviewedAt(LocalDateTime.now().minusDays(14));
        s5.setLicense("National Public Portal Notices");
        s5.setScrapingPermissionNotes("Public advisories on phishing domains, scam call centers, and UPI fraud patterns.");
        s5.setUpdateFrequency("DAILY");
        s5.setStatus("APPROVED");
        s5.setHealthStatus("ONLINE");
        s5.setLastSync(LocalDateTime.now().minusHours(3));
        s5.setLastSuccess(LocalDateTime.now().minusHours(3));
        s5.setNextSync(LocalDateTime.now().plusHours(21));
        s5.setRecordsImported(15);
        s5.setRecordsSkipped(2);
        s5.setErrorCount(0);
        s5.setSourceBadge("OFFICIAL");
        s5.setReliabilityLevel("Official Government Source");
        dataSourceRepository.save(s5);

        DataSource s6 = new DataSource();
        s6.setSourceName("National Press Public Safety & Crime Wire");
        s6.setSourceType("HTML");
        s6.setBaseUrl("https://thehindu.com/news/national/");
        s6.setCountry("India");
        s6.setCategory("PUBLIC_SAFETY");
        s6.setApiAvailable(false);
        s6.setScrapingAllowed(true);
        s6.setRobotsChecked(true);
        s6.setTermsChecked(true);
        s6.setTermsReviewedBy("Ethics Review Board");
        s6.setTermsReviewedAt(LocalDateTime.now().minusDays(8));
        s6.setLicense("Fair Dealing News Summaries (Sec 47 Compliance)");
        s6.setScrapingPermissionNotes("Headline and short excerpt indexing only. Full reading directed to original publication URL.");
        s6.setUpdateFrequency("HOURLY");
        s6.setStatus("APPROVED");
        s6.setHealthStatus("ONLINE");
        s6.setLastSync(LocalDateTime.now().minusHours(1));
        s6.setLastSuccess(LocalDateTime.now().minusHours(1));
        s6.setNextSync(LocalDateTime.now().plusHours(1));
        s6.setRecordsImported(9);
        s6.setRecordsSkipped(4);
        s6.setErrorCount(0);
        s6.setSourceBadge("PUBLIC NEWS");
        s6.setReliabilityLevel("Public News Source");
        dataSourceRepository.save(s6);
    }

    private void seedPublicDataRecords() {
        if (publicDataRecordRepository.count() > 0) return;

        createPubRec("CERT-IN-2026-089",
                "Advisory on Emerging UPI Screen-Sharing Trojan Campaign",
                "CERT-In advisory CIVN-2026-0089: Malicious APK targeting Android users posing as utility bill update utility. Forwards OTPs via background SMS listener.",
                "CYBER_FRAUD", LocalDate.of(2026, 9, 28), "14:30:00",
                "Tamil Nadu", "Chennai", "Chennai",
                new BigDecimal("13.082700"), new BigDecimal("80.270700"),
                2L, "CERT-In Cyber Security Public Advisories", "https://www.cert-in.org.in/advisories/CIVN-2026-0089",
                "OFFICIAL", "Official Government Source", "fp-cert-089", "SOURCE_VERIFIED");

        createPubRec("NCRB-STAT-TN-042",
                "State Aggregated Crime Trends: Cybercrime Incidents in Tamil Nadu",
                "Annual report on cyber offenses registered across Tier-1 and Tier-2 hubs. 28% increase in financial phishing; 92% detected via automated telemetry.",
                "AGGREGATE_STATISTICS", LocalDate.of(2026, 9, 15), "10:00:00",
                "Tamil Nadu", "Coimbatore", "Coimbatore",
                new BigDecimal("11.016800"), new BigDecimal("76.955800"),
                1L, "National Crime Records Bureau (NCRB) Open Data", "https://ncrb.gov.in/crime-in-india-2025",
                "OPEN DATA", "Official Government Source", "fp-ncrb-tn42", "SOURCE_VERIFIED");

        createPubRec("DELHI-POL-ADV-2026",
                "Delhi Police Public Safety Notice: GPS Tracking in Commercial Fleets",
                "Public circular by Delhi Transport & Crime Cell advising mandatory AIS-140 GPS beacons on inter-state commercial transport vehicles following coordinated thefts.",
                "VEHICLE_THEFT", LocalDate.of(2026, 9, 24), "11:15:00",
                "Delhi", "New Delhi", "New Delhi",
                new BigDecimal("28.613900"), new BigDecimal("77.209000"),
                5L, "National Cyber Crime Reporting Portal Advisories", "https://delhipolice.gov.in/safety-bulletin-2026-09",
                "OFFICIAL", "Official Government Source", "fp-delhi-gps", "SOURCE_VERIFIED");

        createPubRec("PIB-MHA-2026-192",
                "MHA Joint Enforcement Operation Against Multi-State Fake Call Centers",
                "Press release: Coordination between CBI, State Police forces, and Telecom operators dismantled 14 illegitimate call-center hubs impersonating foreign tax authorities.",
                "FINANCIAL_CRIME", LocalDate.of(2026, 9, 27), "16:45:00",
                "Maharashtra", "Mumbai", "Mumbai",
                new BigDecimal("19.076000"), new BigDecimal("72.877700"),
                3L, "PIB Home Affairs Public Safety Bulletins", "https://pib.gov.in/PressReleasePage.aspx?PRID=1984210",
                "RSS", "Official Government Source", "fp-pib-mha192", "SOURCE_VERIFIED");

        createPubRec("NEWS-TH-2026-901",
                "Public Warning Issued on High-Yield Crypto Investment Telegram Groups",
                "[The Hindu] Public safety advisory highlighting algorithmic scam tactics enticing users with promised 300% returns in private messaging channels.",
                "CYBER_FRAUD", LocalDate.of(2026, 9, 26), "09:20:00",
                "Karnataka", "Bengaluru Urban", "Bengaluru",
                new BigDecimal("12.971600"), new BigDecimal("77.594600"),
                6L, "National Press Public Safety & Crime Wire", "https://thehindu.com/news/national/karnataka/crypto-scams-advisory/article8921.ece",
                "PUBLIC NEWS", "Public News Source", "fp-news-crypto", "REQUIRES_REVIEW");

        createPubRec("PUB-NOT-HYD-771",
                "Telangana Cyber Security Bureau Issues Advisory on Part-Time Job Scams",
                "TGCSB public bulletin alerting citizens against unsolicited WhatsApp job offers involving YouTube video liking and prepaid review tasks.",
                "CYBER_FRAUD", LocalDate.of(2026, 9, 25), "15:00:00",
                "Telangana", "Hyderabad", "Hyderabad",
                new BigDecimal("17.385000"), new BigDecimal("78.486700"),
                5L, "National Cyber Crime Reporting Portal Advisories", "https://cybercrime.gov.in/bulletins/TGCSB-2026-09",
                "OFFICIAL", "Official Government Source", "fp-tgcsb-job", "SOURCE_VERIFIED");

        createPubRec("CSV-NCRB-KOL-112",
                "Port Logistics & Transit Cargo Tampering Statistics",
                "Aggregate open data: 85 cases of freight container seal discrepancies reviewed across eastern transit docks during Q2-Q3 2025.",
                "PROPERTY_CRIME", LocalDate.of(2026, 9, 20), "12:00:00",
                "West Bengal", "Kolkata", "Kolkata",
                new BigDecimal("22.572600"), new BigDecimal("88.363900"),
                4L, "State Crime Trends & District Metrics", "https://data.gov.in/resource/state-crime-trends-csv",
                "OPEN DATA", "Official Government Source", "fp-kol-cargo", "SOURCE_VERIFIED");

        createPubRec("CERT-IN-2026-095",
                "Vulnerability Note: SIM Swap Deception on Banking Portals",
                "Advisory on telecommunication social engineering techniques used to execute unauthorized e-SIM provisioning and intercept 2FA prompts.",
                "DATA_BREACH", LocalDate.of(2026, 9, 29), "08:15:00",
                "Delhi", "South Delhi", "New Delhi",
                new BigDecimal("28.535500"), new BigDecimal("77.241000"),
                2L, "CERT-In Cyber Security Public Advisories", "https://www.cert-in.org.in/advisories/CIVN-2026-0095",
                "OFFICIAL", "Official Government Source", "fp-cert-simswap", "SOURCE_VERIFIED");

        createPubRec("NCRB-STAT-MH-081",
                "Maharashtra Commercial Vehicle Theft Corridor Analysis",
                "State aggregate statistics: 640 light and medium transport vehicles targeted across national highways; automated toll FASTag tracking assisted 54% recoveries.",
                "VEHICLE_THEFT", LocalDate.of(2026, 9, 18), "17:30:00",
                "Maharashtra", "Pune", "Pune",
                new BigDecimal("18.520400"), new BigDecimal("73.856700"),
                1L, "National Crime Records Bureau (NCRB) Open Data", "https://ncrb.gov.in/crime-in-india-2025",
                "OPEN DATA", "Official Government Source", "fp-mh-corridor", "SOURCE_VERIFIED");

        createPubRec("PIB-MHA-2026-210",
                "Interstate Property Recovery Coordination Conference Summary",
                "Official press release on nationwide coordination mechanisms for tracing stolen industrial machinery and valuable electronics across state jurisdictions.",
                "PROPERTY_CRIME", LocalDate.of(2026, 9, 22), "13:00:00",
                "Gujarat", "Ahmedabad", "Ahmedabad",
                new BigDecimal("23.022500"), new BigDecimal("72.571400"),
                3L, "PIB Home Affairs Public Safety Bulletins", "https://pib.gov.in/PressReleasePage.aspx?PRID=1985102",
                "RSS", "Official Government Source", "fp-pib-prop210", "SOURCE_VERIFIED");
    }

    private void createPubRec(String extId, String title, String desc, String cat, LocalDate date, String time,
                              String state, String dist, String city, BigDecimal lat, BigDecimal lon,
                              Long srcId, String srcName, String srcUrl, String badge, String reliability,
                              String fp, String status) {
        PublicDataRecord r = new PublicDataRecord();
        r.setExternalId(extId);
        r.setTitle(title);
        r.setDescription(desc);
        r.setCategory(cat);
        r.setEventDate(date);
        r.setEventTime(time);
        r.setState(state);
        r.setDistrict(dist);
        r.setCity(city);
        r.setLatitude(lat);
        r.setLongitude(lon);
        r.setSourceId(srcId);
        r.setSourceName(srcName);
        r.setSourceUrl(srcUrl);
        r.setSourceBadge(badge);
        r.setDataOrigin("REAL_PUBLIC");
        r.setReliabilityLevel(reliability);
        r.setFingerprint(fp);
        r.setVerificationStatus(status);
        r.setRetrievedAt(LocalDateTime.now().minusHours(12));
        publicDataRecordRepository.save(r);
    }

    private void seedScraperLogs() {
        if (scraperLogRepository.count() > 0) return;

        createLog(1L, "National Crime Records Bureau (NCRB) Open Data", LocalDateTime.now().minusHours(8), LocalDateTime.now().minusHours(8).plusSeconds(3), "SUCCESS", 1, 14, 14, 0, 2, 0, null);
        createLog(2L, "CERT-In Cyber Security Public Advisories", LocalDateTime.now().minusHours(4), LocalDateTime.now().minusHours(4).plusSeconds(2), "SUCCESS", 1, 18, 18, 0, 3, 0, null);
        createLog(3L, "PIB Home Affairs Public Safety Bulletins", LocalDateTime.now().minusHours(6), LocalDateTime.now().minusHours(6).plusSeconds(4), "SUCCESS", 1, 12, 12, 0, 1, 0, null);
        createLog(4L, "State Crime Trends & District Metrics", LocalDateTime.now().minusHours(12), LocalDateTime.now().minusHours(12).plusSeconds(1), "SUCCESS", 1, 10, 10, 0, 0, 0, null);
        createLog(5L, "National Cyber Crime Reporting Portal Advisories", LocalDateTime.now().minusHours(3), LocalDateTime.now().minusHours(3).plusSeconds(2), "SUCCESS", 1, 15, 15, 0, 2, 0, null);
        createLog(6L, "National Press Public Safety & Crime Wire", LocalDateTime.now().minusHours(1), LocalDateTime.now().minusHours(1).plusSeconds(2), "SUCCESS", 1, 9, 9, 0, 4, 0, null);
    }

    private void createLog(Long srcId, String srcName, LocalDateTime start, LocalDateTime end, String status, int reqs, int found, int created, int updated, int skipped, int errors, String errMsg) {
        ScraperLog l = new ScraperLog();
        l.setSourceId(srcId);
        l.setSourceName(srcName);
        l.setStartTime(start);
        l.setEndTime(end);
        l.setStatus(status);
        l.setRequestsSent(reqs);
        l.setRecordsFound(found);
        l.setRecordsCreated(created);
        l.setRecordsUpdated(updated);
        l.setRecordsSkipped(skipped);
        l.setErrors(errors);
        l.setErrorMessage(errMsg);
        scraperLogRepository.save(l);
    }
}

