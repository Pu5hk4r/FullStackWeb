let scene, camera, renderer, particles = [], darkMatter = [], plasmaParticles = [];
let audioContext;
const TUBE_RADIUS = 20;

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playCollisionSound() {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator1.frequency.setValueAtTime(440 + Math.random() * 220, audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(220 + Math.random() * 110, audioContext.currentTime);
    
    oscillator1.type = 'sine';
    oscillator2.type = 'square';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(audioContext.currentTime + 0.3);
    oscillator2.stop(audioContext.currentTime + 0.3);
}

function init() {
    initAudio();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const tubeGeometry = new THREE.TorusGeometry(TUBE_RADIUS, 2, 32, 100);
    const tubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 0, 50);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 50;

    initMatrix();
}

function initMatrix() {
    const matrix = document.getElementById('matrix');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    setInterval(() => {
        let str = '';
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 100; j++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            str += '\n';
        }
        matrix.textContent = str;
    }, 50);
}

function addParticle() {
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });
    
    const particle = new THREE.Mesh(geometry, material);
    particle.userData = {
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
        direction: Math.random() > 0.5 ? 1 : -1,
        phase: Math.random() * Math.PI * 2,
        energy: 100
    };
    
    particles.push(particle);
    scene.add(particle);
    updateParticleCount();
}

function addDarkMatter() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0x000066,
        transparent: true,
        opacity: 0.3
    });
    
    const dm = new THREE.Mesh(geometry, material);
    dm.position.set(
        (Math.random() - 0.5) * TUBE_RADIUS * 2,
        (Math.random() - 0.5) * TUBE_RADIUS * 2,
        (Math.random() - 0.5) * TUBE_RADIUS * 2
    );
    
    darkMatter.push(dm);
    scene.add(dm);
}

function createPlasmaExplosion(position) {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 1
        });
        
        const plasma = new THREE.Mesh(geometry, material);
        plasma.position.copy(position);
        
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5
        );
        
        plasma.userData = {
            velocity: velocity,
            lifetime: 100,
            maxLifetime: 100
        };
        
        plasmaParticles.push(plasma);
        scene.add(plasma);
    }
}

function updateParticles() {
    const speed = document.getElementById('speed').value / 50;
    const energy = document.getElementById('energy').value / 100;
    const power = document.getElementById('power').value / 100;

    particles.forEach((particle, index) => {
        particle.userData.angle += particle.userData.speed * speed * particle.userData.direction;
        
        particle.position.x = Math.cos(particle.userData.angle) * TUBE_RADIUS;
        particle.position.y = Math.sin(particle.userData.angle) * TUBE_RADIUS;
        particle.position.z = Math.sin(particle.userData.phase) * 2;
        
        particle.userData.phase += 0.01 * particle.userData.direction;

        for (let i = index + 1; i < particles.length; i++) {
            const other = particles[i];
            if (particle.position.distanceTo(other.position) < 0.6) {
                createPlasmaExplosion(particle.position);
                particle.userData.energy -= power * 10;
                other.userData.energy -= power * 10;
                playCollisionSound();
            }
        }

        if (particle.userData.energy <= 0) {
            scene.remove(particle);
            particles.splice(index, 1);
            updateParticleCount();
        }
    });

    plasmaParticles.forEach((plasma, index) => {
        plasma.position.add(plasma.userData.velocity);
        plasma.userData.lifetime--;
        plasma.material.opacity = plasma.userData.lifetime / plasma.userData.maxLifetime;
        
        if (plasma.userData.lifetime <= 0) {
            scene.remove(plasma);
            plasmaParticles.splice(index, 1);
        }
    });
}

function updateParticleCount() {
    document.getElementById('particleCount').textContent = particles.length;
}

function animate() {
    requestAnimationFrame(animate);
    updateParticles();
    renderer.render(scene, camera);
}

init();
animate();
