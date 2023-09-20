import { EmbedBuilder as DJSEmbedBuilder, GuildMember, VoiceChannel } from 'discord.js';
import { settings } from '../../config';
import Utils from './Utils';
import Client from '../Client';

export default class EmbedBuilder extends DJSEmbedBuilder {
    default(member: GuildMember, title: string, description: string) {
        return this.setTitle(title).setColor(settings!.color)
        .setDescription(`${member.toString()}, ${description}`)
        .setThumbnail(Utils.getAvatar(member))
    }

    settingRoomEmbed(client: Client) {
        return this.setTitle('Manage your voice channel.')
        .setColor(settings.color)
        .setDescription(
            '> Click the following buttons to customize your room' + '\n'
        ).setImage(settings?.line ? 'https://cdn.discordapp.com/attachments/966972126806573089/1104607266533031966/line.png' : null)
        .addFields([ {
            name: '** **',
            value: 
            Object.keys(settings.buttons).filter((btn, i) => i % 2 == 0)
            .map(btn => 
                //@ts-ignore
                (settings.dot || '') + (settings.buttons[btn] ? (`${client.emojisStorage.cache.get(btn)} ・ ${settings.buttons[btn].title.toLowerCase()}`) : '')
            ).join('\n'),
            inline: true
        },
        {  
            name: '** **',
            value: Object.keys(settings.buttons).filter((btn, i) => i % 2 == 1)
            .map(btn => 
                //@ts-ignore
                (settings.dot || '') + (settings.buttons[btn] ? (`${client.emojisStorage.cache.get(btn)} ・ ${settings.buttons[btn].title.toLowerCase()}`) : '')
            ).join('\n'),
            inline: true
        }
        ])
        .setFooter({text: 'You can only use them when you have a private channel'})
    }

    infoRoom(member: GuildMember, channel: VoiceChannel, get: any) {
        const guildPerms = channel.permissionOverwrites.cache.get(member.guild.id)
        //@ts-ignore
        return this.setTitle(settings.buttons['info'].title)
        .setThumbnail(Utils.getAvatar(member))
        .setColor(settings.color)
        .setDescription(
            '**Private room:**' + ` ${channel.toString()}` + '\n'
            + '**Users:**' + ` ${channel.members.size}/${channel.userLimit === 0 ? 'ꝏ' : channel.userLimit}` + '\n'
            + '**Owner:**' + ` <@!${get.userId}>` + '\n'
            + '**Created Time:**' + ` <t:${Math.round(get.created/1000)}>` + '\n'
            + '**Is the room visible to everyone:**' + ` ${guildPerms && guildPerms.deny.has('ViewChannel') ? '❌' : '✅'}` + '\n'
            + '**Is the room available to everyone:**' + ` ${guildPerms && guildPerms.deny.has('Connect') ? '❌' : '✅'}` + '\n'
        )
    }

    permissions(member: GuildMember, channel: VoiceChannel, page: number = 0) {
        const array = channel.permissionOverwrites.cache
        .filter(p => channel.guild.members.cache.has(p.id))
        .map(p => p)

        const max = Math.ceil(array.length/5) === 0 ? 1 : Math.ceil(array.length/5)

        const embed = this.setTitle('Private room user permission')
        .setThumbnail(Utils.getAvatar(member))
        .setColor(settings!.color)
        .setFooter(
            { text: `Page: ${page+1}/${max}` }
        )

        for ( let i = page*5; (i < array.length && i < 5*(page+1)) ; i++ ) {
            const p = array[i]
            const target = member.guild.members.cache.get(p.id)
            if(target) {
                embed.addFields(
                    {
                        name: `${i+1}. ${target.displayName}`,
                        value: (
                            `> Can user joins in your voice channel?: ${p.deny.has('Connect') ? '❌' : '✅'}` + '\n'
                            + `> Can user Speak in your voice channel?: ${p.deny.has('Speak') ? '❌' : '✅'}`
                        )
                    }
                )
            }
        }

        return embed.setDescription((embed.data.fields || [] )?.length === 0 ? 'Пусто' : null)
    }
}