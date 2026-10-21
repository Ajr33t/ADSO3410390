document.addEventListener("DOMContentLoaded", () => {
    // 01 - Navbar y navegación
    const navLinks = document.querySelectorAll("#navbar .options a");
    const footerLinks = document.querySelectorAll(".footer-nav a");
    const sections = document.querySelectorAll("main > section");
    const navIndicator = document.querySelector(".nav-indicator");
    const footerIndicator = document.querySelector(".footer-indicator");
    const primaryNavigation = document.getElementById("primary-navigation");
    const headerMenuToggle = document.querySelector("#navbar .menu-toggle");
    const footerNavigation = document.getElementById("footer-navigation");
    const footerMenuToggle = document.querySelector(".footer-menu-toggle");

    function moverIndicador(link, indicador) {
        if (!link || !indicador) return;
        indicador.style.width = `${link.offsetWidth}px`;
        indicador.style.left = `${link.offsetLeft}px`;
    }

    function sincronizarMenus(targetHref) {
        let activeNavLink = null;
        let activeFooterLink = null;

        navLinks.forEach(link => {
            const isActive = link.getAttribute("href") === targetHref;
            link.classList.toggle("active", isActive);
            if (isActive) activeNavLink = link;
        });

        footerLinks.forEach(link => {
            const isActive = link.getAttribute("href") === targetHref;
            link.classList.toggle("active", isActive);
            if (isActive) activeFooterLink = link;
        });

        moverIndicador(activeNavLink, navIndicator);
        moverIndicador(activeFooterLink, footerIndicator);
    }

    function cerrarMenuPrincipal() {
        primaryNavigation?.classList.remove("is-open");
        headerMenuToggle?.setAttribute("aria-expanded", "false");
        headerMenuToggle?.setAttribute("aria-label", "Abrir menú");
    }

    function cerrarMenuFooter() {
        footerNavigation?.classList.remove("is-open");
        footerMenuToggle?.setAttribute("aria-expanded", "false");
        footerMenuToggle?.setAttribute("aria-label", "Abrir menú del pie de página");
    }

    headerMenuToggle?.addEventListener("click", () => {
        const abierto = primaryNavigation.classList.toggle("is-open");
        headerMenuToggle.setAttribute("aria-expanded", String(abierto));
        headerMenuToggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        cerrarMenuFooter();
    });

    footerMenuToggle?.addEventListener("click", () => {
        const abierto = footerNavigation.classList.toggle("is-open");
        footerMenuToggle.setAttribute("aria-expanded", String(abierto));
        footerMenuToggle.setAttribute("aria-label", abierto ? "Cerrar menú del pie de página" : "Abrir menú del pie de página");
        cerrarMenuPrincipal();
    });

    const todosLosEnlaces = [...navLinks, ...footerLinks];
    todosLosEnlaces.forEach(link => {
        link.addEventListener("click", e => {
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            e.preventDefault();
            sincronizarMenus(targetId);
            cerrarMenuPrincipal();
            cerrarMenuFooter();
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    window.addEventListener("scroll", () => {
        let seccionActivaId = "#sobre";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                seccionActivaId = `#${section.getAttribute("id")}`;
            }
        });
        sincronizarMenus(seccionActivaId);
    }, { passive: true });

    function actualizarIndicadores() {
        moverIndicador(document.querySelector("#navbar .options a.active"), navIndicator);
        moverIndicador(document.querySelector(".footer-nav a.active"), footerIndicator);
    }

    setTimeout(actualizarIndicadores, 300);
    window.addEventListener("resize", actualizarIndicadores);

    // 02 - Carruseles responsive
    document.querySelectorAll(".carousel-arrow").forEach(boton => {
        boton.addEventListener("click", () => {
            const shell = boton.closest(".carousel-shell");
            const track = shell?.querySelector(".carousel-track");
            const primeraTarjeta = track?.firstElementChild;
            if (!track || !primeraTarjeta) return;

            const estilos = window.getComputedStyle(track);
            const gap = parseFloat(estilos.columnGap || estilos.gap) || 0;
            const desplazamiento = primeraTarjeta.getBoundingClientRect().width + gap;
            const direccion = Number(boton.dataset.direction) || 1;
            const final = track.scrollWidth - track.clientWidth;

            if (direccion > 0 && track.scrollLeft >= final - 5) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else if (direccion < 0 && track.scrollLeft <= 5) {
                track.scrollTo({ left: final, behavior: "smooth" });
            } else {
                track.scrollBy({ left: direccion * desplazamiento, behavior: "smooth" });
            }
        });
    });

    // 03 - Modal de mapas
    const modalMapa = document.getElementById("modal-mapa");
    const imagenMapaAmpliada = document.getElementById("imagen-mapa-ampliada");
    const botonCerrarMapa = document.querySelector(".cerrar-mapa");
    const botonesVerMapa = document.querySelectorAll("#mapas .btn-ver-mapa");

    function abrirMapa(e) {
        e.preventDefault();
        const tarjeta = e.currentTarget.closest(".tarjeta-mapa");
        const imagenOriginal = tarjeta?.querySelector("img");
        if (!modalMapa || !imagenMapaAmpliada || !imagenOriginal) return;

        imagenMapaAmpliada.src = imagenOriginal.src;
        imagenMapaAmpliada.alt = imagenOriginal.alt || "Mapa ampliado";
        modalMapa.classList.add("activo");
        modalMapa.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        botonCerrarMapa?.focus();
    }

    function cerrarMapa() {
        if (!modalMapa || !imagenMapaAmpliada) return;
        modalMapa.classList.remove("activo");
        modalMapa.setAttribute("aria-hidden", "true");
        imagenMapaAmpliada.src = "";
        document.body.style.overflow = "";
    }

    botonesVerMapa.forEach(boton => boton.addEventListener("click", abrirMapa));
    botonCerrarMapa?.addEventListener("click", cerrarMapa);

    modalMapa?.addEventListener("click", e => {
        if (e.target === modalMapa) cerrarMapa();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (modalMapa?.classList.contains("activo")) cerrarMapa();
            cerrarMenuPrincipal();
            cerrarMenuFooter();
        }
    });
});

