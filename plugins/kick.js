const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k", "out"],
    desc: "Removes a member from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, senderNumber
}) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return reply("❌ Only the bot owner can use this command.");
    }

    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else {
        return reply("❌ Please reply to a message or mention a user to remove.");
    }

    const jid = number + "@s.whatsapp.net";
    
    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        
        // Proper WhatsApp newsletter JID format
        const msg = {
            text: `🗞️ *CASEYRHODES-XMD Newsletter Update*\n\n✅ Successfully removed @${number}\n\n_Action performed via official newsletter integration_`,
            mentions: [jid, m.sender],
            contextInfo: {
                forwardingNewsletterInfo: {
                    newsletterJid: '120363302677217436@g.us', // Corrected JID format
                    newsletterName: 'CASEYRHODES-XMD',
                    newsletterServerId: 143,
                    newsletterType: 0
                },
                isForwarded: true,
                forwardCount: 1
            }
        };

        await conn.sendMessage(from, msg, { quoted: mek });

    } catch (error) {
        console.error("Remove command error:", error);
        reply("❌ Failed to remove the member. Error: " + error.message);
    }
});
