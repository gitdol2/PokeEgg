---
name: frontend-standards-vanilla-js
description: [Frontend Development Guidelines]
- Framework Restriction: React, Vue 등 무거운 프레임워크 절대 금지. 오직 순수 HTML5, CSS, Vanilla JavaScript만 사용하여 미니멀리즘 SPA(Single Page Application) 구축.
- Gacha UI & Interaction: 
  - 코인을 투입하여 '알 뽑기기계'가 작동하고 알이 배출되는 과정, 배출된 알이 깨지며 포켓몬이 등장하는 연출을 단계별로 시각화.
  - 무거운 라이브러리 대신 CSS Animation/Transition 위주로 찰진 가챠 연출 구현.
- UI/UX Optimizations: 
  - 상태 관리: 진화 선택, 포켓몬 판매, 파트너 지정, 인벤토리 정렬/잠금 등 민감하지 않은 액션은 낙관적 업데이트(Optimistic Update)를 적용하여 클릭 즉시 UI에 반영.
  - 탭 구성: 로그인/가입(체육관 자동 배정), 뽑기기계(상점), 인벤토리(속성/지역/등급별 정렬, 진화/판매/잠금 버튼), 경매장, 리더보드, 아카이브 탭을 SPA 구조로 매끄럽게 전환.
---

# Frontend Standards Vanilla Js

## Instructions

Add your skill instructions here.
