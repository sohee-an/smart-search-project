export class DoublyLinkedListNode<T> {
  // 1. 데이터 저장소
  key: string; // 검색어 (예: "apple") -> 나중에 맵에서 삭제할 때 필요!
  value: T; // 검색 결과 (예: ["apple", "application"...])

  // 2. 연결 고리 (앞사람, 뒷사람 손잡기)
  prev: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;

  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}
