// Mock data for the platform

export interface User {
  id: string;
  name: string;
  role: 'creator' | 'contributor' | 'learner';
  contributionCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
}

export interface Contribution {
  id: string;
  title: string;
  content: string;
  contributor: User;
  createdAt: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'Notes' | 'Paper' | 'Resource';
  link: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  creator: User;
  lessons: Lesson[];
  contributions: Contribution[];
  materials: Material[];
}

export interface Interview {
  id: string;
  company: string;
  questions: string[];
  tips: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  author: User;
  createdAt: string;
}

export interface ThreadReply {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  description: string;
  link?: string;
  author: User;
  replies: ThreadReply[];
  createdAt: string;
}

// Mock users
export const mockUsers: User[] = [
  { id: '1', name: 'Sarah Chen', role: 'creator', contributionCount: 24 },
  { id: '2', name: 'Alex Kumar', role: 'contributor', contributionCount: 18 },
  { id: '3', name: 'Emma Wilson', role: 'creator', contributionCount: 31 },
  { id: '4', name: 'James Lee', role: 'contributor', contributionCount: 12 },
  { id: '5', name: 'Maria Garcia', role: 'learner', contributionCount: 5 },
];

// Mock courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React including components, hooks, and state management.',
    creator: mockUsers[0],
    lessons: [
      { id: 'l1', title: 'Getting Started with React', content: 'Learn how to set up your first React application with Create React App or Vite. We\'ll cover the project structure, configuration files, and how to start your development server. Understanding the basics of JSX syntax and how React components work is crucial for building modern web applications.', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk', order: 1 },
      { id: 'l2', title: 'Understanding Components', content: 'Components are the building blocks of React applications. Learn about functional and class components, props, and component composition. We\'ll explore how to break down your UI into reusable pieces and manage component lifecycle.', videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0', order: 2 },
      { id: 'l3', title: 'State and Props', content: 'Managing data flow in React applications through state and props. Understand the difference between local state and props, when to use each, and how data flows from parent to child components.', videoUrl: 'https://www.youtube.com/embed/IYvD9oBCuJI', order: 3 },
      { id: 'l4', title: 'React Hooks Deep Dive', content: 'Exploring useState, useEffect, and custom hooks. Learn how to manage side effects, fetch data, and create your own reusable hooks for complex logic.', videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0', order: 4 },
    ],
    contributions: [
      {
        id: 'c1',
        title: 'Advanced Hook Patterns',
        content: 'Here are some advanced patterns I\'ve discovered when working with custom hooks in production applications...',
        contributor: mockUsers[1],
        createdAt: '2026-03-25',
      },
      {
        id: 'c2',
        title: 'Performance Optimization Tips',
        content: 'After working on several large React apps, I found these optimization techniques particularly useful...',
        contributor: mockUsers[3],
        createdAt: '2026-03-28',
      },
    ],
    materials: [
      { id: 'm1', title: 'React Official Documentation', type: 'Resource', link: 'https://react.dev' },
      { id: 'm2', title: 'Component Design Patterns', type: 'Notes', link: '#' },
      { id: 'm3', title: 'React Performance Research Paper', type: 'Paper', link: '#' },
    ],
  },
  {
    id: '2',
    title: 'Modern CSS Techniques',
    description: 'Master modern CSS including Grid, Flexbox, animations, and responsive design.',
    creator: mockUsers[2],
    lessons: [
      { id: 'l5', title: 'CSS Grid Fundamentals', content: 'Understanding the power of CSS Grid...', order: 1 },
      { id: 'l6', title: 'Flexbox Mastery', content: 'Creating flexible layouts with Flexbox...', order: 2 },
      { id: 'l7', title: 'CSS Animations', content: 'Bringing your designs to life with animations...', order: 3 },
    ],
    contributions: [
      {
        id: 'c3',
        title: 'Grid vs Flexbox - When to Use What',
        content: 'Based on my experience, here\'s a practical guide on choosing between Grid and Flexbox...',
        contributor: mockUsers[0],
        createdAt: '2026-03-20',
      },
    ],
    materials: [
      { id: 'm4', title: 'CSS Grid Complete Guide', type: 'Resource', link: '#' },
      { id: 'm5', title: 'Animation Best Practices', type: 'Notes', link: '#' },
    ],
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive guide to data structures and algorithms with practical examples.',
    creator: mockUsers[0],
    lessons: [
      { id: 'l8', title: 'Arrays and Strings', content: 'Fundamental operations on arrays and strings...', order: 1 },
      { id: 'l9', title: 'Linked Lists', content: 'Understanding linked lists and their applications...', order: 2 },
      { id: 'l10', title: 'Trees and Graphs', content: 'Exploring tree and graph data structures...', order: 3 },
    ],
    contributions: [],
    materials: [
      { id: 'm6', title: 'Big O Notation Cheat Sheet', type: 'Notes', link: '#' },
    ],
  },
  {
    id: '4',
    title: 'System Design Fundamentals',
    description: 'Learn how to design scalable systems and prepare for system design interviews.',
    creator: mockUsers[2],
    lessons: [
      { id: 'l11', title: 'Scalability Basics', content: 'Understanding horizontal and vertical scaling...', order: 1 },
      { id: 'l12', title: 'Database Design', content: 'SQL vs NoSQL and when to use each...', order: 2 },
    ],
    contributions: [
      {
        id: 'c4',
        title: 'Microservices Architecture Insights',
        content: 'After building microservices at scale, here are key learnings...',
        contributor: mockUsers[1],
        createdAt: '2026-03-15',
      },
    ],
    materials: [
      { id: 'm7', title: 'System Design Primer', type: 'Resource', link: '#' },
      { id: 'm8', title: 'CAP Theorem Explained', type: 'Paper', link: '#' },
    ],
  },
];

// Mock interviews
export const mockInterviews: Interview[] = [
  {
    id: 'i1',
    company: 'Google',
    questions: [
      'Design a URL shortener service',
      'Implement LRU Cache',
      'Binary Tree Maximum Path Sum',
    ],
    tips: 'Focus on clarifying requirements first. They care a lot about edge cases and scalability.',
    difficulty: 'Hard',
    author: mockUsers[0],
    createdAt: '2026-03-20',
  },
  {
    id: 'i2',
    company: 'Meta',
    questions: [
      'Design Instagram feed',
      'Valid Parentheses',
      'Merge Intervals',
    ],
    tips: 'Be ready to discuss trade-offs. They value communication as much as the solution.',
    difficulty: 'Medium',
    author: mockUsers[1],
    createdAt: '2026-03-22',
  },
  {
    id: 'i3',
    company: 'Amazon',
    questions: [
      'Two Sum',
      'Reverse Linked List',
      'Design a parking lot',
    ],
    tips: 'Use the STAR method for behavioral questions. Technical questions focus on fundamentals.',
    difficulty: 'Medium',
    author: mockUsers[3],
    createdAt: '2026-03-18',
  },
];

// Mock research threads
export const mockThreads: Thread[] = [
  {
    id: 't1',
    title: 'Impact of AI on Software Development',
    description: 'Let\'s discuss how AI tools are changing the way we write and review code.',
    link: 'https://example.com/ai-research',
    author: mockUsers[0],
    createdAt: '2026-03-15',
    replies: [
      {
        id: 'r1',
        content: 'I\'ve been using AI assistants for code reviews and it has significantly reduced bug detection time.',
        author: mockUsers[1],
        createdAt: '2026-03-16',
      },
      {
        id: 'r2',
        content: 'Interesting findings! I published a paper on this topic last year. The productivity gains are real but we need to be cautious about code quality.',
        author: mockUsers[2],
        createdAt: '2026-03-17',
      },
    ],
  },
  {
    id: 't2',
    title: 'WebAssembly for Performance-Critical Apps',
    description: 'Exploring the use cases and benefits of WebAssembly in modern web applications.',
    author: mockUsers[2],
    createdAt: '2026-03-10',
    replies: [
      {
        id: 'r3',
        content: 'We migrated our image processing pipeline to WASM and saw 3x performance improvement.',
        author: mockUsers[3],
        createdAt: '2026-03-12',
      },
    ],
  },
  {
    id: 't3',
    title: 'Best Practices for API Rate Limiting',
    description: 'What are the most effective strategies for implementing rate limiting in distributed systems?',
    author: mockUsers[1],
    createdAt: '2026-03-25',
    replies: [],
  },
];

// Recent contributions (for home page)
export const recentContributions: Contribution[] = [
  mockCourses[0].contributions[1],
  mockCourses[0].contributions[0],
  mockCourses[1].contributions[0],
  mockCourses[3].contributions[0],
];