# 🍽️ Dinu's Tasty — Restaurant Website

> A full-stack restaurant website with online ordering, table reservations, order tracking, and an admin dashboard — built for **Dinu's Tasty**, Kandy's finest restaurant.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-green?style=for-the-badge&logo=spring)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

---

## 🌟 Features

### 👥 Customer Features
- 🏠 **Beautiful Home Page** — Hero section with restaurant photos and gallery
- 🍛 **Menu Page** — Browse all items with category filter and real food photos
- 📦 **Online Ordering** — Select items, add to cart, place order via WhatsApp
- 🗓️ **Table Reservations** — Book a table with date, time and guest count
- 🔍 **Order Tracking** — Track order status live using order number or phone
- 📱 **Mobile Responsive** — Works perfectly on all screen sizes

### 👑 Admin Features
- 🔐 **Secure Login** — JWT authentication for staff only
- 📊 **Dashboard** — View all orders, reservations and menu stats
- 🍛 **Menu Management** — Add and delete menu items with emoji and photos
- 📦 **Order Management** — Update order status (pending → confirmed → completed)
- 🗓️ **Reservation Management** — Manage table bookings

### 📱 WhatsApp Integration
- Orders automatically send WhatsApp message to restaurant
- Reservations send WhatsApp notification instantly
- Customer gets order number for tracking

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, CSS |
| Backend | Spring Boot 4.0, Java 17 |
| Database | PostgreSQL 16 |
| Auth | JWT (JSON Web Tokens) |
| Images | Unsplash API (free) |
| Notifications | WhatsApp Web API |

---

## 📁 Project Structure
```
restaurant-web-page/
├── client-side/                 # Next.js Frontend
│   ├── app/
│   │   ├── components/
│   │   │   └── Navbar.tsx       # Mobile responsive navbar
│   │   ├── menu/
│   │   │   └── page.tsx         # Menu page
│   │   ├── order/
│   │   │   └── page.tsx         # Order & reservation page
│   │   ├── track/
│   │   │   └── page.tsx         # Order tracking page
│   │   ├── admin/
│   │   │   ├── page.tsx         # Admin dashboard
│   │   │   └── login/
│   │   │       └── page.tsx     # Admin login
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   └── package.json
│
└── server-side/                 # Spring Boot Backend
    └── src/main/java/com/example/dinustastyapi/
        ├── controller/
        │   ├── AuthController.java
        │   ├── MenuController.java
        │   ├── OrderController.java
        │   └── ReservationController.java
        ├── model/
        │   ├── MenuItem.java
        │   ├── Order.java
        │   ├── OrderItem.java
        │   ├── Reservation.java
        │   └── User.java
        ├── repository/
        │   ├── MenuItemRepository.java
        │   ├── OrderRepository.java
        │   ├── ReservationRepository.java
        │   └── UserRepository.java
        └── security/
            ├── JwtUtil.java
            ├── SecurityConfig.java
            └── CorsConfig.java
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 16+
- Maven

### 1. Clone the Repository
```bash
git clone https://github.com/Paramith2004/Restaurant-Web-Page.git
cd Restaurant-Web-Page
```

### 2. Setup Database
```sql
CREATE DATABASE dinus_tasty;
```

### 3. Configure Backend
Open `server-side/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dinus_tasty
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
server.port=8081
```

### 4. Run Backend
```bash
cd server-side
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8081`

### 5. Run Frontend
```bash
cd client-side
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## 🔗 API Endpoints

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items |
| GET | `/api/menu/category/{category}` | Get by category |
| POST | `/api/menu` | Add menu item (admin) |
| DELETE | `/api/menu/{id}` | Delete menu item (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Place new order |
| PUT | `/api/orders/{id}/status` | Update order status |

### Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | Get all reservations |
| POST | `/api/reservations` | Make reservation |
| PUT | `/api/reservations/{id}/status` | Update status |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register staff |
| POST | `/api/auth/login` | Login |

---

## 👤 Admin Access

The admin panel is at `/admin/login` — not shown in public navbar.

### Create Admin Account
```bash
curl -X POST http://localhost:8081/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Admin","email":"admin@email.com","password":"password"}'
```

Then in PostgreSQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@email.com';
```

### User Roles
| Role | Access |
|------|--------|
| `admin` | Full access — manage everything |
| `owner` | View orders, reservations, menu |
| `staff` | View and update orders |

---

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with hero and menu preview |
| Menu | `/menu` | Full menu with category filter |
| Order | `/order` | Place order or reserve table |
| Track | `/track` | Track order by ID or phone |
| Admin Login | `/admin/login` | Staff login (secret) |
| Admin Dashboard | `/admin` | Manage orders, reservations, menu |

---

## 🎨 Design

- **Color Scheme** — Dark gold `#C9A84C` on dark background `#0D0D0D`
- **Typography** — Playfair Display (headings) + DM Sans (body)
- **Photos** — Free Unsplash images (no copyright issues)
- **Mobile First** — Hamburger menu, responsive grids

---

## 🌍 How It Works
```
Customer Journey:
1. Visit website → Browse menu
2. Select items → Add to cart
3. Fill details → Place order
4. WhatsApp sent to restaurant 📱
5. Get order number → Track at /track
6. Restaurant updates status → Customer sees live

Admin Journey:
1. Go to /admin/login
2. Login with staff credentials
3. See all orders & reservations
4. Update order status
5. Manage menu items
```

---

## 📞 Restaurant Info

- **Name** — Dinu's Tasty
- **Location** — Kandy, Sri Lanka 🇱🇰
- **Phone** — 0771 234 567
- **Hours** — Every day 8am – 10pm
- **Delivery** — PickMe & Uber Eats

---

## 👨‍💻 Developer

**Paramith Kavisha**
- GitHub: [@Paramith2004](https://github.com/Paramith2004)

---

## 📄 License

This project is built for **Dinu's Tasty Restaurant**, Kandy, Sri Lanka.

---

*Built with ❤️ by Paramith Kavisha*
