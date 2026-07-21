export type AnswerState = "idle" | "correct" | "wrong" | "reveal";

export default function AnswerButton({
  label,
  state,
  disabled,
  onClick,
}: {
  label: string;
  state: AnswerState;
  disabled?: boolean;
  onClick: () => void;
}) {
  const stateClasses: Record<AnswerState, string> = {
    idle: "border-zinc-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800",
    correct: "border-emerald-500 bg-emerald-500 text-white",
    wrong: "border-red-500 bg-red-500 text-white",
    reveal: "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold text-zinc-800 transition-colors disabled:cursor-not-allowed dark:text-zinc-100 ${stateClasses[state]}`}
    >
      {label}
    </button>
  );
}
