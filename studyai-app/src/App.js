import React, { useState } from 'react';
import CreateFolder from './components/CreateFolder';
import UploadDocument from './components/UploadDocument';
import GenerateSchedule from './components/GenerateSchedule';
import SavedSchedules from './components/SavedSchedule';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const App = () => {
    const [output, setOutput] = useState('');
    const apiUrl = 'https://9cfdj03mjb.execute-api.us-west-2.amazonaws.com/dev';

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/create-folder">Create Folder</Link>
                        </li>
                        <li>
                            <Link to="/upload-document">Upload Document</Link>
                        </li>
                        <li>
                            <Link to="/generate-schedule">Generate Schedule</Link>
                        </li>
                        <li>
                            <Link to="/saved-schedules">Saved Schedules</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/create-folder" element={<CreateFolder apiUrl={apiUrl} />} />
                    <Route path="/upload-document" element={<UploadDocument apiUrl={apiUrl} />} />
                    <Route path="/generate-schedule" element={<GenerateSchedule apiUrl={apiUrl} setOutput={setOutput} output={output} />} />
                    <Route path="/saved-schedules" element={<SavedSchedules apiUrl={apiUrl} />} />
                </Routes>

                <div>
                    <h2>Generated Schedule Output</h2>
                    <div>{output}</div>
                </div>
            </div>
        </Router>
    );
}

export default App;