import React, {useState} from 'react'
import Login from './components/Login'

var firebase = require('firebase');
var firebaseui = require('firebaseui');


const App = () => {
   const [showLogin, setShowLogin] = useState(false);
   var ui = new firebaseui.auth.AuthUI(firebase.auth());

  return (

    <div><button onClick={() => setShowLogin(true)}>Open Login</button>
      <Login open={showLogin} onClose={() => setShowLogin(false)} />
     </div>
  )
}

export default App