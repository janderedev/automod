import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import '@revoltchat/ui/src/styles/dark.css';
import '@revoltchat/ui/src/styles/common.css';
import RequireAuth from './components/RequireAuth';
import DashboardHome from './pages/DashboardHome';
import ServerDashboard from './pages/ServerDashboard';

const API_URL = 'http://localhost:9000';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<RequireAuth><DashboardHome /></RequireAuth>} />
        <Route path='/dashboard/:serverid' element={<RequireAuth><ServerDashboard /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export { API_URL }
