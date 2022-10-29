import { ActivityType, Client, CommandInteraction, DiscordjsError, PresenceStatusData, SlashCommandBuilder } from "discord.js"
import Command from "../command"
import { BotSettings } from "../../bot";
import * as fs from "fs";


export default {
    requiredPermissions: ["Administrator"],

    builder: new SlashCommandBuilder()
        .setName("activity")
        .setDescription("Nastaví aktivitu bota.")
        .addIntegerOption(option => option
            .setName("type")
            .setRequired(true)
            .setDescription("Typ aktivity")
            .addChoices(
                { name: "Playing", value: 0, name_localizations: { cs: "Hraje" } },
                { name: "Competing in", value: 5, name_localizations: { cs: "Soutěží v" }  },
                // { name: "Custom", value: 4 }, //Custom status is not available for bots (yet? hopefully)
                { name: "Listening to", value: 2, name_localizations: { cs: "Poslouchá" }  },
                // { name: "Streaming", value: 1 }, //apparently doesn't work for bots either
                { name: "Watching", value: 3, name_localizations: { cs: "Sleduje" }  },
            )
        )
        .addStringOption(option => option
            .setName("activitytext")
            .setDescription("Text, který se má ukazovat v aktivitě bota")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("status")
            .setRequired(false)
            .setDescription("Status aktivity")
            .addChoices(
                { name: "Online", value: "online" },
                { name: "Idle", value: "idle" },
                { name: "Invisible", value: "invisible" },
                { name: "Do Not Disturb", value: "dnd" },
            )
        ),    

    call: async (interaction: CommandInteraction, settings: BotSettings, client: Client) => {

        if (client.user == null) {
            console.log("Client.user is null, something probably went wrong.");
            await interaction.reply({ content: "Nepodařilo se nastavit aktivitu. Prosím zkuste to později, nebo kontaktujte administrátora.", ephemeral: true })
            return;
        }

        const activityText = interaction.options.get("activitytext", true).value as string;
        const activityType = interaction.options.get("type", true)?.value as number;
        const activityStatus = interaction.options.get("status")?.value as string ?? "online";

        client.user?.setPresence({ activities: [{ name: activityText, type: activityType }], status: activityStatus as PresenceStatusData });

        await interaction.reply({ content: "Aktivita byla úspěšně nastavena!", ephemeral: true });

        //saving activity
        fs.readFile(".env", (err, data) => {
            if (err) throw err;
            let envLines = data.toString().split('\n');

            envLines = envLines.filter(x => !x.startsWith("ACTIVITY_")); //filter out all the lines about activity to delete (and esentially rewrite them)

            envLines.push(`ACTIVITY_TYPE=${activityType}`);
            envLines.push(`ACTIVITY_STATUS=${activityStatus}`);
            envLines.push(`ACTIVITY_TEXT='${activityText.replace("'", "\\'")}'`);

            fs.writeFileSync(".env", envLines.join('\n'));
        });
    }

} as Command