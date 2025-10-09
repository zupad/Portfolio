// ================================
// SSH TERMINAL LOADING ANIMATION
// ================================

class SSHLoader {
    constructor() {
        this.terminalContent = document.getElementById('terminal-content');
        this.commands = [
            { text: 'ssh user@portfolio.dev -p 2222', type: 'input', delay: 50 },
            { text: 'Connecting to portfolio.dev (192.168.1.100)...', type: 'output', delay: 75 },
            { text: 'Connection established.', type: 'success', delay: 63 },
            { text: 'Password:', type: 'prompt', delay: 200 },
            { text: '••••••••••••', type: 'input', delay: 800 },
            { text: 'Authentication successful.', type: 'success', delay: 300 },
            { text: 'Loading development environment...', type: 'output', delay: 125 },
            { text: '[▓▓▓▓▓▓▓▓▓▓] 100% Complete', type: 'success', delay: 450 },
            { text: 'Initializing portfolio systems...', type: 'output', delay: 100 },
            { text: 'Python environment ready.', type: 'success', delay: 75 },
            { text: 'Database connections verified.', type: 'success', delay: 75 },
            { text: 'Loading project portfolio...', type: 'output', delay: 100 },
            { text: 'Welcome to My Portfolio', type: 'success', delay: 100 },
            { text: 'Access granted. Redirecting...', type: 'output', delay: 150 }
        ];
        this.currentCommand = 0;
        this.start();
    }

    async start() {
        for (const command of this.commands) {
            await this.typeCommand(command);
            await this.delay(command.delay);
        }
        
        // Hide loader and show main website
        setTimeout(() => {
            document.getElementById('ssh-loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('ssh-loader').style.display = 'none';
                document.getElementById('main-website').style.opacity = '1';
                this.initializeMainSite();
            }, 150);
        }, 250);
    }

    async typeCommand(command) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (command.type === 'input') {
            line.innerHTML = '<span class="prompt">user@portfolio:~$ </span><span class="input-text"></span><span class="cursor"> </span>';
            this.terminalContent.appendChild(line);
            await this.typeText(line.querySelector('.input-text'), command.text, 12);
        } else {
            line.className = `terminal-line ${command.type}`;
            this.terminalContent.appendChild(line);
            await this.typeText(line, command.text, 8);
        }
        
        // Auto scroll to bottom
        this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
    }

    async typeText(element, text, speed) {
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.delay(speed);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initializeMainSite() {
        // Initialize matrix effect only
        new MatrixRain();
        
        // Skip 3D elements - using only Matrix rain
        // new ThreeJSScene();
        
        // Initialize scroll animations
        new ScrollAnimations();
    }
}

// ================================
// MATRIX RAIN EFFECT
// ================================

class MatrixRain {
    constructor() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.canvas = document.getElementById('matrix-canvas');
        if (!this.canvas) {
            console.error('Matrix canvas not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 20;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;
        
        this.setupCanvas();
        this.createDrops();
        this.startAnimation();
        
        window.addEventListener('resize', () => {
            this.setupCanvas();
            // Update existing drops to fit new canvas size
            this.drops.forEach(drop => {
                if (drop.x > this.canvas.width) {
                    drop.x = Math.random() * this.canvas.width;
                }
            });
            // Add or remove drops based on new canvas size
            const targetDrops = Math.floor(this.columns / 4);
            while (this.drops.length < targetDrops) {
                this.drops.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * -500 - 50,
                    speed: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.6 + 0.2,
                    drift: (Math.random() - 0.5) * 0.3
                });
            }
            while (this.drops.length > targetDrops) {
                this.drops.pop();
            }
        });
        
        console.log('Matrix Rain initialized successfully');
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        
        // Set initial background to prevent flashing
        this.ctx.fillStyle = '#000005';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createDrops() {
        this.drops = [];
        // Create fewer, completely random positioned drops
        const numDrops = Math.floor(this.columns / 4); // Reduce density
        for (let i = 0; i < numDrops; i++) {
            this.drops.push({
                x: Math.random() * this.canvas.width, // Random X position
                y: Math.random() * -500 - 50, // Start higher up
                speed: Math.random() * 2 + 0.5, // Variable speeds
                opacity: Math.random() * 0.6 + 0.2, // Higher opacity range
                drift: (Math.random() - 0.5) * 0.3 // Slight horizontal drift
            });
        }
    }

