import {ActionRowBuilder, ButtonBuilder,ButtonStyle} from "discord.js"
import dotenv from "dotenv";
import botVars from './addq'
import databaseFunctions from './database'
const {client, authorizedChannels, embeds, createEmbed, mapIndex} = botVars

dotenv.config()

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == 'delq') {
        if (process.env.ADMINID.includes(interaction.user.id)){
            databaseFunctions.initQuestions()
            .then((db) => {
                db.all(`SELECT * FROM questions;`, (error, rows) => {
                    if (error) console.log(error)
                    else {
                        (async() => {
                            const question_id = interaction.options.getInteger('question_index');
                            if (question_id >= 0 && question_id < rows.length){
                                const question = rows[question_id].question
                                const row = new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`DQY-${interaction.user.id}-${question_id}`)
                                    .setLabel('YES')
                                    .setStyle(ButtonStyle.Success),
                                    new ButtonBuilder()
                                    .setCustomId(`DQN-${interaction.user.id}-${question_id}`)
                                    .setLabel('NO')
                                    .setStyle(ButtonStyle.Danger),
                                );
                                await interaction.reply({embeds:[createEmbed(`Are you sure you want to delete the question: **${question}**`, "delq")], components:[row]})
                            } else {
                                await interaction.reply("Index out of bounds")
                            }
                        })()  
                    }
                })
            })
        } else {
            await interaction.reply("No permission to remove questions")
        }
    }
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;
    const disabled = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`DQY}`)
        .setLabel('YES')
        .setDisabled(true)
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId(`DQN`)
        .setLabel('NO')
        .setDisabled(true)
        .setStyle(ButtonStyle.Danger),
    );
    var id = interaction.customId.split("-")[1]
    if (id == interaction.user.id) {
        if (interaction.customId.includes("DQY")) {
            var index = parseInt(interaction.customId.split("-")[2])
            databaseFunctions.initQuestions()
            .then((db) => {
                db.all(`SELECT * FROM questions;`, (error, rows) => {
                    if (error) console.log(error)
                    else {
                        db.run(`DELETE FROM questions WHERE question = '${rows[index].question.replace(/'/g,`''`)}';`, (error) => {
                            if (error) console.log(error)
                            else {
                                interaction.update({embeds: [createEmbed("Question Deleted", "delq")], components: [disabled]})
                            }
                        })
                    }
                })
            })
        }

        if (interaction.customId.includes("DQN")) {
            console.log("nope")
            interaction.update({embeds: [createEmbed("Action Cancelled", "delq")], components: [disabled]})
        }
    }
})
export default {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex}