// ============================================
// SEOHUB - Main JavaScript
// ============================================

// Tools Data
const tools = [
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
    { name: "SEO Score Calculator", desc: "Calculate comprehensive SEO scores", icon: "🧮", category: "automation", tag: "Python" },
    { name: "Image Alt Checker", desc: "Check alt text coverage for all images", icon: "🖼️", category: "technical", tag: "Python" },
    { name: "Internal Link Analyzer", desc: "Analyze internal linking structure", icon: "🕸️", category: "technical", tag: "Python" },
    { name: "Backlink Checker", desc: "Backlink quality and toxicity analysis", icon: "✅", category: "offpage", tag: "Python" },
    { name: "Content Planner", desc: "Content strategy and calendar planning", icon: "📅", category: "content", tag: "Python" },
    { name: "SEO Score Calculator", desc: "Online SEO score calculator", icon: "📊", category: "automation", tag: "Online", link: "tools/seo-score-calculator.html" },
    { name: "Schema Generator", desc: "Online JSON-LD schema generator", icon: "🔧", category: "technical", tag: "Online", link: "tools/schema-generator.html" },
    { name: "Meta Tag Analyzer", desc: "Analyze title, description, OG tags", icon: "🏷️", category: "technical", tag: "Online", link: "tools/meta-tag-analyzer.html" },
    { name: "Heading Structure Checker", desc: "Check H1-H6 hierarchy and SEO", icon: "📑", category: "technical", tag: "Online", link: "tools/heading-structure.html" },
];

// Render Tools Grid
function renderTools(category = 'all') {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;
    
    const filtered = category === 'all' ? tools : tools.filter(t => t.category === category);
    
    grid.innerHTML = filtered.map(tool => `
        <div class="tool-card" data-category="${tool.category}">
            <div class="tool-icon">${tool.icon}</div>
            <h3>${tool.name}</h3>
            <p>${tool.desc}</p>
            <span class="tool-tag">${tool.tag}</span>
        </div>
    `).join('');
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
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
