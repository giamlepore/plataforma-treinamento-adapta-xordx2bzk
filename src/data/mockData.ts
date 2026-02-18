export interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted?: boolean
  isLocked?: boolean
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
  duration: string
  imageQuery: string
  imageColor?: string
  modules: Module[]
}

export const courses: Course[] = [
  {
    id: 'COURSE_01',
    title: 'Smart Betting 101',
    description:
      'Master the fundamentals of smart betting. Learn how to read odds, understand probability, and manage your bankroll effectively to maximize your long-term success.',
    instructor: 'A. Silva',
    duration: '4h 30m',
    imageQuery: 'library books study',
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
    description:
      'Learn to use data analytics to make informed betting decisions. Move beyond gut feeling and trust the numbers.',
    instructor: 'Dr. Ray',
    duration: '6h 15m',
    imageQuery: 'stock market chart',
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
    description:
      'Psychology plays a huge role in betting. Learn how to control emotions, handle losing streaks, and maintain discipline.',
    instructor: 'S. De Haan',
    duration: '3h 20m',
    imageQuery: 'brain synapses abstract',
    imageColor: 'black',
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
    description:
      'Advanced strategies to find value bets and arbitrage opportunities across different bookmakers.',
    instructor: 'M. Kneebone',
    duration: '8h 00m',
    imageQuery: 'chess strategy board',
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
    description:
      'Advanced strategies for managing risk in professional betting environments. Hedging, arbitrage, and more.',
    instructor: 'N. Mihaljevic',
    duration: '12h 45m',
    imageQuery: 'financial safe vault',
    imageColor: 'yellow',
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
    description:
      'Build and deploy automated betting systems using APIs and bots.',
    instructor: 'Bot Labs',
    duration: '5h 30m',
    imageQuery: 'futuristic hud interface',
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
