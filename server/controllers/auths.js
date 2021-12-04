const {
  generateSalt,
  hashPassword,
  checkPassword,
  generateEmailKey,
} = require("../utils/secure");
const {
  generateAccessToken,
  generateRefreshToken,
  isAuthorized,
  checkRefeshToken,
  checkAccessToken,
} = require("../utils/tokenFunctions");
const { User } = require("../models");
require("dotenv").config();
const redis = require("../utils/redis");
const emailSend = require("../middlewares/email/send");
const { emailVerify } = require("../middlewares/email/content");

module.exports = {
  signup: {
    post: async (req, res) => {
      const { email, nickname, password } = req.body;
      if (!email || !nickname || !password) {
        return res.status(400).send("Empty body");
      }

      const userInfo = await User.findOne({ where: { email } });

      if (userInfo) {
        if (userInfo.email_verified) {
          return res.status(409).send("Overlap");
          //   } else {
          //     req.userId = userInfo.id;
          //     // next();
          //     return;
        }
      }

      const emailKey = Math.random().toString(36).slice(2);
      const salt = await generateSalt();
      const hashedPassword = await hashPassword(password, salt);

      await User.create({
        email,
        password: hashedPassword,
        salt,
        nickname,
        email_key: emailKey,
      });

      const url =
        process.env.SERVER_ORIGIN + "/auth/confirm/email?key=" + emailKey;

      const emailContent = emailVerify(email, nickname, url);
      emailSend(emailContent);

      try {
        res.status(201).send("Signup success");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    },
  },
  login: {
    post: async (req, res) => {
      const { email, password } = req.body;
      console.log(req.headers);

      if (!email || !password) {
        return res.status(400).send("Empty body");
      }

      const userInfo = await User.findOne({
        attributes: ["id", "email", "password", "nickname", "profile"],
        where: { email },
      });

      if (!userInfo) {
        return res.status(400).send("Non-existent account");
      }

      const result = await checkPassword(
        password,
        userInfo.dataValues.password
      );

      if (!result) {
        return res.status(400).send("Password inconsistency");
      }
      const userId = userInfo.dataValues.id;
      delete userInfo.dataValues.password;
      delete userInfo.dataValues.salt;
      const accessToken = generateAccessToken(userInfo.dataValues);
      const refreshToken = generateRefreshToken(userId);

      // await tedis.set(userInfo.id, refreshToken)
      // console.log(await tedis.get(userInfo.id))
      // redisClient.set(userInfo.id, refreshToken);
      await redis.set(userInfo.id, refreshToken, "ex", 1209600);

      try {
        return res.json({
          userInfo: userInfo.dataValues,
          accessToken,
          refreshToken,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    },
  },
  logout: {
    post: async (req, res) => {
      console.log(req.headers);
      const { id } = isAuthorized(req);
      // redis.del(id);

      try {
        res.send("Logout success");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    },
  },
  email: {
    post: async (req, res) => {
      const { email } = req.body;

      if (!email) {
        return res.status(400).send("Empty body");
      }

      const checkEmail = await User.findOne({
        where: { email },
      });

      if (checkEmail) {
        return res.status(400).send("Overlap");
      }

      try {
        res.send("Ok");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    },
  },
  nickname: {
    post: async (req, res) => {
      const { nickname } = req.body;

      if (!nickname) {
        return res.status(400).send("Empty body");
      }

      const checkNickname = await User.findOne({
        where: { nickname },
      });

      if (checkNickname) {
        return res.status(400).send("Overlap");
      }

      try {
        res.send("Ok");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    },
  },
  render: {
    post: async (req, res) => {
      try {
        res.send("Ok");
      } catch (err) {
        res.status(500).send("Server error");
      }
    },
  },
  refresh: {
    post: async (req, res) => {
      const { accesstoken, refreshtoken } = req.headers;

      if (!accesstoken || !refreshtoken) {
        return res.status(401).send("Not exist token");
      }

      const accessTokenData = checkAccessToken(accesstoken);
      const refreshTokenData = checkRefeshToken(refreshtoken);

      if (accessTokenData.id !== refreshTokenData.data) {
        return res.status(401).send("userId inconsistency");
      }

      if (refreshTokenData.exp <= Date.now() / 1000) {
        return res.status(401).send("Expiration");
      }

      const redisRefreshToken = await redis.get(`${accessTokenData.id}`);

      if (refreshtoken !== redisRefreshToken) {
        return res.status(401).send("RefreshToken inconsistency");
      }

      const userInfo = await User.findOne({
        where: { id: accessTokenData.id },
      });

      if (!userInfo) {
        return res.status(401).send("Not exist user");
      }

      delete userInfo.dataValues.password;
      delete userInfo.dataValues.salt;
      const newAccessToken = generateAccessToken(userInfo.dataValues);

      try {
        res.json({ newAccessToken });
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    },
  },
  confirm: {
    get: async (req, res) => {
      try {
        const { key } = req.query;

        const findUser = await User.findOne({
          where: { email_key: key },
        });

        console.log(findUser.email_verified);
        if (findUser.email_verified) {
          return res.status(400).send("Already confirm");
        }

        const currentTime = new Date().getTime();
        const signupDate = new Date(findUser.updated_at);
        const validTime = new Date(
          signupDate.getFullYear(),
          signupDate.getMonth(),
          signupDate.getDate(),
          signupDate.getHours(),
          signupDate.getMinutes() + 3,
          signupDate.getSeconds()
        );

        if (validTime.getTime() < new Date().getTime()) {
          return res.status(400).json({
            currentTime: new Date(currentTime).toLocaleString(),
            signupDate: new Date(signupDate).toLocaleString(),
            validTime: new Date(validTime).toLocaleString(),
            message: "expiration",
          });
        }

        await User.update(
          {
            email_verified: true,
          },
          {
            where: { email_key: key },
          }
        );

        const url = process.env.CLIENT_ORIGIN;
        res.redirect(url);
      } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
    },
  },
};