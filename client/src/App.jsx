// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/DataContext';
import Login from './components/Login';
import Home from './pages/Home';

const App = () => {

  const {loading} = useAuth()

  if(loading) {
    return <div className='text-white text-center py-20'> Loading...</div>
  }
  return (

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      
   
  );
};

export default App;
