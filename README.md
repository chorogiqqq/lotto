# 🎰 로또 6/45 통계 기반 가중치 5게임 + 보너스 추천 웹 애플리케이션

동행복권 최신 당첨 번호 통계 API를 연동하여 최근 출현 빈도 기반의 **가중치 무작위 추첨(Weighted Random Sampling)** 알고리즘으로 5게임(A~E)과 보너스 번호를 자동 생성해주는 풀스택 웹 서비스입니다.

---

## ✨ 핵심 기능

1. **통계 기반 가중치 5게임 + 보너스 번호 추천**
   - 최근 당첨 회차 데이터를 분석하여 많이 나온 번호일수록 확률 가중치($Weight(n) = Count(n) + BaseWeight$) 부여.
   - 각 게임별 **메인 번호 6개(오름차순 정렬)** + **보너스 번호 1개** 자동 추출.

2. **고정 번호 & 제외 번호 설정**
   - **고정 번호**: 최대 5개까지 지정 (모든 게임에 우선 포함).
   - **제외 번호**: 최대 10개까지 지정 (추첨 대상에서 완전히 제거).

3. **동행복권 API 프록시 & 통계 시각화**
   - Express 백엔드가 동행복권 API 데이터를 캐싱 및 연동.
   - **HOT (최다 출현)** / **COLD (최소 출현)** 번호 분석, 1~45 히트맵 및 막대 차트 제공.

4. **공식 공 색상 규격 & 클립보드 복사**
   - 1-10(노랑), 11-20(파랑), 21-30(빨강), 31-40(회색), 41-45(초록) 3D 로또 공 디자인 적용.
   - 클릭 한 번으로 5게임 전체 번호 및 보너스 번호를 클립보드에 복사.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide-react (아이콘), Recharts (차트), Canvas-confetti
- **Backend**: Node.js, Express, Cors, Axios (동행복권 API 프록시 & Caching)

---

## 🚀 다른 컴퓨터 / 드라이브에서 실행하는 방법

### 1. Repository 클론 (또는 다운로드)
```bash
git clone https://github.com/사용자계정/리포지토리이름.git
cd 리포지토리이름
```

### 2. 백엔드(Server) 패키지 설치 및 실행
```bash
cd server
npm install
npm start
# Server running on http://localhost:5000
```

### 3. 프론트엔드(Client) 패키지 설치 및 실행
새 터미널 창을 열고 아래 명령어를 실행합니다:
```bash
cd client
npm install
npm run dev
# App running on http://localhost:5173
```

---

## 📄 라이선스
MIT License
