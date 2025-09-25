import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AnimationRoute from './components/animationroute/AnimationRoute';
import { useEffect } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { QuizProvider } from './components/quiz/QuizContext';
import { AuthProvider } from './components/auth/AuthContext';

function App() {
  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch((error) => {
        console.error('Error signing in anonymously:', error);
      });
  }, []); 

  return (
    <BrowserRouter>
      <AuthProvider>
        <QuizProvider>
          <AnimationRoute />
        </QuizProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
