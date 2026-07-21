"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import StatsSummary from "@/components/StatsSummary";
import { GAME_LABELS, loadStats, type GameKey, type GameStats } from "@/lib/storage";
import { decodeSharedStats, encodeSharedStats } from "@/lib/share";

const GAMES: GameKey[] = ["note", "interval", "chord"];

function drawCard(canvas: HTMLCanvasElement, statsMap: Record<GameKey, GameStats>) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = 800;
  const height = 560;
  canvas.width = width;
  canvas.height = height;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#4338ca");
  gradient.addColorStop(0.5, "#9333ea");
  gradient.addColorStop(1, "#db2777");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.97)";
  const pad = 24;
  ctx.beginPath();
  const r = 24;
  const x = pad;
  const y = pad;
  const w = width - pad * 2;
  const h = height - pad * 2;
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#18181b";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("🎵 절대음감 트레이너", 56, 90);

  const totalAttempts = GAMES.reduce((s, g) => s + statsMap[g].attempts, 0);
  const totalCorrect = GAMES.reduce((s, g) => s + statsMap[g].correct, 0);
  const accuracy = totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100);

  ctx.fillStyle = "#4f46e5";
  ctx.font = "bold 64px sans-serif";
  ctx.fillText(`${accuracy}%`, 56, 175);
  ctx.fillStyle = "#71717a";
  ctx.font = "20px sans-serif";
  ctx.fillText(`전체 정확도 · ${totalCorrect} / ${totalAttempts} 문제 정답`, 56, 205);

  let rowY = 260;
  GAMES.forEach((game) => {
    const stats = statsMap[game];
    const gameAccuracy =
      stats.attempts === 0 ? 0 : Math.round((stats.correct / stats.attempts) * 100);

    ctx.fillStyle = "#18181b";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(GAME_LABELS[game], 56, rowY);

    ctx.fillStyle = "#52525b";
    ctx.font = "18px sans-serif";
    ctx.fillText(
      `정확도 ${gameAccuracy}% · 시도 ${stats.attempts} · 최고 연속 ${stats.bestStreak}`,
      56,
      rowY + 26,
    );

    ctx.fillStyle = "#e4e4e7";
    ctx.fillRect(56, rowY + 40, w - 112, 10);
    ctx.fillStyle = "#6366f1";
    ctx.fillRect(56, rowY + 40, ((w - 112) * gameAccuracy) / 100, 10);

    rowY += 80;
  });

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "16px sans-serif";
  ctx.fillText("absolutepitch.ruka.my", 56, height - 32);
}

function ShareContent() {
  const searchParams = useSearchParams();
  const sharedParam = searchParams.get("d");

  const [ownStats, setOwnStats] = useState<Record<GameKey, GameStats> | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sharedStats = sharedParam ? decodeSharedStats(sharedParam) : null;
  const displayStats = sharedStats ?? ownStats;

  useEffect(() => {
    if (sharedParam) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOwnStats({
      note: loadStats("note"),
      interval: loadStats("interval"),
      chord: loadStats("chord"),
    });
  }, [sharedParam]);

  useEffect(() => {
    if (canvasRef.current && displayStats) {
      drawCard(canvasRef.current, displayStats);
    }
  }, [displayStats]);

  if (!displayStats) {
    return sharedParam ? (
      <p className="text-sm text-red-500">공유 링크를 불러올 수 없습니다. 링크가 손상된 것 같아요.</p>
    ) : null;
  }

  const copyLink = async () => {
    if (!ownStats) return;
    const url = `${window.location.origin}/stats/share?d=${encodeSharedStats(ownStats)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사하세요:", url);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "absolutepitch-stats.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col gap-6">
      {sharedStats && (
        <div className="rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          다른 사람이 공유한 훈련 기록입니다.{" "}
          <Link href="/stats" className="underline">
            내 통계 보러 가기
          </Link>
        </div>
      )}

      <StatsSummary statsMap={displayStats} />

      <canvas ref={canvasRef} className="w-full rounded-2xl border border-zinc-200 shadow dark:border-zinc-800" />

      {!sharedStats && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyLink}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
          >
            {copied ? "복사됨!" : "공유 링크 복사"}
          </button>
          <button
            onClick={downloadImage}
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            이미지로 저장
          </button>
        </div>
      )}
    </div>
  );
}

export default function SharePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">통계 공유</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          내 훈련 기록을 링크나 이미지로 공유해보세요.
        </p>
      </div>
      <Suspense fallback={null}>
        <ShareContent />
      </Suspense>
    </div>
  );
}
