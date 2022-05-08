import db from "../utils/db";
import { Password } from "../utils/password";

type RefreshToken = {
  jti: any;
  refreshToken: string;
  userId: any;
};

// used when we create a refresh token.
async function addRefreshTokenToWhitelist({ jti, refreshToken, userId }: RefreshToken) {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: await Password.toHash(refreshToken),
      userId
    },
  });
}

// used to check if the token sent by the client is in the database.
function findRefreshTokenById(id: string) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

// soft delete tokens after usage.
function deleteRefreshToken(id: string) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true
    }
  });
}

function revokeTokens(userId: any) {
  return db.refreshToken.updateMany({
    where: {
      userId
    },
    data: {
      revoked: true
    }
  });
}

export {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens
};