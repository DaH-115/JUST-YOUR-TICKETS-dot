export const validateId = (emailId: string) => {
  const idCheckRegex = /@/;
  return idCheckRegex.test(emailId);
};

export const validateEAdress = (eAdress: string) => {
  const eAdressCheckRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
  return eAdressCheckRegex.test(eAdress);
};

export const validateEmail = (email: string) => {
  const emailCheckRegex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return emailCheckRegex.test(email);
};

export const validatePassword = (password: string) => {
  const passwordCheckRegex =
    /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
  return passwordCheckRegex.test(password);
};
