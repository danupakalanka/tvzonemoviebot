const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });


function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
	ALIVE_MSG: process.env.ALIVE_MSG === undefined ? 'Alive Now' : process.env.ALIVE_MSG,
	ALIVE_LOGO: process.env.ALIVE_LOGO === undefined ? `https://telegra.ph/file/5f2c2213e479a958564bd.jpg` : process.env.ALIVE_LOGO,

	PRO_LOGO: process.env.PRO_LOGO === undefined ? 'https://telegra.ph/file/58cf25199cd0c1dcd5695.jpg' : process.env.PRO_LOGO,
	MY_LOGO: process.env.MY_LOGO === undefined ? 'https://telegra.ph/file/59ae30418cdc0f288a002.jpg' : process.env.MY_LOGO,

	FOOTER: process.env.FOOTER === undefined ? '@nadithpro' : process.env.FOOTER,
	FOOTER1: process.env.FOOTER1 === undefined ? 'Ⓒ𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝙱𝚢 @𝙽𝚊𝚍𝚒𝚝𝚑𝙿𝚛𝚘' : process.env.FOOTER1,
	BTNNAME: process.env.BTNNAME === undefined ? 'View Online' : process.env.BTNNAME,

	SITELINK: process.env.SITELINK === undefined ? 'https://tv.nadith.pro/' : process.env.SITELINK,

	PRONAME: process.env.PRONAME === undefined ? '@nadithpro ' : process.env.PRONAME,
	MKVTYPE: process.env.MKVTYPE === undefined ? 'video/x-matroska' : process.env.MKVTYPE,
	MKVFILE: process.env.MKVFILE === undefined ? ' .mkv' : process.env.MKVFILE,

	RTYPE1: process.env.RTYPE1 === undefined ? '📥' : process.env.RTYPE1,
	RTYPE2: process.env.RTYPE2 === undefined ? '😎' : process.env.RTYPE2,
	RTYPE3: process.env.RTYPE3 === undefined ? '🔍' : process.env.RTYPE3,

	GROUPJID: process.env.GROUPJID === undefined ? '120363049874424207@g.us' : process.env.GROUPJID,
	SENDJID: process.env.SENDJID === undefined ? '94777717578@s.whatsapp.net' : process.env.SENDJID,

	OWNER_NAME: process.env.OWNER_NAME === undefined ? 'NadithPro' : process.env.OWNER_NAME,
	OWNER_NUMBER: process.env.OWNER_NUMBER === undefined ? '94761327688' : process.env.OWNER_NUMBER,

};
