# aws-sign-web [![npm version](https://badge.fury.io/js/aws-sign-web.svg)](https://badge.fury.io/js/aws-sign-web) [![Bower version](https://badge.fury.io/bo/aws-sign-web.svg)](https://badge.fury.io/bo/aws-sign-web) [![Build Status](https://travis-ci.org/danieljoos/aws-sign-web.svg?branch=master)](https://travis-ci.org/danieljoos/aws-sign-web)
Plain JavaScript AWS Signature v4 for use within Web Browsers

## Example

```html
<script src="bower_components/cryptojslib/rollups/sha256.js"></script>
<script src="bower_components/cryptojslib/rollups/hmac-sha256.js"></script>
<script src="bower_components/aws-sign-web/aws-sign-web.min.js"></script>

<script type="text/javascript">
(function() {
    // Create a new signer
    var config = {
        // AWS Region (default: 'eu-west-1')
        region: 'eu-west-1',
        // AWS service that is called (default: 'execute-api' -- AWS API Gateway)
        service: 'execute-api',
        // AWS IAM credentials, here some temporary credentials with a session token
        accessKeyId: '...',
        secretAccessKey: '...',
        sessionToken: '...'
    };
    var signer = new awsSignWeb.AwsSigner(config);

    // Sign a request
    var request = {
        method: 'GET',
        url: 'https://<YOUR_API>.execute-api.eu-west-1.amazonaws.com/dev/users',
        headers: {},
        params: {
            'username': 'nobody'
        },
        data: null
    };
    var signed = signer.sign(request);
    console.log(signed);

    ///
    /// {
    ///     'Accept': 'application/json',
    ///     'Authorization': 'AWS4-HMAC-SHA256 Credential=ASIAIQTP2FX4MJ4J2DIA/20160520/eu-west-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-date, Signature=cc870c6ea5174baad470e46a7f5642725ff9411e049cf24d730923fca7e5f2b4'
    ///     'x-amz-date': '20160520T053201Z',
    ///     'x-amz-security-token': 'FQoDYXdzEOf//...'
    /// }
    ///
})();
</script>
```
