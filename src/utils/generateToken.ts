import jwt from "jsonwebtoken";
import { TokenData } from "../../database/types/TokenData";


// Generate both access and refresh tokens
const generateToken = (data: TokenData) => {
  const accessToken = jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn: '45m' }); // Access token expires in 45 minutes
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SIGNATURE as string, { expiresIn: '7d' }); // Refresh token expires in 7 days
  
  return { accessToken, refreshToken };
};

export default generateToken;
