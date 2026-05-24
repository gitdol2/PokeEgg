---
name: backend-architecture
description: [Backend & Database Guidelines]
- 반드시 한국어로 대답할 것.
- Stack: FastAPI (Python) 기반 비동기 서버, 비동기 ORM, MySQL.
- Data Integration: 포켓몬 마스터 데이터 관리를 위해 외부 오피셜 PokéAPI를 반드시 연동 및 활용할 것.
- Authoritative Server: 코인 차감, 뽑기기계의 등급/이로치 판정, 알 배출, 진화 조건 검증, 판매 대금 정산 등 모든 게임 데이터와 난수 처리는 100% 백엔드에서 결정 후 클라이언트에 결과만 통보 (어뷰징 원천 차단).
- Concurrency Control (중요): 뽑기기계 가동, 진화, 판매, 경매장 거래 등 재화와 인벤토리 데이터가 변동되는 모든 API는 DB 트랜잭션 Lock(SELECT ... FOR UPDATE)을 적용하여 동시성 이슈(광클로 인한 재화 복사 등)를 완벽히 해결.
- WebSocket Management: 
  - 실시간 채팅, 체육관별 데이터 동기화, 고등급 획득 글로벌 공지 처리에 WebSocket 활용.
  - 방치형 특성 고려: 주기적인 Ping/Pong으로 연결 상태를 확인하고, 장기 미사용 탭은 연결을 해제(Pause). 유저 복귀 시 자동 재연결 및 방치된 시간만큼의 실버 코인을 서버에서 계산하여 일괄 정산.
---

# Backend Architecture

## Instructions

Add your skill instructions here.
