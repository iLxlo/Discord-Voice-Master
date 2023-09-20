import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import Interaction from '../../strcut/base/Interaction';
import IGuildConfig from '../../types/GuildConfig';
import Client from '../../strcut/Client';

const maxNameLength = 100

export default new Interaction(
    'rename',
    async (client: Client, button: ButtonInteraction<'cached'>, config: IGuildConfig) => {
        return button.showModal(
            new ModalBuilder()
            .setTitle(config.buttons[button.customId]!.title)
            .setCustomId('rename')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setStyle(TextInputStyle.Short)
                    .setCustomId('name')
                    .setLabel('New Name')
                    .setPlaceholder('Enter a new private room name')
                    .setValue(button.member.voice.channel!.name.substring(0, maxNameLength))
                    .setMaxLength(maxNameLength)
                    .setMinLength(1)
                    .setRequired(true)
                )
            )
        )
    }
)