const { google } = require('googleapis');
const axios = require('axios')
const key = require('../config/key.config')
const db = require('../models')

const ClientId = key.client_id_google_cloud
const ClientSecret = key.client_secret_google_cloud
const RedirectionUrl = 'http://localhost:3000/auth/google/callback'
const oauth2Client = new google.auth.OAuth2(ClientId, ClientSecret, RedirectionUrl);
const GoogleAccount = db.googleAccount

const getGoogleUrl = async () => {
    const scopes = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.profile']
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    return url
}

const decodeToken = async (code, userId) => {
    try {
        const result = await oauth2Client.getToken(code)
        const tokens = result.tokens
        console.log(tokens)
        const res1 = await axios({
            method: 'GET',
            url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
            headers: {
                "Authorization": `Bearer ${tokens.access_token}`
            }
        })
        console.log(2)
        await GoogleAccount.create({
            userId,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            scope: tokens.scope,
            idToken: tokens.id_token,
            tokenType: tokens.token_type,
            expiryDate: tokens.expiry_date,
            name: res1.data.name,
            googleAccountId: res1.data.id,
            picture: res1.data.picture
        })
        return true
    } catch (err) {
        console.log(err)
    }

}

const logoutGoogleAccount = async (userId) => {
    const result = await GoogleAccount.destroy({ where: { userId } })
    return result
}

module.exports = {
    getGoogleUrl,
    decodeToken,
    logoutGoogleAccount
}