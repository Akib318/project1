export interface TechEvolutionRover {
  id: string;
  name: string;
  year: number;
  massKg: number;
  dimensions: string;
  powerSource: string;
  powerWatts: number;
  topSpeedMph: number;
  totalDistanceTraversed: string;
  operationalLifetime: string;
  computerSpecs: string;
  sciencePayloadKg: number;
  signatureBreakthrough: string;
  currentStatus: string;
}

export interface EraItem {
  id: string;
  era: string;
  period: string;
  title: string;
  summary: string;
  featuredHardware: string[];
  scientificMilestone: string;
  hardwareLeftBehindKg: string;
}

export const ROVER_EVOLUTION_DATA: TechEvolutionRover[] = [
  {
    id: 'sojourner',
    name: 'Sojourner (Mars Pathfinder)',
    year: 1997,
    massKg: 11.5,
    dimensions: '65 × 48 × 30 cm (Microwave-sized)',
    powerSource: 'Solar (0.22 m²) + Non-rechargeable Lithium Battery',
    powerWatts: 16,
    topSpeedMph: 0.02,
    totalDistanceTraversed: '100 meters (330 ft)',
    operationalLifetime: '83 Sols (Designed for 7 sols)',
    computerSpecs: '8-bit Intel 80C85 processor @ 2 MHz, 64 KB RAM',
    sciencePayloadKg: 1.0,
    signatureBreakthrough: 'First wheeled rover on another planet; proved the Rocker-Bogie suspension concept.',
    currentStatus: 'Resting beside the Carl Sagan Memorial Station at Ares Vallis, Mars.',
  },
  {
    id: 'mer_opp',
    name: 'Spirit & Opportunity (MER)',
    year: 2003,
    massKg: 185,
    dimensions: '1.6 × 2.3 × 1.5 m (Golf-cart sized)',
    powerSource: 'Triple-Junction GaAs Solar Arrays (1.3 m²)',
    powerWatts: 140,
    topSpeedMph: 0.11,
    totalDistanceTraversed: '45.16 km (Opportunity record)',
    operationalLifetime: 'Opportunity: 5,111 Sols / Spirit: 2,210 Sols',
    computerSpecs: '32-bit RAD6000 @ 20 MHz, 128 MB RAM, 256 MB Flash',
    sciencePayloadKg: 5.0,
    signatureBreakthrough: 'Proved past liquid surface water on Mars; pioneered autonomous hazard avoidance.',
    currentStatus: 'Opportunity silent in Endeavour Crater; Spirit silent in Gusev Crater.',
  },
  {
    id: 'curiosity',
    name: 'Curiosity (Mars Science Laboratory)',
    year: 2011,
    massKg: 899,
    dimensions: '3.0 × 2.7 × 2.2 m (SUV-sized)',
    powerSource: 'Multi-Mission Radioisotope Thermoelectric Generator (Plutonium-238)',
    powerWatts: 110,
    topSpeedMph: 0.09,
    totalDistanceTraversed: '33+ km (Ongoing)',
    operationalLifetime: '4,400+ Sols (Active since Aug 2012)',
    computerSpecs: 'RAD750 PowerPC @ 200 MHz, 256 MB RAM, 2 GB Flash',
    sciencePayloadKg: 75.0,
    signatureBreakthrough: 'Discovered ancient freshwater lake environment with organic carbon building blocks of life.',
    currentStatus: 'Actively climbing Mount Sharp in Gale Crater.',
  },
  {
    id: 'perseverance',
    name: 'Perseverance (Mars 2020)',
    year: 2020,
    massKg: 1025,
    dimensions: '3.0 × 2.7 × 2.2 m (Heaviest rover in history)',
    powerSource: 'MMRTG Nuclear Generator + Lithium-ion buffer batteries',
    powerWatts: 110,
    topSpeedMph: 0.09,
    totalDistanceTraversed: '26+ km (Ongoing)',
    operationalLifetime: '1,600+ Sols (Active)',
    computerSpecs: 'Dual redundant RAD750 @ 200 MHz, dedicated FPGA co-processors for vision',
    sciencePayloadKg: 88.0,
    signatureBreakthrough: 'MOXIE oxygen extraction; sample caching for Earth return; Ingenuity aerial scout.',
    currentStatus: 'Actively surveying the ancient river delta rim in Jezero Crater.',
  },
];

