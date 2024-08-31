import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AnimationRoute from './components/animationroute/AnimationRoute';

function App() {
  return (
    <BrowserRouter>
      <AnimationRoute />
    </BrowserRouter>
  )
}

export default App
