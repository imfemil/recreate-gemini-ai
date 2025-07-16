

# Recreate Gemini AI - Frontend Clone (Next.js 15 + Zustand)

**[Notion Description](https://sticky-bearberry-cba.notion.site/2370ce7957874f468cd8c820f4b1686c?v=757f76a0e57a4013b181ab9fb8d8114a)**

A fully responsive, modern, Gemini AI frontend clone built with **Next.js 15 App Router**.
This project mimics Gemini's Chat Interface with authentication flow, dummy AI conversations, dark/light theme, and image upload — all using only frontend tools and simulated data.

---

## 🌟 Features

* ✅ **OTP-based Login/Signup** (Static OTP set for testing)
* ✅ **Dashboard with Chatroom & AI Response Simulation**
* ✅ **State Management with Zustand**
* ✅ **Form Validation with React Hook Form & Zod**
* ✅ **Dark / Light Mode Toggle**
* ✅ **Image Upload with Local Preview (Base64)**
* ✅ **Simulated AI Response with Throttling**
* ✅ **Mobile Responsive & Modern UI**
* ✅ **Deployed & Optimized for Vercel / Netlify**

---

## 🗂️ Project Structure

```
recreate-gemini-ai/
├── public/
│   └── google-gemini-icon.png      # Static assets
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── (auth)/                 # Authentication (login/signup)
│   │   ├── api/messages/           # Simulated API route
│   │   ├── dashboard/              # Chat Dashboard & Chatroom Pages
│   │   └── layout.tsx              # App-wide Layout & Theme Setup
│   ├── components/                 # Reusable Components (Chat UI, Inputs, Sidebar)
│   ├── context/                    # Context API (Chat Conversation Context)
│   ├── data/                       # Static Data (Dummy Chat History)
│   ├── hooks/                      # Custom Hooks (Chat Input, Theme, Chatroom)
│   ├── lib/                        # Utility Functions (AI Response Sim, Toasts, OTP)
│   ├── store/                      # Zustand Store for Global State
│   ├── style/                      # Global Styles (Tailwind)
│   ├── theme/                      # Theme Provider & Config
│   ├── types/                      # TypeScript Types
│   ├── validations/                # Validation Schemas using Zod
│   └── middleware.ts               # Auth Middleware (Optional)
├── README.md                       # Project Description (You are here)
├── next.config.ts                  # Next.js Configurations
├── package.json                    # Project Dependencies
└── tsconfig.json                   # TypeScript Config
```

---

## ⚙️ Tech Stack & Libraries Used

| Feature                    | Library / Framework            |
| -------------------------- | ------------------------------ |
| Frontend Framework         | **Next.js 15 (App Router)**    |
| State Management           | **Zustand**                    |
| Form Handling & Validation | **React Hook Form + Zod**      |
| Styling Framework          | **Tailwind CSS**               |
| Theming                    | **Next Themes** (custom)       |
| AI Response Simulated      | **setTimeout with Throttling** |
| Image Upload Preview       | **Base64 / Local Preview**     |
| Deployment Ready           | **Vercel / Netlify**           |

---

## 🔐 Authentication Details (For Demo Purpose)

* **Static OTP:** `123456`
* OTP is hardcoded for simplicity.
* No backend is used — OTP validation is handled in the frontend using a simulator.

---

## 💬 Chat & AI Simulation Logic

* Conversations are simulated with a slight delay using `setTimeout` to mimic AI typing.
* Dummy chat data is stored in `src/data/gemini_convertions_data.json`.
* New user input triggers a fake AI response after a delay.

---

## 🎨 Dark & Light Mode Toggle

* Handled via custom theme context with Zustand.
* Fully responsive and adaptive based on user toggle or system preference.

---

## 🖼️ Image Upload & Preview

* Users can upload images inside chat.
* Images are previewed locally using `URL.createObjectURL()` or Base64 encoding.
* No backend or actual upload is implemented.

---

## 🚀 Deployment

Recommended Deployment on **[Vercel](https://vercel.com/)** or **[Netlify](https://www.netlify.com/)**.

Simply push your project repo and connect with Vercel/Netlify for seamless deployment.

---

## 🛠️ Setup & Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/recreate-gemini-ai.git

# Navigate to the project directory
cd recreate-gemini-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📜 License

This project is created for **educational & demo purposes**.
Feel free to customize and use it for your personal learning or portfolio.

---

## 👨‍💻 Author

**Femil Patodiya (Femil Patel)**
[GitHub](https://github.com/imfemil) | [LinkedIn](https://www.linkedin.com/in/femilpatodiya/)
