
# 배포 방법 (Cloudflare API 키 설정 후):
npm run build
npx wrangler pages deploy dist --project-name=predictchain --branch=main

# 또는 package.json에 추가:
"deploy:prod": "npm run build && wrangler pages deploy dist --project-name=predictchain --branch=main"

