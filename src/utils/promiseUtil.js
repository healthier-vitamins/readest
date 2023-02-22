function to(promise) {
  return promise
    .then((res) => {
      return [null, res];
    })
    .catch((err) => {
      return [err];
    });
}

async function axiosTo(axios) {
  try {
    const res = await axios;
    if (res.status === 200) {
      console.log(res);
      return res.data;
    }
  } catch (err) {
    console.error(err);
    return err;
  }
}

function resolvePromise(promise) {
  new Promise((resolve, reject) => {
    promise.then((res) => resolve(res)).catch((err) => reject(err));
  });
}

export { to, axiosTo, resolvePromise };
