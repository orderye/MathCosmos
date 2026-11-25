import * as THREE from 'three';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import zetaVert from '../../shaders/zetaRibbon.vert?raw';
import zetaFrag from '../../shaders/zetaRibbon.frag?raw';

import { dirichletZeta } from '../../core/math/zeta';

const SU = 64;
const SV = 96;

export class ZetaRibbon extends SimpleMeshCreature {
  public init(): void {
    const zeros = ((this.config.params?.zeros as number[] | undefined) ?? []).slice();
    const cols = SU + 1;
    const rows = SV + 1;
    const count = cols * rows;
    const position = new Float32Array(count * 3);
    const uv = new Float32Array(count * 2);
    const zarg = new Float32Array(count);
    const zmag = new Float32Array(count);
    const zglow = new Float32Array(count);
    const index: number[] = [];

    for (let iu = 0; iu <= SU; iu++) {
      const sigma = 0.05 + (iu / SU) * 0.9;
      for (let iv = 0; iv <= SV; iv++) {
        const t = 10 + (iv / SV) * 40;
        const z = dirichletZeta(sigma, t);
        const k = iu * rows + iv;
        position[k * 3] = 2.4 * (sigma - 0.5);
        position[k * 3 + 1] = (t - 30) / 12;
        position[k * 3 + 2] = 0.65 * Math.log1p(z.mag);
        uv[k * 2] = iu / SU;
        uv[k * 2 + 1] = iv / SV;
        zarg[k] = z.arg;
        zmag[k] = Math.min(1, z.mag);
        let glow = 0;
        for (const zero of zeros) {
          const ds = (sigma - 0.5) / 0.06;
          const dt = (t - zero) / 0.2;
          glow = Math.max(glow, Math.exp(-(ds * ds + dt * dt)));
        }
        zglow[k] = glow;
      }
    }
    for (let iu = 0; iu < SU; iu++) {
      for (let iv = 0; iv < SV; iv++) {
        const a = iu * rows + iv;
        const b = a + rows;
        index.push(a, b, b + 1, a, b + 1, a + 1);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setAttribute('aZetaArg', new THREE.BufferAttribute(zarg, 1));
    geo.setAttribute('aZetaMag', new THREE.BufferAttribute(zmag, 1));
    geo.setAttribute('aZero', new THREE.BufferAttribute(zglow, 1));
    geo.setIndex(index);
    geo.computeVertexNormals();
    let maxR = 1e-6;
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      maxR = Math.max(maxR, Math.hypot(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }
    geo.scale(1.25 / maxR, 1.25 / maxR, 1.25 / maxR);

    const mat = createShaderMaterial({
      vertexShader: zetaVert,
      fragmentShader: zetaFrag,
      uniforms: {
        ...this.uniforms,
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
      },
      includeWake: true,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.attachMesh(geo, mat);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.spinBy(delta, 0, 0.14, 0.04);
  }
}
