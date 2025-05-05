import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'  // Asegurarnos de importar los estilos
import AnimePage from './components/pages/AnimePage';
import MyAnimeLists from './components/pages/MyAnimeLists';
import AnimeListDetail from './components/pages/AnimeListDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnimePage />} />
        <Route path="/my-lists" element={<MyAnimeLists />} />
        <Route path="/lists/:listId" element={<AnimeListDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
