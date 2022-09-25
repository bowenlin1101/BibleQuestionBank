import events from 'events';
import dotenv from "dotenv";
import {Client, IntentsBitField, REST, Routes, SlashCommandBuilder, EmbedBuilder} from "discord.js"
dotenv.config();
events.EventEmitter.defaultMaxListeners = 15;

const authorizedChannels = [711972899141189703, 796613531323465738, 791375870442733582];
const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.DirectMessages)
const client=new Client({
    intents: myIntents,
});

client.once("ready", () =>{
    console.log("BOT IS ONLINE"); //message when bot is online
})

const commands = [
    new SlashCommandBuilder()
    .setName('seeq')
    .setDescription("Look at pending questions"),
    new SlashCommandBuilder()
    .setName('help')
    .setDescription("Help Menu"),
    new SlashCommandBuilder()
    .setName('seea')
    .setDescription("Look at archives"),
    new SlashCommandBuilder()
    .setName('sees')
    .setDescription("Look at summary")
    .addIntegerOption(option => 
        option.setName('archive_index') 
        .setDescription('The archive index of the summary')
        .setRequired(true)   
    ),
    new SlashCommandBuilder()
    .setName('addq')
    .setDescription("Add a question")
    .addStringOption(option => 
        option.setName('question') 
        .setDescription('The question you are adding')
        .setRequired(true)   
    ),
    new SlashCommandBuilder()
    .setName('adds')
    .setDescription("Add a summary")
    .addStringOption(option => 
        option.setName('index') 
        .setDescription('The index of the archive')
        .setRequired(true)   
    )
    .addStringOption(option => 
        option.setName('summary')
        .setDescription('the summary you are adding')
        .setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName('delq')
    .setDescription("Delete a question")
    .addIntegerOption(option => 
        option.setName('question_index') 
        .setDescription('The question index you are deleting')
        .setRequired(true)   
    ),
    new SlashCommandBuilder()
    .setName('dela')
    .setDescription("Delete an archive")
    .addIntegerOption(option => 
        option.setName('archive_index') 
        .setDescription('The archive index you are deleting')
        .setRequired(true)   
    ),
    new SlashCommandBuilder()
    .setName('qotd')
    .setDescription("Summon a question")
]


function createEmbed(text, title, index:number | string="none", length: number | string="none"):EmbedBuilder {
    const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle(title)
    .setDescription(text)
    if (typeof(index) == "number" && typeof(length) == "number") {
        embed
        .setFooter({text: `Page: ${String(index)}/${String(length)}`})
    }
    return embed
}

function mapIndex(index, list) {
    var mappedIndex;
    if (index < 0) {
        mappedIndex = list.length -(Math.abs(index)%list.length-1)-1
    } else if (index > list.length && index % list.length == 0) {
        mappedIndex = list.length
    } else if (index > list.length && index%list.length != 0) {
        mappedIndex = index % list.length
    } else if (index == 0) {
        mappedIndex = list.length
    } else {
        mappedIndex = index
    }
    return mappedIndex
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async ()=> {
    await rest.put(
        Routes.applicationCommands(process.env.CLIENTID),
        { body: commands },
    );
})()

var embeds = {};

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
        await interaction.reply({embeds: [createEmbed("**Please add your questions in the DM channels with the bot** (if you wish them to be anonymous)!!!\n Use the qotd command only when there are people who are there to converse with you or else it will be wasted\n Use the commands only in the 'bible-study' or the 'big-questions' channel or in the dms channel with the bot, and have fun :)\n**Commands**:\nAdd a question: `/addq [question]` \nSee questions in database: `/seeq` \nSee questions in archive: `/seea` \nAdd a summary: `/adds [archive_index] [summary]` \nSee a summary: `/sees [archive_index]` \nPick a random question from the question database: `/qotd` \n**Administrator Commands**: \nDelete a question from database: `/delq [question_index]`\nDelete an archive: `/dela [archive_index]`", "Help menu")]})
	}
});

export default {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex}