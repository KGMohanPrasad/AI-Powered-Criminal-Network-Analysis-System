"""
Data Normalizer (Section 16)
Normalizes dates (YYYY-MM-DD), times (HH:mm:ss), Indian states/districts,
and maps crime categories to standardized internal enums while preserving raw input.
"""
import re
from datetime import datetime
from dateutil import parser as date_parser
from typing import Optional, Tuple

INDIAN_STATES_CANONICAL = {
    "andhra pradesh": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh",
    "goa": "Goa",
    "gujarat": "Gujarat",
    "haryana": "Haryana",
    "himachal pradesh": "Himachal Pradesh",
    "jharkhand": "Jharkhand",
    "karnataka": "Karnataka",
    "kerala": "Kerala",
    "madhya pradesh": "Madhya Pradesh",
    "maharashtra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",
    "odisha": "Odisha",
    "orissa": "Odisha",
    "punjab": "Punjab",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",
    "tamilnadu": "Tamil Nadu",
    "tn": "Tamil Nadu",
    "telangana": "Telangana",
    "tripura": "Tripura",
    "uttar pradesh": "Uttar Pradesh",
    "up": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",
    "west bengal": "West Bengal",
    "wb": "West Bengal",
    "delhi": "Delhi",
    "nct of delhi": "Delhi",
    "new delhi": "Delhi",
    "jammu and kashmir": "Jammu and Kashmir",
    "ladakh": "Ladakh",
    "chandigarh": "Chandigarh",
    "puducherry": "Puducherry",
    "pondicherry": "Puducherry"
}

CATEGORY_MAPPINGS = {
    # Cybercrime & Cyber Fraud
    "cyber fraud": "CYBER_FRAUD",
    "cybercrime": "CYBER_FRAUD",
    "online scam": "CYBER_FRAUD",
    "internet fraud": "CYBER_FRAUD",
    "phishing": "CYBER_FRAUD",
    "otp scam": "CYBER_FRAUD",
    "upi fraud": "CYBER_FRAUD",
    "banking fraud": "CYBER_FRAUD",
    "identity theft": "CYBER_FRAUD",
    "ransomware": "CYBER_FRAUD",

    # Financial Crime
    "financial crime": "FINANCIAL_CRIME",
    "money laundering": "FINANCIAL_CRIME",
    "ponzi scheme": "FINANCIAL_CRIME",
    "tax evasion": "FINANCIAL_CRIME",
    "economic offences": "FINANCIAL_CRIME",
    "cheating": "FINANCIAL_CRIME",

    # Vehicle Theft
    "vehicle theft": "VEHICLE_THEFT",
    "auto theft": "VEHICLE_THEFT",
    "stolen vehicle": "VEHICLE_THEFT",
    "motor vehicle theft": "VEHICLE_THEFT",

    # Property Crime
    "property crime": "PROPERTY_CRIME",
    "burglary": "PROPERTY_CRIME",
    "theft": "PROPERTY_CRIME",
    "robbery": "PROPERTY_CRIME",
    "extortion": "PROPERTY_CRIME",
    "house break-in": "PROPERTY_CRIME",

    # Public Safety & Alerts
    "public safety": "PUBLIC_SAFETY",
    "safety bulletin": "PUBLIC_SAFETY",
    "safety alert": "PUBLIC_SAFETY",
    "traffic advisory": "PUBLIC_SAFETY",
    "advisory": "PUBLIC_SAFETY",
    "citizen advisory": "PUBLIC_SAFETY",

    # Data Breach
    "data breach": "DATA_BREACH",
    "credential leak": "DATA_BREACH",
    "data leak": "DATA_BREACH",
    "unauthorized access": "DATA_BREACH",

    # Police Announcement
    "police announcement": "POLICE_ANNOUNCEMENT",
    "press release": "POLICE_ANNOUNCEMENT",
    "official circular": "POLICE_ANNOUNCEMENT",
    "public notice": "POLICE_ANNOUNCEMENT",

    # Aggregate Statistics
    "crime statistics": "AGGREGATE_STATISTICS",
    "ncrb statistics": "AGGREGATE_STATISTICS",
    "annual report": "AGGREGATE_STATISTICS",
    "open data metrics": "AGGREGATE_STATISTICS"
}

def normalize_date(raw_date: Optional[str]) -> Optional[str]:
    """
    Parses various date formats and normalizes to YYYY-MM-DD.
    """
    if not raw_date:
        return None
    try:
        dt = date_parser.parse(str(raw_date))
        return dt.strftime("%Y-%m-%d")
    except Exception:
        # Fallback regex search for YYYY-MM-DD or DD-MM-YYYY
        m = re.search(r'(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})', str(raw_date))
        if m:
            return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
        return None

def normalize_time(raw_time: Optional[str]) -> Optional[str]:
    """
    Normalizes time to HH:mm:ss.
    """
    if not raw_time:
        return None
    try:
        dt = date_parser.parse(str(raw_time))
        return dt.strftime("%H:%M:%S")
    except Exception:
        m = re.search(r'(\d{1,2}):(\d{2})(?::(\d{2}))?', str(raw_time))
        if m:
            h = int(m.group(1))
            m_val = int(m.group(2))
            s = int(m.group(3)) if m.group(3) else 0
            return f"{h:02d}:{m_val:02d}:{s:02d}"
        return None

def normalize_state(raw_state: Optional[str]) -> Optional[str]:
    """
    Standardizes state name against canonical Indian states and Union Territories.
    """
    if not raw_state:
        return None
    cleaned = raw_state.strip().lower()
    return INDIAN_STATES_CANONICAL.get(cleaned, raw_state.strip().title())

def normalize_district(raw_district: Optional[str]) -> Optional[str]:
    """
    Cleans district string and formats nicely.
    """
    if not raw_district:
        return None
    d = raw_district.strip().title()
    # Strip suffixes like "District" or "Dist."
    d = re.sub(r'\s+District$', '', d, flags=re.IGNORECASE)
    d = re.sub(r'\s+Dist\.?$', '', d, flags=re.IGNORECASE)
    return d.strip()

def normalize_category(raw_category: Optional[str]) -> Tuple[str, str]:
    """
    Returns (normalized_internal_category, original_raw_category).
    """
    if not raw_category:
        return ("PUBLIC_SAFETY", "General Public Notice")

    raw_str = str(raw_category).strip()
    raw_lower = raw_str.lower()

    for key, mapped in CATEGORY_MAPPINGS.items():
        if key in raw_lower:
            return (mapped, raw_str)

    # Default fallback
    return ("PUBLIC_SAFETY", raw_str)
