// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Login from './components/Login';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </DataProvider>
    </Router>
  );
};

export default App;
