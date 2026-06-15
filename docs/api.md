# Find My Home BLR — API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production:  https://your-api-domain.com/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

Roles: `user` | `agent` | `admin`

---

## Auth Endpoints

### Register
`POST /auth/register`

**Body:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "password": "SecurePass@123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "64abc123...",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "user",
    "avatar": {}
  }
}
```

### Login
`POST /auth/login`

**Body:**
```json
{
  "email": "rajesh@example.com",
  "password": "SecurePass@123"
}
```

---

## Property Query Parameters

`GET /properties?params`

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `listingType` | string | `buy` | buy / rent / commercial |
| `propertyType` | string | `apartment` | apartment / villa / etc |
| `city` | string | `Bangalore` | City name |
| `locality` | string | `Whitefield` | Area name |
| `minPrice` | number | `3000000` | Minimum price |
| `maxPrice` | number | `10000000` | Maximum price |
| `bedrooms` | number | `3` | Number of bedrooms |
| `bathrooms` | number | `2` | Number of bathrooms |
| `minArea` | number | `1000` | Min area in sqft |
| `maxArea` | number | `3000` | Max area in sqft |
| `amenities` | string | `parking,gym` | Comma-separated amenities |
| `featured` | boolean | `true` | Featured only |
| `search` | string | `whitefield` | Full text search |
| `sort` | string | `-createdAt` | Sort field (- for desc) |
| `page` | number | `1` | Page number |
| `limit` | number | `12` | Results per page |

---

## Error Response Format
```json
{
  "success": false,
  "message": "Error description here"
}
```

## Common HTTP Status Codes
- `200` OK
- `201` Created
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Server Error
