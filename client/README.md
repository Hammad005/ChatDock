<h1 align="center">ChatDock 💭</h1>

<p>"ChatDock is a fast, secure, and modern web-based messaging platform designed to bring all your conversations together in one seamless space. Whether you're at home, at work, or on the go, ChatDock keeps your messages organized, accessible, and synchronized across all your devices. With a clean, intuitive interface and robust encryption, you can chat confidently knowing your privacy is protected. Stay connected with friends, family, and colleagues — all from the comfort of your browser, without missing a single moment"</p>

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
VITE_GOOGLE_CLIENT_ID=           # Google Client Id (for google authentication)
VITE_GOOGLE_CLIENT_SECRET=       # Google CLient Secret (for google authentication)
VITE_GOOGLE_CALLBACK_URL=        # http://localhost:(PORT)/api/auth/google/callback (Make sure add the same url that you gave on google cloud platform)
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

# 📌 Important Notes
- Ensure that `.env` files are properly configured in both the client and server folders.
- The application will not function correctly without valid API credentials.

---

# 🙌 Acknowledgements

#### Special thanks to the APIs and services that made this project possible:

- [socket.io](https://socket.io)
- [Cloudinary](https://cloudinary.com/)

#### Made with ❤️ by [Hammad Khatri](https://github.com/Hammad005)
