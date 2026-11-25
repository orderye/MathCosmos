import{p as gt,N as xn,B as D,c as ne,S as oe,a as ke,b as q,g as en,d as Mn,e as tn,Z as Cn,L as An,f as Sn,h as Pn,i as Fn,j as kn,l as En,k as zn}from"./locale-BdBS8SZH.js";import{q as Tn,r as Dn,e as nn,C as A,P as Rn,G as on,H as sn,s as w,Q as T,t as O,u as Y,v as lt,h as ue,w as z,I as Ee,x as an,y as de,z as pe,J as te,M as V,K as xe,X as Ln,Y as Fe,Z as ct,_ as ot,o as M,n as k,$ as _,g as ie,a0 as qn,i as fe,a1 as _n,f as Wn,a2 as In,a3 as Gn,a4 as it,a5 as Vn,a6 as ze,a7 as Me,a8 as rn,a9 as ge,p as vt,aa as st,W as wt,ab as yt,L as bt,O as On,V as ln,ac as Bn}from"./three-BADZquTA.js";import{E as Un,R as jn,B as Nn,T as Hn,a as Zn,V as Kn,b as Yn}from"./postprocessing-XBrXsaaq.js";import{k as $n}from"./katex-CByVO7i9.js";const Xn=.1;class Qn{constructor(e){this.renderer=e}updateMs=0;renderMs=0;frameMs=0;sample(e,t,o){this.updateMs=this.ema(this.updateMs,e),this.renderMs=this.ema(this.renderMs,t),this.frameMs=this.ema(this.frameMs,o)}reset(){this.updateMs=0,this.renderMs=0,this.frameMs=0}snapshot(){const e=this.renderer.info;return{updateMs:Re(this.updateMs),renderMs:Re(this.renderMs),frameMs:Re(this.frameMs),fps:this.frameMs>0?Re(1e3/this.frameMs):0,drawCalls:e.render.calls,triangles:Math.round(e.render.triangles),programs:e.programs?.length??0,geometries:e.memory.geometries,textures:e.memory.textures}}ema(e,t){return e===0?t:e+(t-e)*Xn}}function Re(s){return Math.round(s*100)/100}class Jn{renderer;scene;camera;universeRoot;perf;composer;onUpdate;rafId=0;lastTime=0;elapsed=0;constructor(e,t){this.onUpdate=t,this.renderer=new Tn({canvas:e,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.toneMapping=Dn,this.renderer.info.autoReset=!1,this.perf=new Qn(this.renderer),this.scene=new nn,this.scene.background=new A("#030306"),this.camera=new Rn(60,window.innerWidth/window.innerHeight,.1,12e3),this.universeRoot=new on,this.scene.add(this.universeRoot),this.composer=new Un(this.renderer,{frameBufferType:sn}),this.composer.addPass(new jn(this.scene,this.camera));const o=new Nn({luminanceThreshold:.85,luminanceSmoothing:.02,mipmapBlur:!0,intensity:1.35}),n=new Hn({mode:Zn.ACES_FILMIC}),i=new Kn({offset:.28,darkness:.55});this.composer.addPass(new Yn(this.camera,o,n,i)),window.addEventListener("resize",this.handleResize)}start(){this.lastTime=performance.now(),this.rafId=requestAnimationFrame(this.tick)}dispose(){cancelAnimationFrame(this.rafId),window.removeEventListener("resize",this.handleResize),this.composer.dispose(),this.renderer.dispose()}tick=e=>{this.rafId=requestAnimationFrame(this.tick);const t=Math.min(Math.max((e-this.lastTime)/1e3,0),.05);this.lastTime=e,this.elapsed+=t;const o=performance.now();this.onUpdate(t,this.elapsed);const n=performance.now();this.renderer.info.reset(),this.composer.render(t);const i=performance.now();this.perf.sample(n-o,i-n,t*1e3)};handleResize=()=>{const e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t)}}const eo=.1;class to{systems=[];timings=new Map;add(...e){return this.systems.push(...e),this}update(e,t,o){for(const n of this.systems){const i=performance.now();n.update(e,t,o);const a=performance.now()-i,l=this.timings.get(n.name)??0;this.timings.set(n.name,l===0?a:l+(a-l)*eo)}}get timing(){return this.systems.map(e=>({name:e.name,ms:Math.round((this.timings.get(e.name)??0)*1e3)/1e3}))}dispose(){for(const e of this.systems)e.dispose?.();this.systems.length=0,this.timings.clear()}get names(){return this.systems.map(e=>e.name)}}const E={BASE_THRUST_ACCEL:260,STRAFE_THRUST_ACCEL:190,MAX_CRUISE_SPEED:145,WARP_THRUST_ACCEL:580,MAX_WARP_SPEED:460,LINEAR_DRAG_COEFF:2.1,WARP_DRAG_COEFF:1.35,ANGULAR_SENSITIVITY:.0022,ROLL_SPEED_KEY:1.65,AUTO_BANK_FACTOR:.24,BASE_FOV:60,MAX_WARP_FOV:82,SPINE_SAFE_RADIUS:38,SPINE_REPEL_K:320},ht=new w(1,0,0),no=new w(0,1,0),cn=new w(0,0,1),Ve=new w(0,1,0),oo=new Set(["KeyW","KeyA","KeyS","KeyD","KeyQ","KeyE","Space","ControlLeft","ControlRight","ShiftLeft","ShiftRight"]);function io(s,e,t){const o=Math.min(Math.max((t-s)/(e-s),0),1);return o*o*(3-2*o)}function so(s){return s*s*s*(s*(s*6-15)+10)}class ao{bank=0;tmpQ=new T;sync(e,t,o,n,i,a){e.position.copy(t),e.quaternion.copy(o),this.bank+=(i-this.bank)*(1-Math.exp(-6*a)),this.tmpQ.setFromAxisAngle(cn,this.bank),e.quaternion.multiply(this.tmpQ);const l=E.BASE_FOV+(E.MAX_WARP_FOV-E.BASE_FOV)*io(110,460,n);e.fov+=(l-e.fov)*(1-Math.exp(-6*a)),e.updateProjectionMatrix()}}class ro{constructor(e,t){this.canvas=e,this.handlers=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),e.addEventListener("mousedown",this.onMouseDown),window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("mousemove",this.onMouseMove),e.addEventListener("click",this.onClick),e.addEventListener("contextmenu",this.onContextMenu)}keys=new Set;mouseDX=0;mouseDY=0;dragging=!1;has(e){return this.keys.has(e)}takeMouseDX(){const e=this.mouseDX;return this.mouseDX=0,e}takeMouseDY(){const e=this.mouseDY;return this.mouseDY=0,e}clear(){this.keys.clear(),this.dragging=!1}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),this.canvas.removeEventListener("mousedown",this.onMouseDown),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),this.canvas.removeEventListener("click",this.onClick),this.canvas.removeEventListener("contextmenu",this.onContextMenu)}onKeyDown=e=>{(e.code==="Space"||e.code==="ControlLeft"||e.code==="ControlRight")&&e.preventDefault(),oo.has(e.code)&&this.handlers.onMoveInput(),this.keys.add(e.code)};onKeyUp=e=>{this.keys.delete(e.code)};onBlur=()=>{this.clear()};onMouseDown=e=>{e.button===0&&(this.dragging=!0)};onMouseUp=()=>{this.dragging=!1};onMouseMove=e=>{(document.pointerLockElement===this.canvas||this.dragging)&&(this.mouseDX+=e.movementX,this.mouseDY+=e.movementY)};onClick=e=>{this.handlers.onPick(e.clientX,e.clientY)||document.pointerLockElement!==this.canvas&&this.canvas.requestPointerLock()};onContextMenu=e=>{e.preventDefault()}}class lo{constructor(e){this.input=e}rollVel=0;tmpQ=new T;tmpAccel=new w;tmpRight=new w;resetRoll(){this.rollVel=0}update(e,t,o,n,i,a){this.rollVel*=Math.exp(-9.5*e);const l=(this.input.has("KeyE")?1:0)-(this.input.has("KeyQ")?1:0);l!==0&&(this.rollVel=O.lerp(this.rollVel,l*E.ROLL_SPEED_KEY,1-Math.exp(-9.5*e)));const r=this.input.takeMouseDX(),m=-this.input.takeMouseDY()*E.ANGULAR_SENSITIVITY,h=-r*E.ANGULAR_SENSITIVITY,p=-this.rollVel*e;this.tmpQ.setFromAxisAngle(no,h),a.multiply(this.tmpQ),this.tmpQ.setFromAxisAngle(ht,m),a.multiply(this.tmpQ),this.tmpQ.setFromAxisAngle(cn,p),a.multiply(this.tmpQ).normalize();const u=this.input.has("ShiftLeft")||this.input.has("ShiftRight")?1:0;o+=(u-o)*(1-Math.exp(-5*e));const c=O.lerp(E.MAX_CRUISE_SPEED,E.MAX_WARP_SPEED,o),f=O.lerp(E.LINEAR_DRAG_COEFF,E.WARP_DRAG_COEFF,o),v=O.lerp(E.BASE_THRUST_ACCEL,E.WARP_THRUST_ACCEL,o),g=(this.input.has("KeyW")?1:0)-(this.input.has("KeyS")?1:0),b=(this.input.has("KeyD")?1:0)-(this.input.has("KeyA")?1:0),y=(this.input.has("Space")?1:0)-(this.input.has("ControlLeft")||this.input.has("ControlRight")?1:0);this.tmpAccel.set(b*E.STRAFE_THRUST_ACCEL,y*E.STRAFE_THRUST_ACCEL,-g*v).applyQuaternion(a);const x=Math.exp(-f*e);i.multiplyScalar(x).addScaledVector(this.tmpAccel,(1-x)/f);const C=Math.hypot(t.x,t.z);if(C<E.SPINE_SAFE_RADIUS){const L=C>1e-4?1/C:0,W=1-C/E.SPINE_SAFE_RADIUS,R=E.SPINE_REPEL_K*W*W*e;i.x+=t.x*L*R,i.z+=t.z*L*R,C<=1e-4&&(i.x+=R)}let S=i.length();S>c&&i.multiplyScalar(c/S),S=Math.min(S,c),n.addScaledVector(i,e),this.tmpRight.set(1,0,0).applyQuaternion(a);const P=i.dot(this.tmpRight),F=e>0?h/e:0,H=O.clamp(E.AUTO_BANK_FACTOR*(P/E.MAX_CRUISE_SPEED-.35*F),-.24,E.AUTO_BANK_FACTOR);return{speed:S,warpFactor:o,bankTarget:H}}}class co{radial=new w;tangent=new w;targetPos=new w;nextPos=new w;tmpMatrix=new Y;tmpQ=new T;angle=0;baseY=0;radius=0;begin(e,t,o){this.targetPos.copy(t.group.position).add(t.universeRoot.position),this.radius=o,this.angle=0,this.radial.subVectors(e,this.targetPos),this.radial.lengthSq()<1e-6&&this.radial.copy(ht),this.radial.normalize(),this.tangent.crossVectors(this.radial,Ve).normalize(),this.baseY=e.y-this.targetPos.y}update(e,t,o,n,i){this.targetPos.copy(i.group.position).add(i.universeRoot.position),this.angle+=.18*e;const a=Math.cos(this.angle),l=Math.sin(this.angle);this.nextPos.copy(this.targetPos).addScaledVector(this.radial,a*this.radius).addScaledVector(this.tangent,l*this.radius),i.kind==="riemann"&&(this.nextPos.y=this.targetPos.y+O.clamp(this.baseY+280*Math.sin(this.angle*.45),-250,350)),e>1e-6&&o.subVectors(this.nextPos,t).multiplyScalar(1/e);const r=o.length();return t.copy(this.nextPos),this.tmpMatrix.lookAt(t,this.targetPos,Ve),this.tmpQ.setFromRotationMatrix(this.tmpMatrix),n.slerp(this.tmpQ,1-Math.exp(-6*e)),{speed:r}}}class ho{p0=new w;p1=new w;p2=new w;p3=new w;targetPos=new w;aimPos=new w;viewDir=new w;approach=new w;bow=new w;nextPos=new w;tmpMatrix=new Y;tmpQ=new T;transitTime=0;transitDuration=0;distance=0;safeRadius=0;get orbitRadius(){return this.safeRadius}start(e,t){this.targetPos.copy(t.group.position).add(t.universeRoot.position),this.p0.copy(e),this.safeRadius=t.kind==="riemann"?950:t.radius*2.4,this.viewDir.subVectors(this.p0,this.targetPos),this.viewDir.lengthSq()<1e-6?this.viewDir.set(0,0,1):this.viewDir.normalize(),this.p3.copy(this.targetPos).addScaledVector(this.viewDir,this.safeRadius),this.approach.subVectors(this.p3,this.p0),this.distance=this.approach.length(),this.distance<1e-4?this.approach.set(0,0,-1):this.approach.multiplyScalar(1/this.distance),this.bow.crossVectors(this.approach,Ve),this.bow.lengthSq()<1e-6&&this.bow.copy(ht),this.bow.normalize().multiplyScalar(this.distance*.2),this.p1.copy(this.p0).addScaledVector(this.approach,this.distance*.28).add(this.bow),this.p2.copy(this.p3).addScaledVector(this.approach,-this.distance*.28).add(this.bow),this.transitDuration=O.clamp(this.distance/320,2.2,4.8),this.transitTime=0}rebaseOrigin(e){this.p0.sub(e),this.p1.sub(e),this.p2.sub(e),this.p3.sub(e),this.targetPos.sub(e)}update(e,t,o,n,i){this.transitTime+=e;const a=Math.min(this.transitTime/this.transitDuration,1),l=so(a),r=1-l;if(this.targetPos.copy(i.group.position).add(i.universeRoot.position),i.velocity){const m=t.distanceTo(this.targetPos),h=O.clamp(m/320,0,3)*.5*(1-a);this.aimPos.copy(this.targetPos).addScaledVector(i.velocity,h)}else this.aimPos.copy(this.targetPos);this.viewDir.subVectors(t,this.aimPos),this.viewDir.lengthSq()<1e-6?this.viewDir.copy(this.approach).negate():this.viewDir.normalize(),this.p3.copy(this.aimPos).addScaledVector(this.viewDir,this.safeRadius),this.nextPos.copy(this.p0).multiplyScalar(r*r*r).addScaledVector(this.p1,3*r*r*l).addScaledVector(this.p2,3*r*l*l).addScaledVector(this.p3,l*l*l),e>1e-6&&o.subVectors(this.nextPos,t).multiplyScalar(1/e);const d=o.length();return t.copy(this.nextPos),this.tmpMatrix.lookAt(t,this.aimPos,Ve),this.tmpQ.setFromRotationMatrix(this.tmpMatrix),n.slerp(this.tmpQ,1-Math.exp(-4*e)),{speed:d,arrived:a>=1}}}class uo{position=new w(0,60,900);velocity=new w;quaternion=new T;speed=0;warpFactor=0;state="FREE_FLIGHT";target=null;pickHandler=null;camera;input;manual;warp=new ho;orbit=new co;cameraRig=new ao;onStateChange;constructor(e,t,o=()=>{}){this.camera=e,this.onStateChange=o,this.camera.position.copy(this.position),this.input=new ro(t,{onMoveInput:()=>this.detach(),onPick:(n,i)=>this.pickHandler?this.pickHandler(n,i):!1}),this.manual=new lo(this.input)}warpTo(e){this.target=e,this.warp.start(this.position,e),this.warpFactor=1,this.manual.resetRoll(),this.setState("WARP_TRANSIT")}detach(){this.state!=="FREE_FLIGHT"&&(this.target=null,this.setState("FREE_FLIGHT"))}rebaseOrigin(e){this.warp.rebaseOrigin(e)}update(e,t){if(this.state==="FREE_FLIGHT"){const n=this.manual.update(e,t,this.warpFactor,this.position,this.velocity,this.quaternion);this.warpFactor=n.warpFactor,this.speed=n.speed,this.cameraRig.sync(this.camera,this.position,this.quaternion,this.speed,n.bankTarget,e);return}const o=this.target;if(this.state==="WARP_TRANSIT"){const n=this.warp.update(e,this.position,this.velocity,this.quaternion,o);this.speed=n.speed,n.arrived&&(this.orbit.begin(this.position,o,this.warp.orbitRadius),this.setState("ORBIT_LOCK"))}else{const n=this.orbit.update(e,this.position,this.velocity,this.quaternion,o);this.speed=n.speed}this.cameraRig.sync(this.camera,this.position,this.quaternion,this.speed,0,e)}dispose(){this.input.dispose()}setState(e){this.state!==e&&(this.state=e,this.onStateChange(e))}}const xt=4500;class po{worldOffset=new w;camera;universeRoot;flightPosition;onRebase;constructor(e,t,o,n){this.camera=e,this.universeRoot=t,this.flightPosition=o,this.onRebase=n}update(){this.camera.position.lengthSq()<=xt*xt||(this.flightPosition.sub(this.camera.position),this.onRebase?.(this.camera.position),this.worldOffset.add(this.camera.position),this.universeRoot.position.sub(this.camera.position),this.camera.position.set(0,0,0))}toLogical(e,t){return t.copy(e).add(this.worldOffset)}}const mo=`// 尘埃场顶点着色器：mod 空间折叠包裹玩家 + 曲速星轨拉伸
// 实例偏移量为静态逻辑坐标，uPlayerPos 亦为逻辑坐标 → 浮动原点重置零跳变
uniform vec3 uPlayerPos;
uniform vec3 uPlayerVel;
uniform vec3 uWorldOffset;
uniform float uTime;
uniform float uViewportHeight;

attribute float aSeed;
attribute float aBright;

varying float vBright;
varying float vFade;
varying float vAxis;

const float BOX = 4000.0;
const float HALF = 2000.0;

void main() {
  vec3 center = mod(instanceMatrix[3].xyz - uPlayerPos + HALF, BOX) - HALF + uPlayerPos;

  float speed = length(uPlayerVel);
  vec3 dir = speed > 1.0 ? uPlayerVel / speed : vec3(0.0, 0.0, 1.0);
  // §1.3：|v| > 160 时沿速度方向拉长至 1 + 4.5 * (|v|-160)/300 倍
  float stretch = 1.0 + 4.5 * clamp((speed - 160.0) / 300.0, 0.0, 1.0);

  // 屏幕空间恒定 ~1.15px 线宽：按距离反推世界宽度，避免远距亚像素不可见
  float dist = length(center - uPlayerPos);
  float widthWorld = dist * 1.5 / (0.5 * uViewportHeight * projectionMatrix[1][1]);
  vec3 widthVec = mat3(instanceMatrix) * vec3(position.x, position.y, 0.0) * (widthWorld / 0.16);
  vec3 lengthVec = mat3(instanceMatrix) * vec3(0.0, 0.0, position.z);
  // 曲速时线段整体转向速度矢量并拉长，形成放射星轨
  float align = clamp((speed - 160.0) / 300.0, 0.0, 1.0);
  float lenZ = length(instanceMatrix[2].xyz);
  vec3 streakVec = dir * (position.z * lenZ * stretch);
  vec3 shaped = widthVec + mix(lengthVec, streakVec, align);

  vec3 renderPos = center + shaped - uWorldOffset;
  vec4 mvPosition = modelViewMatrix * vec4(renderPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float edgeFade = 1.0 - smoothstep(1500.0, 1990.0, dist);
  float twinkle = 0.85 + 0.15 * sin(uTime * (0.4 + aSeed) + aSeed * 40.0);
  vBright = aBright * twinkle;
  vFade = edgeFade;
  vAxis = position.z;
}`,fo=`// 尘埃场片元着色器：暗灰紫短线段，两端柔和淡出，亮度远低于 Bloom 阈值 0.85
uniform vec3 uDustColor;

varying float vBright;
varying float vFade;
varying float vAxis;

void main() {
  float endFade = 1.0 - smoothstep(0.28, 0.5, abs(vAxis));
  float alpha = vBright * vFade * endFade;
  gl_FragColor = vec4(uDustColor * alpha, alpha);
}`,Le=15e3,Be=4e3;class go{mesh;uniforms;geometry;material;constructor(){this.geometry=new lt(.16,.16,1),this.uniforms={uPlayerPos:{value:new w},uPlayerVel:{value:new w},uWorldOffset:{value:new w},uTime:{value:0},uViewportHeight:{value:1080},uDustColor:{value:new A("#8a7fa8")}},this.material=new ue({vertexShader:mo,fragmentShader:fo,uniforms:this.uniforms,transparent:!0,blending:z,depthWrite:!1}),this.mesh=new Ee(this.geometry,this.material,Le),this.mesh.frustumCulled=!1;const e=new Y,t=new T,o=new an,n=new w,i=new w,a=new Float32Array(Le),l=new Float32Array(Le);for(let r=0;r<Le;r++)n.set((Math.random()-.5)*Be,(Math.random()-.5)*Be,(Math.random()-.5)*Be),o.set(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2),t.setFromEuler(o),i.set(1,1,3+Math.random()*10),e.compose(n,t,i),this.mesh.setMatrixAt(r,e),a[r]=Math.random(),l[r]=.12+Math.random()*.28;this.mesh.instanceMatrix.needsUpdate=!0,this.geometry.setAttribute("aSeed",new de(a,1)),this.geometry.setAttribute("aBright",new de(l,1))}sync(e,t,o,n,i){this.uniforms.uPlayerPos.value.copy(e),this.uniforms.uPlayerVel.value.copy(t),this.uniforms.uWorldOffset.value.copy(o),this.uniforms.uTime.value=n,this.uniforms.uViewportHeight.value=i}dispose(){this.geometry.dispose(),this.material.dispose()}}const vo=[[119,"riemannHypothesis","left"],[116,"rhOfAll","right"],[113,"everyCharacter","left"],[110,"every_character_of_literature","right"],[107,"theta_integrals","left"],[101,"automorphy_of_hypotheses","right"],[98,"open0_of_unitary_group","left"],[96,"published_results_arithmetic","right"],[93,"vwin_of_row","left"],[89,"galoisLocalGlobalStrong","left"],[86,"topCovolSlim2","left"],[84,"published_results_eigen","right"],[83,"DivisorProofs","left"],[80,"allRows_of_open0","left"],[79,"moduliScheme","right"],[74,"ontoX_and_lamLow","right"],[42,"Weil","left"],[31,"integral_part_lemma","right"],[12,"AcrisZero","left"],[5,"Tilt","right"]],Mt=18590801,le=120,wo=[[0,.35],[.35,.7],[.7,1]];function yo(s){let e=s>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const $=(s,e,t=1)=>[s[0]+e[0]*t,s[1]+e[1]*t,s[2]+e[2]*t],bo=s=>{const e=Math.hypot(s[0],s[1],s[2])||1;return[s[0]/e,s[1]/e,s[2]/e]};function xo(){const s=yo(Mt),e=new Map(vo.map(([d,m,h])=>[d,{label:m,side:h}])),t=[],o=[],n=[],i=[];for(let d=0;d<le;d++){const m=d/(le-1),h=[45*Math.sin(2.5*Math.PI*m)+15*Math.sin(9*Math.PI*m),-600+1200*m,35*Math.cos(2*Math.PI*m)+12*Math.cos(7*Math.PI*m)];t.push(h);const p=`spine_${String(d).padStart(3,"0")}`;o.push(p);const u=e.get(d);if(n.push({id:p,label:u?u.label:p,role:d===le-1?"crown":"spine",stepIndex:d,hopDistance:0,position:h,radius:d===le-1?22:2.2,weight:1,calloutSide:u?.side,calloutPriority:u?d===le-1?1:2:void 0}),d>0){const c=t[d-1],f=[h[0]-c[0],h[1]-c[1],h[2]-c[2]];i.push({id:`trunk_${d}`,sourceId:o[d-1],targetId:p,edgeType:"spine_trunk",controlPoints:[c,$(c,f,1/3),$(c,f,2/3),h],baseRadius:2.2,tipRadius:2.2,hopStart:0,hopEnd:0,spineProgress:m})}}let a=0;const l=["lemma_primary","lemma_secondary","lemma_leaf"],r=(d,m,h,p,u,c)=>{const f=h===1?150+s()*80:h===2?60+s()*40:30+s()*22,v=$(d,m,f),g=()=>[(s()-.5)*f*.24,(s()-.5)*f*.24,(s()-.5)*f*.24],b=`lemma_s${p}_d${h}_${a}`,[y,x]=wo[h-1],C=4.5*Math.pow(.55,h-1);if(i.push({id:`edge_${a++}`,sourceId:u,targetId:b,edgeType:"branch_nerve",controlPoints:[d,$(d,m,f*.33),$(d,m,f*.66),v].map((S,P)=>P===1||P===2?$(S,g()):S),baseRadius:C,tipRadius:C*.6,hopStart:y,hopEnd:x,spineProgress:p/(le-1)}),n.push({id:b,label:b,role:l[h-1],stepIndex:p,hopDistance:h,position:v,radius:h===3?.5:C*.55,weight:.3+s()*.6}),h===3){c.push(v);return}for(let S=0;S<2;S++){const P=bo([m[0]*.85+(s()-.5)*.55,m[1]*.85+(s()-.5)*.55-.18*h,m[2]*.85+(s()-.5)*.55]);r(v,P,h+1,p,b,c)}};for(let d=0;d<le;d++){const m=[],h=d>=116?0:3+Math.floor(s()*2);for(let u=0;u<h;u++){const f=((u%2===0?1:-1)>0?0:Math.PI)+(s()-.5)*.7,v=(s()-.5)*.8,g=[Math.cos(f)*Math.cos(v),Math.sin(v),Math.sin(f)*Math.cos(v)];r(t[d],g,1,d,o[d],m)}const p=1+(s()<.6?1:0);for(let u=0;u<p&&m.length>0;u++){const c=m[Math.floor(s()*m.length)],f=[(s()-.5)*160,(s()-.5)*120,(s()-.5)*160],v=$($(t[d],c,.33),f),g=$($(t[d],c,.7),f,.6);i.push({id:`fiber_${a++}`,sourceId:o[d],targetId:`tip_${d}_${u}`,edgeType:"branch_nerve",controlPoints:[t[d],v,g,c],baseRadius:.4,tipRadius:.22,hopStart:0,hopEnd:.9,spineProgress:d/(le-1)})}}return{version:"1.0.0",seed:Mt,boundingBox:{min:[-420,-640,-240],max:[420,640,240]},legend:{trunkDesc:"trunk = 120-step proof spine",branchesDesc:"branches = sampled lemmas it names",dustDesc:"dust = files never reached"},spineNodeIds:o,spinePoints:t,nodes:n,edges:i}}function Mo(s){return s.nodes.filter(e=>e.calloutSide).map(e=>({label:e.label,side:e.calloutSide,priority:e.calloutPriority??3,position:e.position}))}const ut=500,dt=3400,Co=(ut+dt)/2,Ue=(dt-ut)/2,Ao=220,So=Math.PI*2,Ct=So/Ao,je=.28,Ne=360,He=120,Po=380,At=Math.PI/3,St=new w(0,1,0);class hn{tangent=new w;second=new w;normal=new w;binormal=new w;upRef=new w;cross=new w;basis=new Y;sample(e,t,o,n){const i=e*Ct,a=Math.cos(i),l=Math.sin(i),r=Co-Ue*a,d=Ue*l,m=Ue*a,h=i+je*Math.sin(2*i),p=Math.cos(h),u=Math.sin(h),c=1+2*je*Math.cos(2*i),f=-4*je*Math.sin(2*i),v=Ne*Math.sin(i+.8)+He*Math.sin(3*i+1.2),g=Ne*Math.cos(i+.8)+3*He*Math.cos(3*i+1.2),b=-Ne*Math.sin(i+.8)-9*He*Math.sin(3*i+1.2);t.set(r*p,v,r*u);const y=d*p-r*u*c,x=d*u+r*p*c;o.set(y,g,x).multiplyScalar(Ct),this.tangent.copy(o).normalize();const C=m*p-2*d*u*c-r*p*c*c-r*u*f,S=m*u+2*d*p*c-r*u*c*c+r*p*f;this.second.set(C,b,S),this.cross.crossVectors(this.tangent,this.second);const P=y*y+g*g+x*x,F=this.cross.dot(St)/Math.max(P,1e-6),H=O.clamp(Po*F,-At,At);this.upRef.copy(St).addScaledVector(this.tangent,-this.tangent.y),this.upRef.lengthSq()<1e-8&&this.upRef.set(1,0,0).addScaledVector(this.tangent,-this.tangent.x),this.normal.copy(this.upRef).normalize(),this.binormal.crossVectors(this.normal,this.tangent);const L=H+.22*Math.sin(2*i),W=Math.cos(L),R=Math.sin(L);this.cross.copy(this.normal).multiplyScalar(W).addScaledVector(this.binormal,R),this.binormal.multiplyScalar(W).addScaledVector(this.normal,-R),this.basis.makeBasis(this.cross,this.tangent,this.binormal),n.setFromRotationMatrix(this.basis)}}const Fo=720,Pt=60,ko=170,Eo=220,zo=new w(0,1,0);class To{path=new hn;pathTime=0;deterWeight=0;basePos=new w;baseVel=new w;baseQuat=new T;lateral=new w;axisX=new w;axisZ=new w;toPlayer=new w;deterQuat=new T;get deterrence(){return this.deterWeight}update(e,t,o,n,i,a){const l=.45*Math.sin(t*.07+.4),r=.35*Math.sin(t*.23+1.1),d=Math.max(.25,1+l+r-.45*this.deterWeight);this.pathTime+=e*d,this.path.sample(this.pathTime,this.basePos,this.baseVel,this.baseQuat),this.axisX.set(1,0,0).applyQuaternion(this.baseQuat),this.axisZ.set(0,0,1).applyQuaternion(this.baseQuat);const m=t*.5,h=t*.83+2.1,p=Math.hypot(this.basePos.x,this.basePos.z),u=Math.min(p-ut,dt-p),c=O.smoothstep(u,0,Eo);this.lateral.copy(this.axisX).multiplyScalar(Math.sin(m)*Pt*c).addScaledVector(this.axisZ,Math.sin(h)*Pt*.6*c);const f=Math.sin(t*.09+1.3)*ko*(.55+.45*Math.sin(t*.041))*c;n.copy(this.basePos).add(this.lateral),n.y+=f;const v=o.distanceTo(n),g=O.clamp(1-v/Fo,0,1);return this.deterWeight+=(g-this.deterWeight)*Math.min(1,e*2.5),i.copy(this.baseVel).multiplyScalar(d),a.copy(this.baseQuat),this.deterWeight>.02&&(this.toPlayer.copy(o).sub(n),this.toPlayer.lengthSq()>1e-6&&(this.toPlayer.normalize(),this.deterQuat.setFromUnitVectors(zo,this.toPlayer),a.slerp(this.deterQuat,.55*this.deterWeight))),this.deterWeight}}const Do=`// Ashima 3D Simplex Noise（公共片）
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}`,Ze=`// 黎曼巨兽全身行波：s=0 尾部、s=1 皇冠，两端摆幅放大、中段收敛（规格 §3.1）
uniform float uTime;
uniform float uSpineWaveAmp;
uniform float uSpineWaveOmega;
uniform float uSpineWaveK;

vec3 leviathanSpineWave(float s) {
    float clampedS = clamp(s, 0.0, 1.0);
    float envelope = 12.0 + uSpineWaveAmp * pow(abs(clampedS * 2.0 - 1.0), 1.8);
    float phase = uSpineWaveOmega * uTime - uSpineWaveK * clampedS;
    float lateral = sin(phase) * envelope;
    float vertical = cos(phase + 0.785398) * envelope * 0.55;
    return vec3(lateral, 0.0, vertical);
}
`,Ro=`uniform float uJitter;
uniform float uNoiseFreq;

varying vec2 vUv;
varying float vWake;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  // 体轴归一化：脊柱局部 y ∈ [-600, 600]
  float spineS = clamp((position.y + 600.0) / 1200.0, 0.0, 1.0);
  vec3 localPos = position + leviathanSpineWave(spineS);
  vec3 worldPos = (modelMatrix * vec4(localPos, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  // 高压电流：低频 + 高频双层 Simplex 沿法线抖动
  float n1 = snoise(worldPos * uNoiseFreq + vec3(0.0, uTime * 0.6, 0.0));
  float n2 = snoise(worldPos * uNoiseFreq * 3.7 - vec3(uTime * 0.9, 0.0, 0.0));
  vec3 displaced = worldPos + nWorld * (n1 * 0.85 + n2 * 0.15) * uJitter;

  float wake;
  displaced = applyProximityWake(displaced, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - displaced;
  gl_Position = projectionMatrix * viewMatrix * vec4(displaced, 1.0);
}
`,Lo=`uniform vec3 uCoreColor;
uniform float uTime;
uniform float uIsSheath;

varying vec2 vUv;
varying float vWake;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  // 自底向上高斯脉冲波，速度 0.25（主文档 §3.3）
  float phase = fract(vUv.x * 2.0 - uTime * 0.25);
  float pulse = exp(-pow(phase / 0.07, 2.0)) + exp(-pow((phase - 1.0) / 0.07, 2.0));

  vec3 col;
  float alpha = 1.0;
  if (uIsSheath > 0.5) {
    float facing = abs(dot(normalize(vNormalW), normalize(vViewDir)));
    float body = 0.1 + 0.3 * pow(facing, 0.7);
    col = uCoreColor * (body + pulse * 1.2);
    alpha = body * 0.8 + pulse * 0.5;
  } else {
    col = uCoreColor * (1.0 + pulse * 0.35);
  }

  col *= 1.0 + vWake * 0.4;
  col = mix(col, vec3(1.0), vWake * 0.25);
  gl_FragColor = vec4(col, alpha);
}`,qo=`uniform float uDragCoeff;
uniform float uPulsePeriod;
uniform vec3 uLeviathanVel;
uniform vec3 uLeviathanPos;

attribute float aHopDistance;
attribute float aSpineProgress;
attribute float aBranchSeed;
attribute float aTubeRadius;

varying float vH;
varying float vT;
varying float vWake;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  vH = aHopDistance;
  vT = aSpineProgress;
  float spineS = clamp(aSpineProgress, 0.0, 1.0);

  // 末梢收尖：避免 TubeGeometry 开口平端在近距露出方形断面
  vec3 tapered = position - normal * aTubeRadius * smoothstep(0.75, 1.0, uv.x);
  // 枝条根部跟随脊柱行波，保持与母体连接处不脱节
  tapered += leviathanSpineWave(spineS);

  vec3 worldPos = (modelMatrix * vec4(tapered, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  // 径向呼吸舒张
  float breath = sin(uTime * 0.9 + spineS * 3.14159265) * (2.5 * aHopDistance);
  // 动作电位脉冲：沿枝条向末梢传导的局部膨胀
  float pulseXi = fract(uTime / uPulsePeriod - spineS);
  float pulse = exp(-pow(pulseXi - aHopDistance, 2.0) / 0.0032) * 1.8;

  // 触手螺旋蜿蜒：绕巨兽径向的切向盘旋
  vec3 radial = worldPos - uLeviathanPos;
  float radialLen = length(radial);
  vec3 radialAxis = radialLen > 0.001 ? radial / radialLen : vec3(0.0, 1.0, 0.0);
  vec3 curlDir = cross(nWorld, radialAxis);
  float curlLen = length(curlDir);
  curlDir = curlLen > 0.001 ? curlDir / curlLen : vec3(0.0, 0.0, 1.0);
  float curl = cos(uTime * 1.15 + aBranchSeed * 6.2831853 + worldPos.y * 0.02)
             * (4.5 * pow(aHopDistance, 1.5));

  // 以太阻力滞后：细神经纤维大幅后披，粗主干近乎刚性
  float drag = -uDragCoeff * aHopDistance * aHopDistance / (1.0 + 2.6 * aTubeRadius);

  vec3 displaced = worldPos
                 + nWorld * (breath + pulse)
                 + curlDir * curl
                 + uLeviathanVel * drag;

  float wake;
  displaced = applyProximityWake(displaced, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - displaced;
  gl_Position = projectionMatrix * viewMatrix * vec4(displaced, 1.0);
}
`,_o=`uniform float uTime;
uniform float uMode; // 0 = Lavender 厚壁管, 1 = 洋红细神经纤维

varying float vH;
varying float vT;
varying float vWake;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  // 生物电波传导：能量自脊柱向末梢逐级扩散（主文档 §3.3）
  float phi = fract(vT - 0.18 * uTime - 0.35 * vH);
  float pulse = exp(-pow(phi / 0.06, 2.0)) + exp(-pow((phi - 1.0) / 0.06, 2.0));

  vec3 col;
  float alpha;
  if (uMode < 0.5) {
    // 参考图：厚壁管哑光薰衣草紫（亮度压在 Bloom 阈值之下），内部 openness 靠深度衰减
    float depthDim = vH < 0.35 ? 1.0 : vH < 0.7 ? 0.35 : 0.5;
    col = mix(vec3(0.42, 0.3, 0.78), vec3(0.3, 0.2, 0.62), smoothstep(0.0, 0.8, vH)) * 0.95 * depthDim;
    col = mix(col, vec3(0.62, 0.56, 0.85) * 0.8, smoothstep(0.85, 1.0, vH));
    col += vec3(0.9, 0.5, 1.0) * pulse * 0.35;
    alpha = 1.0;
  } else {
    // 细纤维走规范色带：白 → 亮品红 → 紫罗兰
    vec3 c0 = vec3(3.2, 3.0, 3.4);
    vec3 c1 = vec3(1.0, 0.13, 1.0) * 1.7;
    vec3 c2 = vec3(0.39, 0.09, 0.93) * 1.6;
    col = mix(c0, c1, smoothstep(0.0, 0.25, vH));
    col = mix(col, c2, smoothstep(0.25, 0.65, vH));
    col += vec3(0.9, 0.5, 1.0) * pulse * 1.6;
    alpha = 0.9;
  }

  float facing = abs(dot(normalize(vNormalW), normalize(vViewDir)));
  col *= 0.45 + 0.55 * facing;
  alpha *= mix(1.0, 0.5, smoothstep(0.7, 1.0, vH));

  col *= 1.0 + vWake * 0.4;
  col = mix(col, vec3(1.0), vWake * 0.25);
  gl_FragColor = vec4(col, alpha);
}`,Ft=s=>new w(s[0],s[1],s[2]),kt=3.6,Wo=.32,Io=.16,Go=1.15,Vo=.3,Et=75,zt=.85,Tt=3.5*Math.PI;function Dt(s,e,t){const o=s-e;return Math.exp(-(o*o)/(2*t*t))}function Oo(s,e,t,o,n,i){const a=s.getAttribute("uv"),l=a.count,r=new Float32Array(l),d=new Float32Array(l),m=new Float32Array(l),h=new Float32Array(l);for(let p=0;p<l;p++)r[p]=e+(t-e)*a.getX(p),d[p]=o,m[p]=n,h[p]=i;s.setAttribute("aHopDistance",new M(r,1)),s.setAttribute("aSpineProgress",new M(d,1)),s.setAttribute("aBranchSeed",new M(m,1)),s.setAttribute("aTubeRadius",new M(h,1))}class Bo{group=new on;data;anchors;velocity=new w;worldPosition=new w;deterrence=0;path=new hn;pilot=new To;materials=[];geometries=[];disposables=[];sharedUniforms={uLeviathanVel:{value:new w},uLeviathanPos:{value:new w},uSpineWaveAmp:{value:Et},uSpineWaveOmega:{value:zt},uSpineWaveK:{value:Tt},uDragCoeff:{value:.06},uPulsePeriod:{value:kt}};crownMat;crownCoreMat;crownCoreBase=new A(3.5,3.2,3.8);crownBase=new w;crown;crownCore;constructor(){this.data=xo(),this.anchors=Mo(this.data);const e=this.data.spinePoints.map(Ft),t=new pe(e,!1,"catmullrom",.5),o=()=>({uPlayerPos:{value:new w},uPlayerVel:{value:new w},uWakeRadius:{value:65}}),n=(y,x,C)=>{const S=new ue({vertexShader:Do+gt+Ze+Ro,fragmentShader:Lo,uniforms:{uTime:{value:0},uJitter:{value:x},uNoiseFreq:{value:.09},uCoreColor:{value:y},uIsSheath:{value:C?1:0},...o(),...this.sharedUniforms},transparent:C,blending:C?z:ot,depthWrite:!C});return this.materials.push(S),S},i=new te(t,200,3.4,6,!1),a=new te(t,200,6.5,8,!1);this.geometries.push(i,a),this.group.add(new V(i,n(new A(3.5,3.2,3.8),2.2,!1))),this.group.add(new V(a,n(new A(.9,.4,1.5),1.8,!0)));const l=[];for(let y=0;y<8;y++){const x=[];for(let C=0;C<e.length;C+=3){const S=C/(e.length-1),P=S*Math.PI*12+y*Math.PI/4,F=6+1*Math.sin(S*40+y*1.7);x.push(new w(e[C].x+Math.cos(P)*F,e[C].y,e[C].z+Math.sin(P)*F))}l.push(new te(new pe(x),100,.3,3,!1))}const r=xe(l);l.forEach(y=>y.dispose());const d=new ue({vertexShader:Ze+`
        varying vec2 vUv;
        varying float vEnergy;
        void main() {
          vUv = uv;
          float s = clamp((position.y + 600.0) / 1200.0, 0.0, 1.0);
          vec3 local = position + leviathanSpineWave(s);
          vec4 world = modelMatrix * vec4(local, 1.0);
          vEnergy = s;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,fragmentShader:`
        uniform float uTime;
        varying vec2 vUv;
        varying float vEnergy;
        void main() {
          float run = 0.65 + 0.35 * sin(vUv.x * 60.0 - uTime * 4.0 + vEnergy * 6.0);
          gl_FragColor = vec4(vec3(1.8, 1.7, 2.0) * run, 0.55 + 0.45 * run);
        }
      `,uniforms:{uTime:{value:0},...this.sharedUniforms},transparent:!0,blending:z,depthWrite:!1});this.geometries.push(r),this.materials.push(d),this.group.add(new V(r,d));const m=[],h=[];let p=0;for(const y of this.data.edges){if(y.edgeType!=="branch_nerve")continue;const x=y.controlPoints.map(Ft),C=new Ln(x[0],x[1],x[2],x[3]),S=y.baseRadius<1,P=S?14:y.baseRadius>=4?8:y.baseRadius>=2?6:5,F=new te(C,P,S?.35:y.baseRadius,S?3:4,!1);Oo(F,y.hopStart,y.hopEnd,y.spineProgress,p*.618034%1,S?.35:y.baseRadius),p++,(S?h:m).push(F)}const u=(y,x)=>{const C=new ue({vertexShader:gt+Ze+qo,fragmentShader:_o,uniforms:{uTime:{value:0},uMode:{value:y},...o(),...this.sharedUniforms},transparent:x,blending:x?z:ot,depthWrite:!x});return this.materials.push(C),C},c=xe(m),f=xe(h);m.forEach(y=>y.dispose()),h.forEach(y=>y.dispose()),this.geometries.push(c,f),this.group.add(new V(c,u(0,!1))),this.group.add(new V(f,u(1,!0)));const v=new Fe(22,32,24);this.crownMat=new ue({vertexShader:`
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * normal);
          vV = cameraPosition - wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
        uniform float uCrownPulse;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
          vec3 col = mix(vec3(0.75, 0.65, 1.0) * 0.9, vec3(1.5, 1.3, 1.9), f);
          col *= 1.0 + uCrownPulse * 1.3;
          gl_FragColor = vec4(col, 0.4 + 0.6 * f);
        }
      `,uniforms:{uCrownPulse:{value:0}},transparent:!0,depthWrite:!1});const g=new Fe(7,16,12);this.crownCoreMat=new ct({color:this.crownCoreBase.clone()});const b=e[e.length-1];this.crownBase.copy(b),this.crown=new V(v,this.crownMat),this.crownCore=new V(g,this.crownCoreMat),this.crown.position.copy(b),this.crownCore.position.copy(b),this.geometries.push(v,g),this.disposables.push(this.crownMat,this.crownCoreMat),this.group.add(this.crown,this.crownCore),this.path.sample(0,this.group.position,this.velocity,this.group.quaternion)}syncWorld(){this.group.getWorldPosition(this.worldPosition),this.sharedUniforms.uLeviathanPos.value.copy(this.worldPosition)}update(e,t,o,n){this.deterrence=this.pilot.update(e,t,o,this.group.position,this.velocity,this.group.quaternion),this.syncWorld(),this.sharedUniforms.uLeviathanVel.value.copy(this.velocity);for(const i of this.materials){i.uniforms.uTime.value=t;const a=i.uniforms.uPlayerPos,l=i.uniforms.uPlayerVel;a&&a.value.copy(o),l&&l.value.copy(n)}this.updateCrown(t)}updateCrown(e){const t=e%kt,o=.18*(Dt(t,Wo,Io)+.6*Dt(t,Go,Vo)),n=o/.18+this.deterrence*.9,i=zt*e-Tt,a=12+Et,l=Math.sin(i)*a,r=Math.cos(i+Math.PI/4)*a*.55;this.crown.position.set(this.crownBase.x+l,this.crownBase.y,this.crownBase.z+r),this.crownCore.position.copy(this.crown.position),this.crown.scale.setScalar(1+o+this.deterrence*.25),this.crownCore.scale.setScalar(1+.35*n),this.crownCoreMat.color.copy(this.crownCoreBase).multiplyScalar(1+1.06*n),this.crownMat.uniforms.uCrownPulse.value=n}dispose(){this.geometries.forEach(e=>e.dispose()),this.materials.forEach(e=>e.dispose()),this.disposables.forEach(e=>e.dispose())}}const Uo=[{code:"M01",modelType:"lorenz",titleZh:"洛伦兹吸引子",titleEn:"Lorenz Attractor",category:"chaos",pipeline:"chaos_particles",shell:"main",instanceCount:3,scaleRange:[28,40],audioFamily:"chaos",latexFormula:"\\dot{x}=\\sigma(y-x),\\quad \\dot{y}=x(\\rho-z)-y,\\quad \\dot{z}=xy-\\beta z",description:"气象学家洛伦兹于 1963 年提出的简化对流模型，在 σ=10、ρ=28、β=8/3 时呈现著名的蝴蝶双翼轨线——确定性方程孕育出的混沌之翼。",coreColor:"#E0F2FE",glowColor:"#00E5FF",accentColor:"#0EA5E9"},{code:"M02",modelType:"rossler",titleZh:"罗斯勒吸引子",titleEn:"Rössler Attractor",category:"chaos",pipeline:"chaos_particles",shell:"main",instanceCount:3,scaleRange:[24,35],audioFamily:"chaos",latexFormula:"\\dot{x}=-y-z,\\quad \\dot{y}=x+ay,\\quad \\dot{z}=b+z(x-c)",description:"以三条最简非线性项重构的混沌系统：平坦涡旋区缓缓缠绕，在折叠峰顶骤然抽拉，如一条折叠翻涌的光带水母。",coreColor:"#FFE4E6",glowColor:"#FF2E93",accentColor:"#F9A8D4"},{code:"M03",modelType:"aizawa",titleZh:"艾扎瓦吸引子",titleEn:"Aizawa Attractor",category:"chaos",pipeline:"chaos_particles",shell:"main",instanceCount:3,scaleRange:[22,32],audioFamily:"chaos",latexFormula:"\\dot{x}=(z-b)x-dy,\\quad \\dot{y}=dx+(z-b)y,\\quad \\dot{z}=c+az-\\tfrac{z^3}{3}-(x^2+y^2)(1+ez)+fzx^3",description:"带轴对称结构的奇异吸引子，轨线围绕中心轴穿针引线，形成球形等离子般的混沌焰核海胆。",coreColor:"#FEF3C7",glowColor:"#FF6B00",accentColor:"#FBBF24"},{code:"M13",modelType:"thomas",titleZh:"托马斯循环对称吸引子",titleEn:"Thomas' Cyclically Symmetric Attractor",category:"chaos",pipeline:"chaos_particles",shell:"main",instanceCount:3,scaleRange:[32,45],audioFamily:"chaos",latexFormula:"\\dot{x}=\\sin y-bx,\\quad \\dot{y}=\\sin z-by,\\quad \\dot{z}=\\sin x-bz,\\quad b=0.208186",description:"三重循环对称的迷宫式吸引子，12 条初始轨线在三个正交方向互相缠绕，像一簇缓慢蠕动的靛蓝神经节。",coreColor:"#E0E7FF",glowColor:"#6366F1",accentColor:"#22D3EE"},{code:"M14",modelType:"halvorsen",titleZh:"哈尔沃森吸引子",titleEn:"Halvorsen Attractor",category:"chaos",pipeline:"ribbon",shell:"main",instanceCount:3,scaleRange:[28,40],audioFamily:"chaos",latexFormula:"\\dot{x}=-ax-4y-4z-y^2,\\quad \\dot{y}=-ay-4z-4x-z^2,\\quad \\dot{z}=-az-4x-4y-x^2",description:"绕主对角轴盘旋的三翼螺旋吸引子，轨线被拉成宽带流光丝带，核心炽白、外缘绯红，像一尾等离子星鳐。",coreColor:"#FEF2F2",glowColor:"#FB7185",accentColor:"#F59E0B"},{code:"M15",modelType:"chen-lee",titleZh:"陈氏双涡卷吸引子",titleEn:"Chen-Lee Attractor",category:"chaos",pipeline:"chaos_particles",shell:"main",instanceCount:3,scaleRange:[26,38],audioFamily:"chaos",latexFormula:"\\dot{x}=ax-yz,\\quad \\dot{y}=by+xz,\\quad \\dot{z}=cz+\\frac{xy}{3}",description:"南北对称的双涡卷磁暴：冰青与钴蓝两极之间，粒子做不可预测的混沌跃迁，跨越赤道时爆出纯白闪光。",coreColor:"#ECFEFF",glowColor:"#06B6D4",accentColor:"#3B82F6"},{code:"M34",modelType:"dadras",titleZh:"达德拉斯多涡卷吸引子",titleEn:"Dadras Attractor",category:"chaos",pipeline:"chaos_particles",shell:"main",instanceCount:3,scaleRange:[30,42],audioFamily:"chaos",latexFormula:"\\dot{x}=y-ax+byz,\\quad \\dot{y}=cy-xz+z,\\quad \\dot{z}=dxy-ez",description:"四片相互缠绕的对称电弧羽翼，靛紫与粉红双色高速电脉冲沿轨线奔涌，像一尾在深空滑翔的暗影电鳐。",coreColor:"#EEF2FF",glowColor:"#6366F1",accentColor:"#F472B6"},{code:"M39",modelType:"abc-flow",titleZh:"ABC 三维贝特拉米流",titleEn:"ABC Flow",category:"chaos",pipeline:"chaos_particles",shell:"main",instanceCount:3,scaleRange:[32,45],audioFamily:"chaos",latexFormula:"\\dot{x}=A\\sin z+C\\cos y,\\quad \\dot{y}=B\\sin x+A\\cos z,\\quad \\dot{z}=C\\sin y+B\\cos x",description:"不可压缩欧拉方程的经典定常解，速度与旋度处处平行。数千枚流线微粒在球形周期容器里自行搅动出一座混沌海葵。",coreColor:"#FFFBEB",glowColor:"#F59E0B",accentColor:"#10B981"}],jo=[{code:"M04",modelType:"calabi-yau",titleZh:"卡拉比-丘流形",titleEn:"Calabi-Yau Manifold",category:"topology",pipeline:"parametric_surface",shell:"main",instanceCount:3,scaleRange:[30,45],audioFamily:"topology",latexFormula:"z_1^{\\,n}+z_2^{\\,n}=1,\\quad n=5",description:"弦论中紧致化六维额外空间的候选形状。四维复坐标绕旋转角 α 连续投影至三维，花瓣状曲面实时拓扑翻折。",coreColor:"#D1FAE5",glowColor:"#10B981",accentColor:"#F59E0B"},{code:"M05",modelType:"klein",titleZh:"克莱因瓶",titleEn:"Klein Bottle",category:"topology",pipeline:"parametric_surface",shell:"main",instanceCount:3,scaleRange:[26,36],audioFamily:"topology",latexFormula:"x=(r+\\cos\\tfrac{u}{2}\\sin v-\\sin\\tfrac{u}{2}\\sin 2v)\\cos u",description:"不可定向的封闭曲面：没有内外之分。能量经纬线在单侧表面上无缝翻转穿梭，如一枚无界拓扑海螺。",coreColor:"#CCFBF1",glowColor:"#14B8A6",accentColor:"#8B5CF6"},{code:"M06",modelType:"torus-knot",titleZh:"环面纽结",titleEn:"Torus Knot (p,q)",category:"topology",pipeline:"tube_network",shell:"main",instanceCount:3,scaleRange:[35,55],audioFamily:"topology",latexFormula:"r(t)=\\cos(qt)+2,\\; x=r\\cos(pt),\\; y=r\\sin(pt),\\; z=-\\sin(qt)",description:"缠绕在环面上的闭合绳结，按互质整数对 (p,q) 分类。猩红与电光蓝行波沿管身高速追逐，似霓虹光带海蛇。",coreColor:"#FFF1F2",glowColor:"#F43F5E",accentColor:"#3B82F6"},{code:"M16",modelType:"enneper",titleZh:"高阶恩内佩尔极小曲面",titleEn:"Generalized Enneper Surface",category:"topology",pipeline:"parametric_surface",shell:"main",instanceCount:3,scaleRange:[28,42],audioFamily:"topology",latexFormula:"x=r\\cos\\theta-\\frac{r^{2k-1}}{2k-1}\\cos((2k-1)\\theta),\\quad z=\\frac{2r^k}{k}\\cos k\\theta",description:"Weierstrass-Enneper 极坐标参数化的 k 阶极小曲面，边缘像蝠鲼胸鳍一样柔和拍动，薄膜泛出翠绿与天蓝双色。",coreColor:"#ECFDF5",glowColor:"#34D399",accentColor:"#0EA5E9",params:{k:3}},{code:"M17",modelType:"boy",titleZh:"博伊曲面",titleEn:"Boy's Surface",category:"topology",pipeline:"parametric_surface",shell:"main",instanceCount:3,scaleRange:[25,36],audioFamily:"topology",latexFormula:"(X,Y,Z)=\\frac{(g_1,g_2,g_3)}{g_1^2+g_2^2+g_3^2}+\\left(0,0,\\frac12\\right)",description:"实射影平面在三维中的无奇点浸入，三叶贝壳在自交脊线处泛暖金高光，腹腔透出玫瑰紫红的半透明薄膜。",coreColor:"#FFFBEB",glowColor:"#FBBF24",accentColor:"#EC4899"},{code:"M18",modelType:"dini",titleZh:"迪尼曲面",titleEn:"Dini's Surface",category:"topology",pipeline:"parametric_surface",shell:"main",instanceCount:3,scaleRange:[30,46],audioFamily:"topology",latexFormula:"x=a\\cos u\\sin v,\\quad y=a\\sin u\\sin v,\\quad z=a\\left(\\cos v+\\ln\\tan\\frac v2\\right)+bu",description:"常负高斯曲率的螺旋锥面，沿渐近线奔流的青绿与薰衣草能量带在尖锥处收束成纯白针尖，像一只旋转推进的发光鹦鹉螺。",coreColor:"#F0FDFA",glowColor:"#2DD4BF",accentColor:"#818CF8"},{code:"M19",modelType:"helicoid-catenoid",titleZh:"螺旋面-悬链面等距形变体",titleEn:"Helicoid–Catenoid Bonnet Morph",category:"topology",pipeline:"parametric_surface",shell:"main",instanceCount:3,scaleRange:[26,40],audioFamily:"topology",latexFormula:"x=\\cos\\alpha\\sinh u\\sin v+\\sin\\alpha\\cosh u\\cos v,\\quad z=v\\cos\\alpha+u\\sin\\alpha",description:"Bonnet 等距形变族：螺旋面与悬链面之间无缝卷曲舒展，第一基本形式全程不变，颜色随相位在绯红与柔橙金之间呼吸。",coreColor:"#FFF1F2",glowColor:"#F43F5E",accentColor:"#FDBA74"},{code:"M28",modelType:"lissajous",titleZh:"三维利萨如绳结",titleEn:"3D Lissajous Knot",category:"topology",pipeline:"tube_network",shell:"inner",instanceCount:3,scaleRange:[30,45],audioFamily:"topology",latexFormula:"x=\\cos(n_xt+\\phi_x),\\quad y=\\cos(n_yt+\\phi_y),\\quad z=\\cos(n_zt+\\phi_z)",description:"两两互质频率 (3,4,5) 编织的闭合谐振绳结，青色与霓虹洋红两束高能光波沿管身相向奔跑，在立体交叉处撞出纯白耀斑。",coreColor:"#FAF5FF",glowColor:"#22D3EE",accentColor:"#F43F5E"},{code:"M30",modelType:"roman",titleZh:"施泰纳罗马曲面",titleEn:"Steiner's Roman Surface",category:"topology",pipeline:"parametric_surface",shell:"main",instanceCount:3,scaleRange:[25,36],audioFamily:"topology",latexFormula:"x=\\tfrac12\\sin2u\\cos^2v,\\quad y=\\tfrac12\\sin u\\sin2v,\\quad z=\\tfrac12\\cos u\\sin2v",description:"带 6 个奇异夹点的实射影平面四次曲面，四片鼓胀光瓣由落日琥珀过渡到玫瑰绯红，三条双重点自交线亮起细光针。",coreColor:"#FFF7ED",glowColor:"#FB923C",accentColor:"#F43F5E"},{code:"M36",modelType:"costa",titleZh:"科斯塔极小曲面",titleEn:"Costa's Minimal Surface",category:"topology",pipeline:"parametric_surface",shell:"main",instanceCount:3,scaleRange:[32,46],audioFamily:"topology",latexFormula:"\\wp(z),\\quad z\\in(0,1)^2\\ \\text{Weierstrass 椭圆函数}",description:"亏格 1、带三个端（一个悬链端与两个平面端）的无自交嵌入极小曲面，湖蓝与薄荷绿双层薄膜在鞍点边缘泛白，如一只三孔拓扑光杯。",coreColor:"#F0F9FF",glowColor:"#0EA5E9",accentColor:"#34D399"},{code:"M40",modelType:"mobius-twisted",titleZh:"多重半扭莫比乌斯环带",titleEn:"Twisted Möbius Band",category:"topology",pipeline:"parametric_surface",shell:"inner",instanceCount:3,scaleRange:[30,45],audioFamily:"topology",latexFormula:"x=\\left(1+v\\cos\\frac{ku}{2}\\right)\\cos u,\\quad z=v\\sin\\frac{ku}{2},\\quad k=3",description:"三次半扭转的单侧不可定向丝带，一对流光脉冲沿边界相向奔跑，必须绕行 4π 才能回到同侧起点，品红与电青双线勾勒出无限回环。",coreColor:"#FDF2F8",glowColor:"#EC4899",accentColor:"#22D3EE",params:{k:3}}],No=[{code:"M09",modelType:"hopf",titleZh:"霍普夫纤维丛",titleEn:"Hopf Fibration",category:"high-dim",pipeline:"projection_4d",shell:"main",instanceCount:3,scaleRange:[45,60],audioFamily:"high-dim",latexFormula:"S^3\\to S^2,\\quad (x_1,x_2,x_3,x_4)=\\left(\\cos\\tfrac{\\eta}{2}\\cos t,\\dots\\right)",description:"四维球面被分解为一族互锁的纤维圆环，经球极投影落入三维。每条纤维依经度角赋连续光谱虹彩，白色光珠同步绕行。",coreColor:"#FFFFFF",glowColor:"#A855F7",accentColor:"#22D3EE"},{code:"M20",modelType:"cell-24",titleZh:"四维超正二十四胞体",titleEn:"24-Cell Icositetrachoron",category:"high-dim",pipeline:"projection_4d",shell:"main",instanceCount:3,scaleRange:[35,52],audioFamily:"high-dim",latexFormula:"\\mathbf v\\in\\left\\{\\tfrac{1}{\\sqrt2}(\\pm1,\\pm1,0,0)\\right\\},\\quad (X,Y,Z)=\\frac{R}{R-w}(x,y,z)",description:"四维空间独有的自对偶正多胞体：24 个顶点、96 条棱在 XW 与 YZ 双平面同步旋转，经球极投影后棱边弯成优雅的双曲弧线。",coreColor:"#FFFFFF",glowColor:"#38BDF8",accentColor:"#C084FC",params:{projectionDistance:1.85}},{code:"M21",modelType:"clifford-torus",titleZh:"四维克利福德环面",titleEn:"Clifford Torus in S³",category:"high-dim",pipeline:"projection_4d",shell:"main",instanceCount:3,scaleRange:[34,48],audioFamily:"high-dim",latexFormula:"(x,y,z,w)=\\frac1{\\sqrt2}(\\cos u,\\sin u,\\cos v,\\sin v)",description:"嵌入四维单位球面的平坦极小环面。双层金橙薄膜与 Villarceau 斜交网格在四维旋转中不断内外吞吐，像一只双重自旋的光笼。",coreColor:"#FEFCE8",glowColor:"#FACC15",accentColor:"#FB923C",params:{projectionDistance:1.65}},{code:"M24",modelType:"poincare",titleZh:"庞加莱球双曲铺砌",titleEn:"Poincaré Ball Hyperbolic Honeycomb",category:"high-dim",pipeline:"tube_network",shell:"outer",instanceCount:3,scaleRange:[38,54],audioFamily:"high-dim",latexFormula:"\\mathcal I(\\mathbf x)=\\mathbf C+\\frac{R^2}{\\lVert\\mathbf x-\\mathbf C\\rVert^2}(\\mathbf x-\\mathbf C)",description:"三维双曲空间的开单位球模型：约 300 条与边界球面严格正交的测地圆弧向边界无限收缩，核心亮兰紫、边缘转为清冷星河蓝。",coreColor:"#FDF4FF",glowColor:"#E879F9",accentColor:"#38BDF8"},{code:"M32",modelType:"e8",titleZh:"E8 李群根系投影",titleEn:"E8 Root System Projection",category:"high-dim",pipeline:"projection_hd",shell:"inner",instanceCount:3,scaleRange:[38,56],audioFamily:"high-dim",latexFormula:"\\lVert\\mathbf r\\rVert=\\sqrt2,\\quad \\mathbf r_i\\cdot\\mathbf r_j\\in\\{0,1\\},\\quad (X,Y,Z)=(\\mathbf r\\cdot\\mathbf u_1,\\mathbf r\\cdot\\mathbf u_2,\\mathbf r\\cdot\\mathbf u_3)",description:"例外单李群 E8 的 240 个根向量：112 个整数根与 128 个半整数根构成八维最极致对称的星盘，6720 条对称棱在考克斯特平面附近交织成金色圣环。",coreColor:"#FEFCE8",glowColor:"#FACC15",accentColor:"#EC4899"},{code:"M37",modelType:"quasicrystal",titleZh:"三维二十面体准晶体",titleEn:"3D Icosahedral Quasicrystal",category:"high-dim",pipeline:"instanced_lattice",shell:"outer",instanceCount:3,scaleRange:[34,50],audioFamily:"high-dim",latexFormula:"\\mathbf M_\\parallel\\mathbf n,\\quad \\mathbf M_\\perp\\mathbf n\\in W_{\\text{triacontahedron}},\\quad \\mathbf n\\in\\mathbb Z^6",description:"六维超立方晶格向三维物理空间与垂直空间的切投影：接受窗筛出的晶格点构成五重对称、永不重复的星晶网络，浅玫瑰红与天星蓝沿层壳交替闪烁。",coreColor:"#FFF1F2",glowColor:"#FDA4AF",accentColor:"#60A5FA"}],Ho=[{code:"M07",modelType:"mandelbulb",titleZh:"曼德博球",titleEn:"Mandelbulb",category:"fractal",pipeline:"raymarch_sdf",shell:"outer",instanceCount:3,scaleRange:[35,50],audioFamily:"fractal",latexFormula:"z_{k+1}=z_k^{\\,n}+c,\\quad n\\approx 8",description:"三维复动力系统的分形巨构：球坐标幂迭代在距离估计场中行进，裂隙深处呈深青，凸起尖端泛荧光嫩绿，如深空珊瑚缓慢呼吸生长。",coreColor:"#ECFCCB",glowColor:"#84CC16",accentColor:"#06B6D4"},{code:"M08",modelType:"sierpinski",titleZh:"谢尔宾斯基四面体",titleEn:"Sierpinski Tetrahedron",category:"fractal",pipeline:"instanced_lattice",shell:"outer",instanceCount:3,scaleRange:[28,42],audioFamily:"fractal",latexFormula:"f_i(\\mathbf{x})=\\tfrac{1}{2}(\\mathbf{x}+\\mathbf{v}_i)",description:"四个压缩仿射映射递归四层的迭代函数系统：256 枚微型四面体组成白芯冰蓝线框的递归晶格，在深空中规律搏动。",coreColor:"#FFFFFF",glowColor:"#60A5FA",accentColor:"#93C5FD"},{code:"M22",modelType:"quaternion-julia",titleZh:"四元数茱莉亚集",titleEn:"Quaternion Julia Set",category:"fractal",pipeline:"raymarch_sdf",shell:"outer",instanceCount:3,scaleRange:[34,48],audioFamily:"fractal",latexFormula:"q_{k+1}=q_k^2+c(t),\\quad c(t)\\in\\mathbb H",description:"四元数平方迭代在三维切片上的分形珊瑚核，动态常量 c(t) 沿四维小圆环游走，沟壑暗海青、脊刺霓虹翡翠绿，像活体有机生长。",coreColor:"#F0FDF4",glowColor:"#4ADE80",accentColor:"#14B8A6"},{code:"M23",modelType:"apollonian",titleZh:"阿波罗尼奥斯三维球堆积",titleEn:"Apollonian Sphere Packing",category:"fractal",pipeline:"instanced_lattice",shell:"outer",instanceCount:3,scaleRange:[35,55],audioFamily:"fractal",latexFormula:"\\left(\\sum_{i=1}^5 b_i\\right)^2=3\\sum_{i=1}^5 b_i^2,\\quad b_k^{\\text{new}}=\\sum_{j\\neq k} b_j-b_k",description:"由三维 Soddy-Gosset 线性递推生成的递归气泡海葵：约 400 枚严丝合缝两两相切的玻璃球，大气泡边缘冰空蓝、微小气泡闪品红荧光。",coreColor:"#F8FAFC",glowColor:"#7DD3FC",accentColor:"#E879F9"},{code:"M25",modelType:"gray-scott",titleZh:"灰-斯科特反应扩散球",titleEn:"Gray-Scott Reaction-Diffusion Sphere",category:"pde",pipeline:"fbo_reaction_diffusion",shell:"outer",instanceCount:3,scaleRange:[26,38],audioFamily:"fractal",latexFormula:"\\partial_tU=D_u\\nabla^2U-UV^2+F(1-U),\\quad \\partial_tV=D_v\\nabla^2V+UV^2-(F+k)V",description:"两种化学物质在球面 UV 域上实时反应扩散，低浓度谷底幽暗墨绿，生长波前凸起并爆发荧光翠绿与电光青柠，像一颗自我分裂的发光细胞球。",coreColor:"#ECFDF5",glowColor:"#10B981",accentColor:"#A3E635",params:{feed:.0545,kill:.062}},{code:"M29",modelType:"gyroid",titleZh:"陀螺面三周期极小曲面",titleEn:"Gyroid TPMS",category:"fractal",pipeline:"raymarch_sdf",shell:"outer",instanceCount:3,scaleRange:[35,52],audioFamily:"fractal",latexFormula:"\\sin x\\cos y+\\sin y\\cos z+\\sin z\\cos x=t,\\quad \\lVert\\mathbf p\\rVert\\le R_0",description:"布满连通三维迷宫孔洞的 TPMS 生物珊瑚球，薄壁边缘折射电光青与纯白高光，孔洞随 t(time) 做有机收缩扩张。",coreColor:"#ECFDF5",glowColor:"#059669",accentColor:"#22D3EE",params:{frequency:2.6,thickness:.14}},{code:"M31",modelType:"menger",titleZh:"门格海绵",titleEn:"Menger Sponge",category:"fractal",pipeline:"instanced_lattice",shell:"outer",instanceCount:3,scaleRange:[30,46],audioFamily:"fractal",latexFormula:"D_H=\\frac{\\ln 20}{\\ln 3}\\approx 2.7268",description:"三维康托集的递归推广：3 阶 20³ 晶格剔除面心与体心后剩下数千枚微型立方体，像一座活体机械圣殿随呼吸径向悬浮。",coreColor:"#F8FAFC",glowColor:"#38BDF8",accentColor:"#818CF8"}],un=[...Uo,...jo,...No,...Ho,...xn],at=[...un].sort((s,e)=>s.code.localeCompare(e.code)),Rt=Object.fromEntries(un.map(s=>[s.modelType,s]));function Te(s,e,t,o,n,i){const a=new Float64Array(s),l=new Float64Array(s),r=new Float64Array(s),d=new Float64Array(s),m=new Float64Array(s),h=new Float64Array(s);for(let c=0;c<s;c++)a[c]=t[c];const p=()=>{e(a,l);for(let c=0;c<s;c++)h[c]=a[c]+l[c]*o/2;e(h,r);for(let c=0;c<s;c++)h[c]=a[c]+r[c]*o/2;e(h,d);for(let c=0;c<s;c++)h[c]=a[c]+d[c]*o;e(h,m);for(let c=0;c<s;c++)a[c]+=(l[c]+2*r[c]+2*d[c]+m[c])*o/6};for(let c=0;c<i;c++)p();const u=new Float64Array(n*s);for(let c=0;c<n;c++){for(let f=0;f<s;f++)u[c*s+f]=a[f];p()}return u}function De(s,e){const t=new Float64Array(e),o=s.length/e;for(let a=0;a<e;a++){let l=1/0,r=-1/0;for(let d=0;d<o;d++){const m=s[d*e+a];m<l&&(l=m),m>r&&(r=m)}t[a]=(l+r)/2}let n=0;for(let a=0;a<o;a++){let l=0;for(let r=0;r<e;r++)s[a*e+r]-=t[r],l+=s[a*e+r]*s[a*e+r];l>n&&(n=l)}const i=1/Math.sqrt(n||1);for(let a=0;a<s.length;a++)s[a]*=i}const X=4e3,ce=600,Zo=(s,e)=>{e[0]=10*(s[1]-s[0]),e[1]=s[0]*(28-s[2])-s[1],e[2]=s[0]*s[1]-8/3*s[2]};class Ko extends D{trackGeo=new k;swarmGeo=new k;trackPts=new Float64Array(0);swarmIdx=new Float32Array(ce);swarmPos=new Float32Array(ce*3);swarmAttr;trackPoints;swarmPoints;init(){this.trackPts=Te(3,Zo,[1,1,1],.005,X,500),De(this.trackPts,3);const e=new Float32Array(X);let t=0;for(let r=0;r<X;r++){const d=(r+1)%X,m=this.trackPts[d]-this.trackPts[r],h=this.trackPts[d+1]-this.trackPts[r+1],p=this.trackPts[d+2]-this.trackPts[r+2];e[r]=Math.hypot(m,h,p),e[r]>t&&(t=e[r])}const o=new Float32Array(X*3),n=new Float32Array(X);for(let r=0;r<X;r++)o.set(this.trackPts.subarray(r*3,r*3+3),r*3),e[r]/=t||1,n[r]=Math.random();this.trackGeo.setAttribute("position",new M(o,3)),this.trackGeo.setAttribute("aSpeed",new M(e,1)),this.trackGeo.setAttribute("aPhase",new M(n,1));const i=r=>{const d=ne({uniforms:this.uniforms,size:r,coreColor:this.config.coreColor,glowColor:this.config.glowColor});return this.resources.track(d),d};this.resources.track(this.trackGeo),this.resources.track(this.swarmGeo),this.trackPoints=new _(this.trackGeo,i(1.4)),this.group.add(this.trackPoints);for(let r=0;r<ce;r++)this.swarmIdx[r]=Math.random()*X;this.swarmAttr=new M(this.swarmPos,3),this.swarmGeo.setAttribute("position",this.swarmAttr);const a=new Float32Array(ce).fill(1),l=new Float32Array(ce);for(let r=0;r<ce;r++)l[r]=Math.random();this.swarmGeo.setAttribute("aSpeed",new M(a,1)),this.swarmGeo.setAttribute("aPhase",new M(l,1)),this.swarmPoints=new _(this.swarmGeo,i(2.6)),this.group.add(this.swarmPoints),this.addLodPart({object:this.trackPoints,drawRange:[X,1500,0]}),this.addLodPart({object:this.swarmPoints,drawRange:[ce,200,0]}),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateX(.26*Math.sin(t*.5));const i=Math.floor(t*120);for(let a=0;a<ce;a++){const l=((this.swarmIdx[a]|0)+i)%X;this.swarmPos[a*3]=this.trackPts[l*3],this.swarmPos[a*3+1]=this.trackPts[l*3+1],this.swarmPos[a*3+2]=this.trackPts[l*3+2]}this.swarmAttr.needsUpdate=!0}}const Lt=3500,Z=600,Yo=(s,e)=>{e[0]=-s[1]-s[2],e[1]=s[0]+.2*s[1],e[2]=.2+s[2]*(s[0]-5.7)};class $o extends oe{init(){const e=Te(3,Yo,[1,0,0],.02,Lt,300);De(e,3);const t=[];for(let u=0;u<Z;u++){const c=Math.floor(u/Z*Lt)*3;t.push(new w(e[c],e[c+1],e[c+2]))}const o=new pe(t,!0,"catmullrom",.5),n=o.computeFrenetFrames(Z,!0),i=Z+1,a=new Float32Array(i*2*3),l=new Float32Array(i*2*2),r=new Uint16Array(Z*6),d=new w,m=.12;for(let u=0;u<i;u++){o.getPointAt(u%Z/Z,d);const c=n.binormals[u%Z];a.set([d.x+c.x*m,d.y+c.y*m,d.z+c.z*m,d.x-c.x*m,d.y-c.y*m,d.z-c.z*m],u*6),l.set([u/Z,0,u/Z,1],u*4)}for(let u=0;u<Z;u++){const c=u*2;r.set([c,c+1,c+3,c,c+3,c+2],u*6)}const h=new k;h.setAttribute("position",new M(a,3)),h.setAttribute("uv",new M(l,2)),h.setAttribute("normal",new M(new Float32Array(i*2*3),3));for(let u=0;u<i*2;u++)h.getAttribute("normal").setY(u,1);h.setIndex(new M(r,1));const p=ke({uniforms:this.uniforms,accentColor:"#FFE4E6",flowSpeed:1.5,transparent:!0,side:ie});this.attachMesh(h,p)}}const ae=5e3,Xo=(s,e)=>{const t=s[0],o=s[1],n=s[2];e[0]=(n-.7)*t-3.5*o,e[1]=3.5*t+(n-.7)*o,e[2]=.6+.95*n-n*n*n/3-(t*t+o*o)*(1+.25*n)+.1*n*t*t*t};class Qo extends D{geos=[];mats=[];trackPts;tubeMesh;init(){const e=Te(3,Xo,[.1,0,0],.01,ae,500);De(e,3);const t=new Float32Array(ae*3),o=new Float32Array(ae),n=new Float32Array(ae);let i=0;for(let h=0;h<ae;h++){t.set(e.subarray(h*3,h*3+3),h*3);const p=(h+1)%ae;o[h]=Math.hypot(e[p]-e[h],e[p+1]-e[h+1],e[p+2]-e[h+2]),o[h]>i&&(i=o[h]),n[h]=Math.random()}for(let h=0;h<ae;h++)o[h]/=i||1;const a=new k;a.setAttribute("position",new M(t,3)),a.setAttribute("aSpeed",new M(o,1)),a.setAttribute("aPhase",new M(n,1));const l=ne({uniforms:this.uniforms,size:2,coreColor:this.config.coreColor,glowColor:this.config.glowColor});this.geos.push(a),this.mats.push(l),this.trackPts=new _(a,l),this.group.add(this.trackPts);const r=[];for(let h=0;h<300;h++){const p=Math.floor(h/300*ae)*3;r.push(new w(e[p],e[p+1],e[p+2]))}const d=new te(new pe(r,!0,"catmullrom",.5),200,.045,6,!0),m=ke({uniforms:this.uniforms,accentColor:"#FEF3C7",flowSpeed:2.2});this.geos.push(d),this.mats.push(m),this.tubeMesh=new V(d,m),this.group.add(this.tubeMesh),this.resources.trackAll(...this.geos,...this.mats),this.addLodPart({object:this.trackPts,drawRange:[ae,1500,0]}),this.addLodPart({object:this.tubeMesh}),this.setLOD(0)}}const Jo=`// 卡拉比-丘五次流形：四维坐标经旋转角 α(t)=0.35·uTime 实时投影至三维
uniform float uTime;

attribute float aImagZ1;
attribute float aImagZ2;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  float alpha = 0.35 * uTime;
  vec3 projected = vec3(
    position.x,
    position.y,
    cos(alpha) * aImagZ1 + sin(alpha) * aImagZ2
  );
  vUv = uv;

  vec3 worldPos = (modelMatrix * vec4(projected, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}`,ve=5,G=13;class ei extends oe{init(){const e=ve*ve,t=G*G,o=new Float32Array(e*t*3),n=new Float32Array(e*t),i=new Float32Array(e*t),a=new Float32Array(e*t*2),l=[];let r=0;for(let u=0;u<ve;u++)for(let c=0;c<ve;c++){const f=2*Math.PI*u/ve,v=2*Math.PI*c/ve,g=r;for(let b=0;b<G;b++){const y=b/(G-1)*(Math.PI/2);for(let x=0;x<G;x++){const C=-1+x/(G-1)*2,S=Math.cos(y)*Math.cosh(C),P=-Math.sin(y)*Math.sinh(C),F=Math.sin(y)*Math.cosh(C),H=Math.cos(y)*Math.sinh(C),L=qt(S,P),W=qt(F,H),R=_t(L,[Math.cos(f),Math.sin(f)]),se=_t(W,[Math.cos(v),Math.sin(v)]);o[r*3]=R[0],o[r*3+1]=se[0],o[r*3+2]=0,n[r]=R[1],i[r]=se[1],a[r*2]=b/(G-1),a[r*2+1]=x/(G-1),r++}}for(let b=0;b<G-1;b++)for(let y=0;y<G-1;y++){const x=g+b*G+y;l.push(x,x+1,x+G+1,x,x+G+1,x+G)}}let d=0;for(let u=0;u<r;u++){const c=o[u*3]**2+o[u*3+1]**2+n[u]**2+i[u]**2;c>d&&(d=c)}const m=1/Math.sqrt(d||1);for(let u=0;u<r*3;u++)o[u]*=m;for(let u=0;u<r;u++)n[u]*=m,i[u]*=m;const h=new k;h.setAttribute("position",new M(o,3)),h.setAttribute("aImagZ1",new M(n,1)),h.setAttribute("aImagZ2",new M(i,1)),h.setAttribute("uv",new M(a,2)),h.setIndex(l),h.computeVertexNormals();const p=q({vertexShader:Jo,fragmentShader:en,uniforms:{...this.uniforms,uAccentColor:{value:new A("#F59E0B")},uFlowSpeed:{value:1.2}},includeWake:!0,transparent:!0,side:ie});this.attachMesh(h,p)}}function qt(s,e){const t=Math.pow(Math.hypot(s,e),.4),o=Math.atan2(e,s)*2/5;return[t*Math.cos(o),t*Math.sin(o)]}function _t(s,e){return[s[0]*e[0]-s[1]*e[1],s[0]*e[1]+s[1]*e[0]]}const we=64,he=32;class ti extends oe{init(){const e=new Float32Array((we+1)*(he+1)*3),t=new Float32Array((we+1)*(he+1)*2),o=[],n=2.2;let i=0;for(let m=0;m<=we;m++){const h=m/we*Math.PI*2;for(let p=0;p<=he;p++){const u=p/he*Math.PI*2,c=h/2,f=n+Math.cos(c)*Math.sin(u)-Math.sin(c)*Math.sin(2*u);e[i*3]=f*Math.cos(h),e[i*3+1]=f*Math.sin(h),e[i*3+2]=Math.sin(c)*Math.sin(u)+Math.cos(c)*Math.sin(2*u),t[i*2]=m/we,t[i*2+1]=p/he,i++}}for(let m=0;m<we;m++)for(let h=0;h<he;h++){const p=m*(he+1)+h,u=p+he+1;o.push(p,u,u+1,p,u+1,p+1)}let a=0;for(let m=0;m<i;m++){const h=e[m*3]**2+e[m*3+1]**2+e[m*3+2]**2;h>a&&(a=h)}const l=1/Math.sqrt(a);for(let m=0;m<i*3;m++)e[m]*=l;const r=new k;r.setAttribute("position",new M(e,3)),r.setAttribute("uv",new M(t,2)),r.setIndex(o),r.computeVertexNormals();const d=ke({uniforms:this.uniforms,accentColor:this.config.accentColor??"#8B5CF6",flowSpeed:1.8,transparent:!0,side:ie});this.attachMesh(r,d)}}const Wt=[[2,3],[3,5],[3,7],[4,9]];class ni extends qn{constructor(e,t){super(),this.p=e,this.q=t}getPoint(e,t=new w){const o=e*Math.PI*2,n=Math.cos(this.q*o)+2;return t.set(n*Math.cos(this.p*o)/3,n*Math.sin(this.p*o)/3,-Math.sin(this.q*o)/3)}}class oi extends D{geos=[];mats=[];tubeMesh;ringPts;init(){const e=this.config.id.split("").reduce((b,y)=>b+y.charCodeAt(0),0),[t,o]=Wt[e%Wt.length],n=new ni(t,o),i=new te(n,240,.16,12,!0),a=ke({uniforms:this.uniforms,accentColor:"#3B82F6",flowSpeed:4.5,transparent:!0,depthWrite:!0});this.geos.push(i),this.mats.push(a),this.tubeMesh=new V(i,a),this.group.add(this.tubeMesh);const l=400,r=new Float32Array(l*3),d=new Float32Array(l),m=new Float32Array(l),h=new w,p=new w,u=new w(0,1,0),c=new w,f=new w;for(let b=0;b<l;b++){const y=b/l;n.getPoint(y,h),n.getTangent(y,p),c.crossVectors(p,u).normalize(),f.crossVectors(c,p).normalize();const x=y*Math.PI*2*9;r[b*3]=h.x+(c.x*Math.cos(x)+f.x*Math.sin(x))*.34,r[b*3+1]=h.y+(c.y*Math.cos(x)+f.y*Math.sin(x))*.34,r[b*3+2]=h.z+(c.z*Math.cos(x)+f.z*Math.sin(x))*.34,d[b]=b%2,m[b]=Math.random()}const v=new k;v.setAttribute("position",new M(r,3)),v.setAttribute("aSpeed",new M(d,1)),v.setAttribute("aPhase",new M(m,1));const g=ne({uniforms:this.uniforms,size:1.8,coreColor:this.config.coreColor,glowColor:this.config.glowColor});this.geos.push(v),this.mats.push(g),this.ringPts=new _(v,g),this.group.add(this.ringPts),this.resources.trackAll(...this.geos,...this.mats),this.addLodPart({object:this.tubeMesh,drawRange:[2880*6,2880*2,0]}),this.addLodPart({object:this.ringPts,drawRange:[400,150,0]}),this.setLOD(0)}}const ii=`out vec3 vObjPos;
out vec3 vRo;
out vec4 vClipCorner;
out vec4 vClipCam;

void main() {
  vObjPos = position;
  // 片元阶段无 modelMatrix/inverse：相机射线原点与两端 clip 坐标在顶点期算好
  vRo = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vClipCorner = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vClipCam = projectionMatrix * viewMatrix * vec4(cameraPosition, 1.0);
  gl_Position = vClipCorner;
}`;class pt extends D{boxMesh;pointsMesh;boxGeo=new lt(2,2,2);pointsGeo=new k;tmpV=new w;lastSide=fe;createRaymarch(e,t){const o=q({vertexShader:ii,fragmentShader:e,glslVersion:_n,uniforms:{uTime:this.uniforms.uTime,uDeepColor:{value:new A(t.deepColor??this.config.glowColor)},uTipColor:{value:new A(t.tipColor??this.config.coreColor)},uHaloColor:{value:new A(t.haloColor??this.config.accentColor??this.config.glowColor)}},includeWake:!1,transparent:!0,depthWrite:!0});this.boxMesh=new V(this.boxGeo,o),this.group.add(this.boxMesh),this.resources.track(this.boxGeo),this.resources.track(o);const n=t.pointCloud,i=n.length/3,a=new Float32Array(i),l=new Float32Array(i);for(let d=0;d<i;d++)a[d]=Math.min(1,Math.hypot(n[d*3],n[d*3+1],n[d*3+2])),l[d]=d*.618034%1;this.pointsGeo.setAttribute("position",new M(n,3)),this.pointsGeo.setAttribute("aSpeed",new M(a,1)),this.pointsGeo.setAttribute("aPhase",new M(l,1));const r=ne({uniforms:this.uniforms,size:t.pointSize??1.6,coreColor:t.tipColor??this.config.coreColor,glowColor:t.deepColor??this.config.glowColor});this.pointsMesh=new _(this.pointsGeo,r),this.pointsMesh.visible=!1,this.group.add(this.pointsMesh),this.resources.track(this.pointsGeo),this.resources.track(r),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n),this.group.updateWorldMatrix(!0,!1),this.tmpV.copy(o),this.group.worldToLocal(this.tmpV);const a=this.tmpV.length()<1.05?Wn:fe;a!==this.lastSide&&this.boxMesh.visible&&(this.boxMesh.material.side=a,this.lastSide=a)}setLOD(e){this.currentLOD=e,this.boxMesh.visible=e===0,this.pointsMesh.visible=e===1,this.setSpriteVisible(e===2),e===0&&(this.lastSide=fe)}}const si=`// 曼德博球 Raymarching 距离估计（GLSL ES 3.0 / WebGL2，gl_FragDepth 参与深度遮挡）
in vec3 vObjPos;
in vec3 vRo;
in vec4 vClipCorner;
in vec4 vClipCam;

uniform float uTime;
uniform vec3 uDeepColor;
uniform vec3 uTipColor;
uniform vec3 uHaloColor;

out vec4 fragColor;

float de(vec3 pos, out float trap) {
  vec3 z = pos;
  float dr = 1.0;
  float r = 0.0;
  float n = 7.5 + 1.2 * sin(0.3 * uTime);
  trap = 1e9;
  for (int i = 0; i < 8; i++) {
    r = length(z);
    if (r > 2.0) break;
    float theta = acos(clamp(z.z / r, -1.0, 1.0));
    float phi = atan(z.y, z.x);
    dr = pow(r, n - 1.0) * n * dr + 1.0;
    float zr = pow(r, n);
    theta *= n;
    phi *= n;
    z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta)) + pos;
    trap = min(trap, length(z.xy));
  }
  return 0.5 * log(max(r, 1.000001)) * dr / r;
}

void main() {
  vec3 ro = vRo;
  vec3 rd = normalize(vObjPos - ro);

  // 从射线-包围盒入射点起步进，否则 48 步预算走不到分形表面
  float t0 = 0.0;
  float t1 = 1e9;
  {
    vec2 tx = vec2((-1.0 - ro.x) / rd.x, (1.0 - ro.x) / rd.x);
    vec2 ty = vec2((-1.0 - ro.y) / rd.y, (1.0 - ro.y) / rd.y);
    vec2 tz = vec2((-1.0 - ro.z) / rd.z, (1.0 - ro.z) / rd.z);
    t0 = max(t0, max(max(min(tx.x, tx.y), min(ty.x, ty.y)), min(tz.x, tz.y)));
    t1 = min(t1, min(min(max(tx.x, tx.y), max(ty.x, ty.y)), max(tz.x, tz.y)));
  }
  if (t0 > t1) discard;

  float t = t0;
  float trapMin = 1e9;
  float steps = 0.0;
  bool hit = false;
  vec3 hp = vec3(0.0);

  for (int i = 0; i < 48; i++) {
    vec3 p = ro + rd * t;
    float tr;
    float d = de(p, tr);
    trapMin = min(trapMin, tr);
    steps += 1.0;
    if (d < 0.003) {
      hit = true;
      hp = p;
      break;
    }
    // 迭代数偏少时 DE 高估距离，保守步长防止穿透薄壳
    t += max(d * 0.5, 0.002);
    if (t > t1 + 0.3) break;
  }

  if (hit) {
    vec2 e = vec2(0.0012, 0.0);
    float tr;
    vec3 nrm = normalize(vec3(
      de(hp + e.xyy, tr) - de(hp - e.xyy, tr),
      de(hp + e.yxy, tr) - de(hp - e.yxy, tr),
      de(hp + e.yyx, tr) - de(hp - e.yyx, tr)
    ));
    float ao = clamp(1.0 - steps / 48.0, 0.2, 1.0);
    float diff = 0.55 + 0.45 * clamp(dot(nrm, normalize(ro - hp)), 0.0, 1.0);
    vec3 col = mix(uDeepColor, uTipColor, clamp(trapMin * 1.5, 0.0, 1.0));
    col *= ao * diff * 1.35;

    // clip 沿世界线段线性：按命中参数在相机/盒角两个 clip 间插值
    float u = length(hp - ro) / max(length(vObjPos - ro), 1e-5);
    vec4 clip = mix(vClipCam, vClipCorner, u);
    gl_FragDepth = (clip.z / clip.w) * 0.5 + 0.5;
    fragColor = vec4(col, 1.0);
  } else {
    float halo = exp(-trapMin * trapMin * 6.0) * 0.15;
    if (halo < 0.03) discard;
    fragColor = vec4(uHaloColor * halo, halo);
  }
}`,ai=7.5;function ri(s,e,t,o){let n=s,i=e,a=t,l=1,r=0;for(let d=0;d<6&&(r=Math.hypot(n,i,a),!(r>2));d++){const m=Math.acos(Math.min(1,Math.max(-1,a/r))),h=Math.atan2(i,n);l=Math.pow(r,o-1)*o*l+1;const p=Math.pow(r,o),u=m*o,c=h*o;n=p*Math.sin(u)*Math.cos(c)+s,i=p*Math.sin(c)*Math.sin(u)+e,a=p*Math.cos(u)+t}return .5*Math.log(Math.max(r,1.000001))*l/r}class li extends pt{init(){const e=[];let t=0;for(;e.length<3e3*3&&t<4e5;){t++;const o=(Math.random()*2-1)*1.15,n=(Math.random()*2-1)*1.15,i=(Math.random()*2-1)*1.15;ri(o,n,i,ai)<.02&&e.push(o,n,i)}this.createRaymarch(si,{deepColor:this.config.accentColor??"#06B6D4",tipColor:this.config.glowColor,haloColor:"#22D3EE",pointCloud:new Float32Array(e),pointSize:1.6})}}const ci=`// instanceMatrix 由 three 在 USE_INSTANCING 前缀中自动声明
attribute float aInstDist;

uniform float uTime;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  vec4 instanced = instanceMatrix * vec4(position, 1.0);
  // 距几何中心越远，呼吸膨胀相位越滞后（离散搏动感）
  float breath = sin(uTime * 1.6 - aInstDist * 3.4) * 0.035;
  instanced.xyz *= 1.0 + breath;

  vec3 worldPos = (modelMatrix * instanced).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}`,dn=4,qe=Math.pow(4,dn),hi=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(s=>{const e=Math.hypot(...s);return[s[0]/e,s[1]/e,s[2]/e]});class ui extends D{mesh;geo=null;mat=null;init(){this.geo=new In(1,0);const e=[],t=[],o=(d,m,h)=>{if(h===dn){e.push(d),t.push(m);return}for(const p of hi)o([(d[0]+p[0]*m)/2,(d[1]+p[1]*m)/2,(d[2]+p[2]*m)/2],m/2,h+1)};o([0,0,0],1,0);const n=new Y,i=new T,a=new w,l=new w,r=new Float32Array(qe);this.mat=q({vertexShader:ci,fragmentShader:en,uniforms:{...this.uniforms,uAccentColor:{value:new A("#60A5FA")},uFlowSpeed:{value:1}},includeWake:!0,transparent:!0}),this.geo.setAttribute("aInstDist",new de(r,1)),this.mesh=new Ee(this.geo,this.mat,qe);for(let d=0;d<qe;d++)a.set(e[d][0],e[d][1],e[d][2]),l.setScalar(t[d]*.9),n.compose(a,i,l),this.mesh.setMatrixAt(d,n),r[d]=a.length();this.mesh.instanceMatrix.needsUpdate=!0,this.group.add(this.mesh),this.resources.trackAll(this.geo,this.mat),this.addLodPart({object:this.mesh,instanceCount:[qe,64,0]}),this.setLOD(0)}}const di=`uniform float uTime;

attribute float aHue;

varying float vHue;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vHue = aHue;
  vUv = uv;
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}`,pi=`uniform float uTime;

varying float vHue;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec3 base = hsv2rgb(vec3(vHue, 0.8, 1.0));
  float fres = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 1.8);
  vec3 col = base * (0.55 + 0.6 * fres);

  // 白色光珠沿每条纤维环同步绕行
  float b = fract(vUv.x - uTime * 0.22 + vHue * 3.0);
  float bead = exp(-pow(min(b, 1.0 - b) / 0.035, 2.0));
  col += vec3(2.6, 2.4, 2.8) * bead;

  col *= 1.0 + vWake * 0.4;
  gl_FragColor = vec4(col, 0.9);
}`,mi=[.6,1.2,1.9],It=24,Ke=32;class fi extends oe{init(){const e=[],t=[];let o=0;const n=[];for(const l of mi)for(let r=0;r<It;r++){const d=r/It*Math.PI*2,m=[];for(let h=0;h<Ke;h++){const p=h/Ke*Math.PI*2,u=Math.cos(l/2),c=Math.sin(l/2),f=u*Math.cos(p),v=u*Math.sin(p),g=c*Math.cos(p+d),y=1/(1-c*Math.sin(p+d)),x=f*y,C=v*y,S=g*y;m.push([x,C,S,d]),o=Math.max(o,Math.hypot(x,C,S))}n.push(m)}for(const l of n){t.length=0;for(const p of l)t.push(new w(p[0]/o,p[1]/o,p[2]/o));const r=new pe(t,!0,"catmullrom",.5),d=new te(r,Ke,.018,4,!0),m=l[0][3]/(Math.PI*2),h=new Float32Array(d.getAttribute("position").count).fill(m);d.setAttribute("aHue",new M(h,1)),e.push(d)}const i=xe(e);e.forEach(l=>l.dispose());const a=q({vertexShader:di,fragmentShader:pi,uniforms:this.uniforms,includeWake:!0,transparent:!0,blending:z,depthWrite:!1});this.attachMesh(i,a)}}const B=400,Gt=[1,.55,.3,.16],gi=[1,-3,7,-11],vi=new w(0,0,1);class wi extends D{rings;trail;ringGeo=new Gn(1,.022,6,48);trailGeo=new k;trailPos=new Float32Array(B*3);trailAge=new Float32Array(B);trailAttr;ageAttr;head=0;angles=new Float64Array(4);tilts=[];spin=new T;q=new T;mat=new Y;pos=new w;vec=new w;scaleV=new w;ringMat;trailMat;init(){for(let t=0;t<4;t++){const o=new T().setFromEuler(new an(Math.random()*1.2-.6,Math.random()*Math.PI,Math.random()*1.2-.6));this.tilts.push(o)}this.ringMat=new ct({color:new A(1.6,1.15,.18),transparent:!0,blending:z,depthWrite:!1}),this.rings=new Ee(this.ringGeo,this.ringMat,4),this.group.add(this.rings);for(let t=0;t<B;t++)this.trailAge[t]=t/B;this.trailAttr=new M(this.trailPos,3),this.ageAttr=new M(this.trailAge,1),this.trailGeo.setAttribute("position",this.trailAttr),this.trailGeo.setAttribute("aSpeed",this.ageAttr);const e=new Float32Array(B);for(let t=0;t<B;t++)e[t]=t/B;this.trailGeo.setAttribute("aPhase",new M(e,1)),this.trailMat=ne({uniforms:this.uniforms,size:1.5,coreColor:"#22D3EE",glowColor:"#0E7490"}),this.trail=new _(this.trailGeo,this.trailMat),this.group.add(this.trail),this.resources.trackAll(this.ringGeo,this.trailGeo,this.ringMat,this.trailMat),this.addLodPart({object:this.rings,instanceCount:[4,4,0]}),this.addLodPart({object:this.trail,drawRange:[B,120,0]}),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n),this.pos.set(0,0,0);for(let i=0;i<4;i++)this.angles[i]+=gi[i]*e*1.2,this.spin.setFromAxisAngle(vi,this.angles[i]),this.q.copy(this.tilts[i]).multiply(this.spin),this.vec.set(Gt[i],0,0).applyQuaternion(this.q),this.scaleV.setScalar(Gt[i]),this.mat.compose(this.pos,this.q,this.scaleV),this.rings.setMatrixAt(i,this.mat),this.pos.add(this.vec);this.rings.instanceMatrix.needsUpdate=!0,this.head=(this.head+1)%B,this.trailPos[this.head*3]=this.pos.x,this.trailPos[this.head*3+1]=this.pos.y,this.trailPos[this.head*3+2]=this.pos.z;for(let i=0;i<B;i++)this.trailAge[i]=(B+i-this.head)%B/B;this.trailAttr.needsUpdate=!0,this.ageAttr.needsUpdate=!0}}const yi=`uniform float uTime;
uniform float uL1;
uniform float uM1;
uniform float uL2;
uniform float uM2;

