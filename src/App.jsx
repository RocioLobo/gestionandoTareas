import { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("media");

  const addTask = () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text,
      deadline,
      priority,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    setText("");
    setDeadline("");
    setPriority("media");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="container">
      <h1 className="app-title">Gestor de Tareas</h1>

      {/* Formulario */}
      <div className="task-form">
        <input
          type="text"
          placeholder="Escribe una tarea..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="label">Fecha límite:</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <label className="label">Prioridad:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="select"
        >
          <option value="alta">Alta 🔥</option>
          <option value="media">Media ⭐</option>
          <option value="baja">Baja 🍃</option>
        </select>

        <button onClick={addTask}>Agregar Tarea</button>
      </div>

      {/* Lista */}
      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="empty">No hay tareas aún ✨</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <h3>{task.text}</h3>

              <p>
                <strong>Fecha límite:</strong>{" "}
                {task.deadline ? task.deadline : "Sin fecha"}
              </p>

              <p>
                <strong>Prioridad:</strong>{" "}
                <span className={`prio ${task.priority}`}>
                  {task.priority.toUpperCase()}
                </span>
              </p>

              <div className="task-buttons">
                <button onClick={() => toggleComplete(task.id)}>
                  {task.completed ? "Desmarcar" : "Completar"}
                </button>
                <button onClick={() => deleteTask(task.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
