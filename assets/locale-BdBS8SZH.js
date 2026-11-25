import{s as d,Q as G,G as Q,u as J,C as F,ae as $,w as X,af as ee,ag as te,S as oe,h as ne,i as D,_ as q,V as re,M as ae,n as ie,o as A,g as se}from"./three-BADZquTA.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=o(r);fetch(r.href,a)}})();const le=`// 玩家“擦肩而过”流体尾流扰动公共片（主文档 §5.2）
uniform vec3 uPlayerPos;
uniform vec3 uPlayerVel;
uniform float uWakeRadius;

vec3 applyProximityWake(vec3 worldPos, vec3 normal, out float wakeIntensity) {
    vec3 toVertex = worldPos - uPlayerPos;
    float dist = length(toVertex);
    float speedFactor = clamp(length(uPlayerVel) / 120.0, 0.25, 2.0);

    wakeIntensity = smoothstep(uWakeRadius, 0.0, dist);
    vec3 pushDir = normalize(toVertex + vec3(0.0001));
    vec3 swirlDir = normalize(cross(pushDir, normalize(uPlayerVel + vec3(0.0, 0.001, 0.0))));

    float displacement = wakeIntensity * wakeIntensity * 6.5 * speedFactor;
    return worldPos + (pushDir * 0.7 + swirlDir * 0.3) * displacement;
}`,Be=[{code:"M10",modelType:"fourier",titleZh:"三维傅里叶本轮",titleEn:"3D Fourier Epicycles",category:"analysis",pipeline:"tube_network",shell:"inner",instanceCount:3,scaleRange:[25,38],audioFamily:"quantum",latexFormula:"\\mathbf{r}(t)=\\sum_{k=1}^{4}\\mathbf{R}_k(\\omega_k t)(A_k,0,0)^{\\mathsf T}",description:"谐波叠加的机械星盘：四级金色圆环以 ω∈{1,-3,7,-11} 嵌套旋转，末梢笔尖实时书写出逐渐淡出的电光青空间曲线。",coreColor:"#FEF9C3",glowColor:"#EAB308",accentColor:"#22D3EE"},{code:"M11",modelType:"harmonics",titleZh:"球谐函数",titleEn:"Spherical Harmonics",category:"physics",pipeline:"parametric_surface",shell:"inner",instanceCount:3,scaleRange:[26,38],audioFamily:"quantum",latexFormula:"r(\\theta,\\phi)=0.6+0.8\\,|Y_l^{m}(\\theta,\\phi)|",description:"氢原子电子概率云的形状语言：正相位瓣玫瑰粉金、负相位瓣量子靛蓝，节点面呈暗空，两组量子态在实时形变间往复切换。",coreColor:"#FCE7F3",glowColor:"#EC4899",accentColor:"#6366F1"},{code:"M12",modelType:"phyllotaxis",titleZh:"黄金角素数涡旋",titleEn:"Prime Phyllotaxis",category:"number-theory",pipeline:"point_cloud",shell:"inner",instanceCount:3,scaleRange:[35,55],audioFamily:"quantum",latexFormula:"r_n=c\\sqrt{n},\\quad \\theta_n=n\\pi(3-\\sqrt{5})",description:"2500 枚按斐波那契黄金角排布的星点，唯有素数索引被点亮放大。每三秒一道筛检光波扫过，素数依次闪烁如磷虾鱼群。",coreColor:"#ECFEFF",glowColor:"#2DD4BF",accentColor:"#FDE047"},{code:"M26",modelType:"ulam-prime",titleZh:"乌拉姆三维素数星云",titleEn:"3D Ulam Prime Constellation",category:"number-theory",pipeline:"point_cloud",shell:"inner",instanceCount:3,scaleRange:[42,60],audioFamily:"quantum",latexFormula:"r_n=\\sqrt n,\\quad \\theta_n=2\\pi\\sqrt n,\\quad z_n=0.35\\sqrt n\\sin\\frac{\\pi n}{180}",description:"前 4096 个正整数沿阿基米德-萨克斯双螺旋壳展开，素数化作柔金星光，孪生素数与欧拉多项式轨迹被玫红星链串起。",coreColor:"#FFF7ED",glowColor:"#FDE047",accentColor:"#FB7185"},{code:"M27",modelType:"hydrogen",titleZh:"氢原子高阶电子云轨道",titleEn:"Hydrogen Atomic Orbitals",category:"physics",pipeline:"point_cloud",shell:"inner",instanceCount:3,scaleRange:[32,46],audioFamily:"quantum",latexFormula:"\\psi_{n,l,m}\\propto e^{-\\rho/2}\\rho^l L_{n-l-1}^{2l+1}(\\rho)\\,Y_l^m(\\theta,\\phi)",description:"真实薛定谔方程高阶激发态的拒绝采样体积点云：正相位瓣量子幽蓝、负相位瓣星云粉红，电子按角动量量子数绕轴相流，如一朵通透的量子莲花。",coreColor:"#EFF6FF",glowColor:"#3B82F6",accentColor:"#F472B6",params:{states:[[3,2,0],[4,2,1],[4,3,2],[5,3,1]]}},{code:"M33",modelType:"kuramoto",titleZh:"仓本耦合振子球群",titleEn:"Kuramoto Coupled Oscillators",category:"pde",pipeline:"instanced_lattice",shell:"main",instanceCount:3,scaleRange:[30,44],audioFamily:"quantum",latexFormula:"\\dot\\theta_i=\\omega_i+\\frac{K(t)}{N}\\sum_j\\sin(\\theta_j-\\theta_i)",description:"600 个球面发光振子在临界耦合强度上下摆动：时而混乱无序地闪烁，时而全群共振齐明，像一团深海萤火同步呼吸。",coreColor:"#F0FDFA",glowColor:"#2DD4BF",accentColor:"#FDE047",params:{nodes:600}},{code:"M35",modelType:"zeta",titleZh:"黎曼 ζ 临界带复相丝带",titleEn:"Riemann Zeta Critical Ribbon",category:"number-theory",pipeline:"parametric_surface",shell:"inner",instanceCount:3,scaleRange:[28,40],audioFamily:"quantum",latexFormula:"\\zeta(s)=\\frac{1}{1-2^{1-s}}\\sum_{n\\ge1}\\frac{(-1)^{n-1}}{n^s},\\quad s=\\sigma+it",description:"围绕黎曼巨构巡逻的护卫幼体：临界带复相域着色随 arg ζ(s) 流转，前 10 个非平凡零点处镶嵌纯白高能星核，直接呼应宇宙中心。",coreColor:"#FAF5FF",glowColor:"#E879F9",accentColor:"#38BDF8",params:{zeros:[14.1347,21.022,25.0109,30.4249,32.9351,37.5862,40.9187,43.3271,48.0052,49.7738]}},{code:"M38",modelType:"dipole",titleZh:"磁偶极子范艾伦等离子环",titleEn:"Magnetic Dipole Flux Cage",category:"physics",pipeline:"tube_network",shell:"inner",instanceCount:3,scaleRange:[32,46],audioFamily:"quantum",latexFormula:"r(\\theta)=L\\sin^2\\theta,\\quad B\\propto\\frac{\\sqrt{1+3\\cos^2\\theta}}{r^3}",description:"三个 L 壳层上的偶极磁力线细管，1200 枚极光粒子沿磁力线做螺旋拉莫尔往复；接近南北磁镜点时减速并爆发青蓝与紫罗兰闪光。",coreColor:"#ECFEFF",glowColor:"#06B6D4",accentColor:"#A78BFA"}],z=Math.PI*2;function ce(t){let e=t>>>0;return()=>{e|=0,e=e+1831565813|0;let o=Math.imul(e^e>>>15,1|e);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}const ue={inner:{aMin:500,aMax:1150,eMin:.05,eMax:.18,periodMin:40,periodMax:70,seedBase:0},main:{aMin:1180,aMax:2300,eMin:.15,eMax:.35,periodMin:90,periodMax:180,seedBase:1009},outer:{aMin:2350,aMax:3400,eMin:.45,eMax:.75,periodMin:240,periodMax:420,seedBase:2017}},he=.6180339887498949,me=.7548776662466927,U=new d(0,1,0),de=new d(1,0,0),W=new G,j=new G,Y=new G,P=new d,E=new d;function pe(t,e,o){const n=ue[t],r=n.periodMin+e()*(n.periodMax-n.periodMin),a=(o*he+e()*.055)%1,i=Math.acos(a*2-1),l=(o*me+e()*.09)%1*z;return{layer:t,semiMajor:n.aMin+e()*(n.aMax-n.aMin),eccentricity:n.eMin+e()*(n.eMax-n.eMin),inclination:i,node:l,argPeri:e()*z,meanAnomaly0:e()*z,meanMotion:z/r,nodeRate:(e()-.5)*.01,periRate:(e()-.5)*.008,seed:n.seedBase+o*1.618034+e()*97,driftScale:.55+e()*.45}}function fe(t,e){let o=t;for(let n=0;n<5;n++){const r=o-e*Math.sin(o)-t;o-=r/(1-e*Math.cos(o))}return o}function b(t,e,o){let n=Math.imul(t|0,374761393)^Math.imul(e|0,668265263)^Math.imul(o|0,1440662683);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967295}function N(t){return t*t*(3-2*t)}function O(t,e,o){const n=Math.floor(t),r=Math.floor(e),a=Math.floor(o),i=N(t-n),l=N(e-r),p=N(o-a),u=b(n,r,a),f=b(n+1,r,a),c=b(n,r+1,a),g=b(n+1,r+1,a),v=b(n,r,a+1),M=b(n+1,r,a+1),s=b(n,r+1,a+1),h=b(n+1,r+1,a+1),m=u+(f-u)*i,w=c+(g-c)*i,S=v+(M-v)*i,y=s+(h-s)*i,x=m+(w-m)*l,C=S+(y-S)*l;return(x+(C-x)*p)*2-1}function ge(t,e,o,n,r){const a=t.eccentricity,i=t.semiMajor,l=t.node+t.nodeRate*e,p=t.argPeri+t.periRate*e,u=t.meanAnomaly0+t.meanMotion*e,f=fe(u,a),c=Math.cos(f),g=Math.sin(f),v=i*(1-a*c),M=Math.atan2(Math.sqrt(1-a*a)*g,c-a),s=Math.cos(M),h=Math.sin(M);P.set(v*s,0,v*h);const m=Math.sqrt(i*(1-a*a)),w=a*Math.sin(M)/m,S=m/v;E.set(w*s-S*h,0,w*h+S*s),W.setFromAxisAngle(U,l),j.setFromAxisAngle(de,t.inclination),W.multiply(j),Y.setFromAxisAngle(U,p),W.multiply(Y),P.applyQuaternion(W),E.applyQuaternion(W);const y=35*t.driftScale,x=e*.1,C=t.seed;n.set(o.x+P.x+O(C*.71+x,C*.13,.37)*y,o.y+P.y+O(C*.29,C*.83+x,1.61)*y*.6,o.z+P.z+O(C*.47,.91,C*.59+x)*y),r.copy(E).normalize()}class ve{resources=[];track(e){return this.resources.push(e),e}trackAll(...e){for(const o of e)this.resources.push(o)}disposeAll(){for(const e of this.resources)e.dispose();this.resources.length=0}}function ye(t){let e=2166136261;for(let o=0;o<t.length;o++)e^=t.charCodeAt(o),e=Math.imul(e,16777619);return e>>>0}function we(t,e){let o=(t^Math.imul(e,2654435761))>>>0;return o=Math.imul(o^o>>>15,2246822507)>>>0,o=Math.imul(o^o>>>13,3266489909)>>>0,((o^o>>>16)>>>0)/4294967296}const Me={chaos:.15,"high-dim":.2,physics:.1,topology:.05,fractal:0,pde:0,analysis:-.05,"number-theory":-.15};function K(t,e,o){const n=(ye(e)^Math.imul(o|0,2654435761))>>>0,r=l=>we(n,l),a=r(1)+Me[t],i=a<.3?"fearful":a>.72?"curious":"indifferent";return{temperament:i,speedBase:.65+r(2)*.9,speedWobbleAmp:.12+r(3)*.23,speedWobbleOmega:.2+r(4)*.7,wanderAmp:18+r(5)*55,wanderOmega:.04+r(6)*.12,reactRadius:i==="indifferent"?0:320+r(7)*380,reactStrength:i==="indifferent"?0:40+r(8)*90,rollGain:.6+r(9)*1.2,pitchGain:.4+r(10)*1,phase:r(11)*Math.PI*2}}const xe=90;class Ce{profile;modelType;category;clock=0;reactWeight=0;wanderOffset=new d;reactOffset=new d;toPlayer=new d;constructor(e,o,n){this.modelType=e,this.category=o,this.profile=K(o,e,n)}reset(e){this.profile=K(this.category,this.modelType,e),this.clock=0,this.reactWeight=0,this.wanderOffset.set(0,0,0),this.reactOffset.set(0,0,0),this.toPlayer.set(0,0,0)}get time(){return this.clock}get spinScale(){return this.profile.speedBase}tick(e){const o=this.profile,n=1+o.speedWobbleAmp*Math.sin(this.clock*o.speedWobbleOmega+o.phase);this.clock+=e*o.speedBase*n}applyOffsets(e,o,n,r,a=1){const i=this.profile,l=this.clock*i.wanderOmega+i.phase;this.wanderOffset.set(Math.sin(l),Math.sin(l*1.37+1.7)*.55,Math.cos(l*.83+3.1)).multiplyScalar(i.wanderAmp*a),e.add(this.wanderOffset);let p=0;if(i.reactRadius>0){const u=e.distanceTo(n);u<i.reactRadius+xe&&(p=1-Math.min(u/i.reactRadius,1))}if(this.reactWeight+=(p-this.reactWeight)*Math.min(1,r*2.2),this.reactWeight>.001&&i.reactStrength>0){this.toPlayer.copy(n).sub(e);const u=this.toPlayer.length();if(u>1e-6){const f=i.temperament==="fearful"?-1:1;this.toPlayer.multiplyScalar(1/u),this.reactOffset.copy(this.toPlayer).multiplyScalar(f*i.reactStrength*this.reactWeight*a),e.add(this.reactOffset),o.addScaledVector(this.toPlayer,f*.9*this.reactWeight*a).normalize()}}}rollAngle(e){return this.profile.rollGain*.22*Math.sin(e*.6+this.profile.phase)}pitchAngle(e){return this.profile.pitchGain*.12*Math.sin(e*.43+this.profile.phase*1.7)}get reaction(){return this.reactWeight}}const Ze={inner:{lifetime:[45,75],gap:[8,14],spawnRadius:[60,110]},main:{lifetime:[100,170],gap:[12,20],spawnRadius:[80,140]},outer:{lifetime:[240,380],gap:[20,32],spawnRadius:[100,180]}},Se=.12,Fe=.2,be=.18;function L(t){return t<0?0:t>1?1:t}function H(t,e,o){if(t===e)return o<t?0:1;const n=L((o-t)/(e-t));return n*n*(3-2*n)}class Ae{options;ageValue;constructor(e){this.options=e;const o=this.cycle;this.ageValue=Math.min(Math.max(e.initialAge??0,0),o-1e-6)}get cycle(){return this.options.lifetime+this.options.gap}get age(){return this.ageValue}get lifetime(){return this.options.lifetime}get progress(){return L(this.ageValue/this.options.lifetime)}get alive(){return this.ageValue<this.options.lifetime}tick(e){return this.ageValue+=e,this.ageValue<this.cycle?!1:(this.ageValue%=this.cycle,!0)}seek(e){this.ageValue=L(e)*this.options.lifetime}get expansion(){return Math.pow(this.progress,.8)}get radiusGrowth(){return 1+be*this.progress}get visualScale(){const e=this.progress,o=H(0,Se,e),n=1-H(1-Fe,1,e);return Math.min(o,n)}get spriteOpacity(){return this.visualScale}get offsetScale(){return this.expansion}}function We(){const e=document.createElement("canvas");e.width=64,e.height=64;const o=e.getContext("2d"),n=o.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.25,"rgba(255,255,255,0.6)"),n.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=n,o.fillRect(0,0,64,64);const r=new te(e);return r.colorSpace=oe,r}class _{group=new Q;config;uniforms;behavior;lifecycle;currentLOD=0;ready=!1;resources=new ve;lodParts=[];lodSprite=null;static glowTexture=null;referenceCenter=new d;spawnRng;spawnIndex=0;tmpPos=new d;tmpDir=new d;tmpTangent=new d;tmpLook=new d;tmpUp=new d;tmpMatrix=new J;constructor(e){this.config=e,this.behavior=new Ce(e.modelType,e.category,e.orbit.seed),this.lifecycle=new Ae(e.lifecycle),this.spawnRng=ce(Math.floor(e.orbit.seed*2654435761)),this.uniforms={uTime:{value:0},uPlayerPos:{value:new d},uPlayerVel:{value:new d},uWakeRadius:{value:Math.max(55,e.scale*2.2)},uCoreColor:{value:new F(e.coreColor)},uGlowColor:{value:new F(e.glowColor)}},this.group.scale.setScalar(e.scale),this.group.userData.codexType=e.modelType}initialize(){this.ready||(this.init(),this.ready=!0)}get alive(){return this.ready&&this.lifecycle.alive}addLodPart(e){this.lodParts.push(e)}setLOD(e){this.currentLOD=e;for(const o of this.lodParts){if(o.object.visible=o.visible?o.visible(e):e<2,e===2)continue;const n=o.object;o.geometrySwap&&n.geometry&&(n.geometry=e===0?o.geometrySwap.lod0:o.geometrySwap.lod1),o.drawRange&&n.geometry&&n.geometry.setDrawRange(0,o.drawRange[e]),o.instanceCount&&typeof n.count=="number"&&(n.count=o.instanceCount[e])}this.setSpriteVisible(e===2)}dispose(){this.resources.disposeAll()}spinBy(e,o,n,r){o&&this.group.rotateX(e*o),n&&this.group.rotateY(e*n),r&&this.group.rotateZ(e*r)}setReferenceFrame(e){this.referenceCenter.copy(e)}ensureSprite(){if(!this.lodSprite){_.glowTexture||(_.glowTexture=We());const e=new $({map:_.glowTexture,color:new F(this.config.glowColor).multiplyScalar(2.2),blending:X,transparent:!0,depthWrite:!1,opacity:this.lifecycle.spriteOpacity});this.lodSprite=new ee(e),this.lodSprite.scale.setScalar(2.6),this.lodSprite.visible=!1,this.group.add(this.lodSprite)}return this.lodSprite}setSpriteVisible(e){this.ensureSprite().visible=e}update(e,o,n,r){if(this.lifecycle.tick(e)&&this.respawn(),!this.lifecycle.alive){this.group.visible=!1;return}this.group.visible=!0,this.behavior.tick(e),ge(this.config.orbit,this.behavior.time,this.referenceCenter,this.tmpPos,this.tmpTangent),this.tmpDir.copy(this.tmpPos).sub(this.referenceCenter);const a=this.tmpDir.length();if(a>1e-6){this.tmpDir.multiplyScalar(1/a);const i=this.config.orbit.semiMajor*this.lifecycle.radiusGrowth,l=this.lifecycle.options.spawnRadius+(i-this.lifecycle.options.spawnRadius)*this.lifecycle.expansion;this.tmpPos.copy(this.referenceCenter).addScaledVector(this.tmpDir,l)}this.behavior.applyOffsets(this.tmpPos,this.tmpTangent,n,e,this.lifecycle.offsetScale),this.group.position.copy(this.tmpPos),this.tmpLook.copy(this.tmpPos).add(this.tmpTangent),this.tmpUp.set(0,1,0),Math.abs(this.tmpTangent.y)>.98&&this.tmpUp.set(1,0,0),this.tmpMatrix.lookAt(this.tmpLook,this.tmpPos,this.tmpUp),this.group.quaternion.setFromRotationMatrix(this.tmpMatrix),this.group.rotateZ(this.behavior.rollAngle(o)),this.group.rotateX(this.behavior.pitchAngle(o)),this.group.rotateOnAxis(this.config.rotationAxis,this.config.rotationSpeed*this.behavior.spinScale*e),this.group.scale.setScalar(this.config.scale*this.lifecycle.visualScale),this.lodSprite&&(this.lodSprite.material.opacity=this.lifecycle.spriteOpacity),this.uniforms.uTime.value=o,this.uniforms.uPlayerPos.value.copy(n),this.uniforms.uPlayerVel.value.copy(r)}respawn(){const e=Math.floor(this.spawnRng()*4294967295);this.config.orbit=pe(this.config.orbit.layer,this.spawnRng,this.spawnIndex++),this.behavior.reset(e),this.group.visible=!0}}const Pe=`uniform float uTime;
uniform float uSize;

