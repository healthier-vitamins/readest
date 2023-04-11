const CancelToken = new AbortController();

export function createCancelTokenHandler(apiObject: any) {
  // initializing the cancel token handler object
  const cancelTokenHandler: any = {};

  // for each property in apiObject, i.e. for each request
  Object.getOwnPropertyNames(apiObject).forEach((propertyName) => {
    console.log("property name ||||||||| ", propertyName);
    console.log("apiObject ||||||||| ", apiObject);

    // initializing the cancel token of the request
    const cancelTokenRequestHandler: any = {
      cancelToken: undefined,
    };

    // associating the cancel token handler to the request name
    cancelTokenHandler[propertyName] = {
      handleRequestCancellation: () => {
        // if a previous cancel token exists,
        // cancel the request
        cancelTokenRequestHandler.cancelToken &&
          cancelTokenRequestHandler.cancelToken.abort();

        // creating a new cancel token
        cancelTokenRequestHandler.cancelToken = CancelToken;

        // returning the new cancel token
        return cancelTokenRequestHandler.cancelToken;
      },
    };
  });

  console.log("returned cancltokenhandler |||||||||| ", cancelTokenHandler);
  return cancelTokenHandler;
}
