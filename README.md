# ⚡ Smart Search Kit

> **High-Performance Headless Search & Caching Library** > <br>
> 대규모 데이터셋을 위한 클라이언트 사이드 검색 최적화 및 캐싱 솔루션

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square) ![Jest](https://img.shields.io/badge/Jest-90%25_Coverage-green?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## 📖 Introduction

**Smart Search Kit**은 빈번한 네트워크 요청으로 인한 서버 부하와 사용자 경험 저하 문제를 해결하기 위해 설계된 **검색 최적화 라이브러리**입니다.

수천 건 이상의 데이터(예: 가상화폐 심볼, 국가 코드 등)를 매 입력마다 서버에 요청하는 대신, 효율적인 자료구조(**Trie**)를 통해 클라이언트에서 즉각적인 검색 결과를 제공하며, **LRU Cache**를 통해 중복 요청을 방지합니다.

### 🚀 Key Features

- **Zero Latency Autocomplete:** **Trie(Prefix Tree)** 자료구조를 사용하여 $O(L)$의 시간 복잡도로 즉각적인 검색 결과 제공.
- **Smart Caching:** **LRU(Least Recently Used)** 알고리즘을 구현하여 자주 찾는 검색어는 메모리에 유지하고, 오래된 데이터는 자동 삭제.
- **Network Optimization:** 서버 API 호출을 획기적으로 줄여(약 70% 감소 예상) 비용 절감 및 성능 향상.
- **Headless Design:** UI에 종속되지 않는 로직(Hook/Class)만 제공하여 어떤 디자인 시스템과도 결합 가능.

---

## 🛠️ Technical Deep Dive

이 프로젝트는 단순한 기능 구현을 넘어, **자료구조의 효율적인 활용**과 **메모리 관리**에 중점을 두었습니다.

### 1. Trie (Prefix Tree) for Autocomplete

일반적인 `Array.filter` 방식은 데이터가 늘어날수록 성능이 $O(N \times L)$로 저하됩니다. 이를 해결하기 위해 **Trie**를 직접 구현했습니다.

- **Why Trie?** 입력된 문자열의 길이($L$)만큼만 탐색하면 되므로, 데이터셋의 크기($N$)와 무관하게 일정한 성능($O(L)$)을 보장합니다.
- **Implementation:** 각 노드는 `Map`을 사용하여 자식 노드를 관리, 메모리 효율성을 높이고 다양한 문자(한글 등) 호환성을 확보했습니다.

### 2. LRU Cache (Least Recently Used)

브라우저의 메모리는 한정적이므로 무한정 캐싱할 수 없습니다. 이를 위해 **Doubly Linked List**와 **Hash Map**을 결합한 LRU 캐시를 구현했습니다.

- **Why LRU?** 가장 최근에 접근한 데이터를 `Head`로, 오래된 데이터를 `Tail`로 관리하여 캐시 용량 초과 시 $O(1)$의 속도로 오래된 데이터를 삭제합니다.
- **Performance:** 배열을 이용한 캐시 관리($O(N)$)보다 월등히 빠른 $O(1)$의 조회/삽입 속도를 가집니다.

---

## 📦 Installation & Usage

이 라이브러리는 모노레포 환경에서 개발되었으며, NPM 패키지로 설치하여 사용할 수 있습니다.

```bash
pnpm add smart-search-kit
```
