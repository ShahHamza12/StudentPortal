# EduPortal - Professional Student Dashboard 🎓

**EduPortal** is a comprehensive web-based application designed to streamline academic workflows for educational institutions. The platform offers a dual-role interface for **Students** and **Teachers**, utilizing a robust **LocalStorage-first** architecture for seamless data persistence and offline accessibility.

---

## 👨‍💻 Developer
**Sahil Raj** *Aspiring Software Engineer | B.Tech in AI & Data Science*

---

## 🚀 Key Features

### 🔐 Multi-Role Authentication
* **Role-Based Access:** Distinct dashboards tailored for Students and Teachers.
* **Secure Registration:** Onboard users with encrypted-style handling, storing credentials directly in the browser's local database.
* **Personalized Experience:** Dynamic UI rendering based on the logged-in user's profile.

### 👨‍🏫 Faculty Module (Teacher Dashboard)
* **Student Lifecycle Management:** Enroll, track, and manage student records via unique Registration IDs.
* **Grade Management System:** Effortlessly update subject-wise performance (Mathematics, Science, CS) with instant calculation.
* **Academic Scheduling:** Integrated 6-day (Mon-Sat) class routine management including time-slots and room assignments.
* **State Synchronization:** Automated real-time syncing between the UI and LocalStorage.

### 👨‍🎓 Learner Module (Student Dashboard)
* **Performance Analytics:** Comprehensive overview of GPA, total attendance, and academic standing.
* **Data Visualization:** Visual trends for monthly attendance and internal assessment scores.
* **Financial Tracking (₹):** Transparent breakdown of academic fees, including paid and outstanding balances in INR.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React.js (Vite) |
| **Styling** | Tailwind CSS (Modern, Responsive Design) |
| **Iconography** | Lucide-React |
| **Data Persistence** | Browser LocalStorage API |
| **Animation** | Tailwind Animate & Framer Motion / CSS Transitions |

---

## 📦 Installation & Setup

Follow these steps to run the project locally on your machine:

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/Sahilraj2325/STUDENT_PORTAL.git](https://github.com/Sahilraj2325/STUDENT_PORTAL.git)
   cd STUDENT_PORTAL
Install Dependencies:

Bash
npm install
Start the Development Server:

Bash
npm run dev
Launch the App:
Navigate to http://localhost:5173 in your preferred web browser.

📊 Architecture & Database
To ensure high performance and zero server costs, this project utilizes a Master JSON Object architecture. By leveraging the browser's LocalStorage API, the application functions as an offline-first tool, allowing users to save and retrieve data without requiring an active internet connection or external cloud database.

📝 License
This project is licensed under the MIT License.

EduPortal v1.0 | Engineered with ❤️ by Sahil Raj