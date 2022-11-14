
const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType,
	jidDecode
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { state, saveState } = useSingleFileAuthState('./session.json')
const config = require('./config')
const prefix = '.'
const owner = ['94761327688']
const axios = require('axios')
const connectToWA = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})

	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
				connectToWA()
			}
		} else if (connection === 'open') {
			console.log('Bot Connected')
		}
	})

	conn.ev.on('creds.update', saveState)

	conn.ev.on('messages.upsert', async (mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return

			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid

			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId ? mek.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId ? mek.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''


			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''

			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'Sin Nombre'

			const isMe = botNumber.includes(senderNumber)
			const isowner = owner.includes(senderNumber) || isMe

			const reply = (teks) => {
				conn.sendMessage(from, { text: teks }, { quoted: mek })
			}

			const isSUB = from == config.SENDJID ? true : false


			switch (command) {

				//......................................................Commands..............................................................\\

				case '6-underground-2019':
				case '6underground': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "6-underground-2019" } },
					]
					const buttonMessage = {
						caption: "6 Underground | 2019 | 18+ | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/302d6b8a11c3c3af4f6a8.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/6_Underground_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro 6 underground 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case '12-strong-2018':
				case '12strong': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "12-strong-2018" } },
					]
					const buttonMessage = {
						caption: "12 Strong | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/6a4f88ced256406791899.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/12_Strong_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro 12 Strong 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'a-wrinkle-in-time-2018':
				case 'awrinkleintime': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "a-wrinkle-in-time-2018" } },
					]
					const buttonMessage = {
						caption: "A Wrinkle In Time | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/744d62178c740bea60133.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/A_Wrinkle_In_Time_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro A Wrinkle In Time 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'after':
				case 'after-2019':
				case 'after-we-collided-2020':
				case 'after-we-fell-2021': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=After" } },
					]
					const buttonMessage = {
						caption: "After | 2019 - 2021 | 18+ | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/b6cda88245576ed4de6b3.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/After_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro After 2019 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/After_We_Collided_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro After We Collided 2020 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/After_We_Fell_2021_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro After We Fell 2021 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'alienvspredator':
				case 'alien-vs-predator-2004':
				case 'aliens-vs-predator-requiem-2007': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Alien%20Vs%20Predator" } },
					]
					const buttonMessage = {
						caption: "Alien Vs Predator | 2004 - 2007 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/16f2128d40f113d20ef83.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Alien_Vs_Predator_2004_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Alien Vs Predator 2004 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Aliens_Vs_Predator_Requiem_2007_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Aliens Vs Predator Requiem 2007 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'aliens-in-the-attic-2009':
				case 'aliensintheattic': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "aliens-in-the-attic-2009" } },
					]
					const buttonMessage = {
						caption: "Aliens In The Attic | 2009 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/26100348f501cf4bd0dd9.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Aliens_In_The_Attic_2009_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Aliens In The Attic 2009 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'americanpie':
				case 'american-pie-1999':
				case 'american-pie-2001':
				case 'american-pie-the-wedding-2003':
				case 'american-pie-presents-band-camp-2005':
				case 'american-pie-presents-the-naked-mile-2006':
				case 'american-pie-presents-beta-house-2007':
				case 'american-pie-presents-the-book-of-love-2009':
				case 'american-pie-reunion-2012':
				case 'american-pie-presents-girls-rules-2020': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=American%20Pie" } },
					]
					const buttonMessage = {
						caption: "American Pie | 1999 - 2020 | 18+ | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/30aae396e71242612a62a.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_1999_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie 1999 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_2001_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie 2001 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_The_Wedding_2003_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie The Wedding 2003 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_Band_Camp_2005_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents Band Camp 2005 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_The_Naked_Mile_2006_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents The Naked Mile 2006 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_Beta_House_2007_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents Beta House 2007 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_The_Book_Of_Love_2009_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents The Book Of Love 2009 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Reunion_2012_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Reunion 2012 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_Girls_Rules_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents Girls Rules 2020 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'angrybirds':
				case 'the-angry-birds-movie-2016':
				case 'the-angry-birds-movie-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Angry%20Birds" } },
					]
					const buttonMessage = {
						caption: "The Angry Birds Movie | 2016 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/91e92370b6f74cf791fb7.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/The_Angry_Birds_Movie_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro The Angry Birds Movie 2016 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/The_Angry_Birds_Movie_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro The Angry Birds Movie 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'antman':
				case 'ant-man-and-the-wasp-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Ant%20Man" } },
					]
					const buttonMessage = {
						caption: "Ant Man | 2015 - 2018 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/944952aedae0ecec48644.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Ant_Man_And_The_Wasp_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Ant Man And The Wasp 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'artemis-fowl-2020':
				case 'artemisfowl': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "artemis-fowl-2020" } },
					]
					const buttonMessage = {
						caption: "Artemis Fowl | 2020 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/75e6e689b690bba8e25c5.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Artemis_Fowl_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Artemis Fowl 2020 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'assassinscreed':
				case 'assassins-creed-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Assassins%20Creed" } },
					]
					const buttonMessage = {
						caption: "Assassin's Creed | 2016 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/d9a2296f9b757eadf5738.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: "https://cloud.nadith.pro/en_mv/Assassin's_Creed_2016_@nadithpro.mkv" },
						mimetype: config.MKVTYPE,
						fileName: "@nadithpro Assassin's Creed 2016 .mkv"
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'avengers':
				case 'the-avengers-2012':
				case 'avengers-age-of-ultron-2015':
				case 'avengers-infinity-war-2018':
				case 'avengers-endgame-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Avengers" } },
					]
					const buttonMessage = {
						caption: "Avengers | 2012 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/a665bfb05433429df887e.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/The_Avengers_2012_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro The Avengers 2012 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Avengers_Age_Of_Ultron_2015_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Avengers Age Of Ultron 2015 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Avengers_Infinity_War_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Avengers Infinity War 2018 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Avengers_Endgame_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Avengers Endgame 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'axl-2018':
				case 'axl': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "axl-2018" } },
					]
					const buttonMessage = {
						caption: "AXL | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/ef3472e27d1549c26dccc.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/AXL_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro AXL 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'batman':
				case 'batman-1989':
				case 'batman-returns-1992':
				case 'batman-forever-1995': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Batman" } },
					]
					const buttonMessage = {
						caption: "Batman | 1989 - 2022  | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/c3de919072859899a78dd.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Batman_1989_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Batman 1989 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Batman_Returns_1992_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Batman Returns 1992 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Batman_Forever_1995_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Batman Forever 1995 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'batmanvsuperman':
				case 'batman-v-superman-dawn-of-justice-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "batman-v-superman-dawn-of-justice-2016" } },
					]
					const buttonMessage = {
						caption: "Batman V Superman Dawn Of Justice | 2016 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/ab9fe51e4355b43e688c3.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Batman_V_Superman_Dawn_Of_Justice_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Batman V Superman Dawn Of Justice 2016 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'baywatch':
				case 'baywatch-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "baywatch-2017" } },
					]
					const buttonMessage = {
						caption: "Baywatch | 2017 | 18+ | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/b5230848ff49e76835959.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Baywatch_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Baywatch 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'beautyandthebeast':
				case 'beauty-and-the-beast-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "beauty-and-the-beast-2017" } },
					]
					const buttonMessage = {
						caption: "Beauty And The Beast | 2017 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/542723ab0f0655f3dd9ae.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Beauty_And_The_Beast_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Beauty And The Beast 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'bighero6':
				case 'big-hero-6-2014': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "big-hero-6-2014" } },
					]
					const buttonMessage = {
						caption: "Big Hero 6 | 2014 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/bfd51d852db8bca206c56.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Big_Hero_6_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Big Hero 6 2014 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'birdsofprey':
				case 'birds-of-prey-and-the-fantabulous-emancipation-of-one-harley-quinn-2020': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "birds-of-prey-and-the-fantabulous-emancipation-of-one-harley-quinn-2020" } },
					]
					const buttonMessage = {
						caption: "Birds Of Prey And The Fantabulous Emancipation Of One Harley Quinn | 2020 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/cc780ba0f116e69f5fc1c.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Birds_Of_Prey_And_The_Fantabulous_Emancipation_Of_One_Harley_Quinn_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Birds Of Prey And The Fantabulous Emancipation Of One Harley Quinn 2020 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'blackpanther':
				case 'black-panther-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Black%20Panther" } },
					]
					const buttonMessage = {
						caption: "Black Panther | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/b83baa437f7456b978d8b.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Black_Panther_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Black Panther 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'bloodinthewater':
				case 'blood-in-the-water-2022': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "blood-in-the-water-2022" } },
					]
					const buttonMessage = {
						caption: "Blood In The Water | 2022 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/2424b2074dde137a62e92.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Blood_In_The_Water_2022_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Blood In The Water 2022 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'bloodshot':
				case 'bloodshot-2020': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "bloodshot-2020" } },
					]
					const buttonMessage = {
						caption: "Bloodshot | 2020 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/866bfe79238d5248b6cff.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Bloodshot_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Bloodshot 2020 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'blowback':
				case 'blowback-2022': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "blowback-2022" } },
					]
					const buttonMessage = {
						caption: "Blowback | 2022 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/e73669859545f09cee8cc.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Blowback_2022_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Blowback 2022 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'bumblebee':
				case 'bumblebee-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "bumblebee-2018" } },
					]
					const buttonMessage = {
						caption: "Bumblebee | 2018 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/97c1e480b44c71b4f9dcf.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Bumblebee_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Bumblebee 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'cars':
				case 'cars-2006':
				case 'cars-2011':
				case 'cars-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Cars" } },
					]
					const buttonMessage = {
						caption: "Cars | 2006 - 2017 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/ac1cfca73eb6133c43858.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Cars_2006_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Cars 2006 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Cars_2011_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Cars 2011 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Cars_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Cars 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'charliesangles':
				case 'charlies-angels-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Charlies%20Angles" } },
					]
					const buttonMessage = {
						caption: "Charlie's_Angels | 2019 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/36c7e75bc05472d062620.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: "https://cloud.nadith.pro/en_mv/Charlie's_Angels_2019_@nadithpro.mkv" },
						mimetype: config.MKVTYPE,
						fileName: "@nadithpro Charlie's_Angels_2019 .mkv"
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'coco':
				case 'code-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "coco-2017" } },
					]
					const buttonMessage = {
						caption: "Coco | 2017 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/bf09be18dd464d8738cfa.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Coco_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Coco 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'deadpool':
				case 'deadpool-2016':
				case 'deadpool-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Deadpool" } },
					]
					const buttonMessage = {
						caption: "Deadpool | 2016 - 2018 | 18+ | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/44056ca4f314eaaf5da5e.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Deadpool_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Deadpool 2016 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Deadpool_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Deadpool 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'dirtygrandpa':
				case 'dirty-grandpa-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "dirty-grandpa-2016" } },
					]
					const buttonMessage = {
						caption: "Dirty Grandpa | 2016 | 18+ | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/6ed953802a57e992716f5.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Dirty_Grandpa_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Dirty Grandpa 2016 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'doctorstrange':
				case 'doctor-strange-2016':
				case 'doctor-strange-in-the-multiverse-of-madness-2022': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "_/search?query=Doctor%Strange" } },
					]
					const buttonMessage = {
						caption: "Doctor Strange | 2016 - 2022 | English | Movie Series | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/16a885b82e7c04a2aa70f.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Doctor_Strange_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Doctor Strange 2016 .mkv'
					})
					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Doctor_Strange_In_The_Multiverse_Of_Madness_2022_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Doctor Strange In The Multiverse Of Madness 2022 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'dolittle':
				case 'dolittle-2020': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "dolittle-2020" } },
					]
					const buttonMessage = {
						caption: "Dolittle | 2020 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/f0ecda77343e3531acc4d.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Dolittle_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Dolittle 2020 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'doraandthelostcityofgold':
				case 'dora-and-the-lost-city-of-gold-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "dora-and-the-lost-city-of-gold-2019" } },
					]
					const buttonMessage = {
						caption: "Dora And The Lost City Of Gold | 2019 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/e956c5649ad6ca37b27ae.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Dora_And_The_Lost_City_Of_Gold_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Dora And The Lost City Of Gold 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'dragonball':
				case 'dragonball-evolution-2009': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "dragonball-evolution-2009" } },
					]
					const buttonMessage = {
						caption: "Dragonball Evolution | 2009 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/6ceef7fed310811fd5ebd.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage),

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Dragonball_Evolution_2009_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Dragonball Evolution 2009 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'dumbo':
				case 'dumbo-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					const templateButtons = [
						{ urlButton: { displayText: config.BTNNAME, url: config.SITELINK + "dumbo-2019" } },
					]
					const buttonMessage = {
						caption: "Dumbo | 2019 | English | Movie | Sinhala Subtitles | TV Zone",
						footer: config.FOOTER,

						image: { url: "https://telegra.ph/file/2494c59dd595957880ec0.jpg" }
					}

					await conn.sendMessage(config.GROUPJID, buttonMessage)

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(config.GROUPJID, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Dumbo_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Dumbo 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'autosend': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })

					setInterval(myTimer, 5 * 60000);

					function myTimer() {
						let picaks = [".axl", ".antman", ".dumbo", ".dolittle"]
						let picak = picaks[Math.floor(Math.random() * picaks.length)]
						conn.sendMessage(`94777717578@s.whatsapp.net`, { text: picak })
					}
				}
					break



				default:

					if (isowner && body.startsWith('>')) {
						try {
							await reply(util.format(await eval(`(async () => {${body.slice(1)}})()`)))
						} catch (e) {
							await reply(util.format(e))
						}
					}

			}

		} catch (e) {
			const isError = String(e)

			console.log(isError)
		}
	})
}

connectToWA()
