import jwt from "jsonwebtoken";
import config from "../config";

type JwtPayload = {
  id: string;
  name: string;
  email: string;
};

function getJwtTokens({ id, name, email }: JwtPayload) {
  const user = { id, name, email };

  const accessToken = jwt.sign(user, config.accessTokenSecret, {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
    expiresIn: "3d",
  });

  return { accessToken, refreshToken };
}

export { getJwtTokens };
