function to(promise) {
  return promise
    .then((res) => {
      return [null, res];
    })
    .catch((err) => {
      return [err];
    });
}

// temporary - to be replace with axios interceptors
function axiosTo(axios) {
  return axios
    .then((res) => {
      return [null, res.data];
    })
    .catch((err) => {
      return [err.response];
    });
}

function resolvePromise(promise) {
  new Promise((resolve, reject) => {
    promise.then((res) => resolve(res)).catch((err) => reject(err));
  });
}

export { to, axiosTo, resolvePromise };
