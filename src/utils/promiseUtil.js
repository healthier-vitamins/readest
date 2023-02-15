async function to(promise) {
  await promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      return [err];
    });
}

// async function to(fn) {
//   fn.then((data) => [null, data]).catch((err) => [err, null]);
// }

export { to };
