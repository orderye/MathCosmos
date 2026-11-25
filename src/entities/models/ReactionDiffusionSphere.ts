import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import rdVert from '../../shaders/reactionDiffusion.vert?raw';
import rdUpdateFrag from '../../shaders/reactionDiffusionUpdate.frag?raw';
import rdInitFrag from '../../shaders/reactionDiffusionInit.frag?raw';
import rdDisplayVert from '../../shaders/reactionDiffusionDisplay.vert?raw';
import rdDisplayFrag from '../../shaders/reactionDiffusionDisplay.frag?raw';

const SIZE = 256;
const STEPS_PER_FRAME = 4;

export class ReactionDiffusionSphere extends BaseMathCreature {
  private targetA: THREE.WebGLRenderTarget | null = null;
  private targetB: THREE.WebGLRenderTarget | null = null;
  private updateMat: THREE.ShaderMaterial | null = null;
  private initMat: THREE.ShaderMaterial | null = null;
  private displayMat: THREE.ShaderMaterial | null = null;
  private quadScene: THREE.Scene | null = null;
  private quadCamera: THREE.OrthographicCamera | null = null;
  private quadMesh: THREE.Mesh | null = null;
  private display: THREE.Mesh | null = null;
  private lowGeo: THREE.IcosahedronGeometry | null = null;
  private highGeo: THREE.IcosahedronGeometry | null = null;
  private quadGeo: THREE.PlaneGeometry | null = null;
  private initialized = false;

  public init(): void {
    const targetOptions: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    };
    this.targetA = new THREE.WebGLRenderTarget(SIZE, SIZE, targetOptions);
    this.targetB = new THREE.WebGLRenderTarget(SIZE, SIZE, targetOptions);

    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadScene = new THREE.Scene();
    this.updateMat = new THREE.ShaderMaterial({
      vertexShader: rdVert,
      fragmentShader: rdUpdateFrag,
      uniforms: {
        uState: { value: null },
        uTexel: { value: new THREE.Vector2(1 / SIZE, 1 / SIZE) },
        uFeed: { value: (this.config.params?.feed as number) ?? 0.0545 },
        uKill: { value: (this.config.params?.kill as number) ?? 0.062 },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.initMat = new THREE.ShaderMaterial({
      vertexShader: rdVert,
      fragmentShader: rdInitFrag,
      depthTest: false,
      depthWrite: false,
    });
    this.quadGeo = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(this.quadGeo, this.updateMat);
    quad.frustumCulled = false;
    this.quadMesh = quad;
    this.quadScene.add(quad);

    this.highGeo = new THREE.IcosahedronGeometry(1, 5);
    this.lowGeo = new THREE.IcosahedronGeometry(1, 3);
    this.displayMat = new THREE.ShaderMaterial({
      vertexShader: rdDisplayVert,
      fragmentShader: rdDisplayFrag,
      uniforms: {
        uState: { value: this.targetA.texture },
        uDisplace: { value: 0.16 },
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uAccentColor: { value: new THREE.Color(this.config.accentColor ?? this.config.glowColor) },
      },
      transparent: true,
      depthWrite: false,
    });
    this.display = new THREE.Mesh(this.highGeo, this.displayMat);
    this.display.onBeforeRender = (renderer) => {
      this.step(renderer);
      (this.displayMat!.uniforms.uState.value as THREE.Texture) = this.targetA!.texture;
    };
    this.group.add(this.display);
    this.resources.trackAll(
      this.targetA!,
      this.targetB!,
      this.updateMat!,
      this.initMat!,
      this.displayMat!,
      this.highGeo!,
      this.lowGeo!,
      this.quadGeo!,
    );
    this.addLodPart({
      object: this.display,
      geometrySwap: { lod0: this.highGeo!, lod1: this.lowGeo! },
    });
    this.setLOD(0);
  }

  private step(renderer: THREE.WebGLRenderer): void {
    if (!this.targetA || !this.targetB || !this.updateMat || !this.quadScene || !this.quadCamera) return;
    const prev = renderer.getRenderTarget();
    if (!this.initialized) {
      this.quadMesh!.material = this.initMat!;
      renderer.setRenderTarget(this.targetA);
      renderer.render(this.quadScene, this.quadCamera);
      this.initialized = true;
    }
    this.quadMesh!.material = this.updateMat;
    let front: THREE.WebGLRenderTarget = this.targetA;
    let back: THREE.WebGLRenderTarget = this.targetB;
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      this.updateMat.uniforms.uState.value = front.texture;
      renderer.setRenderTarget(back);
      renderer.render(this.quadScene, this.quadCamera);
      const tmp: THREE.WebGLRenderTarget = front;
      front = back;
      back = tmp;
    }
    this.targetA = front;
    this.targetB = back;
    renderer.setRenderTarget(prev);
  }

}
