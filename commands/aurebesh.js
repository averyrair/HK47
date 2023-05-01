const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('aurebesh')
        .setDescription('translates a message into aurebesh automatically')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to be translated.')
                .setRequired(true)),
	async execute(interaction) {
            
        const codes = new Map([
            ['a', '<:aur_a:879179866703028334>'],
            ['b', '<:aur_b:879179866690441226>'],
            ['c', '<:aur_c:879179866375852064>'],
            ['d', '<:aur_d:879179866669482054>'],
            ['e', '<:aur_e:879179866686230568>'],
            ['f', '<:aur_f:879179866744979466>'],
            ['g', '<:aur_g:879179866455556117>'],
            ['h', '<:aur_h:879179866816249886>'],
            ['i', '<:aur_i:879179866845642822>'],
            ['j', '<:aur_j:879179866765942784>'],
            ['k', '<:aur_k:879179866786922566>'],
            ['l', '<:aur_l:879179866581397505>'],
            ['m', '<:aur_m:879179866774310922>'],
            ['n', '<:aur_n:879179866736582666>'],
            ['o', '<:aur_o:879179866866589716>'],
            ['p', '<:aur_p:879179866900148284>'],
            ['q', '<:aur_q:879179866761732136>'],
            ['r', '<:aur_r:879179866778529792>'],
            ['s', '<:aur_s:879179866778505216>'],
            ['t', '<:aur_t:879179866774310942>'],
            ['u', '<:aur_u:879179866854023218>'],
            ['v', '<:aur_v:879179866791100467>'],
            ['w', '<:aur_w:879179866614935614>'],
            ['x', '<:aur_x:879179866795298827>'],
            ['y', '<:aur_y:879179866426183732>'],
            ['z', '<:aur_z:879179866644312075>'],
            ['0', '<:aur_0:891174077631451156>'],
            ['1', '<:aur_1:891174077350412288>'],
            ['2', '<:aur_2:891174077782442015>'],
            ['3', '<:aur_3:891174077623042069>'],
            ['4', '<:aur_4:891174077597880320>'],
            ['5', '<:aur_5:891174077463683092>'],
            ['6', '<:aur_6:891174077300101171>'],
            ['7', '<:aur_7:891174077585293382>'],
            ['8', '<:aur_8:891174077581123664>'],
            ['9', '<:aur9:891174077576917052>'],
            ['\'', '<:aur:891177387117662209>'],
            ['(', '<:aur:891177387176374333>'],
            [')', '<:aur:891177387184758815>'],
            ['/', '<:aur:891177387365138463>'],
            ['!', '<:aur:891177387486744606>'],
            [',', '<:aur:891177387503530055>'],
            ['"', '<:aur:891177387503538176>'],
            ['“', '<:aur:891177387503538176>'],
            ['”', '<:aur:891177387503538176>'],
            ['.', '<:aur:891177387528691722>'],
            ['-', '<:aur:891177387541299262>'],
            ['—', '<:aur:891177387541299262>'],
            ['?', '<:aur_:891177387579035689>'],
            ['+', '<:aur_:891177387583230042>'],
            [':', '<:aur_:891192356026597416>'],
            [' ', '        '],
        ]);

        await interaction.deferReply();
        interaction.deleteReply();

        let translatedText = `**${interaction.member.displayName}**: `;
        const message = interaction.options.getString('message').toLowerCase();
        for (let c of message) {
            translatedText += (codes.has(c)) ? codes.get(c) : c;
        }
        translatedText += '⠀';

        let prevStop = 0
        while (prevStop + 2000 < translatedText.length) {
            for (let i = 1999+prevStop; i >= 0; i--) {
                if (translatedText.charAt(i) == ' ') {
                    await interaction.channel.send(translatedText.substring(prevStop,i+1));
                    prevStop = i+1;
                    break;
                }
                if (i == 0) {
                    await interaction.channel.send(translatedText);
                    break;
                }
            }
        }
        await interaction.channel.send(translatedText.substring(prevStop));
	},
};