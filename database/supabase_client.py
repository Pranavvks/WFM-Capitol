"""Supabase client configuration."""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Get environment variables
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')

# Verify environment variables
if not supabase_url or not supabase_key:
    raise Exception("SUPABASE_URL and SUPABASE_KEY must be set in .env file")

# Initialize Supabase client
supabase: Client = create_client(
    supabase_url=supabase_url,
    supabase_key=supabase_key
)