import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Gauge,
  GraduationCap,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  Maximize2,
  Menu,
  MessageCircle,
  MessageSquare,
  Minimize2,
  Pause,
  Pin,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  Sparkles,
  Target,
  ThumbsUp,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Upload,
  User,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';

type View = 'dashboard' | 'sessions' | 'quizzes' | 'progress' | 'community';

type Chapter = {
  time: string;
  seconds: number;
  title: string;
};

type Lesson = {
  number: string;
  title: string;
  topic: string;
  duration: string;
  durationSeconds: number;
  completed: boolean;
  accent: string;
  description: string;
  videoTitle: string;
  keyFormulas: { symbol: string; meaning: string }[];
  summaryNotes: string[];
  chapters: Chapter[];
  resources: { name: string; type: string; size: string }[];
};

type UserProfile = {
  name: string;
  avatar: string | null;
  grade: string;
};

type Comment = {
  id: string;
  author: string;
  avatar: string | null;
  isTeacher?: boolean;
  time: string;
  text: string;
};

type CommunityPost = {
  id: string;
  author: string;
  avatar: string | null;
  isTeacher?: boolean;
  pinned?: boolean;
  time: string;
  topic: string;
  title: string;
  content: string;
  likes: number;
  liked?: boolean;
  comments: Comment[];
};

type QuizQuestion = {
  id: number;
  question: string;
  formulaHint?: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  keyRule?: string;
  formulaUsed?: string;
  stepByStep?: string[];
  commonMistake?: string;
};

type QuizData = {
  id: string;
  sessionNumber: string;
  title: string;
  topic: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
};

const initialLessons: Lesson[] = [
  {
    number: '01',
    title: 'Motion & Graphs',
    topic: 'Kinematics',
    duration: '42 min',
    durationSeconds: 42 * 60,
    completed: true,
    accent: 'yellow',
    description: 'Understand displacement, velocity, and acceleration. Learn to extract distance from area under velocity-time graphs and acceleration from gradients.',
    videoTitle: 'Kinematics Masterclass · Interpreting Motion Graphs & Equations',
    keyFormulas: [
      { symbol: 'v = Δs / Δt', meaning: 'Average velocity = displacement / time' },
      { symbol: 'a = (v - u) / t', meaning: 'Acceleration = change in velocity / time' },
      { symbol: 's = ½(u + v)t', meaning: 'Displacement for uniform acceleration' },
    ],
    summaryNotes: [
      'Gradient of a Displacement-Time graph gives instantaneous Velocity.',
      'Gradient of a Velocity-Time graph gives Acceleration.',
      'Area under a Velocity-Time graph represents Total Distance / Displacement.',
      'Always convert time to seconds and distance to meters before calculating.',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Introduction to Vectors & Scalars' },
      { time: '07:40', seconds: 460, title: 'Displacement-Time Graph Slopes' },
      { time: '18:15', seconds: 1095, title: 'Velocity-Time Graphs & Acceleration' },
      { time: '29:50', seconds: 1790, title: 'Calculating Area Under Curves' },
      { time: '37:20', seconds: 2240, title: 'Past Paper Problem Walkthrough' },
    ],
    resources: [
      { name: 'Session 01 - Kinematics Formula Sheet.pdf', type: 'PDF', size: '1.2 MB' },
      { name: 'Motion Graphs Practice Problems.pdf', type: 'PDF', size: '2.4 MB' },
    ],
  },
  {
    number: '02',
    title: 'Forces in Balance',
    topic: 'Dynamics',
    duration: '38 min',
    durationSeconds: 38 * 60,
    completed: true,
    accent: 'blue',
    description: 'Explore resultant forces, Newton’s three laws of motion, friction, and equilibrium conditions on horizontal and inclined planes.',
    videoTitle: 'Dynamics & Equilibrium · Resultant Forces & Newton’s Laws',
    keyFormulas: [
      { symbol: 'F_net = m · a', meaning: 'Newton’s 2nd Law (Force = mass × acceleration)' },
      { symbol: 'W = m · g', meaning: 'Weight = mass × gravitational field strength' },
      { symbol: 'ΣF = 0', meaning: 'Equilibrium condition (Balanced forces)' },
    ],
    summaryNotes: [
      'When net force is zero (ΣF = 0), an object remains at rest or continues at constant velocity (Newton 1).',
      'Unbalanced forces cause acceleration in the direction of the net force (F = ma).',
      'Weight depends on gravitational field strength (g = 9.8 N/kg on Earth), while mass is constant.',
      'Friction always opposes relative motion between contacting surfaces.',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Balanced vs Unbalanced Forces' },
      { time: '08:30', seconds: 510, title: 'Newton’s Laws of Motion' },
      { time: '17:20', seconds: 1040, title: 'Free Body Diagrams & Vector Sums' },
      { time: '26:45', seconds: 1605, title: 'Terminal Velocity & Drag Forces' },
      { time: '34:00', seconds: 2040, title: 'Exam Question Analysis' },
    ],
    resources: [
      { name: 'Session 02 - Forces & Dynamics Notes.pdf', type: 'PDF', size: '1.5 MB' },
      { name: 'Newton Laws Exam Worksheet.pdf', type: 'PDF', size: '3.1 MB' },
    ],
  },
  {
    number: '03',
    title: 'Energy & Work',
    topic: 'Mechanics',
    duration: '45 min',
    durationSeconds: 45 * 60,
    completed: false,
    accent: 'orange',
    description: 'Learn why energy cannot be created or destroyed. Master work done calculations, kinetic energy, gravitational potential energy, and power efficiency.',
    videoTitle: 'Energy, Work & Power · Conservation Laws & Efficiency Calculations',
    keyFormulas: [
      { symbol: 'W = F · d', meaning: 'Work Done = Force × Distance moved in direction of force' },
      { symbol: 'E_k = ½ · m · v²', meaning: 'Kinetic Energy = ½ × mass × velocity squared' },
      { symbol: 'ΔE_p = m · g · Δh', meaning: 'Gravitational Potential Energy = mass × g × height' },
      { symbol: 'P = W / t = E / t', meaning: 'Power = Work Done / time taken (Watts)' },
    ],
    summaryNotes: [
      'Work Done is the energy transferred when a force moves an object through a distance (1 Joule = 1 N·m).',
      'Kinetic Energy quadruples when speed doubles (proportional to v²).',
      'Law of Conservation of Energy: Total energy before = Total energy after.',
      'Power is the rate of transferring energy or doing work (1 Watt = 1 Joule per second).',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Concept of Work Done (W = F · d)' },
      { time: '09:15', seconds: 555, title: 'Kinetic Energy Calculations' },
      { time: '20:30', seconds: 1230, title: 'Gravitational Potential Energy & Free Fall' },
      { time: '31:40', seconds: 1900, title: 'Power Rating & Efficiency Equations' },
      { time: '38:50', seconds: 2330, title: 'IGCSE Paper 4 Long Answer Walkthrough' },
    ],
    resources: [
      { name: 'Session 03 - Energy & Work Comprehensive Guide.pdf', type: 'PDF', size: '2.1 MB' },
      { name: 'Work & Power Calculation Workbook.pdf', type: 'PDF', size: '1.8 MB' },
      { name: 'IGCSE Mechanics Formula Cheat Sheet.pdf', type: 'PDF', size: '950 KB' },
    ],
  },
  {
    number: '04',
    title: 'Momentum & Impulse',
    topic: 'Mechanics',
    duration: '40 min',
    durationSeconds: 40 * 60,
    completed: false,
    accent: 'yellow',
    description: 'Study momentum conservation in elastic and inelastic collisions. Calculate impulse from force-time graphs and understand vehicle safety design.',
    videoTitle: 'Momentum Masterclass · Collisions, Explosions & Impulse Graphs',
    keyFormulas: [
      { symbol: 'p = m · v', meaning: 'Momentum = mass × velocity (kg·m/s)' },
      { symbol: 'Impulse = F · Δt = Δp', meaning: 'Impulse = change in momentum' },
      { symbol: 'Σp_initial = Σp_final', meaning: 'Conservation of linear momentum' },
    ],
    summaryNotes: [
      'Momentum is a vector quantity (magnitude and direction matter!).',
      'In any collision or explosion, total initial momentum = total final momentum (no external forces).',
      'Seatbelts and crumple zones increase impact time (Δt), reducing the impact force (F = Δp / Δt).',
    ],
    chapters: [
      { time: '00:00', seconds: 0, title: 'What is Momentum? (p = mv)' },
      { time: '11:20', seconds: 680, title: 'Conservation of Momentum in Collisions' },
      { time: '22:45', seconds: 1365, title: 'Impulse & Force-Time Relationships' },
      { time: '33:10', seconds: 1990, title: 'Safety Applications & Past Paper Questions' },
    ],
    resources: [
      { name: 'Session 04 - Momentum Notes & Formula Sheet.pdf', type: 'PDF', size: '1.4 MB' },
    ],
  },
];

