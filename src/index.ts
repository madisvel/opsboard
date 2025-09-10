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

app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  const task = taskMap.get(taskId);

  if (!task) {
    return res.status(404).send(`No task with id ${taskId} found`);
  }

  const { title, done } = req.body;

  const updatedTask: Task = {
    ...task,
    title: typeof title === "string" ? title : task.title,
    done: typeof done === "boolean" ? done : task.done,
  };

  taskMap.set(taskId, updatedTask);

  res.status(200).json(updatedTask);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
