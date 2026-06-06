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

    // Smooth initial appearance
    setTimeout(() => {
        glow.style.opacity = '1';
    }, 200);

    // Active nav link highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const rightSection = document.querySelector('.right-section');

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

});