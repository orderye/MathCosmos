import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  eulerPrime,
  isTwinPrime,
  primeIndex,
  primesUpTo,
  sievePrimes,
} from './primes';
import { dirichletZeta } from './zeta';
import { gyroidSDF } from './gyroid';
import { quaternionJuliaDE, quaternionSquare } from './quaternion';
import { buildApollonianPacking } from './apollonian';
import { cell24Edges, cell24Vertices, e8Edges, e8Roots } from './polytopes';
import { HYDROGEN_STATES, hydrogenDensity, hydrogenSign } from './hydrogen';
import { kuramotoOrder, kuramotoStep } from './kuramoto';
import { createOrbitalElements, sampleOrbit } from '../CelestialOrbitEngine';

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

describe('number theory', () => {
  it('sieve counts and twin primes', () => {
    const primes = primesUpTo(100);
    expect(primes.length).toBe(25);
    expect(primes.slice(0, 5)).toEqual([2, 3, 5, 7, 11]);
    const isPrime = sievePrimes(1000);
    expect(isTwinPrime(3, (n) => isPrime[n])).toBe(true);
    expect(isTwinPrime(5, (n) => isPrime[n])).toBe(true);
    expect(isTwinPrime(7, (n) => isPrime[n])).toBe(false);
    expect(primeIndex(97, (n) => isPrime[n])).toBe(24);
    expect(primeIndex(96, (n) => isPrime[n])).toBe(-1);
  });

  it('Euler polynomial is prime for k = 0..39', () => {
    const isPrime = sievePrimes(2000);
    for (let k = 0; k < 40; k++) {
      expect(isPrime[eulerPrime(k)]).toBe(true);
    }
  });
});

describe('Dirichlet zeta', () => {
  it('has a small magnitude near the first non-trivial zero', () => {
    const z = dirichletZeta(0.5, 14.134725, 300);
    expect(Number.isFinite(z.mag)).toBe(true);
    expect(z.mag).toBeLessThan(0.05);
  });

  it('is far from zero off the critical line', () => {
    expect(dirichletZeta(1.0, 14.134725, 300).mag).toBeGreaterThan(0.2);
  });
});

describe('gyroid TPMS', () => {
  it('negative inside the shell and positive outside the sphere', () => {
    expect(gyroidSDF(0, 0, 0)).toBeLessThan(0);
    expect(gyroidSDF(2, 2, 2)).toBeGreaterThan(0);
    expect(Number.isFinite(gyroidSDF(0.5, 0.5, 0.5, 0.2))).toBe(true);
  });
});

describe('quaternion Julia', () => {
  it('squares i to -1', () => {
    expect(quaternionSquare([0, 1, 0, 0])).toEqual([-1, 0, 0, 0]);
  });

  it('distance estimate is finite and positive', () => {
    for (const p of [
      [0.1, 0.2, 0.3],
      [-0.5, 0.4, 0.2],
      [0.9, -0.3, 0.1],
    ]) {
      const d = quaternionJuliaDE(p[0], p[1], p[2], [-0.2, 0.6, 0.2, 0.15]);
      expect(Number.isFinite(d)).toBe(true);
      expect(d).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('Apollonian packing', () => {
  it('starts from a Soddy 5-tuple and expands', () => {
    const balls = buildApollonianPacking(200, 26);
    expect(balls.length).toBeGreaterThan(100);
    const sum = balls.slice(0, 5).reduce((s, b) => s + b.b, 0);
    const sumSq = balls.slice(0, 5).reduce((s, b) => s + b.b * b.b, 0);
    expect(sum * sum).toBeCloseTo(3 * sumSq, 6);
    for (const b of balls) expect(Number.isFinite(b.cx + b.cy + b.cz)).toBe(true);
  });
});

describe('high-dimensional polytopes', () => {
  it('24-cell has 24 vertices and 96 edges', () => {
    const verts = cell24Vertices();
    expect(verts.length).toBe(24);
    expect(cell24Edges(verts).length).toBe(96);
  });

  it('E8 has 240 roots and 6720 edges', () => {
    const roots = e8Roots();
    expect(roots.length).toBe(240);
    expect(e8Edges(roots).length).toBe(6720);
  });
});

describe('hydrogen orbitals', () => {
  it('densities are finite/non-negative and signs are ±1', () => {
    for (const state of HYDROGEN_STATES) {
      for (const r of [1, 4, 12, 25]) {
        const d = hydrogenDensity(state, r, 1.1, 0.4);
        expect(Number.isFinite(d)).toBe(true);
        expect(d).toBeGreaterThanOrEqual(0);
        expect(Math.abs(hydrogenSign(state, r, 1.1, 0.4))).toBe(1);
      }
    }
  });
});

describe('Kuramoto swarm', () => {
  it('equal phases give full order', () => {
    const phases = new Float32Array(64).fill(0.7);
    const order = kuramotoOrder(phases);
    expect(order.r).toBeCloseTo(1, 6);
    expect(order.psi).toBeCloseTo(0.7, 6);
  });

  it('zero coupling keeps phases unchanged', () => {
    const phases = new Float32Array([0, 1, 2, 3]);
    const omegas = new Float32Array(4);
    const copy = Array.from(phases);
    kuramotoStep(phases, omegas, 0, 0.1);
    for (let i = 0; i < phases.length; i++) expect(phases[i]).toBeCloseTo(copy[i], 6);
  });
});

describe('Kepler orbit sampling', () => {
  it('stays inside the eccentric annulus and returns a unit tangent', () => {
    const rnd = seeded(42);
    const elements = createOrbitalElements('main', rnd, 3);
    const center = new THREE.Vector3(120, -30, 500);
    const pos = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    for (const t of [0, 30, 90, 240]) {
      sampleOrbit(elements, t, center, pos, tangent);
      const r = pos.distanceTo(center);
      expect(r).toBeGreaterThan(elements.semiMajor * (1 - elements.eccentricity) - 40);
      expect(r).toBeLessThan(elements.semiMajor * (1 + elements.eccentricity) + 40);
      expect(tangent.length()).toBeCloseTo(1, 5);
    }
  });
});
