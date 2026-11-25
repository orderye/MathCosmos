import type { Locale } from './locale';

type DescriptionMap = Record<string, string>;

const EN: DescriptionMap = {
  lorenz:
    "Edward Lorenz's simplified convection model from 1963: at σ=10, ρ=28, β=8/3 it traces the famous butterfly wings — chaos born from deterministic equations.",
  rossler:
    'A minimal chaotic system rebuilt from three nonlinear terms: a flat vortex coils slowly, then snaps across a folded crest like a ribbon jellyfish.',
  aizawa:
    'An axisymmetric strange attractor whose trajectories thread around a central axis, forming a spherical plasma core like a chaotic sea urchin.',
  thomas:
    'A labyrinthine attractor with threefold cyclic symmetry; twelve seed trajectories weave through three orthogonal directions like a slow cluster of indigo ganglia.',
  halvorsen:
    'A three-wing spiral around the main diagonal, its trajectories drawn into broad ribbons of flowing light — white-hot core, crimson edges, like a plasma star ray.',
  'chen-lee':
    'North–south symmetric double-scroll magnetic storms: particles leap chaotically between ice-cyan and cobalt poles, flashing pure white as they cross the equator.',
  dadras:
    'Four interwoven symmetric wings of electric arc; indigo and pink pulses race along the trajectories like a shadow ray gliding through deep space.',
  'abc-flow':
    "The classic steady solution of Euler's incompressible equations, with velocity parallel to vorticity everywhere; thousands of tracers stir a chaotic anemone inside a periodic sphere.",
  mandelbulb:
    'A fractal monolith of three-dimensional complex dynamics: spherical power iteration marches through a distance field, deep teal in the crevices, fluorescent green on the tips — slow-breathing deep-space coral.',
  sierpinski:
    'An iterated function system of four contractive affine maps, recursed four levels: 256 micro-tetrahedra form a white-cored, ice-blue recursive lattice pulsing in the dark.',
  'quaternion-julia':
    'A fractal coral core from quaternion squaring sliced into 3D, while the constant c(t) wanders a small four-dimensional circle — dark sea-green valleys, neon-emerald ridges, alive and growing.',
  apollonian:
    'A recursive bubble anemone from the three-dimensional Soddy–Gosset recurrence: some 400 glass spheres, each tangent to its neighbours, ice-blue at the rims and magenta in the tiny ones.',
  'gray-scott':
    'Two chemicals react and diffuse across a spherical UV domain: dark ink-green in the troughs, fluorescent emerald and electric lime along the growing fronts — a self-dividing luminous cell.',
  gyroid:
    'A TPMS coral sphere riddled with a connected three-dimensional labyrinth; thin walls refract electric cyan and pure white as the pores contract and expand organically.',
  menger:
    'The recursive extension of the 3D Cantor set: a third-order 20³ lattice with face and body centres removed, leaving thousands of micro-cubes — a living mechanical sanctuary breathing in space.',
  hopf: 'The four-dimensional sphere decomposed into interlocking fibre circles and stereographically projected into 3D; each fibre carries a continuous spectral hue by longitude, with white beads orbiting together.',
  'cell-24':
    'The self-dual regular polytope unique to four dimensions: 24 vertices and 96 edges rotating in the XW and YZ planes at once, their stereographic edges bent into elegant hyperbolic arcs.',
  'clifford-torus':
    'A flat minimal torus embedded in the 4D unit sphere. Double-layered gold-orange films and Villarceau grids swallow and release themselves as it rotates — a doubly spinning cage of light.',
  poincare:
    'The open-unit-ball model of 3D hyperbolic space: some 300 geodesic arcs meet the boundary sphere at right angles and shrink toward infinity — violet at the core, cold river-blue at the rim.',
  e8: 'The 240 root vectors of the exceptional Lie group E8 — 112 integer and 128 half-integer roots forming the most symmetric star chart in eight dimensions, 6,720 edges woven into a golden ring near the Coxeter plane.',
  quasicrystal:
    'A 6D hypercubic lattice cut-projected into 3D physical and perpendicular space: accepted points form a fivefold, never-repeating star-crystal network, pale rose and sky blue flickering shell by shell.',
  fourier:
    'A mechanical orrery of harmonics: four golden rings nested at ω∈{1,−3,7,−11}, their tip tracing an electric-cyan curve that fades as it is written.',
  harmonics:
    "The shape language of hydrogen's electron clouds: positive-phase lobes in rose gold, negative-phase lobes in quantum indigo, nodal planes in darkness, two states morphing back and forth in real time.",
  phyllotaxis:
    '2,500 star points arranged by the Fibonacci golden angle, with only prime indices lit and enlarged. Every three seconds a sieve wave sweeps past, primes blinking like a shoal of krill.',
  'ulam-prime':
    'The first 4,096 integers unrolled along an Archimedean–Sacks double spiral; primes become soft gold starlight, while twin primes and Euler-polynomial paths are threaded into rose-red chains.',
  hydrogen:
    'A rejection-sampled volumetric point cloud of high excited states from the Schrödinger equation: positive lobes in deep quantum blue, negative lobes in nebula pink, electrons streaming around the axis by angular momentum — a translucent quantum lotus.',
  kuramoto:
    '600 luminous spherical oscillators swing around the critical coupling strength: sometimes flashing in disorder, sometimes blazing in full resonance — a deep-sea firefly bloom breathing as one.',
  zeta: 'A guardian juvenile patrolling the Riemann leviathan: the critical-strip phase colours flow with arg ζ(s), and the first ten non-trivial zeros are set with pure-white high-energy cores, echoing the centre of the cosmos.',
  dipole:
    'Thin flux tubes on three L-shells: 1,200 aurora particles spiral in Larmor motion along the field lines, slowing at the north and south mirror points and bursting into cyan and violet flashes.',
  'calabi-yau':
    'A candidate shape for the six compact extra dimensions of string theory: four complex coordinates project continuously into 3D as the rotation angle α turns, petal-like surfaces folding in real time.',
  klein:
    'The non-orientable closed surface with no inside or outside: energy meridians flip and pass through a single-sided sheet without seams, like a boundless topological conch.',
  'torus-knot':
    "A closed knot wound around a torus, classified by coprime integer pairs (p,q). Scarlet and electric-blue waves chase each other along the tube like a neon sea serpent.",
  enneper:
    "A k-th order minimal surface in Weierstrass–Enneper polar form; its rim beats softly like a manta's pectoral fin, the film shifting between emerald and sky blue.",
  boy: 'A singularity-free immersion of the real projective plane in 3D: a three-lobed shell glows warm gold along its self-intersection ridges, with translucent rose-violet membranes inside.',
  dini: 'A helical cone of constant negative Gaussian curvature; cyan and lavender energy bands race along the asymptotics and converge into a pure-white needle at the tip, like a rotating luminous nautilus.',
  'helicoid-catenoid':
    'A Bonnet isometric family: the helicoid and catenoid curl and unfurl into each other without stretching, the first fundamental form unchanged, colour breathing between crimson and soft amber.',
  lissajous:
    'A closed harmonic knot braided from pairwise coprime frequencies (3,4,5); cyan and neon-magenta waves race toward each other along the tube, striking pure-white flares at each crossing.',
  roman:
    'A quartic model of the real projective plane with six singular pinch points; four swollen petals fade from sunset amber to rose crimson, three double lines lit by fine needles of light.',
  costa:
    'A genus-1, three-ended minimally embedded surface (one catenoid end, two planar ends); lake-blue and mint-green films whiten at the saddle rims, like a three-holed cup of light.',
  'mobius-twisted':
    'A single-sided, non-orientable band with three half-twists; a pair of light pulses race along the edge and must travel 4π to return to the same side, magenta and electric cyan tracing an endless loop.',
};