varying float vSign;
varying float vAbsY;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

// 缔合勒让德 P_l^m(x)（l ≤ 5；ES 1.0 要求常量循环边界 + break）
float plm(int l, int m, float x) {
  if (m > l) return 0.0;
  float pmm = 1.0;
  if (m > 0) {
    float somx2 = sqrt(max(0.0, (1.0 - x) * (1.0 + x)));
    float fact = 1.0;
    for (int i = 0; i < 6; i++) {
      if (i >= m) break;
      pmm *= -fact * somx2;
      fact += 2.0;
    }
  }
  if (l == m) return pmm;
  float pmmp1 = x * (2.0 * float(m) + 1.0) * pmm;
  if (l == m + 1) return pmmp1;
  for (int llStep = 0; llStep < 6; llStep++) {
    int ll = m + 2 + llStep;
    if (ll > l) break;
    float pl = (x * (2.0 * float(ll) - 1.0) * pmmp1 - (float(ll) + float(m) - 1.0) * pmm) / (float(ll) - float(m));
    pmm = pmmp1;
    pmmp1 = pl;
  }
  return pmmp1;
}

float realY(float l, float m, vec3 dir) {
  float theta = acos(clamp(dir.y, -1.0, 1.0));
  float phi = atan(dir.z, dir.x);
  int li = int(l);
  int mi = int(abs(m));
  float p = plm(li, mi, cos(theta));
  return p * (m >= 0.0 ? cos(float(mi) * phi) : sin(float(mi) * phi));
}

void main() {
  vec3 dir = normalize(position);
  float k = 0.5 + 0.5 * sin(uTime * 0.25);
  float y = mix(realY(uL1, uM1, dir), realY(uL2, uM2, dir), k);
  float r = 0.55 + 0.85 * min(abs(y) * 0.9, 1.6);
  vec3 localPos = dir * r;

  vSign = sign(y);
  vAbsY = min(abs(y) * 0.9, 1.6);

  vec3 worldPos = (modelMatrix * vec4(localPos, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * dir);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}`,bi=`uniform vec3 uPosColor;
uniform vec3 uNegColor;

varying float vSign;
varying float vAbsY;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 base = vSign > 0.0 ? uPosColor : uNegColor;
  // 节点零面呈半透明暗空
  float node = smoothstep(0.02, 0.35, vAbsY);
  vec3 col = base * (0.2 + 0.8 * node);

  float fres = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 2.0);
  col += base * fres * 0.8;

  col *= 1.0 + vWake * 0.4;
  col = mix(col, vec3(1.0), vWake * 0.25);
  gl_FragColor = vec4(col * 1.15, 0.92);
}`,Se=[[3,2],[4,2],[4,3],[5,3]],_e=300;function xi(s,e,t){if(e>s)return 0;let o=1;if(e>0){const i=Math.sqrt(Math.max(0,(1-t)*(1+t)));let a=1;for(let l=1;l<=e;l++)o*=-a*i,a+=2}if(s===e)return o;let n=t*(2*e+1)*o;if(s===e+1)return n;for(let i=e+2;i<=s;i++){const a=(t*(2*i-1)*n-(i+e-1)*o)/(i-e);o=n,n=a}return n}function Mi(s,e,t){const o=Math.acos(Math.min(1,Math.max(-1,t.y))),n=Math.atan2(t.z,t.x),i=xi(s,Math.abs(e),Math.cos(o));return e>=0?i*Math.cos(Math.abs(e)*n):i*Math.sin(Math.abs(e)*n)}class Ci extends D{bodyMesh;dustMesh;bodyGeo=new it(1,5);dustGeo=new k;bodyMat;dustMat;init(){const e=Math.floor(Math.random()*Se.length);let t=Math.floor(Math.random()*Se.length);t===e&&(t=(e+1)%Se.length);const[o,n]=Se[e],[i,a]=Se[t];this.bodyMat=q({vertexShader:yi,fragmentShader:bi,uniforms:{...this.uniforms,uL1:{value:o},uM1:{value:n},uL2:{value:i},uM2:{value:a},uPosColor:{value:new A("#EC4899")},uNegColor:{value:new A("#6366F1")}},includeWake:!0,transparent:!0,depthWrite:!0}),this.bodyMesh=new V(this.bodyGeo,this.bodyMat),this.group.add(this.bodyMesh);const l=new Float32Array(_e*3),r=new Float32Array(_e),d=new Float32Array(_e),m=new w;let h=0,p=0;for(;h<_e&&p<6e4;){if(p++,m.set(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1),m.lengthSq()>1||m.lengthSq()<1e-6)continue;m.normalize();const u=Mi(o,n,m),c=Math.min(1,u*u*.8);Math.random()<c&&(m.multiplyScalar(.7+.55*Math.abs(u)+Math.random()*.15),l.set([m.x,m.y,m.z],h*3),r[h]=Math.min(1,Math.abs(u)),d[h]=Math.random(),h++)}this.dustGeo.setAttribute("position",new M(l,3)),this.dustGeo.setAttribute("aSpeed",new M(r,1)),this.dustGeo.setAttribute("aPhase",new M(d,1)),this.dustMat=ne({uniforms:this.uniforms,size:1.3,coreColor:"#FCE7F3",glowColor:"#818CF8"}),this.dustMesh=new _(this.dustGeo,this.dustMat),this.group.add(this.dustMesh),this.resources.trackAll(this.bodyGeo,this.dustGeo,this.bodyMat,this.dustMat),this.addLodPart({object:this.bodyMesh}),this.addLodPart({object:this.dustMesh,visible:u=>u===0}),this.setLOD(0)}}const Ai=`uniform float uTime;
uniform float uSweep;
uniform vec3 uPlayerPos;
uniform float uWakeRadius;

attribute float aIndex;
attribute float aPrime;
attribute float aParity;

varying float vPrime;
varying float vFlash;
varying float vParity;

void main() {
  vPrime = aPrime;
  vParity = aParity;

  // 每 3 秒自 n=0 扫过的素数筛检光波
  float d = aIndex - uSweep;
  vFlash = aPrime * exp(-d * d * 0.0022) * (0.6 + 0.4 * sin(uTime * 9.0));

  vec3 localPos = position * mix(0.85, 2.5, aPrime);
  vec4 instanced = instanceMatrix * vec4(localPos, 1.0);
  vec3 worldPos = (modelMatrix * instanced).xyz;

  vec3 toPlayer = worldPos - uPlayerPos;
  float dist = length(toPlayer);
  float wake = smoothstep(uWakeRadius, 0.0, dist);
  worldPos += normalize(toPlayer + vec3(0.001)) * wake * wake * 4.0;

  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}`,Si=`uniform vec3 uTealColor;
uniform vec3 uYellowColor;
uniform vec3 uDimColor;

varying float vPrime;
varying float vFlash;
varying float vParity;

