
from flask import jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.supabase_client import supabase
from app import app
from utils import (
    calculate_construction_year_diff,
    generate_vin,
    calculate_co2_emissions,
    normalize_risk_score,
    generate_license,
    format_past_claims,
    get_mock_status
)

def generate_accident_description(claim_type):
  
    descriptions = {
        'collision': 'Vehicle collision occurred resulting in damage to the insured vehicle. Incident requires assessment of damage and liability.',
        'theft': 'Vehicle was reported stolen. Case requires police report and investigation of circumstances.',
        'natural_disaster': 'Vehicle damaged due to natural events such as flood, hail, or storm. Assessment needed for extent of damage.',
        'vandalism': 'Vehicle was subject to intentional damage by unknown parties. Police report and damage assessment required.',
        'mechanical': 'Mechanical failure led to vehicle damage. Technical inspection and repair assessment needed.'
    }
    return descriptions.get(claim_type, 'Claim requires investigation and assessment of damages.')

@app.route('/claims/<int:claim_id>', methods=['GET'])
def get_claim_by_id(claim_id):
    """Returns detailed information about a specific claim."""
    
    try:
    
        claim = supabase.table('claims').select('*').eq('id', claim_id).single().execute()
   

        if not claim.data:
            return jsonify({'error': 'Claim not found'}), 404
            
     
        insurance = supabase.table('insurances').select('*').eq('insurance_id', claim.data['insurance_id']).single().execute()
    
        
        application = supabase.table('applications').select('first_name,last_name').eq('application_id', claim.data['application_id']).single().execute()
       
        result = {
            'id': claim.data['id'],
            'insurance_id': claim.data['insurance_id'],
            'claim_type': claim.data['claim_type'],
            'accident_description': generate_accident_description(claim.data['claim_type']),
            'insurance_type': insurance.data['insurance_type'] if insurance.data else 'Unknown',
            'insurance_end_date' : insurance.data['date_end'],
            'claimant_name': f"{application.data['first_name']} {application.data['last_name']}".strip() if application.data else 'Unknown'
        }
        
        return jsonify(result)
    except Exception as e:
        print(f"Error in get_claim_by_id: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/applications', methods=['GET'])
def get_all_applications():
   

    try:
     
        applications = supabase.table('applications').select('*').execute()
        result = []

        for application in applications.data:
          
        
                customer = supabase.table('applications').select('first_name,last_name,request_type').eq('application_id', application['application_id']).single().execute()
           
            
                result.append({
                'id': application['application_id'],
                'name': f"{customer.data['first_name']} {customer.data['last_name']}",
                'category': customer.data['request_type'],
                'insurance_type': application['insurance_type'],
                'status': get_mock_status()
                })

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


  
    descriptions = {
        'collision': 'Vehicle collision occurred resulting in damage to the insured vehicle. Incident requires assessment of damage and liability.',
        'theft': 'Vehicle was reported stolen. Case requires police report and investigation of circumstances.',
        'natural_disaster': 'Vehicle damaged due to natural events such as flood, hail, or storm. Assessment needed for extent of damage.',
        'vandalism': 'Vehicle was subject to intentional damage by unknown parties. Police report and damage assessment required.',
        'mechanical': 'Mechanical failure led to vehicle damage. Technical inspection and repair assessment needed.'
    }
    return descriptions.get(claim_type, 'Claim requires investigation and assessment of damages.')

 
    
    try:
        # Get claim details
        claim = supabase.table('claims').select('*').eq('claim_id', claim_id).single().execute()
        
        if not claim.data:
            return jsonify({'error': 'Claim not found'}), 404
            
        # Get insurance details
        insurance = supabase.table('insurances').select('*').eq('insurance_id', claim.data['insurance_id']).single().execute()
        
        # Get application details for additional context
        application = supabase.table('applications').select('first_name,last_name').eq('application_id', claim.data['application_id']).single().execute()
        
        result = {
            'id': claim.data['claim_id'],
            'insurance_id': claim.data['insurance_id'],
            'claim_type': claim.data['claim_type'],
            'accident_description': generate_accident_description(claim.data['claim_type']),
            'insurance_type': insurance.data['insurance_type'] if insurance.data else 'Unknown',
            'claimant_name': f"{application.data['first_name']} {application.data['last_name']}".strip() if application.data else 'Unknown'
        }
        
        return jsonify(result)
    except Exception as e:
        print(f"Error in get_claim_by_id: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/applications/<int:application_id>', methods=['GET'])
def get_application_by_id(application_id):
    """Returns the application by its ID with comprehensive risk assessment."""

    try:
        
        application = supabase.table('applications').select('*').eq('application_id', application_id).limit(1).execute()

        if not application.data or len(application.data) == 0:
            return jsonify({'error': 'Application not found'}), 404

        application_data = application.data[0]

      
        vehicle = supabase.table('vehicles').select('*').eq('application_id', application_data['application_id']).limit(1).execute()

        if not vehicle.data or len(vehicle.data) == 0:
            return jsonify({'error': 'Vehicle not found'}), 404

        vehicle_data = vehicle.data[0]
            
     
        vehicle_risk_assessment = {
            'vehicle_name': f"{vehicle_data.get('vehicle_manufacturer', '')} {vehicle_data.get('vehicle_model', '')}".strip(),
            'construction_year_diff': calculate_construction_year_diff(vehicle_data.get('construction_year')),
            'vin': generate_vin(),
            'co2_emissions': calculate_co2_emissions(vehicle_data.get('fuel_type')),
            'risk_score': normalize_risk_score(vehicle_data.get('vehicle_risk'))
        }

       
        driver_risk_assessment = {
            'name': f"{application_data.get('first_name', '')} {application_data.get('last_name', '')}".strip(),
            'license': generate_license(),
            'age': application_data.get('age'),
            'past_claims': format_past_claims(),
            'risk_score': normalize_risk_score(application_data.get('driver_risk'))
        }

        result = {
            'id': application_data['application_id'],
            'vehicle_risk_assessment': vehicle_risk_assessment,
            'driver_risk_assessment': driver_risk_assessment
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



    descriptions = {
        'collision': 'Vehicle collision occurred resulting in damage to the insured vehicle. Incident requires assessment of damage and liability.',
        'theft': 'Vehicle was reported stolen. Case requires police report and investigation of circumstances.',
        'natural_disaster': 'Vehicle damaged due to natural events such as flood, hail, or storm. Assessment needed for extent of damage.',
        'vandalism': 'Vehicle was subject to intentional damage by unknown parties. Police report and damage assessment required.',
        'mechanical': 'Mechanical failure led to vehicle damage. Technical inspection and repair assessment needed.'
    }
    return descriptions.get(claim_type, 'Claim requires investigation and assessment of damages.')


    
    try:
        
        claim = supabase.table('claims').select('*').eq('claim_id', claim_id).single().execute()
        
        if not claim.data:
            return jsonify({'error': 'Claim not found'}), 404
            
     
        insurance = supabase.table('insurances').select('*').eq('insurance_id', claim.data['insurance_id']).single().execute()
        
        
        application = supabase.table('applications').select('first_name,last_name').eq('application_id', claim.data['application_id']).single().execute()
        
        result = {
            'id': claim.data['claim_id'],
            'insurance_id': claim.data['insurance_id'],
            'claim_type': claim.data['claim_type'],
            'accident_description': generate_accident_description(claim.data['claim_type']),
            'insurance_type': insurance.data['insurance_type'] if insurance.data else 'Unknown',
            'claimant_name': f"{application.data['first_name']} {application.data['last_name']}".strip() if application.data else 'Unknown'
        }
        
        return jsonify(result)
    except Exception as e:
        print(f"Error in get_claim_by_id: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/claims', methods=['GET'])
def get_all_claim_requests():
    """Returns a list of all claim requests with essential fields only."""

    try:
       
        claims = supabase.table('claims').select('*').execute()
        
        if not claims.data:
            return jsonify([]), 200

        result = []
        for claim in claims.data:
            try:
                
                application = supabase.table('applications').select('first_name,last_name').eq('application_id', claim.get('application_id')).single().execute()
                
               
                insurance = supabase.table('insurances').select('insurance_type').eq('insurance_id', claim.get('insurance_id')).single().execute()
                
                if application.data and insurance.data:
                    result.append({
                        'claim_id': claim.get('id'),
                        'applicant_name': f"{application.data.get('first_name', '')} {application.data.get('last_name', '')}".strip(),
                        'claim_type': claim.get('claim_type'),
                        'insurance_type': insurance.data.get('insurance_type', 'Unknown'),
                        'approval_status':claim.get('approval_status')
                    })
            except Exception as inner_e:
                # Log the error but continue processing other claims
                print(f"Error processing claim {claim.get('application_id')}: {str(inner_e)}")
                continue

        return jsonify(result)
    except Exception as e:
        print(f"Error in get_all_claim_requests: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