const sampleQuizzes: Record<string, QuizData> = {
  '02': {
    id: 'quiz-02',
    sessionNumber: '02',
    title: 'Forces in Balance & Dynamics',
    topic: 'Dynamics',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: 'A car of mass 1,200 kg travels at a constant velocity of 25 m/s on a flat level road. The total resistive force opposing its motion is 600 N. What is the forward driving force provided by the engine?',
        formulaHint: 'Remember Newton’s First Law: When velocity is constant, acceleration a = 0.',
        options: [
          { label: 'A', text: '0 N' },
          { label: 'B', text: '600 N' },
          { label: 'C', text: '30,000 N' },
          { label: 'D', text: '1,200 N' },
        ],
        correctAnswer: 'B',
        explanation: 'Because the car is travelling at constant velocity, its acceleration is zero. By Newton’s First Law, the net force must be zero (ΣF = 0). Therefore, the forward engine thrust must exactly balance the 600 N resistive force.',
        keyRule: "Newton's First Law (Equilibrium at Constant Speed: ΣF = 0)",
        formulaUsed: 'F_net = F_forward - F_resistive = 0  ⟹  F_forward = 600 N',
        stepByStep: [
          "Identify the keyword: 'constant velocity' means acceleration a = 0 m/s².",
          "Apply Newton's 1st Law: Net force ΣF = m · a = 1,200 kg × 0 = 0 N.",
          "Set up the horizontal force balance: F_forward - 600 N = 0.",
          "Solve: F_forward = 600 N (forward engine force equals backward friction)."
        ],
        commonMistake: 'Exam Trap: Option C (30,000 N) mistakenly calculates momentum (p = m · v = 1,200 × 25), while Option D confuses mass with force.',
      },
      {
        id: 2,
        question: 'An object of mass 5.0 kg is acted upon by two horizontal forces: 18 N acting to the right and 8 N acting to the left. What is the magnitude and direction of the resulting acceleration?',
        formulaHint: 'Net force F_net = F_right - F_left, then use F_net = m · a.',
        options: [
          { label: 'A', text: '2.0 m/s² to the right' },
          { label: 'B', text: '5.2 m/s² to the right' },
          { label: 'C', text: '2.0 m/s² to the left' },
          { label: 'D', text: '10.0 m/s² to the right' },
        ],
        correctAnswer: 'A',
        explanation: 'Net force F_net = 18 N - 8 N = 10 N to the right. Acceleration a = F_net / m = 10 N / 5.0 kg = 2.0 m/s² to the right.',
        keyRule: "Newton's Second Law (Resultant Force & Acceleration)",
        formulaUsed: 'F_net = F_right - F_left  ⟹  a = F_net / m',
        stepByStep: [
          'Calculate resultant force: F_net = 18 N (right) - 8 N (left) = 10 N (to the right).',
          "Apply Newton's 2nd Law formula: F_net = m · a.",
          'Rearrange for acceleration: a = F_net / m = 10 N / 5.0 kg.',
          'Calculate final answer: a = 2.0 m/s² directed to the right.'
        ],
        commonMistake: 'Common Trap: Option C gets the numerical answer right but the wrong direction (left). Acceleration always acts in the direction of the net force.',
      },
      {
        id: 3,
        question: 'Which of the following physical quantities is a VECTOR (has both magnitude and direction)?',
        options: [
          { label: 'A', text: 'Speed' },
          { label: 'B', text: 'Velocity' },
          { label: 'C', text: 'Mass' },
          { label: 'D', text: 'Distance' },
        ],
        correctAnswer: 'B',
        explanation: 'Velocity is displacement per unit time and specifies both speed and direction of motion. Speed, mass, and distance are scalar quantities.',
        keyRule: 'Scalar vs Vector Quantities in IGCSE Physics',
        formulaUsed: 'Vector = Magnitude + Direction | Scalar = Magnitude Only',
        stepByStep: [
          'Scalars (Magnitude only): Speed (e.g. 50 km/h), Mass (e.g. 5 kg), Distance (e.g. 20 m).',
          'Vectors (Magnitude + Direction): Velocity (e.g. 50 km/h North), Displacement, Acceleration, Force, Momentum.',
          'Conclusion: Velocity is the only vector quantity listed.'
        ],
        commonMistake: 'Exam Tip: Never confuse speed (scalar) with velocity (vector). Velocity changes even if speed is constant if direction changes.',
      },
      {
        id: 4,
        question: 'When a parachutist reaches terminal velocity during freefall, which of the following statements is TRUE?',
        formulaHint: 'Consider the balance between upward air resistance (drag) and downward weight (W = mg).',
        options: [
          { label: 'A', text: 'Air resistance equals weight, and acceleration is zero.' },
          { label: 'B', text: 'Air resistance is zero, so velocity is at maximum.' },
          { label: 'C', text: 'The weight of the parachutist decreases to zero.' },
          { label: 'D', text: 'The parachutist accelerates upwards at 9.8 m/s².' },
        ],
        correctAnswer: 'A',
        explanation: 'As speed increases, upward air drag increases until it matches downward weight (F_drag = W). When forces are balanced, net force is zero and the skydiver falls at constant terminal velocity.',
        keyRule: 'Terminal Velocity & Equilibrium in Fluids',
        formulaUsed: 'F_drag = W  ⟹  F_net = 0  ⟹  a = 0 m/s²',
        stepByStep: [
          'As the skydiver falls, velocity increases due to gravity (W = mg downwards).',
          'Higher speed produces greater upward air drag force (F_drag).',
          'At terminal velocity: F_drag = Weight (forces are equal and opposite).',
          'Net force is zero (F_net = 0), so acceleration stops (a = 0) and speed remains constant.'
        ],
        commonMistake: 'Exam Trap: Option C is wrong because mass and weight do NOT disappear during freefall. Weight is constant throughout the drop.',
      },
      {
        id: 5,
        question: 'A mass of 2.0 kg has a weight of 19.6 N on Earth. What will be its mass and weight on the Moon, where gravitational field strength is 1.6 N/kg?',
        options: [
          { label: 'A', text: 'Mass = 2.0 kg, Weight = 3.2 N' },
          { label: 'B', text: 'Mass = 0.33 kg, Weight = 3.2 N' },
          { label: 'C', text: 'Mass = 2.0 kg, Weight = 19.6 N' },
          { label: 'D', text: 'Mass = 3.2 kg, Weight = 2.0 N' },
        ],
        correctAnswer: 'A',
        explanation: 'Mass is the amount of matter in an object and is constant anywhere (2.0 kg). Weight on the Moon W = m · g_moon = 2.0 kg × 1.6 N/kg = 3.2 N.',
        keyRule: 'Mass (Universal Invariant) vs Weight (Gravitational Force: W = mg)',
        formulaUsed: 'Mass = constant = 2.0 kg  |  W_moon = m · g_moon = 2.0 × 1.6 = 3.2 N',
        stepByStep: [
          'Recall: Mass is the amount of matter and NEVER changes from planet to planet: Mass = 2.0 kg.',
          "Recall: Weight depends on local gravity strength: W = m · g.",
          'Calculate weight on the Moon: W = 2.0 kg × 1.6 N/kg = 3.2 N.',
          'Answer: Mass = 2.0 kg, Weight = 3.2 N.'
        ],
        commonMistake: 'Common Trap: Option B incorrectly divides mass by gravity. Never change the mass of an object when moving between planets!',
      },
    ],
  },
  '03': {
    id: 'quiz-03',
    sessionNumber: '03',
    title: 'Energy, Work & Power Checkpoint',
    topic: 'Mechanics',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: 'A worker pushes a heavy box with a horizontal force of 80 N across a distance of 6.0 meters along the floor. How much work is done on the box?',
        formulaHint: 'Work Done W = Force (F) × distance (d).',
        options: [
          { label: 'A', text: '480 Joules' },
          { label: 'B', text: '13.3 Joules' },
          { label: 'C', text: '74 Joules' },
          { label: 'D', text: '860 Joules' },
        ],
        correctAnswer: 'A',
        explanation: 'Work Done W = F · d = 80 N × 6.0 m = 480 J.',
        keyRule: 'Work Done Equation (Energy Transfer)',
        formulaUsed: 'W = F · d  ⟹  W = 80 N × 6.0 m = 480 J',
        stepByStep: [
          'State equation: Work Done (W) = Force (F) × distance moved in line of force (d).',
          'Substitute values: W = 80 N × 6.0 m.',
          'Calculate result: W = 480 Joules (J).'
        ],
        commonMistake: 'Unit Tip: 1 Joule = 1 Newton-meter (N·m). Ensure distance is in meters.',
      },
      {
        id: 2,
        question: 'A ball of mass 0.5 kg is moving at a speed of 10 m/s. What is its Kinetic Energy?',
        formulaHint: 'Kinetic Energy E_k = ½ · m · v²',
        options: [
          { label: 'A', text: '25 Joules' },
          { label: 'B', text: '50 Joules' },
          { label: 'C', text: '5 Joules' },
          { label: 'D', text: '100 Joules' },
        ],
        correctAnswer: 'A',
        explanation: 'E_k = ½ · m · v² = ½ × 0.5 kg × (10 m/s)² = 0.25 × 100 = 25 Joules.',
        keyRule: 'Kinetic Energy Equation',
        formulaUsed: 'E_k = ½ · m · v²  ⟹  ½ × 0.5 × 10² = 25 J',
        stepByStep: [
          'State formula: E_k = ½ · m · v².',
          'Square the speed first: (10 m/s)² = 100.',
          'Multiply: ½ × 0.5 kg × 100 = 0.25 × 100 = 25 Joules.'
        ],
        commonMistake: 'Common Trap: Forgetting to square the velocity (v²). ½ × 0.5 × 10 = 2.5 J (incorrect).',
      },
      {
        id: 3,
        question: 'An electric motor lifts a load of weight 500 N through a vertical height of 4.0 meters in 5.0 seconds. What is the useful power output of the motor?',
        formulaHint: 'Power P = Work Done / time = (F · d) / t.',
        options: [
          { label: 'A', text: '400 Watts' },
          { label: 'B', text: '2,000 Watts' },
          { label: 'C', text: '100 Watts' },
          { label: 'D', text: '10,000 Watts' },
        ],
        correctAnswer: 'A',
        explanation: 'Work Done = 500 N × 4.0 m = 2,000 J. Power = 2,000 J / 5.0 s = 400 W.',
        keyRule: 'Power Output Equation (Rate of Doing Work)',
        formulaUsed: 'P = Work Done / t = (F · d) / t  ⟹  (500 × 4) / 5 = 400 W',
        stepByStep: [
          'Calculate Work Done: W = Force × height = 500 N × 4.0 m = 2,000 Joules.',
          'Calculate Power: Power (P) = Work Done / time = 2,000 J / 5.0 s.',
          'Calculate result: P = 400 Watts (W).'
        ],
        commonMistake: 'Option B gives the total energy (2,000 J), not the power rate per second (Watts)!',
      },
    ],
  },
};

const initialPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Mr. Mohamed Aboelnaga',
    avatar: null,
    isTeacher: true,
    pinned: true,
    time: '2 hours ago',
    topic: 'Announcements',
    title: 'Welcome to Chapter 03: Energy & Work Checkpoint! ⚡',
    content: 'Welcome everyone! Remember: energy is never lost, only transferred between kinetic, potential, and thermal forms. Before starting Session 03 quiz, review the work equation W = F · d. Post any questions below and I will answer before our live checkpoint!',
    likes: 24,
    liked: false,
    comments: [
      {
        id: 'c-1',
        author: 'Youssef K.',
        avatar: null,
        time: '1 hour ago',
        text: 'Thank you Mr. Mohamed! Will the checkpoint include power calculations (P = W/t)?',
      },
      {
        id: 'c-2',
        author: 'Mr. Mohamed Aboelnaga',
        avatar: null,
        isTeacher: true,
        time: '45 min ago',
        text: 'Yes Youssef! Make sure you can convert kW to Watts (multiply by 1,000) and minutes to seconds.',
      },
    ],
  },
  {
    id: 'post-2',
    author: 'Maryam',
    avatar: null,
    time: '3 hours ago',
    topic: 'Mechanics',
    title: 'Question on velocity-time graph area vs gradient',
    content: 'Can someone double check this rule for me? The area under a velocity-time graph represents total distance travelled, while the gradient represents acceleration, right? Is it the same for non-uniform acceleration curves?',
    likes: 9,
    liked: true,
    comments: [
      {
        id: 'c-3',
        author: 'Layla H.',
        avatar: null,
        time: '2 hours ago',
        text: 'Exactly right Maryam! For curves, we estimate the area using trapeziums or counting grid squares.',
      },
    ],
  },
  {
    id: 'post-3',
    author: 'Omar S.',
    avatar: null,
    time: '5 hours ago',
    topic: 'Exam Tips',
    title: 'IGCSE Formula Quick Sheet that helped me get 92% on Quiz 01',
    content: 'Created a quick reminder: v = d/t, a = (v-u)/t, F = ma, W = mg, and Density = m/V. Keep units in standard SI (meters, seconds, kg) before plugging them in!',
    likes: 18,
    liked: false,
    comments: [],
  },
];

const VALID_USERNAME = 'maryam';
const VALID_PASSWORD = '0000';

function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getFormattedDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function App() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [lessonsList, setLessonsList] = useState<Lesson[]>(initialLessons);
  const [activeSession, setActiveSession] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [quizScores, setQuizScores] = useState<Record<string, { score: number; total: number; completed: boolean }>>({
    '01': { score: 5, total: 5, completed: true },
    '02': { score: 4, total: 5, completed: true },
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mr_mohamed_physics_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || 'Maryam',
          avatar: parsed.avatar || null,
          grade: parsed.grade || 'Grade 10',
        };
      }
    } catch {
      // fallback
    }
    return {
      name: 'Maryam',
      avatar: null,
      grade: 'Grade 10',
    };
  });

  const updateProfile = (updated: UserProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem('mr_mohamed_physics_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleStartSession = (lessonNumber: string) => {
    const found = lessonsList.find((l) => l.number === lessonNumber);
    if (found) {
      setActiveSession(found);
    }
  };

  const handleCompleteSession = (lessonNumber: string) => {
    setLessonsList((prev) =>
      prev.map((l) => (l.number === lessonNumber ? { ...l, completed: true } : l))
    );
  };

  const handleOpenQuiz = (sessionNumber: string) => {
    const quiz = sampleQuizzes[sessionNumber] || sampleQuizzes['02'];
    setActiveQuiz(quiz);
  };

  const handleSaveQuizResult = (quizId: string, score: number, total: number) => {
    setQuizScores((prev) => ({
      ...prev,
      [quizId]: { score, total, completed: true },
    }));
  };

  return authed ? (
    <Dashboard
      profile={profile}
      onUpdateProfile={updateProfile}
      view={view}
      onViewChange={setView}
      lessons={lessonsList}
      activeSession={activeSession}
      activeQuiz={activeQuiz}
      quizScores={quizScores}
      onStartSession={handleStartSession}
      onCloseSession={() => setActiveSession(null)}
      onCompleteSession={handleCompleteSession}
      onOpenQuiz={handleOpenQuiz}
      onCloseQuiz={() => setActiveQuiz(null)}
      onSaveQuizResult={handleSaveQuizResult}
      onSignOut={() => setAuthed(false)}
    />
  ) : (
    <AuthScreen onSuccess={() => setAuthed(true)} />
  );
}

