import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Admin_components/LandingPage';
import JobList from './Hr_components/JobList';
// import JobOption from './components/jobOptions';
import EditJob from './Hr_components/EditJob';
import HRManagement from './Admin_components/HRManagement';
import Navigator from './Admin_components/Navigator';
import JobDetails from './Hr_components/JobDetails';
import AddApplicant from './Hr_components/AddApplicant';
import ScheduleInterview from './Hr_components/ScheduleInterview';
import './App.css';
import JobForm from './Hr_components/JobForm';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/list" element={<JobList jobs={jobs} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/create" element={<JobForm />} />
          <Route exact path="/dashboard" element={<Navigator />} />

          {/* <Route path="/jobs/:id" element={<JobOption />} /> */}
          <Route exact path="/hr-management" element={<HRManagement />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/edit/:id" element={<EditJob />} />
          <Route path="/jobs/AddApplicant/:id" element={<AddApplicant />} />
          <Route path="/scheduleInterview/:id" element={<ScheduleInterview />} />
          {/* <Route path="/jobs/edit/:id" element={<JobDetails />} /> */}
        {/* <Route path="/jobs/add-applicant/:id" element={<AddApplicant />} /> {/* You need to create this component */}
        {/* <Route path="/jobs/status/:id" element={<ShowStatus />} />  */} 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
