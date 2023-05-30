import {ActionRowBuilder, ButtonBuilder,ButtonStyle, channelLink} from "discord.js"
import botVars from "./dela"
import databaseFunctions from './database'
const {client, authorizedChannels, embeds, createEmbed, mapIndex}  = botVars

var isQuestionActive = false;
var activeQuestion = "";

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == 'qotd') {
        if (authorizedChannels.includes(parseInt(interaction.channelId))){
            if (!isQuestionActive){
                (async() => {
                    const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`QOTDY-${interaction.user.id}`)
                        .setLabel('YES')
                        .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                        .setCustomId(`QOTDN-${interaction.user.id}`)
                        .setLabel('NO')
                        .setStyle(ButtonStyle.Danger),
                    );
                    await interaction.reply({embeds:[createEmbed(`Are you sure you want to summon the question?\n Make sure there are people around to discuss!`, "QOTD")], components:[row]})
                })()  
            } else {
                await interaction.reply({embeds:[createEmbed(`A question is already active in one of the channels. Check it out! End the discussion session by adding a summary with **/adds** and 'last' as the index`, activeQuestion.slice(0,200))]})
            }
        } else {
            await interaction.reply({embeds:[createEmbed(`Only use this command in the channels listed in **/help**`, "QOTD")]})
        }
    }

    if (interaction.commandName == 'adds') {
        if (interaction.options.getString("index") == "last"){
            databaseFunctions.initArchives()
            .then((db) => {
                db.all(`SELECT * FROM archives;`, (error, rows) => {
                    if (error) console.log(error)
                    else {
                        var index = rows.length - 1
                        var summary = interaction.options.getString("summary")
                        var question = rows[index].question
                        if (rows[index].summary == "None") {
                            db.run(`UPDATE archives SET summary = '${summary.replace(/'/g,"''")}' WHERE question = '${question.replace(/'/g,"''")}';`, (error) => {
                                if (error) console.log(error)
                                else {
                                    (async() => {
                                        isQuestionActive = false;
                                        activeQuestion = ""
                                        await interaction.reply({embeds:[createEmbed(`Summary added: **${summary}**`, rows[index].question.slice(0,200))]})
                                    })()
                                }
                            })
                        } else {
                            (async() => {
                                const row = new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`ASY-${interaction.user.id}-${index}-${summary}`)
                                    .setLabel('YES')
                                    .setStyle(ButtonStyle.Success),
                                    new ButtonBuilder()
                                    .setCustomId(`ASN-${interaction.user.id}-${index}-${summary}`)
                                    .setLabel('NO')
                                    .setStyle(ButtonStyle.Danger),
                                );
                                await interaction.reply({embeds:[createEmbed(`Are you sure you want to remove the previous summary:\n **${rows[index].summary}** \n and replace it with:\n **${summary}**?`, "QOTD")], components:[row]})
                            })()  
                        }
                    }
                })
            })
        } else if (parseInt(interaction.options.getString("index")) == NaN) {
            (async() => {
                await interaction.reply({embeds:[createEmbed("Enter a number of key word please", "seeq ERROR")]})
                return
            })()
        } else {
            databaseFunctions.initArchives()
            .then((db) => {
                db.all(`SELECT * FROM archives;`, (error, rows) => {
                    if (error) console.log(error)
                    else {
                        var index = parseInt(interaction.options.getString("index"))
                        var summary = interaction.options.getString("summary")
                        var question = rows[index].question
                        if (rows[index].summary == "None") {
                            db.run(`UPDATE archives SET summary = '${summary.replace(/'/g,"''")}' WHERE question = '${question.replace(/'/g,"''")}';`, (error) => {
                                if (error) console.log(error)
                                else {
                                    (async() => {
                                        isQuestionActive = false;
                                        activeQuestion = ""
                                        await interaction.reply({embeds:[createEmbed(`Summary added: **${summary}**`, rows[index].question.slice(0,200))]})
                                    })()
                                }
                            })
                        } else {
                            (async() => {
                                const row = new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`ASY-${interaction.user.id}-${index}-${summary}`)
                                    .setLabel('YES')
                                    .setStyle(ButtonStyle.Success),
                                    new ButtonBuilder()
                                    .setCustomId(`ASN-${interaction.user.id}-${index}-${summary}`)
                                    .setLabel('NO')
                                    .setStyle(ButtonStyle.Danger),
                                );
                                await interaction.reply({embeds:[createEmbed(`Are you sure you want to remove the previous summary:\n **${rows[index].summary}** \n and replace it with:\n **${summary}**?`, "QOTD")], components:[row]})
                            })()  
                        }
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
        .setCustomId(`QOTDY}`)
        .setLabel('YES')
        .setDisabled(true)
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId(`QOTDN`)
        .setLabel('NO')
        .setDisabled(true)
        .setStyle(ButtonStyle.Danger),
    );

    if (interaction.customId.includes("QOTDY")) {
        var id = parseInt(interaction.customId.split("-")[1])
        console.log(interaction.message)
        databaseFunctions.initQuestions()
        .then((db) => {
            db.all(`SELECT * FROM questions;`, (error, rows) => {
                if (error) console.log(error)
                else {
                    return new Promise(() => {
                        databaseFunctions.initArchives()
                        .then((db) => {
                            const question = rows[Math.floor(Math.random()*rows.length)].question
                            isQuestionActive = true;
                            activeQuestion = question;
                            db.run(`INSERT INTO archives (question, summary) VALUES('${question.replace(/'/g, "''")}', 'None');`, (error) => {
                                if (error) console.log(error)
                                else {
                                    return new Promise(() => {
                                        databaseFunctions.initQuestions()
                                        .then((db) => {
                                            db.run(`DELETE FROM questions WHERE question = '${question.replace(/'/g, "''")}';`, (error) => {
                                                if (error) console.log(error)
                                                else {
                                                    (async() => {
                                                        var ping;
                                                        if (interaction.channelId == "791375870442733582") {
                                                            ping = await interaction.guild.roles.fetch("793636847896363018")
                                                        } else if (interaction.channelId == "711972899141189703") {
                                                            ping = await interaction.guild.roles.fetch("792784544113360926") 
                                                        } else if (interaction.channelId == "796613531323465738"){
                                                            ping = await interaction.guild.roles.fetch("775001376030851102")
                                                        }
                                                        interaction.update({embeds:[createEmbed(`${ping} Question: ${question}`, 'QOTD')] ,components: [disabled]})
                                                    })()
                                                }
                                            })
                                        })
                                    })
                                }
                            })
                        })
                    })
                }
            })
        })
        .catch((error) => {
            console.log("error")
        })
    }
    if (interaction.customId.includes("QOTDN")) {
        (async() => {
            interaction.update({embeds: [createEmbed("Action Cancelled", "QOTD")], components: [disabled]})
        })()
        .catch((error) => {
            console.log(error)
        })
    }

    if (interaction.customId.includes("ASY")) {
        var userID = interaction.customId.split('-')[1];
        if (parseInt(userID) == parseInt(interaction.user.id)){
            var index = interaction.customId.split('-')[2];
            var summaryArray = interaction.customId.split('-').splice(3,3);
            var summary = "";
            for (var i = 0;i < summaryArray.length; i++) {
                summary += summaryArray[i]
            }
            databaseFunctions.initArchives()
            .then((db) => {
                db.all(`SELECT * FROM archives;`, (error, rows) => {
                    if (error) console.log(error)
                    else {
                        db.run(`UPDATE archives SET summary = '${summary}' WHERE question = '${rows[index].question.replace(/'/g,"''")}';`, (error) => {
                            if (error) console.log(error)
                            else {
                                isQuestionActive = false;
                                activeQuestion = "";
                                interaction.update({embeds:[createEmbed(`Summary added: **${summary}**`, rows[index].question.slice(0,200))], components:[disabled]})
                            }
                        })
                    }
                })
            })
        }
    }
    if (interaction.customId.includes("ASN")) {
        var userID = interaction.customId.split('-')[1];
        if (parseInt(userID) == parseInt(interaction.user.id)){
            (async() => {
                interaction.update({embeds: [createEmbed("Action Cancelled", "ADDS")], components: [disabled]})
            })()
            .catch((error) => {
                console.log(error)
            })
        }
    }
})

export default {client:client, authorizedChannels: authorizedChannels, embeds: embeds, createEmbed: createEmbed, mapIndex: mapIndex}