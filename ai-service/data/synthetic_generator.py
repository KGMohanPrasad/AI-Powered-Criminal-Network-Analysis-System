"""
Synthetic Dataset Generator for Academic AIML Criminal Network Analysis
Generates:
- 100 Persons with realistic attributes, aliases, roles
- 30 Cases with classifications, priorities, statuses
- 350+ Relationships with varying strength levels and connection types
- 25 Organizations with types and addresses
- 50 Vehicles with demo registrations
- 100 Incidents across locations
- 500 Communication records
- 150 Location records
All entities are strictly synthetic/fictional for demonstration purposes.
"""
import json
import random
from datetime import datetime, timedelta

random.seed(42)

FIRST_NAMES = [
    "Aarav", "Vikram", "Rohan", "Sanjay", "Karthik", "Arjun", "Aditya", "Dev", "Rahul", "Naveen",
    "Siddharth", "Manoj", "Pradeep", "Ashok", "Suresh", "Ramesh", "Deepak", "Vivek", "Gautam", "Alok",
    "Priya", "Ananya", "Meera", "Kavya", "Divya", "Sneha", "Pooja", "Swati", "Ritu", "Neha"
]

LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Reddy", "Nair", "Iyer", "Rao", "Kumar", "Singh", "Menon",
    "Gupta", "Deshmukh", "Chopra", "Malhotra", "Mehta", "Bose", "Das", "Pillai", "Joshi", "Kulkarni"
]

ALIASES = [
    "Shadow", "Falcon", "Whisper", "Viper", "Ghost", "Cipher", "Phoenix", "Titan", "Echo", "Apex",
    "Raven", "Blade", "Mirage", "Stryker", "Onyx", "Spectre", "Cobra", "Drifter", "Anchor", "Vector"
]

CITIES = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode"]

ORG_TYPES = ["Logistics Firm", "Import-Export Agency", "Auto Workshop", "Financial Consultancy", "Security Services", "Warehouse Operations"]

CASE_TYPES = ["Warehouse Theft", "Cargo Smuggling", "Counterfeit Distribution", "Financial Fraud", "Vehicle Syndicate", "Cyber Espionage"]

REL_TYPES = ["ASSOCIATED_WITH", "WORKS_FOR", "COMMUNICATED_WITH", "OWNS", "SEEN_AT", "INVOLVED_IN_CASE", "WITNESS_TO"]


