import { Trie } from './data-structures/Trie';

console.log('🚀 검색 엔진 시동 거는 중...');

// 1. 검색기 생성
const myTrie = new Trie();

// 2. 가상의 DB 데이터 (이걸 트라이에 집어넣을 겁니다)
const dbData = [
  'apple',
  'application',
  'app',
  'api',
  'banana',
  'ball',
  'cat',
  'camera',
];

// 3. 데이터 정리하기 (Insert)
console.log('📦 데이터 정리(Insert) 시작...');
dbData.forEach((word) => {
  myTrie.insert(word);
});
console.log('✅ 정리 완료! (메모리에 Trie 구조 생성됨)');

// 4. 검색 테스트 (Search)
console.log("\n🔍 검색 테스트: 'app' 입력");
const result1 = myTrie.search('app');
console.log('👉 결과:', result1);
// 기대 결과: ['app', 'apple', 'application', 'api'] (순서는 다를 수 있음)

console.log("\n🔍 검색 테스트: 'c' 입력");
const result2 = myTrie.search('c');
console.log('👉 결과:', result2);
// 기대 결과: ['cat', 'camera']

console.log("\n🔍 검색 테스트: 'z' 입력 (없는 단어)");
const result3 = myTrie.search('z');
console.log('👉 결과:', result3);
// 기대 결과: []
