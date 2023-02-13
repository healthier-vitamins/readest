async function to(promise) {
  await promise.then((data) => [null, data]).catch((err) => [err]);
}

// async function to(fn) {
//   fn.then((data) => [null, data]).catch((err) => [err, null]);
// }

export { to };
