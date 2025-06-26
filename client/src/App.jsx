// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/DataContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './pages/Layout';
import ProjectPage from './pages/ProjectPage';

const App = () => {

  const {loading} = useAuth()

  // if(loading) {
  //   return <div className='text-white text-center py-20'> Loading...</div>
  // }
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Route>
    </Routes>
   
  );
};

export default App;
