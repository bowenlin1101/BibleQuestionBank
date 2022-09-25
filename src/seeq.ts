import {ActionRowBuilder, ButtonBuilder,ButtonStyle} from "discord.js"
import botVars from './index'
import databaseFunctions from './database'
const {client, authorizedChannels,  embeds, createEmbed, mapIndex} = botVars;

var questionInformation;

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'seeq') {
        console.log(interaction.channelId)
        databaseFunctions.initQuestions()
        .then((db) => {
            db.all("SELECT * FROM questions", (error, rows) => {
                if (error) console.log("seeq error")
                else {
                    var sectionnedQuestions = [];
                    var index = -1;
                    (async() => {
                        while (index + 1 <= rows.length){
                            var renderQuestions = "";
                            var testRenderQuestions = "";
                            var delay = -1;
                            while (testRenderQuestions.length < 1500){
                                if (index+1 > rows.length) {
                                    sectionnedQuestions.push(renderQuestions);
                                    const row = new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`LQ-${interaction.id}`)
                                        .setLabel('◀')
                                        .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                        .setCustomId(`RQ-${interaction.id}`)
                                        .setLabel('▶')
                                        .setStyle(ButtonStyle.Primary),
                                    );
                                    await interaction.reply({embeds:[createEmbed(sectionnedQuestions[0], "PendingQuestions", 1, sectionnedQuestions.length)], components:[row]})
                                    embeds[interaction.id] = 0;
                                    questionInformation = sectionnedQuestions
                                    return
                                }
                                if (delay >= 0) {
                                    renderQuestions += String(index) + ". " + rows[index].question + "\n"
                                }
                                if (index + 1 < rows.length){
                                    testRenderQuestions += String(index) + ". " + rows[index+1].question + "\n"
                                }
                                index += 1
                                delay += 1
                            }
                            index -= 1
                            sectionnedQuestions.push(renderQuestions)
                        }
                    })()
                }
            })
        }) 
	}
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId.includes("LQ")) {
        (async() => {
            embeds[interaction.customId.split("-")[1]] -= 1
            var index = embeds[interaction.customId.split("-")[1]] + 1
            interaction.update({embeds: [createEmbed(questionInformation[mapIndex(index,questionInformation)-1], "Pending Questions", mapIndex(index,questionInformation), questionInformation.length)]})
        })()
        .catch((error) => {
            console.log(error)
        })
    }
    if (interaction.customId.includes("RQ")) {
        (async() => {
            embeds[interaction.customId.split("-")[1]] += 1
            var index = embeds[interaction.customId.split("-")[1]] + 1
            interaction.update({embeds: [createEmbed(questionInformation[mapIndex(index,questionInformation)-1], "Pending Questions", mapIndex(index,questionInformation), questionInformation.length)]})
        })()
        .catch((error) => {
            console.log(error)
        })
    }
})

export default {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex}