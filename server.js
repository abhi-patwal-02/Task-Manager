const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const userRoutes = require("./routes/userRoutes")
const notificationRoutes = require("./routes/notificationRoutes")


dotenv.config();

const app = express();
connectDB()

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes)
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/users", userRoutes)
app.use("/api/notifications", notificationRoutes)

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));