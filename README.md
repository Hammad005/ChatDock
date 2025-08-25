<h1 align="center">ChatDock 💭</h1>

![Demo App](/client/public/banner.png)

<p>"ChatDock is a fast, secure, and modern web-based messaging platform designed to bring all your conversations together in one seamless space. Whether you're at home, at work, or on the go, ChatDock keeps your messages organized, accessible, and synchronized across all your devices. With a clean, intuitive interface and robust encryption, you can chat confidently knowing your privacy is protected. Stay connected with friends, family, and colleagues — all from the comfort of your browser, without missing a single moment"</p>

---

## 📁 Project Structure

```bash
ChatDock/
├── client/  # Vite + React frontend
└── server/  # Node.js + Express backend
```

---

# 📄 Clone the Repository

```bash
git clone https://github.com/Hammad005/ChatDock.git
```

---

# 🔧 Server Setup (/server)

### 1. 📦 Install Dependencies

```bash
cd server
npm install
```

### 2. ⚙️ Environment Variables

##### Create a `.env` file in the `server` directory and add the following variables:

```env
PORT=                       # Port number (e.g., 5000)
CLIENT_URL=                 # Your frontend URL (e.g., http://localhost:5173)

MONGO_URI=                  # Your MongoDB connection string

CLOUDINARY_CLOUD_NAME=      # Cloudinary cloud name
CLOUDINARY_API_KEY=         # Cloudinary API key
CLOUDINARY_API_SECRET=      # Cloudinary API secret

GOOGLE_CLIENT_ID=           # Google Client Id (for google authentication)
GOOGLE_CLIENT_SECRET=       # Google CLient Secret (for google authentication)
GOOGLE_CALLBACK_URL=        # http://localhost:(PORT)/api/auth/google/callback (Make sure add the same url that you gave on google cloud platform)

JWT_SECRET=                 # Secret key for JWT authentication
NODE_ENV=                   # your envionment like('development' or 'production')
```

### 3.📡 API Endpoints

## 🔐 User Endpoints:

<span style="color:green">**✅Craeting A New User:**</span>


- **URL**:              `/api/auth/signup`
- **Method**:           `POST`
- **Body**:             `fullname, email, password`
- **Credentials**:      `True`
- **Auth required**:    `No`

<span style="color:green">**🔓Login Existing User:**</span>

- **URL**:              `/api/auth/login`
- **Method**:           `POST`
- **Body**:             `email, password`
- **Credentials**:      `True`
- **Auth required**:    `No`

<span style="color:green">**🚪Logout User:**</span>

- **URL**:              `/api/auth/logout`
- **Method**:           `POST`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `(Optional)`

<span style="color:green">**✏️Update Existing User:**</span>

- **URL**:              `/api/auth/update`
- **Method**:           `PUT`
- **Body**:             `fullname(Optional), about(Optional), profilePic(Optional`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**🗑️Remove Existing User Profile:**</span>

- **URL**:              `/api/auth/removeProfile`
- **Method**:           `DELETE`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**👤Get Logged-In User Profile:**</span>

- **URL**:              `/api/auth/me`
- **Method**:           `GET`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**👥Get All Users:**</span>

- **URL**:              `/api/auth/allUsers`
- **Method**:           `GET`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

## 🤝 Friend Request Endpoints:

<span style="color:green">**🫂 Get Logged-In User's Friend Requests:**</span>

- **URL**:              `/api/requests/getMyRequests`
- **Method**:           `GET`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**👋 Send Friend Request:**</span>

- **URL**:              `/api/requests/sendRequest/:id` (It Requires Id Of user That You Want To send friend request)
- **Method**:           `POST`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**🤝 Accept Friend Request:**</span>

- **URL**:              `/api/requests/acceptRequest/:id` (It Requires Id Of friend request)
- **Method**:           `PUT`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**🗑️ Delete Friend Request:**</span>

- **URL**:              `/api/requests/rejectRequest/:id` (It Requires Id Of friend request)
- **Method**:           `DELETE`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**🗑️ Remove Friend:**</span>

- **URL**:              `/api/requests/removeFriend/:userId/:requestId` (It Requires userId:(friend's id that you want to remove) and requestId: (friend request id))
- **Method**:           `DELETE`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

## ✉️ Messages Endpoints:

<span style="color:green">**📩 Get Logged-In User's Messages:**</span>

- **URL**:              `/api/messages/getMessages`
- **Method**:           `GET`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**📨 Send Message to friend:**</span>

- **URL**:              `/api/messages/sendMessage/:id` (It Requires Id Of friend That You Want To send message)
- **Method**:           `POST`
- **Body**:             `text(Optional), images(Optional), files(Optional)`
- **Credentials**:      `True`
- **Auth required**:    `Yes`

<span style="color:green">**👀 Make the message mark as seen:**</span>

- **URL**:              `/api/messages/markAsSeen/:id` (It Requires Id Of friend That You send message)
- **Method**:           `PUT`
- **Body**:             `Null`
- **Credentials**:      `True`
- **Auth required**:    `Yes`



### 4. 🧪 Run Server

```bash
# For development
npm run dev

# For production
npm start
```

#### The server should now be running at: `http://localhost:(PORT)`

---

# 💻 Client Setup (/client)

### 1. 📦 Install Dependencies

```bash
cd client
npm install
```

### 2. ⚙️ Environment Variables

##### Create a `.env` file in the `client` directory and add the following variables:

```env
VITE_API_URL=                    # Your backend API base URL (e.g., http://localhost:5000)
```

### 3. 🧪 Run Client

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### The client will be available at: `http://localhost:5173` (default Vite port)

---

# 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Shadcn, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **APIs Used**: Cloudinary

---

# 📌 Important Notes
- Ensure that `.env` files are properly configured in both the client and server folders.
- All external APIs and services (MongoDB, Cloudinary) must be active and authorized.
- The application will not function correctly without valid API credentials.

---

# 🙌 Acknowledgements

#### Special thanks to the APIs and services that made this project possible:

- [socket.io](https://socket.io)
- [Cloudinary](https://cloudinary.com/)

#### Made with ❤️ by [Hammad Khatri](https://github.com/Hammad005)
