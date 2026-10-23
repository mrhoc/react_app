interface StatCardProps {
    label: string;
    value: number;
    tone?: "default" | "success" | "warning";
}

const TONE_CLASS = {
    default: "border-slate-200/80 bg-white text-slate-900",
    success: "border-emerald-200/80 bg-emerald-50/60 text-emerald-600",
    warning: "border-amber-200/80 bg-amber-50/60 text-amber-600",
} as const;

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
    return (
        <div className={`rounded-2xl border p-4 shadow-sm ${TONE_CLASS[tone]}`}>
            <p className="text-xs font-medium tracking-wide uppercase opacity-70">
                {label}
            </p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}

interface ProgressBarProps {
    /** Phần trăm đã hoàn thành (0 - 100) */
    percent: number;
}
    
export function ProgressBar(props: ProgressBarProps) {
    const { percent } = props;
    return (
        <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Tiến độ</span>
                <span>{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </section>
    );
}
