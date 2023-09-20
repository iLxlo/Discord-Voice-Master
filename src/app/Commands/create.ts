import { ApplicationCommandType, CommandInteraction, GuildMember, Message, PermissionFlagsBits } from 'discord.js'
import Client from '../../strcut/Client'
import Interaction from '../../strcut/base/Interaction'
import EmbedBuilder from '../../strcut/utils/EmbedBuilder'

//@ts-ignore
export default new Interaction('voice-master', 
	async (client: Client, interaction: CommandInteraction) => {
        client.db.creators.create(interaction.guild!.id)
		interaction.reply({ embeds: [new EmbedBuilder().default(interaction.member as GuildMember, 'Success', 'Private channel management system successfully created')], ephemeral: true })
		return 
	},
	{
		name: 'voice-master',
		type: ApplicationCommandType.ChatInput,
		description: 'Create a private channel management system',
		defaultMemberPermissions: PermissionFlagsBits.Administrator
	}
)