const JA: DescriptionMap = {
  lorenz:
    '1963 年にローレンツが提唱した簡略対流モデル。σ=10、ρ=28、β=8/3 で有名な蝶の双翼軌道を描く——決定論的方程式から生まれた混沌の翼。',
  rossler:
    '三つの最小非線形項で再構成された混沌系。平坦な渦がゆっくり巻き、折り返しの峰で急に引き伸ばされる——折り畳まれた光帯のクラゲ。',
  aizawa:
    '軸対称構造をもつ奇妙なアトラクター。軌道が中心軸の周りを縫うように走り、球形プラズマの混沌としたウニを形づくる。',
  thomas:
    '三重の循環対称をもつ迷宮状アトラクター。12 本の初期軌道が三つの直交方向で絡み合い、ゆっくり動く藍色の神経節の束のよう。',
  halvorsen:
    '主対角軸の周りを巡る三翼螺旋アトラクター。軌道は広い流光のリボンとなり、中心は白熱、外縁は緋色——プラズマの星エイ。',
  'chen-lee':
    '南北対称の二重渦巻き磁気嵐。氷青とコバルトの極の間で粒子が混沌と跳躍し、赤道を越えるたび純白の閃光を放つ。',
  dadras:
    '四枚の対称な電弧の翼が絡み合う。藍紫と桃色の高速パルスが軌道を奔り、深宇宙を滑空する影のエイのよう。',
  'abc-flow':
    '非圧縮オイラー方程式の古典的定常解。速度と渦度が至る所で平行で、数千の流線粒子が周期的な球体内で混沌のイソギンチャクをかき混ぜる。',
  mandelbulb:
    '三次元複素力学のフラクタル巨構。球座標の冪反復が距離推定場を進み、亀裂の奥は深い青緑、突起の先は蛍光の若緑——ゆっくり呼吸する深宇宙珊瑚。',
  sierpinski:
    '四つの縮小アフィン写像を四段再帰した反復関数系。256 個の微小四面体が、白い芯と氷青の線框をもつ再帰格子を編み、暗がりで脈打つ。',
  'quaternion-julia':
    '四元数平方反復を三次元断面に切ったフラクタル珊瑚核。定数 c(t) が四次元の小円を巡り、谷は暗い海青、稜はネオン翡翠——生きて成長するよう。',
  apollonian:
    '三次元 Soddy–Gosset 漸化式が生む再帰的な泡のイソギンチャク。約 400 個のガラス球が互いに接し、大きな泡の縁は氷空色、微小な泡はマゼンタに光る。',
  'gray-scott':
    '二種の化学物質が球面 UV 上で反応拡散する。低濃度の谷は暗い墨緑、成長前線は蛍光翠と電光ライム——自ら分裂する発光細胞球。',
  gyroid:
    '連結した三次元迷宮孔をもつ TPMS 珊瑚球。薄い壁が電光青と純白のハイライトを屈折させ、孔は有機的に収縮と膨張を繰り返す。',
  menger:
    '三次元カントール集合の再帰的拡張。三次の 20³ 格子から面心と体心を除いた数千の微小立方体——宇宙で呼吸する生きた機械聖堂。',
  hopf: '四次元球面を互いに絡むファイバー円環へ分解し、立体投影で三次元へ。各ファイバーは経度に応じた連続スペクトル色を帯び、白い光珠が同期して巡る。',
  'cell-24':
    '四次元にしか存在しない自己双対正多胞体。24 頂点・96 辺が XW と YZ の二平面で同時に回転し、立体投影された辺は優雅な双曲弧に曲がる。',
  'clifford-torus':
    '四次元単位球面に埋め込まれた平坦極小トーラス。二層の金橙膜と Villarceau 斜交格子が回転の中で内と外を吞吐する——二重に回る光の籠。',
  poincare:
    '三次元双曲空間の開単位球モデル。約 300 本の測地弧が境界球面と直角に交わりながら無限の淵へ収縮する。中心は亮蘭紫、縁は冷たい星河青。',
  e8: '例外リー群 E8 の 240 本の根ベクトル。112 の整数根と 128 の半整数根が八次元で最も対称な星盤をなし、6720 本の辺がコクセター平面付近で金色の聖環を織る。',
  quasicrystal:
    '六次元超立方格子を三次元物理空間と垂直空間へ切投影。受容窓を通過した格子点が五回対称で決して繰り返さない星晶網をつくり、淡い薔薇色と天星青が層ごとに明滅する。',
  fourier:
    '調和波を重ねた機械の星盤。四段の金色円環が ω∈{1,−3,7,−11} で入れ子に回転し、先端が書き出す電光青の空間曲線は次第に薄れて消える。',
  harmonics:
    '水素原子の電子雲の形の言語。正位相の葉は薔薇金、負位相の葉は量子藍、節面は暗闇。二つの量子状態がリアルタイムで往復変形する。',
  phyllotaxis:
    'フィボナッチ黄金角で並ぶ 2500 の星点。素数番号だけが点灯し拡大される。三秒ごとに篩の光波が掃き、素数が磷蝦の群れのように瞬く。',
  'ulam-prime':
    '最初の 4096 の整数をアルキメデス–サックス二重螺旋に展開。素数は柔らかな金の星光となり、双子素数とオイラー多項式の軌跡が薔薇紅の鎖で結ばれる。',
  hydrogen:
    'シュレーディンガー方程式の高次励起状態を棄却サンプリングした体積点雲。正位相は深い量子青、負位相は星雲桃、電子が角運動量に沿って軸を巡る——透き通る量子蓮。',
  kuramoto:
    '600 個の球面発光振動子が臨界結合強度の周りで揺れる。時に無秩序に明滅し、時に全群が共振して斉明する——深海の蛍火が一つに呼吸するよう。',
  zeta: 'リーマン巨構を巡回する護衛幼体。臨界帯の位相色が arg ζ(s) に従って流れ、最初の 10 個の非自明零点に純白の高エネ星核が嵌まる——宇宙の中心と呼応する。',
  dipole:
    '三つの L 殻に沿う双極磁力線の細管。1200 の極光粒子が磁力線に沿ってラーモア螺旋を往復し、南北の磁鏡点で減速して青藍と紫の閃光を放つ。',
  'calabi-yau':
    '弦理論で六つの余剰次元をコンパクト化する候補形状。四つの複素座標が回転角 α に応じて三次元へ連続投影され、花弁状の曲面がリアルタイムに折り返す。',
  klein:
    '表も裏もない非可向閉曲面。エネルギーの経緯線が単側面を継ぎ目なく反転しながら走る——無限のトポロジー巻貝。',
  'torus-knot':
    'トーラスに巻き付く閉じた結び目。互いに素な整数対 (p,q) で分類される。緋色と電光青の行波が管身を高速で追いかけ、ネオンの海蛇のよう。',
  enneper:
    'Weierstrass–Enneper 極座標で表される k 次極小曲面。縁はマンタの胸鰭のように柔らかく羽ばたき、薄膜は翠と空青の二色に揺れる。',
  boy: '実射影平面の三次元への特異点なき浸入。三葉の貝殻が自己交差の稜で暖かな金のハイライトを放ち、腹腔には薔薇紫の半透明膜が透ける。',
  dini: '常負ガウス曲率の螺旋錐面。漸近線に沿って流れる青緑とラベンダーのエネルギー帯が、先端で純白の針に収束する——回転する発光オウムガイ。',
  'helicoid-catenoid':
    'Bonnet 等距変形族。螺旋面と懸垂面の間を伸縮なく巻き込み・広げ、第一基本形式は不変。色は位相に応じて緋色と柔らかな橙金の間で呼吸する。',
  lissajous:
    '互いに素な周波数 (3,4,5) で編まれた閉じた調和結び目。青とネオンマゼンタの高エネ波が管身を相向かって走り、立体交差で純白の耀斑を打つ。',
  roman:
    '六つの特異夾点をもつ実射影平面の四次曲面。四枚の膨らんだ花弁が夕陽の琥珀から薔薇緋色へ移ろい、三本の二重線に細い光の針が灯る。',
  costa:
    '種数 1、三つの端（懸垂端一つと平面端二つ）をもつ自己交差なき極小埋め込み曲面。湖青と薄荷緑の二層膜が鞍点の縁で白み、三孔の光の杯のよう。',
  'mobius-twisted':
    '三つの半捻りをもつ単側・非可向の帯。一対の流光パルスが縁を相向かって走り、同じ側へ戻るには 4π 必要。マゼンタと電青が無限の回環を描く。',
};

