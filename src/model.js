import gsap from 'gsap';
import * as THREE from 'THREE';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'

class Model {
  constructor(obj) {
    this.name = obj.name;
    this.file = obj.file;
    this.scene = obj.scene;
    this.color1 = obj.color1;
    this.color2 = obj.color2;
    this.background = obj.background;

    this.placeOnReady = obj.placeOnReady;
    this.isActive = false

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./draco/');
    this.loader.setDRACOLoader(this.dracoLoader);
    
    this.init();
  }

  init() {
    this.loader.load(this.file, (response) => {
      /*------------------------------
      On Loaded
      ------------------------------*/
      this.mesh = response.scene.children[0]


      /*------------------------------
      Geometry
      ------------------------------*/
      this.geometry = this.mesh.geometry
      // console.log(this.geometry)


      /*------------------------------
      Material
      ------------------------------*/
      this.material = new THREE.MeshBasicMaterial({ 
        color: 'red',
        wireframe: true
      })
      this.mesh.material = this.material


      /*------------------------------
      Particles geometry
      ------------------------------*/
      const surface = new MeshSurfaceSampler(this.mesh).build()
      const numParticles = 20000
      this.particlesGeometry = new THREE.BufferGeometry()
      
      const particlesPosition = new Float32Array(numParticles * 3) // It contains Vector3
      const particlesRandomness = new Float32Array(numParticles * 3)


      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3()
        surface.sample(newPosition)
  
        particlesPosition.set([
          newPosition.x, // 0 - 3 - 6
          newPosition.y, // 1 - 4 - 7
          newPosition.z  // 2 - 5 - 8
        ], i * 3)

        particlesRandomness.set([
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        ], i * 3)
      }
      this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
      this.particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(particlesRandomness, 3))
      window.console.log('this.particlesGeometry ---->', this.particlesGeometry)


      /*------------------------------
      Particles Materials
      ------------------------------*/
      // this.particlesMaterial = new THREE.PointsMaterial({ size: .01, color: 'red' })
      this.particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uColor1: { value: new THREE.Color(this.color1) },
          uColor2: { value: new THREE.Color(this.color2) },
          uTime: { value: 0 },
          uScale: { value: 0 }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })

      
      /*------------------------------
      Particles
      ------------------------------*/
      // this.particles = new THREE.Points(this.geometry, this.particlesMaterial);
      this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);
      

      /*------------------------------
      Place On Ready
      ------------------------------*/
      if (this.placeOnReady) {
        this.add()
      }
    })
  }

  add() {
    // this.scene.add(this.mesh)
    this.scene.add(this.particles)

    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 1,
      duration: .8,
      ease: 'power3.out',
      delay: .3,
    })

    if (!this.isActive) {
      gsap.fromTo(this.particles.rotation, {
        y: Math.PI,
      }, {
        y: 0,
        duration: .8,
        ease: 'power3.out'
      })

      gsap.to('body', {
        duration: .8,
        background: this.background
      })
    }
    this.isActive = true
  }

  remove() {
    // this.scene.remove(this.mesh)

    gsap.to(this.particlesMaterial.uniforms.uScale, {
      value: 0,
      duration: .8,
      ease: 'power3.out',
      onComplete: () => {
        this.scene.remove(this.particles)
        this.isActive = false
      }
    })

    gsap.to(this.particles.rotation, {
      y: Math.PI,
      duration: .8,
      ease: 'power3.out'
    })
  }
}

export default Model