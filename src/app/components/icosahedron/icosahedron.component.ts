import { Component, AfterViewInit, Renderer, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import * as THREE from "three";
import * as ifvisible from "ifvisible.js"

import { config } from "./icosahedron.config";

@Component({
    selector: 'app-icosahedron',
    templateUrl: './icosahedron.component.html',
    styleUrls: ['./icosahedron.component.scss']
})

// Thanks a lot to:
// https://github.com/makimenko/angular-three-examples

export class IcosahedronComponent implements AfterViewInit {
    constructor() {
        this.render = this.render.bind(this);
    }

    @ViewChild("canvas")
    private canvasRef: ElementRef;

    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private cameraTarget: THREE.Vector3;
    public scene: THREE.Scene;
    public clock: THREE.Clock;

    public fieldOfView: number = 60;
    public nearClippingPane: number = 1;
    public farClippingPane: number = 1100;

    public icosahedron: THREE.Object3D;
    public resizeTimeout: any;
    public speed: number = 1;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private createScene() {
        console.log(config);

        this.scene = new THREE.Scene();

        var phongMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            flatShading: true,
            vertexColors: THREE.VertexColors,
            shininess: 0,
            transparent: true,
            opacity: 1
        });

        var geometry = new THREE.IcosahedronGeometry(50, 1);
        this.icosahedron = new THREE.Mesh(geometry, phongMaterial);

        this.scene.add(this.icosahedron);
    }

    private createLight() {
        var light = new THREE.PointLight(0xFFFFFF, 0.3, 1000);
        light.position.set(0, 0, 100);
        this.scene.add(light);

        // this.scene.add(new THREE.AmbientLight(0x1D1D1D));

        var light2 = new THREE.PointLight(0xFFFFFF, 0.2, 1000);
        light2.position.set(0, 150, 90);
        this.scene.add(light2);

        var light3 = new THREE.PointLight(0xFFFFFF, 0.2, 1000);
        light3.position.set(0, -150, 90);
        this.scene.add(light3);

        var light4 = new THREE.PointLight(0xFFFFFF, 0.2, 1000);
        light4.position.set(150, 0, 90);
        this.scene.add(light4);

        var light5 = new THREE.PointLight(0xFFFFFF, 0.2, 1000);
        light5.position.set(-150, 0, 90);
        this.scene.add(light5);
    }

    private createCamera() {
        let aspectRatio = this.getAspectRatio();

        if (config["useOrthographic"]) {
            this.camera = new THREE.OrthographicCamera(
                100 / -2,
                100 / 2,
                100 / 2,
                100 / -2,
                1,
                1000
            );
        } else {
            this.camera = new THREE.PerspectiveCamera(
                this.fieldOfView,
                aspectRatio,
                this.nearClippingPane,
                this.farClippingPane
            );
        }

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 100;

        this.camera.lookAt(this.icosahedron.position);
    }

    private getAspectRatio(): number {
        let height = this.canvas.clientHeight;

        if (height === 0) {
            return 0;
        }

        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private startRendering() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.autoClear = true;

        this.clock = new THREE.Clock();
        this.clock.start();

        this.render();
    }

    lerp(v0, v1, t) {
        return v0 * (1 - t) + v1 * t
    }

    public render() {
        if (!this.clock.running) return;

        let timeMult = this.clock.getDelta() / (1 / 60);

        this.speed = this.lerp(this.speed, 1, 0.015 * timeMult);

        this.icosahedron.rotation.x += 0.001 * this.speed * timeMult;
        this.icosahedron.rotation.y += 0.002 * this.speed * timeMult;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

    @HostListener("window:resize", ["$event"])
    public onResize(event: Event) {
        clearTimeout(this.resizeTimeout);

        this.resizeTimeout = setTimeout(() => {
            this.resizeRenderer();
        }, 100);
    }

    @HostListener("window:scroll", ["$event"])
    onScrollEvent($event) {
        let scrollY = window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop || 0;

        let canvasBottom = this.canvas.offsetTop + this.canvas.offsetHeight / 2;
        let isInViewport = scrollY <= canvasBottom;

        if (isInViewport) {
            this.resumeRendering();
        } else {
            this.pauseRendering();
        }
    }

    public resizeRenderer() {
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    ngAfterViewInit() {
        this.createScene();
        this.createLight();
        this.createCamera();
        this.startRendering();

        ifvisible.on("blur", function() {
            this.pauseRendering();
        }.bind(this));

        ifvisible.on("focus", function() {
            this.resumeRendering();
        }.bind(this));
    }

    pauseRendering() {
        if (this.clock && this.clock.running) {
            this.clock.stop();
        }
    }

    resumeRendering() {
        if (this.clock && !this.clock.running) {
            this.clock.start();
            this.render();
        }
    }

    onClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.speed += config["speedIncrement"];
    }
}
