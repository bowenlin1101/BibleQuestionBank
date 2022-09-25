import {ActionRowBuilder, ButtonBuilder,ButtonStyle} from "discord.js"
import botVars from './delq'
import databaseFunctions from './database'
import dotenv from "dotenv";
const {client, authorizedChannels, embeds, createEmbed, mapIndex} = botVars
dotenv.config()

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName == 'dela') {
            if (process.env.ADMINID.includes(interaction.user.id)) {
                databaseFunctions.initQuestions()
            .then((db) => {
                db.all(`SELECT * FROM archives;`, (error, rows) => {
                    if (error) console.log(error)
                    else {
                        (async() => {
                            const archive_id = interaction.options.getInteger('archive_index');
                            if (archive_id >= 0 && archive_id < rows.length){
                                const question = rows[archive_id].question
                                const summary = rows[archive_id].summary
                                const row = new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`DAY-${interaction.user.id}-${archive_id}`)
                                    .setLabel('YES')
                                    .setStyle(ButtonStyle.Success),
                                    new ButtonBuilder()
                                    .setCustomId(`DAN-${interaction.user.id}-${archive_id}`)
                                    .setLabel('NO')
                                    .setStyle(ButtonStyle.Danger),
                                );
                                if (summary == "None") {
                                    await interaction.reply({embeds:[createEmbed(`Are you sure you want to delete the archive: **${question}**`, "dela")], components:[row]})
                                } else {
                                    await interaction.reply({embeds:[createEmbed(`Are you sure you want to delete the archive: **${question}**\n with summary: **${summary}**`, "dela")], components:[row]})
                                }
                            } else {
                                await interaction.reply("Index out of bounds")
                            }
                        })()  
                    }
                })
            })
        }
    }
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;
    const disabled = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`DAY`)
        .setLabel('YES')
        .setDisabled(true)
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId(`DAN`)
        .setLabel('NO')
        .setDisabled(true)
        .setStyle(ButtonStyle.Danger),
    );
    var id = interaction.customId.split("-")[1]
    if (id == interaction.user.id) {
        if (interaction.customId.includes("DAY")) {
            var index = parseInt(interaction.customId.split("-")[2])
            databaseFunctions.initQuestions()
            .then((db) => {
                db.all(`SELECT * FROM archives;`, (error, rows) => {
                    if (error) console.log(error)
                    else {
                        db.run(`DELETE FROM archives WHERE question = '${rows[index].question.replace(/'/g,`''`)}';`, (error) => {
                            if (error) console.log(error)
                            else {
                                interaction.update({embeds: [createEmbed("Archive Deleted", "dela")], components: [disabled]})
                            }
                        })
                    }
                })
            })
        }
        
        if (interaction.customId.includes("DAN")) {
            (async() => {
                interaction.update({embeds: [createEmbed("Action Cancelled", "dela")], components: [disabled]})
            })()
        }
    }
})

export default {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex}