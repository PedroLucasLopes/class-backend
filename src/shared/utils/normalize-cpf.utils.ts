import { NextFunction } from "express";
import { BadRequestException } from "../../module/core/students/exception/bad-request.exception";

export const normalizeCpf = (cpf: string, next: NextFunction) => {
  const same_number = new RegExp(cpf[0].repeat(11));
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) {
    return next(new BadRequestException("CPF must have 11 digits"));
  }

  if (same_number.test(cpf)) {
    return next(new BadRequestException("Invalid CPF"));
  }

  const verifyingDigits = (cpfDigits: string) => {
    let sum = 0;
    for (let i = 0; i < cpfDigits.length; i++) {
      let currentDigit = cpfDigits.charAt(i);
      let constants = cpfDigits.length + 1 - i;

      sum += Number(currentDigit) * constants;
    }
    const rest = sum % 11;

    return rest < 2 ? "0" : (11 - rest).toString();
  };

  let firstNineDigits = verifyingDigits(cpf.substring(0, 9));
  let nextVerifyingDigit = verifyingDigits(
    cpf.substring(0, 9) + firstNineDigits
  );

  let correctCpf = cpf.substring(0, 9) + firstNineDigits + nextVerifyingDigit;

  if (correctCpf !== cpf) {
    return next(new BadRequestException("Invalid CPF"));
  }
};