void main() {
  vec3 primeCol = vParity < 0.5 ? uTealColor : uYellowColor;
  vec3 col = mix(uDimColor, primeCol, vPrime);
  col += primeCol * vFlash * 1.8;
  float alpha = mix(0.35, 0.95, vPrime);
  gl_FragColor = vec4(col * 1.4, alpha);
}`,Q=2500,Pi=Math.PI*(3-Math.sqrt(5));function Fi(s){const e=new Uint8Array(s).fill(1);e[0]=0,e[1]=0;for(let t=2;t*t<s;t++)if(e[t])for(let o=t*t;o<s;o+=t)e[o]=0;return e}class ki extends D{mesh;octGeo=new Vn(.022,0);mat;init(){const e=Fi(Q),t=new Y,o=new T,n=new w,i=new w(1,1,1),a=new Float32Array(Q),l=new Float32Array(Q),r=new Float32Array(Q);this.mat=q({vertexShader:Ai,fragmentShader:Si,uniforms:{uTime:this.uniforms.uTime,uSweep:{value:0},uPlayerPos:this.uniforms.uPlayerPos,uWakeRadius:this.uniforms.uWakeRadius,uTealColor:{value:new A("#2DD4BF")},uYellowColor:{value:new A("#FDE047")},uDimColor:{value:new A("#1E293B")}},includeWake:!1,transparent:!0,blending:z,depthWrite:!1}),this.mesh=new Ee(this.octGeo,this.mat,Q);let d=0;for(let m=0;m<Q;m++){const h=.95*Math.sqrt(m/Q),p=m*Pi,u=1.7*(2*m/Q-1);n.set(h*Math.cos(p),u,h*Math.sin(p)),t.compose(n,o,i),this.mesh.setMatrixAt(m,t),a[m]=m,l[m]=e[m],e[m]&&d++,r[m]=d%2}this.mesh.instanceMatrix.needsUpdate=!0,this.octGeo.setAttribute("aIndex",new de(a,1)),this.octGeo.setAttribute("aPrime",new de(l,1)),this.octGeo.setAttribute("aParity",new de(r,1)),this.group.add(this.mesh),this.resources.trackAll(this.octGeo,this.mat),this.addLodPart({object:this.mesh,instanceCount:[Q,800,0]}),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n),this.mat.uniforms.uSweep.value=t%3/3*(Q+200)}}class mt extends D{trackGeo=new k;swarmGeo=new k;trackPts=new Float64Array(0);swarmIdx=new Float32Array(0);swarmPos=new Float32Array(0);swarmAttr;trackPoints;swarmPoints;swarmCount=0;steps=0;swarmSpeed=1;trackLength=0;buildChaosTracks(e,t){const o=t.seeds.map(f=>Te(3,e,f,t.dt,t.steps,t.discard)),n=o.reduce((f,v)=>f+v.length,0),i=new Float64Array(n);let a=0;for(const f of o)i.set(f,a),a+=f.length;De(i,3),this.trackPts=i,this.steps=t.steps,this.trackLength=i.length/3,this.swarmCount=t.swarmCount??600,this.swarmSpeed=t.swarmSpeed??120;const l=this.trackLength,r=new Float32Array(l*3),d=new Float32Array(l),m=new Float32Array(l);let h=1e-6;for(let f=0;f<l;f++){const v=(f+1)%l,g=i[v*3]-i[f*3],b=i[v*3+1]-i[f*3+1],y=i[v*3+2]-i[f*3+2];d[f]=Math.hypot(g,b,y),d[f]>h&&(h=d[f]),m[f]=f/l%1}for(let f=0;f<l;f++)r[f*3]=i[f*3],r[f*3+1]=i[f*3+1],r[f*3+2]=i[f*3+2],d[f]/=h;this.trackGeo.setAttribute("position",new M(r,3)),this.trackGeo.setAttribute("aSpeed",new M(d,1)),this.trackGeo.setAttribute("aPhase",new M(m,1));const p=f=>{const v=ne({uniforms:this.uniforms,size:f,coreColor:t.coreColor??this.config.coreColor,glowColor:t.glowColor??this.config.glowColor});return this.resources.track(v),v};this.resources.track(this.trackGeo),this.resources.track(this.swarmGeo),this.trackPoints=new _(this.trackGeo,p(t.trackPointSize??1.4)),this.group.add(this.trackPoints),this.swarmIdx=new Float32Array(this.swarmCount),this.swarmPos=new Float32Array(this.swarmCount*3);for(let f=0;f<this.swarmCount;f++)this.swarmIdx[f]=Math.random()*this.trackLength;this.swarmAttr=new M(this.swarmPos,3),this.swarmGeo.setAttribute("position",this.swarmAttr);const u=new Float32Array(this.swarmCount).fill(1),c=new Float32Array(this.swarmCount);for(let f=0;f<this.swarmCount;f++)c[f]=Math.random();this.swarmGeo.setAttribute("aSpeed",new M(u,1)),this.swarmGeo.setAttribute("aPhase",new M(c,1)),this.swarmPoints=new _(this.swarmGeo,p(t.swarmPointSize??2.6)),this.group.add(this.swarmPoints),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n);const i=Math.floor(t*this.swarmSpeed);for(let a=0;a<this.swarmCount;a++){const l=((this.swarmIdx[a]|0)+i)%this.trackLength;this.swarmPos[a*3]=this.trackPts[l*3],this.swarmPos[a*3+1]=this.trackPts[l*3+1],this.swarmPos[a*3+2]=this.trackPts[l*3+2]}this.swarmAttr.needsUpdate=!0}setLOD(e){this.currentLOD=e,this.trackPoints.visible=e<2,this.swarmPoints.visible=e<2,this.trackGeo.setDrawRange(0,e===0?this.trackLength:Math.floor(this.trackLength/3)),this.swarmGeo.setDrawRange(0,e===0?this.swarmCount:e===1?Math.floor(this.swarmCount/3):0),this.setSpriteVisible(e===2)}}const Ye=.208186,Ei=(s,e)=>{e[0]=Math.sin(s[1])-Ye*s[0],e[1]=Math.sin(s[2])-Ye*s[1],e[2]=Math.sin(s[0])-Ye*s[2]};class zi extends mt{init(){const e=[];for(let t=0;t<12;t++){const o=t/12*Math.PI*2,n=.8+t%3*.35;e.push([Math.cos(o)*n,Math.sin(o)*n,Math.sin(o*2)*.8])}this.buildChaosTracks(Ei,{seeds:e,dt:.08,steps:1200,discard:200,swarmCount:900,swarmSpeed:80,trackPointSize:1.35,swarmPointSize:2.4})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateY(e*.12)}}const Ti=`uniform float uTime;
uniform float uFlowSpeed;

attribute float aProgress;
attribute float aDistance;

varying float vProgress;
varying float vDistance;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vProgress = aProgress;
  vDistance = aDistance;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);
  float wake;
  world.xyz = applyProximityWake(world.xyz, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,Di=`uniform float uTime;
uniform float uFlowSpeed;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vProgress;
varying float vDistance;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.0);
  float pulse = pow(0.5 + 0.5 * sin(vProgress * 40.0 - uTime * uFlowSpeed), 4.0);
  vec3 col = mix(uCoreColor, uGlowColor, clamp(vDistance, 0.0, 1.0));
  col = mix(col, uAccentColor, fresnel * 0.55);
  col += uCoreColor * pulse * 0.9;
  col *= 1.0 + vWake * 0.35;
  gl_FragColor = vec4(col, clamp(0.38 + fresnel * 0.42 + pulse * 0.2, 0.0, 0.95));
}
`,Vt=new w(1,1,1).normalize(),Ri=(s,e)=>{e[0]=-1.89*s[0]-4*s[1]-4*s[2]-s[1]*s[1],e[1]=-1.89*s[1]-4*s[2]-4*s[0]-s[2]*s[2],e[2]=-1.89*s[2]-4*s[0]-4*s[1]-s[0]*s[0]};class Li extends oe{init(){const e=Te(3,Ri,[-1.48,-1.51,2.04],.004,6e3,1e3);De(e,3);const t=e.length/3,o=new Float32Array(t*6),n=new Float32Array(t*6),i=new Float32Array(t*4),a=new Float32Array(t*2),l=new Float32Array(t*2),r=[],d=new w,m=new w,h=new w,p=new w,u=new w,c=new w,f=new w;let v=1e-6;for(let y=0;y<t;y++){d.fromArray(e,y*3),m.fromArray(e,Math.max(0,y-1)*3),h.fromArray(e,Math.min(t-1,y+1)*3),p.subVectors(h,m).normalize(),u.copy(Vt).sub(d),c.crossVectors(p,u).normalize(),f.crossVectors(p,c).normalize();const x=.028*(.65+.35*Math.sin(y*.013)),C=u.length();C>v&&(v=C);for(let S=0;S<2;S++){const P=S===0?-1:1,F=y*2+S;o[F*3]=d.x+c.x*x*P,o[F*3+1]=d.y+c.y*x*P,o[F*3+2]=d.z+c.z*x*P,n[F*3]=f.x,n[F*3+1]=f.y,n[F*3+2]=f.z,i[F*2]=y/t,i[F*2+1]=S,a[F]=y/t,l[F]=C}}for(let y=0;y<t-1;y++){const x=y*2;r.push(x,x+2,x+1,x+1,x+2,x+3)}for(let y=0;y<t*2;y++)l[y]/=v;const g=new k;g.setAttribute("position",new M(o,3)),g.setAttribute("normal",new M(n,3)),g.setAttribute("uv",new M(i,2)),g.setAttribute("aProgress",new M(a,1)),g.setAttribute("aDistance",new M(l,1)),g.setIndex(r);const b=q({vertexShader:Ti,fragmentShader:Di,uniforms:{...this.uniforms,uCoreColor:{value:new A(this.config.coreColor)},uGlowColor:{value:new A(this.config.glowColor)},uAccentColor:{value:new A(this.config.accentColor??this.config.glowColor)},uFlowSpeed:{value:3.2}},includeWake:!0,transparent:!0,side:ie,depthWrite:!1});this.attachMesh(g,b)}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateOnAxis(Vt,e*.28)}}const qi=5,_i=-10,Wi=-.38,Ii=(s,e)=>{e[0]=qi*s[0]-s[1]*s[2],e[1]=_i*s[1]+s[0]*s[2],e[2]=Wi*s[2]+s[0]*s[1]/3};class Gi extends mt{init(){this.buildChaosTracks(Ii,{seeds:[[1.2,1.1,.9],[-1.2,-1.1,-.9],[.6,-1.4,1.1],[-.6,1.4,-1.1]],dt:.005,steps:4e3,discard:600,swarmCount:1100,swarmSpeed:160,trackPointSize:1.2,swarmPointSize:2.8})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateY(e*.18)}}const Vi=3,Oi=2.7,Bi=1.7,Ui=2,ji=9,Ni=(s,e)=>{e[0]=s[1]-Vi*s[0]+Oi*s[1]*s[2],e[1]=Bi*s[1]-s[0]*s[2]+s[2],e[2]=Ui*s[0]*s[1]-ji*s[2]};class Hi extends mt{init(){this.buildChaosTracks(Ni,{seeds:[[1.1,1,.8],[-1.1,-1,-.8]],dt:.004,steps:6e3,discard:1200,swarmCount:900,swarmSpeed:140,trackPointSize:1.25,swarmPointSize:2.6})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateZ(e*.1)}}const Ot=Math.sqrt(3),Bt=Math.sqrt(2),Ut=1,j=1200,re=5,me=.48,U=Math.PI;class Zi extends D{geo=new k;lineGeo=new k;pos=new Float32Array(j*3);speed=new Float32Array(j);history=new Float32Array(j*re*3);linePos=new Float32Array(j*(re-1)*2*3);posAttr;speedAttr;lineAttr;points;lines;mats=[];init(){for(let n=0;n<j*3;n++)this.pos[n]=(Math.random()*2-1)*U;for(let n=0;n<j;n++)for(let i=0;i<re;i++){const a=(n*re+i)*3;this.history[a]=this.pos[n*3],this.history[a+1]=this.pos[n*3+1],this.history[a+2]=this.pos[n*3+2]}this.posAttr=new M(this.pos,3),this.speedAttr=new M(this.speed,1);const e=new Float32Array(j);for(let n=0;n<j;n++)e[n]=Math.random();this.geo.setAttribute("position",this.posAttr),this.geo.setAttribute("aSpeed",this.speedAttr),this.geo.setAttribute("aPhase",new M(e,1));const t=ne({uniforms:this.uniforms,size:2.2,coreColor:this.config.coreColor,glowColor:this.config.glowColor});this.mats.push(t),this.points=new _(this.geo,t),this.group.add(this.points),this.lineAttr=new M(this.linePos,3),this.lineGeo.setAttribute("position",this.lineAttr);const o=new ze({color:new A(this.config.accentColor??this.config.glowColor).multiplyScalar(1.6),transparent:!0,opacity:.38,blending:z,depthWrite:!1});this.mats.push(o),this.lines=new Me(this.lineGeo,o),this.group.add(this.lines),this.resources.trackAll(this.geo,this.lineGeo,...this.mats),this.addLodPart({object:this.points,drawRange:[j,400,0]}),this.addLodPart({object:this.lines,visible:n=>n===0,drawRange:[j*(re-1)*2,0,0]}),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n);const i=Math.min(e,.05)*.9;for(let a=0;a<j;a++){const l=a*3,r=this.pos[l],d=this.pos[l+1],m=this.pos[l+2],h=Ot*Math.sin(m)+Ut*Math.cos(d),p=Bt*Math.sin(r)+Ot*Math.cos(m),u=Ut*Math.sin(d)+Bt*Math.cos(r);let c=r+h*i,f=d+p*i,v=m+u*i;c>U?c-=2*U:c<-U&&(c+=2*U),f>U?f-=2*U:f<-U&&(f+=2*U),v>U?v-=2*U:v<-U&&(v+=2*U),this.pos[l]=c,this.pos[l+1]=f,this.pos[l+2]=v,this.speed[a]=Math.min(1,Math.hypot(h,p,u)/4);const g=a*re*3;for(let y=re-1;y>0;y--){const x=g+y*3,C=g+(y-1)*3;this.history[x]=this.history[C],this.history[x+1]=this.history[C+1],this.history[x+2]=this.history[C+2]}this.history[g]=c,this.history[g+1]=f,this.history[g+2]=v;let b=a*(re-1)*6;for(let y=0;y<re-1;y++){const x=g+y*3,C=g+(y+1)*3;this.linePos[b++]=this.history[x]*me,this.linePos[b++]=this.history[x+1]*me,this.linePos[b++]=this.history[x+2]*me,this.linePos[b++]=this.history[C]*me,this.linePos[b++]=this.history[C+1]*me,this.linePos[b++]=this.history[C+2]*me}}for(let a=0;a<j*3;a++)this.posAttr.array[a]=this.pos[a]*me;this.posAttr.needsUpdate=!0,this.speedAttr.needsUpdate=!0,this.lineAttr.needsUpdate=!0}}const Ki=`varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);
  float wake;
  world.xyz = applyProximityWake(world.xyz, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,Yi=`uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.2);

  float forward = 0.5 + 0.5 * sin(vUv.x * 50.0 - uTime * 4.0);
  float backward = 0.5 + 0.5 * sin(vUv.x * 50.0 + uTime * 4.0);
  float interference = pow(forward * backward, 3.0);

  vec3 col = mix(uGlowColor, uAccentColor, forward);
  col = mix(col, uCoreColor, backward * 0.55);
  col += uCoreColor * interference * 1.6;
  col += uCoreColor * fresnel * 0.5;
  col *= 1.0 + vWake * 0.35;
  gl_FragColor = vec4(col, 0.55 + fresnel * 0.3 + interference * 0.25);
}
`,$e=[3,4,5],Xe=[.11,.37,.73];class $i extends oe{init(){const e=[];for(let a=0;a<480;a++){const l=a/480*Math.PI*2;e.push(new w(Math.cos($e[0]*l+Xe[0]),Math.cos($e[1]*l+Xe[1]),Math.cos($e[2]*l+Xe[2])))}const o=new pe(e,!0,"catmullrom",.5),n=new te(o,360,.042,12,!0);n.computeVertexNormals();const i=q({vertexShader:Ki,fragmentShader:Yi,uniforms:{...this.uniforms,uCoreColor:{value:new A(this.config.coreColor)},uGlowColor:{value:new A(this.config.glowColor)},uAccentColor:{value:new A(this.config.accentColor??this.config.glowColor)}},includeWake:!0,transparent:!0,side:ie,depthWrite:!1});this.attachMesh(n,i)}update(e,t,o,n){super.update(e,t,o,n),this.spinBy(e,.07,.16,0)}}class Ce extends oe{createSurface(e,t={}){const o=Mn({uniforms:this.uniforms,accentColor:t.accentColor??this.config.accentColor??this.config.glowColor,gridFreq:t.gridFreq,flowSpeed:t.flowSpeed,waveAmp:t.waveAmp,waveFreq:t.waveFreq,side:t.side??(t.doubleSided?ie:fe)});this.attachMesh(e,o)}}function Ae(s,e,t,o,n,i={}){const a=s+1,l=e+1,r=a*l,d=new Float32Array(r*3),m=new Float32Array(r*2),h=new w,p=[];for(let c=0;c<=s;c++){const f=t[0]+(t[1]-t[0])*c/s;for(let v=0;v<=e;v++){const g=o[0]+(o[1]-o[0])*v/e;n(f,g,h);const b=c*l+v;d[b*3]=h.x,d[b*3+1]=h.y,d[b*3+2]=h.z,m[b*2]=c/s,m[b*2+1]=v/e}}for(let c=0;c<s;c++)for(let f=0;f<e;f++){const v=c*l+f,g=v+l;i.flipWinding?p.push(v,g+1,g,v,v+1,g+1):p.push(v,g,g+1,v,g+1,v+1)}const u=new k;return u.setAttribute("position",new M(d,3)),u.setAttribute("uv",new M(m,2)),u.setIndex(p),u.computeVertexNormals(),i.normalizeTo&&Xi(u,i.normalizeTo),u}function Xi(s,e){const t=s.getAttribute("position");let o=0;for(let i=0;i<t.count;i++){const a=t.getX(i)**2+t.getY(i)**2+t.getZ(i)**2;a>o&&(o=a)}const n=e/Math.max(Math.sqrt(o),1e-6);s.scale(n,n,n),s.computeBoundingSphere()}function pn(s){const e=[],t=Math.PI*(3-Math.sqrt(5));for(let o=0;o<s;o++){const n=1-2*(o+.5)/s,i=Math.sqrt(Math.max(0,1-n*n)),a=o*t;e.push(new w(Math.cos(a)*i,n,Math.sin(a)*i))}return e}class Qi extends Ce{init(){const e=this.config.params?.k??3,t=Ae(160,16,[0,Math.PI*2],[-.38,.38],(o,n,i)=>{const a=Math.cos(e*o/2),l=1+n*a;i.set(l*Math.cos(o),l*Math.sin(o),n*Math.sin(e*o/2))},{normalizeTo:1});this.createSurface(t,{gridFreq:[30,6],flowSpeed:2.6,doubleSided:!0,waveAmp:.006,waveFreq:.8})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateZ(e*.2)}}class Ji extends Ce{init(){const e=this.config.params?.k??3,t=2*e-1,o=Ae(128,48,[0,Math.PI*2],[0,1.15],(n,i,a)=>{const l=Math.pow(i,t);a.set(i*Math.cos(n)-l/t*Math.cos(t*n),-i*Math.sin(n)-l/t*Math.sin(t*n),2*Math.pow(i,e)*Math.cos(e*n)/e)},{normalizeTo:1,flipWinding:!0});this.createSurface(o,{gridFreq:[20,20],flowSpeed:1.9,waveAmp:.035,waveFreq:1.1,doubleSided:!0})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateZ(e*.14)}}const jt=Math.sqrt(5);class es extends Ce{init(){const e=Ae(128,64,[0,Math.PI*2],[0,1],(t,o,n)=>{const i=1-(1-o)*(1-o),a=i**3,l=i**5,r=i**6,d=Math.cos(t),m=Math.sin(t),h=Math.cos(3*t),p=Math.sin(3*t),u=Math.cos(5*t),c=Math.sin(5*t),f=Math.cos(6*t),v=Math.sin(6*t),g=r*f+jt*a*h-1,b=r*v+jt*a*p,y=Math.max(g*g+b*b,1e-6),x=i*d-l*u,C=i*m-l*c,S=i*d+l*u,P=i*m+l*c,F=1+r*f,H=r*v,L=-1.5*(C*g-x*b)/y,W=-1.5*(S*g+P*b)/y,R=(H*g-F*b)/y-.5,se=1/Math.max(L*L+W*W+R*R,1e-6);n.set(L*se,W*se,R*se+.5)},{normalizeTo:1});this.createSurface(e,{gridFreq:[26,16],flowSpeed:2.4,waveAmp:.012,waveFreq:.9,doubleSided:!0})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateY(e*.17)}}const Qe=1,ts=.22;class ns extends Ce{init(){const e=Ae(160,56,[0,Math.PI*4],[.06,2],(t,o,n)=>{n.set(Qe*Math.cos(t)*Math.sin(o),Qe*Math.sin(t)*Math.sin(o),Qe*(Math.cos(o)+Math.log(Math.tan(o/2)))+ts*t)},{normalizeTo:1,flipWinding:!0});this.createSurface(e,{gridFreq:[10,28],flowSpeed:2.8,waveAmp:.008,waveFreq:.7,doubleSided:!0})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateY(e*.2)}}const os=`uniform float uTime;
uniform float uMorphScale;

varying vec2 vUv;
varying float vPhase;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  float u = mix(-1.6, 1.6, uv.x);
  float v = mix(-3.14159265, 3.14159265, uv.y);
  float alpha = 0.45 * uTime;
  float ca = cos(alpha);
  float sa = sin(alpha);
  float shu = sinh(u);
  float chu = cosh(u);
  float sv = sin(v);
  float cv = cos(v);

  vec3 pos = vec3(
    ca * shu * sv + sa * chu * cv,
    -ca * shu * cv + sa * chu * sv,
    v * ca + u * sa
  );

  // 解析切向量叉乘得到精确法线
  vec3 ru = vec3(
    ca * chu * sv + sa * shu * cv,
    -ca * chu * cv + sa * shu * sv,
    sa
  );
  vec3 rv = vec3(
    ca * shu * cv - sa * chu * sv,
    ca * shu * sv + sa * chu * cv,
    ca
  );
  vec3 n = normalize(cross(ru, rv));
  vec4 world = modelMatrix * vec4(pos * uMorphScale, 1.0);
  vec3 nWorld = normalize(mat3(modelMatrix) * n);
  float wake;
  world.xyz = applyProximityWake(world.xyz, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - world.xyz;
  vPhase = sa * sa;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,is=`uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying float vPhase;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.4);
  float flow = 0.5 + 0.5 * sin(vUv.y * 18.0 - uTime * 2.2 + vUv.x * 4.0);
  vec3 col = mix(uAccentColor, uGlowColor, vPhase);
  col = mix(col, uCoreColor, fresnel * 0.7 + flow * 0.15);
  col *= 1.0 + vWake * 0.35;
  gl_FragColor = vec4(col, clamp(0.2 + fresnel * 0.7 + vWake * 0.25, 0.0, 0.95));
}
`;class ss extends oe{init(){const e=new rn(1,1,96,64),t=q({vertexShader:os,fragmentShader:is,uniforms:{...this.uniforms,uMorphScale:{value:.34},uCoreColor:{value:new A(this.config.coreColor)},uGlowColor:{value:new A(this.config.glowColor)},uAccentColor:{value:new A(this.config.accentColor??this.config.glowColor)}},includeWake:!0,transparent:!0,side:ie,depthWrite:!1}),o=e.index?.count??0;this.attachMesh(e,t,{fullRange:o,halfRange:Math.floor(o/4)})}update(e,t,o,n){super.update(e,t,o,n),this.spinBy(e,0,0,.16)}}class as extends Ce{needleGeo=null;needleMat=null;needles=null;init(){const e=Ae(96,96,[0,Math.PI],[0,Math.PI],(t,o,n)=>{n.set(.5*Math.sin(2*t)*Math.cos(o)**2,.5*Math.sin(t)*Math.sin(2*o),.5*Math.cos(t)*Math.sin(2*o))},{normalizeTo:1});this.createSurface(e,{gridFreq:[18,18],flowSpeed:2.1,waveAmp:.006,waveFreq:.8,doubleSided:!0}),this.needleGeo=new k,this.needleGeo.setAttribute("position",new ge([-1.15,0,0,1.15,0,0,0,-1.15,0,0,1.15,0,0,0,-1.15,0,0,1.15],3)),this.needleMat=new ze({color:new A(this.config.accentColor??this.config.glowColor).multiplyScalar(2),transparent:!0,opacity:.75,blending:z,depthWrite:!1}),this.needles=new Me(this.needleGeo,this.needleMat),this.group.add(this.needles),this.resources.track(this.needleGeo),this.resources.track(this.needleMat),this.addLodPart({object:this.needles})}update(e,t,o,n){super.update(e,t,o,n),this.spinBy(e,0,0,.12)}}class rs extends Ce{init(){const e=Ae(120,72,[0,Math.PI*2],[.18,1.2],(t,o,n)=>{const i=o*Math.cos(t),a=o*Math.sin(t),l=.62*Math.cos(3*t)*(1-o/1.2)**1.6;n.set(i,l,a)},{normalizeTo:1,flipWinding:!0});this.createSurface(e,{gridFreq:[24,24],flowSpeed:2.3,waveAmp:.01,waveFreq:.75,doubleSided:!0})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateY(e*.18)}}const ls=`attribute vec4 aPos4D;

uniform float uTime;
uniform float uProjDist;
uniform float uScale;

varying float vDepth4D;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 p = aPos4D;
  float a1 = uTime * 0.42;
  float c1 = cos(a1);
  float s1 = sin(a1);
  vec2 xw = mat2(c1, -s1, s1, c1) * vec2(p.x, p.w);
  p.x = xw.x;
  p.w = xw.y;

  float a2 = uTime * 0.29;
  float c2 = cos(a2);
  float s2 = sin(a2);
  vec2 yz = mat2(c2, -s2, s2, c2) * vec2(p.y, p.z);
  p.y = yz.x;
  p.z = yz.y;

  float invDenom = uProjDist / max(0.35, uProjDist - p.w);
  vec3 pos3D = p.xyz * invDenom * uScale;
  vDepth4D = clamp(p.w * 0.5 + 0.5, 0.0, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos3D, 1.0);
}
`,Nt=`uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vDepth4D;
varying vec2 vUv;

void main() {
  vec3 col = mix(uGlowColor, uAccentColor, vDepth4D);
  col = mix(col, uCoreColor, pow(vDepth4D, 3.0) * 0.75);
  gl_FragColor = vec4(col, 0.35 + 0.55 * vDepth4D);
}
`,cs=`attribute vec4 aPos4D;

uniform float uTime;
uniform float uProjDist;
uniform float uScale;
uniform float uSize;

varying float vDepth4D;
varying vec2 vUv;

void main() {
  vUv = vec2(0.0);
  vec4 p = aPos4D;
  float a1 = uTime * 0.42;
  vec2 xw = mat2(cos(a1), -sin(a1), sin(a1), cos(a1)) * vec2(p.x, p.w);
  p.x = xw.x;
  p.w = xw.y;
  float a2 = uTime * 0.29;
  vec2 yz = mat2(cos(a2), -sin(a2), sin(a2), cos(a2)) * vec2(p.y, p.z);
  p.y = yz.x;
  p.z = yz.y;

  float invDenom = uProjDist / max(0.35, uProjDist - p.w);
  vec3 pos3D = p.xyz * invDenom * uScale;
  vDepth4D = clamp(p.w * 0.5 + 0.5, 0.0, 1.0);
  vec4 mv = modelViewMatrix * vec4(pos3D, 1.0);
  gl_PointSize = clamp(uSize * (1.0 + vDepth4D * 1.5) * (300.0 / max(-mv.z, 1.0)), 2.0, 26.0);
  gl_Position = projectionMatrix * mv;
}
`;class hs extends D{lines=null;points=null;lineGeo=null;pointGeo=null;lineMat=null;pointMat=null;createProjection(e,t,o={}){const n={...this.uniforms,uProjDist:{value:o.projectionDistance??1.85},uScale:{value:o.scale??1},uCoreColor:{value:new A(o.coreColor??this.config.coreColor)},uGlowColor:{value:new A(o.glowColor??this.config.glowColor)},uAccentColor:{value:new A(o.accentColor??this.config.accentColor??this.config.glowColor)}};e&&(this.lineGeo=e,this.lineMat=q({vertexShader:ls,fragmentShader:Nt,uniforms:{...n},includeWake:!1,transparent:!0,depthWrite:!1,blending:z}),this.lines=new Me(e,this.lineMat),this.group.add(this.lines),this.resources.track(e),this.resources.track(this.lineMat)),t&&(this.pointGeo=t,this.pointMat=q({vertexShader:cs,fragmentShader:Nt,uniforms:{...n,uSize:{value:o.pointSize??3}},includeWake:!1,transparent:!0,depthWrite:!1,blending:z}),this.points=new _(t,this.pointMat),this.group.add(this.points),this.resources.track(t),this.resources.track(this.pointMat)),this.setLOD(0)}setLOD(e){if(this.currentLOD=e,this.lines&&(this.lines.visible=e<2),this.points&&(this.points.visible=e<2),this.lineGeo){const t=this.lineGeo.getAttribute("position").count;this.lineGeo.setDrawRange(0,e===0?t:Math.floor(t/3))}this.pointGeo&&this.pointGeo.setDrawRange(0,e===0?this.pointGeo.getAttribute("position").count:40),this.setSpriteVisible(e===2)}}function mn(){const s=[];for(let e=0;e<4;e++)for(let t=e+1;t<4;t++)for(const o of[-1,1])for(const n of[-1,1]){const i=[0,0,0,0];i[e]=o,i[t]=n,s.push(i)}return s}function us(s=mn()){const e=[];for(let t=0;t<s.length;t++)for(let o=t+1;o<s.length;o++){let n=0;for(let i=0;i<4;i++)n+=(s[t][i]-s[o][i])**2;Math.abs(n-2)<1e-6&&e.push([t,o])}return e}function fn(){const s=[];for(let e=0;e<8;e++)for(let t=e+1;t<8;t++)for(const o of[-1,1])for(const n of[-1,1]){const i=new Array(8).fill(0);i[e]=o,i[t]=n,s.push(i)}for(let e=0;e<256;e++){let t=0;for(let n=0;n<8;n++)e&1<<n&&t++;if(t%2!==0)continue;const o=new Array(8).fill(.5);for(let n=0;n<8;n++)e&1<<n&&(o[n]=-.5);s.push(o)}return s.map(e=>e.map(t=>t/Math.SQRT2))}function ds(s=fn()){const e=[];for(let t=0;t<s.length;t++)for(let o=t+1;o<s.length;o++){let n=0;for(let i=0;i<8;i++)n+=s[t][i]*s[o][i];Math.abs(n-.5)<1e-6&&e.push([t,o])}return e}const We=14;class ps extends hs{init(){const e=mn().map(c=>new vt(c[0],c[1],c[2],c[3])),t=us(),o=t.length*We*2,n=new Float32Array(o*3),i=new Float32Array(o*4),a=new Float32Array(o*2),l=new vt;let r=0;for(const[c,f]of t)for(let v=0;v<We;v++)for(const g of[v/We,(v+1)/We])l.copy(e[c]).lerp(e[f],g),i[r*4]=l.x,i[r*4+1]=l.y,i[r*4+2]=l.z,i[r*4+3]=l.w,n[r*3]=l.x*.7,n[r*3+1]=l.y*.7,n[r*3+2]=l.z*.7,r++;const d=new k;d.setAttribute("position",new M(n,3)),d.setAttribute("aPos4D",new M(i,4)),d.setAttribute("uv",new M(a,2)),d.boundingSphere=new st(new w,4);const m=new Float32Array(e.length*4),h=new Float32Array(e.length*3),p=new Float32Array(e.length*2);for(let c=0;c<e.length;c++)m[c*4]=e[c].x,m[c*4+1]=e[c].y,m[c*4+2]=e[c].z,m[c*4+3]=e[c].w,h[c*3]=e[c].x*.7,h[c*3+1]=e[c].y*.7,h[c*3+2]=e[c].z*.7;const u=new k;u.setAttribute("position",new M(h,3)),u.setAttribute("aPos4D",new M(m,4)),u.setAttribute("uv",new M(p,2)),u.boundingSphere=new st(new w,4),this.createProjection(d,u,{projectionDistance:1.85,scale:.75,pointSize:4.2})}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateZ(e*.05)}}const ms=`attribute vec4 aPos4D;

uniform float uTime;
uniform float uProjDist;

varying vec2 vUv;
varying float vDepth4D;
varying vec3 vWorldPos;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  vec4 p = aPos4D;

  float a1 = uTime * 0.35;
  vec2 xw = mat2(cos(a1), -sin(a1), sin(a1), cos(a1)) * vec2(p.x, p.w);
  p.x = xw.x;
  p.w = xw.y;

  float a2 = uTime * 0.23;
  vec2 zw = mat2(cos(a2), -sin(a2), sin(a2), cos(a2)) * vec2(p.z, p.w);
  p.z = zw.x;
  p.w = zw.y;

  float inv = uProjDist / max(0.35, uProjDist - p.w);
  vec3 pos3D = p.xyz * inv * 0.62;
  vec4 world = modelMatrix * vec4(pos3D, 1.0);
  vDepth4D = clamp(p.w * 0.5 + 0.5, 0.0, 1.0);
  vWorldPos = world.xyz;
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,fs=`uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying float vDepth4D;
varying vec3 vWorldPos;
varying vec3 vViewDir;

void main() {
  vec3 V = normalize(vViewDir);
  vec3 radial = normalize(vWorldPos);
  float fresnel = pow(1.0 - abs(dot(radial, V)), 2.4);

  // Villarceau 斜交线：u ± v = const
  float a = abs(fract((vUv.x + vUv.y) * 8.0) - 0.5);
  float b = abs(fract((vUv.x - vUv.y) * 8.0) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.035, min(a, b));

  vec3 col = mix(uGlowColor, uAccentColor, fresnel * 0.65 + vDepth4D * 0.25);
  col = mix(col, uCoreColor, line * 0.75);
  float pulse = 0.5 + 0.5 * sin(uTime * 1.4 + vDepth4D * 8.0);
  col += uAccentColor * pulse * 0.12;
  gl_FragColor = vec4(col, clamp(0.14 + fresnel * 0.55 + line * 0.38, 0.0, 0.92));
}
`,J=64,Ie=1/Math.SQRT2;class gs extends oe{init(){const e=J+1,t=J+1,o=e*t,n=new Float32Array(o*3),i=new Float32Array(o*4),a=new Float32Array(o*2),l=[];for(let m=0;m<=J;m++){const h=m/J*Math.PI*2;for(let p=0;p<=J;p++){const u=p/J*Math.PI*2,c=m*t+p,f=Math.cos(h)*Ie,v=Math.sin(h)*Ie,g=Math.cos(u)*Ie,b=Math.sin(u)*Ie;i[c*4]=f,i[c*4+1]=v,i[c*4+2]=g,i[c*4+3]=b,n[c*3]=f*.8,n[c*3+1]=v*.8,n[c*3+2]=g*.8,a[c*2]=m/J,a[c*2+1]=p/J}}for(let m=0;m<J;m++)for(let h=0;h<J;h++){const p=m*t+h,u=p+t;l.push(p,u,u+1,p,u+1,p+1)}const r=new k;r.setAttribute("position",new M(n,3)),r.setAttribute("aPos4D",new M(i,4)),r.setAttribute("uv",new M(a,2)),r.setIndex(l),r.boundingSphere=new st(new w,3);const d=q({vertexShader:ms,fragmentShader:fs,uniforms:{uTime:this.uniforms.uTime,uProjDist:{value:1.65},uCoreColor:{value:new A(this.config.coreColor)},uGlowColor:{value:new A(this.config.glowColor)},uAccentColor:{value:new A(this.config.accentColor??this.config.glowColor)}},includeWake:!1,transparent:!0,side:ie,depthWrite:!1});this.attachMesh(r,d)}update(e,t,o,n){super.update(e,t,o,n),this.spinBy(e,0,.09,0)}}const vs=`uniform float uTime;
uniform float uBreathAmp;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

attribute float aInstanceScalar;
attribute float aPhase;

varying float vScalar;
varying float vPhase;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  vScalar = aInstanceScalar;
  vPhase = aPhase;

  vec3 center = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float radial = length(center);
  vec3 dir = radial > 0.001 ? center / radial : vec3(0.0, 1.0, 0.0);
  vec3 local = position + dir * sin(uTime * 1.2 - 2.0 * radial + aPhase * 6.2831) * uBreathAmp;

  vec4 world = modelMatrix * instanceMatrix * vec4(local, 1.0);
  vec3 nWorld = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  float wake;
  world.xyz = applyProximityWake(world.xyz, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,ws=`uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vScalar;
varying float vPhase;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.0);
  float pulse = 0.5 + 0.5 * cos(vPhase * 6.2831 - uTime * 1.6);
  vec3 col = mix(uGlowColor, uAccentColor, clamp(vScalar, 0.0, 1.0));
  col = mix(col, uCoreColor, fresnel * 0.65 + pulse * 0.18);
  col *= 1.0 + vWake * 0.5;
  gl_FragColor = vec4(col, clamp(0.22 + fresnel * 0.72 + pulse * 0.1, 0.0, 0.96));
}
`;class Oe extends D{instanceMesh;instanceGeo=null;instanceMat=null;scalarAttr=null;phaseAttr=null;instanceCountTotal=0;createInstances(e,t,o,n,i={}){this.instanceGeo=e,this.instanceCountTotal=t.length,this.scalarAttr=new de(o,1),this.phaseAttr=new de(n,1),e.setAttribute("aInstanceScalar",this.scalarAttr),e.setAttribute("aPhase",this.phaseAttr),this.instanceMat=q({uniforms:{...this.uniforms,uCoreColor:{value:new A(i.coreColor??this.config.coreColor)},uGlowColor:{value:new A(i.glowColor??this.config.glowColor)},uAccentColor:{value:new A(i.accentColor??this.config.accentColor??this.config.glowColor)},uBreathAmp:{value:i.breathAmp??.12}},vertexShader:vs,fragmentShader:ws,includeWake:!0,transparent:i.transparent??!0,depthWrite:!1,side:i.side??fe,blending:i.blending??ot}),this.instanceMesh=new Ee(e,this.instanceMat,t.length);for(let a=0;a<t.length;a++)this.instanceMesh.setMatrixAt(a,t[a]);this.instanceMesh.instanceMatrix.needsUpdate=!0,this.group.add(this.instanceMesh),this.resources.track(e),this.resources.track(this.instanceMat),this.resources.track(this.instanceMesh),this.setLOD(0)}setLOD(e){this.currentLOD=e,this.instanceMesh&&(this.instanceMesh.visible=e<2,this.instanceMesh.count=e===0?this.instanceCountTotal:e===1?Math.max(1,Math.floor(this.instanceCountTotal/3)):0,super.setLOD(e))}}const ys=Math.sqrt(6);function Ht(s,e,t,o){return`${s.toFixed(2)}|${e.toFixed(2)}|${t.toFixed(2)}|${o.toFixed(2)}`}function bs(s=520,e=26){const t=1/Math.SQRT2,o=[{b:2-ys,cx:0,cy:0,cz:0},{b:1,cx:t,cy:t,cz:t},{b:1,cx:t,cy:-t,cz:-t},{b:1,cx:-t,cy:t,cz:-t},{b:1,cx:-t,cy:-t,cz:t}],n=new Set;for(const a of o)n.add(Ht(a.b,a.cx,a.cy,a.cz));const i=[[0,1,2,3,4]];for(;i.length&&o.length<s;){const a=i.shift();let l=0,r=0,d=0,m=0;for(const h of a){const p=o[h];l+=p.b,r+=p.b*p.cx,d+=p.b*p.cy,m+=p.b*p.cz}for(let h=0;h<5;h++){const p=o[a[h]],u=l-p.b-p.b;if(u<=.02||u>e)continue;const c=r-p.b*p.cx-p.b*p.cx,f=d-p.b*p.cy-p.b*p.cy,v=m-p.b*p.cz-p.b*p.cz,g=c/u,b=f/u,y=v/u,x=Ht(u,g,b,y);if(n.has(x))continue;if(n.add(x),o.push({b:u,cx:g,cy:b,cz:y}),o.length>=s)break;const C=a.slice();C[h]=o.length-1,i.push(C)}}return o}const Zt=26;class xs extends Oe{init(){const e=bs(520,Zt).filter(h=>h.b>0&&h.b<=Zt);let t=1e-6;for(const h of e){const p=1/h.b;t=Math.max(t,Math.hypot(h.cx,h.cy,h.cz)+p)}const o=1/t,n=[],i=new Float32Array(e.length),a=new Float32Array(e.length),l=new T,r=new w,d=new w;for(let h=0;h<e.length;h++){const p=e[h],u=1/p.b*o;r.set(p.cx*o,p.cy*o,p.cz*o),d.setScalar(u),n.push(new Y().compose(r,l,d)),i[h]=O.clamp(Math.log2(p.b+1)/4.7,0,1),a[h]=h*.618034%1}const m=new Fe(1,14,10);this.createInstances(m,n,i,a,{breathAmp:.012,transparent:!0,side:ie})}}const Ms=300,Cs=20;class As extends oe{init(){const e=pn(Ms),t=[],o=new w,n=new w,i=new w;for(let c=0;c<e.length;c++){const f=e[c],v=1.03+c*.618034%1*.55,g=f.clone().multiplyScalar(v),b=Math.sqrt(v*v-1),y=new w(0,1,0);Math.abs(f.y)>.9&&y.set(1,0,0),o.crossVectors(f,y).normalize();const x=[];for(let S=0;S<96;S++){const P=S/96*Math.PI*2;if(n.copy(g).addScaledVector(f,Math.cos(P)*b).addScaledVector(o,Math.sin(P)*b),n.length()<.999&&n.length()>.002)x.push(n.clone());else if(x.length>4)break}if(x.length<6)continue;const C=new pe(x.slice(0,Cs),!1);t.push(new te(C,14,.0035,4,!1))}const a=xe(t);t.forEach(c=>c.dispose());const l=a.getAttribute("position"),r=new Float32Array(l.count*3),d=new A(this.config.glowColor),m=new A(this.config.accentColor??this.config.glowColor),h=new A;for(let c=0;c<l.count;c++){i.set(l.getX(c),l.getY(c),l.getZ(c));const f=Math.min(1,i.length());h.copy(d).lerp(m,f*f),r[c*3]=h.r,r[c*3+1]=h.g,r[c*3+2]=h.b}a.setAttribute("color",new M(r,3));const p=new ct({vertexColors:!0,transparent:!0,opacity:.78,blending:z,depthWrite:!1}),u=a.index?.count??0;this.attachMesh(a,p,{fullRange:u,halfRange:Math.floor(u/3)})}update(e,t,o,n){super.update(e,t,o,n),this.spinBy(e,.04,.1,0)}}const Ss=3,Ps=2;class Fs extends Oe{init(){const e=[],t=(h,p,u,c,f)=>{if(f===0){e.push([h,p,u,c]);return}const v=c/3;for(let g=-1;g<=1;g++)for(let b=-1;b<=1;b++)for(let y=-1;y<=1;y++)(g===0?1:0)+(b===0?1:0)+(y===0?1:0)>1||t(h+g*v,p+b*v,u+y*v,v,f-1)};t(0,0,0,Ps,Ss);const o=[],n=new Float32Array(e.length),i=new Float32Array(e.length),a=new T,l=new w,r=new w;let d=1e-6;for(const[h,p,u]of e)d=Math.max(d,Math.hypot(h,p,u));for(let h=0;h<e.length;h++){const[p,u,c,f]=e[h];l.set(p,u,c),r.setScalar(f*.98),o.push(new Y().compose(l,a,r)),n[h]=Math.hypot(p,u,c)/d,i[h]=h*.618034%1}const m=new lt(1,1,1);this.createInstances(m,o,n,i,{breathAmp:.05,transparent:!0,side:fe})}}function ks(){let s=1337;const e=()=>(s=s*1664525+1013904223>>>0,s/4294967296-.5),t=[];for(let o=0;o<3;o++){const n=new Array(8).fill(0).map(()=>e());for(const a of t){let l=0;for(let r=0;r<8;r++)l+=n[r]*a[r];for(let r=0;r<8;r++)n[r]-=l*a[r]}let i=0;for(let a=0;a<8;a++)i+=n[a]*n[a];i=Math.sqrt(i)||1,t.push(n.map(a=>a/i))}return t}class Es extends Oe{lineGeo=null;lineMat=null;lines=null;init(){const e=fn(),t=ks(),o=e.map(p=>{const u=p.reduce((v,g,b)=>v+g*t[0][b],0),c=p.reduce((v,g,b)=>v+g*t[1][b],0),f=p.reduce((v,g,b)=>v+g*t[2][b],0);return new w(u,c,f)});let n=1e-6;for(const p of o)n=Math.max(n,p.length());for(const p of o)p.multiplyScalar(1/n);const i=[];for(const[p,u]of ds(e))i.push(o[p].x,o[p].y,o[p].z,o[u].x,o[u].y,o[u].z);this.lineGeo=new k,this.lineGeo.setAttribute("position",new ge(i,3)),this.lineMat=new ze({color:new A(this.config.glowColor).multiplyScalar(1.2),transparent:!0,opacity:.16,blending:z,depthWrite:!1}),this.lines=new Me(this.lineGeo,this.lineMat),this.group.add(this.lines),this.resources.track(this.lineGeo),this.resources.track(this.lineMat);const a=[],l=new Float32Array(o.length),r=new Float32Array(o.length),d=new T,m=new w;for(let p=0;p<o.length;p++)m.setScalar(.022),a.push(new Y().compose(o[p],d,m)),l[p]=o[p].length(),r[p]=p*.618034%1;const h=new Fe(1,12,8);this.createInstances(h,a,l,r,{breathAmp:.006,transparent:!0,side:fe}),this.addLodPart({object:this.lines,drawRange:[6720*2,1200,0]})}}function zs(s){const e=s.length;if(e===0)return{r:0,psi:0};let t=0,o=0;for(let n=0;n<e;n++)t+=Math.cos(s[n]),o+=Math.sin(s[n]);return t/=e,o/=e,{r:Math.hypot(t,o),psi:Math.atan2(o,t)}}function Ts(s,e,t,o){const n=zs(s),i=s.length;for(let a=0;a<i;a++)s[a]+=(e[a]+t*n.r*Math.sin(n.psi-s[a]))*o;return n}const Ds=`uniform float uTime;
uniform float uSize;

attribute float aPhase;

varying float vPulse;

void main() {
  float pulse = pow(0.5 + 0.5 * cos(aPhase), 3.0);
  vPulse = pulse;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec4 mv = viewMatrix * world;
  gl_PointSize = clamp(uSize * (0.45 + pulse * 1.4) * (320.0 / max(-mv.z, 1.0)), 1.5, 28.0);
  gl_Position = projectionMatrix * mv;
}
`,Rs=`uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vPulse;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float soft = 1.0 - d2 * 4.0;
  vec3 col = mix(uGlowColor, uAccentColor, vPulse);
  col = mix(col, uCoreColor, pow(vPulse, 2.0) * 0.8);
  gl_FragColor = vec4(col * soft * (0.55 + vPulse * 1.4), soft * (0.35 + vPulse * 0.65));
}
`,ye=600,Ls=2;class qs extends D{geo=new k;phases=new Float32Array(ye);omegas=new Float32Array(ye);phaseAttr;points;init(){const e=pn(ye),t=new Float32Array(ye*3),o=tn(Math.floor(this.config.orbit.seed*4294967295));for(let i=0;i<ye;i++)t[i*3]=e[i].x,t[i*3+1]=e[i].y,t[i*3+2]=e[i].z,this.phases[i]=o()*Math.PI*2,this.omegas[i]=(o()-.5)*.7;this.geo.setAttribute("position",new M(t,3)),this.phaseAttr=new M(this.phases,1),this.geo.setAttribute("aPhase",this.phaseAttr);const n=q({vertexShader:Ds,fragmentShader:Rs,uniforms:{uTime:this.uniforms.uTime,uSize:{value:2.4},uCoreColor:{value:new A(this.config.coreColor)},uGlowColor:{value:new A(this.config.glowColor)},uAccentColor:{value:new A(this.config.accentColor??this.config.glowColor)}},includeWake:!1,transparent:!0,blending:z,depthWrite:!1});this.points=new _(this.geo,n),this.group.add(this.points),this.resources.trackAll(this.geo,n),this.addLodPart({object:this.points,drawRange:[ye,260,0]}),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n);const i=Ls+1.8*Math.sin(.25*t);Ts(this.phases,this.omegas,i,Math.min(e,.05)),this.phaseAttr.needsUpdate=!0}}const N=(1+Math.sqrt(5))/2;function gn(s){const e=Math.hypot(s[0],s[1],s[2]);return[s[0]/e,s[1]/e,s[2]/e]}const Je=[[1,N,0],[-1,N,0],[0,1,N],[0,-1,N],[N,0,1],[N,0,-1]].map(gn),et=[[1,-N,0],[1,N,0],[0,-1,N],[0,1,N],[-N,0,1],[N,0,-1]].map(gn);class _s extends Oe{lineGeo=null;lineMat=null;lines=null;init(){const e=[];for(let g=-4;g<=4;g++)for(let b=-4;b<=4;b++)for(let y=-4;y<=4;y++)for(let x=-4;x<=4;x++)for(let C=-4;C<=4;C++)for(let S=-4;S<=4;S++){const P=[g,b,y,x,C,S];let F=0,H=0,L=0,W=0,R=0,se=0;for(let I=0;I<6;I++)F+=P[I]*Je[I][0],H+=P[I]*Je[I][1],L+=P[I]*Je[I][2],W+=P[I]*et[I][0],R+=P[I]*et[I][1],se+=P[I]*et[I][2];Math.hypot(W,R,se)>.92||Math.hypot(F,H,L)<1e-4||e.push(new w(F,H,L))}const n=[],i=new Set;for(const g of e){const b=`${g.x.toFixed(3)}|${g.y.toFixed(3)}|${g.z.toFixed(3)}`;i.has(b)||(i.add(b),n.push(g))}let a=1e-6;for(const g of n)a=Math.max(a,g.length());const l=1/a;for(const g of n)g.multiplyScalar(l);const r=[],d=new Float32Array(n.length),m=new Float32Array(n.length),h=new T,p=new w;for(let g=0;g<n.length;g++){const b=n[g];p.setScalar(.035),r.push(new Y().compose(b,h,p)),d[g]=b.length(),m[g]=g*.618034%1}const u=new Fe(1,10,8);this.createInstances(u,r,d,m,{breathAmp:.01,transparent:!0,side:ie});const c=[],f=900;let v=0;for(let g=0;g<n.length&&v<f;g++)for(let b=g+1;b<n.length&&v<f;b++)n[g].distanceTo(n[b])<.28&&(c.push(n[g].x,n[g].y,n[g].z,n[b].x,n[b].y,n[b].z),v++);this.lineGeo=new k,this.lineGeo.setAttribute("position",new ge(c,3)),this.lineMat=new ze({color:new A(this.config.accentColor??this.config.glowColor).multiplyScalar(1.4),transparent:!0,opacity:.32,blending:z,depthWrite:!1}),this.lines=new Me(this.lineGeo,this.lineMat),this.group.add(this.lines),this.resources.track(this.lineGeo),this.resources.track(this.lineMat),this.addLodPart({object:this.lines,drawRange:[1800,500,0]})}}const Ws=[.65,1,1.45],Kt=16,Yt=28,ee=1200;class Is extends D{tubeGeo=null;tubeMat=null;tubeMesh;particleGeo=new k;particleAttr;particlePoints;particleMat;lines=[];particleLine=new Uint16Array(ee);particlePhase=new Float32Array(ee);particleSpeed=new Float32Array(ee);particlePos=new Float32Array(ee*3);constructor(e){super(e),this.particleMat=ne({uniforms:this.uniforms,size:2.1,coreColor:e.coreColor,glowColor:e.glowColor})}init(){const e=[];let t=1e-6;for(const l of Ws)for(let r=0;r<Kt;r++){const d=r/Kt*Math.PI*2,m=[];for(let p=0;p<Yt;p++){const u=.18+p/(Yt-1)*(Math.PI-.36),c=l*Math.sin(u)**2,f=c*Math.sin(u)*Math.cos(d),v=c*Math.cos(u),g=c*Math.sin(u)*Math.sin(d);m.push(new w(f,v,g)),t=Math.max(t,Math.hypot(f,v,g))}this.lines.push({pts:m});const h=new pe(m);e.push(new te(h,24,.006,4,!1))}const o=1/t;for(const l of this.lines)for(const r of l.pts)r.multiplyScalar(o);this.tubeGeo=xe(e),e.forEach(l=>l.dispose()),this.tubeGeo.scale(o,o,o),this.tubeMat=ke({uniforms:this.uniforms,accentColor:this.config.accentColor??this.config.glowColor,flowSpeed:2.4,blending:z}),this.tubeMesh=new V(this.tubeGeo,this.tubeMat),this.group.add(this.tubeMesh);for(let l=0;l<ee;l++)this.particleLine[l]=Math.floor(Math.random()*this.lines.length),this.particlePhase[l]=Math.random(),this.particleSpeed[l]=.08+Math.random()*.16;this.particleAttr=new M(this.particlePos,3),this.particleGeo.setAttribute("position",this.particleAttr);const n=new Float32Array(ee),i=new Float32Array(ee);for(let l=0;l<ee;l++)n[l]=.9,i[l]=this.particlePhase[l];this.particleGeo.setAttribute("aSpeed",new M(n,1)),this.particleGeo.setAttribute("aPhase",new M(i,1)),this.particlePoints=new _(this.particleGeo,this.particleMat),this.group.add(this.particlePoints),this.resources.trackAll(this.tubeGeo,this.tubeMat,this.particleGeo,this.particleMat);const a=this.tubeGeo.index?.count??0;this.addLodPart({object:this.tubeMesh,drawRange:[a,Math.floor(a/3),0]}),this.addLodPart({object:this.particlePoints,drawRange:[ee,360,0]}),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n);for(let i=0;i<ee;i++){const a=this.lines[this.particleLine[i]],r=(this.particlePhase[i]+t*this.particleSpeed[i])%1*(a.pts.length-1),d=Math.floor(r),m=Math.min(a.pts.length-1,d+1),h=a.pts[d],p=a.pts[m],u=r-d;this.particlePos[i*3]=h.x+(p.x-h.x)*u,this.particlePos[i*3+1]=h.y+(p.y-h.y)*u,this.particlePos[i*3+2]=h.z+(p.z-h.z)*u}this.particleAttr.needsUpdate=!0}}const Gs=`// 四元数茱莉亚集 Raymarching（GLSL ES 3.0 / WebGL2）
in vec3 vObjPos;
in vec3 vRo;
in vec4 vClipCorner;
in vec4 vClipCam;

uniform float uTime;
uniform vec3 uDeepColor;
uniform vec3 uTipColor;
uniform vec3 uHaloColor;

out vec4 fragColor;

vec4 qSqr(vec4 q) {
  return vec4(q.x * q.x - dot(q.yzw, q.yzw), 2.0 * q.x * q.yzw);
}

vec2 mapJulia(vec3 p, vec4 c) {
  vec4 z = vec4(p, 0.0);
  float dz = 1.0;
  float trap = 1e5;
  for (int i = 0; i < 10; i++) {
    dz = 2.0 * length(z) * dz;
    z = qSqr(z) + c;
    float r2 = dot(z, z);
    trap = min(trap, length(z.xyz - vec3(0.25, 0.15, 0.1)));
    if (r2 > 16.0) break;
  }
  float r = length(z);
  float de = 0.5 * r * log(max(r, 1.0001)) / max(dz, 1e-5);
  return vec2(de, trap);
}

vec3 calcNormal(vec3 p, vec4 c) {
  const float eps = 0.0025;
  vec2 k = vec2(1.0, -1.0);
  return normalize(
    k.xyy * mapJulia(p + k.xyy * eps, c).x +
    k.yyx * mapJulia(p + k.yyx * eps, c).x +
    k.yxy * mapJulia(p + k.yxy * eps, c).x +
    k.xxx * mapJulia(p + k.xxx * eps, c).x
  );
}

void main() {
  vec3 ro = vRo;
  vec3 rd = normalize(vObjPos - ro);
  float t0 = 0.0;
  float t1 = 1e9;
  {
    vec2 tx = vec2((-1.0 - ro.x) / rd.x, (1.0 - ro.x) / rd.x);
    vec2 ty = vec2((-1.0 - ro.y) / rd.y, (1.0 - ro.y) / rd.y);
    vec2 tz = vec2((-1.0 - ro.z) / rd.z, (1.0 - ro.z) / rd.z);
    t0 = max(t0, max(max(min(tx.x, tx.y), min(ty.x, ty.y)), min(tz.x, tz.y)));
    t1 = min(t1, min(min(max(tx.x, tx.y), max(ty.x, ty.y)), max(tz.x, tz.y)));
  }
  if (t0 > t1) discard;

  vec4 cParam = vec4(
    -0.2 + 0.15 * cos(0.4 * uTime),
     0.6 + 0.12 * sin(0.4 * uTime),
     0.2 * sin(0.25 * uTime),
     0.15 * cos(0.3 * uTime)
  );

  float t = t0;
  bool hit = false;
  vec3 hp = vec3(0.0);
  float trapVal = 1.0;
  float steps = 0.0;

  for (int i = 0; i < 56; i++) {
    vec3 p = ro + rd * t;
    vec2 res = mapJulia(p, cParam);
    trapVal = res.y;
    steps += 1.0;
    if (res.x < 0.0018 * (1.0 + t * 0.4)) {
      hit = true;
      hp = p;
      break;
    }
    t += max(res.x * 0.8, 0.0015);
    if (t > t1 + 0.2) break;
  }
  if (!hit) discard;

  vec3 normal = calcNormal(hp, cParam);
  float ao = 1.0 - steps / 56.0;
  float fresnel = pow(1.0 - max(dot(normal, -rd), 0.0), 2.4);
  vec3 col = mix(uDeepColor, uHaloColor, clamp(trapVal * 1.4, 0.0, 1.0));
  col = col * (0.3 + 0.9 * ao) + uTipColor * fresnel * 1.2;

  float travel = length(hp - ro) / max(length(vObjPos - ro), 1e-5);
  vec4 clip = mix(vClipCam, vClipCorner, travel);
  gl_FragDepth = (clip.z / clip.w) * 0.5 + 0.5;
  fragColor = vec4(col, 1.0);
}
`;function Vs(s){const[e,t,o,n]=s;return[e*e-(t*t+o*o+n*n),2*e*t,2*e*o,2*e*n]}function Os(s,e,t,o,n=10){let i=[s,e,t,0],a=1,l=0;for(let r=0;r<n;r++){l=Math.hypot(i[0],i[1],i[2],i[3]),a=2*l*a;const d=Vs(i);if(i=[d[0]+o[0],d[1]+o[1],d[2]+o[2],d[3]+o[3]],i[0]*i[0]+i[1]*i[1]+i[2]*i[2]+i[3]*i[3]>16)break}return l=Math.hypot(i[0],i[1],i[2],i[3]),.5*l*Math.log(Math.max(l,1.0001))/Math.max(a,1e-5)}class Bs extends pt{init(){const e=[-.2,.6,.2,.15],t=[];let o=0;for(;t.length<3e3*3&&o<22e4;){o++;const n=(Math.random()*2-1)*1.05,i=(Math.random()*2-1)*1.05,a=(Math.random()*2-1)*1.05;Os(n,i,a,e)<.02&&t.push(n,i,a)}this.createRaymarch(Gs,{deepColor:this.config.accentColor??"#14B8A6",tipColor:this.config.coreColor,haloColor:this.config.glowColor,pointCloud:new Float32Array(t),pointSize:1.7})}}const Us=`// Gyroid TPMS Raymarching（GLSL ES 3.0 / WebGL2）
in vec3 vObjPos;
in vec3 vRo;
in vec4 vClipCorner;
in vec4 vClipCam;

uniform float uTime;
uniform vec3 uDeepColor;
uniform vec3 uTipColor;
uniform vec3 uHaloColor;

out vec4 fragColor;

float gyroid(vec3 p, float t) {
  float k = 2.6;
  vec3 q = p * k;
  float f = sin(q.x) * cos(q.y) + sin(q.y) * cos(q.z) + sin(q.z) * cos(q.x);
  return f - t;
}

float de(vec3 p, float t) {
  float shell = (abs(gyroid(p, t)) - 0.14) / (2.6 * 1.6);
  return max(length(p) - 1.12, shell);
}

vec3 calcNormal(vec3 p, float t) {
  const float e = 0.0025;
  return normalize(vec3(
    de(p + vec3(e, 0.0, 0.0), t) - de(p - vec3(e, 0.0, 0.0), t),
    de(p + vec3(0.0, e, 0.0), t) - de(p - vec3(0.0, e, 0.0), t),
    de(p + vec3(0.0, 0.0, e), t) - de(p - vec3(0.0, 0.0, e), t)
  ));
}

void main() {
  vec3 ro = vRo;
  vec3 rd = normalize(vObjPos - ro);
  float t0 = 0.0;
  float t1 = 1e9;
  {
    vec2 tx = vec2((-1.0 - ro.x) / rd.x, (1.0 - ro.x) / rd.x);
    vec2 ty = vec2((-1.0 - ro.y) / rd.y, (1.0 - ro.y) / rd.y);
    vec2 tz = vec2((-1.0 - ro.z) / rd.z, (1.0 - ro.z) / rd.z);
    t0 = max(t0, max(max(min(tx.x, tx.y), min(ty.x, ty.y)), min(tz.x, tz.y)));
    t1 = min(t1, min(min(max(tx.x, tx.y), max(ty.x, ty.y)), max(tz.x, tz.y)));
  }
  if (t0 > t1) discard;

  float t = t0;
  float wave = 0.25 * sin(0.5 * uTime);
  bool hit = false;
  vec3 hp = vec3(0.0);
  float steps = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = de(p, wave);
    steps += 1.0;
    if (d < 0.0018) {
      hit = true;
      hp = p;
      break;
    }
    t += max(d * 0.75, 0.0015);
    if (t > t1 + 0.2) break;
  }
  if (!hit) discard;

  vec3 nrm = calcNormal(hp, wave);
  float ao = 1.0 - steps / 64.0;
  float fresnel = pow(1.0 - max(dot(nrm, -rd), 0.0), 2.2);
  float depthShade = clamp(length(hp) * 0.9, 0.0, 1.0);
  vec3 col = mix(uDeepColor, uHaloColor, depthShade);
  col = col * (0.35 + 0.85 * ao) + uTipColor * fresnel * 1.35;

  float travel = length(hp - ro) / max(length(vObjPos - ro), 1e-5);
  vec4 clip = mix(vClipCam, vClipCorner, travel);
  gl_FragDepth = (clip.z / clip.w) * 0.5 + 0.5;
  fragColor = vec4(col, 1.0);
}
`;function js(s,e,t,o=2.6){const n=s*o,i=e*o,a=t*o;return Math.sin(n)*Math.cos(i)+Math.sin(i)*Math.cos(a)+Math.sin(a)*Math.cos(n)}class Ns extends pt{init(){const e=[];let t=0;for(;e.length<2600*3&&t<26e4;){t++;const o=(Math.random()*2-1)*1.1,n=(Math.random()*2-1)*1.1,i=(Math.random()*2-1)*1.1;Math.hypot(o,n,i)>1.1||Math.abs(js(o,n,i))<.14&&e.push(o,n,i)}this.createRaymarch(Us,{deepColor:this.config.glowColor,tipColor:this.config.coreColor,haloColor:this.config.accentColor??"#22D3EE",pointCloud:new Float32Array(e),pointSize:1.5})}}const $t=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Hs=`uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uFeed;
uniform float uKill;

varying vec2 vUv;

void main() {
  vec2 c = vUv;
  vec4 st = texture2D(uState, c);
  float u = st.r;
  float v = st.g;

  float lu = -u;
  float lv = -v;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      if (x == 0 && y == 0) continue;
      vec2 o = vec2(float(x), float(y)) * uTexel;
      vec4 s = texture2D(uState, c + o);
      float w = (x == 0 || y == 0) ? 0.2 : 0.05;
      lu += s.r * w;
      lv += s.g * w;
    }
  }

  float du = 0.21;
  float dv = 0.105;
  float reaction = u * v * v;
  float nu = u + (du * lu - reaction + uFeed * (1.0 - u));
  float nv = v + (dv * lv + reaction - (uFeed + uKill) * v);
  gl_FragColor = vec4(clamp(nu, 0.0, 1.0), clamp(nv, 0.0, 1.0), 0.0, 1.0);
}
`,Zs=`varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 cell = floor(vUv * 64.0);
  float n = hash(cell);
  float v = step(0.9, n) * 0.9;
  gl_FragColor = vec4(1.0, v, 0.0, 1.0);
}
`,Ks=`uniform sampler2D uState;
uniform float uDisplace;

varying vec2 vUv;
varying float vDisp;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  float v = texture2D(uState, uv).g;
  vDisp = v;
  vec3 local = position + normal * (v - 0.35) * uDisplace;
  vec4 world = modelMatrix * vec4(local, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,Ys=`uniform sampler2D uState;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying float vDisp;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  float v = texture2D(uState, vUv).g;
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.0);
  vec3 col = mix(uGlowColor * 0.35, uAccentColor, smoothstep(0.1, 0.55, v));
  col = mix(col, uCoreColor, smoothstep(0.55, 0.95, v) * 0.85);
  col += uCoreColor * fresnel * 0.5;
  gl_FragColor = vec4(col, 0.82 + fresnel * 0.15);
}
`,be=256,$s=4;class Xs extends D{targetA=null;targetB=null;updateMat=null;initMat=null;displayMat=null;quadScene=null;quadCamera=null;quadMesh=null;display=null;lowGeo=null;highGeo=null;quadGeo=null;initialized=!1;init(){const e={type:sn,minFilter:bt,magFilter:bt,wrapS:yt,wrapT:yt,depthBuffer:!1,stencilBuffer:!1};this.targetA=new wt(be,be,e),this.targetB=new wt(be,be,e),this.quadCamera=new On(-1,1,1,-1,0,1),this.quadScene=new nn,this.updateMat=new ue({vertexShader:$t,fragmentShader:Hs,uniforms:{uState:{value:null},uTexel:{value:new ln(1/be,1/be)},uFeed:{value:this.config.params?.feed??.0545},uKill:{value:this.config.params?.kill??.062}},depthTest:!1,depthWrite:!1}),this.initMat=new ue({vertexShader:$t,fragmentShader:Zs,depthTest:!1,depthWrite:!1}),this.quadGeo=new rn(2,2);const t=new V(this.quadGeo,this.updateMat);t.frustumCulled=!1,this.quadMesh=t,this.quadScene.add(t),this.highGeo=new it(1,5),this.lowGeo=new it(1,3),this.displayMat=new ue({vertexShader:Ks,fragmentShader:Ys,uniforms:{uState:{value:this.targetA.texture},uDisplace:{value:.16},uCoreColor:{value:new A(this.config.coreColor)},uGlowColor:{value:new A(this.config.glowColor)},uAccentColor:{value:new A(this.config.accentColor??this.config.glowColor)}},transparent:!0,depthWrite:!1}),this.display=new V(this.highGeo,this.displayMat),this.display.onBeforeRender=o=>{this.step(o),this.displayMat.uniforms.uState.value=this.targetA.texture},this.group.add(this.display),this.resources.trackAll(this.targetA,this.targetB,this.updateMat,this.initMat,this.displayMat,this.highGeo,this.lowGeo,this.quadGeo),this.addLodPart({object:this.display,geometrySwap:{lod0:this.highGeo,lod1:this.lowGeo}}),this.setLOD(0)}step(e){if(!this.targetA||!this.targetB||!this.updateMat||!this.quadScene||!this.quadCamera)return;const t=e.getRenderTarget();this.initialized||(this.quadMesh.material=this.initMat,e.setRenderTarget(this.targetA),e.render(this.quadScene,this.quadCamera),this.initialized=!0),this.quadMesh.material=this.updateMat;let o=this.targetA,n=this.targetB;for(let i=0;i<$s;i++){this.updateMat.uniforms.uState.value=o.texture,e.setRenderTarget(n),e.render(this.quadScene,this.quadCamera);const a=o;o=n,n=a}this.targetA=o,this.targetB=n,e.setRenderTarget(t)}}function Qs(s){const e=new Array(s+1).fill(!0);e[0]=!1,e[1]=!1;for(let t=2;t*t<=s;t++)if(e[t])for(let o=t*t;o<=s;o+=t)e[o]=!1;return e}function Xt(s,e){if(!e(s))return-1;let t=0;for(let o=2;o<s;o++)e(o)&&t++;return t}const tt=4096;class Js extends D{geo=new k;lineGeo=null;lineMat=null;points;lines=null;init(){const e=Qs(tt),t=[],o=[];for(let u=2;u<=tt;u++){if(!e[u])continue;const c=Math.sqrt(u),f=2*Math.PI*Math.sqrt(u),v=.35*c*Math.sin(Math.PI*u/180);t.push(new w(c*Math.cos(f),v,c*Math.sin(f))),o.push(e[u+2]===!0)}let n=1e-6;for(const u of t)n=Math.max(n,u.length());for(const u of t)u.multiplyScalar(1/n);const i=new Float32Array(t.length*3),a=new Float32Array(t.length),l=new Float32Array(t.length);for(let u=0;u<t.length;u++)i[u*3]=t[u].x,i[u*3+1]=t[u].y,i[u*3+2]=t[u].z,a[u]=o[u]?1:.22,l[u]=u*.618034%1;this.geo.setAttribute("position",new M(i,3)),this.geo.setAttribute("aSpeed",new M(a,1)),this.geo.setAttribute("aPhase",new M(l,1));const r=ne({uniforms:this.uniforms,size:2.4,coreColor:this.config.coreColor,glowColor:this.config.glowColor});this.points=new _(this.geo,r),this.group.add(this.points);const d=[];let m=0;for(let u=2;u<=tt;u++)if(e[u]){if(e[u+2]){const c=m,f=m+1;f<t.length&&d.push(t[c].x,t[c].y,t[c].z,t[f].x,t[f].y,t[f].z)}m++}for(let u=0;u<40;u++){const c=u*u+u+41,f=(u+1)*(u+1)+(u+1)+41;if(!e[c]||!e[f])continue;const v=Xt(c,b=>e[b]),g=Xt(f,b=>e[b]);v>=0&&g>=0&&v<t.length&&g<t.length&&d.push(t[v].x,t[v].y,t[v].z,t[g].x,t[g].y,t[g].z)}this.lineGeo=new k,this.lineGeo.setAttribute("position",new ge(d,3)),this.lineMat=new ze({color:new A(this.config.accentColor??this.config.glowColor).multiplyScalar(1.6),transparent:!0,opacity:.45,blending:z,depthWrite:!1}),this.lines=new Me(this.lineGeo,this.lineMat),this.group.add(this.lines),this.resources.trackAll(this.geo,this.lineGeo,this.lineMat,r);const h=this.geo.getAttribute("position").count,p=this.lineGeo.getAttribute("position").count;this.addLodPart({object:this.points,drawRange:[h,180,0]}),this.addLodPart({object:this.lines,drawRange:[p,Math.floor(p/3),0]}),this.setLOD(0)}update(e,t,o,n){super.update(e,t,o,n),this.group.rotateY(e*.1)}}const ea=`uniform float uTime;
uniform float uSize;
uniform float uOrbitalM;

attribute float aPhaseSign;
attribute float aProb;

varying float vSign;
varying float vProb;

