import express from "express";
import crypto from "crypto";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

const taskMap = new Map<string, Task>();

taskMap.set("1", { id: "1", title: "Task 1", done: false });
taskMap.set("2", { id: "2", title: "Task 2", done: true });

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/tasks", (req, res) => {
  res.json(Array.from(taskMap.values()));
});

app.post("/tasks", (req, res) => {
  const id = crypto.randomUUID();

  const title = String(req.body?.title ?? "").trim();

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask: Task = { id: id, done: false, title: title };
  taskMap.set(id, newTask);

  res.status(201).json(newTask);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
