import { useState } from "react";
import type { TodoPriority } from "../types/todo";
import { PRIORITY_LABELS, PRIORITY_ORDER } from "../types/todo";

interface TodoFormProps {
    /** Gọi khi người dùng bấm nút "Thêm" */
    onAdd: (title: string, priority: TodoPriority) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<TodoPriority>("low");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd(title, priority);
        setTitle("");
        setPriority("low");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur"
        >
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    placeholder="Nhập công việc mới..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TodoPriority)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                    {PRIORITY_ORDER.map((item) => (
                        <option key={item} value={item}>
                            {PRIORITY_LABELS[item]}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                >
                    Thêm
                </button>
            </div>
        </form>
    );
}
