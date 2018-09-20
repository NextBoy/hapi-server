const JWT = require('jsonwebtoken')
const config = require('../config')

/**
 * @description 生成一个token, 默认有效期为1分钟
 * @param jwtInfo {object}
 * @param exp {number} 默认有效期为60秒
 * @return {*}
 */
const generateToken = (jwtInfo, exp = 60) => {
    const payload = {
        userId: jwtInfo.userId,
        exp: Math.floor(Date.now() / 1000) + exp // 秒级的时间戳
    }
    return {
        token: JWT.sign(payload, config.jwtSecret),
        exp: payload.exp
    }
}
/**
 * @description 根据token生成一个refreshToken
 * @param token
 * @param exp
 * @return {{refreshToken: *, refreshExp: *}}
 */
const generateRefreshToken = (token, exp) => {
    const refreshExp = exp ||  60  // 单位：秒
    const payload = {
        token,
        exp: Math.floor(Date.now() / 1000) + refreshExp // 秒级的时间戳
    }
    return {
        refreshToken: JWT.sign(payload, config.jwtSecret),
        refreshTokenExp: payload.exp
    }
}

/**
 * @description 生成一个完整的auth身份信息，包括token, refreshToken
 * @param jwtInfo
 * @param tokenExp
 * @param refreshExp
 * @return {{token: *, exp: (number|*), refreshToken: *, refreshTokenExp}}
 */
const generateAuthInfo = (jwtInfo, tokenExp, refreshExp) => {
    const { token, exp } = generateToken(jwtInfo, tokenExp)
    const { refreshToken, refreshTokenExp } = generateRefreshToken(token, refreshExp)
    return {
        token,
        exp,
        refreshToken,
        refreshTokenExp
    }
}

module.exports = {
    generateToken,
    generateRefreshToken,
    generateAuthInfo
}