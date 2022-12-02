
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

				case 'jid': try {
					if (!from) return
					reply(from)
				}
					catch (e) {
						await conn.sendMessage(from, { text: '*Error ⛔*' }, { quoted: mek })
					}

					break

				case 'start': {

					if (!isGroup) return

					const startmsg = `*🍁𝕎𝔼𝕃ℂ𝕆𝕄𝔼 𝕋𝕆 𝕋𝕍 ℤ𝕆ℕ𝔼 𝔹𝕆𝕋*

🔰 TV Zone Group එකට පහළින් Join වන්න.
				
 𖣔 Thank You 𖣔
 ━━━━━━━━━━`

					const templateButtons = [
						{ urlButton: { displayText: 'WebSite 🖥️', url: 'https://tv.nadith.pro/' } },
						{ urlButton: { displayText: 'Join TV Zone', url: 'https://chat.whatsapp.com/Ltkp9BEYl632dE7T6bT58i' } },
						{ quickReplyButton: { displayText: 'Owner', id: prefix + 'owner' } },
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER1,
						templateButtons: templateButtons,
						image: { url: config.TV_LOGO }
					}
					conn.sendMessage(from, buttonMessage)

				}
					break


				case 'owner': {

					if (!isGroup) return

					const vcard = 'BEGIN:VCARD\n'
						+ 'VERSION:3.0\n'
						+ `FN:` + config.OWNER_NAME + `\n`
						+ 'TEL;type=CELL;type=VOICE;waid=' + config.OWNER_NUMBER + ':+' + config.OWNER_NUMBER + '\n'
						+ 'END:VCARD'
					await conn.sendMessage(from, { contacts: { displayName: config.OWNER_NAME, contacts: [{ vcard }] } }, { quoted: mek })
				}
					break

				//......................................................Commands..............................................................\\

				case '6-underground-2019':
				case '6underground': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "6 Underground | 2019 | 18+ | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/302d6b8a11c3c3af4f6a8.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/6_Underground_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro 6 underground 2019 18+ .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case '12-strong-2018':
				case '12strong': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "12 Strong | 2018 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/6a4f88ced256406791899.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "A Wrinkle In Time | 2018 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/744d62178c740bea60133.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "After | 2019 - 2021 | 18+ | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/b6cda88245576ed4de6b3.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/After_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro After 2019 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/After_We_Collided_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro After We Collided 2020 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/After_We_Fell_2021_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro After We Fell 2021 18+ .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'alienvspredator':
				case 'alien-vs-predator-2004':
				case 'aliens-vs-predator-requiem-2007': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Alien Vs Predator | 2004 - 2007 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/16f2128d40f113d20ef83.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Alien_Vs_Predator_2004_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Alien Vs Predator 2004 .mkv'
					})
					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Aliens In The Attic | 2009 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/26100348f501cf4bd0dd9.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "American Pie | 1999 - 2020 | 18+ | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/30aae396e71242612a62a.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_1999_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie 1999 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_2001_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie 2001 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_The_Wedding_2003_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie The Wedding 2003 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_Band_Camp_2005_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents Band Camp 2005 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_The_Naked_Mile_2006_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents The Naked Mile 2006 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_Beta_House_2007_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents Beta House 2007 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_The_Book_Of_Love_2009_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents The Book Of Love 2009 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Reunion_2012_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Reunion 2012 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/American_Pie_Presents_Girls_Rules_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro American Pie Presents Girls Rules 2020 18+ .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'angrybirds':
				case 'the-angry-birds-movie-2016':
				case 'the-angry-birds-movie-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "The Angry Birds Movie | 2016 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/91e92370b6f74cf791fb7.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/The_Angry_Birds_Movie_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro The Angry Birds Movie 2016 .mkv'
					})
					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Ant Man | 2015 - 2018 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/944952aedae0ecec48644.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Artemis Fowl | 2020 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/75e6e689b690bba8e25c5.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Assassin's Creed | 2016 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/d9a2296f9b757eadf5738.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Avengers | 2012 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/a665bfb05433429df887e.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/The_Avengers_2012_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro The Avengers 2012 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Avengers_Age_Of_Ultron_2015_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Avengers Age Of Ultron 2015 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Avengers_Infinity_War_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Avengers Infinity War 2018 .mkv'
					})
					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "AXL | 2018 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/ef3472e27d1549c26dccc.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Batman | 1989 - 2022  | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/c3de919072859899a78dd.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Batman_1989_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Batman 1989 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Batman_Returns_1992_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Batman Returns 1992 .mkv'
					})
					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Batman V Superman Dawn Of Justice | 2016 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/ab9fe51e4355b43e688c3.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Baywatch | 2017 | 18+ | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/b5230848ff49e76835959.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Baywatch_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Baywatch 2017 18+ .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'beautyandthebeast':
				case 'beauty-and-the-beast-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Beauty And The Beast | 2017 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/542723ab0f0655f3dd9ae.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Big Hero 6 | 2014 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/bfd51d852db8bca206c56.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Birds Of Prey And The Fantabulous Emancipation Of One Harley Quinn | 2020 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/cc780ba0f116e69f5fc1c.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Black Panther | 2018 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/b83baa437f7456b978d8b.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Blood In The Water | 2022 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/2424b2074dde137a62e92.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Bloodshot | 2020 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/866bfe79238d5248b6cff.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Blowback | 2022 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/e73669859545f09cee8cc.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Bumblebee | 2018 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/97c1e480b44c71b4f9dcf.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Cars | 2006 - 2017 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/ac1cfca73eb6133c43858.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Cars_2006_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Cars 2006 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Cars_2011_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Cars 2011 .mkv'
					})
					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Charlie's Angels | 2019 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/36c7e75bc05472d062620.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: "https://cloud.nadith.pro/en_mv/Charlie's_Angels_2019_@nadithpro.mkv" },
						mimetype: config.MKVTYPE,
						fileName: "@nadithpro Charlie's Angels 2019 .mkv"
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'coco':
				case 'code-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Coco | 2017 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/bf09be18dd464d8738cfa.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Deadpool | 2016 - 2018 | 18+ | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/44056ca4f314eaaf5da5e.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Deadpool_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Deadpool 2016 18+ .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Deadpool_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Deadpool 2018 18+ .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'dirtygrandpa':
				case 'dirty-grandpa-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Dirty Grandpa | 2016 | 18+ | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/6ed953802a57e992716f5.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Dirty_Grandpa_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Dirty Grandpa 2016 18+ .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'doctorstrange':
				case 'doctor-strange-2016':
				case 'doctor-strange-in-the-multiverse-of-madness-2022': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Doctor Strange | 2016 - 2022 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/16a885b82e7c04a2aa70f.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Doctor_Strange_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Doctor Strange 2016 .mkv'
					})
					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Dolittle | 2020 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/f0ecda77343e3531acc4d.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Dora And The Lost City Of Gold | 2019 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/e956c5649ad6ca37b27ae.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Dragonball Evolution | 2009 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/6ceef7fed310811fd5ebd.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
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

					await conn.sendMessage(from, {
						caption: "Dumbo | 2019 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/2494c59dd595957880ec0.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Dumbo_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Dumbo 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'escaperoom':
				case 'escape-room-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Escape Room | 2019 - 2021 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/1cc9f8b88ff66a7caa5a5.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Escape_Room_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Escape Room 2019 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Escape_Room_Tournament_Of_Champions_2021_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Escape Room Tournament Of Champions 2021 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'eternals':
				case 'eternals-2021': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Eternals | 2021 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/dcea4dd4b1e2e5e7e3e4b.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Eternals_2021_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Eternals 2021 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'extraction':
				case 'extraction-2020': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Extraction | 2020 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/3595ffdf898fa4b6be9e7.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Extraction_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Extraction 2020 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'fantasticbeasts':
				case 'fantastic-beasts-the-crimes-of-grindelwald-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Fantastic Beasts The Crimes Of Grindelwald | 2018 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/6b819cd00ac672adfb9d9.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Fantastic_Beasts_The_Crimes_Of_Grindelwald_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Fantastic Beasts The Crimes Of Grindelwald 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'fantasticfour':
				case 'fantastic-four-2015': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Fantastic Four | 2015 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/97444109f4d88d0cd6c3f.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Fantastic_Four_2015_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Fantastic Four 2015 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'ferdinand':
				case 'ferdinand-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Ferdinand | 2017 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/f2c65c6b45f13dfb5d011.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Ferdinand_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Ferdinand 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'frozen':
				case 'frozen-2013':
				case 'frozen-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Frozen | 2013 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/4e10e2653726625c3d67d.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Frozen_2013_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Frozen 2013 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Frozen_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Frozen 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'gijoe':
				case 'g.i.-joe-rise-of-cobra-2009':
				case 'g.i.-joe-retaliation-2013': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "G.I. Joe | 2009 - 2013 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/07907026e8c7e459958f0.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/G.I._Joe_Rise_Of_Cobra_2009_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro G.I. Joe Rise Of Cobra 2009 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/G.I._Joe_Retaliation_2013_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro G.I. Joe Retaliation 2013 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'snakeeyes':
				case 'snake-eyes-2021': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Snake Eyes | 2021 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/6537f150f11feb17cda42.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Snake_Eyes_2021_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Snake Eyes 2021 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'ghostbusters':
				case 'ghostbusters-1984':
				case 'ghostbusters-1989':
				case 'ghostbusters-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Ghostbusters | 1984 - 2021 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/24f9344ad49f33292031a.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Ghostbusters_1984_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Ghostbusters 1984 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Ghostbusters_1989_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Ghostbusters 1989 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Ghostbusters_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Ghostbusters 2016 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'godsofegypt':
				case 'gods-of-egypt-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Gods Of Egypt | 2016 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/586085680dabb28a44021.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Gods_Of_Egypt_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Gods Of Egypt 2016 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'godzilla':
				case 'godzilla-2014':
				case 'shin-godzilla-2016':
				case 'godzilla-king-of-the-monsters-2019':
				case 'godzilla-vs-kong-2021': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Godzilla | 2014 - 2021 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/7773985d7d0c03bd0bf42.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Godzilla_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Godzilla 2014 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Shin_Godzilla_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Shin Godzilla 2016 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Godzilla_King_Of_The_Monsters_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Godzilla King Of The Monsters 2019 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Godzilla_Vs_Kong_2021_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Godzilla Vs Kong 2021 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'goosebumps':
				case 'goosebumps-haunted-halloween-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Goosebumps | 2015 - 2018 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/57e3a2ff84598cc2ba843.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Goosebumps_Haunted_Halloween_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Goosebumps Haunted Halloween 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'greenlantern':
				case 'green-lantern-2011': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Green Lantern | 2011 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/513257f3c7f5183734d88.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Green_Lantern_2011_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Green Lantern 2011 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'guardiansofthegalaxy':
				case 'guardians-of-the-galaxy-2014':
				case 'guardians-of-the-galaxy-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Guardians Of The Galaxy | 2014 - 2017 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/844a21fcc7c20e98f452a.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Guardians_Of_The_Galaxy_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Guardians Of The Galaxy 2014 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Guardians_Of_The_Galaxy_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Guardians Of The Galaxy 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'hanselandgretel':
				case 'hansel-and-gretel-witch-hunters-2013': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Hansel And Gretel Witch Hunters | 2013 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/c882c7181f4ca59a91306.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Hansel_And_Gretel_Witch_Hunters_2013_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Hansel And Gretel Witch Hunters 2013 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'harrypotter':
				case 'harry-potter-and-the-philosophers-stone-2001':
				case 'harry-potter-and-the-chamber-of-secrets-2002':
				case 'harry-potter-and-the-prisoner-of-azkaban-2004':
				case 'harry-potter-and-the-goblet-of-fire_2005':
				case 'harry-potter-and-the-order-of-the-phoenix-2007':
				case 'harry-potter-and-the-half-blood-prince-2009':
				case 'harry-potter-and-the-deathly-hallows-part1-2010':
				case 'harry-potter-and-the-deathly-hallows-part2-2011': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Harry Potter | 2001 - 2011 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/7e2001e312c96641ffbbe.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Harry_Potter_And_The_Philosophers_Stone_2001_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Harry Potter And The Philosophers Stone 2001 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Harry_Potter_And_The_Chamber_Of_Secrets_2002_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Harry Potter And The Chamber Of Secrets 2002 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Harry_Potter_And_The_Prisoner_Of_Azkaban_2004_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Harry Potter And The Prisoner Of Azkaban 2004 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Harry_Potter_And_The_Goblet_Of_Fire_2005_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Harry Potter And The Goblet Of Fire 2005 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Harry_Potter_And_The_Order_Of_The_Phoenix_2007_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Harry Potter And The Order Of The Phoenix 2007 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Harry_Potter_And_The_Half_Blood_Prince_2009_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Harry Potter And The Half Blood Prince 2009 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Harry_Potter_And_The_Deathly_Hallows_Part1_2010_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Harry Potter And The Deathly Hallows Part - 1 2010 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Harry_Potter_And_The_Deathly_Hallows_Part2_2011_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Harry Potter And The Deathly Hallows Part - 2 2011 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'hellboy':
				case 'hellboy-2004':
				case 'hellboy-the-golden-army-2008':
				case 'hellboy-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Hellboy | 2004 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/8d320aa9a95b3368a38cb.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Hellboy_2004_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Hellboy 2004 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Hellboy_The_Golden_Army_2008_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Hellboy The Golden Army 2008 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Hellboy_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Hellboy 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'hercules':
				case 'hercules-2014': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Hercules | 2014 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/bbe7f7e06d63c27c30403.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Hercules_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Hercules 2014 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'homealone':
				case 'home-alone-1990':
				case 'Home-alone-lost-in-new-york-1992': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Home Alone | 1990 - 2021 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/d1ef02db098bb5d1bcffa.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Home_Alone_1990_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Home Alone 1990 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Home_Alone_Lost_In_New_York_1992_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Home Alone Lost In New York 1992 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'hoteltransylvania':
				case 'hotel-transylvania-summer-vacation-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Hotel Transylvania | 2012 - 2022 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/5ba005a6c7c26dcc406d8.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Hotel_Transylvania_Summer_Vacation_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Hotel Transylvania Summer Vacation 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'howtotrainyourdragon':
				case 'how-to-train-your-dragon-2010':
				case 'how-to-train-your-dragon-2014':
				case 'how-to-train-your-dragon-homecoming-2019':
				case 'how-to-train-your-dragon-the-hidden-world-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "How To Train Your Dragon | 2010 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/b52bbd1910ef43b386000.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/How_To_Train_Your_Dragon_2010_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro How To Train Your Dragon 2010 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/How_To_Train_Your_Dragon_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro How To Train Your Dragon 2014 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/How_To_Train_Your_Dragon_Homecoming_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro How To Train Your Dragon Homecoming 2019 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/How_To_Train_Your_Dragon_The_Hidden_World_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro How To Train Your Dragon The Hidden World 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'ironman':
				case 'iron-man-2008':
				case 'iron-man-2010':
				case 'iron-man-2013': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Iron Man | 2008 - 2013 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/e51db6a7eb5f8fa95e2f9.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Iron_Man_2008_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Iron Man 2008 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Iron_Man_2010_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Iron Man 2010 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Iron_Man_2013_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Iron Man 2013 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'ironsky':
				case 'iron-sky-2012':
				case 'iron-sky-the-coming-race-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Iron Sky | 2012 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/a2d410cbdff7f38a4c785.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Iron_Sky_2012_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Iron Sky 2012 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Iron_Sky_The_Coming_Race_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Iron Sky The Coming Race 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'joker':
				case 'joker-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Joker | 2019 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/30ab04a6ecdb45ee83dd2.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Joker_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Joker 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'jumanji':
				case 'jumanji-1995':
				case 'jumanji-the-next-level-2019':
				case 'jumanji-welcome-to-the-jungle-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Jumanji | 1995 - 2017 | English | Movie Series| Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/814d2a0870ac455fc581e.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jumanji_1995_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jumanji 1995 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jumanji_The_Next_Level_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jumanji The Next Level 2019 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jumanji_Welcome_To_The_Jungle_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jumanji Welcome To The Jungle 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'junglecruise':
				case 'jungle-Cruise-2021': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Jungle Cruise | 2021 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/0ac2f36a0a4d90f014cbb.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jungle_Cruise_2021_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jungle Cruise 2021 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'jurassicpark':
				case 'jurassic-park-1993':
				case 'jurassic-park-the-lost-world-1997':
				case 'jurassic-park-2001': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Jurassic Park | 1993 - 2001 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/32f4d6e8796be548fd1a9.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jurassic_Park_1993_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jurassic Park 1993 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jurassic_Park_The_Lost_World_1997_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jurassic Park The Lost World 1997 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jurassic_Park_2001_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jurassic Park 2001 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'jurassicworld':
				case 'jurassic-world-2015':
				case 'jurassic-world-fallen-kingdom-2018':
				case 'jurassic-world-dominion-2022': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Jurassic World | 2015 - 2022 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/d5a181235c95dbf0fc8ec.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jurassic_World_2015_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jurassic World 2015 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jurassic_World_Fallen_Kingdom_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jurassic World Fallen Kingdom 2018 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Jurassic_World_Dominion_2022_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Jurassic World Dominion 2022 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'justiceleague':
				case 'justice-league-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Justice League | 2017 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/efc56c07f8cddfa6f8404.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Justice_League_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Justice League 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'keepingupwiththejoneses':
				case 'keeping-Up-With-The-Joneses-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Keeping Up With The Joneses | 2016 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/43e207293e37f04792d55.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Keeping_Up_With_The_Joneses_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Keeping Up With The Joneses 2016 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'kingarthur':
				case 'king-arthur-legend-of-the-sword-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "King Arthur Legend Of The Sword | 2017 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/f3ded4ccfb82a6a3d2b99.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/King_Arthur_Legend_Of_The_Sword_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro King Arthur Legend Of The Sword 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'kingsman':
				case 'kingsman-the-secret-service-2014':
				case 'kingsman-the-golden-circle-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Kingsman | 2014 - 2017 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/4d989079bb8784c3812ed.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Kingsman_The_Secret_Service_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Kingsman The Secret Service 2014 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Kingsman_The_Golden_Circle_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Kingsman The Golden Circle 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'logan':
				case 'logan-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Logan | 2017 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/eef2e8611d92c00593e21.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Logan_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Logan 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'loveandmonsters':
				case 'love-and-monsters-2020': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Love And Monsters | 2020 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/60341f4ad84a6302401a1.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Love_And_Monsters_2020_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Love And Monsters 2020 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'lucy':
				case 'lucy-2014': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Lucy | 2014 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/6f9d13f6090259b9cb15a.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Lucy_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Lucy 2014 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'madmax':
				case 'mad-max-1979':
				case 'mad-max-the-road-warrior-1980':
				case 'mad-max-beyond-thunderdome-1985':
				case 'mad-max-fury-road-2015': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Mad Max | 1979 - 2015 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/8f2ae6f9dd6cdb1d0b1b4.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mad_Max_1979_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mad Max 1979 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mad_Max_The_Road_Warrior_1980_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mad Max The Road Warrior 1980 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mad_Max_Beyond_Thunderdome_1985_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mad Max Beyond Thunderdome 1985 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mad_Max_Fury_Road_2015_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mad Max Fury Road 2015 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'maleficent':
				case 'maleficent-2014':
				case 'maleficent-mistress-of-evil-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Maleficent | 2014 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/5d5858e6f37d6c986b1df.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Maleficent_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Maleficent 2014 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Maleficent_Mistress_Of_Evil_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Maleficent Mistress Of Evil 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'manofsteel':
				case 'man-of-steel-2013': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Man Of Steel | 2013 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/82b22aeb646bdec5ad5bc.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Man_Of_Steel_2013_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Man Of Steel 2013 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'maxsteel':
				case 'max-steel-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Max Steel | 2016 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/a5310ed2a86a870ef78fe.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Max_Steel_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Max Steel 2016 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'max':
				case 'max-white-house-hero-2017': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Max White House Hero | 2017 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/25113ce641ec05324b12a.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Max_White_House_Hero_2017_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Max White House Hero 2017 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'mazerunner':
				case 'maze-runner-2014':
				case 'maze-runner-the-scorch-trials-2015':
				case 'maze-runner-the-death-cure-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Maze Runner | 2014 - 2018 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/7949e74749ddc7f61291b.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Maze_Runner_2014_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Maze Runner 2014 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Maze_Runner_The_Scorch_Trials_2015_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Maze Runner The Scorch Trials 2015 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Maze_Runner_The_Death_Cure_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Maze Runner The Death Cure 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'meninblack':
				case 'men-in-black-1997':
				case 'men-in-black-2002':
				case 'men-in-black-2012':
				case 'men-in-black-international-2019': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Men In Black | 1997 - 2019 | English | Movie Series | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/7d05b01d05a9117d05f7c.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Men_In_Black_1997_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Men In Black 1997 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Men_In_Black_2002_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Men In Black 2002 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Men_In_Black_2012_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Men In Black 2012 .mkv'
					})
					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Men_In_Black_International_2019_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Men In Black International 2019 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'mikeanddaveneedweddingdates':
				case 'mike-and-dave-need-wedding-dates-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Mike And Dave Need Wedding Dates | 2016 | 18+ | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/88b85bb7dea472be102ce.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mike_And_Dave_Need_Wedding_Dates_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mike And Dave Need Wedding Dates 2016 18+ .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'minionstheriseofgru':
				case 'minions-the-rise-of-gru-2022': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Minions The Rise Of Gru | 2022 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/5add7bba9c5bb57a58b84.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Minions_The_Rise_Of_Gru_2022_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Minions The Rise Of Gru 2022 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'moana':
				case 'moana-2016': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Moana | 2016 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/7ce7dc8188b7018085f69.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Moana_2016_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Moana 2016 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'moonfall':
				case 'moonfall-2022': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Moonfall | 2022 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/198b4021264bdb4fa0311.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Moonfall_2022_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Moonfall 2022 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'morbius':
				case 'morbius-2022': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Morbius | 2022 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/e3a3157b7de3d1de35e8d.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Morbius_2022_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Morbius 2022 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'mortalengines':
				case 'mortal-engines-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Mortal Engines | 2018 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/257df48e28d17fdc169e3.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mortal_Engines_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mortal Engines 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'mortalkombat':
				case 'mortal-kombat-2021': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Mortal Kombat | 2021 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/16515f88554eb20b71524.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mortal_Kombat_2021_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mortal Kombat 2021 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'mowglilegendofthejungle':
				case 'mowgli-legend-of-the-jungle-2018': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Mowgli Legend Of The Jungle | 2018 | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/4ddfbb02e7e469a7538de.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mowgli_Legend_Of_The_Jungle_2018_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mowgli Legend Of The Jungle 2018 .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
				}
					break

				case 'Mr&Mrssmith':
				case 'Mr.-&-Mrs.-smith-2005': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					await conn.sendMessage(from, {
						caption: "Mr. & Mrs. Smith | 2005 | 18+ | English | Movie | Sinhala Subtitles | TV Zone | " + config.FOOTER,
						footer: config.FOOTER,
						image: { url: "https://telegra.ph/file/a19233de59118f7390de7.jpg" }
					})

					conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/en_mv/Mr._&_Mrs._Smith_2005_@nadithpro.mkv' },
						mimetype: config.MKVTYPE,
						fileName: '@nadithpro Mr. & Mrs. Smith 2005 18+ .mkv'
					})
					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })
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
