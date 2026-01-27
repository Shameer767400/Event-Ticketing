#!/bin/bash

echo "🧪 Testing Event Ticketing API..."
echo ""

# Test 1: Health Check
echo "1️⃣ Testing health check..."
curl -s http://localhost:5001/ | grep -q "Event Ticketing API" && echo "✅ Health check passed" || echo "❌ Health check failed"
echo ""

# Test 2: Signup
echo "2️⃣ Testing organizer signup..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Organizer",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $SIGNUP_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Signup successful - Token received"
else
  echo "❌ Signup failed"
  echo "Response: $SIGNUP_RESPONSE"
fi
echo ""

# Test 3: Create Event
echo "3️⃣ Testing event creation..."
EVENT_RESPONSE=$(curl -s -X POST http://localhost:5001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event",
    "date": "2026-12-31T18:00:00",
    "venue": "Test Venue",
    "ticketLimit": 100,
    "approvalMode": "auto"
  }')

EVENT_ID=$(echo $EVENT_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$EVENT_ID" ]; then
  echo "✅ Event created - ID: $EVENT_ID"
else
  echo "❌ Event creation failed"
  echo "Response: $EVENT_RESPONSE"
fi
echo ""

# Test 4: Get Events
echo "4️⃣ Testing get events..."
curl -s -X GET http://localhost:5001/api/events \
  -H "Authorization: Bearer $TOKEN" | grep -q "Test Event" && echo "✅ Get events successful" || echo "❌ Get events failed"
echo ""

# Test 5: Register for Event
echo "5️⃣ Testing user registration..."
REG_RESPONSE=$(curl -s -X POST http://localhost:5001/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "'$EVENT_ID'",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPhone": "1234567890"
  }')

TICKET_ID=$(echo $REG_RESPONSE | grep -o '"ticketId":"[^"]*' | cut -d'"' -f4)

if [ -n "$TICKET_ID" ]; then
  echo "✅ Registration successful - Ticket ID: $TICKET_ID"
else
  echo "❌ Registration failed"
  echo "Response: $REG_RESPONSE"
fi
echo ""

# Test 6: Get Ticket
echo "6️⃣ Testing ticket retrieval..."
curl -s -X GET http://localhost:5001/api/registrations/ticket/$TICKET_ID | grep -q "John Doe" && echo "✅ Ticket retrieval successful" || echo "❌ Ticket retrieval failed"
echo ""

echo "🎉 API Testing Complete!"