void main() {
  vSign = aPhaseSign;
  vProb = aProb;
  float angle = uTime * (0.18 + abs(uOrbitalM) * 0.08);
  float c = cos(angle);
  float s = sin(angle);
  vec3 p = vec3(c * position.x - s * position.z, position.y, s * position.x + c * position.z);
  vec4 world = modelMatrix * vec4(p, 1.0);
  vec4 mv = viewMatrix * world;
  float breathe = 0.7 + 0.3 * sin(uTime * 1.7 + aProb * 9.0);
  gl_PointSize = clamp(uSize * (0.45 + aProb * 1.4) * breathe * (300.0 / max(-mv.z, 1.0)), 1.2, 22.0);
  gl_Position = projectionMatrix * mv;
}
`,ta=`uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vSign;
varying float vProb;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float soft = 1.0 - d2 * 4.0;
  vec3 col = vSign >= 0.0 ? mix(uGlowColor, uCoreColor, vProb) : mix(uAccentColor, uCoreColor, vProb * 0.7);
  gl_FragColor = vec4(col * soft * (0.35 + vProb * 1.5), soft * (0.3 + vProb * 0.6));
}
`,Qt=[[3,2,0],[4,2,1],[4,3,2],[5,3,1]];function vn(s,e,t){return s===3&&e===2?t*t*Math.exp(-t/2):s===4&&e===2?t*t*Math.exp(-t/2)*(6-t):s===4&&e===3?t**3*Math.exp(-t/2):s===5&&e===3?t**3*Math.exp(-t/2)*(8-t):t**e*Math.exp(-t/2)}function wn(s,e,t,o){const n=Math.cos(t),i=Math.sin(t);return s===2&&e===0?.315391565*(3*n*n-1):s===2&&e===1?-.772548404*i*n*Math.cos(o):s===3&&e===2?.546274215*i*i*Math.cos(2*o):s===3&&e===1?-.323180184*i*(5*n*n-1)*Math.cos(o):0}function na(s,e,t,o){const[n,i,a]=s,l=2*e/n,r=vn(n,i,l)*wn(i,a,t,o);return r*r}function oa(s,e,t,o){const[n,i,a]=s;return vn(n,i,2*e/n)*wn(i,a,t,o)>=0?1:-1}class ia extends D{geo=new k;points;mat=null;init(){const e=Math.abs(parseInt(this.config.id.split("_").pop()??"0",10))%Qt.length,t=this.config.params?.states?.[e]??Qt[e],o=t[0],n=4*o*o,i=4500,a=[],l=[],r=[];let d=1e-9,m=0;const h=22e4;for(let p=0;p<h&&m<i;p++){const u=Math.min(n,-Math.log(1-Math.random())*o*o*.6),c=Math.random()*2-1,f=Math.random()*Math.PI*2,v=Math.sqrt(Math.max(0,1-c*c)),g=Math.acos(c),b=na(t,u,g,f);if(b>d&&(d=b),Math.random()*d>b)continue;const y=oa(t,u,g,f);a.push(u*v*Math.cos(f)/n,u*c/n,u*v*Math.sin(f)/n),l.push(y),r.push(Math.min(1,b/d)),m++}for(;m<i;){const p=Math.min(n,-Math.log(1-Math.random())*o*o*.6),u=Math.random()*2-1,c=Math.random()*Math.PI*2,f=Math.sqrt(Math.max(0,1-u*u));a.push(p*f*Math.cos(c)/n,p*u/n,p*f*Math.sin(c)/n),l.push(1),r.push(.35),m++}this.geo.setAttribute("position",new ge(a,3)),this.geo.setAttribute("aPhaseSign",new ge(l,1)),this.geo.setAttribute("aProb",new ge(r,1)),this.geo.setDrawRange(0,i),this.mat=q({vertexShader:ea,fragmentShader:ta,uniforms:{uTime:this.uniforms.uTime,uSize:{value:1.9},uOrbitalM:{value:t[2]},uCoreColor:{value:new A(this.config.coreColor)},uGlowColor:{value:new A(this.config.glowColor)},uAccentColor:{value:new A(this.config.accentColor??this.config.glowColor)}},includeWake:!1,transparent:!0,blending:z,depthWrite:!1}),this.points=new _(this.geo,this.mat),this.group.add(this.points),this.resources.trackAll(this.geo,this.mat),this.addLodPart({object:this.points,drawRange:[4500,1500,0]}),this.setLOD(0)}}const sa={lorenz:Ko,rossler:$o,aizawa:Qo,"calabi-yau":ei,klein:ti,"torus-knot":oi,mandelbulb:li,sierpinski:ui,hopf:fi,fourier:wi,harmonics:Ci,phyllotaxis:ki,thomas:zi,halvorsen:Li,"chen-lee":Gi,dadras:Hi,"abc-flow":Zi,lissajous:$i,"mobius-twisted":Qi,enneper:Ji,boy:es,dini:ns,"helicoid-catenoid":ss,roman:as,costa:rs,"cell-24":ps,"clifford-torus":gs,apollonian:xs,poincare:As,menger:Fs,e8:Es,kuramoto:qs,quasicrystal:_s,dipole:Is,"quaternion-julia":Bs,gyroid:Ns,"gray-scott":Xs,"ulam-prime":Js,hydrogen:ia,zeta:Cn};function aa(s){const e=s()*2-1,t=s()*Math.PI*2,o=Math.sqrt(1-e*e);return new w(o*Math.cos(t),e,o*Math.sin(t))}function ra(s){const e=tn(20261124),t=[],o={inner:0,main:0,outer:0};for(const n of at){const i=sa[n.modelType];if(!i)continue;const a=An[n.shell],l=a.lifetime[0]+e()*(a.lifetime[1]-a.lifetime[0]),r=a.gap[0]+e()*(a.gap[1]-a.gap[0]),d=l+r;for(let m=0;m<n.instanceCount;m++){const h=n.scaleRange[0]+e()*(n.scaleRange[1]-n.scaleRange[0]),p=Sn(n.shell,e,o[n.shell]++),u={lifetime:l,gap:r,spawnRadius:a.spawnRadius[0]+e()*(a.spawnRadius[1]-a.spawnRadius[0]),initialAge:(m+.2+e()*.6)/n.instanceCount*d},c={id:`${n.modelType}_${m}`,code:n.code,modelType:n.modelType,titleZh:n.titleZh,titleEn:n.titleEn,category:n.category,audioFamily:n.audioFamily,latexFormula:n.latexFormula,description:n.description,coreColor:n.coreColor,glowColor:n.glowColor,accentColor:n.accentColor,params:n.params,scale:h,orbit:p,rotationAxis:aa(e),rotationSpeed:.1+e()*.3,lifecycle:u},f=new i(c);s.add(f.group),t.push(f)}}return t}const la=450,ca=1400,ha=.5;class ua{creatures;camera;universeRoot;tmp=new w;acc=0;constructor(e,t,o){this.creatures=e,this.camera=t,this.universeRoot=o}update(e){if(this.acc+=e,!(this.acc<ha)){this.acc=0;for(const t of this.creatures){if(!t.ready)continue;this.tmp.copy(t.group.position).add(this.universeRoot.position);const o=this.tmp.distanceTo(this.camera.position),n=o<la?0:o<ca?1:2;n!==t.currentLOD&&t.setLOD(n)}}}}const Ge=24,Pe=32,Jt='11px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';function da(s,e,t){const o=Math.min(Math.max((t-s)/(e-s),0),1);return o*o*(3-2*o)}class pa{ctx;camera;anchors;slots;leftList=[];rightList=[];tmp=new w;w=0;h=0;constructor(e,t,o){this.ctx=e.getContext("2d"),this.camera=t,this.anchors=o,this.slots=o.map(n=>({label:n.label,side:n.side,nx:0,ny:0,y:0,width:0}))}resize(e,t,o){const n=this.ctx.canvas;n.width=Math.round(e*o),n.height=Math.round(t*o),n.style.width=`${e}px`,n.style.height=`${t}px`,this.ctx.setTransform(o,0,0,o,0,0),this.w=e,this.h=t,this.ctx.font=Jt;for(const i of this.slots)i.width=this.ctx.measureText(i.label).width}update(e,t){const{ctx:o,w:n,h:i}=this;o.clearRect(0,0,n,i),this.drawLegend();const a=1-da(1400,1800,t);if(!(a<=.01)){this.leftList.length=0,this.rightList.length=0;for(let l=0;l<this.slots.length;l++){const r=this.slots[l],d=this.anchors[l].position;if(this.tmp.set(d[0],d[1],d[2]).applyMatrix4(e).project(this.camera),this.tmp.z>1||this.tmp.z<-1)continue;const m=(this.tmp.x*.5+.5)*n,h=(-this.tmp.y*.5+.5)*i;m<-60||m>n+60||h<-60||h>i+60||(r.nx=m,r.ny=h,r.y=h,(r.side==="left"?this.leftList:this.rightList).push(l))}this.layoutSide(this.leftList,this.h-170),this.layoutSide(this.rightList,this.h-40),o.font=Jt,o.lineWidth=1,o.textBaseline="middle",o.shadowColor="rgba(0,0,0,0.9)",o.shadowBlur=4,this.drawSide(this.leftList,a,!0),this.drawSide(this.rightList,a,!1),o.shadowBlur=0}}layoutSide(e,t){e.sort((i,a)=>this.slots[i].y-this.slots[a].y);let o=40-Ge;for(const i of e){const a=this.slots[i];a.y=Math.max(a.y,o+Ge),o=a.y}let n=t+Ge;for(let i=e.length-1;i>=0;i--){const a=this.slots[e[i]];a.y=Math.min(a.y,n-Ge),n=a.y}}drawSide(e,t,o){const{ctx:n,w:i}=this;n.strokeStyle=`rgba(216,180,254,${.35*t})`,n.fillStyle=`rgba(232,226,255,${.85*t})`,n.textAlign=o?"left":"right";const a=o?Pe:i-Pe;for(const l of e){const r=this.slots[l],d=o?a+r.width+8:a-r.width-8,m=o?r.nx-36:r.nx+36;n.beginPath(),n.moveTo(d,r.y),n.lineTo(m,r.y),n.lineTo(r.nx,r.ny),n.stroke(),n.fillText(r.label,a,r.y)}n.fillStyle=`rgba(255,255,255,${.9*t})`;for(const l of e){const r=this.slots[l];n.beginPath(),n.arc(r.nx,r.ny,2,0,Math.PI*2),n.fill()}}drawLegend(){const{ctx:e,h:t}=this;e.font='10px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',e.textAlign="left",e.textBaseline="middle",e.fillStyle="rgba(216,180,254,0.5)",e.fillText("trunk = 120-step proof spine",Pe,t-150),e.fillText("branches = sampled lemmas it names",Pe,t-138),e.fillText("dust = files never reached",Pe,t-126)}}const ma={pageTitle:"Math Cosmos · 数学宇宙",warpRiemann:"✦ 跃迁至黎曼猜想巨构",warpIndex:"数学模型索引 ▾",warpIndexOpen:"数学模型索引 ▴",audioEnable:"开启宇宙音效",audioMute:"静音宇宙音效",codexClose:"关闭图鉴",codexWarp:"跃迁至此模型",codexFree:"切换自由飞行",hudInitializing:"宇宙初始化",hudHint:"WASD 移动 · SHIFT 曲速 · 点击模型扫描 · ESC 释放鼠标",hudDistance:"距黎曼巨构",flightFree:"自由飞行",flightWarp:"曲速跃迁 // 自动驾驶",flightOrbit:"轨道锁定 // 伴飞巡航",langLabel:"切换语言"},fa={pageTitle:"Math Cosmos · A Mathematical Universe",warpRiemann:"✦ Warp to the Riemann Leviathan",warpIndex:"Model Index ▾",warpIndexOpen:"Model Index ▴",audioEnable:"Enable cosmic audio",audioMute:"Mute cosmic audio",codexClose:"Close codex",codexWarp:"Warp to this model",codexFree:"Return to free flight",hudInitializing:"Initializing cosmos",hudHint:"WASD move · SHIFT warp · Click a model to scan · ESC release cursor",hudDistance:"Dist. to Riemann",flightFree:"FREE FLIGHT",flightWarp:"WARP TRANSIT // AUTOPILOT",flightOrbit:"ORBIT LOCK // ESCORT",langLabel:"Change language"},ga={pageTitle:"Math Cosmos · 数学の宇宙",warpRiemann:"✦ リーマン巨大構造へワープ",warpIndex:"モデル索引 ▾",warpIndexOpen:"モデル索引 ▴",audioEnable:"宇宙音をオン",audioMute:"宇宙音をミュート",codexClose:"図鑑を閉じる",codexWarp:"このモデルへワープ",codexFree:"自由飛行に戻る",hudInitializing:"宇宙を初期化中",hudHint:"WASD 移動 · SHIFT ワープ · モデルをクリックでスキャン · ESC でカーソル解放",hudDistance:"リーマンまでの距離",flightFree:"自由飛行",flightWarp:"ワープ遷移 // オートパイロット",flightOrbit:"軌道ロック // 伴走巡航",langLabel:"言語を切り替え"},va={pageTitle:"Math Cosmos · 수학 우주",warpRiemann:"✦ 리만 거대 구조로 워프",warpIndex:"모델 색인 ▾",warpIndexOpen:"모델 색인 ▴",audioEnable:"우주 음향 켜기",audioMute:"우주 음향 음소거",codexClose:"도감 닫기",codexWarp:"이 모델로 워프",codexFree:"자유 비행으로 전환",hudInitializing:"우주 초기화 중",hudHint:"WASD 이동 · SHIFT 워프 · 모델 클릭으로 스캔 · ESC 커서 해제",hudDistance:"리만까지 거리",flightFree:"자유 비행",flightWarp:"워프 이동 // 자동 조종",flightOrbit:"궤도 고정 // 호위 순항",langLabel:"언어 변경"},wa={pageTitle:"Math Cosmos · Ein mathematisches Universum",warpRiemann:"✦ Zum Riemann-Leviathan springen",warpIndex:"Modellindex ▾",warpIndexOpen:"Modellindex ▴",audioEnable:"Kosmischen Klang einschalten",audioMute:"Kosmischen Klang stummschalten",codexClose:"Kodex schließen",codexWarp:"Zu diesem Modell springen",codexFree:"Zurück zum Freiflug",hudInitializing:"Kosmos wird initialisiert",hudHint:"WASD bewegen · SHIFT Warp · Modell anklicken zum Scannen · ESC Maus freigeben",hudDistance:"Distanz zum Riemann",flightFree:"FREIER FLUG",flightWarp:"WARPTRANSIT // AUTOPILOT",flightOrbit:"ORBIT LOCK // BEGLEITFLUG",langLabel:"Sprache ändern"},ya={pageTitle:"Math Cosmos · Un univers mathématique",warpRiemann:"✦ Sauter vers le Léviathan de Riemann",warpIndex:"Index des modèles ▾",warpIndexOpen:"Index des modèles ▴",audioEnable:"Activer l'audio cosmique",audioMute:"Couper l'audio cosmique",codexClose:"Fermer le codex",codexWarp:"Sauter vers ce modèle",codexFree:"Revenir au vol libre",hudInitializing:"Initialisation du cosmos",hudHint:"WASD déplacer · SHIFT warp · Cliquer un modèle pour scanner · ESC libérer la souris",hudDistance:"Distance au Riemann",flightFree:"VOL LIBRE",flightWarp:"TRANSIT WARP // PILOTE AUTO",flightOrbit:"ORBITE VERROUILLÉE // ESCORTE",langLabel:"Changer de langue"},ba={pageTitle:"Math Cosmos · Математическая вселенная",warpRiemann:"✦ Перейти к Левиафану Римана",warpIndex:"Индекс моделей ▾",warpIndexOpen:"Индекс моделей ▴",audioEnable:"Включить космический звук",audioMute:"Выключить космический звук",codexClose:"Закрыть кодекс",codexWarp:"Перейти к этой модели",codexFree:"Вернуться к свободному полёту",hudInitializing:"Инициализация космоса",hudHint:"WASD — движение · SHIFT — варп · клик по модели — сканирование · ESC — освободить курсор",hudDistance:"До Римана",flightFree:"СВОБОДНЫЙ ПОЛЁТ",flightWarp:"ВАРП-ПЕРЕХОД // АВТОПИЛОТ",flightOrbit:"ОРБИТАЛЬНЫЙ ЗАХВАТ // СОПРОВОЖДЕНИЕ",langLabel:"Сменить язык"},xa={zh:ma,en:fa,ja:ga,ko:va,de:wa,fr:ya,ru:ba};function K(s){return xa[s]}const Ma={"number-theory":"数论与组合",chaos:"动力系统与混沌",topology:"拓扑与高维几何",fractal:"分形与递归",analysis:"调和分析",physics:"数学物理","high-dim":"高维几何与李群",pde:"偏微分与同步动力"},Ca={"number-theory":"Number theory & combinatorics",chaos:"Dynamical systems & chaos",topology:"Topology & higher geometry",fractal:"Fractals & recursion",analysis:"Harmonic analysis",physics:"Mathematical physics","high-dim":"Higher-dimensional geometry & Lie groups",pde:"PDEs & synchronization"},Aa={"number-theory":"数論と組合せ",chaos:"力学系とカオス",topology:"トポロジーと高次幾何",fractal:"フラクタルと再帰",analysis:"調和解析",physics:"数理物理","high-dim":"高次元幾何とリー群",pde:"偏微分方程式と同期"},Sa={"number-theory":"수론과 조합론",chaos:"동역학계와 카오스",topology:"위상수학과 고차 기하",fractal:"프랙털과 재귀",analysis:"조화 해석",physics:"수리물리","high-dim":"고차원 기하와 리 군",pde:"편미분방정식과 동기화"},Pa={"number-theory":"Zahlentheorie & Kombinatorik",chaos:"Dynamische Systeme & Chaos",topology:"Topologie & höhere Geometrie",fractal:"Fraktale & Rekursion",analysis:"Harmonische Analysis",physics:"Mathematische Physik","high-dim":"Höherdimensionale Geometrie & Lie-Gruppen",pde:"Partielle Differentialgleichungen & Synchronisation"},Fa={"number-theory":"Théorie des nombres et combinatoire",chaos:"Systèmes dynamiques et chaos",topology:"Topologie et géométrie supérieure",fractal:"Fractales et récursion",analysis:"Analyse harmonique",physics:"Physique mathématique","high-dim":"Géométrie en grande dimension et groupes de Lie",pde:"EDP et synchronisation"},ka={"number-theory":"Теория чисел и комбинаторика",chaos:"Динамические системы и хаос",topology:"Топология и высшая геометрия",fractal:"Фракталы и рекурсия",analysis:"Гармонический анализ",physics:"Математическая физика","high-dim":"Многомерная геометрия и группы Ли",pde:"Уравнения в частных производных и синхронизация"},Ea={zh:Ma,en:Ca,ja:Aa,ko:Sa,de:Pa,fr:Fa,ru:ka};function za(s,e){return Ea[s][e]??e}const Ta={inner:"内环 · 数论 / 量子朝圣带",main:"中环 · 混沌 / 拓扑洋流带",outer:"外环 · 分形 / 深空边疆带"},Da={inner:"Inner · Number theory / quantum pilgrimage",main:"Middle · Chaos / topology currents",outer:"Outer · Fractals / deep-space frontier"},Ra={inner:"内環 · 数論 / 量子巡礼帯",main:"中環 · カオス / トポロジー海流帯",outer:"外環 · フラクタル / 深宇宙辺境帯"},La={inner:"내환 · 수론 / 양자 순례대",main:"중환 · 카오스 / 위상 해류대",outer:"외환 · 프랙털 / 심우주 변경대"},qa={inner:"Innen · Zahlentheorie / Quanten-Pilgerring",main:"Mitte · Chaos / Topologie-Strömung",outer:"Außen · Fraktale / Tiefer Raum"},_a={inner:"Anneau intérieur · Théorie des nombres / pèlerinage quantique",main:"Anneau moyen · Chaos / courants topologiques",outer:"Anneau extérieur · Fractales / frontière du grand large"},Wa={inner:"Внутреннее кольцо · Теория чисел / квантовое паломничество",main:"Среднее кольцо · Хаос / топологические течения",outer:"Внешнее кольцо · Фракталы / дальний космос"},Ia={zh:Ta,en:Da,ja:Ra,ko:La,de:qa,fr:_a,ru:Wa};function Ga(s,e){return Ia[s][e]}const Va={lorenz:"Edward Lorenz's simplified convection model from 1963: at σ=10, ρ=28, β=8/3 it traces the famous butterfly wings — chaos born from deterministic equations.",rossler:"A minimal chaotic system rebuilt from three nonlinear terms: a flat vortex coils slowly, then snaps across a folded crest like a ribbon jellyfish.",aizawa:"An axisymmetric strange attractor whose trajectories thread around a central axis, forming a spherical plasma core like a chaotic sea urchin.",thomas:"A labyrinthine attractor with threefold cyclic symmetry; twelve seed trajectories weave through three orthogonal directions like a slow cluster of indigo ganglia.",halvorsen:"A three-wing spiral around the main diagonal, its trajectories drawn into broad ribbons of flowing light — white-hot core, crimson edges, like a plasma star ray.","chen-lee":"North–south symmetric double-scroll magnetic storms: particles leap chaotically between ice-cyan and cobalt poles, flashing pure white as they cross the equator.",dadras:"Four interwoven symmetric wings of electric arc; indigo and pink pulses race along the trajectories like a shadow ray gliding through deep space.","abc-flow":"The classic steady solution of Euler's incompressible equations, with velocity parallel to vorticity everywhere; thousands of tracers stir a chaotic anemone inside a periodic sphere.",mandelbulb:"A fractal monolith of three-dimensional complex dynamics: spherical power iteration marches through a distance field, deep teal in the crevices, fluorescent green on the tips — slow-breathing deep-space coral.",sierpinski:"An iterated function system of four contractive affine maps, recursed four levels: 256 micro-tetrahedra form a white-cored, ice-blue recursive lattice pulsing in the dark.","quaternion-julia":"A fractal coral core from quaternion squaring sliced into 3D, while the constant c(t) wanders a small four-dimensional circle — dark sea-green valleys, neon-emerald ridges, alive and growing.",apollonian:"A recursive bubble anemone from the three-dimensional Soddy–Gosset recurrence: some 400 glass spheres, each tangent to its neighbours, ice-blue at the rims and magenta in the tiny ones.","gray-scott":"Two chemicals react and diffuse across a spherical UV domain: dark ink-green in the troughs, fluorescent emerald and electric lime along the growing fronts — a self-dividing luminous cell.",gyroid:"A TPMS coral sphere riddled with a connected three-dimensional labyrinth; thin walls refract electric cyan and pure white as the pores contract and expand organically.",menger:"The recursive extension of the 3D Cantor set: a third-order 20³ lattice with face and body centres removed, leaving thousands of micro-cubes — a living mechanical sanctuary breathing in space.",hopf:"The four-dimensional sphere decomposed into interlocking fibre circles and stereographically projected into 3D; each fibre carries a continuous spectral hue by longitude, with white beads orbiting together.","cell-24":"The self-dual regular polytope unique to four dimensions: 24 vertices and 96 edges rotating in the XW and YZ planes at once, their stereographic edges bent into elegant hyperbolic arcs.","clifford-torus":"A flat minimal torus embedded in the 4D unit sphere. Double-layered gold-orange films and Villarceau grids swallow and release themselves as it rotates — a doubly spinning cage of light.",poincare:"The open-unit-ball model of 3D hyperbolic space: some 300 geodesic arcs meet the boundary sphere at right angles and shrink toward infinity — violet at the core, cold river-blue at the rim.",e8:"The 240 root vectors of the exceptional Lie group E8 — 112 integer and 128 half-integer roots forming the most symmetric star chart in eight dimensions, 6,720 edges woven into a golden ring near the Coxeter plane.",quasicrystal:"A 6D hypercubic lattice cut-projected into 3D physical and perpendicular space: accepted points form a fivefold, never-repeating star-crystal network, pale rose and sky blue flickering shell by shell.",fourier:"A mechanical orrery of harmonics: four golden rings nested at ω∈{1,−3,7,−11}, their tip tracing an electric-cyan curve that fades as it is written.",harmonics:"The shape language of hydrogen's electron clouds: positive-phase lobes in rose gold, negative-phase lobes in quantum indigo, nodal planes in darkness, two states morphing back and forth in real time.",phyllotaxis:"2,500 star points arranged by the Fibonacci golden angle, with only prime indices lit and enlarged. Every three seconds a sieve wave sweeps past, primes blinking like a shoal of krill.","ulam-prime":"The first 4,096 integers unrolled along an Archimedean–Sacks double spiral; primes become soft gold starlight, while twin primes and Euler-polynomial paths are threaded into rose-red chains.",hydrogen:"A rejection-sampled volumetric point cloud of high excited states from the Schrödinger equation: positive lobes in deep quantum blue, negative lobes in nebula pink, electrons streaming around the axis by angular momentum — a translucent quantum lotus.",kuramoto:"600 luminous spherical oscillators swing around the critical coupling strength: sometimes flashing in disorder, sometimes blazing in full resonance — a deep-sea firefly bloom breathing as one.",zeta:"A guardian juvenile patrolling the Riemann leviathan: the critical-strip phase colours flow with arg ζ(s), and the first ten non-trivial zeros are set with pure-white high-energy cores, echoing the centre of the cosmos.",dipole:"Thin flux tubes on three L-shells: 1,200 aurora particles spiral in Larmor motion along the field lines, slowing at the north and south mirror points and bursting into cyan and violet flashes.","calabi-yau":"A candidate shape for the six compact extra dimensions of string theory: four complex coordinates project continuously into 3D as the rotation angle α turns, petal-like surfaces folding in real time.",klein:"The non-orientable closed surface with no inside or outside: energy meridians flip and pass through a single-sided sheet without seams, like a boundless topological conch.","torus-knot":"A closed knot wound around a torus, classified by coprime integer pairs (p,q). Scarlet and electric-blue waves chase each other along the tube like a neon sea serpent.",enneper:"A k-th order minimal surface in Weierstrass–Enneper polar form; its rim beats softly like a manta's pectoral fin, the film shifting between emerald and sky blue.",boy:"A singularity-free immersion of the real projective plane in 3D: a three-lobed shell glows warm gold along its self-intersection ridges, with translucent rose-violet membranes inside.",dini:"A helical cone of constant negative Gaussian curvature; cyan and lavender energy bands race along the asymptotics and converge into a pure-white needle at the tip, like a rotating luminous nautilus.","helicoid-catenoid":"A Bonnet isometric family: the helicoid and catenoid curl and unfurl into each other without stretching, the first fundamental form unchanged, colour breathing between crimson and soft amber.",lissajous:"A closed harmonic knot braided from pairwise coprime frequencies (3,4,5); cyan and neon-magenta waves race toward each other along the tube, striking pure-white flares at each crossing.",roman:"A quartic model of the real projective plane with six singular pinch points; four swollen petals fade from sunset amber to rose crimson, three double lines lit by fine needles of light.",costa:"A genus-1, three-ended minimally embedded surface (one catenoid end, two planar ends); lake-blue and mint-green films whiten at the saddle rims, like a three-holed cup of light.","mobius-twisted":"A single-sided, non-orientable band with three half-twists; a pair of light pulses race along the edge and must travel 4π to return to the same side, magenta and electric cyan tracing an endless loop."},Oa={lorenz:"1963 年にローレンツが提唱した簡略対流モデル。σ=10、ρ=28、β=8/3 で有名な蝶の双翼軌道を描く——決定論的方程式から生まれた混沌の翼。",rossler:"三つの最小非線形項で再構成された混沌系。平坦な渦がゆっくり巻き、折り返しの峰で急に引き伸ばされる——折り畳まれた光帯のクラゲ。",aizawa:"軸対称構造をもつ奇妙なアトラクター。軌道が中心軸の周りを縫うように走り、球形プラズマの混沌としたウニを形づくる。",thomas:"三重の循環対称をもつ迷宮状アトラクター。12 本の初期軌道が三つの直交方向で絡み合い、ゆっくり動く藍色の神経節の束のよう。",halvorsen:"主対角軸の周りを巡る三翼螺旋アトラクター。軌道は広い流光のリボンとなり、中心は白熱、外縁は緋色——プラズマの星エイ。","chen-lee":"南北対称の二重渦巻き磁気嵐。氷青とコバルトの極の間で粒子が混沌と跳躍し、赤道を越えるたび純白の閃光を放つ。",dadras:"四枚の対称な電弧の翼が絡み合う。藍紫と桃色の高速パルスが軌道を奔り、深宇宙を滑空する影のエイのよう。","abc-flow":"非圧縮オイラー方程式の古典的定常解。速度と渦度が至る所で平行で、数千の流線粒子が周期的な球体内で混沌のイソギンチャクをかき混ぜる。",mandelbulb:"三次元複素力学のフラクタル巨構。球座標の冪反復が距離推定場を進み、亀裂の奥は深い青緑、突起の先は蛍光の若緑——ゆっくり呼吸する深宇宙珊瑚。",sierpinski:"四つの縮小アフィン写像を四段再帰した反復関数系。256 個の微小四面体が、白い芯と氷青の線框をもつ再帰格子を編み、暗がりで脈打つ。","quaternion-julia":"四元数平方反復を三次元断面に切ったフラクタル珊瑚核。定数 c(t) が四次元の小円を巡り、谷は暗い海青、稜はネオン翡翠——生きて成長するよう。",apollonian:"三次元 Soddy–Gosset 漸化式が生む再帰的な泡のイソギンチャク。約 400 個のガラス球が互いに接し、大きな泡の縁は氷空色、微小な泡はマゼンタに光る。","gray-scott":"二種の化学物質が球面 UV 上で反応拡散する。低濃度の谷は暗い墨緑、成長前線は蛍光翠と電光ライム——自ら分裂する発光細胞球。",gyroid:"連結した三次元迷宮孔をもつ TPMS 珊瑚球。薄い壁が電光青と純白のハイライトを屈折させ、孔は有機的に収縮と膨張を繰り返す。",menger:"三次元カントール集合の再帰的拡張。三次の 20³ 格子から面心と体心を除いた数千の微小立方体——宇宙で呼吸する生きた機械聖堂。",hopf:"四次元球面を互いに絡むファイバー円環へ分解し、立体投影で三次元へ。各ファイバーは経度に応じた連続スペクトル色を帯び、白い光珠が同期して巡る。","cell-24":"四次元にしか存在しない自己双対正多胞体。24 頂点・96 辺が XW と YZ の二平面で同時に回転し、立体投影された辺は優雅な双曲弧に曲がる。","clifford-torus":"四次元単位球面に埋め込まれた平坦極小トーラス。二層の金橙膜と Villarceau 斜交格子が回転の中で内と外を吞吐する——二重に回る光の籠。",poincare:"三次元双曲空間の開単位球モデル。約 300 本の測地弧が境界球面と直角に交わりながら無限の淵へ収縮する。中心は亮蘭紫、縁は冷たい星河青。",e8:"例外リー群 E8 の 240 本の根ベクトル。112 の整数根と 128 の半整数根が八次元で最も対称な星盤をなし、6720 本の辺がコクセター平面付近で金色の聖環を織る。",quasicrystal:"六次元超立方格子を三次元物理空間と垂直空間へ切投影。受容窓を通過した格子点が五回対称で決して繰り返さない星晶網をつくり、淡い薔薇色と天星青が層ごとに明滅する。",fourier:"調和波を重ねた機械の星盤。四段の金色円環が ω∈{1,−3,7,−11} で入れ子に回転し、先端が書き出す電光青の空間曲線は次第に薄れて消える。",harmonics:"水素原子の電子雲の形の言語。正位相の葉は薔薇金、負位相の葉は量子藍、節面は暗闇。二つの量子状態がリアルタイムで往復変形する。",phyllotaxis:"フィボナッチ黄金角で並ぶ 2500 の星点。素数番号だけが点灯し拡大される。三秒ごとに篩の光波が掃き、素数が磷蝦の群れのように瞬く。","ulam-prime":"最初の 4096 の整数をアルキメデス–サックス二重螺旋に展開。素数は柔らかな金の星光となり、双子素数とオイラー多項式の軌跡が薔薇紅の鎖で結ばれる。",hydrogen:"シュレーディンガー方程式の高次励起状態を棄却サンプリングした体積点雲。正位相は深い量子青、負位相は星雲桃、電子が角運動量に沿って軸を巡る——透き通る量子蓮。",kuramoto:"600 個の球面発光振動子が臨界結合強度の周りで揺れる。時に無秩序に明滅し、時に全群が共振して斉明する——深海の蛍火が一つに呼吸するよう。",zeta:"リーマン巨構を巡回する護衛幼体。臨界帯の位相色が arg ζ(s) に従って流れ、最初の 10 個の非自明零点に純白の高エネ星核が嵌まる——宇宙の中心と呼応する。",dipole:"三つの L 殻に沿う双極磁力線の細管。1200 の極光粒子が磁力線に沿ってラーモア螺旋を往復し、南北の磁鏡点で減速して青藍と紫の閃光を放つ。","calabi-yau":"弦理論で六つの余剰次元をコンパクト化する候補形状。四つの複素座標が回転角 α に応じて三次元へ連続投影され、花弁状の曲面がリアルタイムに折り返す。",klein:"表も裏もない非可向閉曲面。エネルギーの経緯線が単側面を継ぎ目なく反転しながら走る——無限のトポロジー巻貝。","torus-knot":"トーラスに巻き付く閉じた結び目。互いに素な整数対 (p,q) で分類される。緋色と電光青の行波が管身を高速で追いかけ、ネオンの海蛇のよう。",enneper:"Weierstrass–Enneper 極座標で表される k 次極小曲面。縁はマンタの胸鰭のように柔らかく羽ばたき、薄膜は翠と空青の二色に揺れる。",boy:"実射影平面の三次元への特異点なき浸入。三葉の貝殻が自己交差の稜で暖かな金のハイライトを放ち、腹腔には薔薇紫の半透明膜が透ける。",dini:"常負ガウス曲率の螺旋錐面。漸近線に沿って流れる青緑とラベンダーのエネルギー帯が、先端で純白の針に収束する——回転する発光オウムガイ。","helicoid-catenoid":"Bonnet 等距変形族。螺旋面と懸垂面の間を伸縮なく巻き込み・広げ、第一基本形式は不変。色は位相に応じて緋色と柔らかな橙金の間で呼吸する。",lissajous:"互いに素な周波数 (3,4,5) で編まれた閉じた調和結び目。青とネオンマゼンタの高エネ波が管身を相向かって走り、立体交差で純白の耀斑を打つ。",roman:"六つの特異夾点をもつ実射影平面の四次曲面。四枚の膨らんだ花弁が夕陽の琥珀から薔薇緋色へ移ろい、三本の二重線に細い光の針が灯る。",costa:"種数 1、三つの端（懸垂端一つと平面端二つ）をもつ自己交差なき極小埋め込み曲面。湖青と薄荷緑の二層膜が鞍点の縁で白み、三孔の光の杯のよう。","mobius-twisted":"三つの半捻りをもつ単側・非可向の帯。一対の流光パルスが縁を相向かって走り、同じ側へ戻るには 4π 必要。マゼンタと電青が無限の回環を描く。"},Ba={lorenz:"1963년 로렌츠가 제안한 단순화된 대류 모델. σ=10, ρ=28, β=8/3에서 유명한 나비 날개 궤적을 그린다——결정론적 방정식에서 태어난 혼돈의 날개.",rossler:"세 개의 최소 비선형 항으로 재구성한 혼돈계. 평평한 소용돌이가 천천히 감기다가 접힌 봉우리에서 갑자기 늘어난다——접힌 빛 띠 해파리.",aizawa:"축대칭 구조의 기이한 끌개. 궤적이 중심축을 바늘처럼 누비며 구형 플라스마의 혼돈 성게를 만든다.",thomas:"삼중 순환 대칭의 미로형 끌개. 12개의 초기 궤적이 세 직교 방향에서 서로 얽히며 천천히 꿈틀대는 남색 신경절 다발처럼 보인다.",halvorsen:"주대각축을 도는 세 날개 나선 끌개. 궤적은 넓은 유광 리본이 되고 중심은 백열, 가장자리는 진홍——플라스마 별가오리.","chen-lee":"남북 대칭의 이중 소용돌이 자기 폭풍. 얼음청과 코발트 극 사이에서 입자가 예측 불가능하게 도약하고, 적도를 넘을 때 순백의 섬광이 터진다.",dadras:"네 개의 대칭 전호 날개가 서로 감긴다. 남보라와 분홍의 고속 펄스가 궤적을 따라 흐르며 심우주를 활공하는 그림자 전기 가오리처럼 보인다.","abc-flow":"비압축 오일러 방정식의 고전적 정상해. 속도와 와도가 모든 곳에서 평행하며, 수천 개의 유선 입자가 주기 구 안에서 혼돈 말미잘을 휘젓는다.",mandelbulb:"3차원 복소 동역학의 프랙털 거대 구조. 구면 좌표 거듭제곱 반복이 거리 추정장을 따라가고, 균열 깊은 곳은 짙은 청록, 돌출 끝은 형광 연두——천천히 숨 쉬는 심우주 산호.",sierpinski:"네 개의 축소 아핀 사상을 네 단계 재귀한 반복 함수계. 256개의 작은 사면체가 흰 심과 얼음청 선체의 재귀 격자를 이루며 어둠 속에서 규칙적으로 맥동한다.","quaternion-julia":"사원수 제곱 반복을 3차원 단면으로 자른 프랙털 산호 핵. 상수 c(t)가 4차원 작은 원을 돌고, 골짜기는 짙은 바다청, 능선은 네온 에메랄드——살아 자라는 듯하다.",apollonian:"3차원 Soddy–Gosset 점화식이 만드는 재귀 거품 말미잘. 약 400개의 유리구가 서로 맞닿아 있고, 큰 거품 가장자리는 얼음하늘색, 작은 거품은 마젠타로 빛난다.","gray-scott":"두 화학 물질이 구면 UV 영역에서 반응·확산한다. 저농도 골짜기는 어두운 먹청록, 성장 전선은 형광 취록과 전광 라임——스스로 분열하는 발광 세포구.",gyroid:"연결된 3차원 미로 구멍의 TPMS 산호구. 얇은 벽이 전광 청록과 순백 하이라이트를 굴절시키고, 구멍은 유기적으로 수축·팽창한다.",menger:"3차원 칸토어 집합의 재귀적 확장. 3차 20³ 격자에서 면심과 체심을 제거한 수천 개의 미세 정육면체——우주에서 숨 쉬는 살아 있는 기계 성전.",hopf:"4차원 구면을 서로 맞물린 섬유 원환으로 분해해 입체 투영한 것. 각 섬유는 경도에 따라 연속 스펙트럼 색을 띠고, 흰 광구가 동기화되어 함께 돈다.","cell-24":"4차원에만 존재하는 자기쌍대 정다포체. 24개 꼭짓점과 96개 모서리가 XW와 YZ 두 평면에서 동시에 회전하고, 입체 투영된 모서리는 우아한 쌍곡 호로 휜다.","clifford-torus":"4차원 단위 구면에 매립된 평탄 극소 원환. 두 겹의 금주황 막과 Villarceau 사교 격자가 회전 속에서 안팎을 삼키고 토해낸다——이중으로 도는 빛의 우리.",poincare:"3차원 쌍곡 공간의 열린 단위 공 모델. 약 300개의 측지 호가 경계 구면과 직각으로 만나며 무한의 끝으로 수축한다. 중심은 밝은 난보라, 가장자리는 차가운 은하청.",e8:"예외 리 군 E8의 240개 근 벡터. 112개의 정수 근과 128개의 반정수 근이 8차원에서 가장 완벽한 대칭 별판을 이루고, 6720개 모서리가 콕서터 평면 근처에서 황금 성환을 엮는다.",quasicrystal:"6차원 초입방 격자를 3차원 물리 공간과 수직 공간으로 절단 투영. 수용 창을 통과한 격자점이 오중 대칭의 결코 반복되지 않는 성결정망을 만들고, 옅은 장밋빛과 하늘별빛이 층마다 명멸한다.",fourier:"조화파를 겹친 기계 성반. 네 단계의 황금 원환이 ω∈{1,−3,7,−11}로 중첩 회전하고, 끝점이 실시간으로 그리는 전광 청록 공간 곡선은 점점 옅어져 사라진다.",harmonics:"수소 원자 전자 구름의 형태 언어. 양위상 잎은 장미금, 음위상 잎은 양자 남색, 절점면은 어둠. 두 양자 상태가 실시간으로 왕복 변형한다.",phyllotaxis:"피보나치 황금각으로 배열된 2500개의 별점. 소수 인덱스만 켜지고 확대된다. 3초마다 체의 빛 물결이 지나가며 소수가 크릴 떼처럼 반짝인다.","ulam-prime":"처음 4096개의 정수를 아르키메데스–색스 이중 나선으로 펼친 것. 소수는 부드러운 금빛 별빛이 되고, 쌍둥이 소수와 오일러 다항식 궤적은 장밋빛 사슬로 이어진다.",hydrogen:"슈뢰딩거 방정식의 고차 들뜬 상태를 기각 샘플링한 체적 점구름. 양위상은 깊은 양자청, 음위상은 성운 분홍, 전자가 각운동량에 따라 축을 돌며 흐른다——투명한 양자 연꽃.",kuramoto:"600개의 구면 발광 진동자가 임계 결합 강도 부근에서 흔들린다. 때로는 무질서하게 명멸하고, 때로는 온 무리가 공명해 환히 밝아진다——심해의 반딧불이 하나로 숨 쉬는 듯.",zeta:"리만 거대 구조를 순찰하는 수호 유체. 임계대 위상 색이 arg ζ(s)를 따라 흐르고, 처음 10개의 비자명 영점에 순백 고에너지 성핵이 박혀 우주 중심과 호응한다.",dipole:"세 개의 L 껍질을 따르는 쌍극 자기력선 세관. 1200개의 오로라 입자가 자기력선을 따라 라모어 나선으로 왕복하고, 남북 자북 거울점에서 감속하며 청람과 보라 섬광을 터뜨린다.","calabi-yau":"끈 이론에서 6개의 여분 차원을 콤팩트화하는 후보 형상. 네 개의 복소 좌표가 회전각 α에 따라 3차원으로 연속 투영되고, 꽃잎 모양 곡면이 실시간으로 접힌다.",klein:"안과 밖이 없는 비가향 폐곡면. 에너지 경위선이 단일 면을 이음매 없이 뒤집으며 지나간다——무한한 위상학적 소라.","torus-knot":"원환면에 감긴 닫힌 매듭. 서로소 정수쌍 (p,q)로 분류된다. 진홍과 전광 파랑의 행파가 관 몸체를 따라 빠르게 추격하며 네온 바다뱀처럼 보인다.",enneper:"Weierstrass–Enneper 극좌표로 표현한 k차 극소 곡면. 가장자리는 만타의 가슴지느러미처럼 부드럽게 파닥이고, 막은 취록과 하늘파랑 두 색으로 일렁인다.",boy:"실사영 평면의 3차원 특이점 없는 침입. 세 잎 조개가 자기교차 능선에서 따뜻한 금빛 하이라이트를 내고, 복강에는 장미보라 반투명 막이 비친다.",dini:"상수 음의 가우스 곡률을 가진 나선 원뿔면. 점근선을 따라 흐르는 청록과 라벤더 에너지 띠가 끝에서 순백 바늘로 모인다——회전하며 나아가는 발광 앵무조개.","helicoid-catenoid":"Bonnet 등거리 변형족. 나선면과 현수면 사이를 늘어남 없이 감고 펴며, 제1기본형식은 그대로다. 색은 위상에 따라 진홍과 부드러운 주황금 사이에서 숨 쉰다.",lissajous:"서로소 주파수 (3,4,5)로 엮은 닫힌 조화 매듭. 청록과 네온 마젠타 고에너지 파동이 관 몸체를 마주 보고 달리며 입체 교차점에서 순백 섬광을 터뜨린다.",roman:"6개의 특이 집점을 가진 실사영 평면 4차 곡면. 네 장의 부푼 꽃잎이 노을 호박에서 장미 진홍으로 변하고, 세 개의 이중선에 가는 빛 바늘이 켜진다.",costa:"종수 1, 세 개의 끝(현수 끝 하나와 평면 끝 둘)을 가진 자기교차 없는 극소 매립 곡면. 호수청과 민트록 두 겹 막이 안장점 가장자리에서 하얗게 빛난다——세 구멍의 빛 잔.","mobius-twisted":"세 번의 반꼬임을 가진 단면 비가향 띠. 한 쌍의 유광 펄스가 가장자리를 마주 보고 달리며 같은 면으로 돌아오려면 4π가 필요하다. 마젠타와 전광 청록이 끝없는 회환을 그린다."},Ua={lorenz:"Lorenz’ vereinfachtes Konvektionsmodell von 1963: Bei σ=10, ρ=28, β=8/3 zeichnet es die berühmten Schmetterlingsflügel — Chaos aus deterministischen Gleichungen.",rossler:"Ein minimales chaotisches System aus drei nichtlinearen Termen: Ein flacher Wirbel windet sich langsam und schnellt dann über einen gefalteten Kamm — eine gefaltete Lichtband-Qualle.",aizawa:"Ein achsensymmetrischer seltsamer Attraktor, dessen Bahnen um eine Mittelachse fädeln und einen kugelförmigen Plasmakern wie einen chaotischen Seeigel bilden.",thomas:"Ein labyrinthischer Attraktor mit dreifacher zyklischer Symmetrie; zwölf Startbahnen verweben sich in drei orthogonalen Richtungen wie ein langsam kriechendes Bündel indigoer Ganglien.",halvorsen:"Eine dreiflügelige Spirale um die Hauptdiagonale, deren Bahnen zu breiten fließenden Lichtbändern werden — weißglühender Kern, purpurrote Ränder, wie ein Plasma-Sternrochen.","chen-lee":"Nord-Süd-symmetrische Doppelwirbel-Magnetstürme: Teilchen springen chaotisch zwischen eisblauen und kobaltblauen Polen und blitzen am Äquator reinweiß auf.",dadras:"Vier ineinander verwobene symmetrische Lichtbogenflügel; indigo- und rosafarbene Pulse rasen über die Bahnen wie ein Schattenrochen im tiefen Raum.","abc-flow":"Die klassische stationäre Lösung der inkompressiblen Euler-Gleichungen, bei der Geschwindigkeit und Wirbelstärke überall parallel sind; Tausende Tracer rühren in einer periodischen Kugel eine chaotische Anemone.",mandelbulb:"Ein Fraktalmonolith der dreidimensionalen komplexen Dynamik: Kugelkoordinaten-Potenziteration wandert durch ein Distanzfeld, tiefes Blaugrün in den Spalten, fluoreszierendes Grün an den Spitzen — langsam atmende Tiefraumkoralle.",sierpinski:"Ein iteriertes Funktionensystem aus vier kontrahierenden affinen Abbildungen, vier Stufen tief: 256 Mikrotetraeder bilden ein rekursives Gitter mit weißem Kern und eisblauen Kanten, das im Dunkeln pulsiert.","quaternion-julia":"Ein fraktaler Korallenkern aus Quaternionenquadraten, in 3D geschnitten, während die Konstante c(t) auf einem kleinen vierdimensionalen Kreis wandert — dunkle meergrüne Täler, neon-smaragdgrüne Grate, lebendig wachsend.",apollonian:"Eine rekursive Blasenanemone aus der dreidimensionalen Soddy-Gosset-Rekursion: rund 400 Glaskugeln, jede ihre Nachbarn berührend, eisblau an den Rändern, magenta in den winzigen.","gray-scott":"Zwei Chemikalien reagieren und diffundieren auf einer sphärischen UV-Domäne: dunkles Tintengrün in den Senken, fluoreszierendes Smaragd und elektrisches Limettengrün an den Wachstumsfronten — eine sich teilende leuchtende Zelle.",gyroid:"Eine TPMS-Korallenkugel voller zusammenhängender dreidimensionaler Labyrinthporen; dünne Wände brechen elektrisches Cyan und reines Weiß, während sich die Poren organisch zusammenziehen und ausdehnen.",menger:"Die rekursive Erweiterung der 3D-Cantor-Menge: ein Gitter dritter Ordnung mit 20³ Zellen, aus dem Flächen- und Körperzentren entfernt sind, übrig bleiben Tausende Mikrowürfel — ein lebendiges mechanisches Heiligtum, das im Raum atmet.",hopf:"Die vierdimensionale Sphäre, in ineinandergreifende Faserringe zerlegt und stereografisch in 3D projiziert; jede Faser trägt je nach Länge einen kontinuierlichen Spektralton, weiße Lichtperlen kreisen gemeinsam.","cell-24":"Der selbstduale reguläre Polytop, den es nur in vier Dimensionen gibt: 24 Ecken und 96 Kanten rotieren gleichzeitig in XW- und YZ-Ebene, ihre stereografischen Kanten biegen sich zu eleganten hyperbolischen Bögen.","clifford-torus":"Ein flacher minimaler Torus in der vierdimensionalen Einheitssphäre. Doppellagige goldorange Filme und Villarceau-Gitter schlucken und entlassen sich beim Rotieren — ein doppelt drehender Lichtkäfig.",poincare:"Das offene Einheitskugelmodell des dreidimensionalen hyperbolischen Raums: rund 300 Geodäten treffen die Randkugel im rechten Winkel und schrumpfen ins Unendliche — violett im Kern, kaltes Flussblau am Rand.",e8:"Die 240 Wurzelvektoren der exzeptionellen Lie-Gruppe E8 — 112 ganzzahlige und 128 halbzahlige Wurzeln bilden die symmetrischste Sternkarte in acht Dimensionen, 6.720 Kanten weben nahe der Coxeter-Ebene einen goldenen Ring.",quasicrystal:"Ein 6D-hyperkubisches Gitter, schnittprojiziert in 3D-Raum und Senkrechtraum: akzeptierte Punkte bilden ein fünfzähliges, nie wiederholtes Sternkristallnetz, blasses Rosenrot und Himmelsblau flackern Schale um Schale.",fourier:"Ein mechanisches Harmonie-Orrery: vier goldene Ringe, verschachtelt bei ω∈{1,−3,7,−11}, deren Spitze eine elektrisch-cyanfarbene Kurve schreibt, die beim Entstehen verblasst.",harmonics:"Die Formsprache der Wasserstoff-Elektronenwolken: positivphasige Keulen in Roségold, negativphasige in Quantenindigo, Knotenflächen im Dunkel; zwei Zustände morphen in Echtzeit hin und her.",phyllotaxis:"2.500 Sternpunkte im Fibonacci-Goldenen Winkel, nur Primzahl-Indizes leuchten und wachsen. Alle drei Sekunden fegt eine Siebwelle vorbei, Primzahlen blinken wie ein Krillschwarm.","ulam-prime":"Die ersten 4.096 ganzen Zahlen, entrollt auf einer archimedisch-sacksischen Doppelspirale; Primzahlen werden zu weichem Goldsternlicht, Primzahlzwillinge und Euler-Polynom-Pfade zu rosaroten Ketten.",hydrogen:"Eine rejektionsgesampelte volumetrische Punktwolke hoher angeregter Schrödinger-Zustände: positive Keulen in tiefem Quantenblau, negative in Nebelrosa, Elektronen strömen je nach Drehimpuls um die Achse — ein durchscheinender Quantenlotus.",kuramoto:"600 leuchtende Kugeloszillatoren schwingen um die kritische Kopplungsstärke: mal flackern sie ungeordnet, mal erglühen alle in Resonanz — eine Tiefsee-Leuchtblüte, die als Einheit atmet.",zeta:"Ein Wächter-Jungtier, das den Riemann-Leviathan umkreist: Die Phasenfarben des kritischen Streifens folgen arg ζ(s), und die ersten zehn nichttrivialen Nullstellen tragen reinweiße Hochenergiekernen — ein Echo des Kosmoszentrums.",dipole:"Dünne Flussröhren auf drei L-Schalen: 1.200 Aurora-Teilchen spiralförmig in Larmor-Bewegung entlang der Feldlinien, bremsen an den Nord- und Süd-Spiegelpunkten und blitzen cyan und violett auf.","calabi-yau":"Eine Kandidatenform für die sechs kompaktifizierten Extradimensionen der Stringtheorie: Vier komplexe Koordinaten projizieren bei rotierendem Winkel α kontinuierlich in 3D, blütenförmige Flächen falten sich in Echtzeit.",klein:"Die nicht orientierbare geschlossene Fläche ohne Innen und Außen: Energiemeridiane kippen nahtlos durch eine einseitige Haut — eine grenzenlose topologische Schnecke.","torus-knot":"Ein geschlossener Knoten um einen Torus, klassifiziert durch teilerfremde Ganzzahlpaare (p,q). Scharlachrote und elektrisch blaue Wellen jagen einander durch die Röhre wie eine Neon-Seeschlange.",enneper:"Eine minimale Fläche k-ter Ordnung in Weierstraß–Enneper-Polarkoordinaten; ihr Rand schlägt sanft wie eine Manta-Brustflosse, der Film wechselt zwischen Smaragd und Himmelblau.",boy:"Eine singularitätsfreie Immersion der reellen projektiven Ebene in 3D: Eine dreilappige Schale glüht warmgolden an ihren Selbstschnittkämmen, innen schimmert eine durchscheinende rosenviolette Membran.",dini:"Ein schraubenförmiger Kegel konstanter negativer Gaußkrümmung; cyan- und lavendelfarbene Energiebänder rasen entlang der Asymptoten und laufen an der Spitze in eine reinweiße Nadel — ein rotierender leuchtender Nautilus.","helicoid-catenoid":"Eine isometrische Bonnet-Familie: Helikoid und Katenoid rollen sich ohne Dehnung ineinander, die erste Fundamentalform bleibt unverändert, die Farbe atmet zwischen Scharlach und sanftem Goldorange.",lissajous:"Ein geschlossener harmonischer Knoten aus teilerfremden Frequenzen (3,4,5); cyan- und neonmagenta Farbwellen laufen einander durch die Röhre entgegen und schlagen an jeder Kreuzung reinweiße Flares.",roman:"Eine quartische Fläche der reellen projektiven Ebene mit sechs singulären Quetschpunkten; vier geschwollene Blütenblätter gehen von Sonnenuntergangsamber zu Rosenrot über, drei Doppellinien leuchten mit feinen Lichtnadeln.",costa:"Eine minimal eingebettete Fläche vom Geschlecht 1 mit drei Enden (ein Katenoid-, zwei Planarende); seeblaue und mintgrüne Filme bleichen an den Sattelrändern aus — ein dreilöchriger Kelch aus Licht.","mobius-twisted":"Ein einseitiges, nicht orientierbares Band mit drei Halbdrehungen; zwei Lichtimpulse jagen entlang des Randes und brauchen 4π für die Rückkehr zur selben Seite, magenta und elektrisches Cyan zeichnen eine endlose Schleife."},ja={lorenz:"Le modèle de convection simplifié de Lorenz (1963) : à σ=10, ρ=28, β=8/3, il trace les célèbres ailes de papillon — le chaos né d'équations déterministes.",rossler:"Un système chaotique minimal reconstruit à partir de trois termes non linéaires : un tourbillon plat s'enroule lentement puis se tend sur une crête pliée, comme une méduse de rubans lumineux.",aizawa:"Un attracteur étrange axisymétrique dont les trajectoires enfilent un axe central, formant un cœur de plasma sphérique pareil à un oursin chaotique.",thomas:"Un attracteur labyrinthique à symétrie cyclique triple ; douze trajectoires initiales s'entrelacent dans trois directions orthogonales comme un lent amas de ganglions indigo.",halvorsen:"Une spirale à trois ailes autour de la diagonale principale, dont les trajectoires s’étirent en larges rubans de lumière fluide — cœur incandescent, bords écarlates, comme une raie-plasma stellaire.","chen-lee":"Des orages magnétiques à double enroulement symétriques nord-sud : les particules sautent chaotiquement entre des pôles cyan-glace et cobalt, et flashent en blanc pur en traversant l’équateur.",dadras:"Quatre ailes symétriques d'arc électrique entrelacées ; des impulsions indigo et roses courent le long des trajectoires comme une raie d'ombre planant dans l'espace profond.","abc-flow":"La solution stationnaire classique des équations d'Euler incompressibles, où vitesse et vorticité sont partout parallèles ; des milliers de traceurs brassent une anémone chaotique dans une sphère périodique.",mandelbulb:"Un monolithe fractal de dynamique complexe tridimensionnelle : l'itération de puissance en coordonnées sphériques avance dans un champ de distance, bleu-vert profond dans les crevasses, vert fluorescent sur les pointes — un corail spatial qui respire lentement.",sierpinski:"Un système de fonctions itérées à quatre applications affines contractantes, récursé sur quatre niveaux : 256 micro-tétraèdres forment un treillis récursif à cœur blanc et arêtes bleu-glace, pulsant dans l'obscurité.","quaternion-julia":"Un cœur de corail fractal issu du carré quaternionique tranché en 3D, tandis que la constante c(t) parcourt un petit cercle à quatre dimensions — vallées vert mer sombre, crêtes vert émeraude néon, vivant et croissant.",apollonian:"Une anémone de bulles récursive issue de la récurrence de Soddy–Gosset en 3D : quelque 400 sphères de verre, chacune tangente à ses voisines, bleu-glace sur les bords, magenta dans les plus petites.","gray-scott":"Deux produits chimiques réagissent et diffusent sur un domaine UV sphérique : vert d'encre sombre dans les creux, émeraude fluorescent et lime électrique sur les fronts de croissance — une cellule lumineuse qui se divise.",gyroid:"Une sphère de corail TPMS criblée d’un labyrinthe tridimensionnel connecté ; ses parois fines réfractent un cyan électrique et un blanc pur tandis que les pores se contractent et s’ouvrent organiquement.",menger:"L'extension récursive de l'ensemble de Cantor 3D : un treillis du troisième ordre en 20³ dont on retire les centres de faces et de volume, laissant des milliers de micro-cubes — un sanctuaire mécanique vivant qui respire dans l'espace.",hopf:"La sphère à quatre dimensions décomposée en cercles de fibres imbriqués puis projetée stéréographiquement en 3D ; chaque fibre porte une teinte spectrale continue selon sa longitude, des perles blanches orbitent ensemble.","cell-24":"Le polytope régulier auto-dual propre à la quatrième dimension : 24 sommets et 96 arêtes tournent simultanément dans les plans XW et YZ, leurs arêtes projetées se courbant en élégants arcs hyperboliques.","clifford-torus":"Un tore minimal plat plongé dans la sphère unité 4D. Des films or-orangé à double couche et des grilles de Villarceau avalent et libèrent l'espace en tournant — une cage de lumière à double rotation.",poincare:"Le modèle de la boule unité ouverte de l'espace hyperbolique 3D : quelque 300 géodésiques rencontrent la sphère frontière à angle droit et rétrécissent vers l'infini — violet au cœur, bleu-rivière froid au bord.",e8:"Les 240 vecteurs racines du groupe de Lie exceptionnel E8 — 112 racines entières et 128 demi-entières forment la carte stellaire la plus symétrique en huit dimensions, 6 720 arêtes tissant un anneau d’or près du plan de Coxeter.",quasicrystal:"Un réseau hypercubique 6D découpé et projeté dans l'espace physique 3D et l'espace perpendiculaire : les points acceptés forment un réseau cristallin étoilé à symétrie quintuple, jamais répété, rose pâle et bleu céleste scintillant couche par couche.",fourier:"Un planétaire mécanique d'harmoniques : quatre anneaux dorés imbriqués à ω∈{1,−3,7,−11}, dont la pointe trace une courbe cyan électrique qui s'efface à mesure qu'elle s'écrit.",harmonics:"Le langage des formes des nuages électroniques de l’hydrogène : lobes de phase positive en or rosé, lobes négatifs en indigo quantique, plans nodaux dans l’obscurité ; deux états se métamorphosent en temps réel.",phyllotaxis:"2 500 points stellaires disposés selon l'angle d'or de Fibonacci, seuls les indices premiers s'allument et grandissent. Toutes les trois secondes, une onde de crible passe, les nombres premiers clignotent comme un banc de krill.","ulam-prime":"Les 4 096 premiers entiers déroulés sur une double spirale d'Archimède–Sacks ; les nombres premiers deviennent une douce lumière d'or, les jumeaux et les trajectoires du polynôme d'Euler sont enfilés en chaînes rose rouge.",hydrogen:"Un nuage de points volumétrique échantillonné par rejet des états excités élevés de Schrödinger : lobes positifs en bleu quantique profond, lobes négatifs en rose nébuleuse, électrons ruisselant autour de l'axe selon le moment angulaire — un lotus quantique translucide.",kuramoto:"600 oscillateurs sphériques lumineux oscillent autour du couplage critique : tantôt ils clignotent en désordre, tantôt toute la foule s’embrase en résonance — une floraison de lucioles des abysses respirant d’un seul souffle.",zeta:"Un jeune gardien patrouillant le léviathan de Riemann : les couleurs de phase de la bande critique suivent arg ζ(s), et les dix premiers zéros non triviaux portent des cœurs blanc pur à haute énergie, en écho au centre du cosmos.",dipole:"De fins tubes de flux sur trois couches L : 1 200 particules d’aurore spiralent en mouvement de Larmor le long des lignes de champ, ralentissent aux points miroirs nord et sud et éclatent en flashs cyan et violets.","calabi-yau":"Une forme candidate pour les six dimensions supplémentaires compactifiées de la théorie des cordes : quatre coordonnées complexes se projettent en continu en 3D à mesure que l’angle α tourne, des surfaces en pétales se repliant en temps réel.",klein:"La surface fermée non orientable sans intérieur ni extérieur : les méridiens d’énergie basculent sans couture à travers une nappe à une seule face, comme une conque topologique sans limites.","torus-knot":"Un nœud fermé enroulé autour d’un tore, classé par des paires d’entiers premiers entre eux (p,q). Des ondes écarlates et bleu électrique se poursuivent dans le tube comme un serpent de mer néon.",enneper:"Une surface minimale d’ordre k en coordonnées polaires de Weierstrass–Enneper ; son bord bat doucement comme une nageoire pectorale de manta, le film oscillant entre émeraude et bleu ciel.",boy:"Une immersion sans singularité du plan projectif réel en 3D : une coquille à trois lobes luit d’un or chaud sur ses crêtes d’auto-intersection, une membrane rose-violette translucide apparaissant à l’intérieur.",dini:"Un cône hélicoïdal à courbure gaussienne négative constante ; des bandes d’énergie cyan et lavande courent le long des asymptotes et convergent en une aiguille blanche au sommet, comme un nautile lumineux en rotation.","helicoid-catenoid":"Une famille isométrique de Bonnet : l'hélicoïde et la caténoïde s'enroulent et se déploient sans étirement, la première forme fondamentale reste inchangée, la couleur respire entre écarlate et or ambré doux.",lissajous:"Un nœud harmonique fermé tissé de fréquences premières entre elles (3,4,5) ; des ondes cyan et magenta néon courent l'une vers l'autre dans le tube et frappent des flares blanc pur à chaque croisement.",roman:"Une quartique du plan projectif réel à six points de pincement singuliers ; quatre pétales gonflés passent de l'ambre du couchant au rose écarlate, trois droites doubles s'illuminent d'aiguilles de lumière.",costa:"Une surface minimale immergée sans auto-intersection, de genre 1 et à trois bouts (un caténoïde, deux plans) ; des films bleu lac et vert menthe blanchissent aux bords de selle, comme une coupe de lumière à trois trous.","mobius-twisted":"Un ruban unilatéral non orientable à trois demi-torsions ; deux impulsions lumineuses courent le long du bord et doivent parcourir 4π pour revenir du même côté, magenta et cyan électrique dessinant une boucle sans fin."},Na={lorenz:"Упрощённая модель конвекции Лоренца (1963): при σ=10, ρ=28, β=8/3 она вычерчивает знаменитые крылья бабочки — хаос, рождённый детерминированными уравнениями.",rossler:"Минимальная хаотическая система из трёх нелинейных членов: плоский вихрь медленно свивается, а затем резко вытягивается через складку — медуза из светящихся лент.",aizawa:"Осесимметричный странный аттрактор, траектории которого пронизывают центральную ось, образуя сферическое плазменное ядро — хаотический морской ёж.",thomas:"Лабиринтный аттрактор с тройной циклической симметрией; двенадцать начальных траекторий сплетаются в трёх ортогональных направлениях, как медленно шевелящийся пучок индиговых ганглиев.",halvorsen:"Трёхкрылая спираль вокруг главной диагонали; траектории вытягиваются в широкие ленты текущего света — раскалённо-белое ядро, алые края, словно плазменный звёздный скат.","chen-lee":"Северо-южные симметричные двойные магнитные вихри: частицы хаотично прыгают между ледяно-голубыми и кобальтовыми полюсами и вспыхивают чисто-белым при пересечении экватора.",dadras:"Четыре переплетённых симметричных крыла электрической дуги; индиговые и розовые импульсы несутся по траекториям, как теневой скат, скользящий в дальнем космосе.","abc-flow":"Классическое стационарное решение уравнений Эйлера для несжимаемой жидкости: скорость и завихрённость всюду параллельны; тысячи трассеров взбивают хаотическую актинию внутри периодической сферы.",mandelbulb:"Фрактальный монолит трёхмерной комплексной динамики: степенная итерация в сферических координатах идёт по полю расстояний, тёмно-бирюзовые трещины, флуоресцентно-зелёные вершины — медленно дышащий коралл дальнего космоса.",sierpinski:"Система итерированных функций из четырёх сжимающих аффинных отображений, четыре уровня рекурсии: 256 микротетраэдров образуют рекурсивную решётку с белым ядром и ледяно-голубыми рёбрами, пульсирующую в темноте.","quaternion-julia":"Фрактальное коралловое ядро из кватернионного квадрата, рассечённого в 3D, пока константа c(t) блуждает по малому четырёхмерному кругу — тёмные морско-зелёные долины, неоново-изумрудные гребни, живой рост.",apollonian:"Рекурсивная пузырчатая актиния из трёхмерной рекурсии Содди–Госсета: около 400 стеклянных сфер, каждая касается соседних, ледяно-голубые по краям и пурпурные у крошечных.","gray-scott":"Два химических вещества реагируют и диффундируют на сферической UV-области: тёмно-чернильный зелёный во впадинах, флуоресцентный изумруд и электрический лайм на фронтах роста — самоделящаяся светящаяся клетка.",gyroid:"Коралловая сфера TPMS с сетью связанных трёхмерных лабиринтных пор; тонкие стенки преломляют электрический циан и чистый белый, а поры органично сжимаются и расширяются.",menger:"Рекурсивное расширение трёхмерного множества Кантора: решётка третьего порядка 20³ без центров граней и объёма, тысячи микрокубов — живой механический храм, дышащий в пространстве.",hopf:"Четырёхмерная сфера, разложенная на сцепленные волокна-кольца и стереографически спроецированная в 3D; каждое волокно несёт непрерывный спектральный цвет по долготе, белые светящиеся бусины движутся вместе.","cell-24":"Самодвойственный правильный политоп, существующий только в четырёх измерениях: 24 вершины и 96 рёбер одновременно вращаются в плоскостях XW и YZ, а спроецированные рёбра изгибаются в изящные гиперболические дуги.","clifford-torus":"Плоский минимальный тор, вложенный в 4D единичную сферу. Двухслойные золотисто-оранжевые плёнки и решётки Вилларсо вбирают и выпускают себя при вращении — двойная вращающаяся клетка света.",poincare:"Модель открытого единичного шара трёхмерного гиперболического пространства: около 300 геодезических встречают граничную сферу под прямым углом и сжимаются в бесконечность — фиолетовые в ядре, холодно-речные на краю.",e8:"240 корневых векторов исключительной группы Ли E8 — 112 целых и 128 полуцелых корня образуют самую симметричную звёздную карту в восьми измерениях, 6720 рёбер сплетают золотое кольцо у плоскости Кокстера.",quasicrystal:"Шестимерная гиперкубическая решётка, срез-проецированная в 3D-физическое и перпендикулярное пространство: принятые точки образуют пятикратную, никогда не повторяющуюся звёздно-кристаллическую сеть; бледно-розовый и небесно-синий мерцают слой за слоем.",fourier:"Механический планетарий гармоник: четыре золотых кольца, вложенных при ω∈{1,−3,7,−11}, кончик вычерчивает электрически-циановую кривую, которая бледнеет по мере написания.",harmonics:"Язык форм электронных облаков водорода: лепестки положительной фазы в розовом золоте, отрицательной — в квантовом индиго, узловые плоскости во тьме; два состояния обратимо превращаются в реальном времени.",phyllotaxis:"2500 звёздных точек, расположенных по фибоначчиеву золотому углу; светятся и укрупняются только простые индексы. Каждые три секунды проходит волна решета, и простые числа мигают, как стая криля.","ulam-prime":"Первые 4096 целых чисел, развёрнутых по двойной спирали Архимеда–Сакса; простые числа становятся мягким золотым звёздным светом, а близнецы и траектории полинома Эйлера нанизаны на розово-красные цепочки.",hydrogen:"Объёмное облако точек высоковозбуждённых состояний уравнения Шрёдингера, полученное отбором: лепестки положительной фазы в глубоком квантовом синем, отрицательной — в туманно-розовом, электроны текут вокруг оси по моменту импульса — прозрачный квантовый лотос.",kuramoto:"600 светящихся сферических осцилляторов колеблются у критической силы связи: то мигают в беспорядке, то вся группа вспыхивает в резонансе — глубоководное свечение светлячков, дышащее как единое целое.",zeta:"Молодой страж, патрулирующий Левиафана Римана: фазовые цвета критической полосы текут по arg ζ(s), а первые десять нетривиальных нулей несут чисто-белые высокоэнергетические ядра — эхо центра космоса.",dipole:"Тонкие трубки потока на трёх L-оболочках: 1200 частиц полярного сияния спирально движутся по линиям поля в ларморовском вращении, замедляются у северного и южного зеркальных точек и вспыхивают цианом и фиолетом.","calabi-yau":"Форма-кандидат для шести компактифицированных дополнительных измерений теории струн: четыре комплексные координаты непрерывно проецируются в 3D при вращении угла α, лепестковые поверхности складываются в реальном времени.",klein:"Неориентируемая замкнутая поверхность без внутреннего и внешнего: энергетические меридианы бесшовно переворачиваются через односторонний лист — безграничная топологическая раковина.","torus-knot":"Замкнутый узел, навитый на тор и классифицируемый парами взаимно простых целых (p,q). Алые и электрически-синие волны гонятся друг за другом по трубке, как неоновый морской змей.",enneper:"Минимальная поверхность k-го порядка в полярных координатах Вейерштрасса–Эннепера; её край мягко бьётся, как грудной плавник манты, плёнка переливается изумрудом и небесно-голубым.",boy:"Погружение вещественной проективной плоскости в 3D без особенностей: трёхлопастная раковина теплеет золотом на гребнях самопересечения, внутри просвечивает розово-фиолетовая мембрана.",dini:"Спиральный конус постоянной отрицательной гауссовой кривизны; циановые и лавандовые энергетические полосы бегут по асимптотам и сходятся в чисто-белую иглу на вершине — вращающийся светящийся наутилус.","helicoid-catenoid":"Изометрическое семейство Бонне: геликоид и катеноид без растяжения сворачиваются и разворачиваются друг в друга, первая фундаментальная форма неизменна, цвет дышит между алым и мягким золотисто-оранжевым.",lissajous:"Замкнутый гармонический узел, сплетённый из взаимно простых частот (3,4,5); циановая и неоново-пурпурная волны бегут навстречу по трубке и выбивают чисто-белые вспышки в каждой пространственной точке пересечения.",roman:"Квартика вещественной проективной плоскости с шестью особыми точками; четыре вздутых лепестка переходят от закатного янтаря к розово-алому, три двойные линии загораются тонкими иглами света.",costa:"Минимально вложенная поверхность рода 1 с тремя концами (один катеноидный, два плоских); озёрно-синие и мятно-зелёные плёнки белеют у сёдловых краёв — трёхдырчатая чаша света.","mobius-twisted":"Односторонняя неориентируемая лента с тремя полуоборотами; пара световых импульсов бежит по краю и должна пройти 4π, чтобы вернуться на ту же сторону, пурпур и электрический циан вычерчивают бесконечную петлю."},Ha={en:Va,ja:Oa,ko:Ba,de:Ua,fr:ja,ru:Na};function Za(s,e,t){return s==="zh"?t:Ha[s][e]??t}class Ka{root;onWarp;onFree;onToggleAudio;locale;entry=null;audioEnabled=!1;constructor(e,t,o,n,i){this.root=e,this.onWarp=t,this.onFree=o,this.onToggleAudio=n,this.locale=i,this.root.innerHTML=`
      <button id="codex-close" class="icon-button">×</button>
      <div class="codex-kicker">MATHEMATICAL CODEX</div>
      <h2 id="codex-title"></h2>
      <div id="codex-en"></div>
      <span id="codex-category" class="category-tag"></span>
      <div id="codex-formula" class="formula"></div>
      <p id="codex-description"></p>
      <div class="codex-actions">
        <button id="codex-warp" class="primary-button"></button>
        <button id="codex-free" class="secondary-button"></button>
        <button id="codex-audio" class="secondary-button"></button>
      </div>`,this.root.querySelector("#codex-close").addEventListener("click",()=>this.close());const a=this.root.querySelector("#codex-free");a.onclick=()=>{this.onFree(),this.close()},this.root.querySelector("#codex-warp").addEventListener("click",()=>{this.entry&&this.onWarp(this.entry)}),this.root.querySelector("#codex-audio").addEventListener("click",this.onToggleAudio),this.applyChrome()}setLocale(e){this.locale=e,this.applyChrome(),this.renderEntry()}setAudioLabel(e){this.audioEnabled=e;const t=this.root.querySelector("#codex-audio");t&&(t.textContent=e?K(this.locale).audioMute:K(this.locale).audioEnable)}open(e){this.entry=e,this.renderEntry(),this.root.classList.add("open"),this.root.setAttribute("aria-hidden","false")}close(){this.root.classList.remove("open"),this.root.setAttribute("aria-hidden","true")}applyChrome(){const e=K(this.locale);this.root.querySelector("#codex-close")?.setAttribute("aria-label",e.codexClose);const o=this.root.querySelector("#codex-warp");o&&(o.textContent=e.codexWarp);const n=this.root.querySelector("#codex-free");n&&(n.textContent=e.codexFree),this.setAudioLabel(this.audioEnabled)}renderEntry(){const e=this.entry;if(!e)return;const t=this.root.querySelector("#codex-title");t&&(t.textContent=this.locale==="zh"?e.titleZh:e.titleEn);const o=this.root.querySelector("#codex-en");o&&(o.textContent=this.locale==="zh"?e.titleEn:e.code);const n=this.root.querySelector("#codex-category");n&&(n.textContent=za(this.locale,e.category),n.style.color=e.glowColor,n.style.borderColor=`${e.glowColor}66`);const i=this.root.querySelector("#codex-description");i&&(i.textContent=Za(this.locale,e.modelType,e.description));const a=this.root.querySelector("#codex-formula");a&&(a.innerHTML="",$n.render(e.latexFormula,a,{throwOnError:!1,displayMode:!0,strict:"ignore"}))}}const Ya=["inner","main","outer"];class $a{root;list;toggle;locale;audioEnabled=!1;constructor(e,t,o){this.root=e,this.locale=o;const n=K(o);e.innerHTML=`
      <button id="warp-riemann" class="warp-riemann">${n.warpRiemann}</button>
      <div class="warp-row">
        <button id="warp-toggle" class="secondary-button">${n.warpIndex}</button>
        <button id="audio-toggle" class="secondary-button">${n.audioEnable}</button>
      </div>
      <div id="warp-list" class="warp-list" hidden></div>`,e.querySelector("#warp-riemann").addEventListener("click",t.onWarpRiemann),e.querySelector("#audio-toggle").addEventListener("click",t.onToggleAudio),this.list=e.querySelector("#warp-list"),this.toggle=e.querySelector("#warp-toggle"),this.toggle.addEventListener("click",()=>{this.list.hidden=!this.list.hidden,this.toggle.textContent=this.indexLabel()}),this.list.addEventListener("click",i=>{const l=i.target.closest("[data-model]")?.dataset.model;if(!l)return;const r=at.find(d=>d.modelType===l);r&&t.onWarpCreature(r)}),this.renderList(),this.setAudioLabel(!1)}setLocale(e){this.locale=e;const t=K(e);this.root.querySelector("#warp-riemann").textContent=t.warpRiemann,this.toggle.textContent=this.indexLabel(),this.renderList(),this.setAudioLabel(this.audioEnabled)}setAudioLabel(e){this.audioEnabled=e;const t=K(this.locale),o=this.root.querySelector("#audio-toggle");o&&(o.textContent=e?t.audioMute:t.audioEnable)}indexLabel(){const e=K(this.locale);return this.list.hidden?e.warpIndex:e.warpIndexOpen}renderList(){this.list.innerHTML="";for(const e of Ya){const t=document.createElement("div");t.className="warp-group-label",t.textContent=Ga(this.locale,e),this.list.append(t);for(const o of at.filter(n=>n.shell===e)){const n=document.createElement("button");n.className="warp-item",n.dataset.model=o.modelType,n.style.setProperty("--entity-color",o.glowColor);const i=document.createElement("span");i.className="entity-dot";const a=document.createElement("span");a.textContent=this.locale==="zh"?o.titleZh:o.titleEn;const l=document.createElement("small");l.textContent=this.locale==="zh"?`${o.code} · ${o.titleEn}`:o.code,n.append(i,a,l),this.list.append(n)}}}}const nt=s=>(s>=0?"+":"")+s.toFixed(1).padStart(8," ");function Xa(s,e){const t=K(s);return e==="FREE_FLIGHT"?t.flightFree:e==="WARP_TRANSIT"?t.flightWarp:t.flightOrbit}class Qa{stats=document.createElement("div");hint=document.createElement("div");unsubscribers=[];status;locale;spawn={loaded:0,total:0};telemetry=null;flightState="FREE_FLIGHT";constructor(e,t,o){this.locale=o,this.hint.className="hint",e.append(this.stats,this.hint),this.status=document.getElementById("flight-status"),this.renderHint(),this.renderStatus(),this.unsubscribers.push(t.on("spawn-progress",n=>{this.spawn=n,this.renderHint()})),this.unsubscribers.push(t.on("telemetry",n=>{this.telemetry=n,this.renderStats()})),this.unsubscribers.push(t.on("flight-state",n=>{this.flightState=n,this.renderStatus()}))}setLocale(e){this.locale=e,this.renderHint(),this.renderStats(),this.renderStatus()}renderHint(){const e=K(this.locale),t=this.spawn.total>0&&this.spawn.loaded>=this.spawn.total;this.hint.textContent=t?e.hudHint:`${e.hudInitializing} ${this.spawn.loaded} / ${this.spawn.total}`}renderStatus(){this.status&&(this.status.textContent=Xa(this.locale,this.flightState))}renderStats(){const e=this.telemetry;if(!e)return;const t=K(this.locale);this.stats.textContent=`MATH COSMOS // M5 SYSTEMS ONLINE