    getRandomChar() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }

    draw() {
        // Much stronger fade to prevent character burn-in
        this.ctx.fillStyle = 'rgba(0, 0, 5, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];
            
            // Generate random character
            const char = this.getRandomChar();
            
            // More visible blue colors with variation
            const hue = 220 + (Math.sin(drop.x * 0.01) * 20); // Vary based on position
            const saturation = 75; // Higher saturation
            const lightness = 35 + (drop.opacity * 30); // Brighter
            
            this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${drop.opacity})`;
            
            // No glow effects for subtlety
            this.ctx.shadowBlur = 0;
            
            this.ctx.fillText(char, drop.x, drop.y);

            // Move drop down and apply horizontal drift
            drop.y += drop.speed;
            drop.x += drop.drift;

            // Keep drops within screen bounds horizontally
            if (drop.x < 0 || drop.x > this.canvas.width) {
                drop.drift *= -0.8; // Bounce back with some damping
            }

            // Reset drop when it goes off screen
            if (drop.y > this.canvas.height + 50) {
                drop.x = Math.random() * this.canvas.width; // New random X position
                drop.y = Math.random() * -500 - 50; // Start higher up
                drop.speed = Math.random() * 2 + 0.5; // New random speed
                drop.opacity = Math.random() * 0.6 + 0.2; // New opacity
                drop.drift = (Math.random() - 0.5) * 0.3; // New drift
            }

            // Occasional parameter changes for more randomness
            if (Math.random() < 0.002) {
                drop.speed = Math.random() * 2 + 0.5;
                drop.drift += (Math.random() - 0.5) * 0.1;
            }
        }
    }

    startAnimation() {
        console.log('Starting Matrix Rain animation...');
        let lastFrameTime = 0;
        const targetFPS = 60;
        const frameInterval = 1000 / targetFPS;
        
        const animate = (currentTime) => {
            if (currentTime - lastFrameTime >= frameInterval) {
                this.draw();
                lastFrameTime = currentTime;
            }
            this.animationId = requestAnimationFrame(animate);
        };
        animate(0);
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ================================
// THREE.JS 3D SCENE
// ================================

class ThreeJSScene {
    constructor() {
        this.container = document.getElementById('three-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.mouseX = 0;
        this.mouseY = 0;
        this.cubes = [];
        this.skillNodes = [];
        
        this.init();
        this.createObjects();
        this.setupInteractions();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        // Enhanced lighting
        const ambientLight = new THREE.AmbientLight(0x004444, 0.3);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        this.camera.position.z = 25;
    }

    setupInteractions() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    createObjects() {
        // Enhanced floating particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            // Cyberpunk color palette
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.7);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
        
        // Multiple rotating wireframe cubes
        for (let i = 0; i < 6; i++) {
            const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
            const edges = new THREE.EdgesGeometry(cubeGeometry);
            const cubeMaterial = new THREE.LineBasicMaterial({
                color: i % 2 === 0 ? 0x00ffff : 0x00ff00,
                transparent: true,
                opacity: 0.6
            });
            
            const cube = new THREE.LineSegments(edges, cubeMaterial);
            cube.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );
            
            cube.userData = {
                rotationSpeed: {
                    x: Math.random() * 0.02,
                    y: Math.random() * 0.02,
                    z: Math.random() * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005
            };
            
            this.cubes.push(cube);
            this.scene.add(cube);
        }

        // Security shield
        const shieldGeometry = new THREE.RingGeometry(3, 5, 16, 1);
        const shieldMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffaa,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        this.securityShield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        this.securityShield.position.set(0, 0, -10);
        this.securityShield.userData = { pulsePhase: 0 };
        this.scene.add(this.securityShield);

        // Skill nodes
        const skills = ['JavaScript', 'Python', 'Security', 'React', 'Node.js'];
        skills.forEach((skill, index) => {
            const nodeGeometry = new THREE.SphereGeometry(1, 16, 16);
            const nodeMaterial = new THREE.MeshPhongMaterial({
                color: 0x0088ff,
                transparent: true,
                opacity: 0.7,
                emissive: 0x002244
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            const angle = (index / skills.length) * Math.PI * 2;
            node.position.set(
                Math.cos(angle) * 12,
                Math.sin(angle) * 12,
                -5
            );
            
            node.userData = {
                skill: skill,
                pulsePhase: index * 0.5,
                orbitSpeed: 0.5
            };
            
            this.skillNodes.push(node);
            this.scene.add(node);
        });
    }

    animate() {
        const time = Date.now() * 0.001;

        // Animate particles with mouse interaction
        if (this.particles) {
            this.particles.rotation.y += 0.002;
            this.particles.rotation.x += 0.001;
        }
        
        // Animate cubes
        this.cubes.forEach(cube => {
            cube.rotation.x += cube.userData.rotationSpeed.x;
            cube.rotation.y += cube.userData.rotationSpeed.y;
            cube.rotation.z += cube.userData.rotationSpeed.z;
            cube.position.y += Math.sin(time + cube.position.x) * cube.userData.floatSpeed;
        });

        // Animate security shield
        if (this.securityShield) {
            this.securityShield.rotation.z += 0.005;
            this.securityShield.userData.pulsePhase += 0.05;
            this.securityShield.material.opacity = 0.3 + Math.sin(this.securityShield.userData.pulsePhase) * 0.2;
        }

        // Animate skill nodes
        this.skillNodes.forEach(node => {
            node.userData.pulsePhase += 0.03;
            const scale = 1 + Math.sin(node.userData.pulsePhase) * 0.2;
            node.scale.setScalar(scale);
            
            // Orbit around center
            const angle = time * node.userData.orbitSpeed + node.userData.pulsePhase;
            node.position.x = Math.cos(angle) * 12;
            node.position.y = Math.sin(angle) * 12;
        });

        // Mouse interaction with camera
        this.camera.position.x += (this.mouseX * 3 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouseY * 3 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ================================
// SCROLL ANIMATIONS
// ================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        // Observe sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });

        // Smooth scrolling for nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// ================================
// ENHANCED UTILITIES & EFFECTS
// ================================

// Sound simulation class
class SoundSimulator {
    static playKeyboardSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Fallback for browsers without Web Audio API
            console.log('Audio not supported');
        }
    }

    static playHoverSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

// Particle explosion effect
function createParticleExplosion(x, y, container) {
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: #00ffff;
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
        `;
        
        container.appendChild(particle);
        
        const angle = (i / 15) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let px = x, py = y, opacity = 1;
        
        function animate() {
            px += vx * 0.02;
            py += vy * 0.02;
            opacity -= 0.03;
            
            particle.style.left = px + 'px';
            particle.style.top = py + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                container.removeChild(particle);
            }
        }
        
        setTimeout(() => animate(), i * 5);
    }
}

