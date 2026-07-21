# 절대음감 트레이너 (AbsolutePitch)

Next.js + TypeScript + Tailwind CSS로 만든 절대음감 훈련 웹앱입니다. Web Audio API로 음을 재생하고,
사용자가 정답을 맞히는 방식으로 청음 실력을 훈련합니다.

## 기능

- **음 맞추기** (`/note`) — 재생되는 하나의 음을 듣고 음이름을 맞히는 훈련
- **인터벌 맞추기** (`/interval`) — 연속으로 재생되는 두 음 사이의 간격을 맞히는 훈련
- **코드 맞추기** (`/chord`) — 동시에 울리는 화음을 듣고 코드 종류를 맞히는 훈련
- **통계** (`/stats`) — 게임별 시도/정답/정확도/연속 정답 기록 (브라우저 localStorage에 저장)

각 훈련은 쉬움/어려움 난이도를 지원합니다.

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 기술 스택

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Web Audio API (오실레이터 기반 톤 생성)
- localStorage 기반 진행도 저장
