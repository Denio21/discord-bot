import {CommandInteraction, SlashCommandBuilder, Client} from "discord.js"
import Command from "../command"
import {BotSettings} from "../../bot";

export default {
    builder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Zobrazí odezvu mezi botem a Discordem."),


    call: async (interaction: CommandInteraction, settings: BotSettings, client: Client) => {
        await interaction.reply({
            embeds: [
                {
                    title: "🏓 | Odezva",
                    description: `Tyto hodnoty jsou pouze orientační. Představují dobu, která uběhne při komunikaci mezi jednotlivými cíli.`,
                    fields: [
                        {
                            name: "📡 | Bot -> Discord",
                            value: `${Math.round(interaction.client.ws.ping)}ms`,
                            inline: true
                        },
                        {
                            name: "📡 | Bot -> Discord -> Vy",
                            value: `${Math.abs(Date.now() - interaction.createdTimestamp)}ms`,
                            inline: true
                        }
                    ],
                    color: 0xffa40e,

                }
            ],
            ephemeral: true
        });
    }

} as Command