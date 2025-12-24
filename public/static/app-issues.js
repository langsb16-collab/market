// Load admin issues from API and display on main page
window.loadAdminIssues = async function loadAdminIssues() {
    try {
        const response = await fetch('/api/issues')
        const data = await response.json()
        
        if (!data.success || !data.issues || data.issues.length === 0) {
            console.log('No admin issues found')
            return []
        }
        
        console.log(`Loaded ${data.issues.length} admin issues from API`)
        
        // Convert to events format
        const adminEvents = data.issues.map(issue => {
            const totalUsdt = issue.initial_usdt || 60
            const yesBet = issue.yes_bet || 0
            const noBet = issue.no_bet || 0
            const totalBet = yesBet + noBet
            const probYes = totalBet > 0 ? yesBet / totalBet : 0.5
            const volume = totalUsdt * 10000
            const participants = Math.floor(volume / 1000) + Math.floor(Math.random() * 100)
            
            return {
                id: issue.id,
                category_id: 1,
                category_slug: issue.category,
                categoryKey: issue.category, // 카테고리 정규화용
                title_ko: issue.title_ko,
                title_en: issue.title_en,
                title_zh: issue.title_zh,
                title_ja: issue.title_ja,
                description_ko: issue.title_ko,
                description_en: issue.title_en,
                description_zh: issue.title_zh,
                description_ja: issue.title_ja,
                resolve_date: issue.expire_date,
                total_volume: volume,
                participants: participants,
                // ✅ 베팅액 필드 추가 (calcYesNoPercent가 읽을 수 있도록)
                yesBet: yesBet,
                noBet: noBet,
                yes_bet: yesBet,
                no_bet: noBet,
                outcomes: [
                    { id: issue.id * 2 - 1, name: '예', probability: probYes },
                    { id: issue.id * 2, name: '아니오', probability: 1 - probYes }
                ],
                isAdminIssue: true
            }
        })
        
        return adminEvents
    } catch (error) {
        console.error('Error loading admin issues:', error)
        return []
    }
}

// Auto-load issues when DOM is ready
if (typeof events !== 'undefined' && Array.isArray(events)) {
    loadAdminIssues().then(adminEvents => {
        events.unshift(...adminEvents)
        console.log(`Total events: ${events.length}`)
        if (typeof renderCategories === 'function') {
            renderCategories()
        }
        if (typeof renderMarkets === 'function') {
            renderMarkets()
        }
    })
}
