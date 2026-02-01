import { describe, it, expect, beforeEach, vi } from "vitest";
import { SearchKit } from "../SearchKit";

describe("SearchKit (통합 테스트)", () => {
  let searchKit: SearchKit;

  beforeEach(() => {
    // 테스트마다 새로운 키트 생성 (캐시 용량 2개로 제한)
    searchKit = new SearchKit({ cacheCapacity: 2 });

    // 데이터 주입
    searchKit.init(["apple", "application", "banana", "band", "cat"]);
  });

  it("기본 검색이 Trie를 통해 정상적으로 동작해야 한다", () => {
    const results = searchKit.search("app");

    expect(results).toContain("apple");
    expect(results).toContain("application");
    expect(results).not.toContain("banana");
  });

  it("한 번 검색한 결과는 캐시(Cache)되어야 한다 (속도 최적화 검증)", () => {
    // 🕵️‍♀️ 중요: Trie 엔진에 '도청 장치(Spy)'를 설치합니다.
    // SearchKit 내부의 private trie에 접근하기 위해 (as any) 사용
    const trieSpy = vi.spyOn((searchKit as any).trie, "search");

    // 1. 첫 번째 검색 (Cache Miss)
    searchKit.search("app");
    // -> Trie가 일을 했어야 함 (호출 횟수 1)
    expect(trieSpy).toHaveBeenCalledTimes(1);

    // 2. 두 번째 검색 (Cache Hit 기대)
    searchKit.search("app");
    // -> Trie는 일을 안 하고 놀았어야 함 (호출 횟수가 여전히 1이어야 함)
    // -> 만약 호출 횟수가 2라면 캐시가 고장 난 것임!
    expect(trieSpy).toHaveBeenCalledTimes(1);
  });

  it("캐시 용량(Capacity)이 차면 가장 오래된 검색어가 삭제되어야 한다 (LRU 검증)", () => {
    const trieSpy = vi.spyOn((searchKit as any).trie, "search");

    // 용량이 2개인 상황

    // 1. "A" 검색 (캐시: [A])
    searchKit.search("app");

    // 2. "B" 검색 (캐시: [B, A])
    searchKit.search("ban");

    // 3. "C" 검색 (캐시: [C, B]) -> A("app")가 쫓겨남!
    searchKit.search("cat");

    // 여기까지 Trie는 3번 일했음
    expect(trieSpy).toHaveBeenCalledTimes(3);

    // 4. 다시 "A" 검색
    // 아까 쫓겨났으므로 다시 Trie가 일해야 함 (Cache Miss)
    searchKit.search("app");

    // -> 호출 횟수가 4가 되어야 정상
    expect(trieSpy).toHaveBeenCalledTimes(4);
  });

  it("대소문자를 구분하지 않고 캐시가 동작해야 한다", () => {
    const trieSpy = vi.spyOn((searchKit as any).trie, "search");

    // 1. 소문자로 검색
    searchKit.search("apple");

    // 2. 대문자로 검색 (사용자는 다르지만, 내부는 같게 취급해야 함)
    searchKit.search("APPLE");

    // -> Trie는 한 번만 일했어야 함 (두 번째는 캐시에서 가져옴)
    expect(trieSpy).toHaveBeenCalledTimes(1);
  });
});
