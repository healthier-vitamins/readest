async function resolve(fn) {
  await new Promise((resolve, reject) => {
    fn.then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
}

// async function to(fn) {
//   fn.then((data) => [null, data]).catch((err) => [err, null]);
// }

export { resolve };
