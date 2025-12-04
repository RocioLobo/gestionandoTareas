import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // -------------------- ESTADOS --------------------
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("media");
  const [category, setCategory] = useState("General");
  const [subtaskText, setSubtaskText] = useState("");
  const [filter, setFilter] = useState("todas");
  const [darkMode, setDarkMode] = useState(false);

  // -------------------- LOCAL STORAGE --------------------
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // -------------------- AGREGAR TAREA --------------------
  const addTask = () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text,
      deadline,
      priority,
      category,
      completed: false,
      subtasks: [],
    };

    setTasks([...tasks, newTask]);
    setText("");
    setDeadline("");
    setPriority("media");
    setCategory("General");
  };

  // -------------------- SUBTAREAS --------------------
  const addSubtask = (id) => {
    if (!subtaskText.trim()) return;

    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              subtasks: [
                ...t.subtasks,
                { id: Date.now(), text: subtaskText, done: false },
              ],
            }
          : t
      )
    );

    setSubtaskText("");
  };

  const toggleSubtask = (taskId, subId) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subId ? { ...s, done: !s.done } : s
              ),
            }
          : t
      )
    );
  };

  // -------------------- COMPLETAR Y ELIMINAR --------------------
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // -------------------- FILTROS --------------------
  const filteredTasks = tasks.filter((task) => {
    if (filter === "hoy") {
      const today = new Date().toISOString().split("T")[0];
      return task.deadline === today;
    }
    if (filter === "urgentes") return task.priority === "alta";
    if (filter === "completadas") return task.completed;
    return true;
  });

  // -------------------- DRAG & DROP --------------------
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const onDrop = (e) => {
    const id = e.dataTransfer.getData("id");
    const draggedTask = tasks.find((t) => t.id == id);
    const otherTasks = tasks.filter((t) => t.id != id);

    setTasks([draggedTask, ...otherTasks]);
  };

  return (
    <div className={darkMode ? "container dark" : "container"} onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>

      {/* MODO OSCURO */}
      <button className="dark-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Modo Claro ☀️" : "Modo Oscuro 🌙"}
      </button>

      <h1 className="app-title">Gestor de Tareas </h1>

      {/* FORMULARIO */}
      <div className="task-form">

        <input
          type="text"
          placeholder="Escribe una tarea..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label>Fecha límite:</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

        <label>Prioridad:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="alta">Alta 🔥</option>
          <option value="media">Media ⭐</option>
          <option value="baja">Baja 🍃</option>
        </select>

        <label>Categoría:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>General</option>
          <option>Trabajo</option>
          <option>Estudios</option>
          <option>Personal</option>
        </select>

        <button onClick={addTask}>Agregar Tarea</button>
      </div>

      {/* FILTROS */}
      <div className="filters">
        <button onClick={() => setFilter("todas")}>Todas</button>
        <button onClick={() => setFilter("hoy")}>Hoy</button>
        <button onClick={() => setFilter("urgentes")}>Urgentes</button>
        <button onClick={() => setFilter("completadas")}>Completadas</button>
      </div>

      {/* LISTA DE TAREAS */}
      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <p className="empty">No hay tareas ✨</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
            >
              <h3>{task.text}</h3>

              <p><strong>Categoría:</strong> {task.category}</p>
              <p><strong>Fecha límite:</strong> {task.deadline || "Sin fecha"}</p>
              <p><strong>Prioridad:</strong> <span className={`prio ${task.priority}`}>{task.priority}</span></p>

              {/* SUBTAREAS */}
              <div className="subtasks">
                <h4>Subtareas:</h4>
                {task.subtasks.map((s) => (
                  <div key={s.id} className="subtask">
                    <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(task.id, s.id)} />
                    <span className={s.done ? "done" : ""}>{s.text}</span>
                  </div>
                ))}
                <div className="subtask-add">
                  <input
                    type="text"
                    placeholder="Nueva subtarea..."
                    value={subtaskText}
                    onChange={(e) => setSubtaskText(e.target.value)}
                  />
                  <button onClick={() => addSubtask(task.id)}>➕</button>
                </div>
              </div>

              {/* BOTONES */}
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
