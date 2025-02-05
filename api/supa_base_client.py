import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Get environment variables
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')

supabase: Client = create_client(
    supabase_url=supabase_url,
    supabase_key=supabase_key,
  
)