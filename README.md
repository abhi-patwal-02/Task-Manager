# 🚀 Team Task Manager – Backend

A scalable backend service powering a collaborative task management platform with role-based access control, smart task tracking, and real-time team coordination.

---

## 🌐 Live API

https://task-manager-production-856b.up.railway.app

Railway trial ended so switched to render instead
https://task-manager-3ry7.onrender.com

---

## 🧠 Overview

This backend is designed to handle **multi-user collaboration** with strict access control and efficient data relationships.
It ensures that each user interacts only with relevant data while maintaining a centralized system for administrators.

---

## ✨ Core Capabilities

### 🔐 Secure Authentication

* JWT-based authentication system
* Seamless login and signup flow
* Token-based request validation

---

### 👥 Role-Based Access Control

* Two roles: **Admin** and **Member**
* Admins have full project visibility and control
* Members can only access tasks assigned to them
* Role enforcement at both API and data level

---

### 📁 Project & Team Management

* Create and manage collaborative projects
* Add and remove members dynamically
* Assign and update roles within projects
* Maintain isolated team environments per project

---

### ✅ Intelligent Task System

* Task creation with assignment to specific users
* Status tracking (pending → in-progress → completed)
* Automatic task ownership enforcement

---

### ⏰ Deadline & Overdue Tracking

* Tasks support configurable due dates
* Smart default deadlines (24-hour fallback)
* Automatic overdue detection based on current time

---

### 📊 Subtasks & Progress Engine

* Task descriptions converted into structured checklists
* Subtask-level tracking for granular progress
* Automatic completion of parent task when all subtasks are done

---

### 📈 Analytics Support

* Backend provides structured data for:

  * Completed tasks
  * Pending tasks
  * Overdue tasks
* Enables real-time dashboard insights

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JSON Web Tokens (JWT)
* Railway (Deployment)

---

## ⚙️ Environment Configuration

```txt
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

## 🚀 Deployment

The backend is deployed on Railway and optimized for handling scalable API requests and database operations.

---

## 🧠 Design Highlights

* Clean separation of concerns (controllers, models, routes)
* Efficient relational data handling with MongoDB
* Secure middleware-based request validation
* Optimized for real-world team collaboration scenarios

---

## 👨‍💻 Author

Abhishek Patwal
