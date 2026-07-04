import { Video, Playlist } from "./types";

export const CURATED_VIDEOS: Video[] = [
  // --- MATHEMATICS ---
  {
    id: "WUvTyaaNkzM",
    title: "The Essence of Calculus: Chapter 1",
    channelTitle: "3Blue1Brown",
    category: "Math",
    duration: "17:01",
    description: "The goal here is for you to feel like you could have invented calculus yourself. We'll start with a classic geometry problem: finding the area of a circle, and see how it leads to derivatives and integrals.",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "fNk_zzaMoEs",
    title: "Vectors | Essence of Linear Algebra",
    channelTitle: "3Blue1Brown",
    category: "Math",
    duration: "9:52",
    description: "What is a vector, really? This video introduces the three distinct perspectives of vectors: the physics student perspective, the computer science perspective, and the mathematician's perspective, bridging them with linear combinations.",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r6SgUy68YB4",
    title: "But what is a Fourier series? From heat flow to drawing circles",
    channelTitle: "3Blue1Brown",
    category: "Math",
    duration: "24:47",
    description: "An animated introduction to Fourier Series: how rotating vectors/circles can draw any shape, and why this is connected to solving physical partial differential equations like the heat equation.",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400"
  },

  // --- PHYSICS & ASTRONOMY ---
  {
    id: "XRr1kaXgV8M",
    title: "Why Gravity is NOT a Force",
    channelTitle: "Veritasium",
    category: "Physics",
    duration: "17:34",
    description: "According to Albert Einstein's General Theory of Relativity, gravity is not a force pulling things down, but rather the bending of space-time. This video visualizes why astronauts in space are actually in free-fall and feel weightless.",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "p-MNSLsjjdo",
    title: "The Quantum Experiment that Broke Reality",
    channelTitle: "Veritasium",
    category: "Physics",
    duration: "21:13",
    description: "Exploring the famous Double Slit Experiment and its mind-bending variations (quantum eraser, delayed-choice), showing how the act of observing waves and particles changes their fundamental physical behaviors.",
    thumbnailUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "yWO-cvGETRQ",
    title: "The Size of Black Holes (Scale Comparison)",
    channelTitle: "Kurzgesagt – In a Nutshell",
    category: "Physics",
    duration: "5:54",
    description: "Black holes are some of the most mysterious and extreme entities in the cosmos. Let's compare the sizes of different black holes, from stellar-mass ones to primordial microscopic ones and supermassive behemoths.",
    thumbnailUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=400"
  },

  // --- CHEMISTRY & BIOLOGY ---
  {
    id: "hQpQ0hxVNTg",
    title: "Unit Conversion & Significant Figures: Crash Course Chemistry",
    channelTitle: "CrashCourse",
    category: "Chemistry",
    duration: "11:24",
    description: "In this inaugural episode, Hank Green talks about why chemistry is worth studying, explains dimensional analysis (unit conversion), and details why keeping track of significant figures is vital for scientists.",
    thumbnailUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "QnQe0xW_JY4",
    title: "Carbon... SO MUCH CARBON! Crash Course Biology #1",
    channelTitle: "CrashCourse",
    category: "Biology",
    duration: "12:35",
    description: "And so begins the story of life! Hank Green introduces us to organic molecules, why Carbon is so versatile and chemically friendly, and the major classes of macromolecules: carbohydrates, lipids, proteins, and nucleic acids.",
    thumbnailUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "H8WJ2KENlK0",
    title: "DNA Structure and Replication: Crash Course Biology #10",
    channelTitle: "CrashCourse",
    category: "Biology",
    duration: "12:59",
    description: "Hank introduces us to that famous double helix, DNA. Learn how nucleotide bonds structure our genetic code, and how RNA primers, DNA polymerase, helicase, and ligase replicate our DNA during cell division.",
    thumbnailUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&q=80&w=400"
  },

  // --- COMPUTER SCIENCE ---
  {
    id: "rfscVS0vtbw",
    title: "Learn Python - Full Course for Beginners",
    channelTitle: "freeCodeCamp.org",
    category: "Computer Science",
    duration: "4:26:52",
    description: "This comprehensive tutorial will teach you the fundamentals of Python programming. Perfect for absolute beginners, it covers variables, loops, lists, functions, classes, and building basic programs like a calculator.",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "pQN-pnXPaVg",
    title: "HTML Full Course - Build a Website",
    channelTitle: "freeCodeCamp.org",
    category: "Computer Science",
    duration: "2:02:32",
    description: "Learn the core markup language of the web. This HTML crash course covers semantic elements, forms, links, media embeds, and best practices for responsive structure and accessibility.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400"
  },

  // --- HISTORY & HUMANITIES ---
  {
    id: "Yocja_N5s1I",
    title: "The Agricultural Revolution: Crash Course World History #1",
    channelTitle: "CrashCourse",
    category: "History",
    duration: "11:11",
    description: "John Green explores how humanity transitioned from nomadic hunting and gathering to sedentary farming, looking at the costs, benefits, and societal structures that emerged around agriculture.",
    thumbnailUrl: "https://images.unsplash.com/photo-1464207687529-14f84524858d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "bL6b4b45_60",
    title: "The Rise and Fall of the Byzantine Empire",
    channelTitle: "TED-Ed",
    category: "History",
    duration: "5:39",
    description: "Explore the 1,000-year history of the Byzantine Empire, from Roman foundations in Constantinople to the Justinian Code, theological schisms, and its eventual conquest by the Ottoman Empire in 1453.",
    thumbnailUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=400"
  }
];

export const PRESET_PLAYLISTS: Playlist[] = [
  {
    id: "p1",
    name: "Mathematics Foundation",
    description: "Master the essentials of math, calculus, and linear algebra with rich animations and visual deep-dives.",
    videoIds: ["WUvTyaaNkzM", "fNk_zzaMoEs", "r6SgUy68YB4"],
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "p2",
    name: "Quantum & Cosmological Physics",
    description: "Embark on an intellectual journey through quantum relativity, black holes, and deep universe mechanics.",
    videoIds: ["XRr1kaXgV8M", "p-MNSLsjjdo", "yWO-cvGETRQ"],
    createdAt: "2026-01-02T00:00:00Z"
  },
  {
    id: "p3",
    name: "Crash Course Organic Biology",
    description: "Understand the biochemical carbon-based foundations of life, DNA double helixes, replication, and transcription.",
    videoIds: ["QnQe0xW_JY4", "H8WJ2KENlK0"],
    createdAt: "2026-01-03T00:00:00Z"
  },
  {
    id: "p4",
    name: "Web & Software Engineering",
    description: "Kickstart your coding journey by learning Python programming fundamentals and building standard responsive web structures.",
    videoIds: ["rfscVS0vtbw", "pQN-pnXPaVg"],
    createdAt: "2026-01-04T00:00:00Z"
  }
];

export const CATEGORIES = [
  "All",
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History"
];
