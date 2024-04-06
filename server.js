require("dotenv").config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const uri = process.env.DATABASE_URL;
mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to db"));
 
app.use(express.json())

const authRouter = require("./routes/auth"); // Импорт роутов для регистрации и логина
const authMiddleware = require("./middleware/auth"); // Импорт middleware для авторизации
app.use('/auth', authRouter); // Обработка маршрутов для регистрации и входа

const projectsRouter = require("./routes/projects");
app.use("/projects", authMiddleware, projectsRouter) 

const statusesRouter = require("./routes/statuses");
app.use("/statuses", authMiddleware, statusesRouter)

const tasksRouter = require("./routes/tasks");
app.use("/tasks", authMiddleware, tasksRouter)

const timeRouter = require("./routes/timeentries");
app.use("/entries", authMiddleware, timeRouter)

app.listen(3000, ()=>{
    console.log("Server started");
});