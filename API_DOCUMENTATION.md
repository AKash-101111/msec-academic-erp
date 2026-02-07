# MSEC Academic ERP - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All authenticated routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST /auth/login
Login to the system

**Request Body:**
```json
{
  "email": "admin@msec.edu.in",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@msec.edu.in",
      "role": "ADMIN"
    }
  }
}
```

### GET /auth/me
Get current authenticated user

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@msec.edu.in",
    "role": "ADMIN"
  }
}
```

---

## Admin Endpoints

### GET /admin/dashboard
Get dashboard statistics

**Query Parameters:**
- `batch` (optional): Filter by batch (e.g., "2024-2028")

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "totalDepartments": 5,
    "averageAttendance": 78.5,
    "averageGpa": 7.2,
    "batchDistribution": [
      { "batch": "2024-2028", "count": 50 }
    ],
    "departmentDistribution": [
      { "department": "CSE", "count": 40 }
    ],
    "attendanceShortage": 12,
    "performanceRisk": 8
  }
}
```

### GET /admin/students
Get paginated list of students

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 20, max: 100): Results per page
- `search` (optional): Search by name or roll number
- `batch` (optional): Filter by batch
- `department` (optional): Filter by department

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "uuid",
        "rollNumber": "21CS001",
        "name": "John Doe",
        "email": "john@example.com",
        "department": "CSE",
        "batch": "2021-2025",
        "gpa": 8.5,
        "attendance": 85.2
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

### GET /admin/student/:id
Get detailed student profile

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "rollNumber": "21CS001",
      "name": "John Doe",
      "department": "CSE",
      "batch": "2021-2025"
    },
    "academics": [
      {
        "year": 1,
        "gpa": 8.5,
        "subjects": [
          {
            "subjectName": "Mathematics",
            "marks": 85,
            "unitTest1": 20,
            "unitTest2": 22,
            "unitTest3": 21,
            "iatScore": 45
          }
        ]
      }
    ],
    "attendance": {
      "overall": 85.2,
      "subjects": [
        {
          "subjectName": "Mathematics",
          "attendancePercent": 88.5
        }
      ]
    },
    "activities": {
      "internships": ["TCS Internship"],
      "certifications": ["AWS Certified"],
      "hackathons": ["Smart India Hackathon 2024"]
    }
  }
}
```

### POST /admin/upload/academics
Upload academic marks from Excel/CSV

**Form Data:**
- `file`: Excel/CSV file
- `year`: Academic year (1-4)

**Excel Format:**
```
rollNumber | subjectName | marks | unitTest1 | unitTest2 | unitTest3 | iatScore
21CS001    | Mathematics | 85    | 20        | 22        | 21        | 45
```

**Response:**
```json
{
  "success": true,
  "message": "Uploaded 50 academic records",
  "data": {
    "processed": 50,
    "errors": []
  }
}
```

### POST /admin/upload/attendance
Upload attendance records from Excel/CSV

**Form Data:**
- `file`: Excel/CSV file

**Excel Format:**
```
rollNumber | subjectName | attendancePercent | totalClasses | attendedClasses
21CS001    | Mathematics | 88.5             | 40          | 35
```

### POST /admin/upload/activities
Upload student activities from Excel/CSV

**Form Data:**
- `file`: Excel/CSV file

**Excel Format:**
```
rollNumber | type          | data
21CS001    | internships   | TCS Internship - Summer 2024
21CS001    | certifications| AWS Certified Developer
```

---

## Student Endpoints

### GET /student/profile
Get current student's profile

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "rollNumber": "21CS001",
      "name": "John Doe",
      "department": "CSE",
      "batch": "2021-2025",
      "bloodGroup": "O+",
      "contact": "9876543210"
    },
    "academics": [...],
    "attendance": {...},
    "activities": {...}
  }
}
```

### GET /student/attendance
Get attendance records with analytics

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": 85.2,
    "status": "good",
    "shortageWarning": false,
    "shortageSubjects": [],
    "recommendation": "Attendance is satisfactory. Maintain consistency.",
    "subjects": [
      {
        "id": "uuid",
        "subjectName": "Mathematics",
        "attendancePercent": 88.5,
        "totalClasses": 40,
        "attendedClasses": 35
      }
    ]
  }
}
```

### GET /student/activities
Get holistic development activities

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": {
      "internships": ["TCS Internship"],
      "certifications": ["AWS Certified"],
      "hackathons": ["Smart India Hackathon"],
      "scholarships": [],
      "sports": ["Cricket - District Level"],
      "extracurricular": ["NSS Volunteer"],
      "ecube": []
    }
  }
}
```

### GET /student/performance-trend
Get academic performance trend with analytics

**Response:**
```json
{
  "success": true,
  "data": {
    "trend": [
      { "year": "Year 1", "gpa": 7.8 },
      { "year": "Year 2", "gpa": 8.2 }
    ],
    "trendDirection": "improving",
    "averageGpa": 8.0,
    "improvement": 0.4,
    "recommendation": "Excellent progress! Continue with your current study methods."
  }
}
```

### GET /student/attendance-trend
Get attendance visualization data

**Response:**
```json
{
  "success": true,
  "data": {
    "subjects": [
      {
        "name": "Mathematics",
        "percentage": 88.5
      }
    ]
  }
}
```

### GET /student/insights
Get comprehensive AI-powered insights

**Response:**
```json
{
  "success": true,
  "data": {
    "performance": {
      "averageGpa": 8.0,
      "trendDirection": "improving",
      "recommendation": "..."
    },
    "attendance": {
      "overall": 85.2,
      "status": "good",
      "recommendation": "..."
    },
    "risk": {
      "score": 15,
      "level": "low",
      "factors": []
    },
    "strengths": [
      "Excellent academic performance",
      "Outstanding attendance record"
    ],
    "areasForImprovement": [],
    "overallStatus": "on_track"
  }
}
```

### GET /student/report/pdf
Download comprehensive PDF report

**Response:** PDF file download

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting
- Login endpoint: 5 requests per minute
- File upload: 10 requests per hour
- Other endpoints: 100 requests per minute

## File Upload Limits
- Maximum file size: 10MB
- Supported formats: .xlsx, .xls, .csv
- Maximum rows per upload: 1000