const KO: DescriptionMap = {
  lorenz:
    '1963년 로렌츠가 제안한 단순화된 대류 모델. σ=10, ρ=28, β=8/3에서 유명한 나비 날개 궤적을 그린다——결정론적 방정식에서 태어난 혼돈의 날개.',
  rossler:
    '세 개의 최소 비선형 항으로 재구성한 혼돈계. 평평한 소용돌이가 천천히 감기다가 접힌 봉우리에서 갑자기 늘어난다——접힌 빛 띠 해파리.',
  aizawa:
    '축대칭 구조의 기이한 끌개. 궤적이 중심축을 바늘처럼 누비며 구형 플라스마의 혼돈 성게를 만든다.',
  thomas:
    '삼중 순환 대칭의 미로형 끌개. 12개의 초기 궤적이 세 직교 방향에서 서로 얽히며 천천히 꿈틀대는 남색 신경절 다발처럼 보인다.',
  halvorsen:
    '주대각축을 도는 세 날개 나선 끌개. 궤적은 넓은 유광 리본이 되고 중심은 백열, 가장자리는 진홍——플라스마 별가오리.',
  'chen-lee':
    '남북 대칭의 이중 소용돌이 자기 폭풍. 얼음청과 코발트 극 사이에서 입자가 예측 불가능하게 도약하고, 적도를 넘을 때 순백의 섬광이 터진다.',
  dadras:
    '네 개의 대칭 전호 날개가 서로 감긴다. 남보라와 분홍의 고속 펄스가 궤적을 따라 흐르며 심우주를 활공하는 그림자 전기 가오리처럼 보인다.',
  'abc-flow':
    '비압축 오일러 방정식의 고전적 정상해. 속도와 와도가 모든 곳에서 평행하며, 수천 개의 유선 입자가 주기 구 안에서 혼돈 말미잘을 휘젓는다.',
  mandelbulb:
    '3차원 복소 동역학의 프랙털 거대 구조. 구면 좌표 거듭제곱 반복이 거리 추정장을 따라가고, 균열 깊은 곳은 짙은 청록, 돌출 끝은 형광 연두——천천히 숨 쉬는 심우주 산호.',
  sierpinski:
    '네 개의 축소 아핀 사상을 네 단계 재귀한 반복 함수계. 256개의 작은 사면체가 흰 심과 얼음청 선체의 재귀 격자를 이루며 어둠 속에서 규칙적으로 맥동한다.',
  'quaternion-julia':
    '사원수 제곱 반복을 3차원 단면으로 자른 프랙털 산호 핵. 상수 c(t)가 4차원 작은 원을 돌고, 골짜기는 짙은 바다청, 능선은 네온 에메랄드——살아 자라는 듯하다.',
  apollonian:
    '3차원 Soddy–Gosset 점화식이 만드는 재귀 거품 말미잘. 약 400개의 유리구가 서로 맞닿아 있고, 큰 거품 가장자리는 얼음하늘색, 작은 거품은 마젠타로 빛난다.',
  'gray-scott':
    '두 화학 물질이 구면 UV 영역에서 반응·확산한다. 저농도 골짜기는 어두운 먹청록, 성장 전선은 형광 취록과 전광 라임——스스로 분열하는 발광 세포구.',
  gyroid:
    '연결된 3차원 미로 구멍의 TPMS 산호구. 얇은 벽이 전광 청록과 순백 하이라이트를 굴절시키고, 구멍은 유기적으로 수축·팽창한다.',
  menger:
    '3차원 칸토어 집합의 재귀적 확장. 3차 20³ 격자에서 면심과 체심을 제거한 수천 개의 미세 정육면체——우주에서 숨 쉬는 살아 있는 기계 성전.',
  hopf: '4차원 구면을 서로 맞물린 섬유 원환으로 분해해 입체 투영한 것. 각 섬유는 경도에 따라 연속 스펙트럼 색을 띠고, 흰 광구가 동기화되어 함께 돈다.',
  'cell-24':
    '4차원에만 존재하는 자기쌍대 정다포체. 24개 꼭짓점과 96개 모서리가 XW와 YZ 두 평면에서 동시에 회전하고, 입체 투영된 모서리는 우아한 쌍곡 호로 휜다.',
  'clifford-torus':
    '4차원 단위 구면에 매립된 평탄 극소 원환. 두 겹의 금주황 막과 Villarceau 사교 격자가 회전 속에서 안팎을 삼키고 토해낸다——이중으로 도는 빛의 우리.',
  poincare:
    '3차원 쌍곡 공간의 열린 단위 공 모델. 약 300개의 측지 호가 경계 구면과 직각으로 만나며 무한의 끝으로 수축한다. 중심은 밝은 난보라, 가장자리는 차가운 은하청.',
  e8: '예외 리 군 E8의 240개 근 벡터. 112개의 정수 근과 128개의 반정수 근이 8차원에서 가장 완벽한 대칭 별판을 이루고, 6720개 모서리가 콕서터 평면 근처에서 황금 성환을 엮는다.',
  quasicrystal:
    '6차원 초입방 격자를 3차원 물리 공간과 수직 공간으로 절단 투영. 수용 창을 통과한 격자점이 오중 대칭의 결코 반복되지 않는 성결정망을 만들고, 옅은 장밋빛과 하늘별빛이 층마다 명멸한다.',
  fourier:
    '조화파를 겹친 기계 성반. 네 단계의 황금 원환이 ω∈{1,−3,7,−11}로 중첩 회전하고, 끝점이 실시간으로 그리는 전광 청록 공간 곡선은 점점 옅어져 사라진다.',
  harmonics:
    '수소 원자 전자 구름의 형태 언어. 양위상 잎은 장미금, 음위상 잎은 양자 남색, 절점면은 어둠. 두 양자 상태가 실시간으로 왕복 변형한다.',
  phyllotaxis:
    '피보나치 황금각으로 배열된 2500개의 별점. 소수 인덱스만 켜지고 확대된다. 3초마다 체의 빛 물결이 지나가며 소수가 크릴 떼처럼 반짝인다.',
  'ulam-prime':
    '처음 4096개의 정수를 아르키메데스–색스 이중 나선으로 펼친 것. 소수는 부드러운 금빛 별빛이 되고, 쌍둥이 소수와 오일러 다항식 궤적은 장밋빛 사슬로 이어진다.',
  hydrogen:
    '슈뢰딩거 방정식의 고차 들뜬 상태를 기각 샘플링한 체적 점구름. 양위상은 깊은 양자청, 음위상은 성운 분홍, 전자가 각운동량에 따라 축을 돌며 흐른다——투명한 양자 연꽃.',
  kuramoto:
    '600개의 구면 발광 진동자가 임계 결합 강도 부근에서 흔들린다. 때로는 무질서하게 명멸하고, 때로는 온 무리가 공명해 환히 밝아진다——심해의 반딧불이 하나로 숨 쉬는 듯.',
  zeta: '리만 거대 구조를 순찰하는 수호 유체. 임계대 위상 색이 arg ζ(s)를 따라 흐르고, 처음 10개의 비자명 영점에 순백 고에너지 성핵이 박혀 우주 중심과 호응한다.',
  dipole:
    '세 개의 L 껍질을 따르는 쌍극 자기력선 세관. 1200개의 오로라 입자가 자기력선을 따라 라모어 나선으로 왕복하고, 남북 자북 거울점에서 감속하며 청람과 보라 섬광을 터뜨린다.',
  'calabi-yau':
    '끈 이론에서 6개의 여분 차원을 콤팩트화하는 후보 형상. 네 개의 복소 좌표가 회전각 α에 따라 3차원으로 연속 투영되고, 꽃잎 모양 곡면이 실시간으로 접힌다.',
  klein:
    '안과 밖이 없는 비가향 폐곡면. 에너지 경위선이 단일 면을 이음매 없이 뒤집으며 지나간다——무한한 위상학적 소라.',
  'torus-knot':
    '원환면에 감긴 닫힌 매듭. 서로소 정수쌍 (p,q)로 분류된다. 진홍과 전광 파랑의 행파가 관 몸체를 따라 빠르게 추격하며 네온 바다뱀처럼 보인다.',
  enneper:
    'Weierstrass–Enneper 극좌표로 표현한 k차 극소 곡면. 가장자리는 만타의 가슴지느러미처럼 부드럽게 파닥이고, 막은 취록과 하늘파랑 두 색으로 일렁인다.',
  boy: '실사영 평면의 3차원 특이점 없는 침입. 세 잎 조개가 자기교차 능선에서 따뜻한 금빛 하이라이트를 내고, 복강에는 장미보라 반투명 막이 비친다.',
  dini: '상수 음의 가우스 곡률을 가진 나선 원뿔면. 점근선을 따라 흐르는 청록과 라벤더 에너지 띠가 끝에서 순백 바늘로 모인다——회전하며 나아가는 발광 앵무조개.',
  'helicoid-catenoid':
    'Bonnet 등거리 변형족. 나선면과 현수면 사이를 늘어남 없이 감고 펴며, 제1기본형식은 그대로다. 색은 위상에 따라 진홍과 부드러운 주황금 사이에서 숨 쉰다.',
  lissajous:
    '서로소 주파수 (3,4,5)로 엮은 닫힌 조화 매듭. 청록과 네온 마젠타 고에너지 파동이 관 몸체를 마주 보고 달리며 입체 교차점에서 순백 섬광을 터뜨린다.',
  roman:
    '6개의 특이 집점을 가진 실사영 평면 4차 곡면. 네 장의 부푼 꽃잎이 노을 호박에서 장미 진홍으로 변하고, 세 개의 이중선에 가는 빛 바늘이 켜진다.',
  costa:
    '종수 1, 세 개의 끝(현수 끝 하나와 평면 끝 둘)을 가진 자기교차 없는 극소 매립 곡면. 호수청과 민트록 두 겹 막이 안장점 가장자리에서 하얗게 빛난다——세 구멍의 빛 잔.',
  'mobius-twisted':
    '세 번의 반꼬임을 가진 단면 비가향 띠. 한 쌍의 유광 펄스가 가장자리를 마주 보고 달리며 같은 면으로 돌아오려면 4π가 필요하다. 마젠타와 전광 청록이 끝없는 회환을 그린다.',
};

