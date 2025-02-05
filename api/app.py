"""Building the app."""

from flask import Flask
from flask_cors import CORS
import os

class Config(object):
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization", "Origin", "Accept", "X-Requested-With"], "expose_headers": ["Content-Type", "Authorization"], "supports_credentials": True}})
app.config.from_object(Config())

import routes
