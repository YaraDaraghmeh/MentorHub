<div align="center">

#  MentorHub

### Your Gateway to Professional Interview Excellence

<img width="2464" height="517" alt="cover" src="https://github.com/user-attachments/assets/fff9c614-67fc-4b7b-af87-bb300adecf7e" />



[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![.NET](https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white)](https://dotnet.microsoft.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)


Connecting job seekers with experienced interview trainers for personalized mock interview sessions

</div>

---

## Table of Contents

- [ MentorHub](#-mentorhub)
  - [Table of Contents](#-table-of-contents)
  - [ Project Overview](#-project-overview)
  - [ Key Features](#-key-features)
  - [ System Architecture](#-system-architecture)
  - [ Built With](#-built-with)
  - [ Project Structure](#-project-structure)
  - [ User Roles](#-user-roles)
  - [ UI Prototypes](#-ui-prototypes)
  - [ Development Team](#-development-team)
 


## Project Overview

*MentorHub* is a specialized web platform designed to bridge the gap between job seekers and experienced interview professionals. Our platform enables users to connect with qualified trainers across various industries, book personalized mock interview sessions, and receive professional coaching to enhance their interview performance through secure, flexible online interactions.

The project focuses on delivering a robust, scalable, and user-friendly experience while implementing modern software development practices including clean architecture, responsive design, and comprehensive testing strategies.

<img width="1909" height="931" alt="image" src="https://github.com/user-attachments/assets/a562835e-081d-477e-90ca-ec6d6afcde7e" />


##  Key Features

###  Mentees 
- *Trainer Discovery*: Browse and filter qualified interview trainers by industry and expertise
- *Smart Booking System*: Schedule mock interview sessions with real-time availability
- *Session Management*: Track upcoming interviews, reschedule, and access session history
- *Personalized Coaching*: Receive tailored feedback and improvement recommendations
- *Progress Tracking*: Monitor interview performance and skill development over time

###  Mentors 
- *Professional Profile*: Showcase expertise, experience, and specializations
- *Availability Management*: Set flexible schedules and manage booking slots
- *Session Tools*: Conduct interviews with integrated video/audio capabilities
- *Feedback System*: Provide detailed assessments and coaching notes
- *Analytics Dashboard*: Track  session statistics

###  For Administrators
- *Platform Management*: Oversee trainer verification and user management
- *Quality Control*: Monitor session quality and user feedback
- *Analytics & Reporting*: Generate comprehensive platform usage reports
- *Content Management*: Manage resources, guidelines, and platform policies

![WhatsApp Image 2025-09-24 at 13 35 15_7290e241](https://github.com/user-attachments/assets/8bb10a58-b466-4212-b103-f2e644ae2e32)


##  System Architecture

MentorHub follows a *Model-View-Controller (MVC) Architecture* combined with *RESTful API* design principles for optimal separation of concerns and scalable communication:

*Frontend (View Layer)*: React with TypeScript serves as the presentation layer, consuming RESTful API endpoints and rendering dynamic user interfaces through reusable components and intelligent state management.

*Backend (Controller & Model Layers)*: 
- *Controllers*: Handle HTTP requests, implement RESTful endpoints (GET, POST, PUT, DELETE), and orchestrate business logic
- *Models*: Define data entities, relationships, and business rules using Entity Framework Core
- *API Layer*: Provides standardized RESTful services for seamless frontend-backend communication

*Database Layer*: Entity Framework Core with SQL Server manages data persistence, relationships, and migrations with full CRUD operations support.


##  Built With

### Frontend Technologies
- *React 19.1.1* - Modern UI library with hooks and context
- *TypeScript 5.9.2* - Type-safe development experience
-  *TailwindCSS 4.1.12* - Utility-first CSS framework
- *Vite 7.1.2* - Fast build tool and development server
- *Framer Motion 12.23.12* - Smooth animations and transitions

### UI/UX Libraries
- *Material Tailwind 2.1.10* - Material Design components
-  *React Big Calendar 1.19.4* - Interactive calendar interface
-  *Recharts 3.2.0* - Beautiful data visualization
-  *Lucide React 0.542.0* - Modern icon library
-  *Typewriter Effect 2.22.0* - Dynamic text animations

### Backend Technologies
- *.NET Core* - High-performance web API framework
- *Entity Framework* - Object-relational mapping
- *Authentication & Authorization* - Secure user management
- *RESTful APIs* - Standard HTTP-based communication

### Development Tools
- *Axios 1.12.2* - HTTP client for API communication
- *React Router DOM 7.8.2* - Client-side routing


## Project Structure


[mentorhub/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Shared components
│   │   │   ├── forms/           # Form components
│   │   │   └── layout/          # Layout components
│   │   ├── pages/               # Main application pages
│   │   │   ├── Home/            # Landing page
│   │   │   ├── Auth/            # Authentication pages
│   │   │   ├── Dashboard/       # User dashboards
│   │   │   ├── Trainers/        # Trainer-related pages
│   │   │   ├── Sessions/        # Interview session pages
│   │   │   └── Profile/         # User profile pages
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API service layer
│   │   ├── utils/               # Utility functions
│   │   ├── types/               # TypeScript definitions
│   │   ├── context/             # React context providers
│   │   └── assets/              # Static assets
│   ├── public/                  # Public assets
│   └── package.json             # Frontend dependencies
├── backend/
│   ├── Controllers/             # API controllers
│   ├── Models/                  # Data models
│   ├── Services/                # Business logic layer
│   ├── Repositories/            # Data access layer
│   ├── DTOs/                    # Data transfer objects
│   ├── Middleware/              # Custom middleware
│   └── Program.cs               # Application entry point
└── README.md](https://github.com/YaraDaraghmeh/MentorHub/tree/09c3df0e5db08927c1b40ac21944de29e7623f80/MentorHup)


## User Roles

| Role | User Type | Key Responsibilities |
|------|-----------|---------------------|
| *Mentee* | End User | Book sessions, attend interviews, track |
| *Mentor* | Service Provider | Conduct sessions, provide feedback, manage schedule |
| *Admin* | System Manager | Platform oversight, user management, quality control |

<!-- ADD USER ROLES DIAGRAM/IMAGE HERE -->

##  UI Prototypes

Our user interface is designed with modern UX principles, focusing on intuitive navigation and seamless user experience across all devices.
we will add the slides show here and its link anf if the project was uploaddd to vercel we will add the link 

<!-- ADD UI PROTOTYPE IMAGES HERE -->
Figure 1 - UI Prototypes and Mockups


##  Development Team

| Role | Developer | Responsibilities |
|------|-----------|------------------|
| *Team Lead - Frontend Developer* | Sara Sayed Ahmed  | Overall coordination, architecture decisions |
| *Frontend Developer* | Yara H Daraghmeh| React development, UI/UX implementation |
| *Backend Developer* |Khaled | .NET API, database design, security |
| *Backend Developer* | Amjed | .NET API, database design, security|


<div align="center">



</div>
