from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json, uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA = "tasks.json"

def read_db():
    with open(DATA, "r") as f:
        return json.load(f)

def write_db(data):
    with open(DATA, "w") as f:
        json.dump(data, f, indent=2)

@app.get("/tasks")
def get_tasks():
    return read_db()

@app.post("/tasks")
def add_task(task: dict):
    data = read_db()
    task["id"] = str(uuid.uuid4())
    task["done"] = False
    data.append(task)
    write_db(data)
    return task

@app.put("/tasks/{task_id}/toggle")
def toggle(task_id: str):
    data = read_db()
    for t in data:
        if t["id"] == task_id:
            t["done"] = not t["done"]
    write_db(data)
    return {"status": "updated"}

@app.delete("/tasks/{task_id}")
def delete(task_id: str):
    data = read_db()
    data = [t for t in data if t["id"] != task_id]
    write_db(data)
    return {"status": "deleted"}
