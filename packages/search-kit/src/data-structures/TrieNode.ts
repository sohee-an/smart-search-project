export class TrieNode {
  // 1. 자식 노드들 (내 다음 글자로 갈 수 있는 길)
  // 예: 'a' 노드의 자식은 'p', 'n', 'r' 등이 될 수 있음
  // Map을 쓰는 이유: 한글, 특수문자 등 모든 문자를 키(Key)로 쓰기 편해서
  children: Map<string, TrieNode>;

  // 2. 단어의 끝 표시 (깃발)
  // 이게 true면 여기까지가 진짜 단어라는 뜻
  // 예: 'apple'에서 'e' 노드는 true, 중간의 'p' 노드는 false
  isEndOfWord: boolean;

  // 3. (선택사항) 여기까지 왔을 때의 완성된 단어 저장
  // 나중에 검색 결과 뽑아낼 때 편하려고 넣어둠
  value: string | null;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.value = null;
  }
}
