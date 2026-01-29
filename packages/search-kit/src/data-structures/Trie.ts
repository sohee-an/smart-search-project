import { TrieNode } from './TrieNode';
import { disassemble } from 'es-hangul'; // 한글 자소 분리 라이브러리

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * 1. 단어 저장 (Insert)
   * - 영어/한글 모두 처리 가능
   * - 대소문자 구분 없이 검색하기 위해 소문자로 변환 후 저장
   */
  insert(word: string): void {
    let currentNode = this.root;

    // 단계 1: 소문자로 변환 ("Apple" -> "apple")
    // 단계 2: 자소 분리 ("apple" -> "a,p,p,l,e" / "라면" -> "ㄹ,ㅏ,ㅁ,ㅕ,ㄴ")
    // disassemble은 영어/숫자는 건드리지 않고 한글만 쪼개줍니다.
    const charList = disassemble(word.toLowerCase());

    for (const char of charList) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }
      currentNode = currentNode.children.get(char)!;
    }

    // 단계 3: 단어 끝 표시
    currentNode.isEndOfWord = true;

    // ★ 중요: 저장은 '소문자'나 '쪼개진 자모'가 아니라 "사용자가 보는 원본(word)"을 저장합니다.
    // 예: 검색은 "apple"로 타고 들어왔지만, 결과물은 "Apple"을 줘야 하니까요.
    currentNode.value = word;
  }

  /**
   * 2. 검색 (Search)
   * - 입력된 접두사(Prefix)로 시작하는 모든 단어를 찾음
   */
  search(prefix: string): string[] {
    let currentNode = this.root;

    // 검색어(prefix)도 똑같이 소문자 변환 + 자소 분리 처리를 해야
    // 저장된 길(Path)을 따라갈 수 있습니다.
    const charList = disassemble(prefix.toLowerCase());

    for (const char of charList) {
      // 1. 길(자식 노드)이 없으면 바로 빈 배열 리턴 (검색 결과 없음)
      if (!currentNode.children.has(char)) {
        return [];
      }
      // 2. 있으면 계속 내려감
      currentNode = currentNode.children.get(char)!;
    }

    // 3. 도착한 노드 하위의 모든 단어를 싹 긁어옴
    return this._collectAllWords(currentNode);
  }

  /**
   * (내부 함수) DFS로 하위 노드를 탐색하여 저장된 단어 수집
   */
  private _collectAllWords(node: TrieNode): string[] {
    const results: string[] = [];

    // 현재 노드가 단어의 끝이라면, 보관해둔 원본 단어(value)를 가져옴
    if (node.isEndOfWord && node.value) {
      results.push(node.value);
    }

    // 자식 노드들을 순회하며 재귀 호출
    for (const child of node.children.values()) {
      results.push(...this._collectAllWords(child));
    }

    return results;
  }
}
