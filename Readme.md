# Ayirbasta Backend

Ayirbasta backend is built with **Node.js**, **Express**, and **MongoDB**. It provides **RESTful APIs** for the barter exchange platform, handling user authentication, item management, and trade operations.

The Ayirbasta frontend is built with **React.js**, enabling users to interact with the platform through a modern and responsive web interface.

## 🚀 Tech Stack (Backend)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **Security:**
  - bcrypt (password hashing)
  - cors (Cross-Origin Resource Sharing)
  - helmet (HTTP headers security)

## 💡 Why MERN Stack?

The **MERN stack** (MongoDB, Express, React, Node.js) was chosen for the Ayirbasta project for the following reasons:

- **MongoDB**: A flexible, document-oriented database that allows for dynamic schemas, making it perfect for handling complex data structures such as user items and trades.
- **Express.js**: A minimal and flexible Node.js web framework that simplifies server-side development, allowing for efficient routing, middleware integration, and RESTful API creation.
- **React**: A powerful, component-based JavaScript library that facilitates building interactive and responsive user interfaces, providing a seamless user experience.
- **Node.js**: A fast, event-driven runtime environment that enables server-side JavaScript execution, making it ideal for building scalable and real-time applications.

This combination allows for full-stack JavaScript development, enabling **smoother data flow** and **better developer productivity** with a single language across both frontend and backend.

## ✨ Key Features

### 🔑 User Authentication

- **Login**: Existing users can sign in.
- **Registration**: New users can create an account with their email, password, and personal details.

### 🎯 Offers Management

- **Offers Page**: Displays a user’s active offers (items/services) and allows them to add new offers.
- **Add Offer**: A dedicated page with a form for creating new offers, including file uploads (images).

### 🔄 Barter (Trades)

- **Barters Page**: Shows trades initiated by the user or to the user.
- **Trade Details**: Each trade can be opened to view or finalize the exchange.

### ⚙️ Profile Settings

- **Settings Page**: Lets users update their first name, last name, email, city, and upload a profile image.

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following content:

```env
MONGO_URI=mongodb+srv://alibi:1234@cluster0.gg1ix.mongodb.net/assignment3?retryWrites=true&w=majority
PORT=8080
JWT_SECRET=your_jwt_secret_key
```

## 🛠 Setup & Installation

### 🔹 Clone the Repository

```sh
git clone https://github.com/Alibi7777/ayirbasta_backend.git
cd ayirbasta_backend
```

### 🔹 Install Dependencies

```sh
npm install  # or yarn install
```

### 🔹 Start MongoDB

Ensure MongoDB is running locally or connect to MongoDB Atlas.

### 🔹 Run the Application

#### Development Mode

```sh
npm run dev
```

#### Production Mode

```sh
npm start
```

## 📌 Frontend Repository

The frontend of Ayirbasta is built with **React.js**.

```sh
git clone https://github.com/Alibi7777/ayirbasta_frontend.git
cd ayirbasta_frontend
npm install  # or yarn install
npm run dev  # or yarn dev
```

## 📩 Contact

For any inquiries, feel free to reach out:

- **GitHub**: [Alibi7777](https://github.com/Alibi7777)

Happy coding! 🚀
