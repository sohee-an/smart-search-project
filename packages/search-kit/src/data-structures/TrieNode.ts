export class TrieNode {
  // 1. 자식 노드들을 저장하는 지도 (Key: 글자, Value: 다음 노드)
  // Object가 아니라 Map을 쓰는 이유:
  // - 'constructor', '__proto__' 같은 예약어 충돌 방지
  // - 한글, 이모지 등 특수 문자도 키로 완벽하게 처리하기 위해
  children: Map<string, TrieNode>;

  // 2. 단어의 끝인지 표시하는 깃발
  // "App"을 검색했는데 "Apple"이 나오면 안 되니까,
  // 'p' 노드에는 false, 'e' 노드에는 true를 줘서 구분함.
  isEndOfWord: boolean;

  // 3. (성능용) 완성된 단어 저장
  // 원래는 루트부터 글자를 합쳐와야 하지만,
  // 여기에 "Apple"이라고 통째로 적어두면 검색 속도가 훨씬 빨라짐 (메모리를 조금 더 쓰고 속도를 얻는 트레이드오프)
  value: string | null;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.value = null;
  }
}
