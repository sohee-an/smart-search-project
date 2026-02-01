import { DoublyLinkedListNode } from "./DoublyLinkedListNode";

export class DoublyLinkedList<T> {
  private head: DoublyLinkedListNode<T>;
  private tail: DoublyLinkedListNode<T>;

  constructor() {
    // 1. 가짜 노드(Dummy Node) 초기화
    // 데이터가 없어도 head와 tail은 항상 존재하게 해서 예외 처리를 없앱니다.
    this.head = new DoublyLinkedListNode("HEAD", null as any);
    this.tail = new DoublyLinkedListNode("TAIL", null as any);

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 노드를 맨 앞(Head 바로 뒤)에 추가
   * 시간복잡도: O(1)
   */
  addHead(node: DoublyLinkedListNode<T>): void {
    const firstNode = this.head.next!; // 원래 1등

    // 새 노드 연결
    node.prev = this.head;
    node.next = firstNode;

    // Head와 원래 1등이 새 노드를 가리키게 함
    this.head.next = node;
    firstNode.prev = node;
  }

  /**
   * 특정 노드를 리스트에서 삭제 (중간 삭제 포함)
   * 시간복잡도: O(1)
   */
  remove(node: DoublyLinkedListNode<T>): void {
    const prevNode = node.prev!;
    const nextNode = node.next!;

    // 앞사람과 뒷사람을 바로 연결 (나를 건너뜀)
    prevNode.next = nextNode;
    nextNode.prev = prevNode;

    // (선택) 안전을 위해 삭제된 노드의 연결고리 초기화
    node.prev = null;
    node.next = null;
  }

  /**
   * 가장 오래된 노드(Tail 바로 앞)를 삭제하고 반환
   * (LRU Cache에서 용량 찼을 때 사용)
   */
  removeTail(): DoublyLinkedListNode<T> | null {
    const lruNode = this.tail.prev!;

    // 리스트가 비어있으면(Head랑 Tail이 붙어있으면) null 반환
    if (lruNode === this.head) {
      return null;
    }

    this.remove(lruNode);
    return lruNode;
  }
}
