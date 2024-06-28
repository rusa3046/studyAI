import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const SavedSchedules = ({ apiUrl }) => {
    const [savedSchedules, setSavedSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState('');

    useEffect(() => {
        const fetchSavedSchedules = async () => {
            try {
                const response = await axios.get(`${apiUrl}/getSavedSchedules`);
                if (response && response.data) {
                    setSavedSchedules(response.data.schedules);
                } else {
                    alert('Error fetching saved schedules');
                }
            } catch (error) {
                console.error('Error fetching saved schedules:', error);
                alert('Error fetching saved schedules');
            }
        };
        fetchSavedSchedules();
    }, [apiUrl]);

    const handleScheduleClick = (schedule) => {
        setSelectedSchedule(schedule);
    };

    return (
        <div>
            <h2>Saved Schedules</h2>
            <ul>
                {savedSchedules.map((schedule) => (
                    <li key={schedule.scheduleName}>
                        <button onClick={() => handleScheduleClick(schedule.schedule)}>
                            {schedule.scheduleName}
                        </button>
                    </li>
                ))}
            </ul>
            {selectedSchedule && (
                <div>
                    <h3>Schedule Details</h3>
                    <ReactMarkdown>{selectedSchedule}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default SavedSchedules;
