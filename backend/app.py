from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import json
import sqlite3 # Keeping for now to avoid breaking if referenced elsewhere, but unused
from datetime import datetime
import re
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Mock Firestore for local development without keys
class MockFirestore:
    def __init__(self):
        self.db_file = 'local_firestore.json'
        # Create file if it doesn't exist
        if not os.path.exists(self.db_file):
            with open(self.db_file, 'w') as f:
                json.dump({'pre_bookings': []}, f)
                
    def collection(self, name):
        return MockCollection(name, self.db_file)

class MockCollection:
    def __init__(self, name, db_file):
        self.name = name
        self.db_file = db_file
        
    def add(self, data):
        try:
            with open(self.db_file, 'r') as f:
                db = json.load(f)
        except:
             db = {}
             
        if self.name not in db: db[self.name] = []
        
        # Simulate ID and Timestamp
        data['id'] = f"mock_{int(datetime.now().timestamp())}_{len(db[self.name])}"
        # Handle datetime serialization for JSON
        if 'timestamp' in data and isinstance(data['timestamp'], datetime):
            data['timestamp'] = data['timestamp'].isoformat()
            
        db[self.name].append(data)
        
        with open(self.db_file, 'w') as f:
            json.dump(db, f, indent=2)
            
        return None, MockDocRef(data['id'])
        
    def where(self, field, op, value):
        # Simple mock query support for check duplicate
        try:
            with open(self.db_file, 'r') as f:
                db = json.load(f)
        except:
            db = {}
            
        items = db.get(self.name, [])
        results = [i for i in items if i.get(field) == value]
        return MockQuery(results)
            
    def stream(self):
        try:
            with open(self.db_file, 'r') as f:
                db = json.load(f)
        except:
            return []
            
        items = db.get(self.name, [])
        return [MockDocSnapshot(i) for i in items]

class MockDocRef:
    def __init__(self, id): self.id = id

class MockQuery:
    def __init__(self, items): self.items = items
    def limit(self, n): return self
    def get(self): return self.items

class MockDocSnapshot:
    def __init__(self, data):
        self._data = data
        self.id = data.get('id')
    def to_dict(self): return self._data

# Initialize Firebase or Mock
db = None
try:
    if os.path.exists("serviceAccountKey.json"):
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("🔥 Firebase initialized successfully (Production Mode)!")
    else:
        raise FileNotFoundError("Missing serviceAccountKey.json")
except Exception as e:
    print(f"⚠️ Firebase Key missing: {e}")
    print("⚠️ Switching to LOCAL MOCK DATABASE (saved to local_firestore.json)")
    db = MockFirestore()

@app.route('/')
def index():
    return send_from_directory('templates', 'index.html')

@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('static/assets', path)

# Database configuration
DATABASE = 'yu_prebookings.db'