const DE: DescriptionMap = {
  lorenz:
    'Lorenz’ vereinfachtes Konvektionsmodell von 1963: Bei σ=10, ρ=28, β=8/3 zeichnet es die berühmten Schmetterlingsflügel — Chaos aus deterministischen Gleichungen.',
  rossler:
    'Ein minimales chaotisches System aus drei nichtlinearen Termen: Ein flacher Wirbel windet sich langsam und schnellt dann über einen gefalteten Kamm — eine gefaltete Lichtband-Qualle.',
  aizawa:
    'Ein achsensymmetrischer seltsamer Attraktor, dessen Bahnen um eine Mittelachse fädeln und einen kugelförmigen Plasmakern wie einen chaotischen Seeigel bilden.',
  thomas:
    'Ein labyrinthischer Attraktor mit dreifacher zyklischer Symmetrie; zwölf Startbahnen verweben sich in drei orthogonalen Richtungen wie ein langsam kriechendes Bündel indigoer Ganglien.',
  halvorsen:
    'Eine dreiflügelige Spirale um die Hauptdiagonale, deren Bahnen zu breiten fließenden Lichtbändern werden — weißglühender Kern, purpurrote Ränder, wie ein Plasma-Sternrochen.',
  'chen-lee':
    'Nord-Süd-symmetrische Doppelwirbel-Magnetstürme: Teilchen springen chaotisch zwischen eisblauen und kobaltblauen Polen und blitzen am Äquator reinweiß auf.',
  dadras:
    'Vier ineinander verwobene symmetrische Lichtbogenflügel; indigo- und rosafarbene Pulse rasen über die Bahnen wie ein Schattenrochen im tiefen Raum.',
  'abc-flow':
    'Die klassische stationäre Lösung der inkompressiblen Euler-Gleichungen, bei der Geschwindigkeit und Wirbelstärke überall parallel sind; Tausende Tracer rühren in einer periodischen Kugel eine chaotische Anemone.',
  mandelbulb:
    'Ein Fraktalmonolith der dreidimensionalen komplexen Dynamik: Kugelkoordinaten-Potenziteration wandert durch ein Distanzfeld, tiefes Blaugrün in den Spalten, fluoreszierendes Grün an den Spitzen — langsam atmende Tiefraumkoralle.',
  sierpinski:
    'Ein iteriertes Funktionensystem aus vier kontrahierenden affinen Abbildungen, vier Stufen tief: 256 Mikrotetraeder bilden ein rekursives Gitter mit weißem Kern und eisblauen Kanten, das im Dunkeln pulsiert.',
  'quaternion-julia':
    'Ein fraktaler Korallenkern aus Quaternionenquadraten, in 3D geschnitten, während die Konstante c(t) auf einem kleinen vierdimensionalen Kreis wandert — dunkle meergrüne Täler, neon-smaragdgrüne Grate, lebendig wachsend.',
  apollonian:
    'Eine rekursive Blasenanemone aus der dreidimensionalen Soddy-Gosset-Rekursion: rund 400 Glaskugeln, jede ihre Nachbarn berührend, eisblau an den Rändern, magenta in den winzigen.',
  'gray-scott':
    'Zwei Chemikalien reagieren und diffundieren auf einer sphärischen UV-Domäne: dunkles Tintengrün in den Senken, fluoreszierendes Smaragd und elektrisches Limettengrün an den Wachstumsfronten — eine sich teilende leuchtende Zelle.',
  gyroid:
    'Eine TPMS-Korallenkugel voller zusammenhängender dreidimensionaler Labyrinthporen; dünne Wände brechen elektrisches Cyan und reines Weiß, während sich die Poren organisch zusammenziehen und ausdehnen.',
  menger:
    'Die rekursive Erweiterung der 3D-Cantor-Menge: ein Gitter dritter Ordnung mit 20³ Zellen, aus dem Flächen- und Körperzentren entfernt sind, übrig bleiben Tausende Mikrowürfel — ein lebendiges mechanisches Heiligtum, das im Raum atmet.',
  hopf: 'Die vierdimensionale Sphäre, in ineinandergreifende Faserringe zerlegt und stereografisch in 3D projiziert; jede Faser trägt je nach Länge einen kontinuierlichen Spektralton, weiße Lichtperlen kreisen gemeinsam.',
  'cell-24':
    'Der selbstduale reguläre Polytop, den es nur in vier Dimensionen gibt: 24 Ecken und 96 Kanten rotieren gleichzeitig in XW- und YZ-Ebene, ihre stereografischen Kanten biegen sich zu eleganten hyperbolischen Bögen.',
  'clifford-torus':
    'Ein flacher minimaler Torus in der vierdimensionalen Einheitssphäre. Doppellagige goldorange Filme und Villarceau-Gitter schlucken und entlassen sich beim Rotieren — ein doppelt drehender Lichtkäfig.',
  poincare:
    'Das offene Einheitskugelmodell des dreidimensionalen hyperbolischen Raums: rund 300 Geodäten treffen die Randkugel im rechten Winkel und schrumpfen ins Unendliche — violett im Kern, kaltes Flussblau am Rand.',
  e8: 'Die 240 Wurzelvektoren der exzeptionellen Lie-Gruppe E8 — 112 ganzzahlige und 128 halbzahlige Wurzeln bilden die symmetrischste Sternkarte in acht Dimensionen, 6.720 Kanten weben nahe der Coxeter-Ebene einen goldenen Ring.',
  quasicrystal:
    'Ein 6D-hyperkubisches Gitter, schnittprojiziert in 3D-Raum und Senkrechtraum: akzeptierte Punkte bilden ein fünfzähliges, nie wiederholtes Sternkristallnetz, blasses Rosenrot und Himmelsblau flackern Schale um Schale.',
  fourier:
    'Ein mechanisches Harmonie-Orrery: vier goldene Ringe, verschachtelt bei ω∈{1,−3,7,−11}, deren Spitze eine elektrisch-cyanfarbene Kurve schreibt, die beim Entstehen verblasst.',
  harmonics:
    'Die Formsprache der Wasserstoff-Elektronenwolken: positivphasige Keulen in Roségold, negativphasige in Quantenindigo, Knotenflächen im Dunkel; zwei Zustände morphen in Echtzeit hin und her.',
  phyllotaxis:
    '2.500 Sternpunkte im Fibonacci-Goldenen Winkel, nur Primzahl-Indizes leuchten und wachsen. Alle drei Sekunden fegt eine Siebwelle vorbei, Primzahlen blinken wie ein Krillschwarm.',
  'ulam-prime':
    'Die ersten 4.096 ganzen Zahlen, entrollt auf einer archimedisch-sacksischen Doppelspirale; Primzahlen werden zu weichem Goldsternlicht, Primzahlzwillinge und Euler-Polynom-Pfade zu rosaroten Ketten.',
  hydrogen:
    'Eine rejektionsgesampelte volumetrische Punktwolke hoher angeregter Schrödinger-Zustände: positive Keulen in tiefem Quantenblau, negative in Nebelrosa, Elektronen strömen je nach Drehimpuls um die Achse — ein durchscheinender Quantenlotus.',
  kuramoto:
    '600 leuchtende Kugeloszillatoren schwingen um die kritische Kopplungsstärke: mal flackern sie ungeordnet, mal erglühen alle in Resonanz — eine Tiefsee-Leuchtblüte, die als Einheit atmet.',
  zeta: 'Ein Wächter-Jungtier, das den Riemann-Leviathan umkreist: Die Phasenfarben des kritischen Streifens folgen arg ζ(s), und die ersten zehn nichttrivialen Nullstellen tragen reinweiße Hochenergiekernen — ein Echo des Kosmoszentrums.',
  dipole:
    'Dünne Flussröhren auf drei L-Schalen: 1.200 Aurora-Teilchen spiralförmig in Larmor-Bewegung entlang der Feldlinien, bremsen an den Nord- und Süd-Spiegelpunkten und blitzen cyan und violett auf.',
  'calabi-yau':
    'Eine Kandidatenform für die sechs kompaktifizierten Extradimensionen der Stringtheorie: Vier komplexe Koordinaten projizieren bei rotierendem Winkel α kontinuierlich in 3D, blütenförmige Flächen falten sich in Echtzeit.',
  klein:
    'Die nicht orientierbare geschlossene Fläche ohne Innen und Außen: Energiemeridiane kippen nahtlos durch eine einseitige Haut — eine grenzenlose topologische Schnecke.',
  'torus-knot':
    'Ein geschlossener Knoten um einen Torus, klassifiziert durch teilerfremde Ganzzahlpaare (p,q). Scharlachrote und elektrisch blaue Wellen jagen einander durch die Röhre wie eine Neon-Seeschlange.',
  enneper:
    'Eine minimale Fläche k-ter Ordnung in Weierstraß–Enneper-Polarkoordinaten; ihr Rand schlägt sanft wie eine Manta-Brustflosse, der Film wechselt zwischen Smaragd und Himmelblau.',
  boy: 'Eine singularitätsfreie Immersion der reellen projektiven Ebene in 3D: Eine dreilappige Schale glüht warmgolden an ihren Selbstschnittkämmen, innen schimmert eine durchscheinende rosenviolette Membran.',
  dini: 'Ein schraubenförmiger Kegel konstanter negativer Gaußkrümmung; cyan- und lavendelfarbene Energiebänder rasen entlang der Asymptoten und laufen an der Spitze in eine reinweiße Nadel — ein rotierender leuchtender Nautilus.',
  'helicoid-catenoid':
    'Eine isometrische Bonnet-Familie: Helikoid und Katenoid rollen sich ohne Dehnung ineinander, die erste Fundamentalform bleibt unverändert, die Farbe atmet zwischen Scharlach und sanftem Goldorange.',
  lissajous:
    'Ein geschlossener harmonischer Knoten aus teilerfremden Frequenzen (3,4,5); cyan- und neonmagenta Farbwellen laufen einander durch die Röhre entgegen und schlagen an jeder Kreuzung reinweiße Flares.',
  roman:
    'Eine quartische Fläche der reellen projektiven Ebene mit sechs singulären Quetschpunkten; vier geschwollene Blütenblätter gehen von Sonnenuntergangsamber zu Rosenrot über, drei Doppellinien leuchten mit feinen Lichtnadeln.',
  costa:
    'Eine minimal eingebettete Fläche vom Geschlecht 1 mit drei Enden (ein Katenoid-, zwei Planarende); seeblaue und mintgrüne Filme bleichen an den Sattelrändern aus — ein dreilöchriger Kelch aus Licht.',
  'mobius-twisted':
    'Ein einseitiges, nicht orientierbares Band mit drei Halbdrehungen; zwei Lichtimpulse jagen entlang des Randes und brauchen 4π für die Rückkehr zur selben Seite, magenta und elektrisches Cyan zeichnen eine endlose Schleife.',
};

