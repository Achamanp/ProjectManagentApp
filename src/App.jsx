import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home'
import Navbar from './pages/Navbar/Navbar';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import IssueDetails from './pages/IssueDetails/IssueDetails';
import Subscription from './pages/Subscription/Subscription';
import Auth from './pages/Auth/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUser } from './Redux/Auth/Action'
import { fetchProjects } from './Redux/Project/Action';
import UpdateProject from './pages/ProjectDetails/UpdateProject';
import UpgradeSuccessPage from './pages/Subscription/UpgradeSuccess';
import AcceptInvitation from './pages/Project/AcceptInvitation';
import ResetPassword from './pages/Auth/ResetPassword';

const App = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(getUser());
      dispatch(fetchProjects());
    }
  }, [dispatch]); // Add dispatch as dependency

  // Show loading while checking authentication
  if (auth.loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes - these should be accessible even when not authenticated */}
      <Route path='/accept_invitation' element={<AcceptInvitation />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/auth' element={<Auth />} />
      
      {/* Protected routes */}
      {auth.user ? (
        <>
          <Route path='/home' element={<><Navbar /><Home /></>} />
          <Route path='/project/:id' element={<><Navbar /><ProjectDetails /></>} />
          <Route path='/project/:projectId/issue/:issueId' element={<><Navbar /><IssueDetails /></>} />
          <Route path='/upgrade_plan' element={<><Navbar /><Subscription /></>} />
          <Route path='/project/:projectId/edit' element={<><Navbar /><UpdateProject /></>} />
          <Route path='/upgrade_plan/success' element={<><Navbar /><UpgradeSuccessPage /></>} />
          <Route path='*' element={<><Navbar /><Home /></>} />
        </>
      ) : (
        <>
          {/* Redirect all other routes to auth when not authenticated */}
          <Route path='*' element={<Auth />} />
        </>
      )}
    </Routes>
  );
};

export default App;
