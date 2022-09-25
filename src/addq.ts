import botVars from './sees'
import databaseFunctions from './database'
const {client, authorizedChannels, embeds, createEmbed, mapIndex} = botVars

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == 'addq') {
        databaseFunctions.initQuestions()
        .then((db) => {
            if (interaction.options.getString("question").replace(/ /g, "") != ""){
                db.all("SELECT * FROM questions", (error, rows) => {
                    if (error) console.log(error)
                    else {
                        db.run(`INSERT INTO questions (question) VALUES ('${interaction.options.getString("question").replace(/'/g,"''")}');`, (error) => {
                            (async() => {
                                if (error) await interaction.reply('Question exists')
                                else {
                                    await interaction.reply('Question Added')
                                }
                            })()
                        })
                    }
                })
            }    
        })
        .catch((error) => {
            console.log(error)
        })
    }
})


export default {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex}