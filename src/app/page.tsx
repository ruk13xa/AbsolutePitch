import Link from "next/link";
import StreakBadge from "@/components/StreakBadge";

const GAMES = [
  {
    href: "/practice",
    title: "건반 연습",
    desc: "퀴즈 없이 도, 레, 미, 파, 솔, 라, 시(도)를 자유롭게 눌러 들어보는 연습 공간입니다.",
    emoji: "🎶",
  },
  {
    href: "/note",
    title: "음 맞추기",
    desc: "재생되는 하나의 음을 듣고 어떤 음(C, D, E...)인지 맞추는 기본 훈련입니다.",
    emoji: "🎹",
  },
  {
    href: "/interval",
    title: "인터벌 맞추기",
    desc: "연속으로 재생되는 두 음 사이의 간격(인터벌)을 맞추는 훈련입니다.",
    emoji: "↔️",
  },
  {
    href: "/chord",
    title: "코드 맞추기",
    desc: "동시에 울리는 화음을 듣고 코드의 종류를 구분하는 훈련입니다.",
    emoji: "🎼",
  },
  {
    href: "/compose",
    title: "작곡 도우미",
    desc: "키, 스케일, 코드 진행을 고르면 어울리는 멜로디를 만들어 들려줍니다.",
    emoji: "🪄",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          절대음감을 키워보세요
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          꾸준한 반복 훈련으로 음, 인터벌, 코드를 듣고 구분하는 능력을 기를 수 있습니다.
        </p>
      </div>

      <StreakBadge />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {GAMES.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-sm p-6 transition-transform hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/70"
          >
            <span className="text-3xl">{game.emoji}</span>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">{game.title}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{game.desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 backdrop-blur-sm p-6 text-sm text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400">
        <h3 className="mb-2 font-semibold text-zinc-800 dark:text-zinc-200">훈련 팁</h3>
        <ul className="list-inside list-disc space-y-1">
          <li>매일 짧게라도 꾸준히 연습하는 것이 가장 효과적입니다.</li>
          <li>쉬움 난이도로 자신감을 쌓은 뒤 어려움 난이도에 도전해보세요.</li>
          <li>
            <Link href="/stats" className="underline">
              통계 페이지
            </Link>
            에서 정확도와 연속 정답 기록을 확인할 수 있어요.
          </li>
          <li>
            <Link href="/badges" className="underline">
              배지 페이지
            </Link>
            에서 훈련하며 모을 수 있는 배지를 확인해보세요.
          </li>
        </ul>
      </div>
    </div>
  );
}
