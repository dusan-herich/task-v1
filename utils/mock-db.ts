import sinon from 'sinon';
import { Client } from 'pg';

let mockClient: any;

export const setupMock = () => {
    mockClient = sinon.createStubInstance(Client);
};

export const mockDatabaseResponse = (response: any) => {
    mockClient.query.resolves({ rows: response });
};

export const getMockClient = () => mockClient;
