import { describe, it, expect, beforeEach } from "vitest";
import { Trie } from "../data-structures/Trie";

describe("Trie (검색 엔진 자료구조)", () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  // 1. 기본 기능 테스트
  it("기본적인 단어 삽입과 접두사 검색이 되어야 한다", () => {
    trie.insert("apple");
    trie.insert("app");
    trie.insert("application");
    trie.insert("banana");

    const results = trie.search("app");

    // 'app'으로 시작하는 3개가 다 나와야 함
    expect(results).toHaveLength(3);
    expect(results).toContain("apple");
    expect(results).toContain("app");
    expect(results).toContain("application");

    // 'banana'는 나오면 안 됨
    expect(results).not.toContain("banana");
  });

  // 2. 없는 단어 테스트
  it("없는 단어를 검색하면 빈 배열을 반환해야 한다", () => {
    trie.insert("cat");

    const results = trie.search("z"); // 'z'는 넣은 적 없음

    expect(results).toEqual([]);
  });

  // 3. 대소문자 테스트 (Case Insensitive)
  it("대소문자를 섞어서 검색해도 찾을 수 있어야 한다", () => {
    trie.insert("Apple"); // 대문자로 넣음

    // 소문자로 검색해도 찾아야 함
    const resultLower = trie.search("apple");
    expect(resultLower).toContain("Apple");

    // 대문자로 검색해도 찾아야 함
    const resultUpper = trie.search("APP");
    expect(resultUpper).toContain("Apple");
  });

  // 4. 한글 자소 분리 테스트 (핵심!)
  it("한글 초성(자음)만 입력해도 검색이 되어야 한다", () => {
    trie.insert("라면");
    trie.insert("라디오");
    trie.insert("호랑이");

    // 'ㄹ'만 쳐도 '라면', '라디오'가 나와야 함
    const results = trie.search("ㄹ");

    expect(results).toContain("라면");
    expect(results).toContain("라디오");
    expect(results).not.toContain("호랑이");
  });

  it("한글 자모가 섞여 있어도 검색이 되어야 한다", () => {
    trie.insert("고구마");

    // '곡' (ㄱ, ㅗ, ㄱ) -> '고구마'(ㄱ, ㅗ, ㄱ, ...) 와 매칭되는지
    // 주의: 이건 구현 방식(단순 자소분리 vs 퍼지)에 따라 다를 수 있지만,
    // 현재 우리는 Prefix 일치 방식이므로 '고'('ㄱ','ㅗ')까지만 쳐야 나옴.
    // 'ㄱ' 검색
    expect(trie.search("ㄱ")).toContain("고구마");
    // '고' 검색
    expect(trie.search("고")).toContain("고구마");
  });
});
