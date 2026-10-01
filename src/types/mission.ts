export type HardwareStatus = 'ACTIVE' | 'MISSION_ENDED' | 'HISTORIC_RELIC';

export type Destination = 'MARS' | 'MOON' | 'EARTH' | 'DEEP_SPACE';

export type MissionType = 'ROVER' | 'LANDER' | 'ORBITER' | 'SPACE_STATION' | 'CREWED_DESCENT' | 'PROBE';

export interface TimelineEvent {
  id: string;
  phase: 'LAUNCH' | 'CRUISE' | 'LANDING' | 'EXPLORATION' | 'DISCOVERY' | 'CHALLENGE' | 'MISSION_END' | 'LEGACY';
  title: string;
  date: string;
  description: string;
  significance: string;
  image?: string;
  badgeLabel?: string;
}

export interface HardwareComponent {
  id: string;
  name: string;
  category: 'SCIENCE' | 'POWER' | 'COMMUNICATION' | 'MOBILITY' | 'IMAGING' | 'ENVIRONMENT';
  position3D: [number, number, number]; // 3D coordinates for interactive inspection hotspots
  whatIsIt: string;
  whyNeeded: string;
  howItWorks: string;
  missionRole: string;
}

export interface ThenVsNow {
  thenTitle: string;
  thenDescription: string;
  nowTitle: string;
  nowDescription: string;
  whatRemains: string[];
  endReason?: string;
}

export interface MissionMedia {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  credit: string;
  sourceUrl: string;
}

export interface MissionSource {
  name: string;
  url: string;
  institution: string;
}

export interface Mission {
  id: string;
  name: string;
  callsign: string;
  destination: Destination;
  type: MissionType;
  status: HardwareStatus;
  statusLabel: string;
  agency: string;
  launchDate: string;
  landingDate: string;
  missionEndDate?: string;
  operationalDuration: string;
  location: {
    regionName: string;
    coordinatesText: string;
    lat: number;
    lng: number; // For plotting on 3D planetary sphere
  };
  headline: string;
  modelUrl?: string; // Official NASA GLTF/GLB 3D model
  objective: string;
  summary: string;
  whyEnded?: string;
  scientificDiscoveries: string[];
  missionLegacy: string[];
  thenVsNow: ThenVsNow;
  components: HardwareComponent[];
  timeline: TimelineEvent[];
  media: MissionMedia[];
  sources: MissionSource[];
  latestUpdate: {
    date: string;
    text: string;
    verifiedSource: string;
  };
}

export interface CelestialBody {
  id: string;
  name: string;
  subtitle: string;
  type: 'star' | 'planet' | 'moon';
  radius: number;
  orbitDistance: number;
  orbitSpeed: number;
  color: string;
  emissive?: string;
  description: string;
  hardwareCount: number;
  endedMissionsCount: number;
  activeMissionsCount: number;
}
