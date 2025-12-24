import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

class CarConfigurator {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.carModel = null;
        
        // Configuration options
        this.config = {
            colors: [
                { name: 'Candy White', color: 0xFFFFFF },
                { name: 'Starry Black', color: 0x1A1A1A },
                { name: 'Glaze Red', color: 0xCC0000 },
                { name: 'Aurora Silver', color: 0xC0C0C0 },
                { name: 'Dune Brown', color: 0x8B4513 },
                { name: 'Glacier Blue', color: 0x4682B4 }
            ],
            rimColors: [
                { name: 'Silver', color: 0xC0C0C0 },
                { name: 'Black', color: 0x111111 },
                { name: 'Gunmetal', color: 0x2C3539 },
                { name: 'Bronze', color: 0xCD7F32 }
            ],
            wheelTypes: ['Standard', 'Sport', 'Premium', 'Alloy'],
            currentColor: 0xFFFFFF,
            currentRimColor: 0xC0C0C0,
            currentWheelType: 'Standard'
        };
        
        this.init();
    }
    
    async init() {
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / 2 / (window.innerHeight),
            0.1,
            1000
        );
        this.camera.position.set(5, 3, 8);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
        
        // Setup lighting
        this.setupLighting();
        
        // Setup environment
        await this.setupEnvironment('studio');
        
        // Load car model (placeholder - you'll need an actual MG Hector 3D model)
        this.loadCarModel();
        
        // Setup controls UI
        this.setupUI();
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Hide loading text
        document.getElementById('loading').style.display = 'none';
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(10, 20, 15);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);
    }
    
    async setupEnvironment(environmentType) {
        // Clear existing environment
        const oldBg = this.scene.background;
        if (oldBg && oldBg.isTexture) oldBg.dispose();
        
        switch(environmentType) {
            case 'studio':
                this.scene.background = new THREE.Color(0x1a1a2e);
                break;
            case 'outdoor':
                // Add simple outdoor background
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.png', (texture) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    this.scene.background = texture;
                    this.scene.environment = texture;
                });
                break;
            case 'night':
                this.scene.background = new THREE.Color(0x000011);
                // Add stars
                this.addStars();
                break;
        }
    }
    
    addStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 1000;
        const positions = new Float32Array(starsCount * 3);
        
        for (let i = 0; i < starsCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2000;
            positions[i + 1] = (Math.random() - 0.5) * 2000;
            positions[i + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 1,
            sizeAttenuation: true
        });
        
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }
    
    loadCarModel() {
        // Create a placeholder car model since we don't have the actual MG Hector model
        // In production, you would load a GLTF/GLB model here
        
        const group = new THREE.Group();
        
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(4.5, 1.2, 1.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: this.config.currentColor,
            metalness: 0.4,
            roughness: 0.6
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);
        
        // Car roof
        const roofGeometry = new THREE.BoxGeometry(2, 0.5, 1.5);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: this.config.currentColor,
            metalness: 0.3,
            roughness: 0.5
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 1.5, 0);
        roof.castShadow = true;
        group.add(roof);
        
        // Wheels
        this.createWheels(group);
        
        // Windows (glass)
        const windowGeometry = new THREE.BoxGeometry(2, 0.8, 1.4);
        const windowMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x222222,
            metalness: 1,
            roughness: 0,
            transmission: 0.9,
            transparent: true,
            opacity: 0.3
        });
        const windows = new THREE.Mesh(windowGeometry, windowMaterial);
        windows.position.set(0, 1.2, 0);
        group.add(windows);
        
        // Headlights
        this.createLights(group);
        
        this.carModel = group;
        this.scene.add(this.carModel);
        
        // Scale and position
        this.carModel.scale.set(0.7, 0.7, 0.7);
        this.carModel.position.y = 0.5;
    }
    
    createWheels(carGroup) {
        const wheelPositions = [
            { x: -1.2, y: 0.3, z: 0.9 },
            { x: 1.2, y: 0.3, z: 0.9 },
            { x: -1.2, y: 0.3, z: -0.9 },
            { x: 1.2, y: 0.3, z: -0.9 }
        ];
        
        wheelPositions.forEach(pos => {
            // Wheel
            const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
            const wheelMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                metalness: 0.8,
                roughness: 0.2
            });
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.castShadow = true;
            carGroup.add(wheel);
            
            // Rim
            const rimGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.21, 10);
            const rimMaterial = new THREE.MeshStandardMaterial({ 
                color: this.config.currentRimColor,
                metalness: 0.9,
                roughness: 0.1
            });
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.z = Math.PI / 2;
            rim.position.set(pos.x, pos.y, pos.z);
            rim.castShadow = true;
            carGroup.add(rim);
        });
    }
    
    createLights(carGroup) {
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFCC });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-1.8, 0.8, 0.9);
        carGroup.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(1.8, 0.8, 0.9);
        carGroup.add(rightHeadlight);
        
        // Taillights
        const taillightGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.1);
        const taillightMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        
        const leftTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
        leftTaillight.position.set(-1.8, 0.8, -0.9);
        carGroup.add(leftTaillight);
        
        const rightTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
        rightTaillight.position.set(1.8, 0.8, -0.9);
        carGroup.add(rightTaillight);
    }
    
    setupUI() {
        // Color options
        const colorContainer = document.getElementById('color-options');
        this.config.colors.forEach((colorOption, index) => {
            const colorCircle = document.createElement('div');
            colorCircle.className = `color-circle ${index === 0 ? 'active' : ''}`;
            colorCircle.style.backgroundColor = `#${colorOption.color.toString(16).padStart(6, '0')}`;
            colorCircle.title = colorOption.name;
            
            colorCircle.addEventListener('click', () => {
                document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
                colorCircle.classList.add('active');
                this.changeCarColor(colorOption.color);
            });
            
            colorContainer.appendChild(colorCircle);
        });
        
        // Rim color options
        const rimColorContainer = document.getElementById('rim-color-options');
        this.config.rimColors.forEach((colorOption, index) => {
            const colorCircle = document.createElement('div');
            colorCircle.className = `color-circle ${index === 0 ? 'active' : ''}`;
            colorCircle.style.backgroundColor = `#${colorOption.color.toString(16).padStart(6, '0')}`;
            colorCircle.title = colorOption.name;
            
            colorCircle.addEventListener('click', () => {
                document.querySelectorAll('#rim-color-options .color-circle').forEach(c => c.classList.remove('active'));
                colorCircle.classList.add('active');
                this.changeRimColor(colorOption.color);
            });
            
            rimColorContainer.appendChild(colorCircle);
        });
        
        // Wheel type options
        const wheelContainer = document.getElementById('wheel-options');
        this.config.wheelTypes.forEach((type, index) => {
            const wheelOption = document.createElement('div');
            wheelOption.className = `wheel-option ${index === 0 ? 'active' : ''}`;
            wheelOption.innerHTML = `
                <div style="width: 50px; height: 50px; background: #444; border-radius: 50%; margin: 0 auto 5px;"></div>
                <span>${type}</span>
            `;
            
            wheelOption.addEventListener('click', () => {
                document.querySelectorAll('.wheel-option').forEach(w => w.classList.remove('active'));
                wheelOption.classList.add('active');
                this.changeWheelType(type);
            });
            
            wheelContainer.appendChild(wheelOption);
        });
        
        // Environment selector
        document.getElementById('environment-select').addEventListener('change', (e) => {
            this.setupEnvironment(e.target.value);
        });
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetToDefault();
        });
        
        // Screenshot button
        document.getElementById('screenshot-btn').addEventListener('click', () => {
            this.takeScreenshot();
        });
    }
    
    changeCarColor(color) {
        if (!this.carModel) return;
        
        this.config.currentColor = color;
        
        // Update car body material
        this.carModel.traverse((child) => {
            if (child.isMesh && child.material && 
                child.material.color && 
                child !== this.carModel.children.find(c => c.material.transmission > 0.5)) {
                child.material.color.setHex(color);
                child.material.needsUpdate = true;
            }
        });
    }
    
    changeRimColor(color) {
        if (!this.carModel) return;
        
        this.config.currentRimColor = color;
        
        // Update rim materials
        this.carModel.traverse((child) => {
            if (child.isMesh && child.material && child.material.color && 
                child.geometry.type === 'CylinderGeometry' && 
                child.geometry.parameters.radiusTop === 0.2) {
                child.material.color.setHex(color);
                child.material.needsUpdate = true;
            }
        });
    }
    
    changeWheelType(type) {
        this.config.currentWheelType = type;
        // In a real implementation, this would swap wheel models
        console.log(`Wheel type changed to: ${type}`);
    }
    
    resetToDefault() {
        // Reset colors
        this.changeCarColor(this.config.colors[0].color);
        this.changeRimColor(this.config.rimColors[0].color);
        
        // Reset UI
        document.querySelectorAll('.color-circle')[0].classList.add('active');
        document.querySelectorAll('.color-circle:not(:first-child)').forEach(c => c.classList.remove('active'));
        
        document.querySelectorAll('#rim-color-options .color-circle')[0].classList.add('active');
        document.querySelectorAll('#rim-color-options .color-circle:not(:first-child)').forEach(c => c.classList.remove('active'));
        
        document.querySelectorAll('.wheel-option')[0].classList.add('active');
        document.querySelectorAll('.wheel-option:not(:first-child)').forEach(c => c.classList.remove('active'));
        
        // Reset camera
        this.camera.position.set(5, 3, 8);
        this.controls.reset();
    }
    
    takeScreenshot() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `mg-hector-configuration-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    onWindowResize() {
        const width = window.innerWidth / 2;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        // Rotate wheels slightly for visual appeal
        if (this.carModel) {
            this.carModel.traverse((child) => {
                if (child.isMesh && child.geometry.type === 'CylinderGeometry') {
                    child.rotation.y += 0.005;
                }
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the configurator when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new CarConfigurator();
});
