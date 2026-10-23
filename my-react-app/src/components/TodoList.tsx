import { useEffect, useState } from "react";
import { message } from "antd";

type TodoPriority = "medium" | "hight" | "low";
type PriorityFilter = TodoPriority | "all";
type TodoFilter = "all" | "active" | "completed";
type SortBy = "desc" | "asc" | "priority" | "default";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    isEdit?: boolean;
    priority: TodoPriority;
    createdAt: string;
}

const PRIORITY_STYLES: Record<TodoPriority, string> = {
    hight: "bg-rose-100 text-rose-700 ring-rose-200",
    medium: "bg-amber-100 text-amber-700 ring-amber-200",
    low: "bg-emerald-100 text-emerald-700 ring-emerald-200",
};

const PRIORITY_WEIGHT: Record<TodoPriority, number> = {
    hight: 3,
    medium: 2,
    low: 1,
};

export function TodoList() {
    const [todoList, setTodoList] = useState<Todo[]>(() => {
        try {
            const savedTodos = localStorage.getItem("todoList");
            return savedTodos ? JSON.parse(savedTodos) : [];
        } catch (error) {
            console.error("Lỗi đọc localStorage:", error);
            return [];
        }
    });
    const [newTodo, setNewTodo] = useState<string>("");
    const [textEdit, setTextEdit] = useState<string>("");
    const [priorityEdit, setPriorityEdit] = useState<TodoPriority>("low");
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
    const [priority, setPriority] = useState<TodoPriority>("low");
    const [textSearch, setTextSearch] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<TodoFilter>("all");
    const [sortBy, setSortBy] = useState<SortBy>("default");

    const getMaxId = (list: Todo[]): number => {
        if (list.length === 0) return 0;
        return Math.max(...list.map((item) => item.id));
    };

    const handleAddTodo = () => {
        if (!newTodo.trim()) return;
        setTodoList((prevTodoList) => [
            ...prevTodoList,
            {
                id: getMaxId(prevTodoList) + 1,
                title: newTodo.trim(),
                completed: false,
                priority,
                createdAt: new Date().toISOString(),
            },
        ]);
        setNewTodo("");
    };

    const handleRemoveTodo = (id: number) => {
        setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    };

    const handleEditTodo = (id: number) => {
        const todoEdit = todoList.find((todo) => todo.id === id);
        if (!todoEdit) return;
        setTextEdit(todoEdit.title);
        setPriorityEdit(todoEdit.priority);
        setTodoList((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, isEdit: true } : { ...todo, isEdit: false },
            ),
        );
    };

    const handleCancle = () => {
        setTodoList((prev) => prev.map((todo) => ({ ...todo, isEdit: false })));
        setTextEdit("");
        setPriorityEdit("low");
    };

    const hanldeSave = (id: number) => {
        const text = textEdit.trim();
        if (!text) {
            message.error("title is not empty");
            return;
        }
        setTodoList((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, title: text, isEdit: false, priority: priorityEdit }
                    : todo,
            ),
        );
        setTextEdit("");
    };

    const handleComplete = (id: number) => {
        setTodoList((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo,
            ),
        );
    };

    const filteredTodoList = todoList
        .filter((todo) => {
            const matchTextSearch = todo.title
                .toLowerCase()
                .includes(textSearch.toLowerCase());

            const matchPriority =
                priorityFilter === "all" || todo.priority === priorityFilter;

            const matchesStatus =
                filterStatus === "all"
                    ? true
                    : filterStatus === "active"
                      ? !todo.completed
                      : todo.completed;

            return matchTextSearch && matchesStatus && matchPriority;
        })
        .sort((a, b) => {
            if (sortBy === "desc") return b.title.localeCompare(a.title);
            if (sortBy === "asc") return a.title.localeCompare(b.title);
            if (sortBy === "priority")
                return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
            return 0;
        });

    useEffect(() => {
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }, [todoList]);

    const completeCount = todoList.filter((item) => item.completed).length;
    const remainCount = todoList.length - completeCount;
    const progress = todoList.length ? Math.round((completeCount / todoList.length) * 100) : 0;

    const selectClass =
        "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 px-4 py-10 text-slate-800 sm:px-6">
            <div className="mx-auto w-full max-w-3xl">
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Công việc cần làm
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Quản lý nhiệm vụ của bạn một cách gọn gàng và nhanh chóng.
                    </p>
                </header>

                {/* Add form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddTodo();
                    }}
                    className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur"
                >
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            placeholder="Nhập công việc mới..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            type="text"
                            className={inputClass}
                        />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as TodoPriority)}
                            className={selectClass}
                        >
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="hight">hight</option>
                        </select>
                        <button
                            type="submit"
                            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-95"
                        >
                            Thêm
                        </button>
                    </div>
                </form>

                {/* Filters */}
                <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="relative">
                            <input
                                placeholder="Tìm kiếm công việc..."
                                value={textSearch}
                                onChange={(e) => setTextSearch(e.target.value)}
                                type="text"
                                className={inputClass}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as TodoFilter)}
                                className={selectClass}
                            >
                                <option value="all">Tất cả</option>
                                <option value="active">Đang làm</option>
                                <option value="completed">Đã xong</option>
                            </select>
                            <select
                                value={priorityFilter}
                                onChange={(e) =>
                                    setPriorityFilter(e.target.value as PriorityFilter)
                                }
                                className={selectClass}
                            >
                                <option value="all">Mọi ưu tiên</option>
                                <option value="low">low</option>
                                <option value="medium">medium</option>
                                <option value="hight">hight</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortBy)}
                                className={selectClass}
                            >
                                <option value="default">Mặc định</option>
                                <option value="desc">Z → A</option>
                                <option value="asc">A → Z</option>
                                <option value="priority">Ưu tiên</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* List */}
                <section className="mt-6">
                    {filteredTodoList.length > 0 ? (
                        <ul className="space-y-3">
                            {filteredTodoList.map((todo) => (
                                <li
                                    key={todo.id}
                                    className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md"
                                >
                                    {todo.isEdit ? (
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <input
                                                value={textEdit}
                                                onChange={(e) => setTextEdit(e.target.value)}
                                                type="text"
                                                className={inputClass}
                                            />
                                            <select
                                                value={priorityEdit}
                                                onChange={(e) =>
                                                    setPriorityEdit(e.target.value as TodoPriority)
                                                }
                                                className={selectClass}
                                            >
                                                <option value="low">low</option>
                                                <option value="medium">medium</option>
                                                <option value="hight">hight</option>
                                            </select>
                                            <div className="flex gap-2 sm:ml-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => hanldeSave(todo.id)}
                                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancle}
                                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <label className="flex min-w-0 flex-1 items-start gap-3">
                                                <input
                                                    onChange={() => handleComplete(todo.id)}
                                                    type="checkbox"
                                                    checked={todo.completed}
                                                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-slate-300 text-indigo-600 transition focus:ring-2 focus:ring-indigo-300"
                                                />
                                                <span className="min-w-0">
                                                    <span
                                                        className={`block break-words text-sm font-medium ${
                                                            todo.completed
                                                                ? "text-slate-400 line-through"
                                                                : "text-slate-800"
                                                        }`}
                                                    >
                                                        {todo.title}
                                                    </span>
                                                    <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset ${PRIORITY_STYLES[todo.priority]}`}
                                                        >
                                                            {todo.priority}
                                                        </span>
                                                        <span>
                                                            {new Date(todo.createdAt).toLocaleString("vi-VN")}
                                                        </span>
                                                    </span>
                                                </span>
                                            </label>
                                            <div className="flex gap-2 sm:ml-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditTodo(todo.id)}
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTodo(todo.id)}
                                                    className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-14 text-center">
                            <p className="text-4xl">📝</p>
                            <p className="mt-3 text-sm font-medium text-slate-500">
                                {todoList.length === 0
                                    ? "Chưa có công việc nào."
                                    : "Không tìm thấy công việc phù hợp..."}
                            </p>
                        </div>
                    )}
                </section>

                {/* Stats */}
                <section className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                            Tổng số
                        </p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{todoList.length}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 shadow-sm">
                        <p className="text-xs font-medium tracking-wide text-emerald-600 uppercase">
                            Đã hoàn thành
                        </p>
                        <p className="mt-1 text-2xl font-bold text-emerald-600">{completeCount}</p>
                    </div>
                    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 shadow-sm">
                        <p className="text-xs font-medium tracking-wide text-amber-600 uppercase">
                            Còn lại
                        </p>
                        <p className="mt-1 text-2xl font-bold text-amber-600">{remainCount}</p>
                    </div>
                </section>

                {/* Progress */}
                <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Tiến độ</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