def validate_email(email):
    """Validate email format"""
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number (minimum 8 characters)"""
    # Remove spaces and special characters for validation
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    return len(cleaned) >= 8

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'YU Oxygen Pre-booking API',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/prebook', methods=['POST'])
def create_prebooking():
    """Create a new pre-booking"""
    if not db:
        return jsonify({'success': False, 'errors': {'server': 'Database disconnected'}}), 500

    try:
        data = request.json
        
        # Validation (Simplified for brevity as logic is same)
        errors = {}
        if not data.get('name'): errors['name'] = 'Name is required'
        if not data.get('email'): errors['email'] = 'Valid email is required'
        elif not validate_email(data.get('email', '')): errors['email'] = 'Valid email is required'
        if not data.get('country'): errors['country'] = 'Country is required'

        if errors:
            return jsonify({'success': False, 'errors': errors}), 400
        
        # Check duplicate
        existing = db.collection('pre_bookings').where('email', '==', data['email']).limit(1).get()
        if len(list(existing)) > 0:
            return jsonify({
                'success': False,
                'errors': {'email': 'This email is already registered'}
            }), 400
        
        # Create document
        new_booking = {
            'name': data['name'],
            'email': data['email'],
            'phone': data.get('phone', ''),
            'country': data['country'],
            'state': data.get('state', ''),
            'city': data.get('city', ''),
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', ''),
            'timestamp': datetime.now()
        }
        
        update_time, doc_ref = db.collection('pre_bookings').add(new_booking)
        
        return jsonify({
            'success': True,
            'message': 'Pre-booking successful!',
            'booking_id': doc_ref.id,
            'data': {
                'name': data['name'],
                'email': data['email'],
                'city': data.get('city', 'your location')
            }
        }), 201
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'success': False,
            'errors': {'server': str(e)}
        }), 500

@app.route('/api/prebookings', methods=['GET'])
def get_prebookings():
    """Get all pre-bookings (admin endpoint)"""
    if not db:
        return jsonify({'success': False, 'error': 'Database disconnected'}), 500

    try:
        # Firestore/Mock logic
        # Note: Pagination is harder in raw Firestore without cursors, so fetching all for now (simple migration)
        # In a real app we'd use limit() and start_after()
        docs = db.collection('pre_bookings').stream()
        bookings = []
        for doc in docs:
            d = doc.to_dict()
            d['id'] = doc.id
            bookings.append(d)
            
        # Sort in memory for simple migration (reverse timestamp)
        bookings.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'total': len(bookings),
            'bookings': bookings
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get booking statistics"""
    if not db:
        return jsonify({'success': False, 'error': 'Database disconnected'}), 500

    try:
        docs = list(db.collection('pre_bookings').stream())
        total = len(docs)
        
        # Internal aggregation
        country_counts = {}
        for doc in docs:
            d = doc.to_dict()
            c = d.get('country', 'Unknown')
            country_counts[c] = country_counts.get(c, 0) + 1
            
        by_country = [{'country': k, 'count': v} for k, v in sorted(country_counts.items(), key=lambda item: item[1], reverse=True)[:10]]
        
        return jsonify({
            'success': True,
            'stats': {
                'total_bookings': total,
                'recent_24h': 0, # Placeholder
                'top_countries': by_country
            }
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/export', methods=['GET'])
def export_bookings():
    """Export bookings as CSV"""
    if not db:
        return jsonify({'success': False, 'error': 'Database disconnected'}), 500

    try:
        docs = db.collection('pre_bookings').stream()
        bookings = [doc.to_dict() for doc in docs]
        
        # Create CSV
        csv_data = "Name,Email,Phone,Country,State,City,Timestamp\n"
        for b in bookings:
            csv_data += f'"{b.get("name","")}","{b.get("email","")}","{b.get("phone","")}","{b.get("country","")}","{b.get("state","")}","{b.get("city","")}","{b.get("timestamp","")}"\n'
        
        return csv_data, 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': f'attachment; filename=yu_prebookings_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ... (Imports at top handled separately if needed, but safe to add here for context or separate call)
import google.generativeai as genai
from google.generativeai.types import FunctionDeclaration, Tool

# Configure Gemini
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# YU Persona System Instruction
YU_SYSTEM_INSTRUCTION = """
You are the advanced AI assistant for YU - a premium, disruptive biotech brand delivering 99% pure medical-grade oxygen (The Final Biological Upgrade).

CORE PERSONA:
- **Tone**: Ultra-premium, futuristic, confident, slightly mysterious but helpful. Think Apple meets a high-end biotech lab.
- **Philosophy**: We don't sell oxygen; we sell "Atmosphere". We sell "Cellular Regeneration". We sell "Urban Armor".
- **Product**: YU System 01 is a 12L canister of 99% pure medical-grade oxygen. It's not just for sick people; it's for peak performers, athletes, and anyone living in polluted cities.
- **Key Benefits**: Instantly clears lactic acid (athletes), restores mental clarity (focus), detoxifies skin (beauty), protects against PM2.5 (urban health).

RULES:
1.  **Be Helpful**: Answer questions accurately. Don't be too cryptic.
2.  **Multilingual**: Support English and Hindi seamlessly. If the user speaks Hindi (or Hinglish), reply in Hindi.
3.  **Booking**: If the user wants to reserve/book/buy, ask for their details (Name, Email, Phone, Country, City) one by one if not provided, then use the `create_prebooking` tool.
4.  **No Medical Advice**: If they mention serious illness (asthma, COPD), remind them YU is a wellness product, not a medical device, and they should consult a doctor.
5.  **Brevity**: Keep responses concise (2-3 sentences mostly).

LANGUAGE HANDLING:
- User: "What is the price?" -> You: "Secure your allocation now. Early-bird access is live. Would you like to reserve your YU System 01?"
- User: "Kya ye safe hai?" -> You: "Bilkul. YU 100% safe aur medical-grade hai. Ye wellness ke liye design kiya gaya hai. Kya aap aur janna chahenge?"
"""

# Tool Definition for Gemini
prebooking_tool = {
    'function_declarations': [
        {
            'name': 'create_prebooking_tool',
            'description': 'Create a pre-booking reservation for a customer.',
            'parameters': {
                'type': 'OBJECT',
                'properties': {
                    'name': {'type': 'STRING', 'description': 'Customer full name'},
                    'email': {'type': 'STRING', 'description': 'Customer email address'},
                    'phone': {'type': 'STRING', 'description': 'Customer phone number'},
                    'country': {'type': 'STRING', 'description': 'Customer country'},
                    'city': {'type': 'STRING', 'description': 'Customer city'}
                },
                'required': ['name', 'email', 'country']
            }
        }
    ]
}

def create_prebooking_internal(name, email, phone, country, city):
    """Internal helper to insert into DB from tool call"""
    if not db:
        return {"status": "error", "message": "Database disconnected"}
        
    try:
        # Check duplicate
        existing = db.collection('pre_bookings').where('email', '==', email).limit(1).get()
        if len(list(existing)) > 0:
            return {"status": "error", "message": "Email already registered."}

        # Add document
        data = {
            'name': name,
            'email': email,
            'phone': phone,
            'country': country,
            'city': city,
            'ip_address': 'chatbot',
            'user_agent': 'gemini-agent',
            'timestamp': datetime.now()
        }
        
        update_time, doc_ref = db.collection('pre_bookings').add(data)
        
        return {"status": "success", "booking_id": doc_ref.id, "message": "Reservation confirmed."}
    except Exception as e:
        print(f"DB Error: {e}")
        return {"status": "error", "message": "Internal database error."}

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """Handle chat requests with Gemini"""
    if not GOOGLE_API_KEY:
        return jsonify({'error': 'Backend misconfigured: Missing API Key'}), 500

    data = request.json
    user_message = data.get('message')
    history = data.get('history', [])

    try:
        # Initialize model with tools
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=YU_SYSTEM_INSTRUCTION,
            tools=[prebooking_tool]
        )
        
        chat = model.start_chat(history=history)
        response = chat.send_message(user_message)
        
        # Handle Function Calling
        if response.candidates[0].content.parts[0].function_call:
            fc = response.candidates[0].content.parts[0].function_call
            if fc.name == 'create_prebooking_tool':
                args = fc.args
                result = create_prebooking_internal(
                    args.get('name'), 
                    args.get('email'), 
                    args.get('phone', ''), 
                    args.get('country'), 
                    args.get('city', '')
                )
                
                # Send tool output back to model to get final natural language response
                response = chat.send_message(
                    genai.protos.Content(
                        parts=[genai.protos.Part(
                            function_response=genai.protos.FunctionResponse(
                                name='create_prebooking_tool',
                                response={'result': result}
                            )
                        )]
                    )
                )

        return jsonify({
            'response': response.text,
            'history': [] # simplified for now
        })
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        return jsonify({'error': 'AI temporarily unavailable'}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 YU OXYGEN API SERVER (FIREBASE ENABLED)")
    print("="*60)
    print(f"🌐 Server: http://localhost:5001")
    print("\n📍 Available Endpoints:")
    print("   GET  /api/health       - Health check")
    print("   POST /api/prebook      - Create pre-booking")
    print("   GET  /api/prebookings  - List all bookings")
    print("   GET  /api/stats        - Get statistics")
    print("   GET  /api/export       - Export as CSV")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
