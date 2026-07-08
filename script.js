/* ============================================================
   Rayan Mohammed — Dossier (v3)
   Restrained motion: animations only where they draw data.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Lenis smooth scroll ─────────────────────────────── */
    const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* ── Cover: name decodes once ────────────────────────── */
    const nameEl = document.getElementById('cover-name');
    const finalHTML = nameEl.innerHTML;
    const finalText = ['RAYAN', 'MOHAMMED'];
    const GLYPHS = '#$%&/=?@0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (!prefersReducedMotion) {
        let frame = 0;
        const totalFrames = 34;

        const scramble = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const lines = finalText.map((word) =>
                word
                    .split('')
                    .map((ch, i) =>
                        i / word.length < progress
                            ? ch
                            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                    )
                    .join('')
            );
            nameEl.innerHTML = lines.join('<br>');
            if (frame >= totalFrames) {
                clearInterval(scramble);
                nameEl.innerHTML = finalHTML;
            }
        }, 42);
    }

    gsap.from('.cover-meta-row, .cover-foot', {
        opacity: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.15,
    });

    /* ── Theme toggle: paper ↔ negative ──────────────────── */
    function toggleTheme() {
        const root = document.documentElement;
        const next = root.dataset.theme === 'dark' ? '' : 'dark';
        if (next) root.dataset.theme = next;
        else delete root.dataset.theme;
        try { localStorage.setItem('rm-theme', next || 'light'); } catch (e) {}
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    /* ── Pinned cover: page holds while the title recedes ── */
    if (!prefersReducedMotion) {
        const coverTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.cover',
                start: 'top top',
                end: '+=70%',
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
            },
        });

        coverTl
            .to('.cover-meta', { opacity: 0, y: -40, ease: 'none' }, 0)
            .to('.cover-name', { scale: 0.94, opacity: 0.06, yPercent: -8, ease: 'none', transformOrigin: 'left bottom' }, 0.1)
            .to('.cover-foot', { opacity: 0, ease: 'none' }, 0.25);
    }

    /* ── Read percentage in top bar ──────────────────────── */
    const readPct = document.getElementById('read-pct');

    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            readPct.textContent = Math.round(self.progress * 100);
        },
    });

    /* ── Active section in top bar nav ───────────────────── */
    const navLinks = document.querySelectorAll('.topbar-nav a');
    document.querySelectorAll('.sec').forEach((sec, i) => {
        ScrollTrigger.create({
            trigger: sec,
            start: 'top 40%',
            end: 'bottom 40%',
            onToggle: (self) => {
                if (self.isActive) {
                    navLinks.forEach((l) => l.classList.remove('is-active'));
                    if (navLinks[i]) navLinks[i].classList.add('is-active');
                }
            },
        });
    });

    /* ── Summary: highlighter marks draw on scroll ───────── */
    ScrollTrigger.create({
        trigger: '.summary-lede',
        start: 'top 72%',
        once: true,
        onEnter: () => document.querySelector('.summary-lede').classList.add('marks-on'),
    });

    /* ── Summary: words surface as you read (scrub) ──────── */
    if (!prefersReducedMotion) {
        const lede = document.querySelector('.summary-lede');
        const units = [];

        [...lede.childNodes].forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                node.textContent.split(/(\s+)/).forEach((part) => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) {
                        frag.appendChild(document.createTextNode(' '));
                    } else {
                        const s = document.createElement('span');
                        s.textContent = part;
                        frag.appendChild(s);
                        units.push(s);
                    }
                });
                lede.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                units.push(node);
            }
        });

        gsap.fromTo(units,
            { opacity: 0.14 },
            {
                opacity: 1,
                stagger: 0.035,
                ease: 'none',
                scrollTrigger: {
                    trigger: lede,
                    start: 'top 80%',
                    end: 'bottom 50%',
                    scrub: 0.4,
                },
            }
        );
    }

    /* ── Metric counters ─────────────────────────────────── */
    document.querySelectorAll('.metric-num').forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const state = { v: 0 };
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () =>
                gsap.to(state, {
                    v: target,
                    duration: 1.4,
                    ease: 'power2.out',
                    onUpdate: () => (el.textContent = Math.round(state.v) + suffix),
                }),
        });
    });

    /* ── Gantt bars draw AS you scroll (scrub-linked) ────── */
    if (!prefersReducedMotion) {
        gsap.to('.gantt-bar', {
            scaleX: 1,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: {
                trigger: '.gantt',
                start: 'top 85%',
                end: 'top 30%',
                scrub: 0.5,
            },
        });
    } else {
        gsap.set('.gantt-bar', { scaleX: 1 });
    }

    /* ── Benchmark chart draws as you scroll ─────────────── */
    if (!prefersReducedMotion) {
        const benchTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.bench',
                start: 'top 80%',
                end: 'top 25%',
                scrub: 0.5,
            },
        });

        benchTl
            .to('.bench-row.is-ours .bench-bar', { scaleX: 1, ease: 'none', duration: 0.8 })
            .to('.bench-row:not(.is-ours) .bench-bar', { scaleX: 1, ease: 'none', duration: 2, stagger: 0.3 })
            .to('.bench-val', { opacity: 1, duration: 0.5, stagger: 0.08 });
    } else {
        gsap.set('.bench-bar', { scaleX: 1 });
        gsap.set('.bench-val', { opacity: 1 });
    }

    /* ── Section titles shift with scroll ────────────────── */
    if (!prefersReducedMotion) {
        gsap.utils.toArray('.sec-name').forEach((el) => {
            gsap.from(el, {
                x: 80,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    end: 'top 55%',
                    scrub: 0.6,
                },
            });
        });
    }

    /* ── Status stamps slam in ───────────────────────────── */
    gsap.utils.toArray('.lg-status').forEach((el) => {
        gsap.from(el, {
            scale: 2.4,
            opacity: 0,
            rotation: -6,
            duration: 0.45,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
        });
    });

    /* ── Quiet fade-up for row content ───────────────────── */
    gsap.utils
        .toArray('.record, .ledger-row, .matrix-group, .finding, .cred, .contact-row')
        .forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: 18,
                duration: 0.55,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 92%' },
            });
        });

    gsap.utils.toArray('.sec-label').forEach((el) => {
        gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
        });
    });

    /* ── Endmark types out when reached ──────────────────── */
    const endmarkText = document.querySelector('.endmark span');
    const endFinal = endmarkText.textContent;
    ScrollTrigger.create({
        trigger: '.endmark',
        start: 'top 95%',
        once: true,
        onEnter: () => {
            if (prefersReducedMotion) return;
            let i = 0;
            endmarkText.textContent = '';
            const t = setInterval(() => {
                endmarkText.textContent = endFinal.slice(0, ++i);
                if (i >= endFinal.length) clearInterval(t);
            }, 36);
        },
    });

    /* ── Anchor links through Lenis ──────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -48, duration: 1.2 });
            }
        });
    });

    /* ── Command palette (⌘K) ────────────────────────────── */
    (function commandPalette() {
        const isMac = /Mac|iPhone|iPad/.test(navigator.platform);

        function goto(sel) {
            const el = document.querySelector(sel);
            if (el) lenis.scrollTo(el, { offset: -48, duration: 1.2 });
        }

        const commands = [
            { tag: '01', label: 'Executive Summary',        meta: 'section', run: () => goto('#sec-01') },
            { tag: '02', label: 'Employment Record',        meta: 'section', run: () => goto('#sec-02') },
            { tag: '03', label: 'Project Ledger',           meta: 'section', run: () => goto('#sec-03') },
            { tag: '04', label: 'Capability Matrix',        meta: 'section', run: () => goto('#sec-04') },
            { tag: '05', label: 'Education & Credentials',  meta: 'section', run: () => goto('#sec-05') },
            { tag: '06', label: 'Point of Contact',         meta: 'section', run: () => goto('#sec-06') },
            { tag: '◐',  label: 'Toggle INVERT (dark mode)',meta: 'theme',   run: () => toggleTheme() },
            { tag: '↓',  label: 'Download résumé (PDF)',    meta: 'file',    run: () => window.open('../Resume_7.pdf', '_blank') },
            { tag: '↗',  label: 'Open GitHub',              meta: 'link',    run: () => window.open('https://github.com/rayanhafees', '_blank') },
            { tag: '↗',  label: 'Open LinkedIn',            meta: 'link',    run: () => window.open('https://www.linkedin.com/in/rayan-mohammed-265690191/', '_blank') },
            { tag: '↗',  label: 'Send email',               meta: 'link',    run: () => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=rayanhafees@gmail.com', '_blank') },
            { tag: '↗',  label: 'Visit VSync (Play Store)', meta: 'link',    run: () => window.open('https://play.google.com/store/apps/details?id=com.tiorcim.vysnc_v1&hl=en', '_blank') },
            { tag: '↗',  label: 'Visit VayoAura',           meta: 'link',    run: () => window.open('https://vayoaura.com/', '_blank') },
        ];

        const overlay = document.createElement('div');
        overlay.id = 'cmdk-overlay';
        overlay.innerHTML = `
            <div id="cmdk-panel" role="dialog" aria-modal="true" aria-label="Command palette">
                <div class="cmdk-head">
                    <span class="cmdk-caret">&gt;</span>
                    <input id="cmdk-input" type="text" autocomplete="off" spellcheck="false" placeholder="Type a command or search…" aria-label="Command input" />
                    <span class="cmdk-esc">ESC</span>
                </div>
                <ul id="cmdk-list"></ul>
                <div class="cmdk-foot"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span></div>
            </div>`;
        document.body.appendChild(overlay);

        const input = overlay.querySelector('#cmdk-input');
        const list  = overlay.querySelector('#cmdk-list');

        let filtered = commands.slice();
        let active = 0;
        let open = false;

        function render() {
            if (!filtered.length) {
                list.innerHTML = '<li class="cmdk-empty">No matching command</li>';
                return;
            }
            list.innerHTML = filtered.map((c, i) =>
                `<li class="cmdk-item${i === active ? ' active' : ''}" data-i="${i}">
                    <span class="cmdk-tag">${c.tag}</span>
                    <span class="cmdk-label">${c.label}</span>
                    <span class="cmdk-meta">${c.meta}</span>
                </li>`).join('');
            list.querySelectorAll('.cmdk-item').forEach((li) => {
                const i = +li.dataset.i;
                li.addEventListener('mousemove', () => { if (active !== i) { active = i; render(); } });
                li.addEventListener('click', () => runIdx(i));
            });
        }

        function openPalette() {
            open = true;
            filtered = commands.slice();
            active = 0;
            input.value = '';
            render();
            overlay.classList.add('open');
            requestAnimationFrame(() => input.focus());
        }

        function closePalette() {
            open = false;
            overlay.classList.remove('open');
            input.blur();
        }

        function runIdx(i) {
            const c = filtered[i];
            if (!c) return;
            closePalette();
            c.run();
        }

        function scrollActive() {
            const el = list.querySelector('.cmdk-item.active');
            if (el) el.scrollIntoView({ block: 'nearest' });
        }

        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            filtered = q
                ? commands.filter((c) => (c.label + ' ' + c.meta).toLowerCase().includes(q))
                : commands.slice();
            active = 0;
            render();
        });

        overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) closePalette(); });

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                open ? closePalette() : openPalette();
                return;
            }
            if (!open) return;
            if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); render(); scrollActive(); }
            else if (e.key === 'ArrowUp')   { e.preventDefault(); active = Math.max(active - 1, 0); render(); scrollActive(); }
            else if (e.key === 'Enter')     { e.preventDefault(); runIdx(active); }
        });

        const hint = document.createElement('button');
        hint.className = 'cmdk-hint';
        hint.type = 'button';
        hint.setAttribute('aria-label', 'Open command palette');
        hint.textContent = isMac ? '⌘K' : 'CTRL K';
        hint.addEventListener('click', openPalette);
        const right = document.querySelector('.topbar-right');
        if (right) right.insertBefore(hint, right.firstChild);
    })();

    window.addEventListener('load', () => ScrollTrigger.refresh());

});
