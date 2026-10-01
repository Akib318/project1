export interface QuizQuestion {
  id: string;
  question: string;
  category: 'MARS' | 'MOON' | 'DEEP_SPACE' | 'ENGINEERING';
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedMissionId: string;
}

export interface ExplorerBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedByDefault?: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Why did the Opportunity rover’s mission finally conclude in 2018–2019 after 14.5 years?',
    category: 'MARS',
    options: [
      'It drove into an inescapable deep chasm in Victoria Crater.',
      'A planet-encircling dust storm blocked sunlight from reaching its solar arrays.',
      'Its radioactive plutonium fuel core naturally decayed to zero.',
      'Its computer memory suffered a permanent cosmic ray bitflip.',
    ],
    correctIndex: 1,
    explanation: 'In June 2018, a catastrophic global dust storm spiked atmospheric opacity (tau) above 10.8, cutting solar illumination by >99% and draining the batteries before thermal heaters could keep the rover alive.',
    relatedMissionId: 'opportunity',
  },
  {
    id: 'q2',
    question: 'What is the ONLY scientific instrument left by Apollo 11 that is still used to collect data from Earth today?',
    category: 'MOON',
    options: [
      'The Solar Wind Composition foil experiment',
      'The Lunar Module ascent stage radio transmitter',
      'The Laser Ranging Retroreflector (LRRR)',
      'The Early Apollo Passive Seismometer',
    ],
    correctIndex: 2,
    explanation: 'The 100-prism Laser Ranging Retroreflector requires no electrical power. Earth observatories still bounce laser pulses off it today to measure the Earth-Moon distance with millimeter precision.',
    relatedMissionId: 'apollo11',
  },
  {
    id: 'q3',
    question: 'How did NASA JPL engineers clean dust off InSight’s solar panels when it had no mechanical wipers or blowers?',
    category: 'ENGINEERING',
    options: [
      'They rapidly tilted the lander legs using internal hydraulic jacks.',
      'They trickled coarse sand into the wind upwind of the solar panels to scour off fine dust.',
      'They spun the robotic arm at high speed to create a mini-tornado.',
      'They blasted residual hydrazine thruster exhaust over the panels.',
    ],
    correctIndex: 1,
    explanation: 'Using the robotic scoop, engineers dropped coarse sand during breezy sols. The saltating granules bounced across the solar panels, dislodging the clingy electrostatic fine dust and restoring 30 Wh/day!',
    relatedMissionId: 'insight',
  },
  {
    id: 'q4',
    question: 'What geological feature discovered by Opportunity proved that liquid water once flowed across ancient Mars?',
    category: 'MARS',
    options: [
      'Active geysers spewing liquid nitrogen',
      'Hematite mineral concretions nicknamed "blueberries"',
      'Fossilized coral reef structures',
      'Giant subterranean limestone caverns',
    ],
    correctIndex: 1,
    explanation: 'Opportunity discovered microscopic hematite spherules nicknamed "blueberries" embedded in sedimentary rock layers, which can only form when groundwater percolates through mineral-rich rock.',
    relatedMissionId: 'opportunity',
  },
  {
    id: 'q5',
    question: 'Why was the Apollo 15 Lunar Roving Vehicle parked 90 meters away from the Lunar Module at the end of the mission?',
    category: 'MOON',
    options: [
      'To prevent the rover’s batteries from overheating the landing module',
      'Because its steering gear jammed while driving back',
      'So its ground-controlled color TV camera could film the Lunar Module ascent liftoff',
      'To comply with lunar quarantine protocols',
    ],
    correctIndex: 2,
    explanation: 'Commander Dave Scott intentionally parked the rover at the "VIP site" so flight controllers in Houston could remotely operate the camera to broadcast the ascent stage blasting off into orbit.',
    relatedMissionId: 'apollo15_lrv',
  },
  {
    id: 'q6',
    question: 'Why did the Kepler Space Telescope mission end in October 2018?',
    category: 'DEEP_SPACE',
    options: [
      'It crashed into an exoplanet in the habitable zone.',
      'It exhausted its onboard hydrazine fuel needed for thruster pointing.',
      'Its 95-megapixel camera sensor degraded from cosmic radiation.',
      'Its communication antenna was severed by a micrometeoroid.',
    ],
    correctIndex: 1,
    explanation: 'Kepler exhausted its hydrazine fuel tanks after 9.6 years of pointing at 500,000+ stars, leaving it drifting silently in an Earth-trailing orbit around the Sun.',
    relatedMissionId: 'kepler',
  },
];

export const EXPLORER_BADGES: ExplorerBadge[] = [
  {
    id: 'badge-tourist',
    title: 'Solar Explorer',
    description: 'Entered the 3D Solar System observatory and navigated interplanetary space.',
    iconName: 'Globe',
    unlockedByDefault: true,
  },
  {
    id: 'badge-cartographer',
    title: 'Planetary Cartographer',
    description: 'Surveyed the surface hardware locations on Earth, Moon, and Mars.',
    iconName: 'Compass',
  },
  {
    id: 'badge-rover-spec',
    title: 'Robotics Specialist',
    description: 'Inspected 3D hardware components and analyzed rover subsystem engineering.',
    iconName: 'Cpu',
  },
  {
    id: 'badge-flight-director',
    title: 'Mission Flight Director',
    description: 'Executed an emergency command strategy in the Mission Control Simulator.',
    iconName: 'Sliders',
  },
  {
    id: 'badge-heritage-guardian',
    title: 'Heritage Guardian',
    description: 'Discovered the resting monuments and scientific legacies of ended space missions.',
    iconName: 'Award',
  },
];
