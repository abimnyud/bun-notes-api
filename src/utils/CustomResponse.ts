export class CustomResponse extends Response {
  constructor(data?: Object, options?: ResponseInit) {
    const localOptions = {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    super(JSON.stringify({status: "OK", ...data}), { ...localOptions, ...options });
  }
}
