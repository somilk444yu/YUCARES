# YU Oxygen Pre-booking Backend

Python Flask backend for managing YU Oxygen pre-booking submissions with SQLite database.

## 🚀 Quick Start

### 1. Setup (One-time)

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

### 2. Run the Server

```bash
# Activate virtual environment
source venv/bin/activate

# Start the server
python app.py
```

The server will start at `http://localhost:5000`

---

## 📍 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Create Pre-booking
```
POST /api/prebook
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555 0123",
  "country": "United States",
  "state": "California",
  "city": "Los Angeles"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Pre-booking successful!",
  "booking_id": 1,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "city": "Los Angeles"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": {
    "email": "Valid email is required",
    "phone": "Valid phone number is required (minimum 8 digits)"
  }
}
```

### List All Bookings
```
GET /api/prebookings?page=1&per_page=50
```

Returns paginated list of all pre-bookings.

### Get Statistics
```
GET /api/stats
```

Returns booking statistics including:
- Total bookings
- Recent bookings (last 24 hours)
- Top 10 countries

### Export to CSV
```
GET /api/export
```

Downloads all bookings as a CSV file.

---

## 🗄️ Database

The backend uses SQLite database (`yu_prebookings.db`) with the following schema:

```sql
CREATE TABLE prebookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL,
    state TEXT,
    city TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT
);
```

**Indexes:**
- `idx_email` on email (for duplicate checking)
- `idx_country` on country (for statistics)
- `idx_timestamp` on timestamp (for recent queries)

---

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| **Name** | Required, non-empty |
| **Email** | Valid email format (RFC 5322), unique |
| **Phone** | Minimum 8 characters |
| **Country** | Required |
| **State** | Optional |
| **City** | Optional |

---

## 🔧 Configuration

### Port
Default: `5000`

To change, modify `app.run()` in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=8080)
```

### CORS
CORS is enabled for all origins by default. To restrict:
```python
CORS(app, origins=['http://localhost:3000'])
```

---

## 📊 Monitoring

### View Database
```bash
sqlite3 yu_prebookings.db
```

```sql
-- Count total bookings
SELECT COUNT(*) FROM prebookings;

-- View recent bookings
SELECT * FROM prebookings ORDER BY timestamp DESC LIMIT 10;

-- Bookings by country
SELECT country, COUNT(*) as count 
FROM prebookings 
GROUP BY country 
ORDER BY count DESC;
```

---

## 🛠️ Development

### Install Dependencies Manually
```bash
pip install flask==3.0.0 flask-cors==4.0.0
```

### Run in Debug Mode
Debug mode is enabled by default. The server will auto-reload on code changes.

### Testing the API

**Using curl:**
```bash
# Health check
curl http://localhost:5000/api/health

# Create booking
curl -X POST http://localhost:5000/api/prebook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1 555 1234",
    "country": "United States",
    "state": "California",
    "city": "Los Angeles"
  }'

# Get statistics
curl http://localhost:5000/api/stats
```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Database Locked
```bash
# Close all connections and restart
rm yu_prebookings.db
python app.py
```

### CORS Errors
Ensure the frontend is making requests to `http://localhost:5000` (not `https`).

---

## 📦 Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables
```bash
export FLASK_ENV=production
export DATABASE_PATH=/path/to/yu_prebookings.db
```

---

## 📝 License

This backend is part of the YU Oxygen landing page project.