function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fillDemo = () => {
    setUsername(VALID_USERNAME);
    setPassword(VALID_PASSWORD);
    setNotice('');
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('');
    if (username.trim().toLowerCase() !== VALID_USERNAME || password !== VALID_PASSWORD) {
      setNotice('That username or password is not quite right.');
      return;
    }
    setBusy(true);
    onSuccess();
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-card">
          <header className="auth-card-top">
            <div className="auth-brand">
              <img src="/assets/logo/LOGO_MR_M_ABOELNAGA-BLACK.png" alt="Mohammed Aboelnaga Physics" />
            </div>
            <div className="auth-course-badge">
              <GraduationCap size={15} />
              <span>IGCSE Physics · 2024/2025</span>
            </div>
          </header>

          <div className="auth-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> With Mr. Mohamed AboelNaga</div>
            <h1>Learn with<br /><em>momentum.</em></h1>
            <p>Everything you need to understand physics, all in one focused space. Sign in to enter your classroom and continue where you left off.</p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            <label>
              <span>Username</span>
              <div className="auth-input">
                <User size={17} />
                <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your username (default: maryam)" required autoFocus />
              </div>
            </label>
            <label>
              <span>Password</span>
              <div className="auth-input">
                <Lock size={17} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password (default: 0000)" required />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            {notice && <div className="auth-notice">{notice}</div>}
            <button className="primary-button auth-submit" type="submit" disabled={busy}>
              {busy ? 'Opening your classroom...' : 'Enter classroom'}
              <ArrowRight size={18} />
            </button>
            <button type="button" className="auth-demo-hint" onClick={fillDemo}>
              <Sparkles size={13} />
              <span>Click to autofill student demo credentials</span>
            </button>
          </form>

          <footer className="auth-card-footer">
            <span>Cambridge &amp; Edexcel IGCSE</span>
            <span className="footer-bullet">·</span>
            <span>Official Student Portal</span>
          </footer>
        </div>
      </section>

      <section className="auth-visual">
        <img src="/assets/images/Gemini_Generated_Image_23v4mp23v4mp23v4.jpeg" alt="Physics teacher in a classroom" />
        <div className="visual-wash" />
        <div className="visual-top-chip">
          <Sparkles size={14} />
          <span>Cambridge IGCSE Physics · Syllabus 0625</span>
        </div>
        <div className="visual-caption">
          <span className="caption-num">01</span>
          <div>
            <p>"Physics is not about memorising formulas.</p>
            <strong>It is about seeing the world differently."</strong>
            <span className="caption-author">— Mr. Mohamed AboelNaga</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function Dashboard({
  profile,
  onUpdateProfile,
  view,
  onViewChange,
  lessons,
  activeSession,
  activeQuiz,
  quizScores,
  onStartSession,
  onCloseSession,
  onCompleteSession,
  onOpenQuiz,
  onCloseQuiz,
  onSaveQuizResult,
  onSignOut,
}: {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  view: View;
  onViewChange: (view: View) => void;
  lessons: Lesson[];
  activeSession: Lesson | null;
  activeQuiz: QuizData | null;
  quizScores: Record<string, { score: number; total: number; completed: boolean }>;
  onStartSession: (id: string) => void;
  onCloseSession: () => void;
  onCompleteSession: (id: string) => void;
  onOpenQuiz: (id: string) => void;
  onCloseQuiz: () => void;
  onSaveQuizResult: (id: string, score: number, total: number) => void;
  onSignOut: () => void;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // If a video session is currently active, render the dedicated Video Classroom Theater
  if (activeSession) {
    return (
      <VideoSessionClassroom
        lesson={activeSession}
        onBack={onCloseSession}
        onComplete={() => {
          onCompleteSession(activeSession.number);
        }}
        onTakeQuiz={() => {
          onCloseSession();
          onOpenQuiz(activeSession.number);
        }}
      />
    );
  }

  return (
    <div className="app-shell app-shell--entering">
      <aside className={`sidebar ${mobileMenu ? 'sidebar--open' : ''}`}>
        <div className="side-brand">
          <img src="/assets/logo/LOGO_MR_M_ABOELNAGA-BLACK.png" alt="Mohammed Aboelnaga" />
        </div>
        <div className="course-chip">
          <div className="course-icon"><GraduationCap size={19} /></div>
          <div>
            <strong>IGCSE Physics</strong>
            <span>{profile.grade} · 2024/2025</span>
          </div>
        </div>
        <nav className="side-nav">
          <span className="nav-label">Workspace</span>
          <NavButton
            icon={<LayoutDashboard size={18} />}
            label="Overview"
            active={view === 'dashboard'}
            onClick={() => { onViewChange('dashboard'); setMobileMenu(false); }}
          />
          <NavButton
            icon={<Play size={18} />}
            label="My sessions"
            active={view === 'sessions'}
            onClick={() => { onViewChange('sessions'); setMobileMenu(false); }}
          />
          <NavButton
            icon={<Award size={18} />}
            label="Quizzes & exams"
            active={view === 'quizzes'}
            onClick={() => { onViewChange('quizzes'); setMobileMenu(false); }}
          />

          <span className="nav-label nav-label--second">Your space</span>
          <NavButton
            icon={<Target size={18} />}
            label="My progress"
            active={view === 'progress'}
            onClick={() => { onViewChange('progress'); setMobileMenu(false); }}
          />
          <NavButton
            icon={<Users size={18} />}
            label="Class community"
            active={view === 'community'}
            badge="Live"
            onClick={() => { onViewChange('community'); setMobileMenu(false); }}
          />
        </nav>

        <div className="side-bottom">
          <div className="streak-card">
            <div className="streak-top">
              <Flame size={17} fill="currentColor" />
              <span>Learning streak</span>
            </div>
            <strong>6 days</strong>
            <p>Keep the momentum going.</p>
            <div className="streak-dots">
              <i /><i /><i /><i /><i /><i className="muted" /><i className="muted" />
            </div>
          </div>
          <button className="signout-button" onClick={onSignOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open navigation">
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              {view === 'dashboard'
                ? 'Overview'
                : view === 'sessions'
                ? 'My sessions'
                : view === 'quizzes'
                ? 'Quizzes & exams'
                : view === 'progress'
                ? 'My progress'
                : 'Class community'}
            </strong>
          </div>
          <div className="top-actions">
            <div className="topbar-profile-anchor">
              <button
                type="button"
                className={`topbar-profile-trigger ${profileModalOpen ? 'topbar-profile-trigger--active' : ''}`}
                onClick={() => setProfileModalOpen((prev) => !prev)}
                title="Student Profile & Settings"
                aria-label="Student Profile & Settings"
                aria-expanded={profileModalOpen}
              >
                <div className="avatar-wrapper">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="avatar-img" />
                  ) : (
                    <div className="avatar">{profile.name.slice(0, 2).toUpperCase()}</div>
                  )}
                  <span className="avatar-edit-badge"><Camera size={9} /></span>
                </div>
                <div className="topbar-user-info">
                  <strong className="topbar-user-name">{profile.name}</strong>
                  <span className="topbar-user-grade">{profile.grade}</span>
                </div>
                <ChevronDown size={14} className={`profile-chevron ${profileModalOpen ? 'profile-chevron--open' : ''}`} />
              </button>

              {profileModalOpen && (
                <SquareProfileModal
                  profile={profile}
                  onClose={() => setProfileModalOpen(false)}
                  onSave={(updated) => {
                    onUpdateProfile(updated);
                    setProfileModalOpen(false);
                  }}
                  onSignOut={onSignOut}
                />
              )}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {view === 'dashboard' && (
            <Overview
              profile={profile}
              lessons={lessons}
              onViewChange={onViewChange}
              onStartLesson={onStartSession}
              onOpenQuiz={() => onOpenQuiz('02')}
              quizDone={!!quizScores['02']?.completed}
            />
          )}
          {view === 'sessions' && (
            <Sessions
              lessons={lessons}
              onStart={onStartSession}
            />
          )}
          {view === 'quizzes' && (
            <Quizzes
              quizScores={quizScores}
              onOpen={onOpenQuiz}
            />
          )}
          {view === 'progress' && <ProgressView />}
          {view === 'community' && <CommunityView profile={profile} />}
        </main>
      </div>

      {activeQuiz && (
        <EnhancedOpenFormQuiz
          quiz={activeQuiz}
          onClose={onCloseQuiz}
          onSaveResult={(score, total) => {
            onSaveQuizResult(activeQuiz.sessionNumber, score, total);
          }}
        />
      )}
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button className={`nav-button ${active ? 'nav-button--active' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {badge && <span className="nav-pill-badge">{badge}</span>}
      {active && <i />}
    </button>
  );
}

function Overview({
  profile,
  lessons,
  onViewChange,
  onStartLesson,
  onOpenQuiz,
  quizDone,
}: {
  profile: UserProfile;
  lessons: Lesson[];
  onViewChange: (view: View) => void;
  onStartLesson: (id: string) => void;
  onOpenQuiz: () => void;
  quizDone: boolean;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> {getFormattedDate(now)} · {profile.grade}</div>
          <h2>{getGreeting(now)}, <em>{profile.name}.</em></h2>
          <p>Ready to make sense of something new today?</p>
        </div>
        <div className="goal-badge">
          <div className="goal-ring"><span>72%</span></div>
          <div>
            <strong>Course progress</strong>
            <span>You're on a great pace</span>
          </div>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard icon={<Clock3 size={18} />} label="Time learned" value="12.5" unit="hrs" detail="+2.4 hrs this week" tone="yellow" trend="up" />
        <StatCard icon={<Check size={18} />} label="Sessions attended" value="08" unit="/ 12" detail="67% of the course" tone="blue" trend="neutral" />
        <StatCard icon={<Trophy size={18} />} label="Quiz average" value="86" unit="%" detail="+8% from last month" tone="orange" trend="up" />
        <StatCard icon={<Flame size={18} />} label="Current streak" value="06" unit="days" detail="Your best: 12 days" tone="teal" trend="neutral" />
      </section>

      <section className="dashboard-grid">
        <div className="section-card continue-card">
          <div className="continue-banner">
            <div className="continue-banner-glow" />
            <div className="continue-banner-meta">
              <span className="continue-banner-tag"><Zap size={11} /> Session 03 · Mechanics</span>
              <button className="text-button continue-view-all" onClick={() => onViewChange('sessions')}>
                View all <ArrowRight size={13} />
              </button>
            </div>
            <h4 className="continue-banner-title">Energy &amp; Work</h4>
            <p className="continue-banner-sub">Discover how energy moves, changes and makes things happen.</p>
            <div className="continue-progress-wrap">
              <div className="continue-progress-bar"><i style={{ width: '24%' }} /></div>
              <span className="continue-progress-label">24% complete</span>
            </div>
          </div>
          <div className="continue-action-row">
            <button className="primary-button continue-cta" onClick={() => onStartLesson('03')}>
              <Play size={15} fill="currentColor" /> Continue Session
            </button>
            <div className="continue-stats">
              <span className="continue-stat-chip"><Clock3 size={12} /> 45 min total</span>
              <span className="continue-stat-chip continue-stat-chip--accent"><Zap size={12} /> ~34 min left</span>
            </div>
          </div>
        </div>

        <div className="section-card quiz-card">
          <div className="quiz-card-inner">
            <div className="quiz-card-header">
              <span className="quiz-card-kicker">
                <Zap size={11} fill="currentColor" /> Up next
              </span>
              {quizDone && <span className="quiz-done-badge"><Check size={11} /> Done</span>}
            </div>
            <h3 className="quiz-card-title">{quizDone ? 'Quiz completed' : 'Test your thinking'}</h3>
            <div className="quiz-pill-row">
              <div className="quiz-number">02</div>
              <div className="quiz-pill-info">
                <strong>Forces &amp; Dynamics Quiz</strong>
                <span>5 multi-part questions</span>
              </div>
            </div>
            <div className="quiz-meta-row">
              <span className="quiz-meta-chip"><Clock3 size={12} /> 10 min</span>
              <span className="quiz-meta-chip"><Target size={12} /> Chapter 2</span>
            </div>
            <button className="quiz-cta-btn" onClick={onOpenQuiz}>
              {quizDone ? 'Review Answers' : 'Start Quiz'} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="upcoming-card">
        <div className="upcoming-header">
          <div>
            <span className="card-kicker">Your roadmap</span>
            <h3 className="upcoming-title">Coming up in your course</h3>
          </div>
          <button className="text-button" onClick={() => onViewChange('sessions')}>
            See full roadmap <ArrowRight size={14} />
          </button>
        </div>
        <div className="roadmap-list">
          {lessons.map((lesson) => (
            <LessonRow key={lesson.number} lesson={lesson} onStart={onStartLesson} />
          ))}
        </div>
      </section>
    </>
  );
}
/* =========================================================================
   IMMERSIVE VIDEO SESSION CLASSROOM PLAYER
   ========================================================================= */
function VideoSessionClassroom({
  lesson,
  onBack,
  onComplete,
  onTakeQuiz,
}: {
  lesson: Lesson;
  onBack: () => void;
  onComplete: () => void;
  onTakeQuiz: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(140); // in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'chapters' | 'formulas' | 'resources'>('notes');
  const [completed, setCompleted] = useState(lesson.completed);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoCardRef = useRef<HTMLDivElement>(null);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Playback timer simulation
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= lesson.durationSeconds) {
            setIsPlaying(false);
            return lesson.durationSeconds;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, lesson.durationSeconds]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    setIsPlaying(true);
  };

  const handleToggleComplete = () => {
    const next = !completed;
    setCompleted(next);
    if (next) onComplete();
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoCardRef.current?.requestFullscreen().catch(() => {
        // Fallback
      });
    } else {
      document.exitFullscreen().catch(() => {
        // Fallback
      });
    }
  };

  const progressPercent = Math.min(100, (currentTime / lesson.durationSeconds) * 100);

  return (
    <div className="session-player-view">
      {/* Top Session Navigation Header */}
      <header className="player-topbar">
        <div className="player-topbar-left">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={16} /> Back to Sessions
          </button>
          <span className="player-meta-badge">
            Session {lesson.number} · {lesson.topic}
          </span>
        </div>
        <div className="player-topbar-right">
          <button
            className={`complete-toggle-btn ${completed ? 'complete-toggle-btn--done' : ''}`}
            onClick={handleToggleComplete}
          >
            <span className="complete-toggle-icon">
              {completed ? <Check size={13} strokeWidth={3} /> : <CheckCircle2 size={15} />}
            </span>
            <span>{completed ? 'Completed' : 'Mark as Complete'}</span>
          </button>
          <button className="topbar-quiz-btn" onClick={onTakeQuiz}>
            <span className="topbar-quiz-icon"><Zap size={14} fill="currentColor" /></span>
            Take Session Quiz
          </button>
        </div>
      </header>

      <div className="player-main-layout">
        {/* Left Column: Video Theater Screen & Controls */}
        <div className="player-theater-column">
          <div className="video-screen-card" ref={videoCardRef}>
            <div className="video-display-area">
              {/* Animated Physics Stage Background */}
              <div className="video-physics-backdrop">
                <div className="video-ambient-glow" />
                <div className="video-grid-lines" />
                <img
                  src="/assets/logo/LOGO_MR_M_ABOELNAGA.png"
                  alt="Mr. Mohamed Aboelnaga"
                  className="video-watermark-logo"
                />

                {/* Oscilloscope Frequency Bars when playing */}
                <div className={`video-audio-wave ${isPlaying ? 'video-audio-wave--active' : ''}`}>
                  <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                </div>

                {/* Center Teacher Callout Card */}
                <div className="video-teacher-card">
                  <div className="video-teacher-avatar">
                    <img src="/assets/logo/LOGO_MR_M_ABOELNAGA_ICON_ONLY.png" alt="Teacher" />
                  </div>
                  <div className="video-teacher-info">
                    <span className="video-teacher-tag">MR. MOHAMED ABOELNAGA · IGCSE PHYSICS</span>
                    <h4>{lesson.videoTitle}</h4>
                    <span className="video-status-text">
                      {isPlaying ? '▶ Video Stream Active · 1080p HD' : '⏸ Video Paused'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Center Play / Pause Click Overlay */}
              <button
                className="video-center-play-overlay"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={36} fill="currentColor" />}
              </button>
            </div>

            {/* Custom Interactive Player Scrubber Bar */}
            <div className="player-control-dock">
              <div
                className="player-scrubber-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  handleSeek(Math.floor(pos * lesson.durationSeconds));
                }}
              >
                <div className="scrubber-fill" style={{ width: `${progressPercent}%` }} />
                <div className="scrubber-head" style={{ left: `${progressPercent}%` }} />
              </div>

              <div className="player-controls-row">
                <div className="player-controls-left">
                  <button
                    className="ctrl-btn ctrl-btn--play"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                  </button>

                  <button
                    className="ctrl-btn"
                    onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                    title="Rewind 10 seconds"
                  >
                    <RotateCcw size={16} />
                  </button>

                  <div className="time-display">
                    <strong>{formatSeconds(currentTime)}</strong> / {lesson.duration}
                  </div>
                </div>

                <div className="player-controls-right">
                  {/* Speed Selector */}
                  <div className="speed-selector">
                    {[1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        className={`speed-pill ${playbackSpeed === s ? 'speed-pill--active' : ''}`}
                        onClick={() => setPlaybackSpeed(s)}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  <button
                    className="ctrl-btn"
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <button
                    className="ctrl-btn"
                    onClick={handleToggleFullscreen}
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>

                  <span className="hd-badge">1080p 60fps</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Header Below Video */}
          <div className="lesson-meta-card">
            <div className="lesson-meta-left">
              <div className="eyebrow"><span className="eyebrow-dot" /> Session {lesson.number} · {lesson.topic}</div>
              <h2 className="lesson-meta-title">{lesson.title}</h2>
              <p className="lesson-desc-full">{lesson.description}</p>
            </div>
            <div className="lesson-meta-right">
              <div className="lesson-meta-stat">
                <Clock3 size={14} />
                <span>{lesson.duration}</span>
              </div>
              <div className="lesson-meta-stat">
                <BookOpen size={14} />
                <span>{lesson.chapters?.length ?? 4} chapters</span>
              </div>
              <div className="lesson-meta-stat">
                <Zap size={14} />
                <span>{lesson.keyFormulas?.length ?? 3} formulas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Notes, Chapters, Formulas, Resources */}
        <aside className="player-sidebar-column">
          {/* Session progress strip */}
          <div className="sidebar-progress-strip">
            <div className="sidebar-progress-info">
              <span>Session progress</span>
              <strong>{Math.round(progressPercent)}%</strong>
            </div>
            <div className="sidebar-progress-bar">
              <i style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="player-tab-card">
            <div className="player-tabs-header">
              <button
                className={`player-tab-btn ${activeTab === 'notes' ? 'player-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <BookOpen size={14} /> Notes
              </button>
              <button
                className={`player-tab-btn ${activeTab === 'chapters' ? 'player-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('chapters')}
              >
                <Clock3 size={14} /> Chapters
              </button>
              <button
                className={`player-tab-btn ${activeTab === 'formulas' ? 'player-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('formulas')}
              >
                <Zap size={14} /> Formulas
              </button>
              <button
                className={`player-tab-btn ${activeTab === 'resources' ? 'player-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                <Download size={14} /> Files
              </button>
            </div>

            <div className="player-tab-content">
              {/* Tab 1: Lecture Notes */}
              {activeTab === 'notes' && (
                <div className="tab-pane-notes">
                  <div className="tab-section-heading">
                    <span className="tab-section-icon"><BookOpen size={13} /></span>
                    Key Takeaways
                  </div>
                  <ul className="notes-list">
                    {lesson.summaryNotes.map((note, idx) => (
                      <li key={idx} className="note-bullet">
                        <span className="note-bullet-num">{idx + 1}</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="teacher-tip-box">
                    <div className="tip-header">
                      <Sparkles size={14} />
                      <strong>Exam Tip from Mr. Mohamed</strong>
                    </div>
                    <p>
                      "In Cambridge Paper 2 and Paper 4, examiners always award a mark for stating the base equation before substituting numbers. Never skip writing the formula!"
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Timestamp Chapters */}
              {activeTab === 'chapters' && (
                <div className="tab-pane-chapters">
                  <div className="tab-section-heading">
                    <span className="tab-section-icon"><Clock3 size={13} /></span>
                    Video Chapters
                  </div>
                  <div className="chapters-list">
                    {lesson.chapters.map((ch, idx) => {
                      const isPassed = currentTime >= ch.seconds;
                      const isCurrent = currentTime >= ch.seconds && (idx === lesson.chapters.length - 1 || currentTime < lesson.chapters[idx + 1].seconds);
                      return (
                        <button
                          key={idx}
                          className={`chapter-item ${isPassed ? 'chapter-item--passed' : ''} ${isCurrent ? 'chapter-item--current' : ''}`}
                          onClick={() => handleSeek(ch.seconds)}
                        >
                          <span className="chapter-index">{String(idx + 1).padStart(2, '0')}</span>
                          <div className="chapter-text">
                            <span className="chapter-title">{ch.title}</span>
                            <span className="chapter-time">{ch.time}</span>
                          </div>
                          <Play size={11} className="chapter-play-icon" fill={isCurrent ? 'currentColor' : 'none'} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Key Formulas */}
              {activeTab === 'formulas' && (
                <div className="tab-pane-formulas">
                  <div className="tab-section-heading">
                    <span className="tab-section-icon"><Zap size={13} /></span>
                    Core Formulas
                  </div>
                  <div className="formula-cards-grid">
                    {lesson.keyFormulas.map((f, idx) => (
                      <div key={idx} className="formula-box">
                        <div className="formula-equation">{f.symbol}</div>
                        <span className="formula-desc">{f.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Downloadable PDF Resources */}
              {activeTab === 'resources' && (
                <div className="tab-pane-resources">
                  <h4>Session Downloads & Worksheets</h4>
                  <div className="resources-list">
                    {lesson.resources.map((res, idx) => (
                      <div key={idx} className="resource-item">
                        <FileText size={20} className="file-icon" />
                        <div className="resource-info">
                          <strong>{res.name}</strong>
                          <span>{res.type} · {res.size}</span>
                        </div>
                        <button
                          className="resource-dl-btn"
                          onClick={() => alert(`Downloading ${res.name}...`)}
                          title="Download file"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================================
   ENHANCED OPEN-FORM QUIZ ASSESSMENT SYSTEM
   ========================================================================= */
function EnhancedOpenFormQuiz({
  quiz,
  onClose,
  onSaveResult,
}: {
  quiz: QuizData;
  onClose: () => void;
  onSaveResult: (score: number, total: number) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitMinutes * 60);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = quiz.questions[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = quiz.questions.length;

  const handleSelectOption = (label: string) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: label });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    onSaveResult(correct, totalCount);
  };

  // Calculate final score
  let score = 0;
  if (isSubmitted) {
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });
  }

  const scorePercentage = Math.round((score / totalCount) * 100);

  // Scroll to selected question
  const scrollToQuestion = (idx: number) => {
    setCurrentIdx(idx);
    if (isSubmitted) {
      setTimeout(() => {
        const el = document.getElementById(`review-q-${idx}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  };

  return (
    <div className="modal-backdrop modal-backdrop--fullscreen" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="enhanced-quiz-container">
        {/* Quiz Top Navigation Bar */}
        <header className="quiz-header-bar">
          <div className="quiz-header-left">
            <button className="modal-close-round" onClick={onClose} title="Exit quiz">
              <X size={18} />
            </button>
            <div className="quiz-teacher-thumb">
              <img src="/assets/logo/LOGO_MR_M_ABOELNAGA_ICON_ONLY.png" alt="Mr. Mohamed" />
            </div>
            <div>
              <span className="quiz-session-tag">SESSION {quiz.sessionNumber} · {quiz.topic}</span>
              <h3>{quiz.title}</h3>
            </div>
          </div>

          <div className="quiz-header-right">
            {!isSubmitted && (
              <div className="quiz-timer-pill">
                <Clock3 size={15} />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
            <div className="quiz-progress-counter">
              <strong>{answeredCount}</strong> / {totalCount} answered
            </div>
          </div>
        </header>

        {/* Top Progress Bar */}
        <div className="quiz-top-progress-track">
          <i style={{ width: `${(answeredCount / totalCount) * 100}%` }} />
        </div>

        {/* Question Index Progress Tracker */}
        <div className="quiz-question-nav-strip">
          <div className="nav-strip-left">
            <span className="nav-strip-tag">{isSubmitted ? 'ASSESSMENT BREAKDOWN' : 'QUESTIONS MAP'}</span>
            <strong>{isSubmitted ? `${score} of ${totalCount} Questions Correct` : `${answeredCount} of ${totalCount} Answered`}</strong>
          </div>

          <div className="nav-pills-row">
            {quiz.questions.map((q, idx) => {
              const isAnswered = !!selectedAnswers[q.id];
              const isCurrent = currentIdx === idx;
              const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctAnswer;
              const isWrong = isSubmitted && selectedAnswers[q.id] !== q.correctAnswer;

              let statusClass = '';
              if (isSubmitted) {
                statusClass = isCorrect ? 'q-dot--correct' : 'q-dot--wrong';
              } else if (isCurrent) {
                statusClass = 'q-dot--current';
              } else if (isAnswered) {
                statusClass = 'q-dot--answered';
              }

              return (
                <button
                  key={q.id}
                  className={`q-index-pill ${statusClass}`}
                  onClick={() => scrollToQuestion(idx)}
                  title={isSubmitted ? `Question ${idx + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}` : `Go to Question ${idx + 1}`}
                >
                  <span className="pill-num">Q{idx + 1}</span>
                  {isSubmitted ? (
                    isCorrect ? <Check size={12} className="pill-ico" /> : <X size={12} className="pill-ico" />
                  ) : (
                    isAnswered && <Check size={10} className="pill-ico pill-ico--done" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Quiz Body */}
        <div className="quiz-body-scrollable">
          {!isSubmitted ? (
            /* Active Form Mode */
            <div className="quiz-question-card">
              <div className="question-meta-row">
                <span className="question-num-badge">Question {currentIdx + 1} of {totalCount}</span>
                {currentQ.formulaHint && (
                  <span className="formula-hint-badge">
                    <Sparkles size={13} /> <strong>Hint:</strong> {currentQ.formulaHint}
                  </span>
                )}
              </div>

              <h3 className="question-text-title">{currentQ.question}</h3>

              <div className="question-options-grid">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.label;
                  return (
                    <button
                      key={opt.label}
                      className={`option-card ${isSelected ? 'option-card--selected' : ''}`}
                      onClick={() => handleSelectOption(opt.label)}
                    >
                      <div className="option-label-circle">{opt.label}</div>
                      <span className="option-text">{opt.text}</span>
                      {isSelected && <Check size={18} className="option-check-icon" />}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Form Actions */}
              <div className="quiz-form-footer">
                <button
                  className="outline-button nav-q-btn"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => prev - 1)}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {currentIdx < totalCount - 1 ? (
                  <button
                    className="primary-button nav-q-btn"
                    onClick={() => setCurrentIdx((prev) => prev + 1)}
                  >
                    Next Question <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    className="primary-button submit-quiz-btn"
                    onClick={handleSubmit}
                  >
                    Submit Quiz Form <Zap size={16} fill="currentColor" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Post-Submission Review Mode */
            <div className="quiz-results-view">
              {/* Score Banner */}
              <div className="quiz-score-banner">
                <div className="score-badge-circle">
                  <strong>{scorePercentage}%</strong>
                </div>
                <div className="score-details">
                  <div className="score-details-top">
                    <h3>{scorePercentage >= 80 ? 'Outstanding Work! 🎯' : scorePercentage >= 50 ? 'Good Effort! Keep Pushing 📚' : 'Review & Strengthen Your Concepts ⚡'}</h3>
                    <span className="score-marks-tag">{score} / {totalCount} Marks Earned</span>
                  </div>
                  <p>
                    {scorePercentage >= 80 
                      ? 'You have mastered the core dynamics principles for this session!' 
                      : 'Study the step-by-step formula derivations and teacher tips from Mr. Mohamed Aboelnaga below to lock in the rules.'}
                  </p>
                </div>
                <div className="score-actions">
                  <button
                    className="primary-button retake-btn"
                    onClick={() => {
                      setSelectedAnswers({});
                      setIsSubmitted(false);
                      setTimeLeft(quiz.timeLimitMinutes * 60);
                      setCurrentIdx(0);
                    }}
                  >
                    <RotateCcw size={15} /> Retake Quiz
                  </button>
                  <button className="outline-button finish-btn" onClick={onClose}>
                    Done Reviewing
                  </button>
                </div>
              </div>

              {/* Review Filter Tabs */}
              <div className="review-filter-strip">
                <span className="filter-label">Filter Questions:</span>
                <button
                  className={`filter-pill ${currentIdx === -1 ? 'filter-pill--active' : ''}`}
                  onClick={() => setCurrentIdx(-1)}
                >
                  All Questions ({totalCount})
                </button>
                <button
                  className="filter-pill filter-pill--correct"
                  onClick={() => {
                    const firstCorrect = quiz.questions.findIndex((q) => selectedAnswers[q.id] === q.correctAnswer);
                    if (firstCorrect !== -1) setCurrentIdx(firstCorrect);
                  }}
                >
                  <Check size={12} /> Correct ({score})
                </button>
                <button
                  className="filter-pill filter-pill--wrong"
                  onClick={() => {
                    const firstWrong = quiz.questions.findIndex((q) => selectedAnswers[q.id] !== q.correctAnswer);
                    if (firstWrong !== -1) setCurrentIdx(firstWrong);
                  }}
                >
                  <X size={12} /> Incorrect ({totalCount - score})
                </button>
              </div>

              {/* Detailed Breakdown for All Questions */}
              <div className="questions-review-list">
                {quiz.questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div key={q.id} id={`review-q-${idx}`} className={`section-card review-question-card ${isCorrect ? 'review-card--correct' : 'review-card--wrong'}`}>
                      <div className="review-header">
                        <div className="review-num-tag">
                          {isCorrect ? (
                            <span className="status-icon-wrap status-icon-wrap--correct">
                              <Check size={14} />
                            </span>
                          ) : (
                            <span className="status-icon-wrap status-icon-wrap--wrong">
                              <X size={14} />
                            </span>
                          )}
                          <div>
                            <strong>Question {idx + 1}</strong>
                            <span className="q-topic-sub">{quiz.topic}</span>
                          </div>
                        </div>
                        <span className={`status-pill ${isCorrect ? 'status-pill--pass' : 'status-pill--fail'}`}>
                          {isCorrect ? '+1 Mark (Correct)' : `0 Marks (Incorrect · Correct is ${q.correctAnswer})`}
                        </span>
                      </div>

                      <h4 className="review-q-text">{q.question}</h4>

                      {/* Options Grid with Clear Color Badges */}
                      <div className="review-options-list">
                        {q.options.map((opt) => {
                          const isUserChoice = userAnswer === opt.label;
                          const isCorrectChoice = q.correctAnswer === opt.label;

                          let cardState = '';
                          if (isCorrectChoice) cardState = 'opt-review--correct';
                          else if (isUserChoice && !isCorrectChoice) cardState = 'opt-review--wrong';

                          return (
                            <div key={opt.label} className={`opt-review-item ${cardState}`}>
                              <span className="opt-review-label">{opt.label}</span>
                              <span className="opt-review-text">{opt.text}</span>
                              {isCorrectChoice && (
                                <span className="correct-tag">
                                  <Check size={12} /> Correct Answer
                                </span>
                              )}
                              {isUserChoice && !isCorrectChoice && (
                                <span className="your-tag">
                                  <X size={12} /> Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Enhanced Pedagogical Solution Box */}
                      <div className="instructor-explanation-box">
                        <div className="explanation-header">
                          <div className="teacher-badge-mini">
                            <img src="/assets/logo/LOGO_MR_M_ABOELNAGA_ICON_ONLY.png" alt="Teacher" />
                          </div>
                          <div>
                            <strong>Mr. Mohamed Aboelnaga's Solution & Physics Rule</strong>
                            <span>Cambridge IGCSE Masterclass Method</span>
                          </div>
                        </div>

                        {/* Core Physics Rule Banner */}
                        {q.keyRule && (
                          <div className="solution-rule-banner">
                            <Sparkles size={14} className="rule-sparkle" />
                            <div>
                              <span className="rule-label">KEY PHYSICS PRINCIPLE:</span>
                              <strong>{q.keyRule}</strong>
                            </div>
                          </div>
                        )}

                        {/* Formula Used Equation Pill */}
                        {q.formulaUsed && (
                          <div className="solution-formula-strip">
                            <span className="formula-kicker">Formula & Derivation:</span>
                            <code>{q.formulaUsed}</code>
                          </div>
                        )}

                        {/* Step-by-Step Derivation Steps */}
                        {q.stepByStep && q.stepByStep.length > 0 && (
                          <div className="solution-steps-block">
                            <span className="steps-title">Step-by-Step Working:</span>
                            <ol className="solution-steps-list">
                              {q.stepByStep.map((step, sIdx) => (
                                <li key={sIdx}>
                                  <span className="step-num">{sIdx + 1}</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Explanation Narrative */}
                        <div className="explanation-narrative">
                          <p>{q.explanation}</p>
                        </div>

                        {/* Exam Trap Warning Box */}
                        {q.commonMistake && (
                          <div className="common-trap-box">
                            <AlertCircle size={15} className="trap-icon" />
                            <div>
                              <strong>EXAM TIP & PITFALL TO AVOID:</strong>
                              <p>{q.commonMistake}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ENHANCED PROFILE POPOVER & EDIT CARD
   ========================================================================= */
function SquareProfileModal({
  profile,
  onClose,
  onSave,
  onSignOut,
}: {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
  onSignOut?: () => void;
}) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const [isSaved, setIsSaved] = useState(false);
  const grade = profile.grade || 'Grade 10';
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      onSave({
        name: name.trim() || 'Student',
        avatar,
        grade,
      });
    }, 350);
  };

  return (
    <>
      <div className="profile-backdrop-scrim" onClick={onClose} />
      <div className="profile-flyout-card" onClick={(e) => e.stopPropagation()}>
        <div className="profile-popover-caret" />

        {/* Header - close button only */}
        <div className="profile-popover-header">
          <button
            type="button"
            className="profile-close-icon-btn"
            onClick={onClose}
            aria-label="Close profile menu"
          >
            <X size={15} />
          </button>
        </div>

        {/* Enhanced Avatar Pod */}
        <div className="profile-hero-pod">
          <div
            className="profile-hero-avatar-wrap"
            onClick={() => fileInputRef.current?.click()}
            title="Click to change profile photo"
          >
            {avatar ? (
              <img src={avatar} alt="Profile" className="profile-hero-avatar-img" />
            ) : (
              <div className="profile-hero-avatar-placeholder">
                <span>{name.slice(0, 2).toUpperCase() || 'ST'}</span>
              </div>
            )}
            <div className="profile-hero-avatar-hover">
              <Camera size={18} />
              <span>Change</span>
            </div>
            <span className="profile-hero-avatar-badge" title="Change photo">
              <Camera size={11} />
            </span>
          </div>

          <div className="profile-hero-details">
            <div className="profile-hero-name-row">
              <h3 className="profile-hero-display-name">{name || 'Student'}</h3>
              <span className="profile-student-chip">Enrolled</span>
            </div>
            <span className="profile-hero-grade-text">
              Mr. Mohamed Physics • {grade}
            </span>
            <div className="profile-avatar-actions">
              <button
                type="button"
                className="profile-pill-action-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={12} /> {avatar ? 'Change photo' : 'Upload photo'}
              </button>
              {avatar && (
                <button
                  type="button"
                  className="profile-pill-action-btn profile-pill-action-btn--remove"
                  onClick={handleRemovePhoto}
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* Form Body with Options */}
        <form onSubmit={handleSubmit} className="profile-popover-form">
          <div className="profile-input-field">
            <label htmlFor="profile-student-name">
              <User size={13} className="field-icon" />
              <span>Full Name</span>
            </label>
            <input
              id="profile-student-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="profile-input-field">
            <div className="field-label-static">
              <GraduationCap size={13} className="field-icon" />
              <span>Academic Level</span>
            </div>
            <div className="profile-academic-pill">
              <div className="academic-icon-bubble">
                <GraduationCap size={15} />
              </div>
              <div className="academic-text-col">
                <strong>{grade}</strong>
                <span>Secondary School Curriculum</span>
              </div>
              <span className="academic-verified-tag">
                <Lock size={11} /> Teacher Assigned
              </span>
            </div>
          </div>

          {/* Quick Academic Progress Stats */}
          <div className="profile-quick-stats">
            <div className="profile-stat-cell">
              <strong>24</strong>
              <span>Sessions</span>
            </div>
            <div className="profile-stat-separator" />
            <div className="profile-stat-cell">
              <strong>98%</strong>
              <span>Completed</span>
            </div>
            <div className="profile-stat-separator" />
            <div className="profile-stat-cell">
              <strong>94%</strong>
              <span>Avg Quiz</span>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="profile-popover-actions">
            <button
              type="button"
              className="profile-btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`profile-btn-submit ${isSaved ? 'profile-btn-submit--saved' : ''}`}
            >
              {isSaved ? (
                <>
                  <Check size={14} /> Saved
                </>
              ) : (
                <>
                  <Save size={14} /> Save Profile
                </>
              )}
            </button>
          </div>

          {onSignOut && (
            <div className="profile-popover-footer">
              <button
                type="button"
                className="profile-signout-btn"
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
              >
                <LogOut size={13} />
                <span>Log Out of Student Account</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

/* =========================================================================
   CLASS COMMUNITY VIEW
   ========================================================================= */
function CommunityView({ profile }: { profile: UserProfile }) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [activeTopic, setActiveTopic] = useState<string>('All');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTopic, setNewTopic] = useState('Physics Question');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [showReplyBoxMap, setShowReplyBoxMap] = useState<Record<string, boolean>>({});

  const topics = ['All', 'Announcements', 'Mechanics', 'Kinematics', 'Exam Tips'];

  const filteredPosts = activeTopic === 'All'
    ? posts
    : posts.filter((p) => p.topic.toLowerCase() === activeTopic.toLowerCase());

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: profile.name,
      avatar: profile.avatar,
      time: 'Just now',
      topic: newTopic,
      title: newTitle.trim(),
      content: newContent.trim(),
      likes: 1,
      liked: true,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
  };

  const handleToggleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const liked = !post.liked;
          return {
            ...post,
            liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: profile.name,
      avatar: profile.avatar,
      time: 'Just now',
      text: text.trim(),
    };

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, comment] };
        }
        return p;
      })
    );

    setReplyTextMap({ ...replyTextMap, [postId]: '' });
  };

  return (
    <div className="page-view community-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Collaborative Learning</div>
          <h2>Class <em>Community.</em></h2>
          <p>Ask physics questions, discuss challenging exam problems, and get direct help from Mr. Mohamed Aboelnaga.</p>
        </div>
      </div>

      <div className="community-layout-grid">
        <div className="community-feed-area">
          <div className="section-card post-composer-card">
            <div className="composer-header">
              <div className="composer-avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  profile.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <span className="composer-kicker">Ask a question or start a discussion</span>
            </div>
            <form onSubmit={handleCreatePost} className="composer-form">
              <input
                className="composer-title-input"
                placeholder="Title: e.g. How to solve Question 3 in Forces in Balance?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <textarea
                className="composer-textarea"
                rows={3}
                placeholder="Write your explanation or question in detail..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
              />
              <div className="composer-footer">
                <div className="composer-topic-selector">
                  <span>Topic:</span>
                  <select value={newTopic} onChange={(e) => setNewTopic(e.target.value)}>
                    <option value="Physics Question">💡 Physics Question</option>
                    <option value="Mechanics">⚡ Mechanics & Energy</option>
                    <option value="Kinematics">📈 Kinematics & Graphs</option>
                    <option value="Exam Tips">🎯 Exam Strategy</option>
                  </select>
                </div>
                <button type="submit" className="primary-button composer-submit-btn">
                  <Send size={14} /> Post to Class
                </button>
              </div>
            </form>
          </div>

          <div className="community-filters">
            {topics.map((t) => (
              <button
                key={t}
                className={`filter-pill ${activeTopic === t ? 'filter-pill--active' : ''}`}
                onClick={() => setActiveTopic(t)}
              >
                {t === 'Announcements' && <Pin size={12} />}
                {t}
              </button>
            ))}
          </div>

          <div className="community-posts-list">
            {filteredPosts.map((post) => (
              <div key={post.id} className={`section-card community-post-card ${post.pinned ? 'post-card--pinned' : ''}`}>
                {post.pinned && (
                  <div className="pinned-badge">
                    <Pin size={13} /> Pinned by Mr. Mohamed Aboelnaga
                  </div>
                )}
                <div className="post-header">
                  <div className="post-author-block">
                    <div className={`post-avatar ${post.isTeacher ? 'post-avatar--teacher' : ''}`}>
                      {post.isTeacher ? (
                        <img src="/assets/logo/LOGO_MR_M_ABOELNAGA_ICON_ONLY.png" alt="Mr. Aboelnaga" />
                      ) : post.avatar ? (
                        <img src={post.avatar} alt={post.author} />
                      ) : (
                        post.author.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="author-name-line">
                        <strong>{post.author}</strong>
                        {post.isTeacher && <span className="teacher-verified-badge">Teacher</span>}
                      </div>
                      <span className="post-time">{post.time} · <span className="post-topic-tag">{post.topic}</span></span>
                    </div>
                  </div>
                </div>

                <h4 className="post-title">{post.title}</h4>
                <p className="post-content">{post.content}</p>

                <div className="post-actions-bar">
                  <button
                    className={`post-action-btn ${post.liked ? 'post-action-btn--liked' : ''}`}
                    onClick={() => handleToggleLike(post.id)}
                  >
                    <ThumbsUp size={15} fill={post.liked ? 'currentColor' : 'none'} />
                    <span>{post.likes} Helpful</span>
                  </button>
                  <button
                    className="post-action-btn"
                    onClick={() =>
                      setShowReplyBoxMap({
                        ...showReplyBoxMap,
                        [post.id]: !showReplyBoxMap[post.id],
                      })
                    }
                  >
                    <MessageCircle size={15} />
                    <span>{post.comments.length} Replies</span>
                  </button>
                </div>

                <div className="post-comments-wrapper">
                  {post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className={`comment-avatar ${comment.isTeacher ? 'comment-avatar--teacher' : ''}`}>
                            {comment.isTeacher ? (
                              <img src="/assets/logo/LOGO_MR_M_ABOELNAGA_ICON_ONLY.png" alt="Teacher" />
                            ) : comment.avatar ? (
                              <img src={comment.avatar} alt={comment.author} />
                            ) : (
                              comment.author.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div className="comment-body">
                            <div className="comment-header">
                              <strong>{comment.author}</strong>
                              {comment.isTeacher && <span className="teacher-verified-badge">Teacher</span>}
                              <span className="comment-time">{comment.time}</span>
                            </div>
                            <p>{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(showReplyBoxMap[post.id] || post.comments.length > 0) && (
                    <div className="add-reply-row">
                      <input
                        placeholder="Write a helpful reply or follow-up question..."
                        value={replyTextMap[post.id] || ''}
                        onChange={(e) =>
                          setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                      />
                      <button
                        type="button"
                        className="primary-button reply-send-btn"
                        onClick={() => handleAddComment(post.id)}
                      >
                        <Send size={13} /> Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="community-sidebar-area">
          <div className="section-card teacher-hub-card">
            <div className="teacher-hub-header">
              <img src="/assets/logo/LOGO_MR_M_ABOELNAGA_ICON_ONLY.png" alt="Mr. Aboelnaga" className="hub-logo" />
              <div>
                <strong>Mr. Mohamed Aboelnaga</strong>
                <span>Lead Physics Instructor</span>
              </div>
            </div>
            <div className="office-hours-banner">
              <span className="live-pulse-dot" />
              <div>
                <strong>Live Checkpoint Q&A</strong>
                <p>Wednesdays @ 5:00 PM (Cairo Time)</p>
              </div>
            </div>
            <p className="hub-desc">Got stuck on complex kinematics formulas? Ask during office hours or tag Mr. Mohamed in the community feed.</p>
          </div>

          <div className="section-card active-students-card">
            <div className="card-heading">
              <div>
                <span className="card-kicker">Study Hub</span>
                <h3>Active Classmates</h3>
              </div>
              <span className="online-count">5 online</span>
            </div>
            <div className="students-list">
              {[
                { name: profile.name, avatar: profile.avatar, status: 'Learning Energy & Work', isYou: true },
                { name: 'Youssef Khalil', avatar: null, status: 'Practicing Kinematics Quiz' },
                { name: 'Layla Hassan', avatar: null, status: 'Reviewing Session 02' },
                { name: 'Omar Samir', avatar: null, status: 'Viewing Roadmap' },
                { name: 'Kareem Tarek', avatar: null, status: 'In Exam Review' },
              ].map((student, idx) => (
                <div key={idx} className="student-row">
                  <div className="student-avatar-ring">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.name} />
                    ) : (
                      <span>{student.name.slice(0, 2).toUpperCase()}</span>
                    )}
                    <span className="online-green-dot" />
                  </div>
                  <div className="student-details">
                    <strong>{student.name} {student.isYou && <small>(You)</small>}</strong>
                    <span>{student.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================================
   PROGRESS VIEW
   ========================================================================= */
function ProgressView() {
  const units = [
    { title: 'Kinematics & Motion Graphs', mastery: 95, sessions: '2/2 completed', status: 'Mastered' },
    { title: 'Dynamics & Forces in Balance', mastery: 88, sessions: '2/2 completed', status: 'Mastered' },
    { title: 'Energy, Work & Power', mastery: 24, sessions: 'In progress', status: 'Active' },
    { title: 'Thermal Physics & Kinetic Theory', mastery: 0, sessions: 'Upcoming', status: 'Locked' },
    { title: 'Waves, Light & Optics', mastery: 0, sessions: 'Upcoming', status: 'Locked' },
    { title: 'Electricity & Magnetism', mastery: 0, sessions: 'Upcoming', status: 'Locked' },
  ];

  return (
    <div className="page-view progress-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Academic Analytics</div>
          <h2>My <em>Progress.</em></h2>
          <p>Track your syllabus mastery, quiz scores, and preparation readiness for the IGCSE physics exam.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={<Trophy size={18} />} label="Syllabus Mastery" value="48" unit="%" detail="Target: 100% by Nov" tone="yellow" />
        <StatCard icon={<Check size={18} />} label="Average Quiz Score" value="86" unit="%" detail="Above class average" tone="blue" />
        <StatCard icon={<Flame size={18} />} label="Learning Streak" value="06" unit="days" detail="Best streak: 12 days" tone="orange" />
        <StatCard icon={<Clock3 size={18} />} label="Total Hours Learned" value="12.5" unit="hrs" detail="Top 10% in class" tone="teal" />
      </div>

      <div className="section-card syllabus-breakdown-card">
        <div className="card-heading">
          <div>
            <span className="card-kicker">Curriculum Breakdown</span>
            <h3>IGCSE Physics Topic Mastery</h3>
          </div>
        </div>
        <div className="units-list">
          {units.map((unit, idx) => (
            <div key={idx} className="unit-item">
              <div className="unit-header">
                <div>
                  <strong>{unit.title}</strong>
                  <span className="unit-sessions">{unit.sessions}</span>
                </div>
                <span className={`unit-badge unit-badge--${unit.status.toLowerCase()}`}>
                  {unit.status} · {unit.mastery}%
                </span>
              </div>
              <div className="unit-progress-track">
                <i style={{ width: `${unit.mastery}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  detail,
  tone,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  detail: string;
  tone: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card-top">
        <div className={`stat-icon stat-icon--${tone}`}>{icon}</div>
        {trend && trend !== 'neutral' && (
          <span className={`stat-trend stat-trend--${trend}`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          </span>
        )}
      </div>
      <span className="stat-label">{label}</span>
      <div className="stat-value">{value}<small>{unit}</small></div>
      <span className="stat-detail">{detail}</span>
    </div>
  );
}

function LessonRow({
  lesson,
  onStart,
}: {
  lesson: Lesson;
  onStart: (id: string) => void;
}) {
  const statusClass = lesson.completed ? 'done' : 'pending';
  return (
    <div className={`lesson-row lesson-row--${statusClass}`}>
      <div className={`lesson-status-bar lesson-status-bar--${lesson.accent}`} />
      <div className={`lesson-number lesson-number--${lesson.accent}`}>
        {lesson.completed ? <Check size={15} /> : lesson.number}
      </div>
      <div className="lesson-title">
        <strong>{lesson.title}</strong>
        <span>{lesson.topic}</span>
      </div>
      <div className="lesson-row-right">
        <span className="lesson-duration"><Clock3 size={12} /> {lesson.duration}</span>
        <button className={`lesson-cta-btn lesson-cta-btn--${statusClass}`} onClick={() => onStart(lesson.number)}>
          {lesson.completed
            ? <><RotateCcw size={12} /> Watch again</>
            : <><Play size={12} fill="currentColor" /> Start session</>
          }
        </button>
      </div>
    </div>
  );
}

function Sessions({
  lessons,
  onStart,
}: {
  lessons: Lesson[];
  onStart: (id: string) => void;
}) {
  const completedCount = lessons.filter((l) => l.completed).length;

  return (
    <div className="page-view">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> The learning path</div>
          <h2>Every session, <em>one step forward.</em></h2>
          <p>Short, focused lessons designed to make complex ideas feel simple.</p>
        </div>
        <div className="sessions-complete">
          <strong>{completedCount} <small>/ 12</small></strong>
          <span>sessions complete</span>
        </div>
      </div>
      <div className="session-hero">
        <div>
          <span className="card-kicker">Featured session</span>
          <h3>Energy & Work</h3>
          <p>Learn why nothing in physics truly disappears — it only changes form.</p>
          <button className="primary-button" onClick={() => onStart('03')}>
            <Play size={16} fill="currentColor" /> Enter Video Session
          </button>
        </div>
        <div className="formula">W = F · d</div>
      </div>
      <div className="section-card roadmap-page-card">
        <div className="card-heading">
          <div>
            <span className="card-kicker">Course roadmap</span>
            <h3>All Video Sessions</h3>
          </div>
          <span className="session-count">12 sessions</span>
        </div>
        <div className="roadmap-list">
          {lessons.map((lesson) => (
            <LessonRow key={lesson.number} lesson={lesson} onStart={onStart} />
          ))}
          {['Circular Motion', 'Thermal Physics'].map((title, index) => (
            <LessonRow
              key={title}
              lesson={{
                number: `0${index + 5}`,
                title,
                topic: 'Coming soon',
                duration: '—',
                durationSeconds: 0,
                completed: false,
                accent: 'teal',
                description: 'Upcoming chapter in IGCSE syllabus.',
                videoTitle: title,
                keyFormulas: [],
                summaryNotes: [],
                chapters: [],
                resources: [],
              }}
              onStart={onStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Quizzes({
  quizScores,
  onOpen,
}: {
  quizScores: Record<string, { score: number; total: number; completed: boolean }>;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="page-view">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Check your understanding</div>
          <h2>Practice that <em>moves you forward.</em></h2>
          <p>Open interactive exam forms to test your thinking with step-by-step formula feedback.</p>
        </div>
      </div>
      <div className="quiz-overview-grid">
        <div className="exam-banner">
          <div className="exam-label"><span className="live-dot" /> Monthly exam</div>
          <h3>Mechanics<br /><em>checkpoint</em></h3>
          <p>Coming up in 12 days. Revise your first three sessions and you'll be ready.</p>
          <div className="exam-date">
            <strong>28</strong>
            <span>SEP<br /><small>2024</small></span>
          </div>
          <button className="outline-button outline-button--light" onClick={() => onOpen('02')}>
            Open Exam Form <ArrowRight size={15} />
          </button>
        </div>

        <div className="section-card quiz-list-card">
          <div className="card-heading">
            <div>
              <span className="card-kicker">Interactive Assessment Forms</span>
              <h3>Session Quizzes</h3>
            </div>
            <Gauge size={21} className="muted-icon" />
          </div>

          <div className="quiz-item">
            <div className="quiz-item-icon"><Zap size={17} /></div>
            <div>
              <strong>Session 01 Quiz: Motion & Graphs</strong>
              <span>5 questions · {quizScores['01'] ? `Score: ${quizScores['01'].score}/${quizScores['01'].total} (${Math.round((quizScores['01'].score / quizScores['01'].total) * 100)}%)` : 'Not attempted'}</span>
            </div>
            <button className="mini-action" onClick={() => onOpen('02')}>
              <Edit3 size={14} /> Review Form
            </button>
          </div>

          <div className="quiz-item">
            <div className="quiz-item-icon quiz-item-icon--blue"><Zap size={17} /></div>
            <div>
              <strong>Session 02 Quiz: Forces in Balance</strong>
              <span>5 questions · {quizScores['02'] ? `Score: ${quizScores['02'].score}/${quizScores['02'].total} (${Math.round((quizScores['02'].score / quizScores['02'].total) * 100)}%)` : 'Open Form'}</span>
            </div>
            <button className="mini-action" onClick={() => onOpen('02')}>
              <Play size={14} fill="currentColor" /> {quizScores['02'] ? 'Review Form' : 'Start Form'}
            </button>
          </div>

          <div className="quiz-item">
            <div className="quiz-item-icon quiz-item-icon--orange"><Zap size={17} /></div>
            <div>
              <strong>Session 03 Quiz: Energy & Work</strong>
              <span>3 questions · {quizScores['03'] ? `Score: ${quizScores['03'].score}/${quizScores['03'].total}` : 'Open Form'}</span>
            </div>
            <button className="mini-action" onClick={() => onOpen('03')}>
              <Play size={14} fill="currentColor" /> Open Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
