import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Course from './src/models/Course.js';
import Lesson from './src/models/Lesson.js';
import Interview from './src/models/Interview.js';
import { Thread } from './src/models/Thread.js';
import Contribution from './src/models/Contribution.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Interview.deleteMany({});
    await Thread.deleteMany({});
    await Contribution.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const instructor1 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'instructor',
      bio: 'UX/UI Designer & HCI Expert',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    });

    const instructor2 = await User.create({
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: 'password123',
      role: 'instructor',
      bio: 'Web Developer & Course Creator',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    });

    const student1 = await User.create({
      name: 'Emma Wilson',
      email: 'emma@example.com',
      password: 'password123',
      role: 'student',
      bio: 'Learning HCI Design',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    });

    const student2 = await User.create({
      name: 'Alex Patel',
      email: 'alex@example.com',
      password: 'password123',
      role: 'student',
      bio: 'UX/UI Enthusiast',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    });

    console.log('Created sample users');

    // Create sample courses
    const course1 = await Course.create({
      title: 'Introduction to HCI Design',
      description: 'Learn the fundamentals of Human-Computer Interaction design principles.',
      instructor: instructor1._id,
      category: 'Design',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
      duration: '8 weeks',
      price: 49.99,
      rating: 4.8,
      ratingCount: 342,
      tags: ['HCI', 'Design', 'UX'],
      isPublished: true,
      enrolledStudents: [student1._id, student2._id],
    });

    const course2 = await Course.create({
      title: 'Advanced Interaction Design',
      description: 'Master advanced techniques in interactive systems design.',
      instructor: instructor1._id,
      category: 'Design',
      level: 'Advanced',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
      duration: '10 weeks',
      price: 79.99,
      rating: 4.9,
      ratingCount: 128,
      tags: ['Interaction', 'Design', 'Advanced'],
      isPublished: true,
      enrolledStudents: [student1._id],
    });

    const course3 = await Course.create({
      title: 'Web Development Fundamentals',
      description: 'Build modern web applications with HTML, CSS, and JavaScript.',
      instructor: instructor2._id,
      category: 'Development',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
      duration: '12 weeks',
      price: 59.99,
      rating: 4.7,
      ratingCount: 567,
      tags: ['Web', 'Development', 'JavaScript'],
      isPublished: true,
      enrolledStudents: [student2._id],
    });

    // Update instructor's courses
    instructor1.createdCourses = [course1._id, course2._id];
    instructor2.createdCourses = [course3._id];
    instructor1.enrolledCourses = [];
    instructor2.enrolledCourses = [];

    student1.enrolledCourses = [course1._id, course2._id];
    student2.enrolledCourses = [course1._id, course3._id];

    await instructor1.save();
    await instructor2.save();
    await student1.save();
    await student2.save();

    console.log('Created sample courses');

    // Create sample lessons
    const lesson1 = await Lesson.create({
      title: 'Understanding User Needs',
      description: 'Learn how to identify and understand user requirements.',
      course: course1._id,
      content: 'This lesson covers user research methods, interviews, and surveys.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 45,
      order: 1,
      isPublished: true,
    });

    const lesson2 = await Lesson.create({
      title: 'Wireframing and Prototyping',
      description: 'Create wireframes and prototypes for your designs.',
      course: course1._id,
      content: 'Learn to use Figma, Adobe XD, and other design tools.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 60,
      order: 2,
      isPublished: true,
    });

    const lesson3 = await Lesson.create({
      title: 'HTML Basics',
      description: 'Get started with HTML markup.',
      course: course3._id,
      content: 'Learn semantic HTML, elements, attributes, and best practices.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 50,
      order: 1,
      isPublished: true,
    });

    course1.lessons = [lesson1._id, lesson2._id];
    course3.lessons = [lesson3._id];
    await course1.save();
    await course3.save();

    console.log('Created sample lessons');

    // Create sample interviews
    const interview1 = await Interview.create({
      title: 'Design Ethics in Modern Digital Products',
      description: 'An in-depth conversation about ethical design considerations.',
      interviewee: {
        name: 'Jane Smith',
        title: 'Design Director at Tech Corp',
        bio: 'Expert in ethical design and user privacy',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      transcript: 'Jane discusses the importance of ethical considerations in design...',
      topics: ['Ethics', 'Design', 'Privacy'],
      duration: 45,
      isPublished: true,
      views: 1250,
    });

    const interview2 = await Interview.create({
      title: 'The Future of Web Design',
      description: 'Industry leaders discuss upcoming trends in web design.',
      interviewee: {
        name: 'Tom Anderson',
        title: 'Lead Designer at Design Studio',
        bio: 'Passionate about innovative design solutions',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
      },
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      transcript: 'Tom shares insights about AI-assisted design tools...',
      topics: ['Web Design', 'AI', 'Trends'],
      duration: 52,
      isPublished: true,
      views: 856,
    });

    console.log('Created sample interviews');

    // Create sample threads
    const thread1 = await Thread.create({
      title: 'Best practices for accessibility in HCI',
      description: 'Discussion about implementing accessibility features.',
      content:
        'What are the best practices for making interfaces accessible to everyone? I would like to discuss WCAG guidelines and real examples.',
      author: student1._id,
      course: course1._id,
      category: 'Discussion',
      tags: ['Accessibility', 'Best Practices'],
      views: 234,
      isPinned: true,
      comments: [
        {
          author: instructor1._id,
          content: 'Great question! Always start with semantic HTML and proper color contrast.',
        },
      ],
    });

    const thread2 = await Thread.create({
      title: 'Help with prototype testing methods',
      description: 'Asking for advice on user testing.',
      content: 'Can anyone suggest effective methods for testing interactive prototypes?',
      author: student2._id,
      course: course1._id,
      category: 'Question',
      tags: ['Testing', 'Prototyping'],
      views: 156,
      isPinned: false,
      comments: [
        {
          author: student1._id,
          content: 'I recommend moderated user testing sessions.',
        },
      ],
    });

    console.log('Created sample threads');

    // Create sample contributions
    const contribution1 = await Contribution.create({
      title: 'Open Source HCI Design Framework',
      description: 'A comprehensive framework for building user-centered designs.',
      contributor: instructor1._id,
      type: 'Tool',
      content: 'This framework provides components and guidelines for HCI design.',
      link: 'https://github.com/example/hci-framework',
      tags: ['Framework', 'Open Source', 'Design'],
      views: 543,
      status: 'approved',
    });

    const contribution2 = await Contribution.create({
      title: 'Research Paper: User Experience in Mobile Apps',
      description: 'Latest findings on mobile UX trends.',
      contributor: student1._id,
      type: 'Research',
      content: 'A comprehensive study of current UX practices in mobile applications.',
      link: 'https://example.com/research-paper.pdf',
      tags: ['Research', 'Mobile', 'UX'],
      views: 234,
      status: 'pending',
    });

    console.log('Created sample contributions');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
