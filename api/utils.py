from datetime import datetime
import random
import string

def calculate_construction_year_diff(construction_year):
    
    if not construction_year:
        return random.randint(0, 15)
    current_year = datetime.now().year
    return current_year - construction_year

def generate_vin():
    """Generate a random VIN number."""
    # First 3 characters (World Manufacturer Identifier)
    wmi = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
    # Vehicle attributes (5 characters)
    attributes = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    # Check digit
    check_digit = random.choice(string.digits)
    # Model year
    year = random.choice(string.ascii_uppercase)
    # Plant code
    plant = random.choice(string.ascii_uppercase)
    # Sequential number
    sequence = ''.join(random.choices(string.digits, k=6))
    return f"{wmi}{attributes}{check_digit}{year}{plant}{sequence}"

def calculate_co2_emissions(fuel_type):
    
    if not fuel_type or fuel_type.lower() == 'electric':
        return '0g/km'
    elif fuel_type.lower() == 'diesel':
        return f"{random.randint(120, 200)}g/km"
    else:  
        return f"{random.randint(95, 165)}g/km"

def normalize_risk_score(score, from_range=(0, 1), to_range=(1, 10)):
    
    if score is None:
        return random.randint(to_range[0], to_range[1])
    
    from_min, from_max = from_range
    to_min, to_max = to_range
    
    # First normalize to target range
    normalized = (score - from_min) / (from_max - from_min)
    # Then scale to target range and round to nearest integer
    return round(to_min + (normalized * (to_max - to_min)))

def generate_license():
   
    part1 = ''.join(random.choices(string.ascii_uppercase, k=4))
    return f"License: XXXXX-{part1}-XXXXX"

def format_past_claims():
    
    incidents = random.randint(0, 5)
    years = random.randint(1, 5)
    return {
        'incidents': incidents,
        'period': f'Last {years} years'
    }

def get_mock_status():
    
    return random.choice(["Pending", "Approved", "Declined", "Further Review Required"])