def generate_synthetic_dataset():
    # 1. Generate 100 Persons
    persons = []
    for i in range(1, 101):
        pid = f"DEMO-P{i:03d}"
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        alias = random.choice(ALIASES) if random.random() < 0.6 else "None"
        age = random.randint(22, 60)
        gender = "Male" if fn in FIRST_NAMES[:20] else "Female"
        city = random.choice(CITIES)
        status = random.choice(["SUSPECT", "PERSON_OF_INTEREST", "ASSOCIATE", "WITNESS", "CLEARED"])
        persons.append({
            "id": pid,
            "name": f"{fn} {ln}",
            "alias": alias,
            "age": age,
            "gender": gender,
            "location": f"{city}, Tamil Nadu",
            "status": status,
            "cases": [],
            "organizations": [],
            "locations": []
        })

    # 2. Generate 30 Cases
    cases = []
    start_date = datetime(2026, 1, 15)
    for i in range(1, 31):
        cid = f"CASE-2026-{i:03d}"
        ctype = random.choice(CASE_TYPES)
        prio = random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        stat = random.choice(["NEW", "ACTIVE", "UNDER_INVESTIGATION", "REVIEW", "CLOSED"])
        c_date = (start_date + timedelta(days=i * 7)).strftime("%Y-%m-%d")
        cases.append({
            "id": i,
            "caseNumber": cid,
            "caseName": f"{ctype} Investigation - Sector {i}",
            "category": ctype,
            "priority": prio,
            "status": stat,
            "createdDate": c_date,
            "investigator": f"Lead Inv. {random.choice(FIRST_NAMES)}",
            "person_count": 0,
            "evidence_count": 0,
            "vehicle_count": 0,
            "incident_count": 0,
            "organization_count": 0
        })

    # 3. Generate 25 Organizations
    orgs = []
    for i in range(1, 26):
        oid = f"DEMO-ORG{i:03d}"
        otype = random.choice(ORG_TYPES)
        city = random.choice(CITIES)
        orgs.append({
            "id": oid,
            "name": f"{random.choice(LAST_NAMES)} {otype}",
            "type": otype,
            "address": f"Plot #{random.randint(10, 500)}, Industrial Estate, {city}",
            "status": "ACTIVE"
        })

    # 4. Generate 50 Vehicles
    vehicles = []
    for i in range(1, 51):
        vid = f"DEMO-VEH{i:03d}"
        vreg = f"TN-{random.randint(1, 99):02d}-DEMO-{i:03d}"
        vehicles.append({
            "id": vid,
            "registrationNumber": vreg,
            "brand": random.choice(["Toyota", "Hyundai", "Tata", "Mahindra", "Maruti Suzuki"]),
            "model": random.choice(["SUV-2024", "Sedan-EX", "Van-Cargo", "Pickup-4x4"]),
            "color": random.choice(["Black", "Silver", "White", "Navy Blue", "Dark Grey"]),
            "status": random.choice(["ACTIVE", "SURVEILLED", "IMPOUNDED"])
        })

    # 5. Generate 150 Locations
    locations = []
    for i in range(1, 151):
        lid = f"DEMO-LOC{i:03d}"
        city = random.choice(CITIES)
        lat = round(11.0 + random.uniform(0.1, 2.5), 6)
        lng = round(77.0 + random.uniform(0.1, 2.5), 6)
        locations.append({
            "id": lid,
            "code": lid,
            "name": f"{city} Sector {i % 15 + 1} Point",
            "address": f"Site #{i * 3}, Highway Corridor",
            "city": city,
            "district": city,
            "state": "Tamil Nadu",
            "latitude": lat,
            "longitude": lng
        })

    # 6. Generate 100 Incidents
    incidents = []
    for i in range(1, 101):
        iid = f"INC-2026-{i:04d}"
        assigned_case = random.choice(cases)
        assigned_loc = random.choice(locations)
        assigned_case["incident_count"] += 1
        incidents.append({
            "id": i,
            "incidentNumber": iid,
            "incidentType": assigned_case["category"],
            "incidentDate": (start_date + timedelta(days=random.randint(5, 200))).strftime("%Y-%m-%d"),
            "location": assigned_loc["name"],
            "caseId": assigned_case["id"],
            "status": random.choice(["REPORTED", "UNDER_ANALYSIS", "RESOLVED"])
        })

    # 7. Generate 350+ Relationships with Realistic Community Clustering & Bridge Nodes
    # Structure:
    # - 3 Dense Clusters (Cluster 1: nodes 1-35, Cluster 2: nodes 36-70, Cluster 3: nodes 71-95)
    # - Outliers: nodes 96-100 (sparsely connected)
    # - Bridge Nodes: node 15, node 45, node 75
    relationships = []
    rel_id = 1

    # Dense internal edges for Cluster 1 (1-35)
    for _ in range(120):
        u = random.randint(1, 35)
        v = random.randint(1, 35)
        if u != v:
            relationships.append({
                "id": rel_id,
                "source": f"DEMO-P{u:03d}",
                "target": f"DEMO-P{v:03d}",
                "type": random.choice(["ASSOCIATED_WITH", "COMMUNICATED_WITH", "WORKS_FOR"]),
                "strength": random.choice(["MEDIUM", "STRONG", "VERIFIED"]),
                "weight": random.uniform(0.6, 1.0)
            })
            rel_id += 1

    # Dense internal edges for Cluster 2 (36-70)
    for _ in range(120):
        u = random.randint(36, 70)
        v = random.randint(36, 70)
        if u != v:
            relationships.append({
                "id": rel_id,
                "source": f"DEMO-P{u:03d}",
                "target": f"DEMO-P{v:03d}",
                "type": random.choice(["ASSOCIATED_WITH", "COMMUNICATED_WITH", "OWNS"]),
                "strength": random.choice(["MEDIUM", "STRONG", "VERIFIED"]),
                "weight": random.uniform(0.6, 1.0)
            })
            rel_id += 1

    # Dense internal edges for Cluster 3 (71-95)
    for _ in range(90):
        u = random.randint(71, 95)
        v = random.randint(71, 95)
        if u != v:
            relationships.append({
                "id": rel_id,
                "source": f"DEMO-P{u:03d}",
                "target": f"DEMO-P{v:03d}",
                "type": random.choice(["ASSOCIATED_WITH", "COMMUNICATED_WITH", "INVOLVED_IN_CASE"]),
                "strength": random.choice(["MEDIUM", "STRONG", "VERIFIED"]),
                "weight": random.uniform(0.6, 1.0)
            })
            rel_id += 1

    # Bridge edges connecting Cluster 1 <-> Cluster 2 via Bridge Node DEMO-P015 and DEMO-P045
    for target in [38, 42, 45, 50, 55]:
        relationships.append({
            "id": rel_id,
            "source": "DEMO-P015",
            "target": f"DEMO-P{target:03d}",
            "type": "ASSOCIATED_WITH",
            "strength": "STRONG",
            "weight": 0.95
        })
        rel_id += 1

    # Bridge edges connecting Cluster 2 <-> Cluster 3 via Bridge Node DEMO-P045 and DEMO-P075
    for target in [72, 75, 80, 85]:
        relationships.append({
            "id": rel_id,
            "source": "DEMO-P045",
            "target": f"DEMO-P{target:03d}",
            "type": "COMMUNICATED_WITH",
            "strength": "STRONG",
            "weight": 0.92
        })
        rel_id += 1

    # Connect people to Organizations
    for p in persons[:60]:
        assigned_org = random.choice(orgs)
        p["organizations"].append(assigned_org["id"])
        relationships.append({
            "id": rel_id,
            "source": p["id"],
            "target": assigned_org["id"],
            "type": "WORKS_FOR",
            "strength": "STRONG",
            "weight": 0.85
        })
        rel_id += 1

    # Connect cases to persons
    for c in cases:
        sample_persons = random.sample(persons, random.randint(2, 6))
        c["person_count"] = len(sample_persons)
        c["evidence_count"] = random.randint(3, 10)
        c["vehicle_count"] = random.randint(1, 4)
        c["organization_count"] = random.randint(1, 3)
        for p in sample_persons:
            p["cases"].append(c["caseNumber"])
            relationships.append({
                "id": rel_id,
                "source": p["id"],
                "target": c["caseNumber"],
                "type": "INVOLVED_IN_CASE",
                "strength": "VERIFIED",
                "weight": 1.0
            })
            rel_id += 1

    # 8. Generate 500 Communication records
    communications = []
    comm_types = ["CALL", "MESSAGE", "EMAIL", "MEETING"]
    for i in range(1, 501):
        u = random.choice(persons)
        v = random.choice(persons)
        while u["id"] == v["id"]:
            v = random.choice(persons)
        c_time = (start_date + timedelta(days=random.randint(1, 220), minutes=random.randint(0, 1440))).strftime("%Y-%m-%d %H:%M")
        communications.append({
            "id": i,
            "sourcePerson": u["id"],
            "destinationPerson": v["id"],
            "communicationType": random.choice(comm_types),
            "timestamp": c_time,
            "durationSeconds": random.randint(15, 1800),
            "status": "LOGGED"
        })

    dataset = {
        "metadata": {
            "title": "Academic Synthetic Criminal Investigation Network",
            "version": "2.0-academic",
            "generated_at": datetime.now().isoformat(),
            "total_persons": len(persons),
            "total_cases": len(cases),
            "total_organizations": len(orgs),
            "total_vehicles": len(vehicles),
            "total_locations": len(locations),
            "total_incidents": len(incidents),
            "total_relationships": len(relationships),
            "total_communications": len(communications),
            "disclaimer": "All entities, names, cases, and interactions are 100% synthetic/fictional for educational and academic machine learning research."
        },
        "persons": persons,
        "cases": cases,
        "organizations": orgs,
        "vehicles": vehicles,
        "locations": locations,
        "incidents": incidents,
        "relationships": relationships,
        "communications": communications
    }

    return dataset


if __name__ == "__main__":
    data = generate_synthetic_dataset()
    with open("ai-service/data/synthetic_network.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated synthetic dataset: {data['metadata']['total_persons']} persons, {data['metadata']['total_relationships']} relationships, {data['metadata']['total_cases']} cases.")
