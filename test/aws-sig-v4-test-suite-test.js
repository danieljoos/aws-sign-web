
const assert = require('assert');
const fs = require('fs');
const httpParser = require('http-string-parser');
const jsdom = require('jsdom');

const {window} = (new jsdom.JSDOM(``, {pretendToBeVisual: true}));
global.window = window;
global.document = window.document;

const awsSignWeb = require('../aws-sign-web.js');

const testSuiteRoot = `${__dirname}/aws-sig-v4-test-suite/aws-sig-v4-test-suite/`;

describe('AwsSigner', function() {

    const config = {
        region: 'us-east-1',
        service: 'service',
        accessKeyId: 'AKIDEXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
        defaultContentType: '',
        defaultAcceptType: '',
    };
    const signDate = new Date('2015-08-30T12:36:00Z');
    const awsSigner = new awsSignWeb.AwsSigner(config);

    describe('sign()', function() {
        it('should handle vanilla GET request', function() {
            const testReq = getTestRequest('get-vanilla');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle GET request with unreserved characters in path', function() {
            const testReq = getTestRequest('get-unreserved');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle GET request with UTF8 characters in path', function() {
            const testReq = getTestRequest('get-utf8');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle GET request with query parameter', function() {
            const testReq = getTestRequest('get-vanilla-empty-query-key');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle GET request with query parameters and respect key order', function() {
            const testReq = getTestRequest('get-vanilla-query-order-key-case');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle GET request with unreserved characters in query parameter', function() {
            const testReq = getTestRequest('get-vanilla-query-unreserved');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle GET request with UTF8 characters in query parameter', function() {
            const testReq = getTestRequest('get-vanilla-utf8-query');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle vanilla POST request', function() {
            const testReq = getTestRequest('post-vanilla');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle POST request with query parameter', function() {
            const testReq = getTestRequest('post-vanilla-query');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
        it('should handle POST request with form content', function() {
            const testReq = getTestRequest('post-x-www-form-urlencoded');
            const signed = awsSigner.sign(testReq.request, signDate);
            assert.equal(signed.Authorization, testReq.expectedAuthorization);
        });
    });
});

function readTestSuiteFiles(name) {
    const testPath = `${testSuiteRoot}/${name}`;
    var req = fs.readFileSync(`${testPath}/${name}.req`, 'utf8');
    var authz = fs.readFileSync(`${testPath}/${name}.authz`, 'utf8');
    return {req, authz};
}

function getTestRequest(name) {
    const testSuite = readTestSuiteFiles(name);
    const httpRequest = httpParser.parseRequest(testSuite.req);
    return {
        request: {
            method: httpRequest.method,
            url: `https://${httpRequest.headers.Host}${httpRequest.uri}`,
            headers: httpRequest.headers,
            body: httpRequest.body,
        },
        expectedAuthorization: testSuite.authz
    };
}
