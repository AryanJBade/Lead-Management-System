# Database Design

## Users Table

| Field | Type |
|---------|---------|
| id | INT |
| name | VARCHAR(100) |
| email | VARCHAR(100) |
| password | VARCHAR(255) |
| role | ENUM(admin,manager,agent) |

---

## Leads Table

| Field | Type |
|---------|---------|
| id | INT |
| name | VARCHAR(100) |
| email | VARCHAR(100) |
| phone | VARCHAR(20) |
| source | VARCHAR(50) |
| status | VARCHAR(50) |
| assigned_to | INT |
| notes | TEXT |
| created_at | TIMESTAMP |

---

## Activity Logs Table

| Field | Type |
|---------|---------|
| id | INT |
| action | VARCHAR(100) |
| lead_id | INT |
| user_id | INT |
| created_at | TIMESTAMP |