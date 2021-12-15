const {
  checkAccessToken,
  checkRefeshToken,
  generateAccessToken,
  sendAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} = require("../utils/tokenFunctions");
const { User } = require("../models");
const redis = require("../utils/redis");

const authorization = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  const accessTokenData = checkAccessToken(accessToken);
  const refreshTokenData = checkRefeshToken(refreshToken);

  if (accessTokenData === null || accessTokenData === undefined) {
    if (refreshTokenData === null || refreshTokenData === undefined) {
      return res.status(401).send("Not exist AT & RT");
    } else {
      const id = refreshTokenData.data;

      const redisRefreshToken = await redis.get(id);

      if (refreshToken !== redisRefreshToken) {
        return res.status(401).send("RefreshToken inconsistency");
      }

      const userInfo = await User.findOne({
        where: { id },
      });
      delete userInfo.dataValues.password;
      const newAccessToken = generateAccessToken(userInfo.dataValues);

      sendAccessToken(res, newAccessToken);
      req.cookies.accessToken = newAccessToken;
      req.id = id;
      next();
    }
  } else {
    if (refreshTokenData === null || refreshTokenData === undefined) {
      const id = accessTokenData.id;

      const userInfo = await User.findOne({
        where: { id },
      });

      const newRefreshToken = generateRefreshToken(userInfo.id);
      await redis.set(userInfo.id, refreshToken, "ex", 1209600);

      sendRefreshToken(res, refreshToken);
      req.cookies.refreshToken = newRefreshToken;
      req.id = id;
      next();
    } else {
      const id = accessTokenData.id;
      req.id = id;
      next();
    }
  }
};

module.exports = authorization;