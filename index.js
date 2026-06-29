const { 
    Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, 
    ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle 
} = require('discord.js');
const fs = require('fs');

// Konfigurasi File
const DB_FILE = './database.json';
const WORDS_FILE = './words.json';

// Setup File Otomatis
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}));
if (!fs.existsSync(WORDS_FILE)) {
    const defaultWords = [
        { civ: "Polisi", uc: "Satpam" },
        { civ: "Rumah", uc: "Apartemen" },
        { civ: "Laptop", uc: "Komputer" },
        { civ: "Gitar", uc: "Ukulele" }
    ];
    fs.writeFileSync(WORDS_FILE, JSON.stringify(defaultWords, null, 2));
}

let db = JSON.parse(fs.readFileSync(DB_FILE));
let wordsDB = JSON.parse(fs.readFileSync(WORDS_FILE));

function saveDB() { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }
function saveWords() { fs.writeFileSync(WORDS_FILE, JSON.stringify(wordsDB, null, 2)); }

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Channel]
});

// State Game per Channel
const activeGames = new Map();

// --- SISTEM DATABASE & XP ---
function getUser(id) {
    if (!db[id]) {
        db[id] = { 
            games: 0, wins: 0, losses: 0, uc_count: 0, civ_count: 0, 
            xp: 0, level: 1, title: 'Rookie', achievements: [], afk_strikes: 0 
        };
    }
    return db[id];
}

function checkLevelAndAchievements(id) {
    const u = getUser(id);
    const newLevel = Math.floor(u.xp / 100) + 1;
    if (newLevel > u.level) u.level = newLevel;

    if (u.level >= 50) u.title = 'Legend';
    else if (u.level >= 30) u.title = 'Master Detective';
    else if (u.level >= 20) u.title = 'Agent';
    else if (u.level >= 10) u.title = 'Detective';
    else u.title = 'Rookie';

    const ach = u.achievements;
    if (u.wins >= 1 && !ach.includes('First Win')) ach.push('First Win');
    if (u.games >= 100 && !ach.includes('100 Games')) ach.push('100 Games');
    saveDB();
}

