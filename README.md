# PokeZone - 포켓몬 도감

PokeAPI를 활용한 React + TypeScript + Tailwind CSS 포켓몬 도감 애플리케이션입니다.

## 기능

- 📱 반응형 디자인
- 🔍 포켓몬 검색 (이름 또는 번호)
- 📋 포켓몬 목록 (무한 스크롤)
- 📖 상세 정보 모달
- 🎨 타입별 색상 구분
- 🌟 색이 다른 포켓몬 이미지
- 📊 능력치 시각화
- 🇰🇷 한국어 번역 지원

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **PokeAPI** - 포켓몬 데이터 제공

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

### 3. 빌드
```bash
npm run build
```

## 프로젝트 구조

```
src/
├── components/         # React 컴포넌트
│   ├── PokemonDex.tsx     # 메인 컴포넌트
│   ├── PokemonCard.tsx    # 포켓몬 카드
│   ├── PokemonDetail.tsx  # 상세 정보 모달
│   ├── PokemonGrid.tsx    # 포켓몬 그리드
│   ├── SearchBar.tsx      # 검색 바
│   ├── Header.tsx         # 헤더
│   ├── LoadingSpinner.tsx # 로딩 스피너
│   └── ErrorMessage.tsx   # 에러 메시지
├── hooks/              # 커스텀 훅
│   └── usePokemon.ts      # 포켓몬 데이터 관련 훅
├── services/           # API 서비스
│   └── pokemonService.ts  # PokeAPI 서비스
├── types/              # TypeScript 타입 정의
│   └── pokemon.ts         # 포켓몬 관련 타입
├── App.tsx             # 루트 컴포넌트
├── index.tsx           # 앱 진입점
└── index.css           # 전역 스타일
```

## API

이 프로젝트는 [PokeAPI](https://pokeapi.co/)를 사용합니다.

## 주요 기능 설명

### 검색 기능
- 포켓몬 이름(영문) 또는 번호로 검색 가능
- 실시간 검색 결과 표시
- 검색 결과 클릭으로 상세 정보 확인

### 포켓몬 카드
- 공식 아트워크 이미지 표시
- 포켓몬 번호, 이름, 타입 정보 표시
- 호버 효과와 부드러운 애니메이션

### 상세 정보 모달
- 고해상도 이미지 (기본 + 색이 다른 포켓몬)
- 기본 정보 (키, 몸무게, 경험치)
- 타입 및 특성 정보
- 포켓몬 설명 (한국어)
- 능력치 시각화

### 무한 스크롤
- 스크롤 하단 도달 시 자동으로 추가 포켓몬 로딩
- "더 보기" 버튼으로 수동 로딩도 가능

## 라이선스

MIT License

## 기여

이슈 신고나 풀 리퀘스트를 환영합니다!
