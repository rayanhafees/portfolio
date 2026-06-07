document.addEventListener('DOMContentLoaded', function () {

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Mouse glow effect
    const glow = document.querySelector('.mouse-glow');

    function updateGlowPosition(e) {
        const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        glow.style.transition = 'transform 0.1s ease';
        glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }

    window.addEventListener('mousemove', updateGlowPosition);
    window.addEventListener('touchmove', updateGlowPosition);

    setTimeout(() => {
        glow.style.opacity = '1';
    }, 200);

    // Typewriter effect on tagline
    const tagline = document.querySelector('.tagline');
    const phrases = [
        'Data Analytics · Automation · Backend Engineering',
        'Building real products since 2023',
        'Open to full-time opportunities',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let pause = false;

    function typewrite() {
        const current = phrases[phraseIndex];

        if (pause) {
            setTimeout(typewrite, 1800);
            pause = false;
            return;
        }

        if (!deleting) {
            tagline.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                pause = true;
                deleting = true;
                setTimeout(typewrite, 1800);
                return;
            }
            setTimeout(typewrite, 45);
        } else {
            tagline.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            setTimeout(typewrite, 25);
        }
    }

    tagline.textContent = "";
    setTimeout(typewrite, 600);

    // Active nav link highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function onScroll() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = '#ffffff';
            }
        });
    }

    window.addEventListener('scroll', onScroll);

    // Scroll fade-in
    const fadeTargets = document.querySelectorAll('.timeline-item, .project-card, .skill-group, .about-text, .cert-list li, h3');

    fadeTargets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 60);
            } else {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(24px)';
            }
        });
    }, { threshold: 0.12 });

    fadeTargets.forEach(el => observer.observe(el));

    // Custom cursor
    const cursorDot = document.createElement('div');
    const cursorRing = document.createElement('div');

    cursorDot.style.position = 'fixed';
    cursorDot.style.width = '6px';
    cursorDot.style.height = '6px';
    cursorDot.style.background = '#64ffda';
    cursorDot.style.borderRadius = '50%';
    cursorDot.style.pointerEvents = 'none';
    cursorDot.style.zIndex = '9999';
    cursorDot.style.transform = 'translate(-50%, -50%)';
    cursorDot.style.transition = 'opacity 0.3s';

    cursorRing.style.position = 'fixed';
    cursorRing.style.width = '32px';
    cursorRing.style.height = '32px';
    cursorRing.style.border = '1.5px solid rgba(100, 255, 218, 0.5)';
    cursorRing.style.borderRadius = '50%';
    cursorRing.style.pointerEvents = 'none';
    cursorRing.style.zIndex = '9998';
    cursorRing.style.transform = 'translate(-50%, -50%)';
    cursorRing.style.transition = 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease, opacity 0.3s';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.body.style.cursor = 'none';

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .project-card').forEach(function (el) {
        el.style.cursor = 'none';
        el.addEventListener('mouseenter', function () {
            cursorRing.style.width = '52px';
            cursorRing.style.height = '52px';
            cursorRing.style.borderColor = 'rgba(100, 255, 218, 0.9)';
            cursorDot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', function () {
            cursorRing.style.width = '32px';
            cursorRing.style.height = '32px';
            cursorRing.style.borderColor = 'rgba(100, 255, 218, 0.5)';
            cursorDot.style.opacity = '1';
        });
    });

    document.addEventListener('mouseleave', function () {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
    });

    // ── Command Palette ──────────────────────────────────────────────
    const commands = [
        { label: 'Go to About',              icon: 'fa-solid fa-user',           action: () => scrollToSection('About') },
        { label: 'Go to Education',          icon: 'fa-solid fa-graduation-cap', action: () => scrollToSection('Education') },
        { label: 'Go to Experience',         icon: 'fa-solid fa-briefcase',      action: () => scrollToSection('Experience') },
        { label: 'Go to Skills',             icon: 'fa-solid fa-bolt',           action: () => scrollToSection('Skills') },
        { label: 'Go to Projects',           icon: 'fa-solid fa-code',           action: () => scrollToSection('Projects') },
        { label: 'Go to Certifications',     icon: 'fa-solid fa-certificate',    action: () => scrollToSection('Certifications') },
        { label: 'Download Resume',          icon: 'fa-solid fa-file-arrow-down',action: () => window.open('Resume.pdf', '_blank') },
        { label: 'Open GitHub',              icon: 'fa-brands fa-github',        action: () => window.open('https://github.com/rayanhafees', '_blank') },
        { label: 'Open LinkedIn',            icon: 'fa-brands fa-linkedin',      action: () => window.open('https://www.linkedin.com/in/rayan-mohammed-265690191/', '_blank') },
        { label: 'Send Email',               icon: 'fa-solid fa-envelope',       action: () => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=rayanhafees@gmail.com', '_blank') },
        { label: 'Open Instagram',           icon: 'fa-brands fa-instagram',     action: () => window.open('https://instagram.com/rayan_hafees', '_blank') },
        { label: 'View VayoAura',            icon: 'fa-solid fa-globe',          action: () => window.open('https://vayoaura.com/', '_blank') },
        { label: 'View VSync on Play Store', icon: 'fa-brands fa-google-play',   action: () => window.open('https://play.google.com/store/apps/details?id=com.tiorcim.vysnc_v1&hl=en', '_blank') },
    ];

    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    // Build palette HTML
    const overlay = document.createElement('div');
    overlay.id = 'cmd-overlay';
    overlay.innerHTML = `
        <div id="cmd-palette">
            <div id="cmd-header">
                <span id="cmd-icon">⌘</span>
                <input id="cmd-input" type="text" placeholder="Type a command or search..." autocomplete="off" />
                <span id="cmd-esc">ESC</span>
            </div>
            <div id="cmd-divider"></div>
            <ul id="cmd-list"></ul>
            <div id="cmd-footer">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>ESC close</span>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const cmdOverlay  = document.getElementById('cmd-overlay');
    const cmdInput    = document.getElementById('cmd-input');
    const cmdList     = document.getElementById('cmd-list');
    let activeIndex   = 0;
    let filtered      = [...commands];

    function renderList() {
        cmdList.innerHTML = '';
        filtered.forEach((cmd, i) => {
            const li = document.createElement('li');
            li.className = 'cmd-item' + (i === activeIndex ? ' cmd-active' : '');
            li.innerHTML = `<span class="cmd-item-icon"><i class="${cmd.icon}"></i></span><span>${cmd.label}</span>`;
            li.addEventListener('mouseenter', () => {
                activeIndex = i;
                renderList();
            });
            li.addEventListener('click', () => {
                runCommand(cmd);
            });
            cmdList.appendChild(li);
        });
    }

    function runCommand(cmd) {
        closepalette();
        cmd.action();
    }

    function openPalette() {
        filtered = [...commands];
        activeIndex = 0;
        cmdInput.value = '';
        renderList();
        cmdOverlay.style.display = 'flex';
        setTimeout(() => {
            cmdOverlay.style.opacity = '1';
            document.getElementById('cmd-palette').style.transform = 'translateY(0)';
        }, 10);
        cmdInput.focus();
    }

    function closepalette() {
        cmdOverlay.style.opacity = '0';
        document.getElementById('cmd-palette').style.transform = 'translateY(-12px)';
        setTimeout(() => { cmdOverlay.style.display = 'none'; }, 200);
    }

    // alias so both spellings work
    function closePalette() { closepalette(); }

    cmdInput.addEventListener('input', function () {
        const q = this.value.toLowerCase();
        filtered = commands.filter(c => c.label.toLowerCase().includes(q));
        activeIndex = 0;
        renderList();
    });

    cmdOverlay.addEventListener('click', function (e) {
        if (e.target === cmdOverlay) closePalette();
    });

    document.addEventListener('keydown', function (e) {
        const isOpen = cmdOverlay.style.display === 'flex';

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            isOpen ? closePalette() : openPalette();
            return;
        }

        if (!isOpen) return;

        if (e.key === 'Escape') {
            closePalette();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
            renderList();
            scrollActiveIntoView();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            renderList();
            scrollActiveIntoView();
        } else if (e.key === 'Enter') {
            if (filtered[activeIndex]) runCommand(filtered[activeIndex]);
        }
    });

    function scrollActiveIntoView() {
        const active = cmdList.querySelector('.cmd-active');
        if (active) active.scrollIntoView({ block: 'nearest' });
    }

    // Hint on left panel
    const hint = document.createElement('p');
    hint.id = 'cmd-hint';
    hint.innerHTML = '<kbd>Ctrl</kbd> + <kbd>K</kbd> to open command palette';
    document.querySelector('.left-section').appendChild(hint);

});