client.on('ready', () => {
    console.log(`✅ Bot berhasil login sebagai ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args[0].toLowerCase();

    // 1. COMMAND: !undercover (LOBBY)
    if (command === '!undercover') {
        if (activeGames.has(message.channel.id)) {
            return message.reply("Sedang ada permainan yang berlangsung atau lobby aktif di channel ini!");
        }

        const game = {
            host: message.author.id,
            players: [message.author.id],
            status: 'Lobby',
            embedMsg: null,
            timeout: null,
            roles: {},
            words: {},
            clues: {}, // Menyimpan deskripsi ciri-ciri pemain
            turnIndex: 0,
            votes: {},
            afk: {}
        };
        activeGames.set(message.channel.id, game);

        const embed = new EmbedBuilder()
            .setTitle('UNDERCOVER 🎲')
            .setColor('Green')
            .addFields(
                { name: 'Host', value: `<@${message.author.id}>`, inline: true },
                { name: 'Pemain (1/15)', value: `<@${message.author.id}>` },
                { name: 'Status', value: 'Menunggu pemain...' }
            )
            .setFooter({ text: 'Minimal 3, Max 15 Pemain | Lobby kadaluarsa dalam 30 menit.' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('join_game').setLabel('Join').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('leave_game').setLabel('Leave').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('start_game').setLabel('Start').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('stop_game').setLabel('Stop').setStyle(ButtonStyle.Secondary)
        );

        const embedMsg = await message.channel.send({ embeds: [embed], components: [row] });
        game.embedMsg = embedMsg;

        game.timeout = setTimeout(() => {
            if (activeGames.has(message.channel.id) && activeGames.get(message.channel.id).status === 'Lobby') {
                activeGames.delete(message.channel.id);
                embedMsg.edit({ content: 'Lobby dibatalkan karena tidak ada aktivitas (Timeout 30 Menit).', components: [] }).catch(()=>console.log('Pesan terhapus'));
            }
        }, 30 * 60 * 1000);
    }

    if (command === '!help') {
        const embed = new EmbedBuilder()
            .setTitle('🎮 PANDUAN GAME UNDERCOVER')
            .setDescription('Selamat datang! Ini adalah panduan lengkap untuk bermain Undercover.')
            .setColor(0x5865F2)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '📋 Cara Bermain', value: '1. Ketik `!undercover` untuk membuat lobby.\n2. Pemain klik **Join**.\n3. Host klik **Start**.\n4. Cek peranmu via tombol **Lihat Peranku**.\n5. Deskripsikan katamu secara bergantian lewat tombol yang disediakan.\n6. Voting untuk eliminasi Undercover.' },
                { name: '🕵️ Peran Pemain', value: '• **Civilian**: Kata sama.\n• **Undercover**: Kata mirip.\n• **Mr. White**: Tidak ada kata.' }
            );
        return message.reply({ embeds: [embed] });
    }

    if (command === '!pfu') {
        const u = getUser(message.author.id);
        const winrate = u.games > 0 ? ((u.wins / u.games) * 100).toFixed(1) : 0;
        const embed = new EmbedBuilder()
            .setTitle(`Profil Undercover: ${message.author.username}`)
            .setColor('Blue')
            .addFields(
                { name: 'Title / Level', value: `${u.title} (Lv. ${u.level})`, inline: true },
                { name: 'XP', value: `${u.xp}`, inline: true },
                { name: 'Total Game', value: `${u.games}`, inline: true },
                { name: 'Menang / Kalah', value: `${u.wins} / ${u.losses} (${winrate}%)`, inline: true }
            );
        return message.reply({ embeds: [embed] });
    }
});

// --- SISTEM INTERAKSI BUTTON, MODAL & VOTING ---
client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit()) return;
        
        const game = activeGames.get(interaction.channelId);
        
        if (!game) {
            return await interaction.reply({ 
                content: '❌ Game ini sudah tidak aktif / Sesi habis (Mungkin bot habis restart). Ketik `!undercover` untuk main lagi.', 
                ephemeral: true 
            });
        }

        // 1. HANDLER UNTUK TOMBOL (BUTTON)
        if (interaction.isButton()) {
            const id = interaction.customId;

            if (id === 'join_game') {
                if (game.status !== 'Lobby') return await interaction.reply({ content: 'Game sudah berjalan!', ephemeral: true });
                if (game.players.includes(interaction.user.id)) return await interaction.reply({ content: 'Kamu sudah bergabung!', ephemeral: true });
                if (game.players.length >= 15) return await interaction.reply({ content: 'Lobby penuh!', ephemeral: true });
                
                game.players.push(interaction.user.id);
                await updateLobbyEmbed(game, interaction);
            }
            else if (id === 'leave_game') {
                if (game.status !== 'Lobby') return await interaction.reply({ content: 'Game sudah berjalan, kamu tidak bisa keluar sekarang!', ephemeral: true });
                if (game.host === interaction.user.id) return await interaction.reply({ content: 'Host tidak bisa leave. Gunakan Stop.', ephemeral: true });
                if (!game.players.includes(interaction.user.id)) return await interaction.reply({ content: 'Kamu belum bergabung!', ephemeral: true });
                
                game.players = game.players.filter(p => p !== interaction.user.id);
                await updateLobbyEmbed(game, interaction);
            }
            else if (id === 'stop_game') {
                if (game.host !== interaction.user.id) return await interaction.reply({ content: 'Hanya host yang bisa menghentikan game.', ephemeral: true });
                activeGames.delete(interaction.channelId);
                clearTimeout(game.timeout);
                return await interaction.update({ content: '🛑 Game dibatalkan oleh host.', embeds: [], components: [] });
            }
            else if (id === 'start_game') {
                if (game.host !== interaction.user.id) return await interaction.reply({ content: 'Hanya host yang bisa memulai game.', ephemeral: true });
                if (game.players.length < 3) return await interaction.reply({ content: 'Minimal 3 pemain untuk memulai!', ephemeral: true });
                
                clearTimeout(game.timeout);
                await startGame(game, interaction);
            }
            else if (id === 'view_role') {
                const role = game.roles[interaction.user.id];
                if (!role) return await interaction.reply({ content: 'Kamu tidak ikut bermain.', ephemeral: true });
                
                let text = `Kamu adalah **${role}**!\n`;
                if (role === 'Civilian') text += `Kata rahasiamu: **${game.words.civ}**`;
                else if (role === 'Undercover') text += `Kata rahasiamu: **${game.words.uc}**`;
                else text += `Kamu tidak mendapatkan kata (Kosong). Berbaurlah sebaik mungkin!`;

                return await interaction.reply({ content: text, ephemeral: true });
            }
            else if (id === 'input_clue') {
                const currentPlayer = game.players[game.turnIndex];
                if (interaction.user.id !== currentPlayer) {
                    return await interaction.reply({ content: `Ini bukan giliranmu! Tunggu <@${currentPlayer}>`, ephemeral: true });
                }

                // Memunculkan Popup Modal Input Ciri-Ciri
                const modal = new ModalBuilder()
                    .setCustomId('clue_modal')
                    .setTitle('Deskripsi Kata Rahasia');

                const clueInput = new TextInputBuilder()
                    .setCustomId('clue_input')
                    .setLabel('Masukkan ciri-ciri / deskripsi katamu:')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('Contoh: Benda ini sering ada di dapur dan tajam...')
                    .setRequired(true)
                    .setMaxLength(200);

                const firstActionRow = new ActionRowBuilder().addComponents(clueInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
            }
            else if (id === 'next_turn') {
                const currentPlayer = game.players[game.turnIndex];
                if (interaction.user.id !== currentPlayer) {
                    return await interaction.reply({ content: `Ini bukan giliranmu! Tunggu <@${currentPlayer}>`, ephemeral: true });
                }
                
                if (!game.clues[interaction.user.id]) {
                    return await interaction.reply({ content: `Kamu belum memberikan deskripsi! Klik tombol **Isi Deskripsi** terlebih dahulu.`, ephemeral: true });
                }
                
                await interaction.deferUpdate().catch(console.error); 
                
                clearTimeout(game.timeout);
                game.turnIndex++;
                await nextTurn(game, interaction.channel);
            }
        }

        // 2. HANDLER UNTUK MODAL SUBMIT (SIMPAN CIRI-CIRI)
        if (interaction.isModalSubmit() && interaction.customId === 'clue_modal') {
            const currentPlayer = game.players[game.turnIndex];
            if (interaction.user.id !== currentPlayer) {
                return await interaction.reply({ content: 'Ini bukan giliranmu!', ephemeral: true });
            }

            const clueText = interaction.fields.getTextInputValue('clue_input');
            game.clues[interaction.user.id] = clueText;

            let orderText = game.players.map((id, idx) => `${idx === game.turnIndex ? '👉 ' : ''}${idx + 1}. <@${id}>`).join('\n');
            
            const embed = new EmbedBuilder()
                .setTitle('Tahap Deskripsi')
                .setDescription(`**Urutan Pemain:**\n${orderText}\n\nSekarang giliran: <@${currentPlayer}>\n\nDeskripsi berhasil disimpan! Klik **Next Player** untuk lanjut ke pemain berikutnya.`)
                .setColor('Green');
                
            // Menampilkan seluruh ciri-ciri yang sudah terkumpul ke Embed agar bisa dilihat semua orang
            let cluesText = Object.entries(game.clues).map(([id, clue]) => `<@${id}>: ${clue}`).join('\n');
            embed.addFields({ name: '📝 Deskripsi Ciri-Ciri Pemain', value: cluesText });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('input_clue').setLabel('Ubah Deskripsi').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('next_turn').setLabel('Next Player').setStyle(ButtonStyle.Primary)
            );

            return await interaction.update({ embeds: [embed], components: [row] });
        }

        // 3. HANDLER UNTUK VOTING
        if (interaction.isStringSelectMenu() && interaction.customId === 'vote_menu') {
            await interaction.deferReply({ ephemeral: true }).catch(console.error);

            if (!game.players.includes(interaction.user.id)) return await interaction.editReply({ content: 'Kamu tidak bermain.' });
            if (game.votes[interaction.user.id]) return await interaction.editReply({ content: 'Kamu sudah melakukan voting!' });
            
            const votedFor = interaction.values[0];
            if (votedFor === interaction.user.id) return await interaction.editReply({ content: 'Kamu tidak boleh mengevote diri sendiri!' });

            game.votes[interaction.user.id] = votedFor;
            await interaction.editReply({ content: `Kamu mem-vote <@${votedFor}>.` });

            if (Object.keys(game.votes).length === game.players.length) {
                clearTimeout(game.timeout);
                await processVoteResults(game, interaction.channel);
            }
        }

    } catch (error) {
        console.error('Interaction Error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'Terjadi kesalahan sistem bot.', ephemeral: true }).catch(()=>null);
        }
    }
});

// ================= FUNGSI BANTUAN =================

async function updateLobbyEmbed(game, interaction) {
    const embed = EmbedBuilder.from(game.embedMsg.embeds[0])
        .setFields(
            { name: 'Host', value: `<@${game.host}>`, inline: true },
            { name: `Pemain (${game.players.length}/15)`, value: game.players.map(id => `<@${id}>`).join('\n') },
            { name: 'Status', value: 'Menunggu pemain...' }
        );
    await interaction.update({ embeds: [embed] }).catch(console.error);
}

async function startGame(game, interaction) {
    game.status = 'Playing';
    game.clues = {}; // Reset list deskripsi saat game baru dimulai
    
    game.players = game.players.sort(() => Math.random() - 0.5);
    const wordPair = wordsDB[Math.floor(Math.random() * wordsDB.length)];
    game.words = wordPair;

    let ucCount = 1, mwCount = 0;
    const pCount = game.players.length;
    if (pCount >= 6 && pCount <= 8) mwCount = 1;
    else if (pCount >= 9 && pCount <= 12) { ucCount = 2; mwCount = 1; }
    else if (pCount >= 13) { ucCount = 2; mwCount = 2; }

    let rolesArray = Array(ucCount).fill('Undercover').concat(Array(mwCount).fill('Mr. White'));
    while(rolesArray.length < pCount) rolesArray.push('Civilian');
    rolesArray = rolesArray.sort(() => Math.random() - 0.5);

    game.players.forEach((id, i) => {
        game.roles[id] = rolesArray[i];
        const u = getUser(id);
        u.games++;
        if (rolesArray[i] === 'Civilian') u.civ_count++;
        if (rolesArray[i] === 'Undercover') u.uc_count++;
    });

    const embed = new EmbedBuilder()
        .setTitle('Permainan Dimulai!')
        .setDescription('Klik tombol di bawah untuk melihat Peran dan Kata Rahasiamu.\n*(Pesan ini bersifat rahasia/ephemeral)*')
        .setColor('Green');
        
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_role').setLabel('Lihat Peranku').setStyle(ButtonStyle.Success)
    );

    await interaction.update({ embeds: [EmbedBuilder.from(game.embedMsg.embeds[0]).setColor('Grey').setDescription('Game sedang berjalan...').setFields([])], components: [] }).catch(console.error);
    await interaction.channel.send({ embeds: [embed], components: [row] });

    setTimeout(() => { nextTurn(game, interaction.channel); }, 3000);
}

async function nextTurn(game, channel) {
    if (game.turnIndex >= game.players.length) {
        return startVoting(game, channel);
    }

    const currentPlayer = game.players[game.turnIndex];
    let orderText = game.players.map((id, idx) => `${idx === game.turnIndex ? '👉 ' : ''}${idx + 1}. <@${id}>`).join('\n');

    const embed = new EmbedBuilder()
        .setTitle('Tahap Deskripsi')
        .setDescription(`**Urutan Pemain:**\n${orderText}\n\nSekarang giliran: <@${currentPlayer}>\n\nSilakan klik tombol **Isi Deskripsi** untuk menyebutkan ciri-ciri katamu!`)
        .setColor('Green');
        
    // Masukkan data ciri-ciri yang sudah terkumpul ke embed utama agar semua orang melihat
    if (Object.keys(game.clues).length > 0) {
        let cluesText = Object.entries(game.clues).map(([id, clue]) => `<@${id}>: ${clue}`).join('\n');
        embed.addFields({ name: '📝 Deskripsi Ciri-Ciri Pemain', value: cluesText });
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('input_clue').setLabel('Isi Deskripsi').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('next_turn').setLabel('Next Player').setStyle(ButtonStyle.Primary).setDisabled(true) // Dikunci sampai deskripsi diisi
    );

    await channel.send({ content: `<@${currentPlayer}>`, embeds: [embed], components: [row] });

    game.timeout = setTimeout(() => {
        getUser(currentPlayer).afk_strikes++;
        // Jika AFK/waktu habis, beri keterangan default agar game tidak stuck
        if(!game.clues[currentPlayer]) game.clues[currentPlayer] = "*(Tidak memberikan deskripsi / Waktu habis)*";
        channel.send(`Waktu habis untuk <@${currentPlayer}>! Lanjut otomatis.`);
        game.turnIndex++;
        nextTurn(game, channel);
    }, 180 * 1000); 
}

async function startVoting(game, channel) {
    const options = game.players.map(id => ({
        label: channel.guild.members.cache.get(id)?.displayName || 'Pemain',
        value: id,
        description: 'Pilih untuk mengeliminasi'
    }));

    const select = new StringSelectMenuBuilder()
        .setCustomId('vote_menu')
        .setPlaceholder('Pilih tersangka utama!')
        .addOptions(options);

    const row = new ActionRowBuilder().addComponents(select);
    
    const embed = new EmbedBuilder()
        .setTitle('Waktunya Voting!')
        .setDescription('Pilih siapa yang menurut kalian adalah Undercover / Mr. White.\nWaktu voting diperpanjang menjadi: **120 detik (2 Menit)**.')
        .setColor('Orange');

    // Tampilkan rekap ciri-ciri terakhir sebelum voting dimulai agar mempermudah analisa pemain
    if (Object.keys(game.clues).length > 0) {
        let cluesText = Object.entries(game.clues).map(([id, clue]) => `<@${id}>: ${clue}`).join('\n');
        embed.addFields({ name: '📊 Rekap Ciri-Ciri Putaran Ini', value: cluesText });
    }

    await channel.send({ embeds: [embed], components: [row] });

    game.timeout = setTimeout(() => {
        processVoteResults(game, channel);
    }, 120 * 1000);
}

async function processVoteResults(game, channel) {
    const tally = {};
    for (const p in game.votes) {
        tally[game.votes[p]] = (tally[game.votes[p]] || 0) + 1;
    }

    let highestVote = 0;
    let eliminatedId = null;
    let tie = false;

    for (const [targetId, count] of Object.entries(tally)) {
        if (count > highestVote) {
            highestVote = count;
            eliminatedId = targetId;
            tie = false;
        } else if (count === highestVote) {
            tie = true;
        }
    }

    if (tie || !eliminatedId) {
        await channel.send("Hasil vote seri atau tidak ada yang divote! Para Civilians Gagal. Undercover menang!");
        return endGame(game, channel, 'Undercover');
    }

    const elimRole = game.roles[eliminatedId];
    await channel.send(`Mayoritas vote mengarah ke <@${eliminatedId}>! Ternyata dia adalah **${elimRole}**.`);

    if (elimRole === 'Undercover') {
        await channel.send("Tebakan benar! Undercover berhasil ditangkap.");
        return endGame(game, channel, 'Civilian');
    } else if (elimRole === 'Mr. White') {
        await channel.send(`🚨 **PERHATIAN!** <@${eliminatedId}> adalah **Mr. White**!\nMr. White, kamu punya waktu 45 detik untuk mengetik tebakan kata dari Civilians di chat ini!`);
        
        const filter = m => m.author.id === eliminatedId;
        try {
            const collected = await channel.awaitMessages({ filter, max: 1, time: 45000, errors: ['time'] });
            const guess = collected.first().content.toLowerCase();
            const actualWord = game.words.civ.toLowerCase();
            
            if (guess.includes(actualWord)) {
                await channel.send(`Jawaban Mr. White BENAR! Katanya adalah **${game.words.civ}**.\nMr. White & Undercover Menang!`);
                return endGame(game, channel, 'Mr. White');
            } else {
                await channel.send(`Jawaban salah! Kata yang benar adalah **${game.words.civ}**. Mr. White gagal.\nPara Civilians Menang!`);
                return endGame(game, channel, 'Civilian');
            }
        } catch (e) {
            await channel.send("Mr. White kehabisan waktu menjawab. Para Civilians Menang!");
            return endGame(game, channel, 'Civilian');
        }
    } else {
        await channel.send("Tebakan salah! Kalian mengeliminasi Warga yang tidak bersalah.\nUndercover memenangkan permainan!");
        return endGame(game, channel, 'Undercover');
    }
}

async function endGame(game, channel, winnerTeam) {
    let ucNames = [], mwNames = [], civNames = [];
    
    for (const id of game.players) {
        const role = game.roles[id];
        if (role === 'Undercover') ucNames.push(`<@${id}>`);
        else if (role === 'Mr. White') mwNames.push(`<@${id}>`);
        else civNames.push(`<@${id}>`);
        
        const u = getUser(id);
        if (role === winnerTeam || (winnerTeam === 'Mr. White' && role === 'Undercover')) {
            u.wins++;
            u.xp += 50; 
        } else {
            u.losses++;
            u.xp += 10; 
        }
        checkLevelAndAchievements(id);
    }

    const embed = new EmbedBuilder()
        .setTitle('GAME OVER')
        .setColor('Grey')
        .addFields(
            { name: 'Pemenang', value: `🏆 **${winnerTeam === 'Mr. White' ? 'Mr. White & Undercover' : winnerTeam}**` },
            { name: `Undercover (Kata: ${game.words.uc})`, value: ucNames.length ? ucNames.join(', ') : 'Tidak ada' },
            { name: `Mr. White (Tidak ada kata)`, value: mwNames.length ? mwNames.join(', ') : 'Tidak ada' },
            { name: `Civilians (Kata: ${game.words.civ})`, value: civNames.length ? civNames.join(', ') : 'Tidak ada' }
        )
        .setFooter({ text: 'Sesi game ini telah selesai.' })
        .setTimestamp();

    await channel.send({ embeds: [embed] });
    activeGames.delete(channel.id);
}

client.login(process.env.DISCORD_TOKEN);
