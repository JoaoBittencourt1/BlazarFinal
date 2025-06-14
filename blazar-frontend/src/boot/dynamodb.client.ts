import { boot } from 'quasar/wrappers';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamoDbConfig = {
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
};

const dynamoDbClient = new DynamoDBClient(dynamoDbConfig);

export default boot(async ({ app }) => {
  app.config.globalProperties.$dynamoDbClient = dynamoDbClient;
});

export { dynamoDbClient };
