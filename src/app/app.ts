import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private object!: THREE.Mesh;
  private particles!: THREE.Points;

  private animationId = 0;

  private mouseX = 0;
  private mouseY = 0;

  ngAfterViewInit(): void {
    this.initScene();
    this.createLights();
    this.createObject();
    this.createParticles();

    this.animate();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private initScene(): void {

    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x050509);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.camera.position.set(0, 0, 8);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
      antialias: true,
      alpha: true
    });

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }

  private createLights(): void {

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1.5
    );

    this.scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(
      0x7c3aed,
      30,
      30
    );

    purpleLight.position.set(4, 3, 5);

    this.scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(
      0x06b6d4,
      25,
      30
    );

    cyanLight.position.set(-4, -2, 4);

    this.scene.add(cyanLight);
  }

  private createObject(): void {

    const geometry = new THREE.TorusKnotGeometry(
      1.5,
      0.38,
      180,
      32
    );

    const material = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.85,
      roughness: 0.18,
      emissive: 0x32106b,
      emissiveIntensity: 1.2
    });

    this.object = new THREE.Mesh(
      geometry,
      material
    );

    this.object.position.set(2.7, 0, 0);

    this.scene.add(this.object);
  }

  private createParticles(): void {

    const count = 1500;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {

      positions[i * 3] =
        (Math.random() - 0.5) * 25;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 18;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) * 20;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    const material = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 0.035,
      transparent: true,
      opacity: 0.7
    });

    this.particles = new THREE.Points(
      geometry,
      material
    );

    this.scene.add(this.particles);
  }

  private animate = (): void => {

    this.animationId =
      requestAnimationFrame(this.animate);

    const time =
      performance.now() * 0.001;

    if (this.object) {

      this.object.rotation.x =
        time * 0.25;

      this.object.rotation.y =
        time * 0.4;

      this.object.rotation.z =
        Math.sin(time * 0.5) * 0.15;

      this.object.position.y =
        Math.sin(time) * 0.25;

      this.object.rotation.x +=
        this.mouseY * 0.15;

      this.object.rotation.y +=
        this.mouseX * 0.15;
    }

    if (this.particles) {

      this.particles.rotation.y =
        time * 0.015;

      this.particles.rotation.x =
        Math.sin(time * 0.1) * 0.05;
    }

    this.renderer.render(
      this.scene,
      this.camera
    );
  };

  private onMouseMove = (
    event: MouseEvent
  ): void => {

    this.mouseX =
      (event.clientX / window.innerWidth) * 2 - 1;

    this.mouseY =
      (event.clientY / window.innerHeight) * 2 - 1;
  };

  private onResize = (): void => {

    this.camera.aspect =
      window.innerWidth / window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  };

  ngOnDestroy(): void {

    cancelAnimationFrame(
      this.animationId
    );

    window.removeEventListener(
      'resize',
      this.onResize
    );

    window.removeEventListener(
      'mousemove',
      this.onMouseMove
    );

    this.renderer?.dispose();
  }
}