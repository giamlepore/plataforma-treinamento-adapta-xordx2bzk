export interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted?: boolean
  isLocked?: boolean
  isTest?: boolean
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar?: string
  duration: string
  imageQuery: string
  imageColor?: string
  modules: Module[]
  rating?: number
  reviews?: number
  label?: string
  enrolled?: boolean
}

export const courses: Course[] = [
  {
    id: 'COURSE_FIGMA',
    title: 'Mastering Figma in 7 days unleashed',
    description:
      'Embark on a transformative journey into the dynamic realm of web development with our Front-End Development course. This immersive course is designed for aspiring developers, creative minds, and tech enthusiasts ready to unlock the full potential of the front-end landscape.',
    instructor: 'Albert Flores',
    instructorAvatar:
      'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    duration: '4hr 12 min',
    imageQuery: 'figma interface design',
    imageColor: 'orange',
    label: 'Product Design',
    rating: 4.8,
    reviews: 221,
    enrolled: true,
    modules: [
      {
        id: 'MOD_01',
        title: 'Get Started with Figma Basics',
        lessons: [
          {
            id: 'L_01',
            title: 'Introduction to Figma',
            duration: '02:15:24',
            isCompleted: true,
          },
          {
            id: 'L_02',
            title: "Utilizing Figma's Powerful Features",
            duration: '02:15:24',
            isCompleted: true,
          },
          {
            id: 'L_03',
            title: 'Mastering Autolayout',
            duration: '02:15:24',
            isLocked: true,
          },
          {
            id: 'L_04',
            title: 'Topical examination',
            duration: '02:15:24',
            isLocked: true,
            isTest: true,
          },
        ],
      },
      {
        id: 'MOD_02',
        title: 'Figma components',
        lessons: [
          {
            id: 'L_05',
            title: 'Component Properties',
            duration: '45:00',
            isLocked: true,
          },
          {
            id: 'L_06',
            title: 'Variants and State',
            duration: '55:00',
            isLocked: true,
          },
        ],
      },
      {
        id: 'MOD_03',
        title: 'Create your own design system',
        lessons: [
          {
            id: 'L_07',
            title: 'Color Styles',
            duration: '35:00',
            isLocked: true,
          },
          {
            id: 'L_08',
            title: 'Typography',
            duration: '40:00',
            isLocked: true,
          },
        ],
      },
    ],
  },
  {
    id: 'COURSE_01',
    title: 'Smart Betting 101',
    label: 'Fundamentals',
    description:
      'Master the fundamentals of smart betting. Learn how to read odds, understand probability, and manage your bankroll effectively to maximize your long-term success.',
    instructor: 'A. Silva',
    duration: '4h 30m',
    imageQuery: 'library books study',
    rating: 4.5,
    reviews: 120,
    modules: [
      {
        id: 'MOD_01',
        title: 'Introduction to Betting',
        lessons: [
          {
            id: 'L_01',
            title: 'Understanding Odds Formats',
            duration: '15:00',
            isCompleted: true,
          },
          {
            id: 'L_02',
            title: 'Probability Basics',
            duration: '20:00',
            isCompleted: true,
          },
          { id: 'L_03', title: 'Types of Bets', duration: '12:00' },
        ],
      },
      {
        id: 'MOD_02',
        title: 'Bankroll Management',
        lessons: [
          { id: 'L_04', title: 'Setting a Budget', duration: '18:00' },
          { id: 'L_05', title: 'Staking Plans', duration: '25:00' },
          { id: 'L_06', title: 'ROI vs Yield', duration: '14:00' },
        ],
      },
    ],
  },
  {
    id: 'COURSE_02',
    title: 'Data-Driven Decisions',
    label: 'Analytics',
    description:
      'Learn to use data analytics to make informed betting decisions. Move beyond gut feeling and trust the numbers.',
    instructor: 'Dr. Ray',
    duration: '6h 15m',
    imageQuery: 'stock market chart',
    rating: 4.7,
    reviews: 85,
    modules: [
      {
        id: 'MOD_01',
        title: 'Data Sources',
        lessons: [
          { id: 'L_01', title: 'Finding Reliable Data', duration: '22:00' },
          { id: 'L_02', title: 'Scraping Odds', duration: '30:00' },
        ],
      },
      {
        id: 'MOD_02',
        title: 'Analysis Techniques',
        lessons: [
          { id: 'L_03', title: 'Trend Analysis', duration: '45:00' },
          { id: 'L_04', title: 'Statistical Models', duration: '50:00' },
        ],
      },
    ],
  },
  {
    id: 'COURSE_03',
    title: 'Mindset of a Winner',
    label: 'Psychology',
    description:
      'Psychology plays a huge role in betting. Learn how to control emotions, handle losing streaks, and maintain discipline.',
    instructor: 'S. De Haan',
    duration: '3h 20m',
    imageQuery: 'brain synapses abstract',
    imageColor: 'black',
    rating: 4.9,
    reviews: 310,
    modules: [
      {
        id: 'MOD_01',
        title: 'Psychology Basics',
        lessons: [
          { id: 'L_01', title: 'Emotional Control', duration: '20:00' },
          { id: 'L_02', title: "The Gambler's Fallacy", duration: '15:00' },
        ],
      },
    ],
  },
  {
    id: 'COURSE_04',
    title: 'Arbitrage & Value',
    label: 'Advanced Strategy',
    description:
      'Advanced strategies to find value bets and arbitrage opportunities across different bookmakers.',
    instructor: 'M. Kneebone',
    duration: '8h 00m',
    imageQuery: 'chess strategy board',
    rating: 4.6,
    reviews: 98,
    modules: [
      {
        id: 'MOD_01',
        title: 'Value Betting',
        lessons: [
          { id: 'L_01', title: 'Defining Value', duration: '30:00' },
          {
            id: 'L_02',
            title: 'Calculating Expected Value',
            duration: '40:00',
          },
        ],
      },
    ],
  },
  {
    id: 'COURSE_05',
    title: 'Professional Risk Management',
    label: 'Featured Masterclass',
    description:
      'Advanced strategies for managing risk in professional betting environments. Hedging, arbitrage, and more.',
    instructor: 'N. Mihaljevic',
    duration: '12h 45m',
    imageQuery: 'financial safe vault',
    imageColor: 'yellow',
    rating: 5.0,
    reviews: 42,
    modules: [
      {
        id: 'MOD_01',
        title: 'Risk Assessment',
        lessons: [
          { id: 'L_01', title: 'Quantifying Risk', duration: '45:00' },
          { id: 'L_02', title: 'Hedging Strategies', duration: '50:00' },
        ],
      },
    ],
  },
  {
    id: 'COURSE_06',
    title: 'Automated Systems',
    label: 'Technology',
    description:
      'Build and deploy automated betting systems using APIs and bots.',
    instructor: 'Bot Labs',
    duration: '5h 30m',
    imageQuery: 'futuristic hud interface',
    rating: 4.4,
    reviews: 67,
    modules: [
      {
        id: 'MOD_01',
        title: 'Automation Basics',
        lessons: [
          { id: 'L_01', title: 'API Integration', duration: '35:00' },
          { id: 'L_02', title: 'Bot Logic', duration: '45:00' },
        ],
      },
    ],
  },
]
