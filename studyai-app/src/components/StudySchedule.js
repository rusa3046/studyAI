import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const StudySchedule = () => {
    const location = useLocation();
    const { schedule } = location.state || { schedule: '' };

    return (
        <div>
            <h2>Study Schedule</h2>
            <ReactMarkdown>{schedule}</ReactMarkdown>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default StudySchedule;
