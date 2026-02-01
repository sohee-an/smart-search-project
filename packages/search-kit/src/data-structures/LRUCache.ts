import { DoublyLinkedListNode } from "./DoublyLinkedListNode";
import { DoublyLinkedList } from "./DoublyLinkedList";

export class LRUCache<T> {
  private capacity: number;
  private map: Map<string, DoublyLinkedListNode<T>>;
  private list: DoublyLinkedList<T>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
    this.list = new DoublyLinkedList();
  }

  get(key: string): T | null {
    if (!this.map.has(key)) return null;

    const node = this.map.get(key)!;
    // 순서 갱신 (맨 앞으로)
    this.list.remove(node);
    this.list.addHead(node);

    return node.value;
  }

  put(key: string, value: T): void {
    // 1. 이미 있는 경우 업데이트
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.value = value;

      // 순서 갱신 (맨 앞으로)
      this.list.remove(node);
      this.list.addHead(node);
      return;
    }

    // 2. 용량이 꽉 찬 경우
    if (this.map.size >= this.capacity) {
      //꼴지 없애기
      const removedNode = this.list.removeTail();

      // 맵에서도 삭제 (removedNode가 null일 리 없지만 안전하게 확인)
      if (removedNode) {
        this.map.delete(removedNode.key);
      }
    }

    // 3. 새 노드 생성
    const newNode = new DoublyLinkedListNode(key, value);

    this.list.addHead(newNode); // 리스트에 추가
    this.map.set(key, newNode); // 맵에 추가
  }
}
