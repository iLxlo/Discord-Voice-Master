import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import Interaction from '../../strcut/base/Interaction';
import IGuildConfig from '../../types/GuildConfig';
import Client from '../../strcut/Client';

export default new Interaction(
    'limit',
    async (client: Client, button: ButtonInteraction<'cached'>, config: IGuildConfig) => {
        return button.showModal(
            new ModalBuilder()
            .setTitle(config.buttons[button.customId]!.title)
            .setCustomId('limit')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setStyle(TextInputStyle.Short)
                    .setCustomId('count')
                    .setLabel('New number of joins')
                    .setPlaceholder('Specify the new number of joins')
                    .setValue(String(button.member.voice.channel!.userLimit))
                    .setMaxLength(2)
                    .setMinLength(1)
                    .setRequired(true)
                )
            )
        )
    }
)