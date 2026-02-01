import { Trie } from "./data-structures/Trie";
import { LRUCache } from "./data-structures/LRUCache";

interface SearchKitOptions {
  cacheCapacity?: number; // 캐시 용량 설정 (기본값: 50개)
}

export class SearchKit {
  private trie: Trie;
  private cache: LRUCache<string[]>; // 검색 결과(문자열 배열)를 저장

  constructor(options: SearchKitOptions = {}) {
    // 1. 엔진 장착 (Trie)
    this.trie = new Trie();

    // 2. 기억장치 장착 (LRU Cache)
    // 용량을 안 정해주면 기본 50개만 기억함
    const capacity = options.cacheCapacity || 50;
    this.cache = new LRUCache<string[]>(capacity);
  }

  /**
   * 데이터 초기화 (DB에서 가져온 리스트를 한 번에 넣기)
   */
  init(words: string[]): void {
    words.forEach((word) => this.trie.insert(word));
  }

  /**
   * 단어 하나 추가 (실시간 업데이트용)
   */
  insert(word: string): void {
    this.trie.insert(word);
  }

  /**
   * ★ 검색 (핵심 로직) ★
   * 1. 캐시 확인 -> 있으면 바로 리턴 (0초)
   * 2. 없으면 Trie 검색 -> 찾은 뒤 캐시에 저장 -> 리턴
   */
  search(query: string): string[] {
    // 0. 빈 검색어 예외 처리
    if (!query) return [];

    // 캐시 키는 소문자로 통일해서 저장 (대소문자 달라도 같은 검색어로 취급)
    // 예: "App" 검색하나 "app" 검색하나 결과는 같으니까요.
    const cacheKey = query.toLowerCase();

    // 1. [비서] 캐시에 있나요?
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log(`✨ [Cache Hit] "${query}"는 기억에서 바로 가져왔습니다!`);
      return cachedResult;
    }

    // 2. [창고지기] 없으면 Trie에서 찾기
    console.log(`🐢 [Cache Miss] "${query}"는 새로 찾습니다...`);
    const searchResult = this.trie.search(query);

    // 3. [비서] 다음을 위해 기억해두기 (Cache Put)
    this.cache.put(cacheKey, searchResult);

    return searchResult;
  }
}
