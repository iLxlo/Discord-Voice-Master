import { ButtonInteraction, InteractionCollector, Client as DJSClient, UserSelectMenuInteraction } from 'discord.js';
import ActionRowBuilder from '../../strcut/utils/ActionRowBuilder';
import EmbedBuilder from '../../strcut/utils/EmbedBuilder';
import Interaction from '../../strcut/base/Interaction';
import IGuildConfig from '../../types/GuildConfig';
import Client from '../../strcut/Client';

export default new Interaction(
    'user',
    async (client: Client, button: ButtonInteraction<'cached'> , config: IGuildConfig): Promise<any> => {
        await button.deferReply({ephemeral: true, fetchReply: true })

        const fetch = await button.editReply({
            embeds: [
                new EmbedBuilder().default(
                    button.member,
                    config.buttons[button.customId]!.title,
                    `specify the **user** you want to **allow** or **deny** to connect to ${button.member.voice.channel!.toString()}`
                )
            ],
            components: new ActionRowBuilder().menuUser('user', config.placeholder.user)
        })

        const collector = new InteractionCollector(
            client as DJSClient<true>,
            { time: 30_000, message: fetch }
        )

        collector.on('collect', async (interaction: UserSelectMenuInteraction<'cached'>): Promise<any> => {
            await interaction.deferUpdate()
            collector.stop()
            return (await import('./Collectors/user')).default(client, button, interaction, config)
        })

        collector.on('end', (collected, reasone: string): any => {
            if(reasone === 'time') {
                return button.editReply({
                    embeds: [
                        new EmbedBuilder().default(
                            button.member,
                            config.buttons[button.customId]!.title,
                            `You **didn't** specify a user`
                        )
                    ],
                    components: new ActionRowBuilder().menuUser('user', config.placeholder.user, true)
                })
            }
        })
    }
)