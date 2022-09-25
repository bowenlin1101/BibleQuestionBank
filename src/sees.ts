import botVars from './seea'
import databaseFunctions from './database'
const {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex} = botVars;

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == 'sees') {
        databaseFunctions.initArchives()
        .then((db) => {
            db.all("SELECT * FROM archives;", (error, rows) => {
                if (error) console.log(error)
                else {
                    var index = interaction.options.getInteger('archive_index');
                    if (index >=0 && index < rows.length) {
                        var summaries = rows.map(x => x.summary)
                        var embed = createEmbed(summaries[index], `Summary: ${rows[index].question}`)
                        interaction.reply({embeds:[embed]})
                    } else {
                        interaction.reply("Index out of bounds")
                    }
                }
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }
})

export default {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex}