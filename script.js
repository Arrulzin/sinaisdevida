class SinaisDeVidaApp {
    constructor() {
        // Elementos da interface
        this.translateBtn = document.getElementById('translate-btn');
        this.voiceBtn = document.getElementById('voice-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.textArea = document.getElementById('text-to-translate');
        this.avatarVideo = document.getElementById('libras-avatar');
        this.avatarCanvas = document.getElementById('custom-avatar');
        this.loadingAnimation = document.getElementById('loading-animation');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navbar = document.querySelector('.navbar ul');
        
        // Inicialização
        this.initEventListeners();
        this.checkWebGLSupport();
        this.setupAria();
        this.typeWriterEffect();
        this.setupSmoothScrolling();
    }
    
    initEventListeners() {
        // Botão de tradução
        this.translateBtn.addEventListener('click', () => this.handleTranslation());
        
        // Botão de voz
        this.voiceBtn.addEventListener('click', () => this.startVoiceRecognition());
        
        // Botão de limpar
        this.clearBtn.addEventListener('click', () => this.clearTranslation());
        
        // Tecla Enter para traduzir
        this.textArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleTranslation();
            }
        });
        
        // Menu mobile
        this.mobileMenuBtn.addEventListener('click', () => {
            const expanded = this.navbar.style.display === 'flex';
            this.mobileMenuBtn.setAttribute('aria-expanded', !expanded);
            this.navbar.style.display = expanded ? 'none' : 'flex';
        });
        
        // Atualiza estado do botão de tradução
        this.textArea.addEventListener('input', () => {
            const hasText = this.textArea.value.trim().length > 0;
            this.translateBtn.setAttribute('aria-disabled', !hasText);
        });
    }
    
    setupAria() {
        // Configurações iniciais de acessibilidade
        this.avatarContainer = document.querySelector('.avatar-container');
        
        // Esconde elementos de loading inicialmente
        this.loadingAnimation.setAttribute('aria-hidden', 'true');
    }
    
    // ... (mantenha os outros métodos existentes até showLoading)
    
    showLoading() {
        this.loadingAnimation.style.display = 'flex';
        this.loadingAnimation.setAttribute('aria-hidden', 'false');
        this.loadingAnimation.setAttribute('aria-busy', 'true');
        this.avatarContainer.setAttribute('aria-busy', 'true');
        document.querySelector('.translator-container').classList.add('translating');
    }
    
    hideLoading() {
        this.loadingAnimation.style.display = 'none';
        this.loadingAnimation.setAttribute('aria-hidden', 'true');
        this.loadingAnimation.setAttribute('aria-busy', 'false');
        this.avatarContainer.setAttribute('aria-busy', 'false');
        document.querySelector('.translator-container').classList.remove('translating');
    }
    
    showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert-message';
        alert.textContent = message;
        alert.setAttribute('role', 'alert');
        alert.setAttribute('aria-live', 'assertive');
        
        // ... (restante do método de alerta existente)
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 300);
        }, 3000);
    }
    
    // ... (mantenha os métodos restantes existentes)
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    const app = new SinaisDeVidaApp();
    
    // Efeitos iniciais
    app.typeWriterEffect();
    app.setupSmoothScrolling();
    
    // Verifica se há hash na URL para scroll
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        }, 500);
    }
});