const FR: DescriptionMap = {
  lorenz:
    "Le modèle de convection simplifié de Lorenz (1963) : à σ=10, ρ=28, β=8/3, il trace les célèbres ailes de papillon — le chaos né d'équations déterministes.",
  rossler:
    "Un système chaotique minimal reconstruit à partir de trois termes non linéaires : un tourbillon plat s'enroule lentement puis se tend sur une crête pliée, comme une méduse de rubans lumineux.",
  aizawa:
    'Un attracteur étrange axisymétrique dont les trajectoires enfilent un axe central, formant un cœur de plasma sphérique pareil à un oursin chaotique.',
  thomas:
    "Un attracteur labyrinthique à symétrie cyclique triple ; douze trajectoires initiales s'entrelacent dans trois directions orthogonales comme un lent amas de ganglions indigo.",
  halvorsen:
    'Une spirale à trois ailes autour de la diagonale principale, dont les trajectoires s’étirent en larges rubans de lumière fluide — cœur incandescent, bords écarlates, comme une raie-plasma stellaire.',
  'chen-lee':
    'Des orages magnétiques à double enroulement symétriques nord-sud : les particules sautent chaotiquement entre des pôles cyan-glace et cobalt, et flashent en blanc pur en traversant l’équateur.',
  dadras:
    "Quatre ailes symétriques d'arc électrique entrelacées ; des impulsions indigo et roses courent le long des trajectoires comme une raie d'ombre planant dans l'espace profond.",
  'abc-flow':
    "La solution stationnaire classique des équations d'Euler incompressibles, où vitesse et vorticité sont partout parallèles ; des milliers de traceurs brassent une anémone chaotique dans une sphère périodique.",
  mandelbulb:
    "Un monolithe fractal de dynamique complexe tridimensionnelle : l'itération de puissance en coordonnées sphériques avance dans un champ de distance, bleu-vert profond dans les crevasses, vert fluorescent sur les pointes — un corail spatial qui respire lentement.",
  sierpinski:
    "Un système de fonctions itérées à quatre applications affines contractantes, récursé sur quatre niveaux : 256 micro-tétraèdres forment un treillis récursif à cœur blanc et arêtes bleu-glace, pulsant dans l'obscurité.",
  'quaternion-julia':
    'Un cœur de corail fractal issu du carré quaternionique tranché en 3D, tandis que la constante c(t) parcourt un petit cercle à quatre dimensions — vallées vert mer sombre, crêtes vert émeraude néon, vivant et croissant.',
  apollonian:
    'Une anémone de bulles récursive issue de la récurrence de Soddy–Gosset en 3D : quelque 400 sphères de verre, chacune tangente à ses voisines, bleu-glace sur les bords, magenta dans les plus petites.',
  'gray-scott':
    "Deux produits chimiques réagissent et diffusent sur un domaine UV sphérique : vert d'encre sombre dans les creux, émeraude fluorescent et lime électrique sur les fronts de croissance — une cellule lumineuse qui se divise.",
  gyroid:
    'Une sphère de corail TPMS criblée d’un labyrinthe tridimensionnel connecté ; ses parois fines réfractent un cyan électrique et un blanc pur tandis que les pores se contractent et s’ouvrent organiquement.',
  menger:
    "L'extension récursive de l'ensemble de Cantor 3D : un treillis du troisième ordre en 20³ dont on retire les centres de faces et de volume, laissant des milliers de micro-cubes — un sanctuaire mécanique vivant qui respire dans l'espace.",
  hopf: 'La sphère à quatre dimensions décomposée en cercles de fibres imbriqués puis projetée stéréographiquement en 3D ; chaque fibre porte une teinte spectrale continue selon sa longitude, des perles blanches orbitent ensemble.',
  'cell-24':
    'Le polytope régulier auto-dual propre à la quatrième dimension : 24 sommets et 96 arêtes tournent simultanément dans les plans XW et YZ, leurs arêtes projetées se courbant en élégants arcs hyperboliques.',
  'clifford-torus':
    "Un tore minimal plat plongé dans la sphère unité 4D. Des films or-orangé à double couche et des grilles de Villarceau avalent et libèrent l'espace en tournant — une cage de lumière à double rotation.",
  poincare:
    "Le modèle de la boule unité ouverte de l'espace hyperbolique 3D : quelque 300 géodésiques rencontrent la sphère frontière à angle droit et rétrécissent vers l'infini — violet au cœur, bleu-rivière froid au bord.",
  e8: 'Les 240 vecteurs racines du groupe de Lie exceptionnel E8 — 112 racines entières et 128 demi-entières forment la carte stellaire la plus symétrique en huit dimensions, 6 720 arêtes tissant un anneau d’or près du plan de Coxeter.',
  quasicrystal:
    "Un réseau hypercubique 6D découpé et projeté dans l'espace physique 3D et l'espace perpendiculaire : les points acceptés forment un réseau cristallin étoilé à symétrie quintuple, jamais répété, rose pâle et bleu céleste scintillant couche par couche.",
  fourier:
    "Un planétaire mécanique d'harmoniques : quatre anneaux dorés imbriqués à ω∈{1,−3,7,−11}, dont la pointe trace une courbe cyan électrique qui s'efface à mesure qu'elle s'écrit.",
  harmonics:
    'Le langage des formes des nuages électroniques de l’hydrogène : lobes de phase positive en or rosé, lobes négatifs en indigo quantique, plans nodaux dans l’obscurité ; deux états se métamorphosent en temps réel.',
  phyllotaxis:
    "2 500 points stellaires disposés selon l'angle d'or de Fibonacci, seuls les indices premiers s'allument et grandissent. Toutes les trois secondes, une onde de crible passe, les nombres premiers clignotent comme un banc de krill.",
  'ulam-prime':
    "Les 4 096 premiers entiers déroulés sur une double spirale d'Archimède–Sacks ; les nombres premiers deviennent une douce lumière d'or, les jumeaux et les trajectoires du polynôme d'Euler sont enfilés en chaînes rose rouge.",
  hydrogen:
    "Un nuage de points volumétrique échantillonné par rejet des états excités élevés de Schrödinger : lobes positifs en bleu quantique profond, lobes négatifs en rose nébuleuse, électrons ruisselant autour de l'axe selon le moment angulaire — un lotus quantique translucide.",
  kuramoto:
    '600 oscillateurs sphériques lumineux oscillent autour du couplage critique : tantôt ils clignotent en désordre, tantôt toute la foule s’embrase en résonance — une floraison de lucioles des abysses respirant d’un seul souffle.',
  zeta: 'Un jeune gardien patrouillant le léviathan de Riemann : les couleurs de phase de la bande critique suivent arg ζ(s), et les dix premiers zéros non triviaux portent des cœurs blanc pur à haute énergie, en écho au centre du cosmos.',
  dipole:
    'De fins tubes de flux sur trois couches L : 1 200 particules d’aurore spiralent en mouvement de Larmor le long des lignes de champ, ralentissent aux points miroirs nord et sud et éclatent en flashs cyan et violets.',
  'calabi-yau':
    'Une forme candidate pour les six dimensions supplémentaires compactifiées de la théorie des cordes : quatre coordonnées complexes se projettent en continu en 3D à mesure que l’angle α tourne, des surfaces en pétales se repliant en temps réel.',
  klein:
    'La surface fermée non orientable sans intérieur ni extérieur : les méridiens d’énergie basculent sans couture à travers une nappe à une seule face, comme une conque topologique sans limites.',
  'torus-knot':
    'Un nœud fermé enroulé autour d’un tore, classé par des paires d’entiers premiers entre eux (p,q). Des ondes écarlates et bleu électrique se poursuivent dans le tube comme un serpent de mer néon.',
  enneper:
    'Une surface minimale d’ordre k en coordonnées polaires de Weierstrass–Enneper ; son bord bat doucement comme une nageoire pectorale de manta, le film oscillant entre émeraude et bleu ciel.',
  boy: 'Une immersion sans singularité du plan projectif réel en 3D : une coquille à trois lobes luit d’un or chaud sur ses crêtes d’auto-intersection, une membrane rose-violette translucide apparaissant à l’intérieur.',
  dini: 'Un cône hélicoïdal à courbure gaussienne négative constante ; des bandes d’énergie cyan et lavande courent le long des asymptotes et convergent en une aiguille blanche au sommet, comme un nautile lumineux en rotation.',
  'helicoid-catenoid':
    "Une famille isométrique de Bonnet : l'hélicoïde et la caténoïde s'enroulent et se déploient sans étirement, la première forme fondamentale reste inchangée, la couleur respire entre écarlate et or ambré doux.",
  lissajous:
    "Un nœud harmonique fermé tissé de fréquences premières entre elles (3,4,5) ; des ondes cyan et magenta néon courent l'une vers l'autre dans le tube et frappent des flares blanc pur à chaque croisement.",
  roman:
    "Une quartique du plan projectif réel à six points de pincement singuliers ; quatre pétales gonflés passent de l'ambre du couchant au rose écarlate, trois droites doubles s'illuminent d'aiguilles de lumière.",
  costa:
    "Une surface minimale immergée sans auto-intersection, de genre 1 et à trois bouts (un caténoïde, deux plans) ; des films bleu lac et vert menthe blanchissent aux bords de selle, comme une coupe de lumière à trois trous.",
  'mobius-twisted':
    'Un ruban unilatéral non orientable à trois demi-torsions ; deux impulsions lumineuses courent le long du bord et doivent parcourir 4π pour revenir du même côté, magenta et cyan électrique dessinant une boucle sans fin.',
};