export const SPACE_ERAS_DATA: EraItem[] = [
  {
    id: 'era-1960',
    era: '1960s',
    period: '1960 – 1969',
    title: 'The Lunar Leap & First Alien Ground',
    summary: 'Driven by the Apollo program and Surveyor robotic scouts, humanity achieved soft landings and first human footsteps beyond Earth.',
    featuredHardware: ['Surveyor 3', 'Apollo 11 Eagle', 'Luna 9', 'Apollo 12'],
    scientificMilestone: 'Confirmed lunar soil bearing strength, returned first lunar basalt rocks, deployed laser retroreflectors.',
    hardwareLeftBehindKg: '~35,000 kg on the Moon',
  },
  {
    id: 'era-1970',
    era: '1970s',
    period: '1970 – 1979',
    title: 'The Grand Tour & Martian Touchdowns',
    summary: 'Apollo astronauts drove the first cars on the Moon (LRVs), while robotic Viking landers touched down on Mars and Voyager probes left for deep space.',
    featuredHardware: ['Apollo 15 & 17 LRVs', 'Viking 1 & 2 Landers', 'Voyager 1 & 2', 'Pioneer 10 & 11'],
    scientificMilestone: 'First surface weather recordings and panoramic color views from Mars; discovered Jovian active volcanoes.',
    hardwareLeftBehindKg: '~150,000 kg on the Moon & Mars',
  },
  {
    id: 'era-1990',
    era: '1990s',
    period: '1990 – 1999',
    title: 'The Mobility Revolution & Orbital Giants',
    summary: 'The microwave-sized Sojourner rover proved robotic mobility on Mars, while the Hubble Space Telescope and ISS began construction.',
    featuredHardware: ['Mars Pathfinder / Sojourner', 'Hubble Space Telescope', 'ISS Zarya Module', 'Galileo Probe'],
    scientificMilestone: 'Demonstrated micro-robotic planetary traverse; verified cosmic expansion rate via Hubble.',
    hardwareLeftBehindKg: '~450,000 kg in Orbit and Surfaces',
  },
  {
    id: 'era-2000',
    era: '2000s',
    period: '2000 – 2009',
    title: 'The Marathon Explorers',
    summary: 'Twin rovers Spirit and Opportunity landed on Mars, surviving years beyond their warranties and discovering ancient liquid water evidence.',
    featuredHardware: ['Spirit (MER-A)', 'Opportunity (MER-B)', 'Phoenix Mars Lander', 'Kepler Observatory'],
    scientificMilestone: 'Discovered Martian hematite "blueberries" and pure hydrothermal silica; Arctic water ice confirmed by Phoenix.',
    hardwareLeftBehindKg: '~520,000 kg total human hardware in space',
  },
  {
    id: 'era-2010',
    era: '2010s',
    period: '2010 – 2019',
    title: 'Nuclear Power, Marsquakes & Exoplanets',
    summary: 'Curiosity deployed a chemistry lab on Mars; InSight listened to planetary interiors; Kepler confirmed thousands of alien worlds.',
    featuredHardware: ['Curiosity (MSL)', 'InSight Lander', 'Kepler Space Telescope', 'LRO', 'Dawn at Ceres'],
    scientificMilestone: 'Proved ancient Martian habitability; mapped Martian molten liquid core; found exoplanets outnumber stars.',
    hardwareLeftBehindKg: '~580,000 kg total across solar system',
  },
  {
    id: 'era-2020',
    era: '2020s+',
    period: '2020 – 2026',
    title: 'The Heritage, Aerial Flight & Sample Caching Era',
    summary: 'Ingenuity flew in Martian skies; Perseverance cached rock cores; Artemis paves the return to the Moon alongside private and international landers.',
    featuredHardware: ['Perseverance & Ingenuity', 'James Webb Space Telescope', 'Chandrayaan-3', 'SLIM Lander'],
    scientificMilestone: 'Extraterrestrial powered flight (72 flights); in-situ oxygen generation; direct imaging of primordial galaxies.',
    hardwareLeftBehindKg: '> 600,000 kg of human technology preserved as heritage',
  },
];