attribute float aSpeed;
attribute float aPhase;

varying float vSpeed;
varying float vWake;

void main() {
  vSpeed = aSpeed;
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;

  float wake;
  worldPos = applyProximityWake(worldPos, normalize(worldPos + vec3(0.001)), wake);
  vWake = wake;

  vec4 mv = viewMatrix * vec4(worldPos, 1.0);
  float breathe = 0.75 + 0.25 * sin(uTime * 3.0 + aPhase * 6.2831);
  gl_PointSize = uSize * breathe * (400.0 / max(-mv.z, 1.0));
  gl_Position = projectionMatrix * mv;
}`,ke=`uniform vec3 uCoreColor;
uniform vec3 uGlowColor;

varying float vSpeed;
varying float vWake;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float soft = 1.0 - d2 * 4.0;

  vec3 col = mix(uGlowColor, uCoreColor, clamp(vSpeed, 0.0, 1.0));
  col *= soft * (1.0 + vWake * 0.6);
  gl_FragColor = vec4(col, soft * 0.9);
}`,Re=`uniform float uTime;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}`,_e=`uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;
uniform float uFlowSpeed;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.2);

  // 沿 u 方向流淌的双色流光
  float flow = sin(vUv.x * 18.0 - uTime * uFlowSpeed) * 0.5 + 0.5;
  vec3 col = mix(uCoreColor, uAccentColor, flow * 0.65);
  col = mix(col, uGlowColor, fresnel);

  col *= 1.0 + vWake * 0.4;
  col = mix(col, vec3(1.0), vWake * 0.25);
  gl_FragColor = vec4(col, 0.85 + 0.15 * fresnel);
}`,ze=`uniform float uTime;
uniform float uWaveAmp;
uniform float uWaveFreq;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying float vWake;

