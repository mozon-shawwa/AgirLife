# 🌿 AgirLife API

**AgirLife API** is a scalable **RESTful backend system** built with **Node.js, Express, and MongoDB**, designed to power an agricultural supplies platform that connects users with products, services, and content in an organized and secure way.

The API supports **authentication, e-commerce operations, online payments, content management**, and more.
---

## 🚀 Features

### 👤 User & Authentication
- Register and login using **email or phone number**.
- Login via **Google OAuth**.
- Password reset via email.
- Role-based access control (**Admin / Client**).

### 🛍️ Product Management
- Admin can create, update, delete, and upload product images.
- Public users can browse and search products.

### 🛒 Shopping Cart
- Add, update, or remove items from the user’s cart.
- Automatically linked to authenticated users.

### 📦 Orders
- Create orders from cart.
- Choose payment method (**Cash on Delivery** or **Online via Stripe**).
- Admin can manage shipping status.

### 💳 Payments
- Integrated with **Stripe** for secure online payments.
- Webhook support for automatic payment updates.

### 📰 Blogs & 📖 Stories
- Admin can post and manage blogs and stories.
- Public users can view and increase view count on stories/blogs.

### 📬 Contact Us
- Public users can send messages.
- Admin can view all messages and mark them as read.

---

## 🧠 Technologies Used

- **Node.js** + **Express.js** – API and routing  
- **MongoDB** + **Mongoose** – Database  
- **JWT** – Authentication & Authorization 
- **Passport.js (Google OAuth)** – Social login  
- **Cloudinary** – Image storage  
- **Stripe** – Online payment integration  
- **Multer** – File uploads  
- **Render** – Deployment platform  

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mozon-shawwa/AgirLife.git
   cd AgirLife
   ```
   
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Add environment variables in a .env file:**
   ```bash
   PORT=8080
   MONGO_URI=your_mongodb_connection
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. **Run the server locally:**
   ```bash
   npm start
   ```
---

## 🌍 Deployment

The API is deployed on **Render**:  
👉 [https://agirlife-api.onrender.com](https://agirlife-api.onrender.com)

