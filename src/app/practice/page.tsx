import PianoKeyboard from "@/components/PianoKeyboard";

export default function PracticePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">건반 연습</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          도, 레, 미, 파, 솔, 라, 시(그리고 반음)를 자유롭게 눌러 소리를 들어보세요. 퀴즈가
          아니라 귀에 익히기 위한 연습 공간입니다.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-8 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70">
        <PianoKeyboard />
      </div>
    </div>
  );
}
