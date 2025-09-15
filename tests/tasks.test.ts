import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app, taskMap } from "../src/app.js";

describe("Tasks API", () => {
  beforeEach(() => {
    taskMap.clear();
  });

  it("creates a task", async () => {
    const res = await request(app).post("/tasks").send({ title: "Test task" }).expect(201);

    expect(res.body).toMatchObject({ title: "Test task", done: false });
  });

  it("rejects invalid task", async () => {
    await request(app).post("/tasks").send({ title: "" }).expect(400);
  });

  it("creates and updates a task", async () => {
    const createRes = await request(app).post("/tasks").send({ title: "Test task" }).expect(201);
    const taskId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ title: "Updated task", done: true })
      .expect(200);

    expect(updateRes.body).toMatchObject({ id: taskId, title: "Updated task", done: true });
  });

  it("deletes a task", async () => {
    const createRes = await request(app).post("/tasks").send({ title: "Test task" }).expect(201);
    const taskId = createRes.body.id;

    await request(app).delete(`/tasks/${taskId}`).expect(204);
  });
});
