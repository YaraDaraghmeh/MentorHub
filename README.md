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
  - [Design Patterns & SOLID Principles](#-design-patterns--solid-principles)
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

![WhatsApp Image 2025-09-24 at 18 10 36_8cffae4f](https://github.com/user-attachments/assets/95228455-1f4e-45e6-833c-dc72c7570db1)



##  System Architecture

MentorHub follows a *Model-View-Controller (MVC) Architecture* combined with *RESTful API* design principles for optimal separation of concerns and scalable communication:

*Frontend (View Layer)*: React with TypeScript serves as the presentation layer, consuming RESTful API endpoints and rendering dynamic user interfaces through reusable components and intelligent state management.

- **Backend (Controller & Service Layer)**:
  - Controllers: Handle HTTP requests and orchestrate business logic
  - Services: All business logic, data handling, and interactions with the database
  - DTOs: Standardized data structures for API requests/responses (e.g., Notification, Booking, Profile)
  - Settings: Configuration classes (JwtSettings, StripeSettings)
  - Validators: FluentValidation rules
  - Responses: Standardized API responses
  - Common: Shared utilities (e.g., PageResult)
- **Domain Layer**: Entities/Models representing database structure
- **Infrastructure Layer**: Database context, ChatHub, seed data, email sender
- **Database Layer**: SQL Server 2022 via Entity Framework Core 9.0.8
  
---

## Design Patterns & SOLID Principles

### Design Patterns
- **Dependency Injection (DI)**: All services injected into controllers for loose coupling.
- **Factory / Service Pattern**: Services abstract the business logic, centralizing operations per entity type.
- **Singleton**: For services that maintain state like `NotificationService` or `StripeService`.

### SOLID Principles

| Principle | Implementation in Code | Example |
|-----------|----------------------|---------|
| **S – Single Responsibility** | Each service handles one concern | `ProfileService` manages profile logic only |
| **O – Open/Closed** | Services can be extended without modifying existing code | Changing the email provider or adding SMS notifications can be implemented by creating a new class that implements `IEmailSender` or `INotificationService` without modifying existing classes like `BookingService` |
| **L – Liskov Substitution** | Interfaces can be replaced without breaking code | Any class using an abstraction (e.g., a service using `IStripeService`) can seamlessly replace the concrete implementation without affecting its core functionality |
| **I – Interface Segregation** | Interfaces are focused and small | `IBookingService` contains only booking methods |
| **D – Dependency Inversion** | Controllers depend on abstractions (interfaces), not concrete classes | `BookingController` uses `IBookingService` via DI |

```csharp
// Example: Dependency Inversion + Single Responsibility
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService; // abstraction

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public IActionResult CreateBooking(CreateBookingDto dto)
    {
        _bookingService.CreateBooking(dto); // Controller delegates to service
        return Ok();
    }
}
```
This ensures **maintainability, testability, and scalability** across the project.

---

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
- *ASP.NET Core 9.0.0* – High-performance, cross-platform RESTful API framework
- *Entity Framework Core 9.0.8* – ORM for SQL Server, migrations, CRUD operations
- *SQL Server 2022* – Relational database engine
- *SignalR 9.0.8* – Real-time communication (chat, notifications)
- *ASP.NET Identity with JWT 9.0.8* – Authentication & role-based authorization
- *FluentValidation 12.0.0 + FluentValidation.AspNetCore 11.3.1* – Model validation
- *Stripe.NET 48.0.0* – Payment processing for bookings
- *Microsoft.AspNetCore.Authentication.Google 9.0.9* – External login support
- *Swashbuckle.AspNetCore 9.0.4* – Swagger documentation
- *Email Service (SMTP)* – Automated email notifications
- *Manual DTO Mapping* – We manually map between entities and DTOs instead of using AutoMapper

### Development Tools
- *Axios 1.12.2* - HTTP client for API communication
- *React Router DOM 7.8.2* - Client-side routing


## Project Structure
```
mentorhub/
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
backend/
├── APPLICATION/
│   ├── DTOs/                        # Data transfer objects
│   ├── Settings/                     # Configuration classes
│   ├── Validators/                   # FluentValidation rules
│   ├── Service/                      # Business logic layer
│   ├── Responses/                    # Standardized API responses
│   └── Common/                       # Shared utilities
├── Controllers/                      # API controllers
├── Domain/
│   └── Entities/                     # Database models
├── Exceptions/                       # Custom exceptions
├── Extensions/                       # DI, OAuth, JWT, Service setup
├── Infrastructure/                   # Context, Seed, ChatHub, EmailSender
├── Migrations/                       # EF Core migrations
├── Properties/                        # Project properties
├── wwwroot/                            # Static files
└── Program.cs                          # Application entry point
└── README.md
```

## User Roles

| Role | User Type | Key Responsibilities |
|------|-----------|---------------------|
| *Mentee* | End User | Book sessions, attend interviews, track progress |
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
| *Backend Developer* |Khaled Hroub | .NET API, database design, security |
| *Backend Developer* | Amjad Hamidi | .NET API, database design, security |

APIs Documentation (Swagger): https://mentor-hub.runasp.net/index.html
Project Demo (Vercel): https://mentorhub-zeta.vercel.app/home

<div align="center">



</div>
