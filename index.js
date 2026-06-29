const { 
    Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, 
    ButtonBuilder, ButtonStyle, StringSelectMenuBuilder 
} = require('discord.js');
const fs = require('fs');

// Konfigurasi File
const DB_FILE = './database.json';
const WORDS_FILE = './words.json';

// Setup File Otomatis
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}));
if (!fs.existsSync(WORDS_FILE)) {
    const defaultWords = [
        // ================= KATEGORI: MAKANAN & MINUMAN =================
        { civ: "Nasi Goreng", uc: "Mie Goreng" },
        { civ: "Kopi", uc: "Teh" },
        { civ: "Sate", uc: "Bakso" },
        { civ: "Es Krim", uc: "Gelato" },
        { civ: "Roti", uc: "Kue" },
        { civ: "Jeruk", uc: "Lemon" },
        { civ: "Apel", uc: "Pir" },
        { civ: "Semangka", uc: "Melon" },
        { civ: "Ayam Goreng", uc: "Bebek Goreng" },
        { civ: "Susu", uc: "Cokelat Panas" },
        { civ: "Mie Ayam", uc: "Soto Ayam" },
        { civ: "Mangga", uc: "Pisang" },
        { civ: "Anggur", uc: "Stroberi" },
        { civ: "Nanas", uc: "Pepaya" },
        { civ: "Durian", uc: "Nangka" },
        { civ: "Air Putih", uc: "Es Teh" },
        { civ: "Sirup", uc: "Jus Buah" },
        { civ: "Biskuit", uc: "Wafer" },
        { civ: "Keju", uc: "Mentega" },
        { civ: "Sambal", uc: "Kecap" },
        { civ: "Garam", uc: "Gula" },
        { civ: "Permen", uc: "Cokelat Batang" },
        { civ: "Es Serut", uc: "Es Krim" },
        { civ: "Tahu", uc: "Tempe" },
        { civ: "Telur Ceplok", uc: "Telur Dadar" },
        { civ: "Ikan Bakar", uc: "Udang Goreng" },
        { civ: "Kepiting", uc: "Cumi-cumi" },
        { civ: "Kerupuk", uc: "Keripik" },
        { civ: "Martabak", uc: "Terang Bulan" },
        { civ: "Pizza", uc: "Burger" },
        { civ: "Sosis", uc: "Nugget" },
        { civ: "Cireng", uc: "Cilok" },
        { civ: "Seblak", uc: "Makaroni Pedas" },
        { civ: "Tongseng", uc: "Gulai" },
        { civ: "Rawon", uc: "Soto Daging" },
        { civ: "Ketoprak", uc: "Gado-gado" },
        { civ: "Pempek", uc: "Siomay" },
        { civ: "Batagor", uc: "Cilok" },
        { civ: "Lontong", uc: "Ketupat" },
        { civ: "Bubur Ayam", uc: "Bubur Kacang Hijau" },
        { civ: "Onde-onde", uc: "Kelepon" },
        { civ: "Serabi", uc: "Pancake" },
        { civ: "Donat", uc: "Roti Bakar" },
        { civ: "Brownies", uc: "Bolu" },
        { civ: "Puding", uc: "Agar-agar" },
        { civ: "Teh Manis", uc: "Teh Tawar" },
        { civ: "Kopi Hitam", uc: "Kopi Susu" },
        { civ: "Jus Alpukat", uc: "Jus Mangga" },

        // ================= KATEGORI: HEWAN =================
        { civ: "Kucing", uc: "Anjing" },
        { civ: "Singa", uc: "Harimau" },
        { civ: "Sapi", uc: "Kambing" },
        { civ: "Ayam", uc: "Bebek" },
        { civ: "Buaya", uc: "Komodo" },
        { civ: "Ular", uc: "Cacing" },
        { civ: "Katak", uc: "Kodok" },
        { civ: "Elang", uc: "Burung Hantu" },
        { civ: "Kupu-kupu", uc: "Lebah" },
        { civ: "Nyamuk", uc: "Lalat" },
        { civ: "Semut", uc: "Rayap" },
        { civ: "Ikan", uc: "Udang" },
        { civ: "Kelinci", uc: "Marmut" },
        { civ: "Tikus", uc: "Tupai" },
        { civ: "Kuda", uc: "Keledai" },
        { civ: "Babi", uc: "Celeng" },
        { civ: "Macan", uc: "Cheetah" },
        { civ: "Gajah", uc: "Badak" },
        { civ: "Jerapah", uc: "Zebra" },
        { civ: "Monyet", uc: "Gorila" },
        { civ: "Beruang", uc: "Panda" },
        { civ: "Buaya", uc: "Biawak" },
        { civ: "Kura-kura", uc: "Penyu" },
        { civ: "Hiu", uc: "Paus" },
        { civ: "Lumba-lumba", uc: "Paus" },
        { civ: "Gurita", uc: "Cumi-cumi" },
        { civ: "Kelelawar", uc: "Burung" },
        { civ: "Angsa", uc: "Burung Unta" },
        { civ: "Merpati", uc: "Gagak" },
        { civ: "Kupu-kupu", uc: "Ngengat" },
        { civ: "Lebah", uc: "Tawon" },
        { civ: "Laba-laba", uc: "Kalajengking" },

        // ================= KATEGORI: BENDA SEHARI-HARI =================
        { civ: "Meja", uc: "Kursi" },
        { civ: "Lemari", uc: "Rak Buku" },
        { civ: "Kasur", uc: "Sofa" },
        { civ: "Bantal", uc: "Guling" },
        { civ: "Selimut", uc: "Sprei" },
        { civ: "Pintu", uc: "Jendela" },
        { civ: "Kunci", uc: "Gembok" },
        { civ: "Sapu", uc: "Pel" },
        { civ: "Ember", uc: "Gayung" },
        { civ: "Sabun Mandi", uc: "Sampo" },
        { civ: "Sikat Gigi", uc: "Pasta Gigi" },
        { civ: "Handuk", uc: "Tisu" },
        { civ: "Cermin", uc: "Kaca Jendela" },
        { civ: "Piring", uc: "Mangkok" },
        { civ: "Sendok", uc: "Garpu" },
        { civ: "Gelas", uc: "Cangkir" },
        { civ: "Pisau", uc: "Gunting" },
        { civ: "Panci", uc: "Wajan" },
        { civ: "Kompor", uc: "Oven" },
        { civ: "Rumah", uc: "Apartemen" },
        { civ: "Jam Dinding", uc: "Jam Tangan" },
        { civ: "Tas Ransel", uc: "Koper" },
        { civ: "Dompet", uc: "Tas Selempang" },
        { civ: "Payung", uc: "Jas Hujan" },
        { civ: "Sepatu", uc: "Sandal" },
        { civ: "Kaus Kaki", uc: "Sarung Tangan" },
        { civ: "Topi", uc: "Helm" },
        { civ: "Kacamata", uc: "Softlens" },
        { civ: "Buku Tulis", uc: "Majalah" },
        { civ: "Pensil", uc: "Pulpen" },
        { civ: "Penghapus", uc: "Tipe-X" },
        { civ: "Celengan", uc: "Dompet" },
        { civ: "Kalender", uc: "Jam Dinding" },
        { civ: "Bingkai Foto", uc: "Lukisan" },
        { civ: "Asbak", uc: "Tempat Sampah" },
        { civ: "Kemoceng", uc: "Sapu Lidi" },
        { civ: "Keset", uc: "Karpet" },
        { civ: "Selang Air", uc: "Gayung" },
        { civ: "Spons Cuci", uc: "Sikat" },
        { civ: "Paku", uc: "Baut" },
        { civ: "Palu", uc: "Obeng" },
        { civ: "Gergaji", uc: "Kapak" },
        { civ: "Lem", uc: "Selotip" },
        { civ: "Staples", uc: "Klip Kertas" },
        { civ: "Penggaris", uc: "Jangka" },
        { civ: "Spidol", uc: "Krayon" },
        { civ: "Kuas Cat", uc: "Rol Cat" },

        // ================= KATEGORI: ELEKTRONIK & TEKNOLOGI =================
        { civ: "HP", uc: "Tablet" },
        { civ: "Laptop", uc: "Komputer PC" },
        { civ: "TV", uc: "Monitor" },
        { civ: "Radio", uc: "Speaker Bluetooth" },
        { civ: "Kipas Angin", uc: "AC" },
        { civ: "Kulkas", uc: "Mesin Cuci" },
        { civ: "Setrika", uc: "Hairdryer" },
        { civ: "Kamera", uc: "CCTV" },
        { civ: "Mouse", uc: "Keyboard" },
        { civ: "Flashdisk", uc: "Hardisk Eksternal" },
        { civ: "Charger", uc: "Powerbank" },
        { civ: "Kabel USB", uc: "Colokan Listrik" },
        { civ: "Baterai", uc: "Aki Motor" },
        { civ: "Lampu Bohlam", uc: "Senter" },
        { civ: "Earphone", uc: "Headphone" },
        { civ: "Proyektor", uc: "Layar Tancap" },
        { civ: "Printer", uc: "Scanner" },
        { civ: "Mikrofon", uc: "Megafon" },
        { civ: "Smartwatch", uc: "Jam Tangan" },
        { civ: "Router WiFi", uc: "Modem" },

        // ================= KATEGORI: KENDARAAN =================
        { civ: "Motor", uc: "Mobil" },
        { civ: "Sepeda", uc: "Motor Listrik" },
        { civ: "Pesawat", uc: "Helikopter" },
        { civ: "Kapal Laut", uc: "Perahu Kayu" },
        { civ: "Kereta Api", uc: "Bus Trans" },
        { civ: "Truk", uc: "Mobil Box" },
        { civ: "Taksi", uc: "Angkot" },
        { civ: "Ambulans", uc: "Mobil Polisi" },
        { civ: "Traktor", uc: "Buldoser" },
        { civ: "Rakit", uc: "Perahu" },

        // ================= KATEGORI: TEMPAT & LOKASI =================
        { civ: "Pasar", uc: "Supermarket" },
        { civ: "Sekolah", uc: "Kampus" },
        { civ: "Rumah Sakit", uc: "Puskesmas" },
        { civ: "Bioskop", uc: "Teater" },
        { civ: "Pantai", uc: "Gunung" },
        { civ: "Sungai", uc: "Danau" },
        { civ: "Hutan", uc: "Taman Kota" },
        { civ: "Bank", uc: "Mesin ATM" },
        { civ: "Hotel", uc: "Villa" },
        { civ: "Rumah", uc: "Apartemen" },
        { civ: "Kos-kosan", uc: "Rumah Kontrakan" },
        { civ: "Kantor", uc: "Pabrik" },
        { civ: "Mall", uc: "Plaza" },
        { civ: "Toko Kelontong", uc: "Warung Makan" },
        { civ: "Restoran", uc: "Kafe" },
        { civ: "Apotek", uc: "Klinik" },
        { civ: "Museum", uc: "Perpustakaan" },
        { civ: "Stasiun", uc: "Terminal Bus" },
        { civ: "Bandara", uc: "Pelabuhan" },
        { civ: "Kolam Renang", uc: "Waterboom" },
        { civ: "Masjid", uc: "Mushola" },
        { civ: "Gereja", uc: "Kuil" },
        { civ: "Penjara", uc: "Kantor Polisi" },

        // ================= KATEGORI: PEKERJAAN / PROFESI =================
        { civ: "Dokter", uc: "Perawat" },
        { civ: "Indomie", uc: "Mie Sedaap" },
        { civ: "Guru", uc: "Dosen" },
        { civ: "Polisi", uc: "Tentara" },
        { civ: "Koki", uc: "Pelayan Restoran" },
        { civ: "Supir", uc: "Pilot" },
        { civ: "Penyanyi", uc: "Aktor" },
        { civ: "Petani", uc: "Nelayan" },
        { civ: "Satpam", uc: "Bodyguard" },
        { civ: "Hakim", uc: "Pengacara" },
        { civ: "Presiden", uc: "Menteri" },
        { civ: "Walikota", uc: "Bupati" },
        { civ: "Nahkoda", uc: "Masinis" },
        { civ: "Pedagang", uc: "Kasir" },
        { civ: "Montir", uc: "Tukang Kayu" },
        { civ: "Penjahit", uc: "Desainer Baju" },
        { civ: "Pramugari", uc: "Resepsionis" },
        { civ: "Tukang Cukur", uc: "Pemilik Salon" },
        { civ: "Arsitek", uc: "Insinyur" },
        { civ: "Atlet", uc: "Wasit" },
        { civ: "Pelatih", uc: "Manajer" },

        // ================= KATEGORI: PAKAIAN & AKSESORIS =================
        { civ: "Kemeja", uc: "Kaos" },
        { civ: "Celana", uc: "Rok" },
        { civ: "Celana Dalam", uc: "Singlet" },
        { civ: "Jaket", uc: "Sweater" },
        { civ: "Jas", uc: "Mantel Musim Dingin" },
        { civ: "Dasi", uc: "Pita Rambut" },
        { civ: "Sabuk", uc: "Ikat Pinggang" },
        { civ: "Gelang", uc: "Kalung" },
        { civ: "Cincin", uc: "Anting" },
        { civ: "Mahkota", uc: "Mutiara" },
        { civ: "Helm", uc: "Topi" },
        { civ: "Hijab", uc: "Ciput" },
        { civ: "Sarung", uc: "Mukena" },
        { civ: "Kebaya", uc: "Batik" },

        // ================= KATEGORI: ALAM & LINGKUNGAN =================
        { civ: "Matahari", uc: "Bulan" },
        { civ: "Hujan", uc: "Salju" },
        { civ: "Bintang", uc: "Awan" },
        { civ: "Api", uc: "Air" },
        { civ: "Tanah", uc: "Pasir" },
        { civ: "Batu", uc: "Kerikil" },
        { civ: "Pohon", uc: "Bunga" },
        { civ: "Daun", uc: "Akar" },
        { civ: "Kayu", uc: "Bambu" },
        { civ: "Rumput", uc: "Lumut" },
        { civ: "Besi", uc: "Emas" },
        { civ: "Perak", uc: "Perunggu" },
        { civ: "Angin", uc: "Badai" },
        { civ: "Siang", uc: "Malam" },
        { civ: "Pagi", uc: "Sore" },

        // ================= KATEGORI: ANGGOTA TUBUH =================
        { civ: "Mata", uc: "Telinga" },
        { civ: "Hidung", uc: "Mulut" },
        { civ: "Gigi", uc: "Lidah" },
        { civ: "Tangan", uc: "Kaki" },
        { civ: "Jari", uc: "Kuku" },
        { civ: "Rambut", uc: "Bulu Kuduk" },
        { civ: "Kepala", uc: "Leher" },
        { civ: "Perut", uc: "Dada" },
        { civ: "Punggung", uc: "Bahu" },
        { civ: "Lutut", uc: "Siku" },

        // ================= KATEGORI: HOBI & OLAHRAGA =================
        { civ: "Sepak Bola", uc: "Futsal" },
        { civ: "Basket", uc: "Voli" },
        { civ: "Bulu Tangkis", uc: "Tenis" },
        { civ: "Berenang", uc: "Menyelam" },
        { civ: "Berlari", uc: "Jalan" },
        { civ: "Tinju", uc: "Karate" },
        { civ: "Catur", uc: "Karambol" },
        { civ: "Memancing", uc: "Menjala Ikan" },
        { civ: "Membaca", uc: "Menulis" },
        { civ: "Menggambar", uc: "Mewarnai" },

        // ================= KATEGORI: LAIN-LAIN (MISC) =================
        { civ: "Kertas", uc: "Kardus" },
        { civ: "Plastik", uc: "Karet" },
        { civ: "Kaca", uc: "Cermin" },
        { civ: "Benang", uc: "Tali Tambang" },
        { civ: "Kain", uc: "Sutra" },
        { civ: "Kapas", uc: "Busa" },
        { civ: "Asap", uc: "Debu" },
        { civ: "Bayangan", uc: "Cahaya" },
        { civ: "Tiket", uc: "Karcis" },
        { civ: "Paspor", uc: "KTP" },
        { civ: "Uang", uc: "Koin" },
        { civ: "Kartu Kredit", uc: "Cek Bank" },
        { civ: "Hadiah", uc: "Kado" },
        { civ: "Balon", uc: "Pita" },
        { civ: "Lilin", uc: "Lampu Teplok" },
        { civ: "Korek Api", uc: "Mancis" },
        { civ: "Rokok", uc: "Cerutu" },
        { civ: "Parfum", uc: "Deodoran" },
        { civ: "Kosmetik", uc: "Skincare" },
        { civ: "Lipstik", uc: "Bedak" },
        { civ: "Deterjen", uc: "Pewangi Pakaian" },
        { civ: "Gitar", uc: "Bass" },
        { civ: "Piano", uc: "Keyboard Musik" },
        { civ: "Drum", uc: "Gendang" },
        { civ: "Suling", uc: "Terompet" },
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
    // Leveling (Setiap 100 XP = 1 Level untuk simplifikasi)
    const newLevel = Math.floor(u.xp / 100) + 1;
    if (newLevel > u.level) u.level = newLevel;

    // Titles
    if (u.level >= 50) u.title = 'Legend';
    else if (u.level >= 30) u.title = 'Master Detective';
    else if (u.level >= 20) u.title = 'Agent';
    else if (u.level >= 10) u.title = 'Detective';
    else u.title = 'Rookie';

    // Achievements
    const ach = u.achievements;
    if (u.wins >= 1 && !ach.includes('First Win')) ach.push('First Win');
    if (u.games >= 100 && !ach.includes('100 Games')) ach.push('100 Games');
    saveDB();
}

client.on('ready', () => {
    console.log(`✅ BOT BERHASIL LOGIN SEBAGAI ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args[0].toLowerCase();

    // 1. COMMAND: !undercover (LOBBY)
    if (command === '!undercover') {
        if (activeGames.has(message.channel.id)) {
            return message.reply("SEDANG ADA PERMAINAN YANG BERLANGSUNG / LOBBY AKTIF DI CHANNEL INI!");
        }

        const game = {
            host: message.author.id,
            players: [message.author.id],
            status: 'Lobby',
            embedMsg: null,
            timeout: null,
            roles: {},
            words: {},
            turnIndex: 0,
            votes: {},
            afk: {}
        };
        activeGames.set(message.channel.id, game);

        const embed = new EmbedBuilder()
            .setTitle('UNDERCOVER 🕵️')
            .setColor('Green')
            .addFields(
                { name: 'Host', value: `<@${message.author.id}>`, inline: true },
                { name: 'Pemain (1/15)', value: `<@${message.author.id}>` },
                { name: 'Status', value: 'MENUNGGU PARA PEMAIN...' }
            )
            .setFooter({ text: 'MIN 3, MAX 15 PEMAIN' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('join_game').setLabel('JOIN').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('leave_game').setLabel('LEAVE').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('start_game').setLabel('START').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('stop_game').setLabel('STOP').setStyle(ButtonStyle.Secondary)
        );

        const embedMsg = await message.channel.send({ embeds: [embed], components: [row] });
        game.embedMsg = embedMsg;

        // Auto cancel lobby 10 menit
        game.timeout = setTimeout(() => {
            if (activeGames.has(message.channel.id) && activeGames.get(message.channel.id).status === 'Lobby') {
                activeGames.delete(message.channel.id);
                embedMsg.edit({ content: 'LOBBY DIBATALKAN KARETA TIME OUT.', components: [] });
            }
        }, 10 * 60 * 1000);
    }

    // 2. COMMAND: !pfu (PROFILE)
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
                { name: 'Menang / Kalah', value: `${u.wins} / ${u.losses} (${winrate}%)`, inline: true },
                { name: 'Role Stats', value: `Warga: ${u.civ_count} | Undercover: ${u.uc_count}`, inline: true },
                { name: 'Achievements', value: u.achievements.length > 0 ? u.achievements.join(', ') : 'Belum ada' }
            )
            .setThumbnail(message.author.displayAvatarURL());
        return message.reply({ embeds: [embed] });
    }

    // 3. COMMAND: !lbu (LEADERBOARD)
    if (command === '!lbu') {
        const sorted = Object.entries(db).sort((a, b) => b[1].wins - a[1].wins).slice(0, 10);
        let text = sorted.map((x, i) => `${i + 1}. <@${x[0]}> - ${x[1].wins} Menang`).join('\n') || 'DATA NOT FOUND.';
        const embed = new EmbedBuilder().setTitle(' <:9574plainribbon:1521050339552530595> LEARBOARD ON TOP').setDescription(text).setColor('Gold');
        return message.reply({ embeds: [embed] });
    }

    // 4. ADMIN COMMANDS
    if (command === '!addword' && message.member.permissions.has('Administrator')) {
        if (args.length < 3) return message.reply("Format: !addword [Warga] [Undercover]");
        wordsDB.push({ civ: args[1], uc: args[2] });
        saveWords();
        return message.reply(`KATA BERHASIL DI TAMBAHKAN: ${args[1]} - ${args[2]}`);
    }

    if (command === '!addxp' && message.member.permissions.has('Administrator')) {
        const target = message.mentions.users.first();
        const amount = parseInt(args[2]);
        if (!target || isNaN(amount)) return message.reply("Format: !addxp @user [jumlah]");
        const u = getUser(target.id);
        u.xp += amount;
        checkLevelAndAchievements(target.id);
        return message.reply(`Berhasil menambahkan ${amount} XP ke ${target.username}.`);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
    
    const game = activeGames.get(interaction.channelId);
    if (!game) return interaction.reply({ content: 'Game ini sudah tidak aktif / kadaluarsa.', ephemeral: true });

    // --- LOBBY BUTTONS ---
    if (interaction.isButton()) {
        const id = interaction.customId;

        if (id === 'join_game') {
            if (game.status !== 'Lobby') return interaction.reply({ content: 'Game sudah berjalan!', ephemeral: true });
            if (game.players.includes(interaction.user.id)) return interaction.reply({ content: 'Kamu sudah bergabung!', ephemeral: true });
            if (game.players.length >= 15) return interaction.reply({ content: 'Lobby penuh!', ephemeral: true });
            
            game.players.push(interaction.user.id);
            await updateLobbyEmbed(game, interaction);
        }
        else if (id === 'leave_game') {
            if (game.status !== 'Lobby') return interaction.reply({ content: 'Game sudah berjalan, kamu tidak bisa keluar sekarang!', ephemeral: true });
            if (game.host === interaction.user.id) return interaction.reply({ content: 'Host tidak bisa leave. Gunakan Stop.', ephemeral: true });
            if (!game.players.includes(interaction.user.id)) return interaction.reply({ content: 'Kamu belum bergabung!', ephemeral: true });
            
            game.players = game.players.filter(p => p !== interaction.user.id);
            await updateLobbyEmbed(game, interaction);
        }
        else if (id === 'stop_game') {
            if (game.host !== interaction.user.id) return interaction.reply({ content: 'Hanya host yang bisa menghentikan game.', ephemeral: true });
            activeGames.delete(interaction.channelId);
            clearTimeout(game.timeout);
            return interaction.update({ content: 'Game dibatalkan oleh host.', embeds: [], components: [] });
        }
        else if (id === 'start_game') {
            if (game.host !== interaction.user.id) return interaction.reply({ content: 'Hanya host yang bisa memulai game.', ephemeral: true });
            if (game.players.length < 3) return interaction.reply({ content: 'Minimal 3 pemain untuk memulai!', ephemeral: true });
            
            clearTimeout(game.timeout);
            await startGame(game, interaction);
        }
        
        // --- GAME PHASE BUTTONS ---
        else if (id === 'view_role') {
            const role = game.roles[interaction.user.id];
            if (!role) return interaction.reply({ content: 'Kamu tidak ikut bermain.', ephemeral: true });
            
            let text = `Kamu adalah **${role}**!\n`;
            if (role === 'Civilian') text += `YEY!! KAMU MENJADI WARGA BIASA, KATA RAHASIA MU: **${game.words.civ}**`;
            else if (role === 'Undercover') text += `OH NO!! KAMU MENJADI PENYAMAR, KATA RAHASIA MU: **${game.words.uc}**`;
            else text += `KAMU TIDAK MENDAPATKAN KATA ALIAS MR.WHITE<:6125_anonymous_logo:1521053104450310254>, BERBAURLAH SEBAIK MUNGKIN!`;

            return interaction.reply({ content: text, ephemeral: true });
        }
        else if (id === 'next_turn') {
            const currentPlayer = game.players[game.turnIndex];
            if (interaction.user.id !== currentPlayer) return interaction.reply({ content: `INI BUKAN GILIRAN KAMU! INI GILIRAN <@${currentPlayer}>`, ephemeral: true });
            
            clearTimeout(game.timeout);
            game.turnIndex++;
            await nextTurn(game, interaction.channel);
            interaction.deferUpdate(); // Silently ack
        }
    }

// 5. COMMAND: !help (Panduan Bermain)
    if (command === '!help') {
        const embed = new EmbedBuilder()
            .setTitle('<:806126playing:1521057212166967306> PANDUAN GAME UNDERCOVER')
            .setDescription('Berikut ini adalah panduan lengkap untuk bermain Undercover.')
            .setColor(0x5865F2) // Warna Blurple Discord
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { 
                    name: 'How to play', 
                    value: '1. Ketik `!undercover` untuk membuat lobby.\n' +
                           '2. Pemain lain klik **Join** untuk masuk.\n' +
                           '3. Host klik **Start** untuk memulai.\n' +
                           '4. Kamu akan mendapatkan kata rahasia via tombol **Lihat Peranku**.\n' +
                           '5. Deskripsikan katamu secara bergantian tanpa menyebutkan kata aslinya secara gamblang.\n' +
                           '6. Setelah semua bicara, lakukan **Voting** untuk mengeliminasi Undercover.'
                },
                {
                    name: '<:6071unknown:1521052301723435129> Peran Pemain',
                    value: '• **Civilian**: Mendapatkan kata yang sama.\n' +
                           '• **Undercover**: Mendapatkan kata yang mirip dengan Civilian.\n' +
                           '• **Mr. White**: Tidak mendapatkan kata apapun. Harus menebak kata Civilian agar menang!'
                },
                {
                    name: '<:2297_spin_gear:1521056399931478087> Perintah Bot',
                    value: '• `!undercover` - Memulai lobby baru.\n' +
                           '• `!pfu` - Cek statistik, level, dan achievement-mu.\n' +
                           '• `!lbu` - Lihat papan peringkat pemain terbaik.'
                }
            )
            .setFooter({ text: 'Tips: Berbohonglah dengan meyakinkan agar tidak tereliminasi!' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }

    // --- VOTING SYSTEM ---
    if (interaction.isStringSelectMenu() && interaction.customId === 'vote_menu') {
        if (!game.players.includes(interaction.user.id)) return interaction.reply({ content: 'Kamu tidak bermain.', ephemeral: true });
        if (game.votes[interaction.user.id]) return interaction.reply({ content: 'Kamu sudah melakukan voting!', ephemeral: true });
        
        const votedFor = interaction.values[0];
        if (votedFor === interaction.user.id) return interaction.reply({ content: 'Kamu tidak boleh mengevote diri sendiri!', ephemeral: true });

        game.votes[interaction.user.id] = votedFor;
        await interaction.reply({ content: `KAMU MEMILIH MEM VOTE <@${votedFor}>.`, ephemeral: true });

        // Cek jika semua sudah vote
        if (Object.keys(game.votes).length === game.players.length) {
            clearTimeout(game.timeout);
            await processVoteResults(game, interaction.channel);
        }
    }
});

// ================= FUNGSI BANTUAN =================

async function updateLobbyEmbed(game, interaction) {
    const embed = EmbedBuilder.from(game.embedMsg.embeds[0])
        .setFields(
            { name: 'Host', value: `<@${game.host}>`, inline: true },
            { name: `Pemain (${game.players.length}/15)`, value: game.players.map(id => `<@${id}>`).join('\n') },
            { name: 'Status', value: 'MENUNGGU PEMAIN...' }
        );
    await interaction.update({ embeds: [embed] });
}

async function startGame(game, interaction) {
    game.status = 'Playing';
    
    // Shuffle Player & Pick Word
    game.players = game.players.sort(() => Math.random() - 0.5);
    const wordPair = wordsDB[Math.floor(Math.random() * wordsDB.length)];
    game.words = wordPair;

    // Distribusi Role
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
        .setTitle('PERMAINAN DIMULAI!')
        .setDescription('SILAHKAN KLIK TOMBOL DIBAWAH UNTUK MELIHAT PERAN DAN KATA RAHASIA MU <:6071unknown:1521052301723435129>.\n*(Pesan bersifat rahasia/ephemeral)*')
        .setColor('Green');
        
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('view_role').setLabel('Lihat Peranku').setStyle(ButtonStyle.Success)
    );

    await interaction.update({ embeds: [EmbedBuilder.from(game.embedMsg.embeds[0]).setColor('Gray').setDescription('Game sedang berjalan...').setFields([])], components: [] });
    await interaction.channel.send({ embeds: [embed], components: [row] });

    // Mulai Giliran Pertama
    setTimeout(() => { nextTurn(game, interaction.channel); }, 5000);
}

async function nextTurn(game, channel) {
    if (game.turnIndex >= game.players.length) {
        return startVoting(game, channel);
    }

    const currentPlayer = game.players[game.turnIndex];
    let orderText = game.players.map((id, idx) => `${idx + 1}. <@${id}>`).join('\n');

    const embed = new EmbedBuilder()
        .setTitle('Tahap Deskripsi')
        .setDescription(`**GILIRAN:**\n${orderText}\n\nSEKARANG GILIRAN: <@${currentPlayer}>\n\nSILAHKAN DESKRIPSIKAN KATA MU! JIKA SUDAH, KLIK *Next Player*.`)
        .setColor('Green');
        
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('next_turn').setLabel('Next Player').setStyle(ButtonStyle.Primary)
    );

    const msg = await channel.send({ content: `<@${currentPlayer}>`, embeds: [embed], components: [row] });

    // Timeout 90 detik per giliran (AFK Check)
    game.timeout = setTimeout(() => {
        getUser(currentPlayer).afk_strikes++;
        channel.send(`WAKTU HABIS UNTUK <@${currentPlayer}>! LANJUT OTOMATIS.`);
        game.turnIndex++;
        nextTurn(game, channel);
    }, 90 * 1000);
}

async function startVoting(game, channel) {
    const options = game.players.map(id => ({
        label: channel.guild.members.cache.get(id)?.displayName || 'Pemain',
        value: id,
        description: 'PILIH UNTUK MENGILIMINASI'
    }));

    const select = new StringSelectMenuBuilder()
        .setCustomId('vote_menu')
        .setPlaceholder('PILIH TERSANGKA UTAMA!')
        .addOptions(options);

    const row = new ActionRowBuilder().addComponents(select);
    
    const embed = new EmbedBuilder()
        .setTitle('Waktunya Voting!')
        .setDescription('PILIH SIAPA YANG MENURUT KALIAN Undercover / Mr. White.\nWaktu voting: **2 MENIT**.')
        .setColor('Orange');

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
        await channel.send("Hasil vote seri atau tidak ada yang divote! Para Civilians Gagal menebak. Undercover menang!");
        return endGame(game, channel, 'Undercover');
    }

    const elimRole = game.roles[eliminatedId];
    await channel.send(`Mayoritas vote mengarah ke <@${eliminatedId}>! Ternyata dia adalah **${elimRole}**.`);

    if (elimRole === 'Undercover') {
        await channel.send("Tebakan benar! Undercover berhasil ditangkap.");
        return endGame(game, channel, 'Civilian');
    } else if (elimRole === 'Mr. White') {
        await channel.send(`🚨 **PERHATIAN!** <@${eliminatedId}> adalah **Mr. White**!\nMr. White, kamu punya waktu **3 MENIT** untuk mengetik tebakan kata dari Civilians di chat ini!`);
        
        // Await Message from Mr White
        const filter = m => m.author.id === eliminatedId;
        try {
            const collected = await channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });
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
            await channel.send("Mr. White tidak menjawab. Para Civilians Menang!");
            return endGame(game, channel, 'Civilian');
        }
    } else {
        await channel.send("Tebakan salah! Kalian mengeliminasi Civilian yang tidak bersalah.\nUndercover memenangkan permainan!");
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
        
        // Bagikan XP dan Win/Loss
        const u = getUser(id);
        if (role === winnerTeam || (winnerTeam === 'Mr. White' && role === 'Undercover')) {
            u.wins++;
            u.xp += 50; // XP menang
        } else {
            u.losses++;
            u.xp += 10; // XP partisipasi
        }
        checkLevelAndAchievements(id);
    }

    const embed = new EmbedBuilder()
        .setTitle('GAME OVER')
        .setColor('Grey')
        .addFields(
            { name: 'Pemenang', value: `<:9574plainribbon:1521050339552530595> **${winnerTeam === 'Mr. White' ? 'Mr. White & Undercover' : winnerTeam}**` },
            { name: `Undercover (Kata: ${game.words.uc})`, value: ucNames.length ? ucNames.join(', ') : 'Tidak ada' },
            { name: `Mr. White (Tidak ada kata)`, value: mwNames.length ? mwNames.join(', ') : 'Tidak ada' },
            { name: `Civilians (Kata: ${game.words.civ})`, value: civNames.length ? civNames.join(', ') : 'Tidak ada' }
        )
        .setFooter({ text: 'GAME OVER. THANK YOU FOR PLAYING.!' })
        .setTimestamp();

    await channel.send({ embeds: [embed] });
    activeGames.delete(channel.id);
}

client.login(process.env.DISCORD_TOKEN);