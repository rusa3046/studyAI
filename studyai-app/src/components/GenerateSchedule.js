import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ReactDOMServer from 'react-dom/server';

const GenerateSchedule = ({ apiUrl, setOutput, output }) => {
    const [endDate, setEndDate] = useState('');
    const [folderName, setFolderName] = useState('');
    const [scheduleName, setScheduleName] = useState('');

    useEffect(() => {
        return () => {
            setOutput(''); // Clear the output when the component unmounts
        };
    }, [setOutput]);

    const handleGenerateSchedule = async () => {
        if (!endDate || !folderName || !scheduleName) {
            alert('Please enter all fields');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/generateSchedule`, { endDate, folderName }, { timeout: 60000 });

            if (response && response.data) {
                console.log('Full response data:', response.data); // Added for full response debugging
                
                // Parse the response data to get the schedule
                const parsedResponse = JSON.parse(response.data.body);
                const schedule = parsedResponse.schedule || parsedResponse;

                console.log('Parsed Schedule:', schedule); // Log the parsed schedule for debugging

                if (typeof schedule === 'string') {
                    formatAndSetOutput(schedule);
                } else if (Array.isArray(schedule)) {
                    formatAndSetOutput(schedule.join('\n'));
                } else {
                    setOutput('Error: Schedule is in an unexpected format');
                    console.log('Unexpected schedule format:', JSON.stringify(schedule, null, 2));
                }
            } else {
                setOutput('Error: No response data');
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            if (error.response && error.response.data) {
                setOutput(`Error: ${error.response.data.message}`);
                console.log('Error response data:', JSON.stringify(error.response.data, null, 2)); // Log the error response data
            } else {
                setOutput(`Error: ${error.message}`);
            }
        }
    };

    const handleSaveSchedule = async () => {
        if (!output || !scheduleName) {
            alert('Please generate a schedule and enter a name before saving');
            return;
        }

        try {
            // Convert the output (React component) to a string before sending
            const scheduleString = typeof output === 'string' ? output : ReactDOMServer.renderToString(output);

            const response = await axios.post(`${apiUrl}/saveSchedule`, { scheduleName, schedule: scheduleString });

            if (response && response.data) {
                alert('Schedule saved successfully');
            } else {
                alert('Error saving schedule');
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Error saving schedule');
        }
    };

    const formatAndSetOutput = (schedule) => {
        try {
            console.log('Formatting schedule:', schedule); // Log the schedule before formatting

            const formattedSchedule = schedule.split('\n').map((line) => {
                if (line.startsWith('Week') || line.startsWith('Day')) {
                    return `### ${line}`;
                } else if (line.trim()) {
                    return `- ${line}`;
                }
                return line;
            }).join('\n');

            setOutput(<ReactMarkdown>{formattedSchedule}</ReactMarkdown>);
        } catch (error) {
            console.error('Error formatting schedule:', error);
            setOutput('Error: Could not format the schedule properly');
        }
    };

    return (
        <div>
            <h2>Generate Study Schedule</h2>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
            <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder Name" />
            <input type="text" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} placeholder="Schedule Name" />
            <button onClick={handleGenerateSchedule}>Generate Schedule</button>
            <button onClick={handleSaveSchedule}>Save Schedule</button>

            <div>
                <h2>Generated Schedule Output</h2>
                <div>{output}</div>
            </div>
        </div>
    );
};

export default GenerateSchedule;
