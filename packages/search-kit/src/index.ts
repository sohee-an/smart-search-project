import { SearchKit } from "./SearchKit";

console.log("🚀 [SearchKit] 시스템 가동 시작...\n");

// 1. 키트 생성 (캐시는 3개만 기억하도록 설정 - 테스트용)
const searchKit = new SearchKit({ cacheCapacity: 3 });

// 2. 데이터 주입 (DB에서 가져왔다고 가정)
const dbData = [
  "Apple",
  "Application",
  "App Store",
  "Amazon",
  "Banana",
  "Band",
  "Cream",
  "Cake",
  "라면",
  "라디오",
  "라이터",
];
searchKit.init(dbData);
console.log("📦 데이터 로딩 완료!\n");

// --- 시나리오 시작 ---

// 1. 첫 번째 검색: "app" (처음이니 Trie에서 찾음)
console.log('🔍 1. "app" 검색 요청');
const result1 = searchKit.search("app");
console.log("👉 결과:", result1);
console.log("-----------------------------------");

// 2. 두 번째 검색: "app" (★ 중요: 캐시에서 나와야 함!)
console.log('🔍 2. "app" 재검색 요청 (똑같은 거 또 물어봄)');
const result2 = searchKit.search("app");
console.log("👉 결과:", result2);
console.log("-----------------------------------");

// 3. 한글 검색: "ㄹ"
console.log('🔍 3. "ㄹ" 검색 요청');
const result3 = searchKit.search("ㄹ");
console.log("👉 결과:", result3);
console.log("-----------------------------------");

// 4. 캐시 밀어내기 테스트 (다른 거 2개 더 검색해서 "app"을 밀어냄)
searchKit.search("ban"); // 캐시: [ban, ㄹ, app]
searchKit.search("cre"); // 캐시: [cre, ban, ㄹ] -> app 쫓겨남!

console.log('\n🗑️ (다른 검색어들 때문에 "app"이 캐시에서 밀려났을 것임)\n');

// 5. 다시 "app" 검색 (쫓겨났으니 다시 Trie에서 찾아야 함)
console.log('🔍 5. "app" 다시 검색');
searchKit.search("app");
