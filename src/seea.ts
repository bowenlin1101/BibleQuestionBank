import {ActionRowBuilder, ButtonBuilder,ButtonStyle} from "discord.js"
import botVars from './seeq'
import databaseFunctions from './database'
const {client, authorizedChannels,  embeds, createEmbed, mapIndex} = botVars;

var archiveInformation;


client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'seea') {
        databaseFunctions.initArchives()
        .then((db) => {
            db.all("SELECT * FROM archives", (error, rows) => {
                if (error) console.log("seea error")
                else {
                    var archives = rows.map(questionsummary => questionsummary.question);
                    var sectionnedArchives = [];
                    var index = -1;
                    (async() => {
                        while (index + 1 <= archives.length){
                            var renderArchives = "";
                            var testRenderArchives = "";
                            var delay = -1;
                            while (testRenderArchives.length < 1500){
                                if (index+1 > archives.length) {
                                    sectionnedArchives.push(renderArchives);

                                    const row = new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`LA-${interaction.id}`)
                                        .setLabel('◀')
                                        .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                        .setCustomId(`RA-${interaction.id}`)
                                        .setLabel('▶')
                                        .setStyle(ButtonStyle.Primary),
                                    );
                                    await interaction.reply({embeds:[createEmbed(sectionnedArchives[0], "Archives", 1, sectionnedArchives.length)], components:[row]})
                                    embeds[interaction.id] = 0;

                                    archiveInformation = sectionnedArchives
                                    return
                                }
                                if (delay >= 0) {
                                    renderArchives += String(index) + ". " + archives[index] + "\n"
                                }
                                if (index + 1 < archives.length){
                                    testRenderArchives += String(index) + ". " + archives[index+1] + "\n"
                                }
                                index += 1
                                delay += 1
                            }
                            index -= 1
                            sectionnedArchives.push(renderArchives)
                        }
                    })()
                }
            })
        }) 
	}
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId.includes("LA")) {
        (async() => {
            embeds[interaction.customId.split("-")[1]] -= 1
            var index = embeds[interaction.customId.split("-")[1]] + 1
            interaction.update({embeds: [createEmbed(archiveInformation[mapIndex(index,archiveInformation)-1], "Archives", mapIndex(index,archiveInformation), archiveInformation.length)]})
        })()
        .catch((error) => {
            console.log(error)
        })
    }
    if (interaction.customId.includes("RA")) {
        (async() => {
            embeds[interaction.customId.split("-")[1]] += 1
            var index = embeds[interaction.customId.split("-")[1]] + 1
            interaction.update({embeds: [createEmbed(archiveInformation[mapIndex(index,archiveInformation)-1], "Archives", mapIndex(index,archiveInformation), archiveInformation.length)]})
        })()
        .catch((error) => {
            console.log(error)
        })
    }
})

export default {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex}