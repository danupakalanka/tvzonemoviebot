const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });


function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
	ALIVE_MSG: process.env.ALIVE_MSG === undefined ? 'Alive Now' : process.env.ALIVE_MSG,
	ALIVE_LOGO: process.env.ALIVE_LOGO === undefined ? `https://telegra.ph/file/5f2c2213e479a958564bd.jpg` : process.env.ALIVE_LOGO,

	PRO_LOGO: process.env.PRO_LOGO === undefined ? 'https://telegra.ph/file/8b8d49a533ae75d867f59.jpg' : process.env.PRO_LOGO,
	TV_LOGO: process.env.TV_LOGO === undefined ? 'https://telegra.ph/file/19c40ac52437d246524d3.jpg' : process.env.TV_LOGO,
	MY_LOGO: process.env.MY_LOGO === undefined ? 'https://telegra.ph/file/c8fa7a59b5dc23131d603.jpg' : process.env.MY_LOGO,
	WELCOME_LOGO: process.env.WELCOME_LOGO === undefined ? 'https://telegra.ph/file/21cecd447a3694560d001.jpg' : process.env.WELCOME_LOGO,

	FOOTER: process.env.FOOTER === undefined ? '@NadithPro' : process.env.FOOTER,
	FOOTER1: process.env.FOOTER1 === undefined ? 'ⒸPowered By @NadithPro' : process.env.FOOTER1,
	BTNNAME: process.env.BTNNAME === undefined ? 'View Online' : process.env.BTNNAME,

	SITELINK: process.env.SITELINK === undefined ? 'https://tv.nadith.pro/' : process.env.SITELINK,

	PRONAME: process.env.PRONAME === undefined ? '@nadithpro ' : process.env.PRONAME,
	MKVTYPE: process.env.MKVTYPE === undefined ? 'video/x-matroska' : process.env.MKVTYPE,
	MKVFILE: process.env.MKVFILE === undefined ? ' .mkv' : process.env.MKVFILE,

	RTYPE1: process.env.RTYPE1 === undefined ? '📥' : process.env.RTYPE1,
	RTYPE2: process.env.RTYPE2 === undefined ? '😎' : process.env.RTYPE2,
	RTYPE3: process.env.RTYPE3 === undefined ? '🔍' : process.env.RTYPE3,

	GROUPJID: process.env.GROUPJID === undefined ? '120363049874424207@g.us' : process.env.GROUPJID,
	SENDJID: process.env.SENDJID === undefined ? '120363024978510069@g.us' : process.env.SENDJID,

	OWNER_NAME: process.env.OWNER_NAME === undefined ? 'NadithPro Support' : process.env.OWNER_NAME,
	OWNER_NUMBER: process.env.OWNER_NUMBER === undefined ? '94761327688' : process.env.OWNER_NUMBER,

};