void main() {
  vUv = uv;
  vec3 local = position;
  local += normal * sin(uTime * uWaveFreq + uv.x * 12.566 + uv.y * 6.283) * uWaveAmp;

  vec4 world = modelMatrix * vec4(local, 1.0);
  vec3 wNormal = normalize(mat3(modelMatrix) * normal);
  float wake;
  world.xyz = applyProximityWake(world.xyz, wNormal, wake);
  vWake = wake;
  vWorldPos = world.xyz;
  vWorldNormal = wNormal;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,De=`uniform float uTime;
uniform float uFlowSpeed;
uniform vec2 uGridFreq;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying float vWake;

float computeGrid(vec2 uv, vec2 freq, float lineWidth) {
  vec2 coord = uv * freq;
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / (fwidth(coord) + 1e-5);
  float line = min(grid.x, grid.y);
  return 1.0 - smoothstep(0.0, lineWidth, line);
}

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 normal = gl_FrontFacing ? normalize(vWorldNormal) : -normalize(vWorldNormal);

  float fresnel = pow(1.0 - clamp(abs(dot(viewDir, normal)), 0.0, 1.0), 2.6);
  float wave = 0.5 + 0.5 * sin(vUv.x * 12.566 - uTime * uFlowSpeed + vUv.y * 6.283);
  float gridMask = computeGrid(vUv + vec2(uTime * 0.03, 0.0), uGridFreq, 1.35);

  vec3 baseTint = mix(uGlowColor, uAccentColor, wave);
  vec3 color = baseTint * (0.28 + fresnel * 1.45);
  color += mix(uGlowColor, uCoreColor, 0.65) * gridMask * (0.45 + 0.55 * fresnel);
  color += uCoreColor * vWake * 1.15;

  float alpha = clamp(0.16 + fresnel * 0.65 + gridMask * 0.35 + vWake * 0.3, 0.0, 0.95);
  gl_FragColor = vec4(color, alpha);
}
`;function T(t){return new ne({vertexShader:t.includeWake===!1?t.vertexShader:le+t.vertexShader,fragmentShader:t.fragmentShader,uniforms:t.uniforms,transparent:t.transparent??!0,blending:t.blending??q,depthWrite:t.depthWrite??!1,side:t.side??D,...t.glslVersion?{glslVersion:t.glslVersion}:{}})}function Ue(t){return T({uniforms:{...t.uniforms,uSize:{value:t.size},...t.coreColor?{uCoreColor:{value:new F(t.coreColor)}}:{},...t.glowColor?{uGlowColor:{value:new F(t.glowColor)}}:{}},vertexShader:Pe,fragmentShader:ke,includeWake:!0,transparent:t.transparent??!0,blending:t.blending??X,depthWrite:t.depthWrite??!1,side:t.side??D})}function je(t){return T({uniforms:{...t.uniforms,uAccentColor:{value:new F(t.accentColor??"#8B5CF6")},uFlowSpeed:{value:t.flowSpeed??1.8}},vertexShader:Re,fragmentShader:_e,includeWake:!0,transparent:t.transparent??!0,blending:t.blending??q,depthWrite:t.depthWrite??!1,side:t.side??D})}function Ye(t){return T({uniforms:{...t.uniforms,uAccentColor:{value:new F(t.accentColor??"#8B5CF6")},uGridFreq:{value:new re(...t.gridFreq??[24,24])},uFlowSpeed:{value:t.flowSpeed??2.2},uWaveAmp:{value:t.waveAmp??0},uWaveFreq:{value:t.waveFreq??1}},vertexShader:ze,fragmentShader:De,includeWake:!0,transparent:t.transparent??!0,blending:t.blending??q,depthWrite:t.depthWrite??!0,side:t.side??D})}class Te extends _{mesh;geo=null;mat=null;fullRange=0;halfRange=0;attachMesh(e,o,n={}){this.geo=e,this.mat=o,this.mesh=new ae(e,o),this.group.add(this.mesh),this.resources.track(e),this.resources.track(o),this.fullRange=n.fullRange??e.index?.count??e.getAttribute("position").count,this.halfRange=n.halfRange??Math.floor(this.fullRange/2),this.setLOD(0)}setLOD(e){this.currentLOD=e,this.mesh&&(this.mesh.visible=e<2,this.geo?.setDrawRange(0,e===0?this.fullRange:this.halfRange),super.setLOD(e))}}const Ee=`attribute float aZetaArg;
attribute float aZetaMag;
attribute float aZero;

varying vec2 vUv;
varying float vArg;
varying float vMag;
varying float vZero;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  vArg = aZetaArg;
  vMag = aZetaMag;
  vZero = aZero;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);
  float wake;
  world.xyz = applyProximityWake(world.xyz, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,Ne=`uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;

varying vec2 vUv;
varying float vArg;
varying float vMag;
varying float vZero;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.3);
  float hue = fract(vArg / 6.2831853 + 0.5);
  vec3 col = hsv2rgb(vec3(hue, 0.72, 0.92));
  col *= 0.62 + clamp(vMag, 0.0, 1.0) * 0.55;
  col = mix(col, uGlowColor, fresnel * 0.45);
  float flow = 0.5 + 0.5 * sin(vUv.y * 34.0 - uTime * 2.4 + vUv.x * 8.0);
  col += uCoreColor * (vZero * 1.8 + flow * 0.06);
  col *= 1.0 + vWake * 0.3;
  gl_FragColor = vec4(col, clamp(0.38 + fresnel * 0.32 + vZero * 0.25, 0.0, 0.96));
}
`;function Oe(t,e,o=140){let n=0,r=0;for(let g=1;g<=o;g++){const v=Math.log(g),M=Math.exp(-t*v),s=-e*v,h=g%2===1?1:-1;n+=h*M*Math.cos(s),r+=h*M*Math.sin(s)}const a=Math.exp((1-t)*Math.LN2),i=-e*Math.LN2,l=1-a*Math.cos(i),p=-a*Math.sin(i),u=Math.max(l*l+p*p,1e-12),f=(n*l+r*p)/u,c=(r*l-n*p)/u;return{re:f,im:c,mag:Math.hypot(f,c),arg:Math.atan2(c,f)}}const k=64,R=96;class Ke extends Te{init(){const e=(this.config.params?.zeros??[]).slice(),o=k+1,n=R+1,r=o*n,a=new Float32Array(r*3),i=new Float32Array(r*2),l=new Float32Array(r),p=new Float32Array(r),u=new Float32Array(r),f=[];for(let s=0;s<=k;s++){const h=.05+s/k*.9;for(let m=0;m<=R;m++){const w=10+m/R*40,S=Oe(h,w),y=s*n+m;a[y*3]=2.4*(h-.5),a[y*3+1]=(w-30)/12,a[y*3+2]=.65*Math.log1p(S.mag),i[y*2]=s/k,i[y*2+1]=m/R,l[y]=S.arg,p[y]=Math.min(1,S.mag);let x=0;for(const C of e){const B=(h-.5)/.06,Z=(w-C)/.2;x=Math.max(x,Math.exp(-(B*B+Z*Z)))}u[y]=x}}for(let s=0;s<k;s++)for(let h=0;h<R;h++){const m=s*n+h,w=m+n;f.push(m,w,w+1,m,w+1,m+1)}const c=new ie;c.setAttribute("position",new A(a,3)),c.setAttribute("uv",new A(i,2)),c.setAttribute("aZetaArg",new A(l,1)),c.setAttribute("aZetaMag",new A(p,1)),c.setAttribute("aZero",new A(u,1)),c.setIndex(f),c.computeVertexNormals();let g=1e-6;const v=c.getAttribute("position");for(let s=0;s<v.count;s++)g=Math.max(g,Math.hypot(v.getX(s),v.getY(s),v.getZ(s)));c.scale(1.25/g,1.25/g,1.25/g);const M=T({vertexShader:Ee,fragmentShader:Ne,uniforms:{...this.uniforms,uCoreColor:{value:new F(this.config.coreColor)},uGlowColor:{value:new F(this.config.glowColor)}},includeWake:!0,transparent:!0,side:se,depthWrite:!1});this.attachMesh(c,M)}update(e,o,n,r){super.update(e,o,n,r),this.spinBy(e,0,.14,.04)}}const Le="math-cosmos-locale",V=[{code:"zh",name:"中文",short:"中",htmlLang:"zh-CN"},{code:"en",name:"English",short:"EN",htmlLang:"en"},{code:"ja",name:"日本語",short:"日",htmlLang:"ja"},{code:"ko",name:"한국어",short:"한",htmlLang:"ko"},{code:"de",name:"Deutsch",short:"DE",htmlLang:"de"},{code:"fr",name:"Français",short:"FR",htmlLang:"fr"},{code:"ru",name:"Русский",short:"RU",htmlLang:"ru"}],Ve=new Set(V.map(t=>t.code));function I(t){return typeof t=="string"&&Ve.has(t)}function Ge(){try{const t=window.localStorage.getItem(Le);return I(t)?t:null}catch{return null}}function qe(){const t=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];for(const e of t){const o=String(e).toLowerCase().split("-")[0];if(I(o))return o}return"en"}function He(){if(I(window.__LANDING_LOCALE__))return window.__LANDING_LOCALE__;const t=Ge();return t||qe()}function Xe(t){return V.find(e=>e.code===t)??V[0]}export{_ as B,Ze as L,Be as N,Te as S,Ke as Z,je as a,T as b,Ue as c,Ye as d,ce as e,pe as f,_e as g,V as h,I as i,Le as j,He as k,Xe as l,qe as m,le as p,Ge as r};
