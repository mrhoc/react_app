export type TodoPriority = "low" | "medium" | "hight";

export type PriorityFilter = TodoPriority | "all";

export type TodoFilter = "all" | "active" | "completed";

export type SortBy = "default" | "asc" | "desc" | "priority";

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    isEdit?: boolean;
    priority: TodoPriority;
    createdAt: string;
}

/** Thứ tự hiển thị trong dropdown ưu tiên */
export const PRIORITY_ORDER: TodoPriority[] = ["low", "medium", "hight"];

/** Nhãn tiếng Việt hiển thị ra UI */
export const PRIORITY_LABELS: Record<TodoPriority, string> = {
    low: "Thấp",
    medium: "Trung bình",
    hight: "Cao",
};

/** Điểm số để sort theo ưu tiên (cao nhất đứng đầu) */
export const PRIORITY_WEIGHT: Record<TodoPriority, number> = {
    low: 1,
    medium: 2,
    hight: 3,
};
