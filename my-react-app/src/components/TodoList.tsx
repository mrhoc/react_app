import { useEffect, useMemo, useState } from "react";
import type {
    PriorityFilter,
    SortBy,
    Todo,
    TodoFilter,
    TodoPriority,
} from "../types/todo";
import { PRIORITY_LABELS, PRIORITY_ORDER, PRIORITY_WEIGHT } from "../types/todo";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { ProgressBar, StatCard } from "./TodoStats";

const STORAGE_KEY = "todoList";

/** Đọc danh sách todo đã lưu, lỗi thì trả về mảng rỗng */
const loadTodos = (): Todo[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? (JSON.parse(saved) as Todo[]) : [];
    } catch (error) {
        console.error("Lỗi đọc localStorage:", error);
        return [];
    }
};

/** Tạo id tăng dần */
const getNextId = (list: Todo[]): number =>
    list.length === 0 ? 1 : Math.max(...list.map((item) => item.id)) + 1;

export function TodoList() {
    // ============ DATA ============
    const [todoList, setTodoList] = useState<Todo[]>(loadTodos);

    // Lưu xuống localStorage mỗi khi danh sách đổi
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
    }, [todoList]);

    // ============ BỘ LỌC ============
    const [textSearch, setTextSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<TodoFilter>("all");
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
    const [sortBy, setSortBy] = useState<SortBy>("default");

    // Danh sách sau khi lọc + sắp xếp (chỉ tính lại khi input đổi)
    const visibleTodos = useMemo(() => {
        const keyword = textSearch.trim().toLowerCase();

        return todoList
            .filter((todo) => {
                const matchText = todo.title.toLowerCase().includes(keyword);
                const matchPriority =
                    priorityFilter === "all" || todo.priority === priorityFilter;
                const matchStatus =
                    filterStatus === "all"
                        ? true
                        : filterStatus === "active"
                          ? !todo.completed
                          : todo.completed;

                return matchText && matchPriority && matchStatus;
            })
            .sort((a, b) => {
                if (sortBy === "desc") return b.title.localeCompare(a.title);
                if (sortBy === "asc") return a.title.localeCompare(b.title);
                if (sortBy === "priority")
                    return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
                return 0;
            });
    }, [todoList, textSearch, filterStatus, priorityFilter, sortBy]);

    // ============ THỐNG KÊ ============
    const completeCount = todoList.filter((item) => item.completed).length;
    const remainCount = todoList.length - completeCount;
    const progress = todoList.length
        ? Math.round((completeCount / todoList.length) * 100)
        : 0;

    // ============ HANDLERS ============
    const handleAdd = (title: string, priority: TodoPriority) => {
        setTodoList((prev) => [
            ...prev,
            {
                id: getNextId(prev),
                title: title.trim(),
                completed: false,
                priority,
                createdAt: new Date().toISOString(),
            },
        ]);
    };

    const handleRemove = (id: number) => {
        setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    };

    const handleToggle = (id: number) => {
        setTodoList((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo,
            ),
        );
    };

    const handleEdit = (id: number) => {
        setTodoList((prev) =>
            prev.map((todo) => ({ ...todo, isEdit: todo.id === id })),
        );
    };

    const handleCancel = () => {
        setTodoList((prev) => prev.map((todo) => ({ ...todo, isEdit: false })));
    };

    const handleSave = (
        id: number,
        title: string,
        priority: TodoPriority,
    ): boolean => {
        if (!title.trim()) return false;

        setTodoList((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, title: title.trim(), priority, isEdit: false }
                    : todo,
            ),
        );
        return true;
    };

    // ============ RENDER ============
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 px-4 py-10 text-slate-800 sm:px-6">
            <div className="mx-auto w-full max-w-3xl">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Công việc cần làm
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Quản lý nhiệm vụ của bạn một cách gọn gàng và nhanh chóng.
                    </p>
                </header>

                {/* Thêm công việc mới */}
                <TodoForm onAdd={handleAdd} />

                {/* Tìm kiếm + lọc + sắp xếp */}
                <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Tìm kiếm công việc..."
                            value={textSearch}
                            onChange={(e) => setTextSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value as TodoFilter)
                                }
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="all">Tất cả</option>
                                <option value="active">Đang làm</option>
                                <option value="completed">Đã xong</option>
                            </select>

                            <select
                                value={priorityFilter}
                                onChange={(e) =>
                                    setPriorityFilter(
                                        e.target.value as PriorityFilter,
                                    )
                                }
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="all">Mọi ưu tiên</option>
                                {PRIORITY_ORDER.map((item) => (
                                    <option key={item} value={item}>
                                        {PRIORITY_LABELS[item]}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortBy)}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="default">Mặc định</option>
                                <option value="desc">Z → A</option>
                                <option value="asc">A → Z</option>
                                <option value="priority">Ưu tiên</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Danh sách công việc */}
                <section className="mt-6">
                    {visibleTodos.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-14 text-center">
                            <p className="text-4xl">📝</p>
                            <p className="mt-3 text-sm font-medium text-slate-500">
                                {todoList.length > 0
                                    ? "Không tìm thấy công việc phù hợp..."
                                    : "Chưa có công việc nào."}
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {visibleTodos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={handleToggle}
                                    onEdit={handleEdit}
                                    onCancel={handleCancel}
                                    onSave={handleSave}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </ul>
                    )}
                </section>

                {/* Thống kê */}
                <section className="mt-6 grid gap-3 sm:grid-cols-3">
                    <StatCard label="Tổng số" value={todoList.length} />
                    <StatCard
                        label="Đã hoàn thành"
                        value={completeCount}
                        tone="success"
                    />
                    <StatCard label="Còn lại" value={remainCount} tone="warning" />
                </section>

                <ProgressBar percent={progress} />
            </div>
        </div>
    );
}
