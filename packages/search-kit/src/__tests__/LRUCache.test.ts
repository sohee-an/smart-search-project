import { DoublyLinkedListNode } from "../data-structures/DoublyLinkedListNode";

export class LRUCache<T> {
  private capacity: number; // 최대 저장 개수
  private map: Map<string, DoublyLinkedListNode<T>>; // O(1) 찾기용 지도

  // 리스트의 맨 앞과 맨 뒤를 지키는 '가짜 노드(Dummy Node)'
  // 얘네가 있으면 "if (node == null)" 같은 복잡한 예외 처리가 싹 사라집니다.
  private head: DoublyLinkedListNode<T>;
  private tail: DoublyLinkedListNode<T>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();

    // 1. 가짜 노드 생성 (Head와 Tail)
    // 실제 데이터는 이 두 녀석 사이(Head ... 데이터 ... Tail)에 들어갑니다.
    // 타입 에러 방지를 위해 any나 null 처리를 살짝 해줍니다.
    this.head = new DoublyLinkedListNode("HEAD", null as any);
    this.tail = new DoublyLinkedListNode("TAIL", null as any);

    // 2. 초기 상태: Head <-> Tail 서로 손잡게 함
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 데이터 가져오기 (Get)
   * - 있으면 가져오고, "방금 썼으니까 맨 앞으로" 이동시킴
   */
  get(key: string): T | null {
    if (!this.map.has(key)) return null;

    // ★ Map을 쓰니까 순회 없이 바로 노드를 낚아챕니다 (O(1))
    const node = this.map.get(key)!;

    // "방금 썼으니 1등석(Head 뒤)으로 보내주마"
    this._moveToFront(node);

    return node.value;
  }

  /**
   * 데이터 저장하기 (Put)
   * - 없으면 새로 넣고, 꽉 찼으면 꼴찌 삭제
   */
  put(key: string, value: T): void {
    // 1. 이미 있는 키라면? -> 값만 업데이트하고 맨 앞으로
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.value = value;
      this._moveToFront(node);
      return;
    }

    // 2. 꽉 찼다면? -> 꼴찌(LRU) 삭제
    if (this.map.size >= this.capacity) {
      this._removeLRUItem();
    }

    // 3. 새 노드 생성 및 등록
    const newNode = new DoublyLinkedListNode(key, value);
    this.map.set(key, newNode); // 주소록(Map)에 등록
    this._addToFront(newNode); // 리스트 맨 앞에 등록
  }

  // ====================================================
  //  👇 여기서부터가 진짜 링크드 리스트 조작 로직 (Private)
  // ====================================================

  /**
   * 노드를 맨 앞으로 이동 (기존 위치에서 빼서 -> Head 뒤로)
   */
  private _moveToFront(node: DoublyLinkedListNode<T>): void {
    this._removeNode(node); // 있던 자리에서 쏙 빼고
    this._addToFront(node); // 맨 앞에 다시 끼움
  }

  /**
   * [중요] 중간에 있는 노드를 쏙 빼는 함수 O(1)
   * - 앞사람(prev)과 뒷사람(next)을 서로 연결해버림
   */
  private _removeNode(node: DoublyLinkedListNode<T>): void {
    const prevNode = node.prev!;
    const nextNode = node.next!;

    // "나(node)는 빠질 테니까, 너네 둘이 손잡아"
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  /**
   * [중요] 노드를 맨 앞(Head 바로 뒤)에 끼워 넣는 함수 O(1)
   */
  private _addToFront(node: DoublyLinkedListNode<T>): void {
    const firstNode = this.head.next!; // 원래 1등이었던 애

    // 1. 내(New) 양손에 Head와 원래1등을 잡음
    node.prev = this.head;
    node.next = firstNode;

    // 2. Head와 원래1등도 나를 잡게 함
    this.head.next = node;
    firstNode.prev = node;
  }

  /**
   * 가장 오래된(Tail 바로 앞) 녀석을 삭제
   */
  private _removeLRUItem(): void {
    // Tail 바로 앞에 있는 애가 제일 오래된 애임
    const lruNode = this.tail.prev!;

    // 데이터가 하나도 없으면(Head랑 Tail이 붙어있으면) 리턴
    if (lruNode === this.head) return;

    // 1. 리스트에서 연결 끊기
    this._removeNode(lruNode);
    // 2. 맵(주소록)에서도 이름 지우기
    this.map.delete(lruNode.key);
  }
}
