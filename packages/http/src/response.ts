export function success(data?: unknown, message = "Success") {
  return {
    success: true,
    message,
    data
  };
}

export function failure(message: string, errors?: unknown) {
  return {
    success: false,
    message,
    errors
  };
}