# BFHL Challenge – Chitkara Full Stack Engineering Challenge

## Project Description

This project is a Full Stack application developed for the Chitkara Full Stack Engineering Challenge.

The application accepts hierarchical node relationships in the format `X->Y`, processes them, and returns structured hierarchy information including:

* Tree construction
* Cycle detection
* Duplicate edge detection
* Invalid entry detection
* Depth calculation
* Summary generation

## Tech Stack

### Frontend

* React
* Vite
* Axios

### Backend

* Node.js
* Express.js
* CORS

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Frontend URL

https://bajaj-work-one.vercel.app/

---

## Backend URL

https://bajajwork.onrender.com/

---

## API Endpoint

### POST /bfhl

Request:

```json
{
  "data": [
    "A->B",
    "A->C",
    "B->D"
  ]
}
```

Response:

```json
{
  "user_id": "diyaaggarwal_28062005",
  "email_id": "diya1194.be23@chitkarauniversity.edu.in",
  "college_roll_number": "2311981194",
  "hierarchies": [],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {}
}
```

---

## Repository

GitHub Repository:

https://github.com/Diy174/BajajWork

---

## Author

Diya Aggarwal