POS  ${nt(e.x)} ${nt(e.y)} ${nt(e.z)}
VEL  ${e.speed.toFixed(1).padStart(6," ")} u/s   FPS ${Math.round(e.fps)}
${t.hudDistance}  ${e.distToRiemann.toFixed(0)} u`}dispose(){for(const e of this.unsubscribers)e();this.unsubscribers.length=0}}class Ja{constructor(e){this.options=e,this.raycaster.params.Points.threshold=4,this.creatureGroups=e.creatures.map(n=>n.group);for(const n of e.creatures)n.group.userData.codexType=n.config.modelType;let t=!1;const o=()=>{t||(t=!0,e.onFirstInteraction())};this.unlockPointer=o,this.unlockKey=o,e.canvas.addEventListener("pointerdown",o,{once:!0}),window.addEventListener("keydown",o,{once:!0}),e.flight.pickHandler=(n,i)=>this.pick(n,i)}raycaster=new Bn;pointer=new ln;creatureGroups;unlockPointer;unlockKey;pick(e,t){const{camera:o,drawer:n}=this.options;this.pointer.set(e/window.innerWidth*2-1,-(t/window.innerHeight)*2+1),this.raycaster.setFromCamera(this.pointer,o);const i=this.raycaster.intersectObjects(this.creatureGroups,!0);for(const a of i){let l=a.object;for(;l&&!l.userData.codexType;)l=l.parent;const r=l?.userData.codexType;if(!(!r||!Rt[r]||!l?.visible))return n.open(Rt[r]),document.pointerLockElement&&document.exitPointerLock(),!0}return!1}dispose(){this.options.flight.pickHandler=null,this.options.canvas.removeEventListener("pointerdown",this.unlockPointer),window.removeEventListener("keydown",this.unlockKey)}}class er{toggle;menu;name;code;backdrop;open=!1;onChange;constructor(e,t,o){this.onChange=o,e.innerHTML=`
      <button class="app-lang-toggle" type="button" aria-haspopup="listbox" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"></path>
        </svg>
        <span class="app-lang-name"></span>
        <span class="app-lang-code"></span>
        <span class="app-lang-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="app-lang-menu" role="listbox" aria-hidden="true" inert></div>`,this.toggle=e.querySelector(".app-lang-toggle"),this.menu=e.querySelector(".app-lang-menu"),this.name=e.querySelector(".app-lang-name"),this.code=e.querySelector(".app-lang-code"),this.menu.innerHTML=Pn.map(n=>`<button type="button" role="option" data-locale="${n.code}" aria-selected="false" lang="${n.htmlLang}"><span>${n.name}</span><small>${n.short.toUpperCase()}</small></button>`).join(""),this.backdrop=document.createElement("div"),this.backdrop.className="app-lang-backdrop",this.backdrop.setAttribute("aria-hidden","true"),document.body.appendChild(this.backdrop),this.backdrop.addEventListener("click",()=>this.setOpen(!1)),this.toggle.addEventListener("click",n=>{n.stopPropagation(),this.setOpen(!this.open)}),this.toggle.addEventListener("keydown",n=>{n.key==="ArrowDown"&&(n.preventDefault(),this.setOpen(!0),this.menu.querySelector('[aria-selected="true"]')?.focus())}),this.menu.addEventListener("click",n=>{n.stopPropagation();const a=n.target.closest("[data-locale]")?.dataset.locale;if(Fn(a)){this.setLocale(a);try{window.localStorage.setItem(kn,a)}catch{}this.onChange(a),this.setOpen(!1),this.toggle.focus()}}),this.menu.addEventListener("keydown",n=>{if(n.key!=="ArrowDown"&&n.key!=="ArrowUp")return;n.preventDefault();const i=Array.from(this.menu.querySelectorAll("[data-locale]")),a=i.indexOf(document.activeElement),l=n.key==="ArrowDown"?1:-1;i[(a+l+i.length)%i.length]?.focus()}),document.addEventListener("keydown",n=>{n.key!=="Escape"||!this.open||(this.setOpen(!1),this.toggle.focus())}),this.setLocale(t),this.setOpen(!1)}setLocale(e){const t=En(e),o=K(e);document.documentElement.lang=t.htmlLang,document.title=o.pageTitle,this.toggle.setAttribute("aria-label",o.langLabel),this.name.textContent=t.name,this.code.textContent=t.short,this.menu.querySelectorAll("[data-locale]").forEach(n=>{n.setAttribute("aria-selected",String(n.dataset.locale===e))})}setOpen(e){this.open=e,this.toggle.parentElement?.classList.toggle("open",e),this.backdrop.classList.toggle("show",e),this.toggle.setAttribute("aria-expanded",String(e)),this.menu.setAttribute("aria-hidden",String(!e)),this.menu.inert=!e}}function tr(s,e,t){const o=Math.floor(s.sampleRate*e),n=s.createBuffer(2,o,s.sampleRate);for(let i=0;i<2;i++){const a=n.getChannelData(i);let l=0;const r=1-Math.exp(-2*Math.PI*3200/s.sampleRate);for(let d=0;d<o;d++){const m=(Math.random()*2-1)*Math.pow(1-d/o,t);l+=r*(m-l),a[d]=l}}return n}function nr(s,e){const t=s.createBuffer(1,Math.floor(s.sampleRate*e),s.sampleRate),o=t.getChannelData(0);for(let n=0;n<o.length;n++)o[n]=Math.random()*2-1;return t}function or(s,e){const t=s.sampleRate*e,o=s.createBuffer(2,t,s.sampleRate);for(let n=0;n<2;n++){const i=o.getChannelData(n);let a=0;for(let l=0;l<t;l++){const r=Math.random()*2-1;a=(a+.02*r)/1.02,i[l]=a*3.5}}return o}function ir(s,e){const t=s.createBufferSource();t.buffer=or(s,6),t.loop=!0;const o=s.createBiquadFilter();o.type="highpass",o.frequency.value=15;const n=s.createBiquadFilter();n.type="lowpass",n.frequency.value=115,n.Q.value=.8;const i=s.createGain();i.gain.value=.08,t.connect(o).connect(n).connect(i),e(i);const a=s.createOscillator();a.frequency.value=.07;const l=s.createGain();l.gain.value=28,a.connect(l).connect(n.frequency),t.start(),a.start()}function sr(s,e){const t=s.createOscillator();t.type="sawtooth",t.frequency.value=36;const o=s.createOscillator();o.type="triangle",o.frequency.value=72.6;const n=s.createBiquadFilter();n.type="lowpass",n.frequency.value=75,n.Q.value=1.2;const i=s.createGain();return i.gain.value=.015,t.connect(n),o.connect(n),n.connect(i),e(i),t.start(),o.start(),{filter:n,gain:i}}function ar(s,e,t,o){const n=75+345*Math.pow(Math.min(t/460,1),1.4);s.filter.frequency.setTargetAtTime(n,e,.05),s.filter.Q.setTargetAtTime(1.2+2.8*o,e,.05);const i=.015+Math.min(t/145,1)*.075+o*.09;s.gain.gain.setTargetAtTime(i,e,.08)}function yn(s,e){const t=O.clamp(e.speedOfSound/(e.speedOfSound-s),e.minRatio,e.maxRatio),o=1200*Math.log2(t);return e.maxCents===void 0?o:O.clamp(o,-e.maxCents,e.maxCents)}function bn(s,e,t,o,n){n.subVectors(t,s);const i=n.length();return i<.001?0:(n.multiplyScalar(1/i),e.dot(n)-o.dot(n))}const rr={speedOfSound:1400,minRatio:.72,maxRatio:1.4,maxCents:300};class lr{gain;panner;filter;oscs=[];voice4Gain=null;tmpDir=new w;constructor(e,t){this.gain=e.createGain(),this.gain.gain.value=0,this.panner=e.createPanner(),this.panner.panningModel="HRTF",this.panner.distanceModel="exponential",this.panner.refDistance=350,this.panner.rolloffFactor=1.4,this.panner.maxDistance=2200;const o=[["sine",55,0,.45],["triangle",82.41,3,.28],["sawtooth",110,-5,.16],["sine",246.94,4,.1]],n=[];this.filter=e.createBiquadFilter(),this.filter.type="lowpass",this.filter.frequency.value=180,o.forEach(([a,l,r,d],m)=>{const h=e.createOscillator();h.type=a,h.frequency.value=l,h.detune.value=r;const p=e.createGain();if(p.gain.value=d,m===2)h.connect(this.filter).connect(p);else if(m===1){const u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=240,h.connect(u).connect(p)}else h.connect(p);p.connect(this.gain),m===3&&(this.voice4Gain=p),m===0&&n.push(p),this.oscs.push({osc:h,baseCents:r}),h.start()});const i=n[0];if(i){const a=e.createOscillator();a.frequency.value=.11;const l=e.createGain();l.gain.value=.06,a.connect(l).connect(i.gain),a.start()}this.gain.connect(this.panner),t(this.panner)}update(e,t,o,n,i){const a=t.distanceTo(n);this.gain.gain.setTargetAtTime(a<2e3?.32:0,e,.25),this.panner.positionX.value=n.x,this.panner.positionY.value=n.y,this.panner.positionZ.value=n.z,this.filter.frequency.setTargetAtTime(180+770*(1-Math.min(a/2e3,1)),e,.2),this.voice4Gain?.gain.setTargetAtTime(a<850?.1:0,e,.3);const l=bn(t,o,n,i,this.tmpDir),r=yn(l,rr);for(const d of this.oscs)d.osc.detune.setTargetAtTime(d.baseCents+r,e,.1);return a}dispose(){for(const e of this.oscs)e.osc.stop();this.oscs.length=0}}function cr(s,e){const t=s.currentTime,o=s.createOscillator();o.type="sine",o.frequency.setValueAtTime(140,t),o.frequency.exponentialRampToValueAtTime(42,t+.45);const n=s.createGain();n.gain.setValueAtTime(1e-4,t),n.gain.exponentialRampToValueAtTime(.18,t+.02),n.gain.exponentialRampToValueAtTime(1e-4,t+.5),o.connect(n),e(n),o.start(t),o.stop(t+.52)}function hr(s,e,t,o,n){const i=s.currentTime,a=3+Math.random()*4,l=i-Math.log(Math.max(Math.random(),1e-6))/a,r=s.createBufferSource();r.buffer=t;const d=s.createBiquadFilter();d.type="bandpass",d.frequency.value=2400+Math.random()*4400,d.Q.value=8.5;const m=s.createGain();m.gain.value=.08*(1-Math.min(o/700,1));const h=s.createPanner();return h.panningModel="HRTF",h.positionX.value=n.x,h.positionY.value=n.y,h.positionZ.value=n.z,r.connect(d).connect(m).connect(h),e(h),r.start(i),r.stop(i+.008+Math.random()*.014),l}class ur{constructor(e){this.ctx=e,this.master=e.createGain(),this.master.gain.value=0;const t=e.createDynamicsCompressor();t.threshold.value=-14,t.knee.value=18,t.ratio.value=6,t.attack.value=.005,t.release.value=.22,this.master.connect(t).connect(e.destination),this.dry=e.createGain(),this.dry.connect(this.master),this.reverbSend=e.createGain();const o=e.createConvolver();o.buffer=tr(e,3.8,2.6);const n=e.createGain();n.gain.value=.35,this.reverbSend.connect(o).connect(n).connect(this.master)}master;dry;reverbSend;tmpForward=new w;tmpUp=new w;route(e){e.connect(this.dry),e.connect(this.reverbSend)}syncListener(e){const t=this.ctx.listener,o=e.position,n=e.quaternion;this.tmpForward.set(0,0,-1).applyQuaternion(n),this.tmpUp.set(0,1,0).applyQuaternion(n),t.positionX.value=o.x,t.positionY.value=o.y,t.positionZ.value=o.z,t.forwardX.value=this.tmpForward.x,t.forwardY.value=this.tmpForward.y,t.forwardZ.value=this.tmpForward.z,t.upX.value=this.tmpUp.x,t.upY.value=this.tmpUp.y,t.upZ.value=this.tmpUp.z}fadeMaster(e,t){const o=this.ctx.currentTime;this.master.gain.cancelScheduledValues(o),this.master.gain.setValueAtTime(Math.max(this.master.gain.value,1e-4),o),this.master.gain.linearRampToValueAtTime(e,o+t)}}const dr={chaos:[69,71,73,76,78],topology:[52,57,59,63,64],"high-dim":[69,75,76,80,81],fractal:[45,52,54,57],quantum:[73,76,78,81,83]};function pr(s){return 440*Math.pow(2,(s-69)/12)}const mr={speedOfSound:1600,minRatio:.72,maxRatio:1.38};class fr{constructor(e,t,o=8){this.ctx=e,this.route=t;for(let n=0;n<o;n++)this.voices.push(this.createVoice())}voices=[];states=new Map;cooldown=new Map;activeIds=new Set;tmpEntity=new w;tmpDir=new w;createVoice(){const e=this.ctx,t=e.createOscillator(),o=e.createOscillator(),n=e.createOscillator(),i=e.createOscillator(),a=e.createGain(),l=e.createGain(),r=e.createPanner();return r.panningModel="HRTF",r.distanceModel="inverse",r.refDistance=120,r.maxDistance=600,l.gain.value=0,t.connect(l),o.connect(l),n.connect(l),i.connect(a).connect(t.frequency),l.connect(r),this.route(r),[t,o,n,i].forEach(d=>d.start()),{carrier:t,harmonic:o,overtone:n,mod:i,modGain:a,gain:l,panner:r,active:!1,entityId:null,baseFreq:440,releaseAt:0,startedAt:0,duration:2}}update(e,t,o,n,i){this.activeIds.clear();for(const a of n){if(!a.alive)continue;this.tmpEntity.copy(a.group.position).add(i.position);const l=this.tmpEntity.distanceTo(t);if(l>170)continue;this.activeIds.add(a.config.id);let r=this.states.get(a.config.id);r||(r={pos:this.tmpEntity.clone(),vel:new w,lastTime:e,activeVoice:-1},this.states.set(a.config.id,r));const d=Math.max(e-r.lastTime,1/120);r.vel.subVectors(this.tmpEntity,r.pos).multiplyScalar(1/d),r.vel.length()>200&&r.vel.setLength(200),r.pos.copy(this.tmpEntity),r.lastTime=e;const m=this.cooldown.get(a.config.id)??0;if(l<120&&e>=m&&r.activeVoice<0){const p=this.voices.findIndex(u=>!u.active);p>=0&&(this.triggerVoice(p,a.config.audioFamily,a.config.id),r.activeVoice=p)}const h=r.activeVoice;if(h>=0){const p=this.voices[h],u=bn(t,o,this.tmpEntity,r.vel,this.tmpDir),c=yn(u,mr);p.carrier.detune.setTargetAtTime(c,e,.04),p.harmonic.detune.setTargetAtTime(c,e,.04),p.overtone.detune.setTargetAtTime(c,e,.04),p.panner.positionX.value=this.tmpEntity.x,p.panner.positionY.value=this.tmpEntity.y,p.panner.positionZ.value=this.tmpEntity.z,l>165&&this.releaseVoice(h,a.config.id)}}for(let a=0;a<this.voices.length;a++){const l=this.voices[a];l.active&&l.entityId&&e>=l.startedAt+l.duration&&this.releaseVoice(a,l.entityId)}for(const[a,l]of this.states)!this.activeIds.has(a)&&l.activeVoice>=0&&this.releaseVoice(l.activeVoice,a),e-l.lastTime>10&&l.activeVoice<0&&this.states.delete(a);for(const a of this.voices)a.active&&a.entityId&&!this.activeIds.has(a.entityId)&&e>=a.releaseAt&&this.releaseVoice(this.voices.indexOf(a),a.entityId)}triggerVoice(e,t,o){const n=this.ctx.currentTime,i=this.voices[e],a=dr[t],l=pr(a[Math.floor(Math.random()*a.length)]);i.baseFreq=l,i.active=!0,i.entityId=o,i.releaseAt=n+8,i.startedAt=n,i.duration=t==="topology"?2.4:t==="fractal"?2.8:t==="chaos"?1.6:t==="high-dim"?2.2:1,i.gain.gain.cancelScheduledValues(n),i.gain.gain.setValueAtTime(1e-4,n);const r=t==="topology"?.28:t==="fractal"?.35:t==="chaos"?.04:.015,d=t==="topology"?.11:.085;i.gain.gain.exponentialRampToValueAtTime(d,n+r),i.gain.gain.exponentialRampToValueAtTime(d*.45,n+r+.45),i.carrier.type=t==="topology"?"triangle":"sine",i.harmonic.type=t==="fractal"?"square":t==="topology"?"triangle":"sine",i.overtone.type="sine",i.carrier.frequency.setValueAtTime(l,n),i.harmonic.frequency.setValueAtTime(l*(t==="fractal"?1:t==="high-dim"?2.76:2),n),i.overtone.frequency.setValueAtTime(l*(t==="chaos"?2:t==="high-dim"?5.4:2.76),n),i.harmonic.detune.value=t==="topology"?6:0,i.overtone.detune.value=t==="topology"?-6:0,t==="chaos"?(i.mod.type="sine",i.mod.frequency.value=l*2,i.modGain.gain.setValueAtTime(180,n),i.modGain.gain.exponentialRampToValueAtTime(20,n+.4)):i.modGain.gain.value=0}releaseVoice(e,t){const o=this.voices[e];if(!o)return;const n=this.ctx.currentTime;o.gain.gain.cancelScheduledValues(n),o.gain.gain.setTargetAtTime(1e-4,n,.18),o.active=!1,o.releaseAt=n+1.2,this.cooldown.set(t,n+4.5);const i=this.states.get(t);i&&(i.activeVoice=-1)}dispose(){for(const e of this.voices)e.carrier.stop(),e.harmonic.stop(),e.overtone.stop(),e.mod.stop();this.voices.length=0,this.states.clear()}}class gr{enabled=!1;ctx=null;mixer=null;engineVoice=null;leviathanVoice=null;voicePool=null;noiseBuffer=null;nextArcAt=0;lastWarpState=!1;async unlock(){this.ctx||this.build(),this.ctx?.state==="suspended"&&await this.ctx.resume(),this.enabled=!0,this.mixer?.fadeMaster(.72,.8)}async toggle(){return!this.ctx||!this.enabled?(await this.unlock(),!0):(this.enabled=!1,this.mixer?.fadeMaster(0,.8),!1)}update(e,t,o,n,i,a,l,r,d){const m=this.ctx;if(!m||!this.mixer||!this.engineVoice||!this.leviathanVoice||!this.voicePool)return;const h=m.currentTime;this.mixer.syncListener(t);const p=n.length();ar(this.engineVoice,h,p,i);const u=this.leviathanVoice.update(h,o,n,r,d),c=i>.55;c&&!this.lastWarpState&&cr(m,f=>this.mixer.route(f)),this.lastWarpState=c,u<700&&h>=this.nextArcAt&&(this.nextArcAt=hr(m,f=>this.mixer.route(f),this.noiseBuffer,u,r)),this.voicePool.update(h,o,n,a,l)}dispose(){this.voicePool?.dispose(),this.leviathanVoice?.dispose(),this.ctx?.close(),this.ctx=null,this.mixer=null,this.engineVoice=null,this.leviathanVoice=null,this.voicePool=null}build(){const e=new AudioContext;this.ctx=e,this.mixer=new ur(e);const t=o=>this.mixer.route(o);ir(e,t),this.engineVoice=sr(e,t),this.leviathanVoice=new lr(e,t),this.voicePool=new fr(e,t),this.noiseBuffer=nr(e,.04)}}class vr{name="leviathan";update(e,t,o){e.leviathan.update(t,o,e.camera.position,e.flight.velocity)}}class wr{name="navigation";update(e,t){e.flight.update(t,e.logicalPos),e.floatingOrigin.update(),e.floatingOrigin.toLogical(e.flight.position,e.logicalPos),e.leviathan.syncWorld()}}class yr{name="dust";update(e,t,o){e.dust.sync(e.logicalPos,e.flight.velocity,e.floatingOrigin.worldOffset,o,e.canvas.height)}}class br{constructor(e={}){this.options=e}name="creatures";cursor=0;firstFrame=!0;loadedCount=0;totalCount=0;startedAtMs=0;completedAtMs=0;initCpu=0;get loaded(){return this.loadedCount}get remaining(){return Math.max(0,this.totalCount-this.loadedCount)}get initMs(){return this.startedAtMs?(this.completedAtMs||performance.now())-this.startedAtMs:0}get initCpuMs(){return Math.round(this.initCpu)}update(e,t,o){const n=e.creatures;if(this.totalCount=n.length,this.cursor<n.length){this.startedAtMs||(this.startedAtMs=performance.now());const i=this.firstFrame?Math.max(this.options.initialCount??10,this.options.batchSize??3):this.options.batchSize??3,a=this.options.maxMs??4,l=performance.now();let r=0;for(;this.cursor<n.length&&r<i&&(r===0||performance.now()-l<a);){const d=performance.now();n[this.cursor++].initialize(),this.initCpu+=performance.now()-d,r++}this.firstFrame=!1,this.loadedCount=this.cursor,this.cursor>=n.length&&!this.completedAtMs&&(this.completedAtMs=performance.now()),e.bus.emit("spawn-progress",{loaded:this.loadedCount,total:this.totalCount})}else this.loadedCount!==this.totalCount&&(this.loadedCount=this.totalCount,this.completedAtMs||(this.completedAtMs=performance.now()),e.bus.emit("spawn-progress",{loaded:this.loadedCount,total:this.totalCount}));for(const i of n)i.ready&&(i.setReferenceFrame(e.cosmosCenter),i.update(t,o,e.camera.position,e.flight.velocity))}}class xr{name="lod";update(e,t){e.lod.update(t)}}class Mr{name="callout";update(e){e.callout.update(e.leviathan.group.matrixWorld,e.camera.position.distanceTo(e.leviathan.worldPosition))}}class Cr{name="audio";update(e,t,o){e.audio.update(o,e.camera,e.flight.position,e.flight.velocity,e.flight.warpFactor,e.creatures,e.universeRoot,e.leviathan.worldPosition,e.leviathan.velocity)}}const Ar=.1;class Sr{name="hud";fpsEma=60;accum=0;update(e,t){t>0&&(this.fpsEma+=(1/t-this.fpsEma)*.05),this.accum+=t,!(this.accum<Ar)&&(this.accum=0,e.bus.emit("telemetry",{x:e.logicalPos.x,y:e.logicalPos.y,z:e.logicalPos.z,speed:e.flight.speed,distToRiemann:e.logicalPos.distanceTo(e.leviathan.group.position),fps:this.fpsEma}))}}class Pr{engine;dust=new go;leviathan=new Bo;audio=new gr;flight;floatingOrigin;callout;creatures;lod;cosmosCenter=new w;riemannTarget;creatureSystem=new br({initialCount:10,batchSize:3,maxMs:4});bus;runner=new to;context;drawer;selector;hud;input;langControl;locale=zn();logicalPos=new w;resizeCallout;onPageHide;audioUnlocked=!1;disposed=!1;constructor(e,t){this.bus=t,this.engine=new Jn(e,(o,n)=>{this.context&&this.runner.update(this.context,o,n)}),this.flight=new uo(this.engine.camera,e,o=>t.emit("flight-state",o)),this.floatingOrigin=new po(this.engine.camera,this.engine.universeRoot,this.flight.position,o=>this.flight.rebaseOrigin(o)),this.floatingOrigin.toLogical(this.flight.position,this.logicalPos),this.engine.scene.add(this.dust.mesh),this.engine.universeRoot.add(this.leviathan.group),this.callout=new pa(document.getElementById("callout-canvas"),this.engine.camera,this.leviathan.anchors),this.resizeCallout=()=>{this.callout.resize(window.innerWidth,window.innerHeight,Math.min(window.devicePixelRatio,2))},this.resizeCallout(),window.addEventListener("resize",this.resizeCallout),this.creatures=ra(this.engine.universeRoot),this.lod=new ua(this.creatures,this.engine.camera,this.engine.universeRoot),this.riemannTarget={group:this.leviathan.group,universeRoot:this.engine.universeRoot,radius:950,titleZh:"黎曼猜想终极巨构",titleEn:"Riemann Leviathan",kind:"riemann",velocity:this.leviathan.velocity},this.context={canvas:e,bus:t,engine:this.engine,universeRoot:this.engine.universeRoot,camera:this.engine.camera,dust:this.dust,leviathan:this.leviathan,creatures:this.creatures,lod:this.lod,callout:this.callout,audio:this.audio,flight:this.flight,floatingOrigin:this.floatingOrigin,logicalPos:this.logicalPos,cosmosCenter:this.cosmosCenter,riemannTarget:this.riemannTarget},this.runner.add(new vr).add(new wr).add(new yr).add(this.creatureSystem).add(new xr).add(new Mr).add(new Cr).add(new Sr),this.buildUi(),this.onPageHide=()=>this.dispose(),window.addEventListener("pagehide",this.onPageHide)}start(){this.engine.start()}get debug(){return{engine:this.engine,flight:this.flight,floatingOrigin:this.floatingOrigin,dust:this.dust,leviathan:this.leviathan,callout:this.callout,creatures:this.creatures,lod:this.lod,audio:this.audio,drawer:this.drawer,selector:this.selector,riemannTarget:this.riemannTarget,runner:this.runner,creatureSystem:this.creatureSystem,context:this.context}}buildUi(){this.hud=new Qa(document.getElementById("hud"),this.bus,this.locale),this.drawer=new Ka(document.getElementById("codex-drawer"),e=>this.warpToCreature(e),()=>this.flight.detach(),()=>void this.toggleAudio(),this.locale),this.selector=new $a(document.getElementById("warp-selector"),{onWarpRiemann:()=>{this.flight.warpTo(this.riemannTarget),this.drawer.close()},onWarpCreature:e=>this.warpToCreature(e),onToggleAudio:()=>void this.toggleAudio()},this.locale),this.langControl=new er(document.getElementById("app-lang"),this.locale,e=>this.applyLocale(e)),this.input=new Ja({canvas:this.engine.renderer.domElement,camera:this.engine.camera,creatures:this.creatures,flight:this.flight,drawer:this.drawer,onFirstInteraction:()=>void this.unlockAudio()})}applyLocale(e){this.locale=e,this.hud.setLocale(e),this.drawer.setLocale(e),this.selector.setLocale(e),this.langControl.setLocale(e)}nearestCreature(e){let t=null,o=1/0;for(const n of this.creatures){if(!n.alive||n.config.modelType!==e.modelType)continue;const i=n.group.position.x+this.engine.universeRoot.position.x-this.flight.position.x,a=n.group.position.y+this.engine.universeRoot.position.y-this.flight.position.y,l=n.group.position.z+this.engine.universeRoot.position.z-this.flight.position.z,r=i*i+a*a+l*l;r<o&&(o=r,t=n)}return t||(this.creatures.find(n=>n.ready&&n.config.modelType===e.modelType)??this.creatures.find(n=>n.ready)??this.creatures[0])}warpToCreature(e){const t=this.nearestCreature(e);this.flight.warpTo({group:t.group,universeRoot:this.engine.universeRoot,radius:t.config.scale,titleZh:t.config.titleZh,titleEn:t.config.titleEn,kind:"creature"}),this.drawer.open(e)}async toggleAudio(){const e=await this.audio.toggle();this.selector.setAudioLabel(e),this.drawer.setAudioLabel(e)}async unlockAudio(){this.audioUnlocked||(this.audioUnlocked=!0,await this.audio.unlock(),this.selector.setAudioLabel(!0),this.drawer.setAudioLabel(!0))}dispose(){if(!this.disposed){this.disposed=!0,window.removeEventListener("resize",this.resizeCallout),window.removeEventListener("pagehide",this.onPageHide),this.input?.dispose(),this.hud?.dispose(),this.runner.dispose(),this.audio.dispose(),this.flight.dispose(),this.dust.dispose(),this.leviathan.dispose();for(const e of this.creatures)e.dispose();this.engine.dispose()}}}class Fr{handlers=new Map;on(e,t){let o=this.handlers.get(e);return o||(o=new Set,this.handlers.set(e,o)),o.add(t),()=>o.delete(t)}emit(e,t){const o=this.handlers.get(e);if(o)for(const n of o)n(t)}}const ft=document.createElement("canvas");ft.id="app-canvas";document.body.prepend(ft);const kr=new Fr,rt=new Pr(ft,kr);rt.start();Object.assign(window,{__COSMOS__:rt.debug,__PERF__:rt.engine.perf});