const RU: DescriptionMap = {
  lorenz:
    'Упрощённая модель конвекции Лоренца (1963): при σ=10, ρ=28, β=8/3 она вычерчивает знаменитые крылья бабочки — хаос, рождённый детерминированными уравнениями.',
  rossler:
    'Минимальная хаотическая система из трёх нелинейных членов: плоский вихрь медленно свивается, а затем резко вытягивается через складку — медуза из светящихся лент.',
  aizawa:
    'Осесимметричный странный аттрактор, траектории которого пронизывают центральную ось, образуя сферическое плазменное ядро — хаотический морской ёж.',
  thomas:
    'Лабиринтный аттрактор с тройной циклической симметрией; двенадцать начальных траекторий сплетаются в трёх ортогональных направлениях, как медленно шевелящийся пучок индиговых ганглиев.',
  halvorsen:
    'Трёхкрылая спираль вокруг главной диагонали; траектории вытягиваются в широкие ленты текущего света — раскалённо-белое ядро, алые края, словно плазменный звёздный скат.',
  'chen-lee':
    'Северо-южные симметричные двойные магнитные вихри: частицы хаотично прыгают между ледяно-голубыми и кобальтовыми полюсами и вспыхивают чисто-белым при пересечении экватора.',
  dadras:
    'Четыре переплетённых симметричных крыла электрической дуги; индиговые и розовые импульсы несутся по траекториям, как теневой скат, скользящий в дальнем космосе.',
  'abc-flow':
    'Классическое стационарное решение уравнений Эйлера для несжимаемой жидкости: скорость и завихрённость всюду параллельны; тысячи трассеров взбивают хаотическую актинию внутри периодической сферы.',
  mandelbulb:
    'Фрактальный монолит трёхмерной комплексной динамики: степенная итерация в сферических координатах идёт по полю расстояний, тёмно-бирюзовые трещины, флуоресцентно-зелёные вершины — медленно дышащий коралл дальнего космоса.',
  sierpinski:
    'Система итерированных функций из четырёх сжимающих аффинных отображений, четыре уровня рекурсии: 256 микротетраэдров образуют рекурсивную решётку с белым ядром и ледяно-голубыми рёбрами, пульсирующую в темноте.',
  'quaternion-julia':
    'Фрактальное коралловое ядро из кватернионного квадрата, рассечённого в 3D, пока константа c(t) блуждает по малому четырёхмерному кругу — тёмные морско-зелёные долины, неоново-изумрудные гребни, живой рост.',
  apollonian:
    'Рекурсивная пузырчатая актиния из трёхмерной рекурсии Содди–Госсета: около 400 стеклянных сфер, каждая касается соседних, ледяно-голубые по краям и пурпурные у крошечных.',
  'gray-scott':
    'Два химических вещества реагируют и диффундируют на сферической UV-области: тёмно-чернильный зелёный во впадинах, флуоресцентный изумруд и электрический лайм на фронтах роста — самоделящаяся светящаяся клетка.',
  gyroid:
    'Коралловая сфера TPMS с сетью связанных трёхмерных лабиринтных пор; тонкие стенки преломляют электрический циан и чистый белый, а поры органично сжимаются и расширяются.',
  menger:
    'Рекурсивное расширение трёхмерного множества Кантора: решётка третьего порядка 20³ без центров граней и объёма, тысячи микрокубов — живой механический храм, дышащий в пространстве.',
  hopf: 'Четырёхмерная сфера, разложенная на сцепленные волокна-кольца и стереографически спроецированная в 3D; каждое волокно несёт непрерывный спектральный цвет по долготе, белые светящиеся бусины движутся вместе.',
  'cell-24':
    'Самодвойственный правильный политоп, существующий только в четырёх измерениях: 24 вершины и 96 рёбер одновременно вращаются в плоскостях XW и YZ, а спроецированные рёбра изгибаются в изящные гиперболические дуги.',
  'clifford-torus':
    'Плоский минимальный тор, вложенный в 4D единичную сферу. Двухслойные золотисто-оранжевые плёнки и решётки Вилларсо вбирают и выпускают себя при вращении — двойная вращающаяся клетка света.',
  poincare:
    'Модель открытого единичного шара трёхмерного гиперболического пространства: около 300 геодезических встречают граничную сферу под прямым углом и сжимаются в бесконечность — фиолетовые в ядре, холодно-речные на краю.',
  e8: '240 корневых векторов исключительной группы Ли E8 — 112 целых и 128 полуцелых корня образуют самую симметричную звёздную карту в восьми измерениях, 6720 рёбер сплетают золотое кольцо у плоскости Кокстера.',
  quasicrystal:
    'Шестимерная гиперкубическая решётка, срез-проецированная в 3D-физическое и перпендикулярное пространство: принятые точки образуют пятикратную, никогда не повторяющуюся звёздно-кристаллическую сеть; бледно-розовый и небесно-синий мерцают слой за слоем.',
  fourier:
    'Механический планетарий гармоник: четыре золотых кольца, вложенных при ω∈{1,−3,7,−11}, кончик вычерчивает электрически-циановую кривую, которая бледнеет по мере написания.',
  harmonics:
    'Язык форм электронных облаков водорода: лепестки положительной фазы в розовом золоте, отрицательной — в квантовом индиго, узловые плоскости во тьме; два состояния обратимо превращаются в реальном времени.',
  phyllotaxis:
    '2500 звёздных точек, расположенных по фибоначчиеву золотому углу; светятся и укрупняются только простые индексы. Каждые три секунды проходит волна решета, и простые числа мигают, как стая криля.',
  'ulam-prime':
    'Первые 4096 целых чисел, развёрнутых по двойной спирали Архимеда–Сакса; простые числа становятся мягким золотым звёздным светом, а близнецы и траектории полинома Эйлера нанизаны на розово-красные цепочки.',
  hydrogen:
    'Объёмное облако точек высоковозбуждённых состояний уравнения Шрёдингера, полученное отбором: лепестки положительной фазы в глубоком квантовом синем, отрицательной — в туманно-розовом, электроны текут вокруг оси по моменту импульса — прозрачный квантовый лотос.',
  kuramoto:
    '600 светящихся сферических осцилляторов колеблются у критической силы связи: то мигают в беспорядке, то вся группа вспыхивает в резонансе — глубоководное свечение светлячков, дышащее как единое целое.',
  zeta: 'Молодой страж, патрулирующий Левиафана Римана: фазовые цвета критической полосы текут по arg ζ(s), а первые десять нетривиальных нулей несут чисто-белые высокоэнергетические ядра — эхо центра космоса.',
  dipole:
    'Тонкие трубки потока на трёх L-оболочках: 1200 частиц полярного сияния спирально движутся по линиям поля в ларморовском вращении, замедляются у северного и южного зеркальных точек и вспыхивают цианом и фиолетом.',
  'calabi-yau':
    'Форма-кандидат для шести компактифицированных дополнительных измерений теории струн: четыре комплексные координаты непрерывно проецируются в 3D при вращении угла α, лепестковые поверхности складываются в реальном времени.',
  klein:
    'Неориентируемая замкнутая поверхность без внутреннего и внешнего: энергетические меридианы бесшовно переворачиваются через односторонний лист — безграничная топологическая раковина.',
  'torus-knot':
    'Замкнутый узел, навитый на тор и классифицируемый парами взаимно простых целых (p,q). Алые и электрически-синие волны гонятся друг за другом по трубке, как неоновый морской змей.',
  enneper:
    'Минимальная поверхность k-го порядка в полярных координатах Вейерштрасса–Эннепера; её край мягко бьётся, как грудной плавник манты, плёнка переливается изумрудом и небесно-голубым.',
  boy: 'Погружение вещественной проективной плоскости в 3D без особенностей: трёхлопастная раковина теплеет золотом на гребнях самопересечения, внутри просвечивает розово-фиолетовая мембрана.',
  dini: 'Спиральный конус постоянной отрицательной гауссовой кривизны; циановые и лавандовые энергетические полосы бегут по асимптотам и сходятся в чисто-белую иглу на вершине — вращающийся светящийся наутилус.',
  'helicoid-catenoid':
    'Изометрическое семейство Бонне: геликоид и катеноид без растяжения сворачиваются и разворачиваются друг в друга, первая фундаментальная форма неизменна, цвет дышит между алым и мягким золотисто-оранжевым.',
  lissajous:
    'Замкнутый гармонический узел, сплетённый из взаимно простых частот (3,4,5); циановая и неоново-пурпурная волны бегут навстречу по трубке и выбивают чисто-белые вспышки в каждой пространственной точке пересечения.',
  roman:
    'Квартика вещественной проективной плоскости с шестью особыми точками; четыре вздутых лепестка переходят от закатного янтаря к розово-алому, три двойные линии загораются тонкими иглами света.',
  costa:
    'Минимально вложенная поверхность рода 1 с тремя концами (один катеноидный, два плоских); озёрно-синие и мятно-зелёные плёнки белеют у сёдловых краёв — трёхдырчатая чаша света.',
  'mobius-twisted':
    'Односторонняя неориентируемая лента с тремя полуоборотами; пара световых импульсов бежит по краю и должна пройти 4π, чтобы вернуться на ту же сторону, пурпур и электрический циан вычерчивают бесконечную петлю.',
};

export const MODEL_DESCRIPTIONS: Record<Exclude<Locale, 'zh'>, DescriptionMap> = {
  en: EN,
  ja: JA,
  ko: KO,
  de: DE,
  fr: FR,
  ru: RU,
};

export function modelDescription(locale: Locale, modelType: string, fallback: string): string {
  if (locale === 'zh') return fallback;
  return MODEL_DESCRIPTIONS[locale][modelType] ?? fallback;
}
