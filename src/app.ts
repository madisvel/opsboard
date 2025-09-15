import express from "express";
import crypto from "crypto";
import { z } from "zod";

import type { Request, Response, NextFunction } from "express";

const TaskCreateSchema = z.object({
  title: z.string().trim().min(1, "Title must be at least 1 character"),
});

const TaskUpdateSchema = z.object({
  title: z.string().trim().min(1, "Title, if present, must be at least 1 character").optional(),
  done: z.boolean().optional(),
});

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export const taskMap = new Map<string, Task>();

taskMap.set("1", { id: "1", title: "Task 1", done: false });
taskMap.set("2", { id: "2", title: "Task 2", done: true });

function validateBody<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(z.treeifyError(result.error));
    }
    req.body = result.data;
    next();
  };
}

export const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/tasks", (req, res) => {
  res.json(Array.from(taskMap.values()));
});

app.post("/tasks", validateBody(TaskCreateSchema), (req, res) => {
  const id = crypto.randomUUID();

  const { title } = req.body;

  const newTask: Task = { id: id, done: false, title: title };
  taskMap.set(id, newTask);

  res.status(201).json(newTask);
});

app.put("/tasks/:id", validateBody(TaskUpdateSchema), (req, res) => {
  const taskId = req.params.id;

  const task = taskMap.get(taskId);

  if (!task) {
    return res.status(404).send(`No task with id ${taskId} found`);
  }

  const { title, done } = req.body;

  const updatedTask: Task = {
    ...task,
    title: title ?? task.title,
    done: done ?? task.done,
  };

  taskMap.set(taskId, updatedTask);

  res.status(200).json(updatedTask);
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  if (taskMap.delete(taskId)) {
    return res.sendStatus(204);
  }

  res.status(404).json({ error: `No task with id ${taskId}` });
});
