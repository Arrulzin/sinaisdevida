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
        
        // Configurações
        this.apiKey = 'SUA_CHAVE_DE_API_HANDTALK'; // Substitua pela sua chave
        this.customSigns = {
            'sinais de vida': {
                animation: this.playCustomSign.bind(this, 'sinais-de-vida')
            },
            'libras': {
                animation: this.playCustomSign.bind(this, 'libras')
            }
        };
        
        // Inicialização
        this.initEventListeners();
        this.checkWebGLSupport();
        this.setupMobileMenu();
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
    }
    
    setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navbar = document.querySelector('.navbar ul');
        
        menuBtn.addEventListener('click', () => {
            navbar.style.display = navbar.style.display === 'flex' ? 'none' : 'flex';
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navbar.style.display = 'none';
                }
            });
        });
    }
    
    checkWebGLSupport() {
        // Verifica suporte a WebGL para o avatar 3D
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                console.warn('WebGL não suportado. O avatar 3D pode não funcionar corretamente.');
            }
        } catch (e) {
            console.error('Erro ao verificar WebGL:', e);
        }
    }
    
    async handleTranslation() {
        const text = this.textArea.value.trim();
        if (!text) {
            this.showAlert('Por favor, digite algum texto para traduzir.');
            return;
        }
        
        // Verifica se é um sinal customizado
        const lowerText = text.toLowerCase();
        if (this.customSigns[lowerText]) {
            this.showLoading();
            await this.customSigns[lowerText].animation();
            this.hideLoading();
            return;
        }
        
        // Tenta a API do Hand Talk
        try {
            this.showLoading();
            const translation = await this.translateWithHandTalk(text);
            
            if (translation.success) {
                this.displayTranslation(translation);
            } else {
                this.useFallbackTranslation(text);
            }
        } catch (error) {
            console.error('Erro na tradução:', error);
            this.useFallbackTranslation(text);
        } finally {
            this.hideLoading();
        }
    }
    
    async translateWithHandTalk(text) {
        // Simulação da chamada à API do Hand Talk
        // Em produção, substitua por uma chamada real à API
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simula uma resposta bem-sucedida da API
                if (Math.random() > 0.1) { // 90% de chance de sucesso para demonstração
                    resolve({
                        success: true,
                        videoUrl: this.generateMockVideo(text),
                        duration: Math.max(2, text.length / 10),
                        source: 'handtalk'
                    });
                } else {
                    resolve({ success: false });
                }
            }, 1500);
        });
    }
    
    generateMockVideo(text) {
        // Em produção, isso seria substituído pelo URL real do vídeo da API
        return `data:video/mp4;base64,VIDEO_SIMULADO_PARA_${encodeURIComponent(text)}`;
    }
    
    displayTranslation(translation) {
        if (translation.videoUrl) {
            // Mostra o vídeo do avatar
            this.avatarVideo.src = translation.videoUrl;
            this.avatarVideo.style.display = 'block';
            this.avatarCanvas.style.display = 'none';
            this.avatarVideo.play();
        } else {
            // Mostra o avatar 3D como fallback
            this.animateAvatar3D(translation.text);
        }
    }
    
    async playCustomSign(signName) {
        // Simula a animação de um sinal customizado
        this.avatarVideo.style.display = 'none';
        this.avatarCanvas.style.display = 'block';
        
        const ctx = this.avatarCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.avatarCanvas.width, this.avatarCanvas.height);
        
        // Desenha um avatar simples (em produção, usaria WebGL/Three.js)
        ctx.fillStyle = '#2EC4B6';
        ctx.beginPath();
        ctx.arc(200, 150, 80, 0, Math.PI * 2); // Cabeça
        ctx.fill();
        
        // Animação simples dos braços
        this.animateArms(ctx, signName);
        
        return {
            success: true,
            source: 'custom',
            duration: 2.5
        };
    }
    
    animateArms(ctx, signName) {
        // Animação básica dos braços para sinais customizados
        let frame = 0;
        const maxFrames = 30;
        
        const animation = () => {
            ctx.fillStyle = '#2EC4B6';
            
            // Limpa a área dos braços
            ctx.clearRect(0, 150, 400, 250);
            
            // Braço esquerdo
            ctx.save();
            ctx.translate(120, 180);
            ctx.rotate(Math.sin(frame * 0.2) * 0.5);
            ctx.fillRect(0, 0, 20, 100);
            ctx.restore();
            
            // Braço direito
            ctx.save();
            ctx.translate(280, 180);
            ctx.rotate(Math.sin(frame * 0.2 + Math.PI) * 0.5);
            ctx.fillRect(0, 0, 20, 100);
            ctx.restore();
            
            // Mãos
            ctx.fillStyle = '#FF9F1C';
            ctx.beginPath();
            ctx.arc(130 + Math.sin(frame * 0.3) * 10, 280, 15, 0, Math.PI * 2);
            ctx.arc(270 + Math.sin(frame * 0.3 + Math.PI) * 10, 280, 15, 0, Math.PI * 2);
            ctx.fill();
            
            frame++;
            if (frame < maxFrames) {
                requestAnimationFrame(animation);
            }
        };
        
        animation();
    }
    
    useFallbackTranslation(text) {
        this.showAlert('Não foi possível acessar o serviço de tradução. Usando solução alternativa...');
        this.animateAvatar3D(text);
    }
    
    animateAvatar3D(text) {
        // Em produção, isso seria substituído por uma animação 3D real
        this.avatarVideo.style.display = 'none';
        this.avatarCanvas.style.display = 'block';
        
        const ctx = this.avatarCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.avatarCanvas.width, this.avatarCanvas.height);
        
        // Desenha um avatar simples
        ctx.fillStyle = '#2EC4B6';
        ctx.beginPath();
        ctx.arc(200, 150, 80, 0, Math.PI * 2); // Cabeça
        ctx.fill();
        
        // Exibe o texto (simulando o sinal)
        ctx.fillStyle = '#011627';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Traduzindo: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`, 200, 350);
    }
    
    startVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'pt-BR';
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                this.voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Ouvindo...';
                this.voiceBtn.style.backgroundColor = '#E71D36';
                this.textArea.placeholder = 'Ouvindo...';
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.textArea.value = transcript;
                this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Falar';
                this.voiceBtn.style.backgroundColor = '';
                this.textArea.placeholder = 'Digite aqui o texto que deseja traduzir para Libras...';
                
                // Traduz automaticamente se o usuário falou algo
                if (transcript.trim()) {
                    this.handleTranslation();
                }
            };
            
            recognition.onerror = (event) => {
                console.error('Erro no reconhecimento de voz:', event.error);
                this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Falar';
                this.voiceBtn.style.backgroundColor = '';
                this.textArea.placeholder = 'Digite aqui o texto que deseja traduzir para Libras...';
                
                if (event.error === 'not-allowed') {
                    this.showAlert('Permissão para microfone não concedida.');
                } else {
                    this.showAlert('Erro no reconhecimento de voz. Tente novamente.');
                }
            };
            
            recognition.start();
        } else {
            this.showAlert('Seu navegador não suporta reconhecimento de voz. Tente o Chrome ou Edge.');
        }
    }
    
    clearTranslation() {
        this.textArea.value = '';
        this.avatarVideo.style.display = 'none';
        this.avatarCanvas.style.display = 'none';
        this.avatarVideo.src = '';
        
        const ctx = this.avatarCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.avatarCanvas.width, this.avatarCanvas.height);
    }
    
    showLoading() {
        this.loadingAnimation.style.display = 'flex';
        document.querySelector('.translator-container').classList.add('translating');
    }
    
    hideLoading() {
        this.loadingAnimation.style.display = 'none';
        document.querySelector('.translator-container').classList.remove('translating');
    }
    
    showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert-message';
        alert.textContent = message;
        
        alert.style.position = 'fixed';
        alert.style.bottom = '20px';
        alert.style.left = '50%';
        alert.style.transform = 'translateX(-50%)';
        alert.style.backgroundColor = 'var(--dark)';
        alert.style.color = 'white';
        alert.style.padding = '1rem 2rem';
        alert.style.borderRadius = '8px';
        alert.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        alert.style.zIndex = '1000';
        alert.style.animation = 'fadeIn 0.3s ease';
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 300);
        }, 3000);
    }
    
    // Efeito de digitação no título
    typeWriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typing = setInterval(() => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 100);
    }
    
    // Scroll suave para links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Inicialização da aplicação quando o DOM estiver pronto
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
            }
        }, 500);
    }
});