class HorizonApp {
    constructor() {
        this.currentPage = 'home';
        this.currentSection = null;
        this.isLoading = false;
        this.components = {
            // Componentes principais
            navbar: 'components/navbar.html',
            footer: 'components/footer.html',
            
            // Paginas completas
            services: 'components/cabecalho-servicos.html',
            about: 'sobre-completo.html',

            heroSection: 'components/secao-principal.html',
            statsSection: 'components/secao-estatisticas.html',
            aboutSection: 'components/secao-sobre.html',
            servicesPreviewSection: 'components/secao-resumo-servicos.html',
            ctaSection: 'components/secao-chamada-acao.html',

            cabecalhoServicos: 'sections/servicos/cabecalho-servicos.html',
            navegacaoInterna: 'sections/servicos/navegacao-interna.html',
            secaoContabilidade: 'sections/servicos/secao-contabilidade.html',
            secaoConsultoriaFiscal: 'sections/servicos/secao-consultoria-fiscal.html',
            secaoConsultoriaFinanceira: 'sections/servicos/secao-consultoria-financeira.html',
            secaoAuditoria: 'sections/servicos/secao-auditoria.html',
            secaoGestaoEmpresarial: 'sections/servicos/secao-gestao-empresarial.html',
            secaoRecursosHumanos: 'sections/servicos/secao-recursos-humanos.html',
            secaoServicosAdministrativos: 'sections/servicos/secao-servicos-administrativos.html',
            tabelaPrecos: 'sections/servicos/tabela-precos.html',

            // Seções da página sobre nós
            cabecalhoSobreNos: 'sections/sobre-nos/cabecalho-sobre-nos.html',
            nossaHistoria: 'sections/sobre-nos/nossa-historia.html',
            missaoVisaoValores: 'sections/sobre-nos/missao-visao-valores.html',
            porqueEscolherNos: 'sections/sobre-nos/porque-escolher-nos.html',
            nossaEquipa: 'sections/sobre-nos/nossa-equipa.html',
            certificacoesReconhecimentos: 'sections/sobre-nos/certificacoes-reconhecimentos.html',
            chamadaFinalSobreNos: 'sections/sobre-nos/chamada-final-sobre.html',

            // Seções da página contato
            contactHero: 'sections/contacto/contact-hero.html',
            contactInfo: 'sections/contacto/contact-info.html',
            contactLocation: 'sections/contacto/contact-location.html',
            contactMethods: 'sections/contacto/contact-methods.html',
            contactCta: 'sections/contacto/contact-cta.html'
        };
        
        // Definir quais páginas usam seções modulares
        this.modularPages = {
            home: [
                'heroSection',
                'statsSection', 
                'aboutSection',
                'servicesPreviewSection',
                'ctaSection'
            ],
            services: [
                'cabecalhoServicos',
                'navegacaoInterna',
                'secaoContabilidade',
                'secaoConsultoriaFiscal',
                'secaoConsultoriaFinanceira',
                'secaoAuditoria',
                'secaoGestaoEmpresarial',
                'secaoRecursosHumanos',
                'secaoServicosAdministrativos',
                'tabelaPrecos'
            ],
            about: [
                'cabecalhoSobreNos',
                'nossaHistoria',
                'missaoVisaoValores',
                'porqueEscolherNos',
                'nossaEquipa',
                'certificacoesReconhecimentos',
                'chamadaFinalSobreNos'
            ],
            contact: [
                'contactHero',
                'contactInfo',
                'contactLocation',
                'contactMethods',
                'contactCta'
            ]
        };
        
        this.init();
    }

    async init() {
        try {
            // Criar loading overlay se não existir
            this.createLoadingOverlay();
            
            // NÃO mostrar loading no início - removido: this.showLoading('Carregando aplicação...');
            
            // Carregar componentes essenciais
            await this.loadComponent('navbar', 'navbar-container');
            await this.loadComponent('footer', 'footer-container');
            
            // Verificar URL atual e carregar página correspondente (SEM loading)
            await this.loadPageFromURL();
            
            // Configurar navegação
            this.setupNavigation();
            
            // Configurar efeitos da navbar (SEMPRE FIXO)
            this.setupFixedNavbar();
            
            // Configurar gerenciamento de URL
            this.setupURLManagement();
            
            // Esconder loading screen inicial
            this.hideLoadingScreen();
            
            // NÃO esconder loading overlay pois não foi mostrado - removido: this.hideLoading();
            
        } catch (error) {
            console.error('Erro ao inicializar a aplicação:', error);
            this.showError('Erro ao carregar a aplicação. Tente atualizar a página.');
        }
    }

