

import { Exercise, Achievement } from './types';

export const MEDICAL_DISCLAIMER = `
This app is not medical advice. Consult your doctor before starting exercise, especially if you have pre-existing conditions (heart disease, joint issues, diabetes, pregnancy, recent surgery, age 65+). You participate at your own risk. By continuing, you acknowledge that the developers of DeskFlow are not liable for any injuries sustained during use.
`;

export const GENERAL_TIPS = [
  "Hydration: Drink water before you feel thirsty. Brain fog is often just dehydration.",
  "20-20-20 Rule: Every 20 mins, look at something 20 feet away for 20 seconds to save your eyes.",
  "Posture Check: Are your ears aligned with your shoulders right now?",
  "Ergonomics: Your monitor top should be at eye level to prevent neck strain.",
  "Breathing: Box breathing (4s in, 4s hold, 4s out) reduces work anxiety instantly.",
  "Cold Exposure: A splash of cold water on your face resets the vagus nerve.",
  "Consistency: 2 mins every hour is better than 1 hour once a day for metabolic health.",
  "Vitamin D: Even 5 minutes of sunlight can reset your circadian rhythm.",
  "Eye Health: Blink! We blink 66% less when looking at screens.",
  "Focus: Multitasking lowers IQ more than losing a night of sleep. Focus on one rep at a time."
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first micro-workout.',
    icon: 'Footprints',
    conditionType: 'sessions',
    threshold: 1,
    xpReward: 100
  },
  {
    id: 'warming-up',
    title: 'Warming Up',
    description: 'Complete 5 total sessions.',
    icon: 'Flame',
    conditionType: 'sessions',
    threshold: 5,
    xpReward: 250
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Maintain a 3-day streak.',
    icon: 'Zap',
    conditionType: 'streak',
    threshold: 3,
    xpReward: 500
  },
  {
    id: 'stealth-ninja',
    title: 'Office Ninja',
    description: 'Complete 5 Stealth Mode sessions.',
    icon: 'Ghost',
    conditionType: 'sessions',
    threshold: 5,
    xpReward: 400
  },
  {
    id: 'desk-warrior',
    title: 'Desk Warrior',
    description: 'Complete 20 sessions.',
    icon: 'Sword',
    conditionType: 'sessions',
    threshold: 20,
    xpReward: 1000
  }
];

// Using reliable stock footage samples.
const STOCK_VIDEOS = {
    squat: "https://videos.pexels.com/video-files/4259059/4259059-sd_540_960_30fps.mp4", 
    pushup: "https://videos.pexels.com/video-files/4761426/4761426-sd_506_960_25fps.mp4", 
    stretch: "https://videos.pexels.com/video-files/6703530/6703530-sd_540_960_24fps.mp4",
    desk: "https://videos.pexels.com/video-files/7686523/7686523-sd_540_960_30fps.mp4",
    box: "https://videos.pexels.com/video-files/6703530/6703530-sd_540_960_24fps.mp4", // Placeholder for boxing
    cardio: "https://videos.pexels.com/video-files/4433606/4433606-sd_540_960_25fps.mp4" 
};

