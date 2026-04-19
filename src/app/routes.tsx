import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { LessonDetail } from './pages/LessonDetail';
import { Interviews } from './pages/Interviews';
import { Research } from './pages/Research';
import { ThreadDetail } from './pages/ThreadDetail';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'courses', Component: Courses },
      { path: 'courses/:id', Component: CourseDetail },
      { path: 'courses/:courseId/lessons/:lessonId', Component: LessonDetail },
      { path: 'interviews', Component: Interviews },
      { path: 'research', Component: Research },
      { path: 'research/:id', Component: ThreadDetail },
      { path: 'profile', Component: Profile },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
]);