    // ✅ NOVO: Criar overlay de loading
    createLoadingOverlay() {
        if (!document.getElementById('loading-overlay')) {
            const loadingHTML = `
                <div id="loading-overlay" class="loading-overlay" style="display: none;">
                    <div class="loading-content">
                        <div class="loading-spinner">
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                        </div>
                        <div class="loading-text">Carregando...</div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', loadingHTML);
            
            // Adicionar estilos CSS
            this.addLoadingStyles();
        }
    }

    // ✅ NOVO: Adicionar estilos do loading
    addLoadingStyles() {
        if (!document.getElementById('loading-styles')) {
            const styles = `
                <style id="loading-styles">
                :root {
                    --primary-color: #4a90a4;
                    --info-color: #17a2b8;
                }
                
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, var(--primary-color), var(--info-color));
                    backdrop-filter: blur(10px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }

                .loading-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }

                .loading-content {
                    text-align: center;
                    padding: 2rem;
                }

                .loading-spinner {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    margin-bottom: 1rem;
                }

                .spinner-ring {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 3px solid transparent;
                    border-top: 3px solid rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    animation: spin 1.2s linear infinite;
                }

                .spinner-ring:nth-child(2) {
                    animation-delay: -0.4s;
                    border-top-color: rgba(255, 255, 255, 0.6);
                }

                .spinner-ring:nth-child(3) {
                    animation-delay: -0.8s;
                    border-top-color: rgba(255, 255, 255, 0.4);
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-text {
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: white;
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }

                /* Navbar sempre fixo */
                .navbar-custom {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    z-index: 1050 !important;
                    transform: none !important;
                    transition: none !important;
                }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // ✅ NOVO: Mostrar loading
    showLoading(message = 'Carregando...') {
        if (this.isLoading) return; // Evitar múltiplas chamadas
        
        this.isLoading = true;
        const overlay = document.getElementById('loading-overlay');
        const text = overlay?.querySelector('.loading-text');
        
        if (overlay) {
            if (text) text.textContent = message;
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('show'), 10);
        }
    }

