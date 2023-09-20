import { VoiceChannel } from 'discord.js';
import EmbedBuilder from '../../strcut/utils/EmbedBuilder';
import Interaction from '../../strcut/base/Interaction';
import Client from '../../strcut/Client';
import { Setting } from '../../types/base/DB';

export default new Interaction(
    'limit',
    async (client: Client, modal, config, res: Setting): Promise<any> => {
        await modal.deferReply({ephemeral: true})

        const count = Number(modal.fields.getTextInputValue('count'))

        if(0 > count || isNaN(count)) {
            return modal.editReply({
                embeds: [ new EmbedBuilder().default(
                    modal.member,
                    config.buttons[modal.customId]!.title,
                    `**number** of slots must be a **positive** number`
                ) ]
            })
        }

        if(res) {
            res.userLimit = count;
            await client.db.settings.dbSet(res);
        }

        await (modal.member.voice.channel as VoiceChannel).setUserLimit(count)

        return modal.editReply({
            embeds: [ new EmbedBuilder().default(
                modal.member,
                config.buttons[modal.customId]!.title,
                `You have **set** a new number of **join limits** for your **private room** ${modal.member.voice.channel!.toString()}`
            ) ]
        })
    }
)