export const EXERCISES: Exercise[] = [
  // --- STRENGTH ---
  {
    id: 'chair-squats',
    name: 'Chair Squats',
    category: 'strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    description: 'The #1 antidote to sitting. Reverses hip tightness instantly.',
    instructions: [
      'Stand feet hip-width apart.',
      'Push hips back, lower slowly (3 seconds).',
      'Lightly tap the chair seat with your glutes.',
      'Explode back up through your heels (1 second).'
    ],
    commonMistakes: 'Knees collapsing inward; dropping too fast.',
    modifications: [
      { level: 'easier', description: 'Sit fully down between reps.' },
      { level: 'standard', description: 'Touch-and-go (no sitting).' },
      { level: 'harder', description: 'Add a calf raise at the top.' }
    ],
    citation: 'Counteracts endothelial dysfunction from sitting (Restaino et al., 2015).',
    whyItWorks: 'Activates the body\'s largest muscles to flush blood sugar.',
    contraindications: ['Knees', 'Recent Surgery'],
    isStealth: false,
    baseReps: 15,
    type: 'reps',
    tempo: '3s Down, 1s Up',
    intensityCue: 'Drive through heels!',
    videoUrl: STOCK_VIDEOS.squat
  },
  {
    id: 'desk-pushups',
    name: 'Incline Desk Push-ups',
    category: 'strength',
    muscleGroups: ['Chest', 'Triceps', 'Core'],
    description: 'Upper body power without touching the floor.',
    instructions: [
      'Hands on desk edge, wider than shoulders.',
      'Step back into a plank position.',
      'Lower chest to desk edge (2 seconds).',
      'Push back to start (1 second).'
    ],
    commonMistakes: 'Sagging hips; shrugging shoulders.',
    modifications: [
      { level: 'easier', description: 'Use a wall instead of desk.' },
      { level: 'standard', description: 'Desk edge plank.' },
      { level: 'harder', description: 'Slow eccentric (5s down).' }
    ],
    citation: 'Resistance training reduces risk of metabolic syndrome (Strasser, 2010).',
    whyItWorks: 'Corrects "keyboard hunch" by engaging the chest and core.',
    contraindications: ['Wrists', 'Shoulders'],
    isStealth: false,
    baseReps: 12,
    type: 'reps',
    tempo: '2s Down, 1s Up',
    intensityCue: 'Core tight like a plank!',
    videoUrl: STOCK_VIDEOS.pushup
  },
  {
    id: 'tricep-dips-seated',
    name: 'Chair Dips',
    category: 'strength',
    muscleGroups: ['Triceps', 'Shoulders'],
    description: 'Isolate the back of your arms using your chair.',
    instructions: [
      'Sit on edge of chair, hands gripping the front edge.',
      'Scoop hips forward off the chair.',
      'Bend elbows to lower hips toward floor.',
      'Press back up until arms are straight.'
    ],
    commonMistakes: 'Shrugging shoulders; flaring elbows out.',
    modifications: [
      { level: 'easier', description: 'Keep feet flat on floor (knees bent).' },
      { level: 'harder', description: 'Straighten legs out fully.' }
    ],
    citation: 'Compound upper body movements increase EPOC (afterburn).',
    whyItWorks: 'Strengthens arms and improves shoulder stability.',
    contraindications: ['Shoulders', 'Wrists'],
    isStealth: false,
    baseReps: 10,
    type: 'reps',
    tempo: '2s Down, 1s Up',
    intensityCue: 'Squeeze triceps at top!',
    videoUrl: STOCK_VIDEOS.desk
  },

  // --- CARDIO / VILPA (Vigorous Intermittent Lifestyle Physical Activity) ---
  {
    id: 'desk-mountain-climbers',
    name: 'Desk Mountain Climbers',
    category: 'cardio',
    muscleGroups: ['Core', 'Hip Flexors', 'Cardio'],
    description: 'High-intensity burst to spike heart rate safely.',
    instructions: [
      'Place hands on desk in plank position.',
      'Drive right knee toward chest.',
      'Quickly switch legs, driving left knee.',
      'Find a running rhythm.'
    ],
    commonMistakes: 'Bouncing hips too high.',
    modifications: [
      { level: 'easier', description: 'Slow marching tempo.' },
      { level: 'harder', description: 'Sprint speed.' }
    ],
    citation: 'VILPA (1-2 mins/day) lowers mortality risk by 40% (Nature Medicine, 2022).',
    whyItWorks: 'Rapidly increases heart rate to boost VO2 max.',
    contraindications: ['Wrists', 'Heart Conditions'],
    isStealth: false,
    baseReps: 0,
    baseDurationSec: 45,
    type: 'duration',
    tempo: 'Fast Rhythm',
    intensityCue: 'Knees to chest!',
    videoUrl: STOCK_VIDEOS.cardio
  },
  {
    id: 'shadow-boxing-seated',
    name: 'Seated Shadow Boxing',
    category: 'cardio',
    muscleGroups: ['Shoulders', 'Core', 'Cardio'],
    description: 'Stress relief meets cardio. Punch out the frustration.',
    instructions: [
      'Sit tall, feet flat, core braced.',
      'Bring fists to chin (guard up).',
      'Punch straight out (Jab/Cross) in a rhythm.',
      'Exhale sharply on every punch.'
    ],
    commonMistakes: 'Lazy arms. Snap the punches!',
    modifications: [
      { level: 'standard', description: 'Constant 1-2 rhythm.' },
      { level: 'harder', description: 'Add hooks and uppercuts.' }
    ],
    citation: 'Non-contact boxing improves coordination and stress regulation.',
    whyItWorks: 'Engages rotational core muscles and spikes energy.',
    contraindications: ['Shoulders'],
    isStealth: true,
    baseReps: 0,
    baseDurationSec: 45,
    type: 'duration',
    tempo: 'Fast & Snappy',
    intensityCue: 'Exhale on impact!',
    videoUrl: STOCK_VIDEOS.box
  },
  {
    id: 'soleus-pump',
    name: 'Soleus Pushups',
    category: 'cardio',
    muscleGroups: ['Soleus'],
    description: 'The "Second Heart" pump. Boost metabolism while seated.',
    instructions: [
      'Keep knees bent at 90 degrees, feet flat.',
      'Raise heels as high as possible while keeping toes planted.',
      'Drop heels down freely.',
      'Repeat rapidly and continuously.'
    ],
    commonMistakes: 'Going too slow. Aim for a rhythmic bounce.',
    modifications: [
      { level: 'standard', description: 'Rapid tempo.' }
    ],
    citation: 'Soleus muscle oxidative metabolism regulates blood glucose (Hamilton, 2022).',
    whyItWorks: 'Activates a fatigue-resistant muscle to burn blood sugar without sweat.',
    contraindications: [],
    isStealth: true,
    baseReps: 0,
    baseDurationSec: 60,
    type: 'duration',
    tempo: 'Rapid Bounce',
    intensityCue: 'Faster!',
    videoUrl: STOCK_VIDEOS.desk
  },

  // --- MOBILITY / POSTURE ---
  {
    id: 'bird-dog-desk',
    name: 'Standing Bird Dog',
    category: 'posture',
    muscleGroups: ['Core', 'Lower Back', 'Glutes'],
    description: 'Fix your posture and wake up your back muscles.',
    instructions: [
      'Stand facing your desk, hands resting on surface.',
      'Extend right arm forward and left leg backward.',
      'Keep back straight. Hold for 3 seconds.',
      'Switch sides.'
    ],
    commonMistakes: 'Arching back excessively.',
    modifications: [
      { level: 'easier', description: 'Only extend leg.' },
      { level: 'standard', description: 'Arm and leg simultaneous.' }
    ],
    citation: 'Core stabilization improves posture and reduces back pain (McGill, 2010).',
    whyItWorks: 'Re-engages the posterior chain often weakened by sitting.',
    contraindications: ['Back', 'Balance'],
    isStealth: false,
    baseReps: 10,
    type: 'reps',
    tempo: 'Hold 3s',
    intensityCue: 'Reach long!',
    videoUrl: STOCK_VIDEOS.stretch
  },
  {
    id: 'thoracic-opener',
    name: 'Thoracic Opener',
    category: 'mobility',
    muscleGroups: ['Upper Back', 'Chest'],
    description: 'The ultimate anti-slouch movement.',
    instructions: [
      'Sit tall, hands behind head, elbows wide.',
      'Inhale, arch upper back over the chair top.',
      'Open elbows wide to stretch chest.',
      'Exhale and return to neutral.'
    ],
    commonMistakes: 'Arching lower back instead of upper back.',
    modifications: [
      { level: 'standard', description: 'Use chair back as pivot.' }
    ],
    citation: 'Thoracic mobility reduces neck strain and improves lung capacity.',
    whyItWorks: 'Reverses the kyphotic curve caused by looking at screens.',
    contraindications: ['Neck', 'Back'],
    isStealth: true,
    baseReps: 10,
    type: 'reps',
    tempo: 'Slow & Controlled',
    intensityCue: 'Open your chest!',
    videoUrl: STOCK_VIDEOS.stretch
  },
  {
    id: 'seated-spinal-twist',
    name: 'Seated Spinal Twist',
    category: 'mobility',
    muscleGroups: ['Obliques', 'Spinal Erectors'],
    description: 'Instant relief for a stiff back.',
    instructions: [
      'Sit tall, feet flat.',
      'Exhale and rotate torso to the right.',
      'Use chair arm/back for gentle leverage.',
      'Hold 20s, then switch.'
    ],
    commonMistakes: 'Forcing the rotation.',
    modifications: [
      { level: 'standard', description: 'Gentle hold.' }
    ],
    citation: 'Spinal mobilization improves circulation and reduces stiffness.',
    whyItWorks: 'Lubricates spinal joints and aids digestion.',
    contraindications: ['Back'],
    isStealth: true,
    baseReps: 0,
    baseDurationSec: 40,
    type: 'duration',
    tempo: 'Static Hold',
    intensityCue: 'Grow taller!',
    videoUrl: STOCK_VIDEOS.stretch
  },

  // --- STEALTH / ISOMETRIC ---
  {
    id: 'stealth-glute-clench',
    name: 'Stealth Glute Clench',
    category: 'strength',
    muscleGroups: ['Glutes'],
    description: 'Invisible to zoom, deadly to "dormant butt syndrome".',
    instructions: [
      'Sit tall in your chair.',
      'Squeeze glutes hard, elevating body slightly.',
      'Hold for 5 seconds.',
      'Release.'
    ],
    commonMistakes: 'Holding breath.',
    modifications: [
      { level: 'standard', description: '5 second hard squeeze.' }
    ],
    citation: 'Isometric contractions prevent muscle atrophy during inactivity.',
    whyItWorks: 'Prevents pelvic instability without anyone noticing.',
    contraindications: [],
    isStealth: true,
    baseReps: 15,
    type: 'reps',
    tempo: 'Hold 5s',
    intensityCue: 'Squeeze Hard!',
    videoUrl: STOCK_VIDEOS.desk
  },
  {
    id: 'under-desk-leg-extension',
    name: 'Stealth Leg Extension',
    category: 'strength',
    muscleGroups: ['Quadriceps', 'Knees'],
    description: 'Strengthen knees while analyzing spreadsheets.',
    instructions: [
      'Sit with feet flat.',
      'Straighten one leg under desk until knee locks.',
      'Flex quad muscle hard at the top (2s).',
      'Lower slowly.'
    ],
    commonMistakes: 'Kicking the desk.',
    modifications: [
      { level: 'standard', description: 'Hold at top for 2 seconds.' }
    ],
    citation: 'Terminal knee extension strengthens the VMO muscle.',
    whyItWorks: 'Increases blood flow to lower extremities.',
    contraindications: [],
    isStealth: true,
    baseReps: 12,
    type: 'reps',
    tempo: '2s Hold at Top',
    intensityCue: 'Lock the knee!',
    videoUrl: STOCK_VIDEOS.desk
  },
  {
    id: 'desk-plank-hold',
    name: 'Desk Plank Hold',
    category: 'strength',
    muscleGroups: ['Core', 'Shoulders'],
    description: 'Total body tension reset.',
    instructions: [
      'Hands on desk edge, walk feet back.',
      'Body in straight line.',
      'Brace abs as if about to be punched.',
      'Hold and breathe deeply.'
    ],
    commonMistakes: 'Holding breath; sagging hips.',
    modifications: [
      { level: 'easier', description: 'Wall plank.' },
      { level: 'harder', description: 'Lift one leg.' }
    ],
    citation: 'Isometric core training improves stability and reduces back pain.',
    whyItWorks: 'Re-engages the deep core muscles (TVA).',
    contraindications: ['Wrists', 'Shoulders'],
    isStealth: false,
    baseReps: 0,
    baseDurationSec: 45,
    type: 'duration',
    tempo: 'Static Hold',
    intensityCue: 'Brace your core!',
    videoUrl: STOCK_VIDEOS.pushup
  }
];
