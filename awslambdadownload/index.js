const fileProcessingService = require('./file-processing-service');
const util = require('./util');
const fileDownloadPath = '/file-download';

exports.handler = async (event) => {
  console.log('Request event.body: ', event.body);
  let response;
  switch(true) {
    case event.httpMethod === 'POST' && event.path === fileDownloadPath:
      response = await fileProcessingService.process(event.body);
      break;
    default:
      response = util.buildResponse(404);
  }
  
  return response;
};
