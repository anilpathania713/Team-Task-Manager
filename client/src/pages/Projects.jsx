import { useEffect, useState } from "react";
import { createProject, getProjects, createTask, getTasksByProject, updateTask } from "../services/api";

// --- Helper Components for Cleaner Code ---

const StatusBadge = ({ status }) => {
  const styles = {
    todo: "bg-slate-100 text-slate-600 border-slate-200",
    "in-progress": "bg-amber-50 text-amber-600 border-amber-200",
    done: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${styles[status] || styles.todo}`}>
      {status?.replace("-", " ")}
    </span>
  );
};

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
    <span className="text-4xl mb-3">{icon}</span>
    <h3 className="text-lg font-semibold text-slate-500">{title}</h3>
    <p className="text-sm">{subtitle}</p>
  </div>
);

// --- Main Component ---

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    due_date: "",
  });

  const loadTasks = async (projectId) => {
    setIsTasksLoading(true);
    const res = await getTasksByProject(projectId);
    setTasks(res);
    setSelectedProject(projectId);
    setIsTasksLoading(false);
  };

  const handleCreateTask = async () => {
    if (!taskForm.title) return alert("Task title is required");
    
    // FIX: Convert empty strings to null so the database stores NULL properly
    const payload = {
      ...taskForm,
      assigned_to: taskForm.assigned_to || null,
      due_date: taskForm.due_date || null,
      description: taskForm.description || null, // Ensure empty description becomes null
      project_id: selectedProject
    };

    const res = await createTask(payload);
    if (res.taskId) {
      setTaskForm({ title: "", description: "", assigned_to: "", due_date: "" });
      loadTasks(selectedProject);
    } else {
      alert(res.msg || "Failed to create task");
    }
  };

  const changeStatus = async (id, status) => {
    await updateTask(id, status);
    loadTasks(selectedProject);
  };

  const loadProjects = async () => {
    const res = await getProjects();
    setProjects(res);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async () => {
    if (!form.name) return alert("Project name required");
    const res = await createProject(form);
    if (res.projectId) {
      setForm({ name: "", description: "" });
      loadProjects();
    } else {
      alert(res.msg || "Failed to create project");
    }
  };

  // Group tasks by status for Kanban view
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  const TaskColumn = ({ title, status, tasks, color, onChangeStatus }) => (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
          <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{title}</h3>
        </div>
        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center text-sm text-slate-400 mt-6">No tasks</div>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 group"
            >
              <h4 className="font-medium text-slate-800 mb-1">{t.title}</h4>
              {t.description && <p className="text-slate-500 text-sm mb-3 line-clamp-2">{t.description}</p>}
              
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                {t.assigned_to && <span>👤 User {t.assigned_to}</span>}
                {t.due_date && <span>📅 {new Date(t.due_date).toLocaleDateString()}</span>}
              </div>

              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {status !== "todo" && (
                  <button
                    onClick={() => onChangeStatus(t.id, "todo")}
                    className="flex-1 text-[11px] font-medium py-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    To Do
                  </button>
                )}
                {status !== "in-progress" && (
                  <button
                    onClick={() => onChangeStatus(t.id, "in-progress")}
                    className="flex-1 text-[11px] font-medium py-1.5 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                  >
                    In Progress
                  </button>
                )}
                {status !== "done" && (
                  <button
                    onClick={() => onChangeStatus(t.id, "done")}
                    className="flex-1 text-[11px] font-medium py-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR - PROJECTS */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">Workspace</h1>
            <p className="text-slate-500 text-sm">Manage your projects & tasks</p>
          </div>

          {/* CREATE PROJECT CARD */}
          <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-violet-500">+</span> New Project
            </h2>
            <div className="flex flex-col gap-3">
              <input
                className="border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                placeholder="Project Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                className="border border-slate-200 p-2.5 rounded-lg text-sm resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                placeholder="Short description..."
                rows="2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <button
                onClick={handleCreate}
                className="bg-violet-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-200"
              >
                Create Project
              </button>
            </div>
          </div>

          {/* PROJECT LIST */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Your Projects</h2>
            {projects.length === 0 ? (
              <EmptyState icon="🗂" title="No Projects" subtitle="Create one to get started" />
            ) : (
              <div className="flex flex-col gap-2">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => loadTasks(p.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      selectedProject === p.id
                        ? "bg-violet-50 border-violet-200 shadow-sm shadow-violet-100"
                        : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <h3 className={`font-semibold mb-0.5 ${selectedProject === p.id ? "text-violet-700" : "text-slate-800"}`}>
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.description || "No description"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAIN AREA - TASKS */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {selectedProject ? (
            <div className="flex flex-col h-full">
              {/* TASK HEADER */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  {selectedProjectData?.name || "Project Tasks"}
                </h2>
                <p className="text-slate-500 text-sm">{selectedProjectData?.description || "Track your project progress"}</p>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {/* CREATE TASK FORM */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
                  <h3 className="font-semibold text-slate-700 mb-3 text-sm">Add a new task</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="col-span-1 md:col-span-2 border border-slate-200 bg-white p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                      placeholder="Task Title *"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    />
                    {/* ADDED: Task Description Textarea */}
                    <textarea
                      className="col-span-1 md:col-span-2 border border-slate-200 bg-white p-2.5 rounded-lg text-sm resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                      placeholder="Task Description (Optional)"
                      rows="2"
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    />
                    <input
                      className="border border-slate-200 bg-white p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                      placeholder="Assign To (User ID)"
                      value={taskForm.assigned_to}
                      onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                    />
                    <input
                      type="date"
                      className="border border-slate-200 bg-white p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                      value={taskForm.due_date}
                      onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleCreateTask}
                      className="bg-violet-600 text-white font-medium px-5 py-2 rounded-lg text-sm hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-200"
                    >
                      Add Task
                    </button>
                  </div>
                </div>

                {/* KANBAN BOARD */}
                {isTasksLoading ? (
                  <div className="text-center py-20 text-slate-400">Loading tasks...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <TaskColumn
                      title="To Do"
                      status="todo"
                      tasks={todoTasks}
                      color="bg-slate-400"
                      onChangeStatus={changeStatus}
                    />
                    <TaskColumn
                      title="In Progress"
                      status="in-progress"
                      tasks={inProgressTasks}
                      color="bg-amber-400"
                      onChangeStatus={changeStatus}
                    />
                    <TaskColumn
                      title="Done"
                      status="done"
                      tasks={doneTasks}
                      color="bg-emerald-400"
                      onChangeStatus={changeStatus}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              icon="👈"
              title="Select a Project"
              subtitle="Choose a project from the left to view its tasks"
            />
          )}
        </div>
      </div>
    </div>
  );
}