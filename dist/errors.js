export function toError(err) {
  if (err instanceof Error) {
    return err;
  }
  if (typeof err === "string") {
    return new Error(err);
  }
  return new Error(String(err));
}
export function run(fn) {
  try {
    const value = fn();
    if (value instanceof Promise) {
      return new Promise(
        (res) => {
          value.then((val) => res(val)).catch((err) => res(toError(err)));
        }
      );
    } else {
      return value;
    }
  } catch (e) {
    return toError(e);
  }
}
const RESULT_BRAND = Symbol("RESULT_BRAND");
export function result(fn) {
  try {
    const value = fn();
    if (value instanceof Promise) {
      return new Promise((res) => {
        value.then((value2) => res({ success: true, value: value2, error: void 0, RESULT_BRAND: true })).catch((err) => res({ success: false, error: toError(err), value: void 0, RESULT_BRAND: true }));
      });
    } else {
      return { success: true, error: void 0, value, RESULT_BRAND: true };
    }
  } catch (e) {
    return { success: false, error: toError(e), value: void 0, RESULT_BRAND: true };
  }
}
export function isResult(input) {
  return !!input && typeof input === "object" && input[RESULT_BRAND] === true;
}
