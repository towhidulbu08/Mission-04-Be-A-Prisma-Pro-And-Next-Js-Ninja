import { JwtPayload } from "jsonwebtoken";
export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}

export interface IJwtPayload extends JwtPayload {
  id: string;
}
