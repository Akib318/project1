export interface MissionGuideRequest {
  prompt: string;
  context?: {
    location?: string;
    missionName?: string;
    target?: string;
    status?: string;
    activeComponent?: string;
  };
  persona?: 'guide' | 'talk_to_mission';
  language?: 'en' | 'bn' | 'simple_en';
}

export interface MissionGuideResponse {
  reply: string;
  isFallback: boolean;
}

export async function askMissionGuide(req: MissionGuideRequest): Promise<MissionGuideResponse> {
  try {
    const response = await fetch('/api/mission-guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return {
      reply: data.reply || 'Mission telemetry received. No additional details available.',
      isFallback: !!data.isFallback,
    };
  } catch (error) {
    console.warn('Backend call failed, using client-side fallback:', error);
    return {
      reply: getClientFallbackReply(req),
      isFallback: true,
    };
  }
}

function getClientFallbackReply(req: MissionGuideRequest): string {
  const p = (req.prompt || '').toLowerCase();
  const mission = (req.context?.missionName || '').toLowerCase();

  if (req.language === 'bn') {
    return `মিশন ইকোতে স্বাগতম। মানুষ মহাকাশে যে যন্ত্রগুলো রেখে এসেছে—যেমন মঙ্গলের অপরচুনিটি রোভার এবং চাঁদের অ্যাপোলো ডিসেন্ট স্টেজ—তাদের মিশন শেষ হলেও বৈজ্ঞানিক তথ্য ও মানবজাতির ইতিহাস চিরকাল অক্ষয় হয়ে থাকবে।`;
  }

  if (req.persona === 'talk_to_mission') {
    if (mission.includes('opportunity') || p.includes('opportunity')) {
      return `My wheels rest in Perseverance Valley on the rim of Endeavour Crater. I drove 45.16 kilometers across Mars and lived through 5,111 sols. In June 2018, the planet-wide dust storm covered my solar panels. I have been asleep ever since, but the water evidence I found belongs to you forever.\n\n*(Educational simulation grounded in NASA records)*`;
    }
  }

  if (p.includes('opportunity') && (p.includes('why') || p.includes('end'))) {
    return `Opportunity's mission ended in June 2018 when an immense global dust storm enveloped Mars, blocking 99.5% of sunlight. The solar-powered rover could not recharge its batteries or heat its critical electronics, entering a deep unrecoverable sleep after 5,111 sols of heroic exploration.`;
  }

  return `Mission Echo telemetry confirms your query about ${req.context?.missionName || 'space hardware'}. Human-made spacecraft operate in the most hostile environments in the solar system. Even after communications cease, their physical presence stands as an archaeological monument to human curiosity.`;
}
