var fs = require('fs');
var aws = require('aws-sdk');
aws.config.loadFromPath('./awsConfig.json');

var s3 = new aws.S3();


function uploadFile(remoteFilename, filename){
	var fileBuffer = fs.readFileSync(filename);
	var metaData = getContentTypeByFile(filename);

	s3.putObject({
		ACL: 'public-read',
		Bucket: BUCKET_NAME,
		Key: remoteFilename,
		Body: fileBuffer,
		ContentType: metaData
	}, function(error, response) {
		//manage error here
		console.log(response);
	});
}

function getContentTypeByFile(fileName) {
	var rc = 'application/octet-stream';
	var fileNameLowerCase = fileName.toLowerCase();

	if (fileNameLowerCase.indexOf('jpg') >= 0) rc = 'image/jpg';
	else if (fileNameLowerCase.indexOf('.png') > = 0) rc = 'image/png';

	return rc;
}

// function getImage(){
// 	s3.getSignedUrl('getObject', urlParams, function(err, url) {
		
// 	})
// }

function createBucket(bucketName) {
	s3.createBucket({ Bucket: bucketName}, function() {
		console.log('created the bucket[' +bucketName + ']')
	});
}