export interface SimulationChoice {
  id: string;
  title: string;
  actionSummary: string;
  technicalTradeoff: string;
  outcomeHeadline: string;
  outcomeText: string;
  historicalAccuracyScore: number; // 1-100
  lessonLearned: string;
  isHistoricalChoice?: boolean;
}

export interface SimulationScenario {
  id: string;
  title: string;
  missionId: string;
  missionName: string;
  target: string;
  solOrDate: string;
  crisisBrief: string;
  environmentalTelemetry: {
    label: string;
    value: string;
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  }[];
  challengeQuestion: string;
  choices: SimulationChoice[];
  historicalDebrief: string;
}

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'opp-dust-storm',
    title: 'The Great Global Dust Storm of 2018',
    missionId: 'opportunity',
    missionName: 'Opportunity (MER-B)',
    target: 'Mars — Endeavour Crater',
    solOrDate: 'Sol 5,111 (June 10, 2018)',
    crisisBrief: 'A massive dust storm has enveloped Mars, expanding to cover the entire 144-million-square-kilometer planet. Atmospheric opacity (tau) has skyrocketed from a normal 0.6 to an unheard-of 10.8. Sunlight is blocked by 99.5%. Battery reserves are dwindling to critical survival thresholds in sub-zero Martian cold.',
    environmentalTelemetry: [
      { label: 'Atmospheric Opacity (Tau)', value: '10.8 (Extreme darkness)', status: 'CRITICAL' },
      { label: 'Solar Array Energy', value: '22 Watt-hours / Sol (Norm: 600 Wh)', status: 'CRITICAL' },
      { label: 'Bus Voltage', value: '23.8 V (Approaching reset threshold)', status: 'WARNING' },
      { label: 'One-Way Light Time Delay', value: '14 minutes, 12 seconds', status: 'NORMAL' },
    ],
    challengeQuestion: 'As Flight Director at NASA JPL, you must transmit emergency uplink commands before the rover loses receiver power. What is your command strategy?',
    choices: [
      {
        id: 'choice-hibernate',
        title: 'Strategy Alpha: Deep Hibernation & Master Clock Disconnect',
        actionSummary: 'Shut down all science instruments, power down communication transceivers, and let the rover sleep until solar arrays detect sufficient daylight.',
        technicalTradeoff: 'Saves maximum battery power, but if the internal mission clock freezes or temperatures drop below -55°C, thermal heaters will fail and solder joints may crack.',
        outcomeHeadline: 'The Historical JPL Strategy Executed',
        outcomeText: 'This was the real strategy executed by JPL flight controllers. The rover entered low-power sleep mode. However, the dust storm lasted for over two months. With no sun, the rover’s survival heaters eventually exhausted the residual battery power, and the mission clock suffered a catastrophic cold-reset.',
        historicalAccuracyScore: 100,
        lessonLearned: 'Solar-powered planetary rovers depend entirely on seasonal solar cycles. This event reinforced NASA’s transition to nuclear MMRTG power for Curiosity and Perseverance.',
        isHistoricalChoice: true,
      },
      {
        id: 'choice-transmit',
        title: 'Strategy Beta: Continuous Emergency Beacon Broadcast',
        actionSummary: 'Keep the Low-Gain Antenna active to continuously ping the Deep Space Network with status updates and diagnostic data.',
        technicalTradeoff: 'Provides immediate engineering feedback, but the transmitter consumes 30 watts, which will drain the remaining 22 Wh battery in less than 45 minutes.',
        outcomeHeadline: 'Immediate Battery Depletion and Brownout',
        outcomeText: 'The emergency beacon transmits for 40 minutes, providing clear telemetry, but drops battery voltage below 22V, tripping the under-voltage circuit breaker immediately and accelerating cold death by weeks.',
        historicalAccuracyScore: 40,
        lessonLearned: 'In deep space, power conservation must always supersede real-time communications.',
      },
      {
        id: 'choice-turn',
        title: 'Strategy Gamma: Drive Rover Toward Ridge to Catch Slanted Light',
        actionSummary: 'Command Opportunity to drive 15 meters uphill to tilt solar panels toward the sun’s estimated zenith.',
        technicalTradeoff: 'Could marginally improve light capture, but driving motors require 80–120 watts—far more power than available in the batteries.',
        outcomeHeadline: 'Motor Stall & Battery Voltage Collapse',
        outcomeText: 'Attempting to drive on exhausted batteries trips the motor controller fuses and locks the steering wheels in loose regolith, draining the final milliwatts in seconds.',
        historicalAccuracyScore: 15,
        lessonLearned: 'Never attempt mechanical actuation when energy reserves are below survival minimums.',
      },
    ],
    historicalDebrief: 'Opportunity survived on Mars for nearly 15 years, outlasting its 90-day warranty by a factor of 55. The machine ceased transmitting, but its 45 kilometers of tracks and gigabytes of peer-reviewed data remain immortalized in human science.',
  },

  {
    id: 'insight-sand-scour',
    title: 'InSight: Sand Scouring the Solar Arrays',
    missionId: 'insight',
    missionName: 'InSight Lander',
    target: 'Mars — Elysium Planitia',
    solOrDate: 'Sol 884 (May 2021)',
    crisisBrief: 'InSight’s two circular solar panels are choked with a 2-millimeter blanket of fine Martian ferric dust. Available electrical power has plummeted from 5,000 Wh/day down to barely 300 Wh/day, threatening early retirement of the seismometer.',
    environmentalTelemetry: [
      { label: 'Solar Output', value: '315 Wh / Sol (Down 94%)', status: 'CRITICAL' },
      { label: 'Wind Velocity', value: '6–8 m/s (Crosswind from NW)', status: 'NORMAL' },
      { label: 'Instrument Power Budget', value: 'Severely Rationed', status: 'WARNING' },
    ],
    challengeQuestion: 'InSight has no wipers, brushes, or blowers. Can you use the robotic scoop to clear the dust in the Martian breeze?',
    choices: [
      {
        id: 'insight-scour',
        title: 'Strategy Alpha: Trickle Coarse Sand into the Crosswind',
        actionSummary: 'Use the robotic scoop to pick up coarse sand grains and slowly trickle them over the lander deck upwind of the solar panel.',
        technicalTradeoff: 'Heavier sand grains will bounce across the smooth solar glass, saltating and carrying away the clingy electrostatic fine dust particles without breaking the panel.',
        outcomeHeadline: 'Brilliant Engineering Triumph! Power Gain: +30 Wh/day',
        outcomeText: 'As coarse sand granules bounced across the solar panels in the 8 m/s breeze, they dislodged the ultra-fine clinging dust particles, giving InSight a sudden 30 watt-hour daily power boost! This ingenious hack bought the mission another full year of marsquake science.',
        historicalAccuracyScore: 100,
        lessonLearned: 'Creative engineering utilizing environmental physics (saltation) can rescue instruments millions of miles away from human touch.',
        isHistoricalChoice: true,
      },
      {
        id: 'insight-bang',
        title: 'Strategy Beta: Bang the Scoop Against the Solar Frame',
        actionSummary: 'Command the robotic arm to strike the rim of the solar array to shake loose the dust.',
        technicalTradeoff: 'Could cause dust to shake off, but risks puncturing the solar cells or cracking the delicate graphite truss joints.',
        outcomeHeadline: 'High Structural Risk / Mechanical Vibration Damage',
        outcomeText: 'Striking a space-hardened solar array in -70°C conditions risks fracturing brittle silicon cells or jamming the deployment hinge springs.',
        historicalAccuracyScore: 25,
        lessonLearned: 'Mechanical shock on cold space structures is strictly avoided in space operations.',
      },
    ],
    historicalDebrief: 'NASA JPL engineers successfully carried out this sand-trickling operation multiple times in 2021, proving that human ingenuity can clean solar panels across 100 million miles of void.',
  },
];