    // ✅ NOVO: Esconder loading
    hideLoading() {
        this.isLoading = false;
        const overlay = document.getElementById('loading-overlay');
        
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    // ✅ NOVO: Setup navbar sempre fixo
    setupFixedNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            // Forçar navbar sempre fixo
            navbar.style.position = 'fixed';
            navbar.style.top = '0';
            navbar.style.left = '0';
            navbar.style.right = '0';
            navbar.style.width = '100%';
            navbar.style.zIndex = '1050';
            navbar.style.transform = 'none';
            navbar.style.transition = 'none';
            
            // Remover qualquer listener de scroll que esconda a navbar
            window.addEventListener('scroll', () => {
                if (navbar) {
                    navbar.style.transform = 'none';
                    navbar.style.position = 'fixed';
                    
                    // Apenas adicionar/remover classe scrolled para efeitos visuais
                    if (window.pageYOffset > 100) {
                        navbar.classList.add('navbar-scrolled');
                    } else {
                        navbar.classList.remove('navbar-scrolled');
                    }
                }
            });
        }
    }

    // ✅ NOVO: Gerenciamento de URL
    setupURLManagement() {
        // Listener para mudanças na URL (botão voltar/avançar)
        window.addEventListener('popstate', (event) => {
            const state = event.state;
            if (state && state.page) {
                if (state.section) {
                    this.loadPageAndScrollToSection(state.page, state.section, false, true); // COM loading
                } else {
                    this.loadPage(state.page, false, true); // COM loading
                }
            } else {
                this.loadPageFromURL(false, true); // COM loading
            }
        });
    }

    // ✅ ATUALIZADO: Carregar página baseada na URL atual (SEM loading no início)
    async loadPageFromURL(updateHistory = false, showLoading = false) {
        const hash = window.location.hash.slice(1); // Remove o #
        const [page, section] = hash.split('/');
        
        if (page && this.isValidPage(page)) {
            if (section) {
                await this.loadPageAndScrollToSection(page, section, updateHistory, showLoading);
            } else {
                await this.loadPage(page, updateHistory, showLoading);
            }
        } else {
            await this.loadPage('home', updateHistory, showLoading);
        }
    }

    // ✅ NOVO: Verificar se página é válida
    isValidPage(pageName) {
        return this.components[pageName] || this.modularPages[pageName];
    }

    // ✅ NOVO: Atualizar URL
    updateURL(page, section = null) {
        let hash = `#${page}`;
        if (section) {
            hash += `/${section}`;
        }
        
        const state = { page, section };
        history.pushState(state, '', hash);
        
        this.currentPage = page;
        this.currentSection = section;
    }

    async loadComponent(componentName, containerId) {
        try {
            const response = await fetch(this.components[componentName]);
            if (!response.ok) {
                throw new Error(`Erro ao carregar ${componentName}: ${response.status}`);
            }
            
            const html = await response.text();
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = html;
                container.classList.add('loaded');
                
                // Aplicar animações
                this.applyAnimations(container);
            }
        } catch (error) {
            console.error(`Erro ao carregar componente ${componentName}:`, error);
            // Fallback para componente não encontrado
            this.createFallbackComponent(componentName, containerId);
        }
    }

    // ✅ ATUALIZADO: LoadPage com loading opcional
    async loadPage(pageName, updateHistory = true, showLoadingOverlay = true) {
        try {
            // Mostrar loading apenas se solicitado (não no carregamento inicial)
            if (showLoadingOverlay) {
                this.showLoading(`Carregando ${pageName}...`);
            }
            
            const mainContainer = document.getElementById('main-content');
            
            if (mainContainer) {
                // Verificar se é uma página modular
                if (this.modularPages[pageName]) {
                    await this.loadModularPage(pageName);
                } else {
                    await this.loadSinglePage(pageName);
                }
                
                // Atualizar URL se necessário
                if (updateHistory) {
                    this.updateURL(pageName);
                }
                
                mainContainer.classList.add('loaded');
                
                // Aplicar animações
                this.applyAnimations(mainContainer);
                
                // Atualizar navbar ativa
                this.updateActiveNavLink(pageName);
                
                // Scroll to top apenas se não vier de uma navegação com seção
                if (!this.currentSection) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            
            // Esconder loading apenas se foi mostrado
            if (showLoadingOverlay) {
                this.hideLoading();
            }
            
        } catch (error) {
            console.error(`Erro ao carregar página ${pageName}:`, error);
            if (showLoadingOverlay) {
                this.hideLoading();
            }
            this.showError(`Erro ao carregar a página ${pageName}`);
        }
    }

    async loadModularPage(pageName) {
        const mainContainer = document.getElementById('main-content');
        const sections = this.modularPages[pageName];
        
        // Limpar container
        mainContainer.innerHTML = '';
        
        // Carregar cada seção sequencialmente
        for (const sectionName of sections) {
            await this.loadSectionToContainer(sectionName, 'main-content');
        }
    }

    async loadSinglePage(pageName) {
        const response = await fetch(this.components[pageName]);
        if (!response.ok) {
            throw new Error(`Erro ao carregar página ${pageName}: ${response.status}`);
        }
        
        const html = await response.text();
        const mainContainer = document.getElementById('main-content');
        mainContainer.innerHTML = html;
    }

    async loadSectionToContainer(sectionName, containerId) {
        try {
            const response = await fetch(this.components[sectionName]);
            if (!response.ok) {
                throw new Error(`Erro ao carregar seção ${sectionName}: ${response.status}`);
            }
            
            const html = await response.text();
            const container = document.getElementById(containerId);
            
            if (container) {
                // Criar wrapper div para a seção
                const sectionWrapper = document.createElement('div');
                sectionWrapper.className = `section-wrapper ${sectionName}-wrapper`;
                sectionWrapper.innerHTML = html;
                
                // Adicionar ao container
                container.appendChild(sectionWrapper);
                
                console.log(`Seção ${sectionName} carregada com sucesso`);
            }
            
        } catch (error) {
            console.error(`Erro ao carregar seção ${sectionName}:`, error);
            this.createFallbackSection(sectionName, containerId);
        }
    }

    createFallbackSection(sectionName, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const fallbackHtml = `
                <section class="py-5 bg-light">
                    <div class="container text-center">
                        <div class="alert alert-warning" role="alert">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Erro:</strong> Não foi possível carregar a seção "${sectionName}".
                            <br><small>Verifique se o arquivo existe no caminho correto.</small>
                        </div>
                    </div>
                </section>
            `;
            
            const sectionWrapper = document.createElement('div');
            sectionWrapper.className = `section-wrapper ${sectionName}-wrapper error`;
            sectionWrapper.innerHTML = fallbackHtml;
            container.appendChild(sectionWrapper);
        }
    }

    // ✅ ATUALIZADO: Com loading apenas quando navegando
    async loadPageAndScrollToSection(pageName, sectionId, updateHistory = true, showLoadingOverlay = true) {
        try {
            // Mostrar loading apenas se solicitado (não no carregamento inicial)
            if (showLoadingOverlay) {
                this.showLoading(`Carregando ${pageName}...`);
            }
            
            // Primeiro carrega a página
            await this.loadPage(pageName, false, false); // Não mostrar loading duplicado
            
            // Atualizar URL com seção
            if (updateHistory) {
                this.updateURL(pageName, sectionId);
            }
            
            // Espera um pouco para a página carregar completamente
            setTimeout(() => {
                const targetElement = document.getElementById(sectionId);
                if (targetElement) {
                    // Rola suavemente para a seção
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Atualizar link ativo na navegação interna (se existir)
                    const serviceNavLinks = document.querySelectorAll('.service-nav-link');
                    if (serviceNavLinks.length > 0) {
                        serviceNavLinks.forEach(link => link.classList.remove('active'));
                        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                    }
                } else {
                    console.warn(`Seção "${sectionId}" não encontrada na página "${pageName}"`);
                }
                
                // Esconder loading apenas se foi mostrado
                if (showLoadingOverlay) {
                    this.hideLoading();
                }
            }, 700);
            
        } catch (error) {
            console.error(`Erro ao carregar página ${pageName} e rolar para seção ${sectionId}:`, error);
            if (showLoadingOverlay) {
                this.hideLoading();
            }
            this.showError(`Erro ao navegar para ${pageName}`);
        }
    }

    setupNavigation() {
        // Delegar eventos para links de navegação
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const pageName = link.getAttribute('data-page');
                const serviceSection = link.getAttribute('data-service');
                
                // Se tem data-service, vai para página e depois para seção
                if (serviceSection) {
                    this.loadPageAndScrollToSection(pageName, serviceSection);
                } else {
                    this.loadPage(pageName);
                }
                
                // Fechar menu mobile se estiver aberto
                const navbarToggler = document.querySelector('.navbar-collapse');
                if (navbarToggler && navbarToggler.classList.contains('show')) {
                    const toggleButton = document.querySelector('.navbar-toggler');
                    if (toggleButton) {
                        toggleButton.click();
                    }
                }
            }
        });

        // Configurar botões de ação
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="contact"]')) {
                e.preventDefault();
                this.loadPage('contact');
            }
        });
    }

    updateActiveNavLink(pageName) {
        // Remover classe active de todos os links
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Adicionar classe active ao link atual
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    applyAnimations(container) {
        // Aplicar animações aos elementos
        const elements = container.querySelectorAll('[data-animate]');
        elements.forEach((element, index) => {
            const animationType = element.getAttribute('data-animate');
            const delay = element.getAttribute('data-delay') || index * 100;
            
            // Reset classes de animação
            element.classList.remove('fade-in', 'slide-in-left', 'slide-in-right');
            
            setTimeout(() => {
                element.classList.add(animationType);
            }, parseInt(delay));
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hide');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000);
        }
    }

    // Método para mostrar erros
    showError(message) {
        const toastHtml = `
            <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-white">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong class="me-auto">Erro</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            </div>
        `; 
        document.body.insertAdjacentHTML('beforeend', toastHtml);
        
        // Auto-remove toast após 5 segundos
        setTimeout(() => {
            const toast = document.querySelector('.toast');
            if (toast) {
                toast.remove();
            }
        }, 5000);
    }

    createFallbackComponent(componentName, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            let fallbackHtml = '';
            
            switch(componentName) {
                case 'navbar':
                    fallbackHtml = `
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <div class="container">
                                <a class="navbar-brand fw-bold text-gradient" href="#">
                                    <i class="fas fa-chart-line me-2"></i>
                                    Horizon Global Consulting
                                </a>
                            </div>
                        </nav>
                    `;
                    break;
                case 'footer':
                    fallbackHtml = `
                        <footer class="bg-dark text-white py-4">
                            <div class="container text-center">
                                <p>&copy; 2025 Horizon Global Consulting. Todos os direitos reservados.</p>
                            </div>
                        </footer>
                    `;
                    break;
                default:
                    fallbackHtml = `
                        <div class="alert alert-warning text-center" role="alert">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Componente "${componentName}" não encontrado.
                        </div>
                    `;
            }
            container.innerHTML = fallbackHtml;
            container.classList.add('loaded');
        }
    }

    // Método público para navegação programática
    navigateTo(pageName) {
        if (this.components[pageName] || this.modularPages[pageName]) {
            this.loadPage(pageName);
        } else {
            console.warn(`Página "${pageName}" não encontrada`);
            this.showError(`Página "${pageName}" não encontrada`);
        }
    }

    // Método para obter página atual
    getCurrentPage() {
        return this.currentPage;
    }

    // Método para recarregar página atual
    reloadCurrentPage() {
        this.loadPage(this.currentPage);
    }

    // Método para adicionar nova seção dinamicamente
    addSectionToPage(pageName, sectionName, sectionPath) {
        if (!this.modularPages[pageName]) {
            this.modularPages[pageName] = [];
        }
        
        this.modularPages[pageName].push(sectionName);
        this.components[sectionName] = sectionPath;
    }

    // Parte de debug
    getDebugInfo() {
        return {
            currentPage: this.currentPage,
            currentSection: this.currentSection,
            isLoading: this.isLoading,
            components: this.components,
            modularPages: this.modularPages
        };
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.horizonApp = new HorizonApp();
    
    // Debug mode (remover em produção)
    if (window.location.search.includes('debug=true')) {
        console.log('Debug Info:', window.horizonApp.getDebugInfo());
    }
});

// Exportar para uso global
window.HorizonApp = HorizonApp;