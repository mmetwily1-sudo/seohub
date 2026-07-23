// ============================================
// SEOHUB - Main JavaScript
// ============================================

const tools = [
    { name: "SEO Score Calculator", desc: "Get a comprehensive SEO score for any website", icon: "📊", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Meta Tag Analyzer", desc: "Analyze title, description, OG tags for any URL", icon: "🏷️", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Heading Structure Checker", desc: "Check H1-H6 hierarchy and SEO issues", icon: "📑", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Schema Generator", desc: "Generate JSON-LD structured data for rich results", icon: "🔧", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Technical SEO Audit", desc: "Complete technical SEO audit with 20+ checks", icon: "🔍", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Speed & Performance", desc: "Page speed, load time, resource analysis", icon: "⚡", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Content Analyzer", desc: "Readability score, word count, content quality", icon: "📝", category: "content", tag: "Online", link: "tools.html" },
    { name: "Keyword Research", desc: "Extract keywords, density, and bigrams from any page", icon: "🔑", category: "content", tag: "Online", link: "tools.html" },
    { name: "Image Alt Checker", desc: "Check alt text coverage for all images", icon: "🖼️", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Internal Link Analyzer", desc: "Analyze internal and external linking structure", icon: "🔗", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Robots.txt Generator", desc: "Generate robots.txt file for any website", icon: "🤖", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Sitemap Generator", desc: "Generate XML sitemap from any website", icon: "🗺️", category: "technical", tag: "Online", link: "tools.html" },
    { name: "Competitor Analyzer", desc: "Compare your site against competitors", icon: "🎯", category: "content", tag: "Online", link: "tools.html" },
    { name: "SEO Report Generator", desc: "Full SEO report with score and recommendations", icon: "📄", category: "automation", tag: "Online", link: "tools.html" },
];

function renderTools(category = 'all') {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;
    const filtered = category === 'all' ? tools : tools.filter(t => t.category === category);
    grid.innerHTML = filtered.map(tool => {
        if (tool.link) {
            return '<a href="' + tool.link + '" class="tool-card online-tool" data-category="' + tool.category + '"><div class="tool-icon">' + tool.icon + '</div><h3>' + tool.name + '</h3><p>' + tool.desc + '</p><div class="tool-footer"><span class="tool-tag online">Try Online Free</span><span class="tool-arrow">&rarr;</span></div></a>';
        }
        return '<div class="tool-card python-tool" data-category="' + tool.category + '"><div class="tool-icon">' + tool.icon + '</div><h3>' + tool.name + '</h3><p>' + tool.desc + '</p><div class="tool-footer"><span class="tool-tag python">Python Script</span></div></div>';
    }).join('');
}

document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTools(btn.dataset.category);
    });
});

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.pageYOffset > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

document.addEventListener('DOMContentLoaded', () => { renderTools(); });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
