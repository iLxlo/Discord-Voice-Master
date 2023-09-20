import { ButtonInteraction, UserSelectMenuInteraction } from 'discord.js';
import EmbedBuilder from '../../../strcut/utils/EmbedBuilder';
import IGuildConfig from '../../../types/GuildConfig';
import Client from '../../../strcut/Client';

export default async (client: Client, button: ButtonInteraction<'cached'>, menu: UserSelectMenuInteraction<'cached'>, config: IGuildConfig) => {
    if(menu.users.size === 0) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                `You **didn't** select a user`
            ) ],
            components: []
        })
    }

    const member = menu.members.first()

    if(!member) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                `Member not found on that server`
            ) ],
            components: []
        })
    }

    if(member.id === menu.member.id) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                `You **cannot** Give access to yourself`
            ) ],
            components: []
        })
    }

    const voice = menu.member.voice.channel!
    const closed = voice.permissionOverwrites.cache.get(member.id)
    let state: boolean

    if(closed && closed.deny.has('Connect')) {
        client.util.disconnectMember(member, voice.id)
        await voice.permissionOverwrites.edit(member.id, {Connect: true})
        state = true
    } else {
        client.util.disconnectMember(member, voice.id)
        await voice.permissionOverwrites.edit(member.id, {Connect: false})
        state = false
    }

    return button.editReply({
        embeds: [ new EmbedBuilder().default(
            menu.member,
            config.buttons[menu.customId]!.title,
            `Succesfully **${state?'unbanned':'banned'}** user ${member.toString()} connection to ${voice.toString()}`
        ) ],
        components: []
    })
}