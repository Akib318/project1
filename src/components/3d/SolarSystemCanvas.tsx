import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CELESTIAL_BODIES, MISSIONS_DATA } from '../../data/missionsData';
import { Mission, CelestialBody } from '../../types/mission';
import { soundManager } from '../../utils/audio';

interface SolarSystemCanvasProps {
  currentFocus: string; // 'solar' | 'sun' | 'earth' | 'moon' | 'mars' | 'jupiter' | 'saturn' ...
  onSelectFocus: (focusId: string) => void;
  onSelectMission: (mission: Mission) => void;
  showFootprints: boolean;
  filterStatus?: 'ALL' | 'MISSION_ENDED' | 'ACTIVE';
  lang?: 'en' | 'bn';
}

// REAL NASA/JPL Photographic Texture URLs (Verified HTTP 200)
const TEXTURE_URLS = {
  sun: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/sunmap.jpg',
  mercury: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/mercurymap.jpg',
  venus: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/venusmap.jpg',
  earth: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  earthNormal: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
  earthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  moon: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
  mars: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/marsmap1k.jpg',
  jupiter: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/jupitermap.jpg',
  saturn: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/saturnmap.jpg',
  saturnRing: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/saturnringcolor.jpg',
  uranus: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/uranusmap.jpg',
  neptune: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/neptunemap.jpg',
};

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  currentFocus,
  onSelectFocus,
  onSelectMission,
  showFootprints,
  filterStatus = 'ALL',
  lang = 'en',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredObject, setHoveredObject] = useState<{
    name: string;
    type: string;
    details?: string;
  } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [marsClickTelemetry, setMarsClickTelemetry] = useState<{ lat: number; lng: number; time: number } | null>(null);

  // References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const reqIdRef = useRef<number | null>(null);

  const planetsMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const markersGroupRef = useRef<THREE.Group>(new THREE.Group());
  const clickableObjectsRef = useRef<THREE.Object3D[]>([]);
  const animatedMeshesRef = useRef<{ mesh: THREE.Mesh; rotSpeed: number; clouds?: THREE.Mesh }[]>([]);

  // Mars Procedural PBR Shader References
  const marsMeshRef = useRef<THREE.Mesh | null>(null);
  const marsUniformsRef = useRef<{ [key: string]: { value: any } } | null>(null);

  // Smooth camera tracking target
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 42, 60));
  const cameraLookAtTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Focus Change handler
  useEffect(() => {
    soundManager.playCameraWarp();
    if (currentFocus === 'solar') {
      cameraTargetPos.current.set(0, 42, 60);
      cameraLookAtTarget.current.set(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
      }
    } else if (currentFocus === 'sun') {
      cameraTargetPos.current.set(0, 5, 12);
      cameraLookAtTarget.current.set(0, 0, 0);
      if (controlsRef.current) controlsRef.current.target.set(0, 0, 0);
    } else {
      const targetGroup = planetsMapRef.current.get(currentFocus);
      if (targetGroup) {
        const bodyRadius =
          currentFocus === 'moon'
            ? 0.5
            : currentFocus === 'jupiter'
            ? 3.0
            : currentFocus === 'saturn'
            ? 2.5
            : currentFocus === 'mars'
            ? 1.0
            : 1.4;

        cameraTargetPos.current.set(
          targetGroup.position.x + bodyRadius * 2.8,
          targetGroup.position.y + bodyRadius * 1.6,
          targetGroup.position.z + bodyRadius * 3.2
        );
        cameraLookAtTarget.current.copy(targetGroup.position);
        if (controlsRef.current) controlsRef.current.target.copy(targetGroup.position);
      }
    }
  }, [currentFocus]);

  // Main Three.js Scene Setup with Real Photographic Textures & Mars PBR Shader
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010409); // Deep dark obsidian space
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
    camera.position.set(0, 42, 60);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls with smooth inertia damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 220.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controlsRef.current = controls;

    // Lighting: Sun acts as primary source casting natural shadows across celestial spheres
    const ambientLight = new THREE.AmbientLight(0x334155, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff7ed, 5.0, 400, 0.45);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const topFill = new THREE.DirectionalLight(0x38bdf8, 0.35);
    topFill.position.set(0, 40, 0);
    scene.add(topFill);

    // Deep Space Starfield
    const starCount = 3200;
    const starGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = THREE.MathUtils.randFloat(180, 450);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      starCoords[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starCoords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starCoords[i * 3 + 2] = r * Math.cos(phi);

      const tint = Math.random();
      if (tint > 0.85) {
        starColors[i * 3] = 0.6; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 1.0;
      } else if (tint < 0.15) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 0.5;
      } else {
        starColors[i * 3] = 0.95; starColors[i * 3 + 1] = 0.95; starColors[i * 3 + 2] = 0.95;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.1, vertexColors: true, transparent: true, opacity: 0.85 })));

    // Dense Asteroid Belt
    const asteroidCount = 3500;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidCoords = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount; i++) {
      const dist = THREE.MathUtils.randFloat(20.5, 24.2);
      const angle = Math.random() * Math.PI * 2;
      asteroidCoords[i * 3] = Math.cos(angle) * dist;
      asteroidCoords[i * 3 + 1] = THREE.MathUtils.randFloatSpread(1.2);
      asteroidCoords[i * 3 + 2] = Math.sin(angle) * dist;
    }
    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidCoords, 3));
    const asteroidBelt = new THREE.Points(
      asteroidGeo,
      new THREE.PointsMaterial({ color: 0xc8cdd5, size: 0.4, transparent: true, opacity: 0.85 })
    );
    scene.add(asteroidBelt);

    // Concentric Orbit Tracks (Clean, bright white rings matching user video)
    const orbitDistances = [6.2, 9.2, 13.0, 17.5, 27.5, 35.0, 43.0, 51.0];
    orbitDistances.forEach((dist) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * dist, 0, Math.sin(theta) * dist));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        linewidth: 1.5,
      });
      scene.add(new THREE.Line(ringGeo, ringMat));
    });

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const planetsMap = new Map<string, THREE.Group>();
    const clickables: THREE.Object3D[] = [];
    const animatedMeshes: { mesh: THREE.Mesh; rotSpeed: number; clouds?: THREE.Mesh }[] = [];

    // Helper to create photographic planet mesh
    const makePlanet = (
      id: string,
      name: string,
      type: string,
      radius: number,
      textureUrl: string,
      normalUrl?: string,
      cloudsUrl?: string
    ) => {
      const group = new THREE.Group();
      const tex = textureLoader.load(textureUrl);

      const matConfig: THREE.MeshStandardMaterialParameters = {
        map: tex,
        roughness: 0.75,
        metalness: 0.1,
      };

      if (normalUrl) {
        matConfig.normalMap = textureLoader.load(normalUrl);
      }

      const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 48), new THREE.MeshStandardMaterial(matConfig));
      group.add(sphereMesh);

      let cloudsMesh: THREE.Mesh | undefined;
      if (cloudsUrl) {
        const cTex = textureLoader.load(cloudsUrl);
        cloudsMesh = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.015, 40, 40),
          new THREE.MeshStandardMaterial({
            map: cTex,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending,
          })
        );
        group.add(cloudsMesh);
      }

      sphereMesh.userData = { id, name, type };
      clickables.push(sphereMesh);
      planetsMap.set(id, group);
      scene.add(group);

      return { group, sphereMesh, cloudsMesh };
    };

    // 1. THE SUN (Fiery boiling magma texture)
    const sunTex = textureLoader.load(TEXTURE_URLS.sun);
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.6, 48, 48),
      new THREE.MeshBasicMaterial({ map: sunTex, color: 0xffe066 })
    );
    const sunCorona = new THREE.Mesh(
      new THREE.SphereGeometry(4.2, 36, 36),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.28,
        side: THREE.BackSide,
      })
    );
    const sunGroup = new THREE.Group();
    sunGroup.add(sunMesh);
    sunGroup.add(sunCorona);
    sunMesh.userData = { id: 'sun', name: lang === 'bn' ? 'সূর্য (The Sun)' : 'The Sun', type: 'Star' };
    clickables.push(sunMesh);
    planetsMap.set('sun', sunGroup);
    scene.add(sunGroup);
    animatedMeshes.push({ mesh: sunMesh, rotSpeed: 0.002 });

    // 2. MERCURY
    const merc = makePlanet('mercury', lang === 'bn' ? 'বুধ গ্রহ (Mercury)' : 'Mercury', 'Terrestrial Planet', 0.55, TEXTURE_URLS.mercury);
    animatedMeshes.push({ mesh: merc.sphereMesh, rotSpeed: 0.004 });

    // 3. VENUS
    const ven = makePlanet('venus', lang === 'bn' ? 'শুক্র গ্রহ (Venus)' : 'Venus', 'Terrestrial Planet', 1.15, TEXTURE_URLS.venus);
    animatedMeshes.push({ mesh: ven.sphereMesh, rotSpeed: -0.002 });

    // 4. EARTH (Photographic NASA 2048x2048 with Normal map & rotating clouds)
    const ear = makePlanet(
      'earth',
      lang === 'bn' ? 'পৃথিবী (Earth)' : 'Earth',
      'Terrestrial Planet',
      1.4,
      TEXTURE_URLS.earth,
      TEXTURE_URLS.earthNormal,
      TEXTURE_URLS.earthClouds
    );
    const earthGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.54, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
      })
    );
    ear.group.add(earthGlow);
    animatedMeshes.push({ mesh: ear.sphereMesh, rotSpeed: 0.009, clouds: ear.cloudsMesh });

    // 5. THE MOON (Photographic lunar regolith texture)
    const moo = makePlanet('moon', lang === 'bn' ? 'চাঁদ (The Moon)' : 'The Moon', 'Natural Satellite', 0.5, TEXTURE_URLS.moon);
    animatedMeshes.push({ mesh: moo.sphereMesh, rotSpeed: 0.003 });

    // ==========================================
    // 6. MARS: HIGH-RESOLUTION PBR PROCEDURAL SURFACE SHADER (Click-Interactive)
    // ==========================================
    const marsGroup = new THREE.Group();
    const marsRadius = 0.95;
    // High tessellation (96x96) for smooth physical seismic displacement waves
    const marsGeo = new THREE.SphereGeometry(marsRadius, 96, 96);

    const marsTex = textureLoader.load(TEXTURE_URLS.mars);

    // Uniforms for PBR Procedural Surface & Click Interaction
    const marsUniforms = {
      uTime: { value: 0.0 },
      uClickPoint: { value: new THREE.Vector3(0, 0, 1) },
      uWaveProgress: { value: 2.0 }, // > 1 means finished/inactive
      uWaveIntensity: { value: 0.0 },
      uHoverPoint: { value: new THREE.Vector3(0, 0, 1) },
      uHoverActive: { value: 0.0 },
    };
    marsUniformsRef.current = marsUniforms;

    const marsPbrMaterial = new THREE.MeshStandardMaterial({
      map: marsTex,
      roughness: 0.78,
      metalness: 0.14,
    });

    marsPbrMaterial.onBeforeCompile = (shader) => {
      // Connect uniforms to Three.js shader pipeline
      shader.uniforms.uTime = marsUniforms.uTime;
      shader.uniforms.uClickPoint = marsUniforms.uClickPoint;
      shader.uniforms.uWaveProgress = marsUniforms.uWaveProgress;
      shader.uniforms.uWaveIntensity = marsUniforms.uWaveIntensity;
      shader.uniforms.uHoverPoint = marsUniforms.uHoverPoint;
      shader.uniforms.uHoverActive = marsUniforms.uHoverActive;

      // Inject Vertex Shader additions
      shader.vertexShader = `
        varying vec3 vMarsLocalPos;
        varying vec3 vMarsWorldPos;
        uniform float uTime;
        uniform vec3 uClickPoint;
        uniform float uWaveProgress;
        uniform float uWaveIntensity;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vMarsLocalPos = position;
        vMarsWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

        // Angular distance on sphere to click point (geodesic distance)
        vec3 normPos = normalize(position);
        float dotVal = clamp(dot(normPos, uClickPoint), -1.0, 1.0);
        float angDist = acos(dotVal);

        // Physical seismic surface displacement wave
        float targetDist = uWaveProgress * 3.14159;
        float distDiff = angDist - targetDist;
        float waveEnv = smoothstep(0.42, 0.0, abs(distDiff)) * uWaveIntensity;
        float seismicDisp = sin(distDiff * 28.0 - uTime * 14.0) * waveEnv * 0.038;

        transformed += normal * seismicDisp;
        `
      );

      // Inject Fragment Shader additions (3D Simplex & fBm Procedural Terrain)
      shader.fragmentShader = `
        varying vec3 vMarsLocalPos;
        varying vec3 vMarsWorldPos;
        uniform float uTime;
        uniform vec3 uClickPoint;
        uniform float uWaveProgress;
        uniform float uWaveIntensity;
        uniform vec3 uHoverPoint;
        uniform float uHoverActive;

        // Simplex 3D Noise GLSL Implementation
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
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
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        float fbm(vec3 p) {
          float f = 0.0;
          f += 0.5000 * snoise(p * 2.2);
          f += 0.2500 * snoise(p * 4.4);
          f += 0.1250 * snoise(p * 8.8);
          f += 0.0625 * snoise(p * 17.6);
          return f;
        }
      ` + shader.fragmentShader;

      // Enhance map_fragment with procedural terrain PBR blending
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        #include <map_fragment>

        // Procedural PBR surface texture details
        float elevation = fbm(vMarsLocalPos * 3.8);
        float fineDust = snoise(vMarsLocalPos * 9.5 + vec3(uTime * 0.02, 0.0, uTime * 0.015));

        // Colors: deep basaltic dark rock and iron-oxide ochre
        vec3 basaltTone = vec3(0.22, 0.09, 0.05);
        vec3 brightRustTone = vec3(0.88, 0.38, 0.16);
        vec3 polarFrostTone = vec3(0.95, 0.98, 1.0);

        // Procedural terrain blending with base photographic map
        diffuseColor.rgb = mix(diffuseColor.rgb, mix(diffuseColor.rgb * 0.75, brightRustTone, elevation * 0.5 + 0.5), 0.38);
        diffuseColor.rgb += fineDust * 0.04;

        // Polar ice cap high albedo
        float polarLat = abs(vMarsLocalPos.y) / 0.95;
        float iceMask = smoothstep(0.79, 0.89, polarLat + elevation * 0.05);
        diffuseColor.rgb = mix(diffuseColor.rgb, polarFrostTone, iceMask * 0.92);
        `
      );

      // Modify roughness in roughnessmap_fragment
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <roughnessmap_fragment>',
        `
        #include <roughnessmap_fragment>
        float pLat = abs(vMarsLocalPos.y) / 0.95;
        float pElev = fbm(vMarsLocalPos * 3.8);
        float pIce = smoothstep(0.79, 0.89, pLat + pElev * 0.05);

        // Polar ice is specular/reflective (roughness 0.2), rocky highlands 0.85
        roughnessFactor = mix(roughnessFactor, 0.22, pIce);
        roughnessFactor = mix(roughnessFactor, 0.62, smoothstep(-0.2, 0.3, pElev));
        `
      );

      // Add click response shockwave and holographic telemetry in emissivemap_fragment
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `
        #include <emissivemap_fragment>

        // Normalized surface vector
        vec3 normSrf = normalize(vMarsLocalPos);

        // 1. CLICK SEISMIC SHOCKWAVE & TELEMETRY RIPPLE RINGS
        float cDist = acos(clamp(dot(normSrf, uClickPoint), -1.0, 1.0));
        float currentWave = uWaveProgress * 3.14159;
        float waveDistDiff = abs(cDist - currentWave);

        // Multi-tier concentric radar wavefronts
        float primaryShock = smoothstep(0.09, 0.0, waveDistDiff);
        float echoWave1 = smoothstep(0.06, 0.0, abs(cDist - (currentWave - 0.28)));
        float echoWave2 = smoothstep(0.04, 0.0, abs(cDist - (currentWave - 0.56)));

        // High-frequency interference scanlines
        float scanlines = sin((cDist - currentWave) * 60.0) * 0.5 + 0.5;
        float scanWindow = smoothstep(0.45, 0.0, waveDistDiff);
        float fineRipples = scanlines * scanWindow;

        float waveSum = (primaryShock * 2.4 + echoWave1 * 1.2 + echoWave2 * 0.75 + fineRipples * 0.85) * uWaveIntensity;

        // Color transition from golden amber core to cyan telemetry edge
        vec3 telemetryColor = mix(vec3(0.05, 0.85, 1.0), vec3(1.0, 0.62, 0.15), sin(cDist * 6.0 - uTime * 4.0) * 0.5 + 0.5);

        // Epicenter flash
        float epicenter = smoothstep(0.14, 0.0, cDist) * uWaveIntensity * max(0.0, 1.0 - uWaveProgress * 2.2);
        vec3 flashColor = vec3(0.4, 0.95, 1.0) * 3.5;

        // 2. HOVER SCANNER TARGETING RETICLE
        float hDist = acos(clamp(dot(normSrf, uHoverPoint), -1.0, 1.0));
        float reticleRing = smoothstep(0.04, 0.03, hDist) * smoothstep(0.02, 0.03, hDist);
        float reticleDot = smoothstep(0.012, 0.0, hDist);
        vec3 hoverReticle = vec3(0.08, 0.82, 1.0) * (reticleRing * 2.8 + reticleDot * 3.2) * uHoverActive;

        // Inject into emissive radiance
        totalEmissiveRadiance += (telemetryColor * waveSum) + (flashColor * epicenter) + hoverReticle;
        `
      );
    };

    const marsMesh = new THREE.Mesh(marsGeo, marsPbrMaterial);
    marsGroup.add(marsMesh);
    marsMeshRef.current = marsMesh;

    // Glowing Martian Atmosphere rim
    const marsGlow = new THREE.Mesh(
      new THREE.SphereGeometry(marsRadius * 1.075, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
      })
    );
    marsGroup.add(marsGlow);

    marsMesh.userData = { id: 'mars', name: lang === 'bn' ? 'মঙ্গল গ্রহ (Mars)' : 'Mars', type: 'Terrestrial Planet' };
    clickables.push(marsMesh);
    planetsMap.set('mars', marsGroup);
    scene.add(marsGroup);
    animatedMeshes.push({ mesh: marsMesh, rotSpeed: 0.008 });

    // 7. JUPITER (Photographic storm bands & Great Red Spot)
    const jup = makePlanet('jupiter', lang === 'bn' ? 'বৃহস্পতি গ্রহ (Jupiter)' : 'Jupiter', 'Gas Giant', 2.8, TEXTURE_URLS.jupiter);
    animatedMeshes.push({ mesh: jup.sphereMesh, rotSpeed: 0.016 });

    // 8. SATURN (Photographic body + realistic tilted Cassini ring disc)
    const sat = makePlanet('saturn', lang === 'bn' ? 'শনি গ্রহ (Saturn)' : 'Saturn', 'Gas Giant', 2.3, TEXTURE_URLS.saturn);
    const ringTex = textureLoader.load(TEXTURE_URLS.saturnRing);
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 5.4, 64),
      new THREE.MeshStandardMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.94,
        roughness: 0.65,
      })
    );
    ringMesh.rotation.x = Math.PI / 2 + 0.38; // Tilted ring
    sat.group.add(ringMesh);
    animatedMeshes.push({ mesh: sat.sphereMesh, rotSpeed: 0.014 });

    // 9. URANUS
    const ura = makePlanet('uranus', lang === 'bn' ? 'ইউরেনাস গ্রহ (Uranus)' : 'Uranus', 'Ice Giant', 1.6, TEXTURE_URLS.uranus);
    animatedMeshes.push({ mesh: ura.sphereMesh, rotSpeed: 0.011 });

    // 10. NEPTUNE
    const nep = makePlanet('neptune', lang === 'bn' ? 'নেপচুন গ্রহ (Neptune)' : 'Neptune', 'Ice Giant', 1.5, TEXTURE_URLS.neptune);
    animatedMeshes.push({ mesh: nep.sphereMesh, rotSpeed: 0.01 });

    // Surface Landing Sites Markers
    scene.add(markersGroupRef.current);

    planetsMapRef.current = planetsMap;
    clickableObjectsRef.current = clickables;
    animatedMeshesRef.current = animatedMeshes;

    // Raycast Interaction
    const dom = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check markers first
      const markerHits = raycaster.intersectObjects(markersGroupRef.current.children, true);
      if (markerHits.length > 0) {
        const hit = markerHits[0].object;
        if (hit.userData?.mission) {
          setHoveredObject({
            name: hit.userData.name,
            type: hit.userData.type || 'Spacecraft',
            details: hit.userData.details,
          });
          dom.style.cursor = 'pointer';
          return;
        }
      }

      // Check Mars hover targeting
      if (marsMeshRef.current && marsUniformsRef.current) {
        const marsRayHits = raycaster.intersectObject(marsMeshRef.current, false);
        if (marsRayHits.length > 0) {
          const localHover = marsMeshRef.current.worldToLocal(marsRayHits[0].point.clone()).normalize();
          marsUniformsRef.current.uHoverPoint.value.copy(localHover);
          marsUniformsRef.current.uHoverActive.value = 1.0;
        } else {
          marsUniformsRef.current.uHoverActive.value = 0.0;
        }
      }

      // Check planets hover
      const planetHits = raycaster.intersectObjects(clickableObjectsRef.current, false);
      if (planetHits.length > 0) {
        const p = planetHits[0].object;
        setHoveredObject({
          name: p.userData.name,
          type: p.userData.type,
          details: p.userData.id === 'mars'
            ? (lang === 'bn' ? 'ক্লিক করে সিসমিক শকওয়েভ রিডআউট দেখুন' : 'Click to trigger Seismic Radar Shockwave')
            : (lang === 'bn' ? 'জুম করে দেখতে ক্লিক করুন' : 'Click to Focus Planetary Surface'),
        });
        dom.style.cursor = 'pointer';
        return;
      }

      setHoveredObject(null);
      dom.style.cursor = 'grab';
    };

    const onClick = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // 1. Landing Site Markers Click
      const markerHits = raycaster.intersectObjects(markersGroupRef.current.children, true);
      if (markerHits.length > 0) {
        const topHit = markerHits[0].object;
        if (topHit.userData?.mission) {
          soundManager.playHotspotClick();
          onSelectMission(topHit.userData.mission);
          return;
        }
      }

      // 2. Mars Sphere Specific Click Interaction
      if (marsMeshRef.current) {
        const marsHits = raycaster.intersectObject(marsMeshRef.current, false);
        if (marsHits.length > 0) {
          const localHit = marsMeshRef.current.worldToLocal(marsHits[0].point.clone()).normalize();
          if (marsUniformsRef.current) {
            marsUniformsRef.current.uClickPoint.value.copy(localHit);
            marsUniformsRef.current.uWaveProgress.value = 0.0;
            marsUniformsRef.current.uWaveIntensity.value = 1.0;
          }

          // Calculate latitude & longitude of the impact
          const lat = Math.asin(localHit.y) * (180 / Math.PI);
          const lng = Math.atan2(localHit.z, localHit.x) * (180 / Math.PI);
          setMarsClickTelemetry({ lat, lng, time: Date.now() });

          soundManager.playRadarPing();

          if (currentFocus !== 'mars') {
            onSelectFocus('mars');
          }
          return;
        }
      }

      // 3. Other Planets Click
      const planetHits = raycaster.intersectObjects(clickableObjectsRef.current, false);
      if (planetHits.length > 0) {
        const hitPlanet = planetHits[0].object;
        if (hitPlanet.userData?.id) {
          soundManager.playRadarPing();
          onSelectFocus(hitPlanet.userData.id);
        }
      }
    };

    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('click', onClick);

    // Animation Loop
    let clock = new THREE.Clock();
    const angles = {
      mercury: 0.2,
      venus: 1.1,
      earth: 0.5,
      moon: 0.8,
      mars: 2.3,
      jupiter: 4.1,
      saturn: 5.2,
      uranus: 1.8,
      neptune: 3.4,
    };

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const speed = isPaused ? 0 : orbitSpeed * 0.45;

      // Update Mars Procedural Shader Uniforms
      if (marsUniformsRef.current) {
        marsUniformsRef.current.uTime.value = elapsedTime;
        if (marsUniformsRef.current.uWaveIntensity.value > 0.001) {
          // Progress wave across sphere in ~2.2 seconds
          marsUniformsRef.current.uWaveProgress.value += delta * 0.58;
          marsUniformsRef.current.uWaveIntensity.value = Math.max(
            0.0,
            1.0 - marsUniformsRef.current.uWaveProgress.value * 0.45
          );
        }
      }

      // Axial Rotations
      animatedMeshes.forEach((item) => {
        item.mesh.rotation.y += item.rotSpeed * (isPaused ? 0 : 1);
        if (item.clouds) {
          item.clouds.rotation.y += item.rotSpeed * 1.35 * (isPaused ? 0 : 1);
        }
      });

      // Slowly rotate Asteroid Belt
      asteroidBelt.rotation.y += 0.0008 * speed;

      // Orbit Angles
      angles.mercury += 0.12 * speed * delta;
      angles.venus += 0.08 * speed * delta;
      angles.earth += 0.05 * speed * delta;
      angles.moon += 0.28 * speed * delta;
      angles.mars += 0.038 * speed * delta;
      angles.jupiter += 0.015 * speed * delta;
      angles.saturn += 0.011 * speed * delta;
      angles.uranus += 0.007 * speed * delta;
      angles.neptune += 0.005 * speed * delta;

      const updatePos = (key: string, dist: number, angle: number) => {
        const grp = planetsMap.get(key);
        if (grp) {
          grp.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
        }
      };

      updatePos('mercury', 6.2, angles.mercury);
      updatePos('venus', 9.2, angles.venus);
      updatePos('earth', 13.0, angles.earth);
      updatePos('mars', 17.5, angles.mars);
      updatePos('jupiter', 27.5, angles.jupiter);
      updatePos('saturn', 35.0, angles.saturn);
      updatePos('uranus', 43.0, angles.uranus);
      updatePos('neptune', 51.0, angles.neptune);

      // Moon orbits Earth
      const earthGrp = planetsMap.get('earth');
      const moonGrp = planetsMap.get('moon');
      if (earthGrp && moonGrp) {
        moonGrp.position.set(
          earthGrp.position.x + Math.cos(angles.moon) * 2.2,
          Math.sin(angles.moon) * 0.35,
          earthGrp.position.z + Math.sin(angles.moon) * 2.2
        );
      }

      controls.update();

      // Camera Lerp tracking when focused
      if (currentFocus !== 'solar') {
        const targetBody = planetsMap.get(currentFocus);
        if (targetBody) {
          controls.target.lerp(targetBody.position, 0.05);
        }
      }

      // Rotate markers to face camera
      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach((m) => {
          m.quaternion.copy(camera.quaternion);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('click', onClick);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Surface Landing Site Markers
  useEffect(() => {
    const markersGroup = markersGroupRef.current;
    const planetsMap = planetsMapRef.current;
    if (!markersGroup) return;

    while (markersGroup.children.length > 0) {
      markersGroup.remove(markersGroup.children[0]);
    }

    const shouldRender = currentFocus !== 'solar' && currentFocus !== 'sun';
    if (!shouldRender && !showFootprints) return;

    const filtered = MISSIONS_DATA.filter((m) => {
      if (filterStatus === 'MISSION_ENDED' && m.status !== 'MISSION_ENDED' && m.status !== 'HISTORIC_RELIC') return false;
      if (filterStatus === 'ACTIVE' && m.status !== 'ACTIVE') return false;
      if (currentFocus === 'mars' && m.destination !== 'MARS') return false;
      if (currentFocus === 'moon' && m.destination !== 'MOON') return false;
      if (currentFocus === 'earth' && m.destination !== 'EARTH') return false;
      return true;
    });

    filtered.forEach((mission) => {
      let parentKey = mission.destination.toLowerCase();
      const parentGroup = planetsMap.get(parentKey);
      if (!parentGroup) return;

      const bodyRadius = parentKey === 'moon' ? 0.5 : parentKey === 'mars' ? 0.95 : 1.4;
      const phi = (90 - mission.location.lat) * (Math.PI / 180);
      const theta = (mission.location.lng + 180) * (Math.PI / 180);

      const dist = bodyRadius * 1.06;
      const x = -dist * Math.sin(phi) * Math.cos(theta);
      const y = dist * Math.cos(phi);
      const z = dist * Math.sin(phi) * Math.sin(theta);

      const markerNode = new THREE.Group();
      markerNode.position.set(
        parentGroup.position.x + x,
        parentGroup.position.y + y,
        parentGroup.position.z + z
      );

      const isEnded = mission.status === 'MISSION_ENDED';
      const isRelic = mission.status === 'HISTORIC_RELIC';
      const color = isEnded ? 0xf59e0b : isRelic ? 0x38bdf8 : 0x10b981;

      // Glowing Center Pin
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );

      // Radar Wave Ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.12, 0.16, 24),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );

      markerNode.add(pin);
      markerNode.add(ring);

      pin.userData = {
        name: mission.name,
        type: mission.type,
        details: `${mission.statusLabel} • ${mission.location.regionName}`,
        mission: mission,
      };
      ring.userData = pin.userData;

      markersGroup.add(markerNode);
    });
  }, [currentFocus, showFootprints, filterStatus]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Futuristic Telemetry HUD (Fixed positioning, zero-overlap) */}
      <div className="absolute top-4 left-6 pointer-events-none z-10 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{lang === 'bn' ? 'অরবিটাল টেলিমেট্রি' : 'Orbital Telemetry Stream'}</span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400 font-bold">{currentFocus.toUpperCase()}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
          {currentFocus === 'solar'
            ? lang === 'bn' ? 'সৌরজগত অন্বেষণ' : '3D Solar System'
            : currentFocus === 'earth'
            ? lang === 'bn' ? 'পৃথিবী ও আন্তর্জাতিক মহাকাশ স্টেশন' : 'Earth & Orbital Infrastructure'
            : currentFocus === 'moon'
            ? lang === 'bn' ? 'চন্দ্রপৃষ্ঠ ও অ্যাপোলো পদচিহ্ন' : 'The Moon & Apollo Relics'
            : currentFocus === 'mars'
            ? lang === 'bn' ? 'মঙ্গল গ্রহ ও রোভারদের সমাধি' : 'Mars Surface & Rover Monuments'
            : currentFocus === 'jupiter'
            ? lang === 'bn' ? 'বৃহস্পতি গ্রহ' : 'Jupiter & Storm Bands'
            : currentFocus === 'saturn'
            ? lang === 'bn' ? 'শনি গ্রহ ও বলয়' : 'Saturn & Majestic Rings'
            : currentFocus.toUpperCase()}
        </h2>
      </div>

      {/* Mars Interactive Click Telemetry Callout */}
      {marsClickTelemetry && Date.now() - marsClickTelemetry.time < 5000 && (
        <div className="absolute top-20 right-6 z-20 pointer-events-none bg-slate-950/90 backdrop-blur-xl border border-amber-500/60 rounded-xl p-3 shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
              {lang === 'bn' ? 'মার্স সিসমিক শকওয়েভ সক্রিয়' : 'MARS SEISMIC SCANWAVE ACTIVE'}
            </div>
            <div className="text-xs font-bold text-white font-mono">
              EPICENTER: {marsClickTelemetry.lat.toFixed(1)}° Lat, {marsClickTelemetry.lng.toFixed(1)}° Lng
            </div>
            <div className="text-[10px] text-cyan-300 font-mono">
              {lang === 'bn' ? 'পৃষ্ঠতল স্থানচ্যুতি ও রাডার তরঙ্গ প্রবাহিত হচ্ছে...' : 'PBR Surface Displaced • Holographic Echo Wavefront Propagating'}
            </div>
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredObject && (
        <div className="absolute pointer-events-none z-20 bottom-24 left-1/2 -translate-x-1/2 bg-slate-950/95 backdrop-blur-xl border border-cyan-500/50 rounded-xl px-4 py-2.5 shadow-2xl text-center flex flex-col items-center gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono">
            {hoveredObject.type}
          </span>
          <span className="text-sm font-bold text-white font-heading">
            {hoveredObject.name}
          </span>
          {hoveredObject.details && (
            <span className="text-xs text-slate-300 font-mono mt-0.5">
              {hoveredObject.details}
            </span>
          )}
          <span className="text-[10px] text-amber-300 mt-1 uppercase tracking-wider font-mono">
            {lang === 'bn' ? 'টেলিমেট্রি পরিদর্শনে ক্লিক করুন' : 'Click to Inspect Orbit & Surface'}
          </span>
        </div>
      )}

      {/* Bottom Right Controls */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 shadow-xl">
        {currentFocus !== 'solar' && (
          <button
            onClick={() => {
              soundManager.playRadarPing();
              onSelectFocus('solar');
            }}
            className="px-3 py-1.5 text-xs font-mono text-cyan-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            ⟲ {lang === 'bn' ? 'সৌরজগত' : 'Solar System'}
          </button>
        )}

        <button
          onClick={() => setIsPaused((p) => !p)}
          className="px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>

        <button
          onClick={() => setOrbitSpeed((s) => (s === 1 ? 2.5 : s === 2.5 ? 5 : 1))}
          className="px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          {orbitSpeed}× {lang === 'bn' ? 'গতি' : 'Speed'}
        </button>
      </div>
    </div>
  );
};
