// Restore Gist data from SQL backup
// This script converts SQL backup to JSON and uploads to Gist

const https = require('https');

const GIST_ID = '5543e3d9f6259e02813fe78cc93e2126';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable not set');
  process.exit(1);
}

const titles = {
  'Politics': ['2024 미국 대선: 트럼프 vs 바이든','한국 대통령 지지율 40% 이상?','영국 EU 단일시장 재가입?','시진핑 2027년 이후 중국 주석 유지?','NATO 우크라이나 회원국 가입?','인도 2030년까지 중국 GDP 추월?','UN 팔레스타인 국가 승인?','2025년 브라질 대통령 탄핵?','북한 관광 국경 개방?','2025년 이란 정권 교체?','일본 중국 전쟁 가능성','러시아 푸틴 하야','프랑스 극우 정권','독일 총선 결과','이탈리아 EU 탈퇴'],
  'Sports': ['2024 파리 올림픽 금메달 1위 국가','메시 2025 MLS 우승','손흥민 EPL 득점왕','한국 2026 월드컵 16강','NBA 레이커스 우승','류현진 MLB 복귀','김민재 챔피언스리그 우승','이강인 골든볼 후보','박지성 감독 데뷔','양키스 월드시리즈 우승','맨시티 4연패 달성','리버풀 EPL 우승','PSG 챔스 우승','바르셀로나 라리가 우승','레알 마드리드 트레블'],
  'Technology': ['ChatGPT-5 2025년 출시','애플 비전프로 2 출시','테슬라 FSD 완전 자율주행','삼성 갤럭시 폴더블 폰','구글 AI 검색 독점','OpenAI IPO 상장','메타 메타버스 성공','아마존 AI 비서','MS 코파일럿 유료화','NVIDIA 시총 1위','애플 AI 폰 출시','삼성 AI 칩 개발','인텔 CPU 혁신','AMD GPU 1위','퀄컴 스냅드래곤 성능'],
  'Entertainment': ['오징어게임 시즌3 제작','BTS 완전체 컴백','블랙핑크 월드투어','기생충 속편 제작','어벤져스 신작 개봉','NCT 빌보드 1위','뉴진스 그래미 후보','IU 미국 투어','세븐틴 돔투어','에스파 월드투어','스트레이키즈 빌보드','아이브 일본 투어','르세라핌 미국 데뷔','지드래곤 컴백','태양 솔로 활동'],
  'Economy': ['비트코인 $100,000 돌파','금값 온스당 $3,000','S&P 500 지수 6,000','유가 배럴당 $120','달러 환율 1,400원','테슬라 주가 $500','NVIDIA 주가 $2,000','한국 기준금리 인하','미국 경기침체','중국 경제성장률 5%','일본 엔화 급락','유로존 금리 인하','삼성전자 시총 500조','현대차 판매 1위','SK하이닉스 점유율'],
  'Science': ['화성 유인 탐사 성공','AI 의식 출현','핵융합 발전 상용화','암 완치 치료법 개발','양자컴퓨터 실용화','불로장생 약물 개발','뇌-컴퓨터 인터페이스','인공 장기 이식','우주 엘리베이터','타임머신 이론 증명','노벨상 한국인 수상','DNA 편집 기술','줄기세포 치료','나노봇 의료','우주 정거장 완성'],
  'Climate': ['북극 빙하 완전 소멸','해수면 1m 상승','폭염 기록 경신','탄소중립 달성','재생에너지 50%','전기차 판매 1위','태양광 발전 혁신','수소경제 활성화','플라스틱 금지법','녹색 기후 기금','북극곰 멸종 위기','산호초 복원 성공','사막화 방지','열대우림 보호','오존층 회복'],
  'Culture': ['한류 세계 1위','K-POP 빌보드 석권','한식 미슐랭 스타','한복 세계화','한글날 공휴일','서울 세계 도시 1위','한국 관광객 1억명','제주도 세계유산','한국어 배우기 열풍','한국 영화 아카데미','한국 드라마 에미상','김치 세계화','한옥 호텔 인기','한국 전통 무용','판소리 유네스코']
};

const sampleIssues = [];
const categories = ['Politics', 'Sports', 'Technology', 'Entertainment', 'Economy', 'Science', 'Climate', 'Culture'];
const categoryIds = [1, 2, 3, 4, 5, 6, 7, 8];

for (let i = 1; i <= 150; i++) {
  const categoryIndex = (i - 1) % categories.length;
  const category = categories[categoryIndex];
  const categoryId = categoryIds[categoryIndex];
  const titleIndex = Math.floor((i - 1) / categories.length) % titles[category].length;
  const baseTitle = titles[category][titleIndex];
  
  sampleIssues.push({
    id: i,
    category: category,
    category_id: categoryId,
    category_slug: category.toLowerCase(),
    title_en: baseTitle,
    title_ko: baseTitle,
    title_zh: baseTitle,
    title_ja: baseTitle,
    description_en: `Prediction market for ${baseTitle}`,
    description_ko: `${baseTitle}에 대한 예측 시장`,
    description_zh: `${baseTitle}的预测市场`,
    description_ja: `${baseTitle}の予測市場`,
    end_date: new Date(Date.now() + (30 + i) * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
    total_volume: Math.floor(Math.random() * 1000000),
    participants: Math.floor(Math.random() * 9000) + 1000,
    resolution_criteria_en: 'Official results verification',
    resolution_criteria_ko: '공식 결과 확인',
    resolution_criteria_zh: '官方结果验证',
    resolution_criteria_ja: '公式結果確認',
    outcomes: [
      {
        id: i * 2 - 1,
        name_en: 'Yes',
        name_ko: '예',
        name_zh: '是',
        name_ja: 'はい',
        probability: 0.25 + Math.random() * 0.50,
        total_bets: Math.floor(Math.random() * 500000)
      },
      {
        id: i * 2,
        name_en: 'No',
        name_ko: '아니오',
        name_zh: '否',
        name_ja: 'いいえ',
        probability: 0.25 + Math.random() * 0.50,
        total_bets: Math.floor(Math.random() * 500000)
      }
    ]
  });
}

const gistData = {
  version: 1,
  updatedAt: new Date().toISOString(),
  items: sampleIssues
};

const body = JSON.stringify({
  files: {
    'eventbet-issues.json': {
      content: JSON.stringify(gistData, null, 2)
    }
  }
});

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: `/gists/${GIST_ID}`,
  method: 'PATCH',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent': 'cashiq-restore-script',
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

console.log(`🔄 Uploading ${sampleIssues.length} issues to Gist...`);

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log(`✅ Success! Uploaded ${sampleIssues.length} issues to Gist`);
      console.log(`📍 Gist URL: https://gist.github.com/${GIST_ID}`);
      console.log(`🔗 API URL: https://api.github.com/gists/${GIST_ID}`);
    } else {
      console.error(`❌ Error: Status ${res.statusCode}`);
      console.error(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.write(body);
req.end();
