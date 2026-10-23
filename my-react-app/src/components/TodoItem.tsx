import { useEffect, useState } from "react";
import { message } from "antd";
import type { Todo, TodoPriority } from "../types/todo";
import { PRIORITY_LABELS, PRIORITY_ORDER } from "../types/todo";

interface TodoItemProps {
    todo: Todo;
    /** Bật/tắt trạng thái hoàn thành */
    onToggle: (id: number) => void;
    /** Bắt đầu sửa item này */
    onEdit: (id: number) => void;
    /** Hủy sửa */
    onCancel: () => void;
    /** Lưu sửa, trả về false nếu tiêu đề rỗng */
    onSave: (id: number, title: string, priority: TodoPriority) => boolean;
    /** Xóa item */
    onRemove: (id: number) => void;
}

export function TodoItem({
    todo,
    onToggle,
    onEdit,
    onCancel,
    onSave,
    onRemove,
}: TodoItemProps) {
    // Bản nháp chỉ tồn tại khi đang sửa
    const [draftTitle, setDraftTitle] = useState(todo.title);
    const [draftPriority, setDraftPriority] = useState<TodoPriority>(todo.priority);

    // Khi thoát chế độ sửa, đồng bộ lại bản nháp về giá trị gốc
    useEffect(() => {
        if (!todo.isEdit) {
            setDraftTitle(todo.title);
            setDraftPriority(todo.priority);
        }
    }, [todo.isEdit, todo.title, todo.priority]);

    const handleSave = () => {
        if (!onSave(todo.id, draftTitle, draftPriority)) {
            message.error("Tiêu đề không được để trống");
        }
    };

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

    const selectClass =
        "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

    if (todo.isEdit) {
        return (
            <li className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        className={inputClass}
                    />

                    <select
                        value={draftPriority}
                        onChange={(e) =>
                            setDraftPriority(e.target.value as TodoPriority)
                        }
                        className={selectClass}
                    >
                        {PRIORITY_ORDER.map((item) => (
                            <option key={item} value={item}>
                                {PRIORITY_LABELS[item]}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2 sm:ml-auto">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
                        >
                            Lưu
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <li className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex min-w-0 flex-1 items-start gap-3">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggle(todo.id)}
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
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-500">
                                {PRIORITY_LABELS[todo.priority]}
                            </span>
                            <span>{new Date(todo.createdAt).toLocaleString("vi-VN")}</span>
                        </span>
                    </span>
                </label>

                <div className="flex gap-2 sm:ml-auto">
                    <button
                        type="button"
                        onClick={() => onEdit(todo.id)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                    >
                        Sửa
                    </button>
                    <button
                        type="button"
                        onClick={() => onRemove(todo.id)}
                        className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </li>
    );
}
