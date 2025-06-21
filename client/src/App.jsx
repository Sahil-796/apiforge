import React, { useState } from 'react';
import Login from './components/Login';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
     <Login/>
    </div>
  );
};

export default App;