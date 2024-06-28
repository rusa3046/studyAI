const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');

const dynamoClient = new DynamoDBClient({ region: "us-west-2" });

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    let response;
    try {
        const requestBody = JSON.parse(event.body);
        const { scheduleName, schedule } = requestBody;

        if (!scheduleName || !schedule) {
            response = {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST"
                },
                body: JSON.stringify({ message: "Missing schedule name or schedule content" }),
            };
            console.log("Missing schedule name or schedule content:", response);
            return response;
        }

        const scheduleId = uuidv4();

        // Store the schedule in DynamoDB
        const dynamoParams = {
            TableName: 'studySchedules',
            Item: {
                id: { S: scheduleId },
                scheduleName: { S: scheduleName },
                scheduleContent: { S: schedule },
                createdAt: { S: new Date().toISOString() }
            }
        };

        console.log("Params to be inserted into DynamoDB:", dynamoParams);

        const dynamoCommand = new PutItemCommand(dynamoParams);
        await dynamoClient.send(dynamoCommand);

        console.log("DynamoDB insert completed");

        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({ message: "Schedule saved successfully" }),
        };
        console.log("Schedule saved successfully:", response);
    } catch (error) {
        console.error("Error saving schedule:", error);
        response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({ message: "Internal server error", error: error.message }),
        };
    }
    return response;
};
