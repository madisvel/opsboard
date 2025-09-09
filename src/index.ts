import express from "express";

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

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.get("/tasks", (req, res) => {
  res.json(Array.from(taskMap.values()));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
