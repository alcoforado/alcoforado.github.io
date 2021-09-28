import React from 'react';
import './scss/app.scss';
import AppBar from './components/AppBar';
import Ripple from './components/Ripple';
function App() {
  return (
    <div className="App">
      <AppBar>



      </AppBar>
     <Ripple>
    <div className="test">Hello World</div>
    </Ripple>
    </div>

    
  );
}

export default App;
