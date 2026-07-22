import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPasswordMathced = await bcrypt.compare(password, user.password);

  if (!isPasswordMathced) {
    throw new Error("Password is Incorrect");
  }

  return user;
};

export const authService = {
  loginUser,
};
