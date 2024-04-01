import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, type Guild, type GuildTextBasedChannel } from "discord.js";
import type { Kazagumo } from "kazagumo";

export function getRows(status: "Resume" | "Pause", looping: boolean = false) {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .setComponents(
            (status === "Pause" ? new ButtonBuilder()
                .setCustomId("pause")
                .setLabel("Pause")
                .setStyle(ButtonStyle.Danger)
                .setEmoji('⏸️')
                : new ButtonBuilder()
                    .setCustomId("resume")
                    .setLabel("Resume")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('▶️')
            ),
            new ButtonBuilder()
                .setCustomId("skip")
                .setLabel("Skip")
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⏭️'),
            new ButtonBuilder()
                .setCustomId("queue")
                .setLabel("Queue")
                .setStyle(ButtonStyle.Success)
                .setEmoji('📜'),
            new ButtonBuilder()
                .setCustomId("stop")
                .setLabel("Stop")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏹️'),
        )
    const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("loop")
                .setLabel(looping ? "Looping" : "Loop")
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔁'),
            new ButtonBuilder()
                .setCustomId("shuffle")
                .setLabel("Shuffle")
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔀'),
            new ButtonBuilder()
                .setCustomId('volume')
                .setLabel('Volume')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔊')
        )
    return [row, row2]
}

export async function sendPanel(kazagumo: Kazagumo, guild: Guild) {
    const player = kazagumo.getPlayer(guild.id);
    if (!player) return;

    const member = player.queue.current?.requester as GuildMember;
    const playingEmbed = new EmbedBuilder()
        .setTitle("Now Playing")
        .setDescription(`[${player.queue.current!.title}](${player.queue.current!.uri})`)
        .setColor("Green")
        .setThumbnail(player.queue.current!.thumbnail!)
        .setTimestamp()
        .setFooter({ text: `Requested by ${member.user.tag}`, iconURL: member.user.displayAvatarURL() });
    const voiceChannel = guild.channels.cache.get(player.voiceId!)! as GuildTextBasedChannel;
    if (voiceChannel) {
        const message = await voiceChannel.send({ embeds: [playingEmbed], components: getRows("Pause") });
        player.data.set("messageId", message.id)
    }

}