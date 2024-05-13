import { ConnectClient, UpdateParticipantRoleConfigCommand } from "@aws-sdk/client-connect"; // ES Modules import

const client = new ConnectClient({
    apiVersion: "2017-08-08",
    region: "us-east-1"
});

async function updateParticipant(parameters = null, event = null) {
    if (parameters) {

        const input = { // UpdateParticipantRoleConfigRequest
            InstanceId: process.env.instance_id, // required
            ContactId: parameters.contactId, // required
            "ChannelConfiguration": {
                "Chat": {
                    "ParticipantTimerConfigList": [
                        {
                            "ParticipantRole": "CUSTOMER",
                            "TimerType": "IDLE",
                            "TimerValue": {
                                "ParticipantTimerDurationInMinutes": Number(process.env.idle_time)
                            }
                        },
                        {
                            "ParticipantRole": "CUSTOMER",
                            "TimerType": "DISCONNECT_NONCUSTOMER",
                            "TimerValue": {
                                "ParticipantTimerDurationInMinutes": Number(process.env.disconnect_time)
                            }
                        }
                    ]
                }
            }
        };

        const command = new UpdateParticipantRoleConfigCommand(input);

        const response = await new Promise((resolve, reject) => {
            client.send(command, (err, data) => {
                if (err) {
                    reject(`error while UpdateParticipantRoleConfigCommand: ${JSON.stringify(err)}, request body: ${JSON.stringify(input)}`)
                } else {
                    resolve({ data, requestBody: input })
                }
            });

        })
        return response

    }
}


const handler = async (event, context) => { 
    try {
        const response = await updateParticipant(event.Details.Parameters, event);
        console.log(`successfully UpdateParticipantRoleConfigCommand: ${JSON.stringify(response.data)}, ContactId: ${response.requestBody.ContactId}, InstanceId: ${response.requestBody.InstanceId}`);
        return response;

    } catch (error) {
        console.log(error);
    }
};

export { handler }