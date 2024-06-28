const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });

exports.handler = async () => {
    const params = {
        TableName: process.env.SCHEDULES_TABLE
    };

    try {
        const data = await dynamoClient.send(new ScanCommand(params));
        const schedules = data.Items.map(item => ({
            scheduleId: item.scheduleId.S,
            scheduleName: item.scheduleName.S,
            s3Url: item.s3Url.S,
            createdAt: item.createdAt.S
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ schedules }),
        };
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: error.message }),
        };
    }
};
