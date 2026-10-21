document.addEventListener("DOMContentLoaded", () => {
    // Seleccionamos los enlaces de ambos menús
    const navLinks = document.querySelectorAll("#navbar .options a");
    const footerLinks = document.querySelectorAll(".footer-nav a");
    
    // Seleccionamos las secciones de la página
    const sections = document.querySelectorAll("main > section");
    
    // Seleccionamos las barritas indicadoras
    const navIndicator = document.querySelector(".nav-indicator");
    const footerIndicator = document.querySelector(".footer-indicator");

    // Función para mover la barrita indicadora de forma exacta
    function moverIndicador(link, indicador) {
        if (!link || !indicador) return;
        indicador.style.width = `${link.offsetWidth}px`;
        indicador.style.left = `${link.offsetLeft}px`;
    }

    // Función central para activar una sección en ambos menús a la vez
    function sincronizarMenus(targetHref) {
        let activeNavLink = null;
        let activeFooterLink = null;

        // Actualizar Navbar superior
        navLinks.forEach(link => {
            if (link.getAttribute("href") === targetHref) {
                link.classList.add("active");
                activeNavLink = link;
            } else {
                link.classList.remove("active");
            }
        });

        // Actualizar Footer inferior
        footerLinks.forEach(link => {
            if (link.getAttribute("href") === targetHref) {
                link.classList.add("active");
                activeFooterLink = link;
            } else {
                link.classList.remove("active");
            }
        });

        // Mover ambas barritas a sus nuevas posiciones
        moverIndicador(activeNavLink, navIndicator);
        moverIndicador(activeFooterLink, footerIndicator);
    }

    // --- EVENTO 1: Controlar los Clics en los enlaces ---
    const todosLosEnlaces = [...navLinks, ...footerLinks];
    
    todosLosEnlaces.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Evitamos el salto brusco por defecto
            
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Sincronizamos los menús inmediatamente
                sincronizarMenus(targetId);

                // Hacemos un scroll suave hacia la sección seleccionada
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // --- EVENTO 2: Detectar el Scroll del usuario (Scroll Spy) ---
    window.addEventListener("scroll", () => {
        let seccionActivaId = "#sobre"; // Sección por defecto al inicio

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Margen de detección
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                seccionActivaId = `#${section.getAttribute("id")}`;
            }
        });

        sincronizarMenus(seccionActivaId);
    });

    // Inicializar la posición de las barritas al cargar la página en la sección activa
    setTimeout(() => {
        const navActive = document.querySelector("#navbar .options a.active");
        const footerActive = document.querySelector(".footer-nav a.active");
        moverIndicador(navActive, navIndicator);
        moverIndicador(footerActive, footerIndicator);
    }, 300);
});