// ================================
// INITIALIZE APPLICATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Matrix rain immediately
    console.log('Initializing Matrix Rain...');
    new MatrixRain();
    
    // Initialize main components
    new SSHLoader();

    // Enhanced interactions
    document.querySelectorAll('.skill-cube, .education-card, .project-card, .security-badge').forEach(element => {
        element.addEventListener('mouseenter', () => {
            SoundSimulator.playHoverSound();
        });

        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            createParticleExplosion(x, y, document.body);
        });
    });

    // Enhanced scroll effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Staggered child animations
                const children = entry.target.querySelectorAll('.skill-cube, .education-card, .project-card, .security-badge');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0) scale(1)';
                    }, index * 80);
                });
            }
        });
    }, { threshold: 0.1 });

    // Apply scroll effects to sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });

    // Enhanced navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Visual feedback
                link.style.color = '#00ffff';
                setTimeout(() => {
                    link.style.color = '';
                }, 300);
            }
        });
    });

    // Performance monitoring
    let frameCount = 0;
    let lastTime = Date.now();

    function monitorPerformance() {
        frameCount++;
        const currentTime = Date.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            // Reduce matrix effects if performance is poor
            if (fps < 30) {
                document.querySelectorAll('#matrix-canvas').forEach(el => {
                    el.style.opacity = '0.5';
                });
            }
        }
        
        requestAnimationFrame(monitorPerformance);
    }
    monitorPerformance();

    // Console branding
    console.log('%c🔒 CYBERSECURITY PORTFOLIO INITIALIZED 🔒', 'color: #00ffff; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #00ffff;');
    console.log('%c⚡ System Status: SECURE & OPERATIONAL', 'color: #00ff00; font-size: 14px;');
    console.log('%c🛡️ All security protocols activated', 'color: #ffffff; font-size: 12px;');
    console.log('%c📡 Matrix rain active | 3D environment loaded', 'color: #888; font-size: 10px;');
});