import jwt from 'jsonwebtoken';

type User = {
  id: string;
  email: string;
};

// export default function (user: User) {
//   // return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!);
//   return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, {
//     expiresIn: '5m',
//   });
// }

function generateAccessToken(user: User) {
  return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '5s',
  });
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
function generateRefreshToken(user: User, jti: string) {
  return jwt.sign({
    userId: user.id,
    jti
  }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '8h',
    // expiresIn: '5s',
  });
}

function generateTokens(user: User, jti: string): { accessToken: string; refreshToken: string; } {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

export {
  generateAccessToken,
  generateRefreshToken,
  generateTokens
};