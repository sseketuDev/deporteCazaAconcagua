// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa para móviles
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // bloquear el scroll del fondo cuando el menú está abierto
            document.body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.hamburger')) {
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
            }
        }
    });

    // Manejo de mega-menus en móvil: tocar el item del menú abre/cierra su mega-menu
    const menuItems = document.querySelectorAll('.nav-menu > li');
    menuItems.forEach(item => {
        const mega = item.querySelector('.mega-menu');
        const link = item.querySelector('a');
        if (mega && link) {
            // Añadir botón expandible para accesibilidad en pantallas pequeñas
            link.setAttribute('aria-haspopup', 'true');
            link.setAttribute('aria-expanded', 'false');
            link.addEventListener('click', function(e) {
                // Solo en pantallas móviles donde el nav está en modo colapsado
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    const isOpen = mega.classList.toggle('open');
                    link.setAttribute('aria-expanded', isOpen);
                    // cerrar otros mega-menus
                    menuItems.forEach(other => {
                        if (other !== item) {
                            const otherMega = other.querySelector('.mega-menu');
                            const otherLink = other.querySelector('a');
                            if (otherMega) {
                                otherMega.classList.remove('open');
                            }
                            if (otherLink) {
                                otherLink.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                }
            });
        }
    });
    
    // Carrusel de Clientes
    class ClientsCarousel {
        constructor() {
            this.track = document.querySelector('.carousel-track');
            this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
            this.prevBtn = document.querySelector('.prev-btn');
            this.nextBtn = document.querySelector('.next-btn');
            this.indicators = Array.from(document.querySelectorAll('.carousel-indicator'));
            this.currentIndex = 0;
            this.isAnimating = false;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            // Event listeners
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Indicators
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
            
            // Touch events for mobile
            this.addTouchEvents();
            
            // Auto slide
            this.startAutoSlide();
            
            // Pause auto slide on hover
            this.track.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.track.addEventListener('mouseleave', () => this.startAutoSlide());
            
            // Update initial state
            this.updateCarousel();
        }
        
        updateCarousel() {
            // Move track
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            
            // Update indicators
            this.indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === this.currentIndex);
            });
            
            // Add active class to current slide for animations
            this.slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === this.currentIndex);
            });
            
            this.isAnimating = false;
        }
        
        nextSlide() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            this.currentIndex = (this.currentIndex === this.slides.length - 1) ? 0 : this.currentIndex + 1;
            this.updateCarousel();
        }
        
        prevSlide() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            this.currentIndex = (this.currentIndex === 0) ? this.slides.length - 1 : this.currentIndex - 1;
            this.updateCarousel();
        }
        
        goToSlide(index) {
            if (this.isAnimating || index === this.currentIndex) return;
            this.isAnimating = true;
            
            this.currentIndex = index;
            this.updateCarousel();
        }
        
        handleKeyboard(e) {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key >= '1' && e.key <= '3') {
                this.goToSlide(parseInt(e.key) - 1);
            }
        }
        
        addTouchEvents() {
            let startX = 0;
            let endX = 0;
            const minSwipeDistance = 50;
            
            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                this.stopAutoSlide();
            }, { passive: true });
            
            this.track.addEventListener('touchmove', (e) => {
                endX = e.touches[0].clientX;
            }, { passive: true });
            
            this.track.addEventListener('touchend', () => {
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                this.startAutoSlide();
            }, { passive: true });
        }
        
        startAutoSlide() {
            this.stopAutoSlide();
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 5000); // Change slide every 5 seconds
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // Inicializar el carrusel
    if (document.querySelector('.clients-carousel')) {
        new ClientsCarousel();
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animación de aparición de elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.card, .testimonial-card, .about-content, .section-title').forEach(el => {
        observer.observe(el);
    });
    
    // Añadir clase para animación CSS
    const style = document.createElement('style');
    style.textContent = `
        .card, .testimonial-card, .about-content, .section-title {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .card.animate-in, .testimonial-card.animate-in, .about-content.animate-in, .section-title.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .card:nth-child(odd) { transition-delay: 0.1s; }
        .card:nth-child(even) { transition-delay: 0.2s; }
        .testimonial-card:nth-child(odd) { transition-delay: 0.1s; }
        .testimonial-card:nth-child(even) { transition-delay: 0.2s; }
    `;
    document.head.appendChild(style);
    
    // Alerta que se muestra al cargar la página
    window.addEventListener('load', function() {
        setTimeout(function() {
            alert("⚠️ AVISO IMPORTANTE: Se requieren documentos legales para poseer un arma. Consulte los requisitos legales antes de proceder.");
        }, 1000);
    });
    
    // Mejorar la experiencia de video en móviles
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // Asegurar que el video se reproduzca correctamente en móviles
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('muted', '');
        heroVideo.setAttribute('autoplay', '');
        
        // Intentar reproducir el video (necesario para algunos navegadores móviles)
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Fallback: mostrar imagen si el video no puede reproducirse
                console.log('Video autoplay failed, using fallback image');
                heroVideo.style.display = 'none';
                // Aquí podrías mostrar una imagen de fondo como fallback
            });
        }
    }
});