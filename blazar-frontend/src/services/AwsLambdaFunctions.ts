import { LambdaClient, InvokeCommand, LogType } from '@aws-sdk/client-lambda';

type LambdaPayload = {
  documentName:
    | 'Tests'
    | 'Dashboards'
    | 'Patents'
    | 'Medicaments'
    | 'ClinicalTrials';
  operation: string;
  options: object;
};

export const invokeLambdaFunction = async (
  funcName: string,
  payload: LambdaPayload,
  Decoder = TextDecoder,
) => {
  const client = new LambdaClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

  const command = new InvokeCommand({
    FunctionName: funcName,
    Payload: JSON.stringify(payload),
    LogType: LogType.Tail,
  });

  const { Payload, LogResult } = await client.send(command);

  let result = '';
  let logs = '';

  if (Payload instanceof Uint8Array) {
    const decoder = new Decoder('utf-8');
    result = decoder.decode(Payload);
  }

  if (typeof LogResult === 'string') {
    logs = atob(LogResult);
  }

  return { logs, result };
};
