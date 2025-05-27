function usernameValidator(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

  if (typeof username !== "string") {
    return false;
  }

  if (username.trim() === "") {
    return false;
  }

  const safeUsername = username.trim();

  return usernameRegex.test(safeUsername);
}

function emailValidator(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (typeof email !== "string") {
    return false;
  }

  if (email.trim() === "") {
    return false;
  }

  const safeEmail = email.trim();

  return emailRegex.test(safeEmail);
}

function passwordValidator(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (typeof password !== "string") {
    return false;
  }

  if (password.trim() === "") {
    return false;
  }

  return passwordRegex.test(password);
}

const contentValidator = (input) => {
  const contentRegex = /^[A-Za-z0-9 ]{3,}$/;

  if (typeof input !== "string") {
    return false;
  }

  if (input.trim() === "") {
    return false;
  }

  return contentRegex.test(input);
};

export {
  usernameValidator,
  emailValidator,
  passwordValidator,
  contentValidator,
};
