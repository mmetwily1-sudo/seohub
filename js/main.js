// ============================================
// SEOHUB - Main JavaScript
// ============================================

// Tools Data
const tools = [
    // Online Tools (clickable)
    { name: "SEO Score Calculator", desc: "Get a comprehensive SEO score for any website", icon: "📊", category: "online", tag: "Online", link: "tools/seo-score-calculator.html" },
    { name: "Schema Generator", desc: "Generate JSON-LD structured data for rich results", icon: "🔧", category: "online", tag: "Online", link: "tools/schema-generator.html" },
    { name: "Meta Tag Analyzer", desc: "Analyze title, description, OG tags for any URL", icon: "🏷️", category: "online", tag: "Online", link: "tools/meta-tag-analyzer.html" },
    { name: "Heading Structure Checker", desc: "Check H1-H6 hierarchy and SEO issues", icon: "📑", category: "online", tag: "Online", link: "tools/heading-structure.html" },

    // Python Tools
    { name: "Technical Audit", desc: "Complete technical SEO audit with SSRF protection", icon: "🔍", category: "technical", tag: "Python" },
    { name: "Content Analyzer", desc: "AI detection, E-E-A-T analysis, keyword density", icon: "📝", category: "content", tag: "Python" },
    { name: "Speed Analyzer", desc: "Core Web Vitals, performance metrics", icon: "⚡", category: "technical", tag: "Python" },
    { name: "Backlink Analyzer", desc: "Backlink profile analysis and quality scoring", icon: "🔗", category: "offpage", tag: "Python" },
    { name: "Error Monitor", desc: "Technical error detection and monitoring", icon: "🚨", category: "technical", tag: "Python" },
    { name: "Rank Tracker", desc: "Keyword position tracking over time", icon: "📈", category: "automation", tag: "Python" },
    { name: "Competitor Analyzer", desc: "Competitor comparison and gap analysis", icon: "🎯", category: "content", tag: "Python" },
    { name: "Content Humanize", desc: "AI content humanization with 37 patterns", icon: "🤖", category: "content", tag: "Python" },
    { name: "Drift Monitor", desc: "SEO change monitoring with SQLite", icon: "📊", category: "automation", tag: "Python" },
    { name: "Keyword Research", desc: "Long-tail keyword discovery and clustering", icon: "🔑", category: "content", tag: "Python" },
    { name: "Schema Generator", desc: "JSON-LD structured data generation", icon: "🔧", category: "technical", tag: "Python" },
    { name: "SEO Audit Report", desc: "Comprehensive PDF/HTML audit reports", icon: "📄", category: "automation", tag: "Python" },
    { name: "Sitemap Generator", desc: "XML sitemap creation for any website", icon: "🗺️", category: "technical", tag: "Python" },
    { name: "Robots Generator", desc: "robots.txt file generation", icon: "🤖", category: "technical", tag: "Python" },
    { name: "Image Alt Checker", desc: "Check alt text coverage for all images", icon: "🖼️", category: "technical", tag: "Python" },
    { name: "Internal Link Analyzer", desc: "Analyze internal linking structure", icon: "🕸️", category: "technical", tag: "Python" },
    { name: "Backlink Checker", desc: "Backlink quality and toxicity analysis", icon: "✅", category: "offpage", tag: "Python" },
    { name: "Content Planner", desc: "Content strategy and calendar planning", icon: "📅", category: "content", tag: "Python" },
    { name: "PDF Report Generator", desc: "Generate professional PDF audit reports", icon: "📑", category: "automation", tag: "Python" },
];

// Render Tools Grid
function renderTools(category = 'all') {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;
    
    const filtered = category === 'all' ? tools : tools.filter(t => t.category === category);
    
    grid.innerHTML = filtered.map(tool => {
        if (tool.link) {
            // Online tool - clickable link
            return `
                <a href="${tool.link}" class="tool-card online-tool" data-category="${tool.category}">
                    <div class="tool-icon">${tool.icon}</div>
                    <h3>${tool.name}</h3>
                    <p>${tool.desc}</p>
                    <div class="tool-footer">
                        <span class="tool-tag online">Try Online Free</span>
                        <span class="tool-arrow">→</span>
                    </div>
                </a>
            `;
        } else {
            // Python tool - show as info card
            return `
                <div class="tool-card python-tool" data-category="${tool.category}">
                    <div class="tool-icon">${tool.icon}</div>
                    <h3>${tool.name}</h3>
                    <p>${tool.desc}</p>
                    <div class="tool-footer">
                        <span class="tool-tag python">Python Script</span>
                        <span class="tool-arrow">🐍</span>
                    </div>
                </div>
            `;
        }
    }).join('');
}

// Category Filter
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTools(btn.dataset.category);
    });
});

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Header Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTools();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
