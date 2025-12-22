#!/bin/bash
set -e

echo "🚀 Cloudflare Pages 수동 배포 스크립트"
echo "=========================================="

# 빌드
echo "📦 프로젝트 빌드 중..."
npm run build

# dist 확인
if [ ! -d "dist" ]; then
    echo "❌ dist 폴더가 없습니다!"
    exit 1
fi

echo "✅ 빌드 완료"
echo ""
echo "📋 배포 정보:"
echo "  프로젝트: predictchain"
echo "  브랜치: main"
echo "  폴더: dist/"
echo ""
echo "🔧 다음 명령으로 배포하세요:"
echo ""
echo "  export CLOUDFLARE_API_TOKEN='YOUR_TOKEN_HERE'"
echo "  npx wrangler pages deploy dist --project-name=predictchain --branch=main"
echo ""

