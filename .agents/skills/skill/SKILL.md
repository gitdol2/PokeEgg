---
name: skill
description: Pokeegg Pokemon Gacha Web Game Project Overview Gen1 Prototype, Backend Architecture, Frontend Standards Vanilla Js
---

# skill

---
name: pokeegg-pokemon-gacha-web-game-project-overview-gen1-prototype
description: [Project Context: 사내 포켓몬 가챠 웹 게임 (Prototype Phase)]
- Scope: 1세대(관동지방, #1~#151) 포켓몬으로 한정하여 프로토타입 개발.
- Currency System:
  1. 실버 코인: 방치 시간 비례, 몇 시간마다 자동으로 충전 및 지급되는 기본 재화.
  2. 골드 코인: 일일 첫 접속, 도전과제 달성, 도감작 완료, 체육관 주간 1등 등 특별한 업적 달성 시 지급되는 프리미엄 재화.
- Core Loop: 
  1. 코인 사용: 실버/골드 코인을 사용하여 '알 뽑기기계' 작동.
  2. 알 획득 및 부화: 뽑기기계에서 배출된 알을 까서 포켓몬 획득 (노말~전설 등급 차등 확률, 극악의 확률로 이로치 등장). *단, 포켓몬 판정은 알을 배출/부화하는 시점의 백엔드 로직에 따름.
  3. 진화 및 판매: 중복 획득한 포켓몬은 카운트가 누적되며, 조건 충족 시 상위 포켓몬으로 '진화'. 불필요한 포켓몬은 '판매'하여 포인트로 교환.
  4. 포인트 활용: 판매로 얻은 포인트는 상점(특정 알 저격) 및 유저 간 경매장에서 사용.
- Key Systems: 
  - 코인 이원화, 알 뽑기기계 시스템, 중복 카운트 기반 진화, 포켓몬 판매 및 경매장 시스템.
  - 소셜/경쟁: 5대 체육관 시스템(가입 시 시스템 자동 배정, 체육관별 도감력 합산 주간 랭킹 경쟁), 파트너 포켓몬(채팅창 미니 도트 노출), 전설/이로치 획득 시 실시간 서버 전체 공지.
---
---
name: backend-architecture
description: [Backend & Database Guidelines]
- 반드시 한국어로 대답할 것.
- Stack: FastAPI (Python) 기반 비동기 서버, 비동기 ORM, MySQL, Redis (캐싱 및 웹소켓 브로커).
- Data Integration & Caching: 외부 오피셜 PokéAPI를 연동하되, Rate Limit 방지를 위해 포켓몬 마스터 데이터는 DB나 Redis에 캐싱하여 사용.
- Authoritative Server & Security: 코인 차감, 뽑기 판정(난수 처리), 진화 검증 등 모든 핵심 게임 데이터는 100% 백엔드에서 결정 후 클라이언트에 통보. 무차별 API 호출을 막기 위해 Rate Limiting(속도 제한) 필수 적용.
- Concurrency Control (CRITICAL): 재화 및 인벤토리가 변동되는 모든 API는 DB 트랜잭션 Lock(SELECT ... FOR UPDATE)을 적용하여 동시성 이슈(광클로 인한 재화 복사 등) 완벽 차단.
- WebSocket Management: 
  - 실시간 채팅, 체육관 데이터 동기화, 글로벌 공지 처리에 활용.
  - 방치형 특성 고려: Ping/Pong으로 연결 상태를 확인하고, 장기 미사용 탭은 연결 해제(Pause). 유저 복귀 시 자동 재연결 및 방치된 시간만큼의 실버 코인을 서버에서 일괄 정산.
---
---
name: frontend-standards-vanilla-js
description: [Frontend Development Guidelines]
- Framework Restriction: React, Vue 등 프레임워크 절대 금지. HTML5, CSS, Vanilla JavaScript만 사용하여 미니멀리즘 SPA(Single Page Application) 구축.
- State Management: 무거운 라이브러리 없이, Proxy 객체나 Observer 패턴을 활용하여 순수 JS 환경에서도 데이터(상태)와 UI가 효율적으로 동기화되도록 설계.
- Gacha UI & Interaction: 
  - 코인 투입 -> 기계 작동 -> 알 배출 -> 알 부화 및 포켓몬 등장 연출을 단계별 시각화.
  - CSS Animation/Transition과 RequestAnimationFrame을 위주로 가볍고 찰진 가챠 연출 구현.
- UI/UX Optimizations: 
  - 낙관적 업데이트(Optimistic Update): 진화, 판매, 파트너 지정 등 민감하지 않은 액션은 클릭 즉시 UI에 먼저 반영하고 백그라운드에서 서버와 동기화.
  - 탭 구성: 로그인(체육관 자동 배정), 뽑기기계(상점), 인벤토리(속성/등급 정렬, 진화/판매 버튼), 경매장, 랭킹, 아카이브 탭을 SPA 구조로 화면 새로고침 없이 매끄럽게 전환.
---