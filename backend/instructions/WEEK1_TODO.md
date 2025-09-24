# Backend Team - Week 1 Checklist

## **Your Goals**
This week, you'll create the server infrastructure that connects to external data sources and serves information to the frontend.

## **Week 1 Checklist**

### **Environment Setup**
- [ ] Navigate to the `backend/` directory
- [ ] Set up a Python virtual environment (hint: `python -m venv venv`)
- [ ] Activate your virtual environment
- [ ] Install Flask and essential dependencies
- [ ] Create a `requirements.txt` file to track dependencies

### **Project Structure**
- [ ] Create an `app/` folder for your Flask application
- [ ] Set up a `routes/` folder for API endpoints
- [ ] Create an `__init__.py` file to initialize your Flask app
- [ ] Set up a main application file (like `app.py`)

### **Core API Endpoints**
- [ ] **Health Check Endpoint**: Create `/api/v1/health` that returns server status
- [ ] **Hello Endpoint**: Create `/api/v1/hello` that returns a greeting message
- [ ] **CORS Configuration**: Enable cross-origin requests for frontend communication
- [ ] **Error Handling**: Set up basic error handling for your API

### **Code Organization**
- [ ] Use Flask Blueprints to organize your routes
- [ ] Create separate files for different endpoint groups
- [ ] Add proper documentation to your functions
- [ ] Structure your code for easy expansion in future weeks

### **Testing & Verification**
- [ ] Your Flask server starts without errors
- [ ] All endpoints return proper JSON responses
- [ ] CORS is working (frontend can communicate with backend)
- [ ] Error handling works for invalid requests

## **Further Hints**

### **Dependencies You'll Need**
```bash
# Core Flask dependencies
pip install flask flask-cors python-dotenv
```

### **Project Structure Ideas**
```
backend/
├── app/
│   ├── __init__.py       # Flask app initialization
│   └── routes/
│       └── hello.py      # API endpoints
├── requirements.txt      # Dependencies
└── app.py               # Main application entry point
```

### **API Endpoint Examples**
```python
# Health check endpoint
GET /api/v1/health
# Should return: {"status": "healthy", "service": "StockScope Backend"}

# Hello endpoint  
GET /api/v1/hello
# Should return: {"message": "Hello StockScope", "status": "success"}
```

## **Tips**

- Use `create_app()` function for better organization
- Register blueprints for different route groups
- Enable CORS for frontend communication
- Set up proper error handling
##
- Use tools like Postman or curl to test endpoints
- Check that JSON responses are properly formatted
- Verify CORS headers are present
- Test error handling with invalid requests
##
By the end of Week 1, you should have:
- A Flask server that runs on `localhost:5000`
- Working API endpoints that return JSON
- Proper CORS configuration
- Clean, organized code structure
- A foundation ready for real data integration
##
- Start simple and build up complexity
- Test your endpoints as you create them
- Think about how the frontend will consume your API
- Plan for future endpoints (you'll add many more!)
- Keep your code organized - you'll be adding lots of features
##
- **CORS Issues**: Make sure to enable CORS for frontend communication
- **Port Conflicts**: Ensure your Flask app runs on port 5000
- **JSON Responses**: Always return proper JSON, not plain text
- **Error Handling**: Set up basic error responses for invalid requests

