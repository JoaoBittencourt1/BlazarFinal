// @ts-nocheck
import { TextDecoder } from 'node:util';
import { invokeLambdaFunction } from 'src/services/AwsLambdaFunctions';

describe('Aws Lambda Functions', () => {
  it.concurrent('Use "invokeLambdaFunction"', async () => {
    const response = await invokeLambdaFunction('database', {
      documentName: 'Tests',
      operation: 'find',
      options: {},
    }, TextDecoder);

    expect(response.logs).toBeDefined();
    expect(response.result).toBeDefined();
  });
});
