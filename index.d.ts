import { EventEmitter } from "events";
import { Duplex, Readable as ReadableStream, Stream } from "stream";
import { Agent as HTTPSAgent } from "https";
import { IncomingMessage, ClientRequest, IncomingHttpHeaders } from "http";
import OpusScript = require("opusscript"); // Thanks TypeScript
import { URL } from "url";
import { Socket as DgramSocket } from "dgram";
import * as WebSocket from "ws";

declare function Eris(token: string, options?: Eris.ClientOptions): Eris.Client;

declare namespace Eris {
  export const Constants: Constants;
  export const VERSION: string;

  export const PrivateChannel: typeof DMChannel;

  // TYPES

  // Application Commands
  type ApplicationCommandOptions = ApplicationCommandOptionsSubCommand | ApplicationCommandOptionsSubCommandGroup | ApplicationCommandOptionsWithValue;
  type ApplicationCommandOptionsBoolean = ApplicationCommandOption<Constants["ApplicationCommandOptionTypes"]["BOOLEAN"]>;
  type ApplicationCommandOptionsChannel = ApplicationCommandOption<Constants["ApplicationCommandOptionTypes"]["CHANNEL"]>;
  type ApplicationCommandOptionsInteger = ApplicationCommandOptionsIntegerWithAutocomplete | ApplicationCommandOptionsIntegerWithoutAutocomplete | ApplicationCommandOptionsIntegerWithMinMax;
  type ApplicationCommandOptionsIntegerWithAutocomplete = Omit<ApplicationCommandOptionWithChoices<Constants["ApplicationCommandOptionTypes"]["INTEGER"]>, "choices" | "min_value" | "max_value"> & AutocompleteEnabled;
  type ApplicationCommandOptionsIntegerWithoutAutocomplete = Omit<ApplicationCommandOptionWithChoices<Constants["ApplicationCommandOptionTypes"]["INTEGER"]>, "autocomplete" | "min_value" | "max_value"> & AutocompleteDisabledInteger;
  type ApplicationCommandOptionsIntegerWithMinMax = Omit<ApplicationCommandOptionWithChoices<Constants["ApplicationCommandOptionTypes"]["INTEGER"]>, "choices" | "autocomplete"> & AutocompleteDisabledIntegerMinMax;
  type ApplicationCommandOptionsMentionable = ApplicationCommandOption<Constants["ApplicationCommandOptionTypes"]["MENTIONABLE"]>;
  type ApplicationCommandOptionsNumber = ApplicationCommandOptionsNumberWithAutocomplete | ApplicationCommandOptionsNumberWithoutAutocomplete | ApplicationCommandOptionsNumberWithMinMax;
  type ApplicationCommandOptionsNumberWithAutocomplete = Omit<ApplicationCommandOptionWithChoices<Constants["ApplicationCommandOptionTypes"]["NUMBER"]>, "choices" | "min_value" | "max_value"> & AutocompleteEnabled;
  type ApplicationCommandOptionsNumberWithoutAutocomplete = Omit<ApplicationCommandOptionWithChoices<Constants["ApplicationCommandOptionTypes"]["NUMBER"]>, "autocomplete" | "min_value" | "max_value"> & AutocompleteDisabledInteger;
  type ApplicationCommandOptionsNumberWithMinMax = Omit<ApplicationCommandOptionWithChoices<Constants["ApplicationCommandOptionTypes"]["NUMBER"]>, "choices" | "autocomplete"> & AutocompleteDisabledIntegerMinMax;
  type ApplicationCommandOptionsRole = ApplicationCommandOption<Constants["ApplicationCommandOptionTypes"]["ROLE"]>;
  type ApplicationCommandOptionsString = ApplicationCommandOptionsStringWithAutocomplete | ApplicationCommandOptionsStringWithoutAutocomplete;
  type ApplicationCommandOptionsStringWithAutocomplete = Omit<ApplicationCommandOptionWithChoices<Constants["ApplicationCommandOptionTypes"]["STRING"]>, "choices"> & AutocompleteEnabled;
  type ApplicationCommandOptionsStringWithoutAutocomplete = Omit<ApplicationCommandOptionWithChoices<Constants["ApplicationCommandOptionTypes"]["STRING"]>, "autocomplete"> & AutocompleteDisabled;
  type ApplicationCommandOptionsUser = ApplicationCommandOption<Constants["ApplicationCommandOptionTypes"]["USER"]>;
  type ApplicationCommandOptionsWithValue = ApplicationCommandOptionsString | ApplicationCommandOptionsInteger | ApplicationCommandOptionsBoolean | ApplicationCommandOptionsUser | ApplicationCommandOptionsChannel | ApplicationCommandOptionsRole | ApplicationCommandOptionsMentionable | ApplicationCommandOptionsNumber;
  type ApplicationCommandPermissionTypes = Constants["ApplicationCommandPermissionTypes"][keyof Constants["ApplicationCommandPermissionTypes"]];
  type ApplicationCommandTypes = Constants["ApplicationCommandTypes"][keyof Constants["ApplicationCommandTypes"]];
  type ModalSubmitInteractionDataComponent = ModalSubmitInteractionDataTextInputComponent;

  // Auto Moderation
  type AutoModerationActionType = Constants["AutoModerationActionTypes"][keyof Constants["AutoModerationActionTypes"]];
  type AutoModerationEventType = Constants["AutoModerationEventTypes"][keyof Constants["AutoModerationEventTypes"]];
  type AutoModerationKeywordPresetType = Constants["AutoModerationKeywordPresetTypes"][keyof Constants["AutoModerationKeywordPresetTypes"]];
  type AutoModerationTriggerType = Constants["AutoModerationTriggerTypes"][keyof Constants["AutoModerationTriggerTypes"]];
  type EditAutoModerationRuleOptions = Partial<CreateAutoModerationRuleOptions>;

  // Cache
  interface Uncached { id: string }

  // Channel
  type AnyChannel = AnyGuildChannel | AnyThreadChannel | DMChannel | GroupChannel;
  type AnyGuildChannel = AnyGuildTextableChannel | AnyThreadChannel | CategoryChannel | ForumChannel | MediaChannel;
  type AnyGuildTextableChannel = TextChannel | VoiceChannel | NewsChannel | StageChannel;
  type AnyThreadChannel = NewsThreadChannel | PrivateThreadChannel | PublicThreadChannel | ThreadChannel;
  type AnyVoiceChannel = VoiceChannel | StageChannel;
  type ChannelTypeConversion<T extends GuildChannelTypes> =
    T extends Constants["ChannelTypes"]["GUILD_TEXT"] ? TextChannel :
      T extends Constants["ChannelTypes"]["GUILD_VOICE"] ? VoiceChannel :
        T extends Constants["ChannelTypes"]["GUILD_CATEGORY"] ? CategoryChannel :
          T extends Constants["ChannelTypes"]["GUILD_NEWS"] ? NewsChannel :
            T extends Constants["ChannelTypes"]["GUILD_STAGE_VOICE"] ? StageChannel :
              T extends Constants["ChannelTypes"]["GUILD_FORUM"] ? ForumChannel :
                T extends Constants["ChannelTypes"]["GUILD_MEDIA"] ? MediaChannel :
                  never;
  type EditGuildChannelOptions = EditForumChannelOptions | EditMediaChannelOptions | EditGuildTextableChannelOptions;
  type EditGuildTextableChannelOptions = EditNewsChannelOptions | EditTextChannelOptions | EditThreadChannelOptions | EditVoiceChannelOptions;
  type GuildTextableWithThreads = AnyGuildTextableChannel | GuildTextableChannel | AnyThreadChannel;
  type InviteChannel = InvitePartialChannel | Exclude<AnyGuildChannel, CategoryChannel | AnyThreadChannel>;
  type PossiblyUncachedSpeakableChannel = AnyVoiceChannel| Uncached;
  type PossiblyUncachedTextableChannel = TextableChannel | Uncached;
  type TextableChannel = GuildTextableWithThreads | DMChannel;
  type VideoQualityMode = Constants["VideoQualityModes"][keyof Constants["VideoQualityModes"]];

  // Channel Types
  type ChannelTypes = GuildChannelTypes | PrivateChannelTypes;
  type GuildChannelTypes = Exclude<Constants["ChannelTypes"][keyof Constants["ChannelTypes"]], PrivateChannelTypes>;
  type GuildTextChannelTypes = Constants["ChannelTypes"][keyof Pick<Constants["ChannelTypes"], "GUILD_TEXT" | "GUILD_NEWS">];
  type GuildVoiceChannelTypes = Constants["ChannelTypes"][keyof Pick<Constants["ChannelTypes"], "GUILD_VOICE" | "GUILD_STAGE_VOICE">];
  type GuildThreadChannelTypes = Constants["ChannelTypes"][keyof Pick<Constants["ChannelTypes"], "GUILD_NEWS_THREAD" | "GUILD_PRIVATE_THREAD" | "GUILD_PUBLIC_THREAD">];
  type GuildPublicThreadChannelTypes = Exclude<GuildThreadChannelTypes, Constants["ChannelTypes"]["GUILD_PRIVATE_THREAD"]>;
  type PrivateChannelTypes = Constants["ChannelTypes"][keyof Pick<Constants["ChannelTypes"], "DM" | "GROUP_DM">];
  type TextChannelTypes = GuildTextChannelTypes | PrivateChannelTypes;
  type TextVoiceChannelTypes = Constants["ChannelTypes"][keyof Pick<Constants["ChannelTypes"], "GUILD_VOICE">];

  // Client
  type ApplicationRoleConnectionMetadataTypes = Constants["RoleConnectionMetadataTypes"][keyof Constants["RoleConnectionMetadataTypes"]];
  type MembershipStates = Constants["MembershipState"][keyof Constants["MembershipState"]];
  type OAuthTeamMemberRoleTypes = Constants["OAuthTeamMemberRoleTypes"][keyof Constants["OAuthTeamMemberRoleTypes"]];

  // Command
  type CommandGenerator = CommandGeneratorFunction | MessageContent | MessageContent[] | CommandGeneratorFunction[];
  type CommandGeneratorFunction = (msg: Message, args: string[]) => GeneratorFunctionReturn;
  type GeneratorFunctionReturn = Promise<MessageContent> | Promise<void> | MessageContent | void;
  type GenericCheckFunction<T> = (msg: Message) => T | Promise<T>;
  type ReactionButtonsFilterFunction = (msg: Message, emoji: Emoji, userID: string) => boolean;
  type ReactionButtonsGenerator = ReactionButtonsGeneratorFunction | MessageContent | MessageContent[] | ReactionButtonsGeneratorFunction[];
  type ReactionButtonsGeneratorFunction = (msg: Message, args: string[], userID: string) => GeneratorFunctionReturn;

  // Gateway/REST
  type IntentStrings = keyof Constants["Intents"];
  type ReconnectDelayFunction = (lastDelay: number, attempts: number) => number;
  type RequestMethod = "GET" | "PATCH" | "DELETE" | "POST" | "PUT";

  // Guild
  type DefaultNotifications = Constants["DefaultMessageNotificationLevels"][keyof Constants["DefaultMessageNotificationLevels"]];
  type ExplicitContentFilter = Constants["ExplicitContentFilterLevels"][keyof Constants["ExplicitContentFilterLevels"]];
  type GuildFeatures = Constants["GuildFeatures"][number];
  type GuildIntegrationExpireBehavior = Constants["GuildIntegrationExpireBehavior"][keyof Constants["GuildIntegrationExpireBehavior"]];
  type GuildIntegrationTypes = Constants["GuildIntegrationTypes"][number];
  type GuildScheduledEventEditOptions<T extends GuildScheduledEventEntityTypes> = GuildScheduledEventEditOptionsExternal | GuildScheduledEventEditOptionsDiscord | GuildScheduledEventEditOptionsBase<T>;
  type GuildScheduledEventEntityTypes = Constants["GuildScheduledEventEntityTypes"][keyof Constants["GuildScheduledEventEntityTypes"]];
  type GuildScheduledEventOptions<T extends GuildScheduledEventEntityTypes> = GuildScheduledEventOptionsExternal | GuildScheduledEventOptionsDiscord | GuildScheduledEventOptionsBase<T>;
  type GuildScheduledEventPrivacyLevel = Constants["GuildScheduledEventPrivacyLevel"][keyof Constants["GuildScheduledEventPrivacyLevel"]];
  type GuildScheduledEventStatus = Constants["GuildScheduledEventStatus"][keyof Constants["GuildScheduledEventStatus"]];
  type GuildWidgetStyles = Constants["GuildWidgetStyles"][keyof Constants["GuildWidgetStyles"]];
  type MFALevel = Constants["MFALevels"][keyof Constants["MFALevels"]];
  type NSFWLevel = Constants["GuildNSFWLevels"][keyof Constants["GuildNSFWLevels"]];
  type OnboardingModes = Constants["GuildOnboardingModes"][keyof Constants["GuildOnboardingModes"]];
  type OnboardingPromptTypes = Constants["GuildOnboardingPromptTypes"][keyof Constants["GuildOnboardingPromptTypes"]];
  type PermissionValueTypes = bigint | number | string;
  type PossiblyUncachedGuild = Guild | Uncached;
  type PossiblyUncachedGuildScheduledEvent = GuildScheduledEvent | Uncached;
  type PremiumTier = Constants["PremiumTiers"][keyof Constants["PremiumTiers"]];
  type SystemChannelFlags = Constants["SystemChannelFlags"][keyof Constants["SystemChannelFlags"]];
  type VerificationLevel = Constants["VerificationLevels"][keyof Constants["VerificationLevels"]];

  // Interaction
  type AnyInteraction = PingInteraction | CommandInteraction | ComponentInteraction | AutocompleteInteraction | ModalSubmitInteraction;
  type InteractionCallbackData = InteractionAutocomplete | InteractionContent | InteractionModal;
  type InteractionContent = Pick<WebhookPayload, "content" | "embeds" | "allowedMentions" | "tts" | "flags" | "components" | "poll">;
  type InteractionContentEdit = Pick<WebhookPayload, "content" | "embeds" | "allowedMentions" | "components">;
  type InteractionDataOptions = InteractionDataOptionsSubCommand | InteractionDataOptionsSubCommandGroup | InteractionDataOptionsWithValue;
  type InteractionDataOptionsBoolean = InteractionDataOptionWithValue<Constants["ApplicationCommandOptionTypes"]["BOOLEAN"], boolean>;
  type InteractionDataOptionsChannel = InteractionDataOptionWithValue<Constants["ApplicationCommandOptionTypes"]["CHANNEL"], string>;
  type InteractionDataOptionsInteger = InteractionDataOptionWithValue<Constants["ApplicationCommandOptionTypes"]["INTEGER"], number>;
  type InteractionDataOptionsMentionable = InteractionDataOptionWithValue<Constants["ApplicationCommandOptionTypes"]["MENTIONABLE"], string>;
  type InteractionDataOptionsNumber = InteractionDataOptionWithValue<Constants["ApplicationCommandOptionTypes"]["NUMBER"], number>;
  type InteractionDataOptionsRole = InteractionDataOptionWithValue<Constants["ApplicationCommandOptionTypes"]["ROLE"], string>;
  type InteractionDataOptionsString = InteractionDataOptionWithValue<Constants["ApplicationCommandOptionTypes"]["STRING"], string>;
  type InteractionDataOptionsUser = InteractionDataOptionWithValue<Constants["ApplicationCommandOptionTypes"]["USER"], string>;
  type InteractionDataOptionsWithValue = InteractionDataOptionsString | InteractionDataOptionsInteger | InteractionDataOptionsBoolean | InteractionDataOptionsUser | InteractionDataOptionsChannel | InteractionDataOptionsRole | InteractionDataOptionsMentionable | InteractionDataOptionsNumber;
  type InteractionResponseTypes = Constants["InteractionResponseTypes"][keyof Constants["InteractionResponseTypes"]];
  type InteractionTypes = Constants["InteractionTypes"][keyof Constants["InteractionTypes"]];
  type LocaleStrings = Constants["Locales"][keyof Constants["Locales"]];

  // Invite
  type InviteTargetTypes = Constants["InviteTargetTypes"][keyof Constants["InviteTargetTypes"]];

  // Message
  type ActionRowComponents = Button | SelectMenu;
  type Button = InteractionButton | URLButton;
  type ButtonStyles = Constants["ButtonStyles"][keyof Constants["ButtonStyles"]];
  type Component = ActionRow | ActionRowComponents;
  type ImageFormat = Constants["ImageFormats"][number];
  type MessageActivityTypes = Constants["MessageActivityTypes"][keyof Constants["MessageActivityTypes"]];
  type MessageContent = string | AdvancedMessageContent;
  type MessageContentEdit = string | AdvancedMessageContentEdit;
  type PollLayoutTypes = Constants["PollLayoutTypes"][keyof Constants["PollLayoutTypes"]];
  type PossiblyUncachedMessage = Message | { channel: TextableChannel | { id: string; guild?: Uncached }; guildID?: string; id: string };
  type ReactionTypes = Constants["ReactionTypes"][keyof Constants["ReactionTypes"]];

  // Permission
  type PermissionType = Constants["PermissionOverwriteTypes"][keyof Constants["PermissionOverwriteTypes"]];

  // Presence
  type ActivityFlags = Constants["ActivityFlags"][keyof Constants["ActivityFlags"]];
  type ActivityType = Constants["ActivityTypes"][keyof Constants["ActivityTypes"]];
  type SelfStatus = Status | "invisible";
  type Status = "online" | "idle" | "dnd";
  type UserStatus = Status | "offline";

  // Sticker
  type StickerFormats = Constants["StickerFormats"][keyof Constants["StickerFormats"]];
  type StickerTypes = Constants["StickerTypes"][keyof Constants["StickerTypes"]];

  // Thread/Forum
  type AutoArchiveDuration = 60 | 1440 | 4320 | 10080;
  type ChannelFlags = Constants["ChannelFlags"][keyof Constants["ChannelFlags"]];
  type ForumLayoutTypes = Constants["ForumLayoutTypes"][keyof Constants["ForumLayoutTypes"]];
  type SortOrderTypes = Constants["SortOrderTypes"][keyof Constants["SortOrderTypes"]];

  // User
  type PremiumTypes = Constants["PremiumTypes"][keyof Constants["PremiumTypes"]];

  // Voice
  type ConverterCommand = "./ffmpeg" | "./avconv" | "ffmpeg" | "avconv";
  type StageInstancePrivacyLevel = Constants["StageInstancePrivacyLevel"][keyof Constants["StageInstancePrivacyLevel"]];

  // Webhook
  type WebhookPayloadEdit = Pick<WebhookPayload, "attachments" | "content" | "embed" | "embeds" | "file" | "allowedMentions" | "components">;
  type WebhookTypes = Constants["WebhookTypes"][keyof Constants["WebhookTypes"]];

  // INTERFACES
  // Internals
  interface JSONCache {
    [s: string]: unknown;
  }
  interface NestedJSON {
    toJSON(arg?: unknown, cache?: (string | unknown)[]): JSONCache;
  }
  interface SimpleJSON {
    toJSON(props?: string[]): JSONCache;
  }

  // Application Commands
  /** Generic T is `true` if editing Guild scoped commands, and `false` if not */
  interface ApplicationCommandEditOptions<T extends boolean, U = ApplicationCommandTypes> {
    defaultMemberPermissions?: bigint | number | string | Permission | null;
    /** @deprecated */
    defaultPermission?: boolean;
    description?: U extends Constants["ApplicationCommandTypes"]["CHAT_INPUT"] ? string : "" | void;
    descriptionLocalizations?: U extends Constants["ApplicationCommandTypes"]["CHAT_INPUT"] ? Record<LocaleStrings, string> | null : null;
    dmPermission?: T extends true ? never : boolean | null;
    name?: string;
    nameLocalizations?: Record<LocaleStrings, string> | null;
    nsfw?: boolean;
    options?: ApplicationCommandOptions[];
  }
  /** Generic T is `true` if creating Guild scoped commands, and `false` if not */
  interface ApplicationCommandCreateOptions<T extends boolean, U = ApplicationCommandTypes> extends ApplicationCommandEditOptions<T, U> {
    description: U extends Constants["ApplicationCommandTypes"]["CHAT_INPUT"] ? string : "" | void;
    name: string;
    type?: U;
  }
  /** Generic T is `true` if editing Guild scoped commands, and `false` if not */
  interface ApplicationCommandBulkEditOptions<T extends boolean, U = ApplicationCommandTypes> extends ApplicationCommandCreateOptions<T, U> {
    id?: string;
  }
  interface ApplicationCommandOption<T extends Constants["ApplicationCommandOptionTypes"][Exclude<keyof Constants["ApplicationCommandOptionTypes"], "SUB_COMMAND" | "SUB_COMMAND_GROUP">]> {
    channel_types: T extends Constants["ApplicationCommandOptionTypes"]["CHANNEL"] ? ChannelTypes | undefined : never;
    description: string;
    descriptionLocalizations?:  Record<LocaleStrings, string> | null;
    name: string;
    nameLocalizations?: Record<LocaleStrings, string> | null;
    required?: boolean;
    type: T;
  }
  interface ApplicationCommandOptionChoice<T extends Constants["ApplicationCommandOptionTypes"][keyof Pick<Constants["ApplicationCommandOptionTypes"], "STRING" | "INTEGER" | "NUMBER">] | unknown = unknown> {
    name: string;
    value: T extends Constants["ApplicationCommandOptionTypes"]["STRING"]
      ? string
      : T extends Constants["ApplicationCommandOptionTypes"]["NUMBER"]
        ? number
        : T extends Constants["ApplicationCommandOptionTypes"]["INTEGER"]
          ? number
          : number | string;
  }
  interface ApplicationCommandOptionsSubCommand {
    description: string;
    descriptionLocalizations?:  Record<LocaleStrings, string> | null;
    name: string;
    nameLocalizations?: Record<LocaleStrings, string> | null;
    options?: ApplicationCommandOptionsWithValue[];
    type: Constants["ApplicationCommandOptionTypes"]["SUB_COMMAND"];
  }
  interface ApplicationCommandOptionsSubCommandGroup {
    description: string;
    descriptionLocalizations?:  Record<LocaleStrings, string> | null;
    name: string;
    nameLocalizations?: Record<LocaleStrings, string> | null;
    options?: (ApplicationCommandOptionsSubCommand | ApplicationCommandOptionsWithValue)[];
    type: Constants["ApplicationCommandOptionTypes"]["SUB_COMMAND_GROUP"];
  }
  interface ApplicationCommandOptionWithChoices<T extends Constants["ApplicationCommandOptionTypes"][keyof Pick<Constants["ApplicationCommandOptionTypes"], "STRING" | "INTEGER" | "NUMBER">] = Constants["ApplicationCommandOptionTypes"][keyof Pick<Constants["ApplicationCommandOptionTypes"], "STRING" | "INTEGER" | "NUMBER">]> {
    autocomplete?: boolean;
    choices?: ApplicationCommandOptionChoice<T>[];
    description: string;
    descriptionLocalizations?:  Record<LocaleStrings, string> | null;
    name: string;
    nameLocalizations?: Record<LocaleStrings, string> | null;
    required?: boolean;
    type: T;
  }
  interface ApplicationCommandOptionWithMinMax<T extends Constants["ApplicationCommandOptionTypes"][keyof Pick<Constants["ApplicationCommandOptionTypes"], "INTEGER" | "NUMBER">] = Constants["ApplicationCommandOptionTypes"][keyof Pick<Constants["ApplicationCommandOptionTypes"], "INTEGER" | "NUMBER">]> {
    autocomplete?: boolean;
    choices?: ApplicationCommandOptionChoice<T>[];
    description: string;
    descriptionLocalizations?:  Record<LocaleStrings, string> | null;
    max_value?: number;
    min_value?: number;
    name: string;
    nameLocalizations?: Record<LocaleStrings, string> | null;
    required?: boolean;
    type: T;
  }
  interface ApplicationCommandPermissions {
    id: string;
    permission: boolean;
    type: ApplicationCommandPermissionTypes;
  }
  interface AutocompleteEnabled {
    autocomplete: true;
  }
  interface AutocompleteDisabled {
    autocomplete?: false;
  }
  interface AutocompleteDisabledInteger extends AutocompleteDisabled {
    min_value?: null;
    max_value?: null;
  }
  interface AutocompleteDisabledIntegerMinMax extends AutocompleteDisabled {
    choices?: null;
  }
  interface GuildApplicationCommandPermissions {
    application_id: string;
    guild_id: string;
    id: string;
    permissions: ApplicationCommandPermissions[];
  }

  // Auto Moderation
  interface AutoModerationAction {
    metadata?: AutoModerationActionMetadata;
    type: AutoModerationActionType;
  }
  interface AutoModerationActionExecution {
    action: AutoModerationAction;
    alertSystemMessageID?: string;
    channelID?: string;
    content?: string;
    guildID: string;
    matchedContent?: string | null;
    matchedKeyword: string | null;
    messageID?: string;
    ruleID: string;
    ruleTriggerType: AutoModerationTriggerType;
    userID: string;
  }
  interface AutoModerationActionMetadata {
    /** valid for SEND_ALERT_MESSAGE */
    channelID?: string;
    /** valid for TIMEOUT */
    durationSeconds?: number;
  }
  interface AutoModerationRule {
    actions: AutoModerationAction[];
    creatorID: string;
    enabled: boolean;
    eventType: AutoModerationEventType;
    exemptRoles: string[];
    exemptUsers: string[];
    guildID: string;
    id: string;
    name: string;
    triggerMetadata: AutoModerationTriggerMetadata;
    triggerType: AutoModerationTriggerType;
  }
  interface CreateAutoModerationRuleOptions {
    actions: AutoModerationAction[];
    enabled?: boolean;
    eventType: AutoModerationActionType;
    exemptChannels?: string[];
    exemptRoles?: string[];
    name: string;
    reason?: string;
    triggerMetadata?: AutoModerationTriggerMetadata;
    triggerType: AutoModerationTriggerType;
  }

  interface AutoModerationTriggerMetadata {
    /** valid for KEYWORD */
    keywordFilter: string[];
    /** valid for KEYWORD_PRESET */
    presets: AutoModerationKeywordPresetType[];
  }

  // Channel
  interface ChannelFollow {
    channel_id: string;
    webhook_id: string;
  }
  interface ChannelPosition extends EditChannelPositionOptions {
    id: string;
    position?: number;
  }
  interface CreateChannelOptions {
    availableTags?: ForumTag[];
    bitrate?: number;
    defaultAutoArchiveDuration?: AutoArchiveDuration;
    defaultForumLayout?: ForumLayoutTypes;
    defaultReactionEmoji?: DefaultReactionEmoji;
    defaultSortOrder?: SortOrderTypes;
    defaultThreadRateLimitPerUser?: number;
    nsfw?: boolean;
    parentID?: string;
    permissionOverwrites?: Overwrite[];
    position?: number;
    rateLimitPerUser?: number;
    reason?: string;
    topic?: string;
    userLimit?: number;
  }
  interface EditChannelOptionsBase {
    name?: string;
    position?: number;
    permissionOverwrites?: Overwrite[];
  }
  interface EditNewsChannelOptions extends EditChannelOptionsBase {
    defaultAutoArchiveDuration?: AutoArchiveDuration | null;
    nsfw?: boolean | null;
    parentID?: string | null;
    topic?: string | null;
    type?: GuildTextChannelTypes;
  }
  interface EditTextChannelOptions extends EditNewsChannelOptions {
    defaultThreadRateLimitPerUser?: number | null;
    rateLimitPerUser?: number | null;
  }
  interface EditVoiceChannelOptions extends EditChannelOptionsBase {
    bitrate?: number | null;
    nsfw?: boolean | null;
    parentID?: string | null;
    rateLimitPerUser?: number | null;
    rtcRegion?: string | null;
    userLimit?: number | null;
    videoQualityMode?: VideoQualityMode | null;
  }
  interface EditMediaChannelOptions extends EditChannelOptionsBase {
    availableTags?: ForumTag[];
    defaultAutoArchiveDuration?: AutoArchiveDuration | null;
    defaultReactionEmoji?: DefaultReactionEmoji | null;
    defaultSortOrder?: SortOrderTypes | null;
    defaultThreadRateLimitPerUser?: number;
    flags?: ChannelFlags;
    nsfw?: boolean | null;
    parentID?: string | null;
    rateLimitPerUser?: number | null;
    topic?: string | null;
  }
  interface EditForumChannelOptions extends EditMediaChannelOptions {
    defaultForumLayout?: ForumLayoutTypes | null;
  }
  interface EditThreadChannelOptions {
    appliedTags?: string[];
    archived?: boolean;
    autoArchiveDuration?: AutoArchiveDuration;
    flags?: ChannelFlags;
    invitable?: boolean;
    locked?: boolean;
    name?: string;
    rateLimitPerUser?: number | null;
  }
  interface EditChannelPositionOptions {
    lockPermissions?: boolean;
    parentID?: string;
  }
  interface EditGroupChannelOptions {
    icon?: string | null;
    name?: string;
  }
  interface GetMessagesOptions {
    after?: string;
    around?: string;
    before?: string;
    limit?: number;
  }
  interface GroupRecipientOptions {
    accessToken: string;
    nick?: string;
  }
  interface PartialChannel {
    bitrate?: number;
    id: string;
    name?: string;
    nsfw?: boolean;
    parent_id?: number;
    permission_overwrites?: Overwrite[];
    rate_limit_per_user?: number;
    topic?: string | null;
    type: number;
    user_limit?: number;
  }
  interface Permissionable {
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    editPermission(overwriteID: string, allow: PermissionValueTypes, deny: PermissionValueTypes, type: PermissionType, reason?: string): Promise<PermissionOverwrite>;
  }
  interface Pinnable {
    lastPinTimestamp: number | null;
    getPins(): Promise<Message[]>;
    pinMessage(messageID: string): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
  }
  interface PurgeChannelOptions {
    after?: string;
    before?: string;
    filter?: (m: Message<AnyGuildTextableChannel>) => boolean;
    limit: number;
    reason?: string;
  }
  interface WebhookData {
    channelID: string;
    guildID: string;
  }

  // Client
  interface ApplicationRoleConnectionMetadata {
    description: string;
    description_localizations?: Record<LocaleStrings, string>;
    key: string;
    name: string;
    name_localizations?: Record<LocaleStrings, string>;
    type: ApplicationRoleConnectionMetadataTypes;
  }
  interface ClientOptions {
    /** @deprecated */
    agent?: HTTPSAgent;
    allowedMentions?: AllowedMentions;
    autoreconnect?: boolean;
    compress?: boolean;
    connectionTimeout?: number;
    defaultImageFormat?: string;
    defaultImageSize?: number;
    disableEvents?: { [s: string]: boolean };
    firstShardID?: number;
    getAllUsers?: boolean;
    guildCreateTimeout?: number;
    intents: number | (IntentStrings | number)[];
    largeThreshold?: number;
    lastShardID?: number;
    /** @deprecated */
    latencyThreshold?: number;
    maxReconnectAttempts?: number;
    maxResumeAttempts?: number;
    maxShards?: number | "auto";
    messageLimit?: number;
    opusOnly?: boolean;
    /** @deprecated */
    ratelimiterOffset?: number;
    reconnectDelay?: ReconnectDelayFunction;
    requestTimeout?: number;
    rest?: RequestHandlerOptions;
    restMode?: boolean;
    seedVoiceConnections?: boolean;
    shardConcurrency?: number | "auto";
    ws?: unknown;
  }
  interface CommandClientOptions {
    argsSplitter?: (str: string) => string[];
    defaultCommandOptions?: CommandOptions;
    defaultHelpCommand?: boolean;
    description?: string;
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
    name?: string;
    owner?: string;
    prefix?: string | string[];
  }
  interface EditSelfOptions {
    avatar?: string | null;
    username?: string;
  }
  interface RequestHandlerOptions {
    agent?: HTTPSAgent;
    baseURL?: string;
    decodeReasons?: boolean;
    disableLatencyCompensation?: boolean;
    domain?: string;
    latencyThreshold?: number;
    ratelimiterOffset?: number;
    requestTimeout?: number;
  }

  // Command
  interface CommandCooldownExclusions {
    channelIDs?: string[];
    guildIDs?: string[];
    userIDs?: string[];
  }
  interface CommandOptions {
    aliases?: string[];
    argsRequired?: boolean;
    caseInsensitive?: boolean;
    cooldown?: number;
    cooldownExclusions?: CommandCooldownExclusions;
    cooldownMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    cooldownReturns?: number;
    defaultSubcommandOptions?: CommandOptions;
    deleteCommand?: boolean;
    description?: string;
    dmOnly?: boolean;
    errorMessage?: MessageContent | GenericCheckFunction<MessageContent>;
    fullDescription?: string;
    guildOnly?: boolean;
    hidden?: boolean;
    hooks?: Hooks;
    invalidUsageMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    permissionMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    reactionButtons?: CommandReactionButtonsOptions[] | null;
    reactionButtonTimeout?: number;
    requirements?: CommandRequirements;
    restartCooldown?: boolean;
    usage?: string;
  }
  interface CommandReactionButtons extends CommandReactionButtonsOptions {
    execute: (msg: Message, args: string[], userID: string) => string | GeneratorFunctionReturn;
    responses: ((() => string) | ReactionButtonsGeneratorFunction)[];
  }
  interface CommandReactionButtonsOptions {
    emoji: string;
    filter: ReactionButtonsFilterFunction;
    response: string | ReactionButtonsGeneratorFunction;
    type: "edit" | "cancel";
  }
  interface CommandRequirements {
    custom?: GenericCheckFunction<boolean>;
    permissions?: { [s: string]: boolean } | GenericCheckFunction<{ [s: string]: boolean }>;
    roleIDs?: string[] | GenericCheckFunction<string[]>;
    roleNames?: string[] | GenericCheckFunction<string[]>;
    userIDs?: string[] | GenericCheckFunction<string[]>;
  }
  interface Hooks {
    postCheck?: (msg: Message, args: string[], checksPassed: boolean) => void;
    postCommand?: (msg: Message, args: string[], sent?: Message) => void;
    postExecution?: (msg: Message, args: string[], executionSuccess: boolean) => void;
    preCommand?: (msg: Message, args: string[]) => void;
  }

  // Embed
  // Omit<T, K> used to override
  interface Embed extends Omit<EmbedOptions, "footer" | "image" | "thumbnail" | "author"> {
    author?: EmbedAuthor;
    footer?: EmbedFooter;
    image?: EmbedImage;
    provider?: EmbedProvider;
    thumbnail?: EmbedImage;
    type: string;
    video?: EmbedVideo;
  }
  interface EmbedAuthor extends EmbedAuthorOptions {
    proxy_icon_url?: string;
  }
  interface EmbedAuthorOptions {
    icon_url?: string;
    name: string;
    url?: string;
  }
  interface EmbedField {
    inline?: boolean;
    name: string;
    value: string;
  }
  interface EmbedFooter extends EmbedFooterOptions {
    proxy_icon_url?: string;
  }
  interface EmbedFooterOptions {
    icon_url?: string;
    text: string;
  }
  interface EmbedImage extends EmbedImageOptions {
    height?: number;
    proxy_url?: string;
    width?: number;
  }
  interface EmbedImageOptions {
    url?: string;
  }
  interface EmbedOptions {
    author?: EmbedAuthorOptions;
    color?: number;
    description?: string;
    fields?: EmbedField[];
    footer?: EmbedFooterOptions;
    image?: EmbedImageOptions;
    thumbnail?: EmbedImageOptions;
    timestamp?: Date | string;
    title?: string;
    url?: string;
  }
  interface EmbedProvider {
    name?: string;
    url?: string;
  }
  interface EmbedVideo {
    height?: number;
    proxy_url?: string;
    url?: string;
    width?: number;
  }

  // Emoji
  interface Emoji extends EmojiBase {
    animated: boolean;
    available: boolean;
    id: string;
    managed: boolean;
    require_colons: boolean;
    roles: string[];
    user?: PartialUser;
  }
  interface EmojiBase {
    icon?: string;
    name: string;
  }
  interface EmojiOptions extends Exclude<EmojiBase, "icon"> {
    image: string;
    roles?: string[];
  }
  interface PartialEmoji {
    id: string | null;
    name: string;
    animated?: boolean;
  }

  // Events
  interface OldCall {
    endedTimestamp?: number;
    participants: string[];
    region: string;
    ringing: string[];
    unavailable: boolean;
  }
  interface OldForumChannel extends OldGuildChannel {
    availableTags: ForumTag[];
    defaultAutoArchiveDuration: AutoArchiveDuration;
    defaultForumLayout: ForumLayoutTypes;
    defaultReactionEmoji: DefaultReactionEmoji;
    defaultSortOrder: SortOrderTypes;
    defaultThreadRateLimitPerUser: number;
  }
  interface OldGroupChannel {
    icon: string;
    name: string;
    ownerID: string;
    type: Constants["ChannelTypes"]["GROUP_DM"];
  }
  interface OldGuild {
    afkChannelID: string | null;
    afkTimeout: number;
    autoRemoved: boolean | null;
    banner: string | null;
    defaultNotifications: DefaultNotifications;
    description: string | null;
    discoverySplash: string | null;
    emojiCount: number | null;
    emojis: Omit<Emoji, "user" | "icon">[];
    explicitContentFilter: ExplicitContentFilter;
    features: GuildFeatures[];
    icon: string | null;
    keywords: string[] | null;
    large: boolean;
    maxMembers?: number;
    maxVideoChannelUsers?: number;
    mfaLevel: MFALevel;
    name: string;
    /** @deprecated */
    nsfw: boolean;
    nsfwLevel: NSFWLevel;
    ownerID: string;
    preferredLocale?: LocaleStrings;
    premiumProgressBarEnabled: boolean;
    premiumSubscriptionCount?: number;
    premiumTier: PremiumTier;
    primaryCategory?: DiscoveryCategory;
    primaryCategoryID: number | null;
    publicUpdatesChannelID: string | null;
    rulesChannelID: string | null;
    splash: string | null;
    stickers?: Sticker[];
    systemChannelFlags: number;
    systemChannelID: string | null;
    vanityURL: string | null;
    verificationLevel: VerificationLevel;
    welcomeScreen?: WelcomeScreen;
  }
  interface OldGuildChannel {
    bitrate?: number;
    flags?: number;
    name: string;
    nsfw?: boolean;
    parentID: string | null;
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    rateLimitPerUser?: number;
    rtcRegion?: string | null;
    topic?: string | null;
    type: GuildChannelTypes;
  }
  interface OldGuildScheduledEvent {
    channel: PossiblyUncachedSpeakableChannel | null;
    description?: string | null;
    entityID: string | null;
    entityMetadata: GuildScheduledEventMetadata | null;
    entityType: GuildScheduledEventEntityTypes;
    image?: string;
    name: string;
    privacyLevel: GuildScheduledEventPrivacyLevel;
    scheduledEndTime: number | null;
    scheduledStartTime: number;
    status: GuildScheduledEventStatus;
  }
  interface OldGuildTextChannel extends OldGuildChannel {
    nsfw: boolean;
    rateLimitPerUser: number;
    topic?: string | null;
    type: GuildTextChannelTypes;
  }
  interface OldMember {
    avatar: string | null;
    avatarDecorationData?: AvatarDecorationData | null;
    communicationDisabledUntil?: number | null;
    nick: string | null;
    pending?: boolean;
    premiumSince?: number | null;
    roles: string[];
  }
  interface OldMessage {
    attachments: Attachment[];
    channelMentions: string[];
    content: string;
    editedTimestamp?: number;
    embeds: Embed[];
    flags: number;
    mentionedBy?: unknown;
    mentions: User[];
    pinned: boolean;
    poll?: Poll;
    roleMentions: string[];
    tts: boolean;
  }
  interface OldRole {
    color: number;
    flags: number;
    hoist: boolean;
    icon: string | null;
    managed: boolean;
    mentionable: boolean;
    name: string;
    permissions: Permission;
    position: number;
    unicodeEmoji: string | null;
  }
  interface OldStageInstance {
    discoverableDisabled: boolean;
    privacyLevel: StageInstancePrivacyLevel;
    topic: string;
  }
  interface OldVoiceChannel extends OldGuildChannel {
    bitrate: number;
    rtcRegion: string | null;
    type: GuildVoiceChannelTypes;
    userLimit: number;
    videoQualityMode: VideoQualityMode;
  }
  interface OldThread {
    appliedTags: string[];
    autoArchiveDuration: number;
    name: string;
    rateLimitPerUser: number;
    threadMetadata: ThreadMetadata;
  }
  interface OldThreadMember {
    flags: number;
  }
  interface OldVoiceState {
    deaf: boolean;
    mute: boolean;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
  }
  interface EventListeners {
    applicationCommandPermissionsUpdate: [applicationCommandPermissions: GuildApplicationCommandPermissions];
    autoModerationActionExecution: [guild: Guild, action: AutoModerationActionExecution];
    autoModerationRuleCreate: [guild: Guild, rule: AutoModerationRule];
    autoModerationRuleDelete: [guild: Guild, rule: AutoModerationRule];
    autoModerationRuleUpdate: [guild: Guild, rule: AutoModerationRule | null, newRule: AutoModerationRule];
    channelCreate: [channel: AnyGuildChannel];
    channelDelete: [channel: Exclude<AnyChannel, GroupChannel>];
    channelPinUpdate: [channel: TextableChannel, timestamp: number, oldTimestamp: number];
    channelUpdate: [channel: AnyGuildChannel, oldChannel: OldGuildChannel | OldForumChannel | OldGuildTextChannel | OldVoiceChannel]
    | [channel: GroupChannel, oldChannel: OldGroupChannel];
    connect: [id: number];
    debug: [message: string, id?: number];
    disconnect: [];
    error: [err: Error, id?: number];
    guildAuditLogEntryCreate: [guildAuditLogEntry: GuildAuditLogEntry];
    guildAvailable: [guild: Guild];
    guildBanAdd: [guild: Guild, user: User];
    guildBanRemove: [guild: Guild, user: User];
    guildCreate: [guild: Guild];
    guildDelete: [guild: PossiblyUncachedGuild];
    guildEmojisUpdate: [guild: PossiblyUncachedGuild, emojis: Emoji[], oldEmojis: Emoji[] | null];
    guildIntegrationsUpdate: [guild: PossiblyUncachedGuild];
    guildMemberAdd: [guild: Guild, member: Member];
    guildMemberChunk: [guild: Guild, member: Member[]];
    guildMemberRemove: [guild: Guild, member: Member | MemberPartial];
    guildMemberUpdate: [guild: Guild, member: Member, oldMember: OldMember | null];
    guildRoleCreate: [guild: Guild, role: Role];
    guildRoleDelete: [guild: Guild, role: Role];
    guildRoleUpdate: [guild: Guild, role: Role, oldRole: OldRole];
    guildScheduledEventCreate: [event: GuildScheduledEvent];
    guildScheduledEventDelete: [event: GuildScheduledEvent];
    guildScheduledEventUpdate: [event: GuildScheduledEvent, oldEvent: OldGuildScheduledEvent | null];
    guildScheduledEventUserAdd: [event: PossiblyUncachedGuildScheduledEvent, user: User | Uncached];
    guildScheduledEventUserRemove: [event: PossiblyUncachedGuildScheduledEvent, user: User | Uncached];
    guildStickersUpdate: [guild: PossiblyUncachedGuild, stickers: Sticker[], oldStickers: Sticker[] | null];
    guildUnavailable: [guild: UnavailableGuild];
    guildUpdate: [guild: Guild, oldGuild: OldGuild];
    hello: [trace: string[], id: number];
    interactionCreate: [interaction: PingInteraction | CommandInteraction | ComponentInteraction | AutocompleteInteraction | ModalSubmitInteraction | UnknownInteraction];
    inviteCreate: [guild: Guild, invite: Invite];
    inviteDelete: [guild: Guild, invite: Invite];
    messageCreate: [message: Message<PossiblyUncachedTextableChannel>];
    messageDelete: [message: PossiblyUncachedMessage];
    messageDeleteBulk: [messages: PossiblyUncachedMessage[]];
    messagePollVoteAdd: [message: PossiblyUncachedMessage, user: User | Uncached, answerID: number];
    messagePollVoteRemove: [message: PossiblyUncachedMessage, user: User | Uncached, answerID: number];
    messageReactionAdd: [message: PossiblyUncachedMessage, emoji: PartialEmoji, reactor: Member | Uncached, burst: boolean];
    messageReactionRemove: [message: PossiblyUncachedMessage, emoji: PartialEmoji, userID: string, burst: boolean];
    messageReactionRemoveAll: [message: PossiblyUncachedMessage];
    messageReactionRemoveEmoji: [message: PossiblyUncachedMessage, emoji: PartialEmoji];
    messageUpdate: [message: Message<PossiblyUncachedTextableChannel>, oldMessage: OldMessage | null];
    presenceUpdate: [other: Member, oldPresence: Presence | null];
    rawREST: [request: RawRESTRequest];
    rawWS: [packet: RawPacket, id: number];
    ready: [];
    shardPreReady: [id: number];
    stageInstanceCreate: [stageInstance: StageInstance];
    stageInstanceDelete: [stageInstance: StageInstance];
    stageInstanceUpdate: [stageInstance: StageInstance, oldStageInstance: OldStageInstance | null];
    threadCreate: [channel: AnyThreadChannel];
    threadDelete: [channel: AnyThreadChannel];
    threadListSync: [guild: Guild, deletedThreads: (AnyThreadChannel | Uncached)[], activeThreads: AnyThreadChannel[], joinedThreadsMember: ThreadMember[]];
    threadMembersUpdate: [channel: AnyThreadChannel, addedMembers: ThreadMember[], removedMembers: (ThreadMember | Uncached)[]];
    threadMemberUpdate: [channel: AnyThreadChannel, member: ThreadMember, oldMember: OldThreadMember];
    threadUpdate: [channel: AnyThreadChannel, oldChannel: OldThread | null];
    typingStart: [channel: AnyGuildTextableChannel | Uncached, user: User | Uncached, member: Member]
    | [channel: DMChannel | Uncached, user: User | Uncached, member: null];
    unavailableGuildCreate: [guild: UnavailableGuild];
    unknown: [packet: RawPacket, id?: number];
    userUpdate: [user: User, oldUser: PartialUser | null];
    voiceChannelJoin: [member: Member, channel: AnyVoiceChannel];
    voiceChannelLeave: [member: Member, channel: AnyVoiceChannel];
    voiceChannelStatusUpdate: [channel: AnyVoiceChannel, oldChannel: VoiceStatus];
    voiceChannelSwitch: [member: Member, newChannel: AnyVoiceChannel, oldChannel: AnyVoiceChannel];
    voiceStateUpdate: [member: Member, oldState: OldVoiceState];
    warn: [message: string, id?: number];
    webhooksUpdate: [data: WebhookData];
  }
  interface ClientEvents extends EventListeners {
    shardDisconnect: [err: Error | undefined, id: number];
    shardReady: [id: number];
    shardResume: [id: number];
  }
  interface ShardEvents extends EventListeners {
    resume: [];
  }
  interface StreamEvents {
    end: [];
    error: [err: Error];
    start: [];
  }
  interface VoiceEvents {
    connect: [];
    debug: [message: string];
    disconnect: [err?: Error];
    end: [];
    error: [err: Error];
    pong: [latency: number];
    ready: [];
    speakingStart: [userID: string];
    speakingStop: [userID: string];
    start: [];
    unknown: [packet: RawPacket];
    userDisconnect: [userID: string];
    warn: [message: string];
  }

  // Gateway/REST
  interface HTTPResponse {
    code: number;
    message: string;
  }
  interface LatencyRef {
    lastTimeOffsetCheck: number;
    latency: number;
    raw: number[];
    timeOffset: number;
    timeOffsets: number[];
  }
  interface RawPacket {
    d?: unknown;
    op: number;
    s?: number;
    t?: string;
  }
  interface RawRESTRequest {
    auth: boolean;
    body?: unknown;
    file?: FileContent;
    latency: number;
    method: string;
    resp: IncomingMessage;
    route: string;
    short: boolean;
    url: string;
  }
  interface RequestMembersPromise {
    members: Member;
    received: number;
    res: (value: Member[]) => void;
    timeout: NodeJS.Timeout;
  }
  interface ShardManagerOptions {
    concurrency?: number | "auto";
  }

  // Guild
  interface AddGuildMemberOptions {
    deaf?: boolean;
    mute?: boolean;
    nick?: string;
    roles?: string[];
  }
  interface BanMemberOptions {
    /** @deprecated */
    deleteMessageDays?: number;
    deleteMessageSeconds?: number;
    reason?: string;
  }
  interface CreateGuildOptions {
    afkChannelID?: string;
    afkTimeout?: number;
    channels?: PartialChannel[];
    defaultNotifications?: DefaultNotifications;
    explicitContentFilter?: ExplicitContentFilter;
    icon?: string;
    roles?: PartialRole[];
    systemChannelID: string;
    verificationLevel?: VerificationLevel;
  }
  interface DiscoveryCategory {
    id: number;
    is_primary: boolean;
    name: {
      default: string;
      localizations?: Record<LocaleStrings, string>;
    };
  }
  interface DiscoveryMetadata {
    category_ids: number[];
    emoji_discoverability_enabled: boolean;
    guild_id: string;
    keywords: string[] | null;
    primary_category_id: number;
  }
  interface DiscoveryOptions {
    emojiDiscoverabilityEnabled?: boolean;
    keywords?: string[];
    primaryCategoryID?: string;
    reason?: string;
  }
  interface DiscoverySubcategoryResponse {
    category_id: number;
    guild_id: string;
  }
  interface GetGuildAuditLogOptions {
    actionType?: number;
    before?: string;
    limit?: number;
    userID?: string;
  }
  interface GetGuildBansOptions {
    after?: string;
    before?: string;
    limit?: number;
  }
  interface GetGuildScheduledEventOptions {
    withUserCount?: boolean;
  }
  interface GetGuildScheduledEventUsersOptions {
    after?: string;
    before?: string;
    limit?: number;
    withMember?: boolean;
  }
  interface GetPruneOptions {
    days?: number;
    includeRoles?: string[];
  }
  interface GetRESTGuildMembersOptions {
    after?: string;
    limit?: number;
  }
  interface GetRESTGuildsOptions {
    after?: string;
    before?: string;
    limit?: number;
    withCounts?: boolean;
  }
  interface GuildAuditLog {
    entries: GuildAuditLogEntry[];
    integrations: GuildIntegration[];
    threads: AnyThreadChannel[];
    users: User[];
    webhooks: Webhook[];
  }
  interface GuildBan {
    reason?: string;
    user: User;
  }
  interface GuildOnboarding {
    default_channel_ids: string[];
    enabled: boolean;
    guild_id: string;
    mode: OnboardingModes;
    prompts: GuildOnboardingPrompt[];
  }
  interface GuildOnboardingOptions extends Omit<GuildOnboarding, "guild_id" | "prompt"> {
    prompts: GuildOnboardingPromptOptions[];
  }
  interface GuildOnboardingPrompt {
    id: string;
    in_onboarding: boolean;
    options: GuildOnboardingPromptOption[];
    required: boolean;
    single_select: boolean;
    title: string;
    type: OnboardingPromptTypes;
  }
  interface GuildOnboardingPromptOption {
    channel_ids: string[];
    description: string | null;
    emoji?: PartialEmoji;
    id: string;
    role_ids: string[];
    title: string;
  }
  interface GuildOnboardingPromptOptionOptions<T = boolean> extends Omit<GuildOnboardingPromptOption, "emoji"> {
    emoji_animated: T extends true ? boolean : never;
    emoji_id: T extends true ? string : never;
    emoji_name: T extends true ? string : never;
  }
  interface GuildOnboardingPromptOptions extends Omit<GuildOnboardingPrompt, "options"> {
    options: GuildOnboardingPromptOptionOptions[];
  }
  interface GuildOptions {
    afkChannelID?: string | null;
    afkTimeout?: number;
    banner?: string | null;
    defaultNotifications?: DefaultNotifications | null;
    description?: string | null;
    discoverySplash?: string | null;
    explicitContentFilter?: ExplicitContentFilter | null;
    features?: GuildFeatures[]; // Though only some are editable?
    icon?: string | null;
    name?: string;
    ownerID?: string;
    preferredLocale?: LocaleStrings | null;
    publicUpdatesChannelID?: string | null;
    rulesChannelID?: string | null;
    safetyAlertsChannelID?: string | null;
    splash?: string | null;
    systemChannelFlags?: number;
    systemChannelID?: string | null;
    verificationLevel?: VerificationLevel | null;
  }
  interface GuildScheduledEventEditOptionsBase<T extends GuildScheduledEventEntityTypes = GuildScheduledEventEntityTypes> {
    channelID?: T extends Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"] ? null : string;
    description?: string | null;
    entityMetadata?: T extends Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"] ? Required<GuildScheduledEventMetadata> : GuildScheduledEventMetadata | null;
    entityType?: T;
    image?: string;
    name?: string;
    privacyLevel?: GuildScheduledEventPrivacyLevel;
    scheduledEndTime?: T extends Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"] ? Date : Date | undefined;
    scheduledStartTime?: Date;
    status?: GuildScheduledEventStatus;
  }
  interface GuildScheduledEventEditOptionsDiscord extends GuildScheduledEventEditOptionsBase<Exclude<GuildScheduledEventEntityTypes, Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"]>> {
    channelID: string;
    entityMetadata: GuildScheduledEventMetadata;
  }
  interface GuildScheduledEventEditOptionsExternal extends GuildScheduledEventEditOptionsBase<Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"]> {
    channelID: null;
    entityMetadata: Required<GuildScheduledEventMetadata>;
    scheduledEndTime: Date;
  }
  interface GuildScheduledEventMetadata {
    location?: string;
  }
  interface GuildScheduledEventOptionsBase<T extends GuildScheduledEventEntityTypes> extends Omit<GuildScheduledEventEditOptionsBase<T>, "entityMetadata" | "status"> {
    channelID: T extends Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"] ? never : string;
    entityMetadata?: T extends Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"] ? Required<GuildScheduledEventMetadata> : GuildScheduledEventMetadata | undefined;
    entityType: T;
    name: string;
    privacyLevel: GuildScheduledEventPrivacyLevel;
    scheduledStartTime: Date;
  }
  interface GuildScheduledEventOptionsDiscord extends GuildScheduledEventEditOptionsBase<Exclude<GuildScheduledEventEntityTypes, Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"]>> {
    channelID: string;
    entityMetadata: GuildScheduledEventMetadata;
  }
  interface GuildScheduledEventOptionsExternal extends GuildScheduledEventOptionsBase<Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"]> {
    channelID: never;
    entityMetadata: Required<GuildScheduledEventMetadata>;
    scheduledEndTime: Date;
  }
  interface GuildScheduledEventUser {
    guildScheduledEventID: string;
    member?: Member;
    user: User;
  }
  interface GuildTemplateOptions {
    description?: string | null;
    name?: string;
  }
  interface GuildVanity {
    code: string | null;
    uses: number;
  }
  interface IntegrationApplication {
    bot?: User;
    description: string;
    icon: string | null;
    id: string;
    name: string;
    summary: ""; // Returns an empty string
  }
  interface IntegrationOptions {
    enableEmoticons?: string;
    expireBehavior?: string;
    expireGracePeriod?: string;
  }
  interface MFALevelResponse {
    level: MFALevel;
  }
  interface PruneMemberOptions extends GetPruneOptions {
    computePruneCount?: boolean;
    reason?: string;
  }
  interface VoiceRegion {
    custom: boolean;
    deprecated: boolean;
    id: string;
    name: string;
    optimal: boolean;
    vip: boolean;
  }
  interface WelcomeChannel {
    channelID: string;
    description: string;
    emojiID: string | null;
    emojiName: string | null;
  }
  interface WelcomeScreen {
    description: string;
    welcomeChannels: WelcomeChannel[];
  }
  interface WelcomeScreenOptions extends WelcomeScreen {
    enabled: boolean;
  }
  interface Widget extends Omit<WidgetOptions, "channelID" | "reason"> {
    channel_id: string | null;
    enabled: boolean;
  }
  interface WidgetChannel {
    id: string;
    name: string;
    position: number;
  }
  interface WidgetData {
    channels: WidgetChannel[];
    id: string;
    instant_invite: string;
    members: WidgetMember[];
    name: string;
    presence_count: number;
  }
  interface WidgetMember {
    avatar: string | null;
    avatar_url: string;
    discriminator: string;
    id: string;
    status: string;
    username: string;
  }
  interface WidgetOptions {
    channelID?: string | null;
    channel_id?: string | null;
    enabled?: boolean;
    reason?: string;
  }

  // Interaction
  interface AutocompleteInteractionData {
    id: string;
    name: string;
    type: Constants["ApplicationCommandTypes"]["CHAT_INPUT"];
    target_id?: string;
    options: InteractionDataOptions[];
  }
  interface CommandInteractionData {
    id: string;
    name: string;
    type: ApplicationCommandTypes;
    target_id?: string;
    resolved?: CommandInteractionResolvedData;
    options?: InteractionDataOptions[];
  }
  interface CommandInteractionResolvedData {
    channels?: Collection<AnyChannel>;
    members?: Collection<Member>;
    messages?: Collection<Message>;
    roles?: Collection<Role>;
    users?: Collection<User>;
  }
  interface ComponentInteractionButtonData {
    component_type: Constants["ComponentTypes"]["BUTTON"];
    custom_id: string;
  }
  interface ComponentInteractionSelectMenuData {
    component_type: Constants["ComponentTypes"]["SELECT_MENU"];
    custom_id: string;
    values: string[];
  }
  interface InteractionAutocomplete {
    choices: ApplicationCommandOptionChoice[];
  }
  interface InteractionDataOptionsSubCommand {
    name: string;
    options?: InteractionDataOptions[];
    type: Constants["ApplicationCommandOptionTypes"]["SUB_COMMAND"];
  }
  interface InteractionDataOptionsSubCommandGroup {
    name: string;
    options: InteractionDataOptions[];
    type: Constants["ApplicationCommandOptionTypes"]["SUB_COMMAND_GROUP"];
  }
  interface InteractionDataOptionWithValue<T extends Constants["ApplicationCommandOptionTypes"][Exclude<keyof Constants["ApplicationCommandOptionTypes"], "SUB_COMMAND" | "SUB_COMMAND_GROUP">] = Constants["ApplicationCommandOptionTypes"][Exclude<keyof Constants["ApplicationCommandOptionTypes"], "SUB_COMMAND" | "SUB_COMMAND_GROUP">], V = unknown> {
    focused?: boolean;
    name: string;
    type: T;
    value: V;
  }
  interface InteractionModal {
    title: string;
    custom_id: string;
    components: ModalContentActionRow[];
  }
  interface InteractionOptions {
    data?: InteractionCallbackData;
    type: InteractionResponseTypes;
  }

  // Invite
  interface CreateChannelInviteOptions extends CreateInviteOptions {
    targetApplicationID?: string;
    targetType?: InviteTargetTypes;
    targetUserID?: string;
  }
  interface CreateInviteOptions {
    maxAge?: number;
    maxUses?: number;
    temporary?: boolean;
    unique?: boolean;
  }
  interface Invitable {
    createInvite(options?: CreateInviteOptions, reason?: string): Promise<Invite>;
    getInvites(): Promise<Invite[]>;
  }
  interface InvitePartialChannel {
    icon?: string | null;
    id: string;
    name: string | null;
    recipients?: { username: string }[];
    type: Exclude<ChannelTypes, 1>;
  }
  interface InviteStageInstance {
    members: Member[];
    participantCount: number;
    speakerCount: number;
    topic: string;
  }

  // Member/User
  interface AvatarDecorationData {
    asset: string;
    sku_id: string;
  }
  interface MemberOptions {
    channelID?: string | null;
    communicationDisabledUntil?: Date | null;
    deaf?: boolean;
    flags?: number;
    mute?: boolean;
    nick?: string | null;
    roles?: string[];
  }
  interface MemberPartial {
    id: string;
    user: User;
  }
  interface MemberRoles extends BaseData {
    roles: string[];
  }
  interface PartialUser {
    accentColor?: number | null;
    avatar: string | null;
    avatarDecorationData?: AvatarDecorationData | null;
    banner?: string | null;
    discriminator: string;
    id: string;
    username: string;
  }
  interface RequestGuildMembersOptions {
    limit?: number;
    presences?: boolean;
    query?: string;
    timeout?: number;
    userIDs?: string[];
  }

  // Message
  interface ActionRow {
    components: ActionRowComponents[];
    type: Constants["ComponentTypes"]["ACTION_ROW"];
  }
  interface ModalContentActionRow {
    components: TextInput[];
    type: Constants["ComponentTypes"]["ACTION_ROW"];
  }
  interface ActiveMessages {
    args: string[];
    command: Command;
    timeout: NodeJS.Timer;
  }
  interface AdvancedMessageContent extends AdvancedMessageContentEdit {
    messageReference?: MessageReferenceReply;
    /** @deprecated */
    messageReferenceID?: string;
    poll?: PollCreateOptions;
    stickerIDs?: string[];
    tts?: boolean;
  }
  interface AdvancedMessageContentEdit {
    flags?: number;
    allowedMentions?: AllowedMentions;
    attachments?: PartialAttachment[];
    components?: ActionRow[];
    content?: string;
    /** @deprecated */
    embed?: EmbedOptions;
    embeds?: EmbedOptions[];
    file?: FileContent | FileContent[];
  }
  interface AllowedMentions {
    everyone?: boolean;
    repliedUser?: boolean;
    roles?: boolean | string[];
    users?: boolean | string[];
  }
  interface Attachment extends PartialAttachment {
    content_type?: string;
    duration_secs?: number;
    ephemeral?: boolean;
    filename: string;
    flags?: number;
    height?: number;
    id: string;
    proxy_url: string;
    size: number;
    url: string;
    waveform?: string;
    width?: number;
  }
  interface ButtonBase {
    disabled?: boolean;
    emoji?: Partial<PartialEmoji>;
    label?: string;
    type: Constants["ComponentTypes"]["BUTTON"];
  }
  interface CreateStickerOptions extends Required<Pick<EditStickerOptions, "name" | "tags">> {
    file: FileContent;
  }
  interface EditStickerOptions {
    description?: string;
    name?: string;
    tags?: string;
  }
  interface FileContent {
    file: Buffer | string;
    name: string;
  }
  interface TextInput {
    custom_id: string;
    label: string;
    max_length?: number;
    min_length?: number;
    placeholder?: string;
    required?: boolean;
    style: Constants["TextInputStyles"][keyof Constants["TextInputStyles"]];
    type: Constants["ComponentTypes"]["TEXT_INPUT"];
    value?: string;
  }
  interface GetMessageReactionOptions {
    after?: string;
    /** @deprecated */
    before?: string;
    limit?: number;
    type?: ReactionTypes;
  }
  interface GetPollAnswerVotersOptions {
    after?: string;
    limit?: number;
  }
  interface InteractionButton extends ButtonBase {
    custom_id: string;
    style: Exclude<ButtonStyles, Constants["ButtonStyles"]["LINK"]>;
  }
  interface MessageActivity {
    party_id?: string;
    type: MessageActivityTypes;
  }
  interface MessageApplication {
    cover_image?: string;
    description: string;
    icon: string | null;
    id: string;
    name: string;
  }
  interface MessageInteraction {
    id: string;
    member: Member | null;
    name: string;
    type: InteractionTypes;
    user: User;
  }
  interface MessageReference extends MessageReferenceBase {
    channelID: string;
  }
  interface MessageReferenceBase {
    channelID?: string;
    guildID?: string;
    messageID?: string;
  }
  interface MessageReferenceReply extends MessageReferenceBase {
    messageID: string;
    failIfNotExists?: boolean;
  }
  interface PartialAttachment {
    description?: string;
    filename?: string;
    id: string | number;
  }
  interface Poll {
    allow_multiselect: boolean;
    answers: PollAnswer[];
    expiry: number | null;
    layout_type: PollLayoutTypes;
    question: Pick<PollMedia, "text">;
    results?: PollResult;
  }
  interface PollAnswer {
    answer_id: number;
    poll_media: PollMedia;
  }
  interface PollCreateOptions extends Omit<Poll, "expiry" | "results"> {
    duration: number;
  }
  interface PollMedia {
    emoji?: PartialEmoji;
    text: string;
  }
  interface PollResult {
    answer_counts: PollAnswerCount[];
    is_finalized: boolean;
  }
  interface PollAnswerCount {
    count: number;
    id: number;
    me_voted: boolean;
  }
  interface Reaction {
    burst_colors: string[];
    count: number;
    count_details: ReactionCountDetails;
    me: boolean;
    me_burst: boolean;
    type: ReactionTypes;
  }
  interface ReactionCountDetails {
    burst: number;
    normal: number;
  }
  interface SelectMenu {
    custom_id: string;
    disabled?: boolean;
    max_values?: number;
    min_values?: number;
    options: SelectMenuOptions[];
    placeholder?: string;
    type: Constants["ComponentTypes"]["SELECT_MENU"];
  }
  interface SelectMenuOptions {
    default?: boolean;
    description?: string;
    emoji?: Partial<PartialEmoji>;
    label: string;
    value: string;
  }
  interface Sticker extends StickerItems {
    /** @deprecated */
    asset: "";
    available?: boolean;
    description: string;
    guild_id?: string;
    pack_id?: string;
    sort_value?: number;
    tags: string;
    type: StickerTypes;
    user?: User;
  }
  interface StickerItems {
    format_type: StickerFormats;
    id: string;
    name: string;
  }
  interface StickerPack {
    banner_asset_id: string;
    cover_sticker_id?: string;
    description: string;
    id: string;
    name: string;
    sku_id: string;
    stickers: Sticker[];
  }
  interface URLButton extends ButtonBase {
    style: Constants["ButtonStyles"]["LINK"];
    url: string;
  }

  // Presence
  interface Activity<T extends ActivityType = ActivityType> extends ActivityPartial<T> {
    application_id?: string;
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
      [key: string]: unknown;
    };
    created_at: number;
    details?: string;
    emoji?: { animated?: boolean; id?: string; name: string };
    flags?: number;
    instance?: boolean;
    party?: { id?: string; size?: [number, number] };
    secrets?: { join?: string; spectate?: string; match?: string };
    state?: string;
    timestamps?: { end?: number; start: number };
    type: T;
    // the stuff attached to this object apparently varies even more than documented, so...
    [key: string]: unknown;
  }
  interface ActivityPartial<T extends ActivityType> {
    name: string;
    state?: string;
    type?: T;
    url?: string;
  }
  interface ClientPresence {
    activities: Activity[] | null;
    afk: boolean;
    since: number | null;
    status: SelfStatus;
  }
  interface ClientStatus {
    desktop: UserStatus;
    mobile: UserStatus;
    web: UserStatus;
  }
  interface Presence {
    activities?: Activity[];
    clientStatus?: ClientStatus;
    status?: UserStatus;
  }

  // Role
  interface Overwrite {
    allow: bigint | number;
    deny: bigint | number;
    id: string;
    type: PermissionType;
  }
  interface PartialRole {
    color?: number;
    flags?: number;
    hoist?: boolean;
    id: string;
    mentionable?: boolean;
    name?: string;
    permissions?: number;
    position?: number;
  }
  interface RoleOptions {
    color?: number;
    hoist?: boolean;
    icon?: string;
    mentionable?: boolean;
    name?: string;
    permissions?: bigint | number | string | Permission;
    unicodeEmoji?: string;
  }
  interface RoleSubscriptionData {
    is_renewal: boolean;
    role_subscription_listing_id: string;
    tier_name: string;
    total_months_subscribed: number;
  }
  interface RoleTags {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: true;
    subscription_listing_id?: string;
    available_for_purchase?: true;
    guild_connections?: true;
  }

  // Forum/Thread
  interface CreateThreadOptions {
    autoArchiveDuration?: AutoArchiveDuration;
    name: string;
    rateLimitPerUser?: number;
    reason?: string;
  }
  interface CreateForumThreadOptions extends CreateThreadOptions {
    appliedTags?: string[];
    message: Omit<AdvancedMessageContent, "messageReference" | "messageReferenceID" | "tts"> & FileContent[];
  }
  interface CreateThreadWithoutMessageOptions<T = AnyThreadChannel["type"]> extends CreateThreadOptions {
    invitable?: T extends PrivateThreadChannel["type"] ? boolean : never;
    type?: T;
  }
  interface DefaultReactionEmoji {
    emoji_id?: string;
    emoji_name?: string;
  }
  interface ForumTag extends DefaultReactionEmoji {
    id: string;
    name: string;
    moderated: boolean;
  }
  interface GetArchivedThreadsOptions {
    before?: Date;
    limit?: number;
  }
  interface GetThreadMembersOptions {
    after?: string;
    limit?: number;
    withMember?: boolean;
  }
  interface ListedChannelThreads<T extends ThreadChannel = AnyThreadChannel> extends ListedGuildThreads<T> {
    hasMore: boolean;
  }
  interface ListedGuildThreads<T extends ThreadChannel = AnyThreadChannel> {
    members: ThreadMember[];
    threads: T[];
  }
  interface PrivateThreadMetadata extends ThreadMetadata {
    invitable: boolean;
  }
  interface ThreadMetadata {
    archived: boolean;
    archiveTimestamp: number;
    autoArchiveDuration: AutoArchiveDuration;
    createTimestamp?: number | null;
    locked: boolean;
  }

  // Modals
  interface ModalSubmitInteractionDataComponents {
    components: ModalSubmitInteractionDataComponent[];
    type: Constants["ComponentTypes"]["ACTION_ROW"];
  }

  interface ModalSubmitInteractionDataTextInputComponent {
    custom_id: string;
    type: Constants["ComponentTypes"]["TEXT_INPUT"];
    value: string;
  }

  interface ModalSubmitInteractionData {
    custom_id: string;
    components: ModalSubmitInteractionDataComponents[];
  }

  // Voice
  interface JoinVoiceChannelOptions {
    opusOnly?: boolean;
    selfDeaf?: boolean;
    selfMute?: boolean;
    shared?: boolean;
  }
  interface StageInstanceOptions {
    privacyLevel?: StageInstancePrivacyLevel;
    topic?: string;
  }
  interface UncachedMemberVoiceState {
    id: string;
    voiceState: OldVoiceState;
  }
  interface VoiceConnectData {
    channel_id: string;
    endpoint: string;
    session_id: string;
    token: string;
    user_id: string;
  }
  interface VoiceResourceOptions {
    encoderArgs?: string[];
    format?: string;
    frameDuration?: number;
    frameSize?: number;
    inlineVolume?: boolean;
    inputArgs?: string[];
    pcmSize?: number;
    samplingRate?: number;
    voiceDataTimeout?: number;
  }
  interface VoiceServerUpdateData extends Omit<VoiceConnectData, "channel_id"> {
    guild_id: string;
    shard: Shard;
  }
  interface VoiceStateOptions {
    channelID: string;
    requestToSpeakTimestamp?: Date | null;
    suppress?: boolean;
  }
  interface VoiceStatus {
    status: string;
  }
  interface VoiceStreamCurrent {
    buffer: Buffer | null;
    bufferingTicks: number;
    options: VoiceResourceOptions;
    pausedTime?: number;
    pausedTimestamp?: number;
    playTime: number;
    startTime: number;
    timeout: NodeJS.Timeout | null;
  }

  // Webhook
  interface Webhook {
    application_id: string | null;
    avatar: string | null;
    channel_id: string | null;
    guild_id: string | null;
    id: string;
    name: string;
    source_channel?: { id: string; name: string };
    source_guild: { icon: string | null; id: string; name: string };
    token?: string;
    type: WebhookTypes;
    url?: string;
    user?: PartialUser;
  }
  interface WebhookCreateOptions extends Omit<WebhookEditOptions, "channelID"> {
    name: string;
  }
  interface WebhookEditOptions {
    avatar?: string | null;
    channelID?: string;
    name?: string;
  }
  interface WebhookPayload {
    allowedMentions?: AllowedMentions;
    attachments?: PartialAttachment[];
    auth?: boolean;
    avatarURL?: string;
    components?: ActionRow[];
    content?: string;
    /** @deprecated */
    embed?: EmbedOptions;
    embeds?: EmbedOptions[];
    file?: FileContent | FileContent[];
    flags?: number;
    poll?: PollCreateOptions;
    threadID?: string;
    tts?: boolean;
    username?: string;
    wait?: boolean;
  }

  // TODO: Does this have more stuff?
  interface BaseData {
    id: string;
    [key: string]: unknown;
  }
  interface Constants {
    GATEWAY_VERSION: 9;
    REST_VERSION: 9;
    ActivityFlags: {
      INSTANCE:                    1;
      JOIN:                        2;
      SPECTATE:                    4;
      JOIN_REQUEST:                8;
      SYNC:                        16;
      PLAY:                        32;
      PARTY_PRIVACY_FRIENDS:       64;
      PARTY_PRIVACY_VOICE_CHANNEL: 128;
      EMBEDDED:                    256;
    };
    ActivityTypes: {
      GAME:      0;
      STREAMING: 1;
      LISTENING: 2;
      WATCHING:  3;
      CUSTOM:    4;
      COMPETING: 5;
    };
    ApplicationCommandOptionTypes: {
      SUB_COMMAND:       1;
      SUB_COMMAND_GROUP: 2;
      STRING:            3;
      INTEGER:           4;
      BOOLEAN:           5;
      USER:              6;
      CHANNEL:           7;
      ROLE:              8;
      MENTIONABLE:       9;
      NUMBER:            10;
    };
    ApplicationCommandPermissionTypes: {
      ROLE:    1;
      USER:    2;
      CHANNEL: 3;
    };
    ApplicationCommandTypes: {
      CHAT_INPUT: 1;
      USER:       2;
      MESSAGE:    3;
    };
    AttachmentFlags: {
      IS_REMIX: 4;
    };
    AuditLogActions: {
      GUILD_UPDATE: 1;

      CHANNEL_CREATE:           10;
      CHANNEL_UPDATE:           11;
      CHANNEL_DELETE:           12;
      CHANNEL_OVERWRITE_CREATE: 13;
      CHANNEL_OVERWRITE_UPDATE: 14;
      CHANNEL_OVERWRITE_DELETE: 15;

      MEMBER_KICK:        20;
      MEMBER_PRUNE:       21;
      MEMBER_BAN_ADD:     22;
      MEMBER_BAN_REMOVE:  23;
      MEMBER_UPDATE:      24;
      MEMBER_ROLE_UPDATE: 25;
      MEMBER_MOVE:        26;
      MEMBER_DISCONNECT:  27;
      BOT_ADD:            28;

      ROLE_CREATE: 30;
      ROLE_UPDATE: 31;
      ROLE_DELETE: 32;

      INVITE_CREATE: 40;
      INVITE_UPDATE: 41;
      INVITE_DELETE: 42;

      WEBHOOK_CREATE: 50;
      WEBHOOK_UPDATE: 51;
      WEBHOOK_DELETE: 52;

      EMOJI_CREATE: 60;
      EMOJI_UPDATE: 61;
      EMOJI_DELETE: 62;

      MESSAGE_DELETE:      72;
      MESSAGE_BULK_DELETE: 73;
      MESSAGE_PIN:         74;
      MESSAGE_UNPIN:       75;

      INTEGRATION_CREATE:    80;
      INTEGRATION_UPDATE:    81;
      INTEGRATION_DELETE:    82;
      STAGE_INSTANCE_CREATE: 83;
      STAGE_INSTANCE_UPDATE: 84;
      STAGE_INSTANCE_DELETE: 85;

      STICKER_CREATE: 90;
      STICKER_UPDATE: 91;
      STICKER_DELETE: 92;

      GUILD_SCHEDULED_EVENT_CREATE: 100;
      GUILD_SCHEDULED_EVENT_UPDATE: 101;
      GUILD_SCHEDULED_EVENT_DELETE: 102;

      THREAD_CREATE: 110;
      THREAD_UPDATE: 111;
      THREAD_DELETE: 112;

      APPLICATION_COMMAND_PERMISSION_UPDATE: 121;

      AUTO_MODERATION_RULE_CREATE:   140;
      AUTO_MODERATION_RULE_UPDATE:   141;
      AUTO_MODERATION_RULE_DELETE:   142;
      AUTO_MODERATION_BLOCK_MESSAGE: 143;

      VOICE_CHANNEL_STATUS_UPDATE: 192;
      VOICE_CHANNEL_STATUS_DELETE: 193;
    };
    AutoModerationActionTypes: {
      BLOCK_MESSAGE:      1;
      SEND_ALERT_MESSAGE: 2;
      TIMEOUT:            3;
    };
    AutoModerationEventTypes: {
      MESSAGE_SEND: 1;
    };
    AutoModerationKeywordPresetTypes: {
      PROFANITY:      1;
      SEXUAL_CONTENT: 2;
      SLURS:          3;
    };
    AutoModerationTriggerTypes: {
      KEYWORD:        1;
      HARMFUL_LINK:   2;
      SPAM:           3;
      KEYWORD_PRESET: 4;
    };
    ButtonStyles: {
      PRIMARY:   1;
      SECONDARY: 2;
      SUCCESS:   3;
      DANGER:    4;
      LINK:      5;
    };
    ChannelFlags: {
      PINNED:                      1;
      REQUIRE_TAG:                 16;
      HIDE_MEDIA_DOWNLOAD_OPTIONS: 32768;
    };
    ChannelTypes: {
      GUILD_TEXT:           0;
      DM:                   1;
      GUILD_VOICE:          2;
      GROUP_DM:             3;
      GUILD_CATEGORY:       4;
      GUILD_NEWS:           5;

      GUILD_NEWS_THREAD:    10;
      GUILD_PUBLIC_THREAD:  11;
      GUILD_PRIVATE_THREAD: 12;
      GUILD_STAGE_VOICE:    13;
      /** @deprecated */
      GUILD_STAGE:          13;

      GUILD_FORUM:          15;
      GUILD_MEDIA:          16;
    };
    ComponentTypes: {
      ACTION_ROW:  1;
      BUTTON:      2;
      SELECT_MENU: 3;
      TEXT_INPUT:  4;
    };
    ForumLayoutTypes: {
      NOT_SET:      0;
      LIST_VIEW:    1;
      GALLERY_VIEW: 2;
    };
    DefaultMessageNotificationLevels: {
      ALL_MESSAGES:  0;
      ONLY_MENTIONS: 1;
    };
    SortOrderTypes: {
      LATEST_ACTIVITY: 0;
      CREATION_DATE:   1;
    };
    ExplicitContentFilterLevels: {
      DISABLED:              0;
      MEMBERS_WITHOUT_ROLES: 1;
      ALL_MEMBERS:           2;
    };
    GatewayOPCodes: {
      DISPATCH:              0;
      /** @deprecated */
      EVENT:                 0;
      HEARTBEAT:             1;
      IDENTIFY:              2;
      PRESENCE_UPDATE:       3;
      /** @deprecated */
      STATUS_UPDATE:         3;
      VOICE_STATE_UPDATE:    4;
      VOICE_SERVER_PING:     5;
      RESUME:                6;
      RECONNECT:             7;
      REQUEST_GUILD_MEMBERS: 8;
      /** @deprecated */
      GET_GUILD_MEMBERS:     8;
      INVALID_SESSION:       9;
      HELLO:                 10;
      HEARTBEAT_ACK:         11;
    };
    GuildFeatures: [
      "ANIMATED_BANNER",
      "ANIMATED_ICON",
      "APPLICATION_COMMAND_PERMISSIONS_V2",
      "AUTO_MODERATION",
      "BANNER",
      "COMMERCE",
      "COMMUNITY",
      "CREATOR_MONETIZABLE_PROVISIONAL",
      "CREATOR_STORE_PAGE",
      "DEVELOPER_SUPPORT_SERVER",
      "DISCOVERABLE",
      "FEATURABLE",
      "INVITE_SPLASH",
      "INVITES_DISABLED",
      "MEMBER_VERIFICATION_GATE_ENABLED",
      "MONETIZATION_ENABLED",
      "MORE_STICKERS",
      "NEWS",
      "PARTNERED",
      "PREVIEW_ENABLED",
      "PRIVATE_THREADS",
      "ROLE_ICONS",
      "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
      "ROLE_SUBSCRIPTIONS_ENABLED",
      "SEVEN_DAY_THREAD_ARCHIVE",
      "THREE_DAY_THREAD_ARCHIVE",
      "TICKETED_EVENTS_ENABLED",
      "VANITY_URL",
      "VERIFIED",
      "VIP_REGIONS",
      "WELCOME_SCREEN_ENABLED"
    ];
    GuildIntegrationExpireBehavior: {
      REMOVE_ROLE: 0;
      KICK:        1;
    };
    GuildIntegrationTypes: [
      "twitch",
      "youtube",
      "discord",
      "guild_subscription"
    ];
    GuildNSFWLevels: {
      DEFAULT:        0;
      EXPLICIT:       1;
      SAFE:           2;
      AGE_RESTRICTED: 3;
    };
    GuildOnboardingModes: {
      ONBOARDING_DEFAULT:  0;
      ONBOARDING_ADVANCED: 1;
    };
    GuildOnboardingPromptTypes: {
      MULTIPLE_CHOICE: 0;
      DROPDOWN:        1;
    };
    GuildScheduledEventEntityTypes: {
      STAGE_INSTANCE: 1;
      VOICE:          2;
      EXTERNAL:       3;
    };
    GuildScheduledEventPrivacyLevel: {
      PUBLIC:     1;
      GUILD_ONLY: 2;
    };
    GuildScheduledEventStatus: {
      SCHEDULED: 1;
      ACTIVE:	   2;
      COMPLETED: 3;
      CANCELED:  4;
    };
    GuildWidgetStyles: {
      Shield:  "shield";
      Banner1: "banner1";
      Banner2: "banner2";
      Banner3: "banner3";
      Banner4: "banner4";
    };
    ImageFormats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif"
    ];
    ImageSizeBoundaries: {
      MAXIMUM: 4096;
      MINIMUM: 16;
    };
    Intents: {
      guilds:                      1;
      guildMembers:                2;
      guildBans:                   4;
      guildEmojisAndStickers:      8;
      /** @deprecated */
      guildEmojis:                 8;
      guildIntegrations:           16;
      guildWebhooks:               32;
      guildInvites:                64;
      guildVoiceStates:            128;
      guildPresences:              256;
      guildMessages:               512;
      guildMessageReactions:       1024;
      guildMessageTyping:          2048;
      directMessages:              4096;
      directMessageReactions:      8192;
      directMessageTyping:         16384;
      messageContent:              32768;
      guildScheduledEvents:        65536;
      autoModerationConfiguration: 1048576;
      autoModerationExecution:     2097152;
      guildMessagePolls:           16777216;
      directMessagePolls:          33554432;
      allNonPrivileged:            53575421;
      allPrivileged:               33026;
      all:                         53608447;
    };
    InteractionResponseTypes: {
      PONG:                                    1;
      CHANNEL_MESSAGE_WITH_SOURCE:             4;
      DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE:    5;
      DEFERRED_UPDATE_MESSAGE:                 6;
      UPDATE_MESSAGE:                          7;
      APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8;
      MODAL:                                   9;
    };
    InteractionTypes: {
      PING:                             1;
      APPLICATION_COMMAND:              2;
      MESSAGE_COMPONENT:                3;
      APPLICATION_COMMAND_AUTOCOMPLETE: 4;
      MODAL_SUBMIT:                     5;
    };
    InviteTargetTypes: {
      STREAM:               1;
      EMBEDDED_APPLICATION: 2;
    };
    Locales: {
      BULGARIAN:            "bg";
      CZECH:                "cs";
      DANISH:               "da";
      GERMAN:               "de";
      GREEK:                "el";
      ENGLISH_UK:           "en-GB";
      ENGLISH_US:           "en-US";
      SPANISH:              "es-ES";
      FINNISH:              "fi";
      FRENCH:               "fr";
      HINDI:                "hi";
      CROATIAN:             "hr";
      HUNGARIAN:            "hu";
      INDONESIAN:           "id";
      ITALIAN:              "it";
      JAPANESE:             "ja";
      KOREAN:               "ko";
      LITHUANIAN:           "lt";
      DUTCH:                "nl";
      NORWEGIAN:            "no";
      POLISH:               "pl";
      PORTUGUESE_BRAZILIAN: "pt-BR";
      ROMANIAN_ROMANIA:     "ro";
      RUSSIAN:              "ru";
      SWEDISH:              "sv-SE";
      THAI:                 "th";
      TURKISH:              "tr";
      UKRAINIAN:            "uk";
      VIETNAMESE:           "vi";
      CHINESE_CHINA:        "zh-CN";
      CHINESE_TAIWAN:       "zh-TW";
    };
    MemberFlags: {
      DID_REJOIN:            1;
      COMPLETED_ONBOARDING:  2;
      BYPASSES_VERIFICATION: 4;
      STARTED_ONBOARDING:    8;
    };
    MessageActivityTypes: {
      JOIN:         1;
      SPECTATE:     2;
      LISTEN:       3;
      WATCH:        4;
      JOIN_REQUEST: 5;
    };
    MembershipState: {
      INVITED:  1;
      ACCEPTED: 2;
    };
    MessageFlags: {
      CROSSPOSTED:                            1;
      IS_CROSSPOST:                           2;
      SUPPRESS_EMBEDS:                        4;
      SOURCE_MESSAGE_DELETED:                 8;
      URGENT:                                 16;
      HAS_THREAD:                             32;
      EPHEMERAL:                              64;
      LOADING:                                128;
      FAILED_TO_MENTION_SOME_ROLES_IN_THREAD: 256;
      SUPPRESS_NOTIFICATIONS:                 4096;
      IS_VOICE_MESSAGE:                       8192;
    };
    MessageTypes: {
      DEFAULT:                                      0;
      RECIPIENT_ADD:                                1;
      RECIPIENT_REMOVE:                             2;
      CALL:                                         3;
      CHANNEL_NAME_CHANGE:                          4;
      CHANNEL_ICON_CHANGE:                          5;
      CHANNEL_PINNED_MESSAGE:                       6;
      GUILD_MEMBER_JOIN:                            7;
      USER_PREMIUM_GUILD_SUBSCRIPTION:              8;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1:       9;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2:       10;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3:       11;
      CHANNEL_FOLLOW_ADD:                           12;

      GUILD_DISCOVERY_DISQUALIFIED:                 14;
      GUILD_DISCOVERY_REQUALIFIED:                  15;
      GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING: 16;
      GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING:   17;
      THREAD_CREATED:                               18;
      REPLY:                                        19;
      CHAT_INPUT_COMMAND:                           20;
      THREAD_STARTER_MESSAGE:                       21;
      GUILD_INVITE_REMINDER:                        22;
      CONTEXT_MENU_COMMAND:                         23;
      AUTO_MODERATION_ACTION:                       24;
      ROLE_SUBSCRIPTION_PURCHASE:                   25;
      INTERACTION_PREMIUM_UPSELL:                   26;
      STAGE_START:                                  27;
      STAGE_END:                                    28;
      STAGE_SPEAKER:                                29;

      STAGE_TOPIC:                                  31;
      GUILD_APPLICATION_PREMIUM_SUBSCRIPTION:       32;
    };
    MFALevels: {
      NONE:     0;
      ELEVATED: 1;
    };
    OAuthTeamMemberRoleTypes: {
      ADMIN:     "admin";
      DEVELOPER: "developer";
      OWNER:     "";
      READ_ONLY: "read_only";
    };
    PermissionOverwriteTypes: {
      ROLE: 0;
      USER: 1;
    };
    Permissions: {
      createInstantInvite:              1n;
      kickMembers:                      2n;
      banMembers:                       4n;
      administrator:                    8n;
      manageChannels:                   16n;
      manageGuild:                      32n;
      addReactions:                     64n;
      viewAuditLog:                     128n;
      /** @deprecated */
      viewAuditLogs:                    128n;
      prioritySpeaker:                  256n;
      /** @deprecated */
      voicePrioritySpeaker:             256n;
      stream:                           512n;
      /** @deprecated */
      voiceStream:                      512n;
      viewChannel:                      1024n;
      /** @deprecated */
      readMessages:                     1024n;
      sendMessages:                     2048n;
      sendTTSMessages:                  4096n;
      manageMessages:                   8192n;
      embedLinks:                       16384n;
      attachFiles:                      32768n;
      readMessageHistory:               65536n;
      mentionEveryone:                  131072n;
      useExternalEmojis:                262144n;
      /** @deprecated */
      externalEmojis:                   262144n;
      viewGuildInsights:                524288n;
      connect:                          1048576n;
      /** @deprecated */
      voiceConnect:                     1048576n;
      speak:                            2097152n;
      /** @deprecated */
      voiceSpeak:                       2097152n;
      muteMembers:                      4194304n;
      /** @deprecated */
      voiceMuteMembers:                 4194304n;
      deafenMembers:                    8388608n;
      /** @deprecated */
      voiceDeafenMembers:               8388608n;
      moveMembers:                      16777216n;
      /** @deprecated */
      voiceMoveMembers:                 16777216n;
      useVAD:                           33554432n;
      /** @deprecated */
      voiceUseVAD:                      33554432n;
      /** @deprecated */
      changeNickname:                   67108864n;
      manageNicknames:                  134217728n;
      manageRoles:                      268435456n;
      manageWebhooks:                   536870912n;
      manageGuildExpressions:           1073741824n;
      /** @deprecated */
      manageExpressions:                1073741824n;
      /** @deprecated */
      manageEmojisAndStickers:          1073741824n;
      /** @deprecated */
      manageEmojis:                     1073741824n;
      useApplicationCommands:           2147483648n;
      /** @deprecated */
      useSlashCommands:                 2147483648n;
      requestToSpeak:                   4294967296n;
      /** @deprecated */
      voiceRequestToSpeak:              4294967296n;
      manageEvents:                     8589934592n;
      manageThreads:                    17179869184n;
      createPublicThreads:              34359738368n;
      createPrivateThreads:             68719476736n;
      useExternalStickers:              137438953472n;
      sendMessagesInThreads:            274877906944n;
      useEmbeddedActivities:            549755813888n;
      /** @deprecated */
      startEmbeddedActivities:          549755813888n;
      moderateMembers:                  1099511627776n;
      viewCreatorMonetizationAnalytics: 2199023255552n;
      useSoundboard:                    4398046511104n;
      createGuildExpressions:           8796093022208n;
      createEvents:                     17592186044416n;
      useExternalSounds:                35184372088832n;
      sendVoiceMessages:                70368744177664n;
      setVoiceChannelStatus:            281474976710656n;
      sendPolls:                        562949953421312n;
      allGuild:                         29697484783806n;
      allText:                          633854226857041n;
      allVoice:                         954930478188305n;
      all:                              985162418487295n;
    };
    PollLayoutTypes: {
      DEFAULT: 1;
    };
    PremiumTiers: {
      NONE:   0;
      TIER_1: 1;
      TIER_2: 2;
      TIER_3: 3;
    };
    PremiumTypes: {
      NONE:          0;
      NITRO_CLASSIC: 1;
      NITRO:         2;
    };
    RoleConnectionMetadataTypes: {
      INTEGER_LESS_THAN_OR_EQUAL:     1;
      INTEGER_GREATER_THAN_OR_EQUAL:  2;
      INTEGER_EQUAL:                  3;
      INTEGER_NOT_EQUAL:              4;
      DATETIME_LESS_THAN_OR_EQUAL:    5;
      DATETIME_GREATER_THAN_OR_EQUAL: 6;
      BOOLEAN_EQUAL:                  7;
      BOOLEAN_NOT_EQUAL:              8;
    };
    RoleFlags: {
      IN_PROMPT: 1;
    };
    ReactionTypes: {
      NORMAL: 0;
      BURST:  1;
    };
    StageInstancePrivacyLevel: {
      PUBLIC:     1;
      GUILD_ONLY: 2;
    };
    StickerFormats: {
      PNG:    1;
      APNG:   2;
      LOTTIE: 3;
      GIF:    4;
    };
    StickerTypes: {
      STANDARD: 1;
      GUILD:    2;
    };
    SystemChannelFlags: {
      SUPPRESS_JOIN_NOTIFICATIONS:                              1;
      SUPPRESS_PREMIUM_SUBSCRIPTIONS:                           2;
      SUPPRESS_GUILD_REMINDER_NOTIFICATIONS:                    4;
      SUPPRESS_JOIN_NOTIFICATION_REPLIES:                       8;
      SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS:        16;
      SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES: 32;
    };
    SystemJoinMessages: [
      "%user% joined the party.",
      "%user% is here.",
      "Welcome, %user%. We hope you brought pizza.",
      "A wild %user% appeared.",
      "%user% just landed.",
      "%user% just slid into the server.",
      "%user% just showed up!",
      "Welcome %user%. Say hi!",
      "%user% hopped into the server.",
      "Everyone welcome %user%!",
      "Glad you're here, %user%.",
      "Good to see you, %user%.",
      "Yay you made it, %user%!"
    ];
    ThreadMemberFlags: {
      HAS_INTERACTED: 1;
      ALL_MESSAGES:   2;
      ONLY_MENTIONS:  4;
      NO_MESSAGES:    8;
    };
    TextInputStyles: {
      SHORT:     1;
      PARAGRAPH: 2;
    };
    UserFlags: {
      NONE:                         0;
      DISCORD_STAFF:                1;
      DISCORD_EMPLOYEE:             1;
      PARTNER:                      2;
      PARTNERED_SERVER_OWNER:       2;
      /** @deprecated */
      DISCORD_PARTNER:              2;
      HYPESQUAD:                    4;
      HYPESQUAD_EVENTS:             4;
      BUG_HUNTER_LEVEL_1:           8;
      HYPESQUAD_ONLINE_HOUSE_1:     64;
      HOUSE_BRAVERY:                64;
      HYPESQUAD_ONLINE_HOUSE_2:     128;
      HOUSE_BRILLIANCE:             128;
      HYPESQUAD_ONLINE_HOUSE_3:     256;
      HOUSE_BALANCE:                256;
      PREMIUM_EARLY_SUPPORTER:      512;
      EARLY_SUPPORTER:              512;
      TEAM_PSEUDO_USER:             1024;
      TEAM_USER:                    1024;
      SYSTEM:                       4096;
      BUG_HUNTER_LEVEL_2:           16384;
      VERIFIED_BOT:                 65536;
      VERIFIED_DEVELOPER:           131072;
      VERIFIED_BOT_DEVELOPER:       131072;
      EARLY_VERIFIED_BOT_DEVELOPER: 131072;
      CERTIFIED_MODERATOR:          262144;
      DISCORD_CERTIFIED_MODERATOR:  262144;
      BOT_HTTP_INTERACTIONS:        524288;
      SPAMMER:                      1048576;
      ACTIVE_DEVELOPER:             4194304;
    };
    VerificationLevels: {
      NONE:      0;
      LOW:       1;
      MEDIUM:    2;
      HIGH:      3;
      VERY_HIGH: 4;
    };
    VideoQualityModes: {
      AUTO: 1;
      FULL: 2;
    };
    VoiceOPCodes: {
      IDENTIFY:            0;
      SELECT_PROTOCOL:     1;
      READY:               2;
      HEARTBEAT:           3;
      SESSION_DESCRIPTION: 4;
      SPEAKING:            5;
      HEARTBEAT_ACK:       6;
      RESUME:              7;
      HELLO:               8;
      RESUMED:             9;
      CLIENT_DISCONNECT:   13;
      /** @deprecated */
      DISCONNECT:          13;
    };
    WebhookTypes: {
      INCOMING:         1;
      CHANNEL_FOLLOWER: 2;
      APPLICATION:      3;
    };
  }
  interface OAuthApplicationInfo {
    bot?: PartialUser;
    bot_public: boolean;
    bot_require_code_grant: boolean;
    description: string;
    icon: string | null;
    id: string;
    name: string;
    owner: PartialUser;
    privacy_policy_url?: string;
    role_connections_verification_url?: string;
    rpc_origins?: string[];
    /** @deprecated */
    summary: "";
    team: OAuthTeamInfo | null;
    terms_of_service_url?: string;
    verify_key: string;
  }
  interface OAuthTeamInfo {
    icon: string | null;
    id: string;
    members: OAuthTeamMember[];
    name: string;
    owner_user_id: string;
  }
  interface OAuthTeamMember {
    membership_state: MembershipStates;
    role: OAuthTeamMemberRoleTypes;
    team_id: string;
    user: PartialUser;
  }

  // Classes
  /** Generic T is `true` if a Guild scoped command, and `false` if not */
  export class ApplicationCommand<T extends boolean, U = ApplicationCommandTypes> extends Base {
    applicationID: string;
    defaultMemberPermissions: Permission;
    /** @deprecated */
    defaultPermission?: boolean | null;
    description: U extends Constants["ApplicationCommandTypes"]["CHAT_INPUT"] ? string : "";
    descriptionLocalizations?: U extends "CHAT_INPUT" ? Record<LocaleStrings, string> | null : null;
    dmPermission?: boolean;
    guild: T extends true ? PossiblyUncachedGuild : never;
    name: string;
    nameLocalizations?: Record<LocaleStrings, string> | null;
    nsfw?: boolean;
    options?: ApplicationCommandOptions[];
    type?: U;
    version: string;
    delete(): Promise<void>;
    edit(options: ApplicationCommandEditOptions<T, U>): Promise<ApplicationCommand<T, U>>;
  }

  class Base implements SimpleJSON {
    createdAt: number;
    id: string;
    constructor(id: string);
    static getCreatedAt(id: string): number;
    static getDiscordEpoch(id: string): number;
    inspect(): this;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }

  export class BrowserWebSocket extends EventEmitter {
    static CONNECTING: 0;
    static OPEN: 1;
    static CLOSING: 2;
    static CLOSED: 3;
    readyState: number;
    constructor(url: string);
    close(code?: number, reason?: string): void;
    removeEventListener(event: string | symbol, listener: (...args: any[]) => void): this;
    // @ts-ignore: DOM
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    terminate(): void;
  }

  export class BrowserWebSocketError extends Error {
    // @ts-ignore: DOM
    event: Event;
    // @ts-ignore: DOM
    constructor(message: string, event: Event);
  }

  export class Bucket {
    interval: number;
    lastReset: number;
    lastSend: number;
    tokenLimit: number;
    tokens: number;
    constructor(tokenLimit: number, interval: number, options: { latencyRef: { latency: number }; reservedTokens: number });
    check(): void;
    queue(func: () => void, priority?: boolean): void;
  }

  export class CategoryChannel extends GuildChannel implements Permissionable {
    channels: Collection<Exclude<AnyGuildChannel, CategoryChannel>>;
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    type: Constants["ChannelTypes"]["GUILD_CATEGORY"];
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    edit(options: EditChannelOptionsBase, reason?: string): Promise<this>;
    editPermission(overwriteID: string, allow: PermissionValueTypes, deny: PermissionValueTypes, type: PermissionType, reason?: string): Promise<PermissionOverwrite>;
  }

  export class Channel extends Base {
    mention: string;
    type: ChannelTypes;
    constructor(data: BaseData, client: Client);
    static from(data: BaseData, client: Client): AnyChannel;
  }

  export class Client extends EventEmitter {
    application?: { id: string; flags: number };
    bot: boolean;
    channelGuildMap: { [s: string]: string };
    dmChannelMap: { [s: string]: string };
    dmChannels: Collection<DMChannel>;
    gatewayURL?: string;
    guilds: Collection<Guild>;
    guildShardMap: { [s: string]: number };
    lastConnect: number;
    lastReconnectDelay: number;
    options: ClientOptions;
    presence: ClientPresence;
    privateChannelMap: { [s: string]: string };
    privateChannels: Collection<DMChannel>;
    ready: boolean;
    reconnectAttempts: number;
    requestHandler: RequestHandler;
    shards: ShardManager;
    startTime: number;
    threadGuildMap: { [s: string]: string };
    unavailableGuilds: Collection<UnavailableGuild>;
    uptime: number;
    user: ExtendedUser;
    users: Collection<User>;
    voiceConnections: VoiceConnectionManager;
    constructor(token: string, options?: ClientOptions);
    addGroupRecipient(groupID: string, userID: string): Promise<void>;
    addGuildDiscoverySubcategory(guildID: string, categoryID: string, reason?: string): Promise<DiscoverySubcategoryResponse>;
    addGuildMember(guildID: string, userID: string, accessToken: string, options?: AddGuildMemberOptions): Promise<void>;
    addGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    addMessageReaction(channelID: string, messageID: string, reaction: string): Promise<void>;
    banGuildMember(guildID: string, userID: string, options?: BanMemberOptions): Promise<void>;
    /** @deprecated */
    banGuildMember(guildID: string, userID: string, deleteMessageDays?: number, reason?: string): Promise<void>;
    bulkEditCommands(commands: ApplicationCommandBulkEditOptions<false>[]): Promise<ApplicationCommand<false>[]>;
    bulkEditGuildCommands(guildID: string, commands: ApplicationCommandBulkEditOptions<true>[]): Promise<ApplicationCommand<true>[]>;
    closeVoiceConnection(guildID: string): void;
    connect(): Promise<void>;
    createAutoModerationRule(guildID: string, rule: CreateAutoModerationRuleOptions): Promise<AutoModerationRule>;
    createChannel(guildID: string, name: string): Promise<TextChannel>;
    createChannel<T extends GuildChannelTypes>(guildID: string, name: string, type: T, options?: CreateChannelOptions): Promise<ChannelTypeConversion<T>>;
    /** @deprecated */
    createChannel<T extends GuildChannelTypes>(guildID: string, name: string, type: T, options?: CreateChannelOptions | string): Promise<ChannelTypeConversion<T>>;
    createChannelInvite(
      channelID: string,
      options?: CreateChannelInviteOptions,
      reason?: string
    ): Promise<Invite<"withoutCount">>;
    createChannelWebhook(
      channelID: string,
      options: WebhookCreateOptions,
      reason?: string
    ): Promise<Webhook>;
    createCommand<T extends ApplicationCommandTypes>(command: ApplicationCommandCreateOptions<false, T>): Promise<ApplicationCommand<false, T>>;
    createGroupChannel(userIDs: string[]): Promise<GroupChannel>;
    createGuild(name: string, options?: CreateGuildOptions): Promise<Guild>;
    createGuildCommand<T extends ApplicationCommandTypes>(guildID: string, command: ApplicationCommandCreateOptions<true, T>): Promise<ApplicationCommand<true, T>>;
    createGuildEmoji(guildID: string, options: EmojiOptions, reason?: string): Promise<Emoji>;
    createGuildFromTemplate(code: string, name: string, icon?: string): Promise<Guild>;
    createGuildScheduledEvent<T extends GuildScheduledEventEntityTypes>(guildID: string, event: GuildScheduledEventOptions<T>, reason?: string): Promise<GuildScheduledEvent<T>>;
    createGuildSticker(guildID: string, options: CreateStickerOptions, reason?: string): Promise<Sticker>;
    createGuildTemplate(guildID: string, name: string, description?: string | null): Promise<GuildTemplate>;
    createInteractionResponse(interactionID: string, interactionToken: string, options: InteractionOptions, file?: FileContent | FileContent[]): Promise<void>;
    createMessage(channelID: string, content: MessageContent, file?: FileContent | FileContent[]): Promise<Message>;
    createRole(guildID: string, options?: Role | RoleOptions, reason?: string): Promise<Role>;
    createStageInstance(channelID: string, options: StageInstanceOptions): Promise<StageInstance>;
    createThread(channelID: string, options: CreateForumThreadOptions, file?: FileContent | FileContent[]): Promise<PublicThreadChannel<true>>;
    createThread(channelID: string, options: CreateThreadWithoutMessageOptions, file?: FileContent | FileContent[]): Promise<NewsThreadChannel | PrivateThreadChannel | PublicThreadChannel>;
    createThreadWithMessage(channelID: string, messageID: string, options: CreateThreadOptions): Promise<NewsThreadChannel | PublicThreadChannel>;
    /** @deprecated */
    createThreadWithoutMessage(channelID: string, options: CreateThreadWithoutMessageOptions): Promise<NewsThreadChannel | PrivateThreadChannel | PublicThreadChannel>;
    crosspostMessage(channelID: string, messageID: string): Promise<Message>;
    deleteAutoModerationRule(guildID: string, ruleID: string, reason?: string): Promise<void>;
    deleteChannel(channelID: string, reason?: string): Promise<void>;
    deleteChannelPermission(channelID: string, overwriteID: string, reason?: string): Promise<void>;
    deleteCommand(commandID: string): Promise<void>;
    deleteGuild(guildID: string): Promise<void>;
    deleteGuildCommand(guildID: string, commandID: string): Promise<void>;
    deleteGuildDiscoverySubcategory(guildID: string, categoryID: string, reason?: string): Promise<void>;
    deleteGuildEmoji(guildID: string, emojiID: string, reason?: string): Promise<void>;
    deleteGuildIntegration(guildID: string, integrationID: string): Promise<void>;
    deleteGuildScheduledEvent(guildID: string, eventID: string): Promise<void>;
    deleteGuildSticker(guildID: string, stickerID: string, reason?: string): Promise<void>;
    deleteGuildTemplate(guildID: string, code: string): Promise<GuildTemplate>;
    deleteInvite(inviteID: string, reason?: string): Promise<void>;
    deleteMessage(channelID: string, messageID: string, reason?: string): Promise<void>;
    deleteMessages(channelID: string, messageIDs: string[], reason?: string): Promise<void>;
    deleteRole(guildID: string, roleID: string, reason?: string): Promise<void>;
    deleteStageInstance(channelID: string): Promise<void>;
    deleteWebhook(webhookID: string, token?: string, reason?: string): Promise<void>;
    deleteWebhookMessage(webhookID: string, token: string, messageID: string): Promise<void>;
    disconnect(options: { reconnect?: boolean | "auto" }): void;
    editAFK(afk: boolean): void;
    editAutoModerationRule(guildID: string, ruleID: string, options: EditAutoModerationRuleOptions): Promise<AutoModerationRule>;
    editChannel(
      channelID: string,
      options: EditGuildChannelOptions | EditGroupChannelOptions,
      reason?: string
    ): Promise<GroupChannel | AnyGuildChannel>;
    editChannelPermission(
      channelID: string,
      overwriteID: string,
      allow: bigint | number,
      deny: bigint | number,
      type: PermissionType,
      reason?: string
    ): Promise<void>;
    editChannelPosition(channelID: string, position: number, options?: EditChannelPositionOptions): Promise<void>;
    editChannelPositions(guildID: string, channelPositions: ChannelPosition[]): Promise<void>;
    editCommand<T extends ApplicationCommandTypes>(commandID: string, command: ApplicationCommandEditOptions<false, T>): Promise<ApplicationCommand<false, T>>;
    editCommandPermissions(guildID: string, commandID: string, permissions: ApplicationCommandPermissions[], reason?: string): Promise<GuildApplicationCommandPermissions>;
    editGuild(guildID: string, options: GuildOptions, reason?: string): Promise<Guild>;
    editGuildCommand<T extends ApplicationCommandTypes>(guildID: string, commandID: string, command: ApplicationCommandEditOptions<true, T>): Promise<ApplicationCommand<true, T>>;
    editGuildDiscovery(guildID: string, options?: DiscoveryOptions): Promise<DiscoveryMetadata>;
    editGuildEmoji(
      guildID: string,
      emojiID: string,
      options: { name?: string; roles?: string[] },
      reason?: string
    ): Promise<Emoji>;
    editGuildMember(guildID: string, memberID: string, options: MemberOptions, reason?: string): Promise<Member>;
    editGuildMFALevel(guildID: string, level: MFALevel, reason?: string): Promise<MFALevelResponse>;
    editGuildOnboarding(guildID: string, options: GuildOnboardingOptions, reason?: string): Promise<GuildOnboarding>;
    editGuildScheduledEvent<T extends GuildScheduledEventEntityTypes>(guildID: string, eventID: string, event: GuildScheduledEventEditOptions<T>, reason?: string): Promise<GuildScheduledEvent<T>>;
    editGuildSticker(guildID: string, stickerID: string, options?: EditStickerOptions, reason?: string): Promise<Sticker>;
    editGuildTemplate(guildID: string, code: string, options: GuildTemplateOptions): Promise<GuildTemplate>;
    editGuildVanity(guildID: string, code: string | null): Promise<GuildVanity>;
    editGuildVoiceState(guildID: string, options: VoiceStateOptions, userID?: string): Promise<void>;
    editGuildWelcomeScreen(guildID: string, options: WelcomeScreenOptions): Promise<WelcomeScreen>;
    editGuildWidget(guildID: string, options: WidgetOptions): Promise<Widget>;
    editMessage(channelID: string, messageID: string, content: MessageContentEdit): Promise<Message>;
    /** @deprecated */
    editNickname(guildID: string, nick: string, reason?: string): Promise<void>;
    editRole(guildID: string, roleID: string, options: RoleOptions, reason?: string): Promise<Role>; // TODO not all options are available?
    editRoleConnectionMetadataRecords(data: ApplicationRoleConnectionMetadata[]): Promise<ApplicationRoleConnectionMetadata[]>;
    editRolePosition(guildID: string, roleID: string, position: number): Promise<void>;
    editSelf(options: { avatar?: string; username?: string }): Promise<ExtendedUser>;
    editStageInstance(channelID: string, options: StageInstanceOptions): Promise<StageInstance>;
    editStatus(status: SelfStatus, activities?: ActivityPartial<ActivityType>[] | ActivityPartial<ActivityType>): void;
    editStatus(activities?: ActivityPartial<ActivityType>[] | ActivityPartial<ActivityType>): void;
    editWebhook(
      webhookID: string,
      options: WebhookEditOptions,
      token?: string,
      reason?: string
    ): Promise<Webhook>;
    editWebhookMessage(
      webhookID: string,
      token: string,
      messageID: string,
      options: WebhookPayloadEdit
    ): Promise<Message<AnyGuildTextableChannel>>;
    emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
    endPoll(channelID: string, messageID: string): Promise<Message<AnyGuildTextableChannel>>;
    executeSlackWebhook(webhookID: string, token: string, options: Record<string, unknown> & { auth?: boolean; threadID?: string }): Promise<void>;
    executeSlackWebhook(webhookID: string, token: string, options: Record<string, unknown> & { auth?: boolean; threadID?: string; wait: true }): Promise<Message<AnyGuildTextableChannel>>;
    executeWebhook(webhookID: string, token: string, options: WebhookPayload & { wait: true }): Promise<Message<AnyGuildTextableChannel>>;
    executeWebhook(webhookID: string, token: string, options: WebhookPayload): Promise<void>;
    followChannel(channelID: string, webhookChannelID: string): Promise<ChannelFollow>;
    getActiveGuildThreads(guildID: string): Promise<ListedGuildThreads>;
    getArchivedThreads(channelID: string, type: "private", options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PrivateThreadChannel>>;
    getArchivedThreads(channelID: string, type: "public", options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PublicThreadChannel<boolean>>>;
    getAutoModerationRule(guildID: string, ruleID: string): Promise<AutoModerationRule>;
    getAutoModerationRules(guildID: string): Promise<AutoModerationRule[]>;
    getBotGateway(): Promise<{ session_start_limit: { max_concurrency: number; remaining: number; reset_after: number; total: number }; shards: number; url: string }>;
    getChannel(channelID: string): Exclude<AnyChannel, GroupChannel>;
    getChannelInvites(channelID: string): Promise<Invite[]>;
    getChannelWebhooks(channelID: string): Promise<Webhook[]>;
    getCommand(commandID: string): Promise<ApplicationCommand<false>>;
    getCommandPermissions(guildID: string, commandID: string): Promise<GuildApplicationCommandPermissions>;
    getCommands(): Promise<ApplicationCommand<false>[]>;
    getDiscoveryCategories(): Promise<DiscoveryCategory[]>;
    getDMChannel(userID: string): Promise<DMChannel>;
    getEmojiGuild(emojiID: string): Promise<Guild>;
    getGateway(): Promise<{ url: string }>;
    getGuildAuditLog(guildID: string, options?: GetGuildAuditLogOptions): Promise<GuildAuditLog>;
    /** @deprecated */
    getGuildAuditLogs(guildID: string, limit?: number, before?: string, actionType?: number, userID?: string): Promise<GuildAuditLog>;
    getGuildBan(guildID: string, userID: string): Promise<GuildBan>;
    getGuildBans(guildID: string, options?: GetGuildBansOptions): Promise<GuildBan[]>;
    getGuildCommand(guildID: string, commandID: string): Promise<ApplicationCommand<true>>;
    getGuildCommandPermissions(guildID: string): Promise<GuildApplicationCommandPermissions[]>;
    getGuildCommands(guildID: string): Promise<ApplicationCommand<true>[]>;
    getGuildDiscovery(guildID: string): Promise<DiscoveryMetadata>;
    /** @deprecated */
    getGuildEmbed(guildID: string): Promise<Widget>;
    getGuildIntegrations(guildID: string): Promise<GuildIntegration[]>;
    getGuildInvites(guildID: string): Promise<Invite[]>;
    getGuildOnboarding(guildID: string): Promise<GuildOnboarding>;
    getGuildPreview(guildID: string): Promise<GuildPreview>;
    getGuildScheduledEvents(guildID: string, options?: GetGuildScheduledEventOptions): Promise<GuildScheduledEvent[]>;
    getGuildScheduledEventUsers(guildID: string, eventID: string, options?: GetGuildScheduledEventUsersOptions): Promise<GuildScheduledEventUser[]>;
    getGuildTemplate(code: string): Promise<GuildTemplate>;
    getGuildTemplates(guildID: string): Promise<GuildTemplate[]>;
    getGuildVanity(guildID: string): Promise<GuildVanity>;
    getGuildWebhooks(guildID: string): Promise<Webhook[]>;
    getGuildWelcomeScreen(guildID: string): Promise<WelcomeScreen>;
    getGuildWidget(guildID: string): Promise<WidgetData>;
    getGuildWidgetImageURL(guildID: string, style?: GuildWidgetStyles): string;
    getGuildWidgetSettings(guildID: string): Promise<Widget>;
    getInvite(inviteID: string, withCounts?: false, withExpiration?: boolean, guildScheduledEventID?: string): Promise<Invite<"withoutCount">>;
    getInvite(inviteID: string, withCounts: true, withExpiration?: boolean, guildScheduledEventID?: string): Promise<Invite<"withCount">>;
    getJoinedPrivateArchivedThreads(channelID: string, options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PrivateThreadChannel>>;
    getMessage(channelID: string, messageID: string): Promise<Message>;
    getMessageReaction(channelID: string, messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getMessageReaction(channelID: string, messageID: string, reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    getMessages(channelID: string, options?: GetMessagesOptions): Promise<Message[]>;
    /** @deprecated */
    getMessages(channelID: string, limit?: number, before?: string, after?: string, around?: string): Promise<Message[]>;
    getNitroStickerPacks(): Promise<{ sticker_packs: StickerPack[] }>;
    getOAuthApplication(): Promise<OAuthApplicationInfo>;
    getPins(channelID: string): Promise<Message[]>;
    getPollAnswerVoters(channelID: string, messageID: string, answerID: string, options?: GetPollAnswerVotersOptions): Promise<User[]>;
    getPruneCount(guildID: string, options?: GetPruneOptions): Promise<number>;
    getRESTChannel(channelID: string): Promise<AnyChannel>;
    getRESTGuild(guildID: string, withCounts?: boolean): Promise<Guild>;
    getRESTGuildChannels(guildID: string): Promise<AnyGuildChannel[]>;
    getRESTGuildEmoji(guildID: string, emojiID: string): Promise<Emoji>;
    getRESTGuildEmojis(guildID: string): Promise<Emoji[]>;
    getRESTGuildMember(guildID: string, memberID: string): Promise<Member>;
    getRESTGuildMembers(guildID: string, options?: GetRESTGuildMembersOptions): Promise<Member[]>;
    /** @deprecated */
    getRESTGuildMembers(guildID: string, limit?: number, after?: string): Promise<Member[]>;
    getRESTGuildRoles(guildID: string): Promise<Role[]>;
    getRESTGuilds(options?: GetRESTGuildsOptions): Promise<Guild[]>;
    /** @deprecated */
    getRESTGuilds(limit?: number, before?: string, after?: string): Promise<Guild[]>;
    getRESTGuildScheduledEvent(guildID: string, eventID: string, options?: GetGuildScheduledEventOptions): Promise<GuildScheduledEvent>;
    getRESTGuildSticker(guildID: string, stickerID: string): Promise<Sticker>;
    getRESTGuildStickers(guildID: string): Promise<Sticker[]>;
    getRESTSticker(stickerID: string): Promise<Sticker>;
    getRESTUser(userID: string): Promise<User>;
    getRoleConnectionMetadataRecords(): Promise<ApplicationRoleConnectionMetadata[]>;
    getSelf(): Promise<ExtendedUser>;
    getStageInstance(channelID: string): Promise<StageInstance>;
    getThreadMember(channelID: string, userID: string, withMember?: boolean): Promise<ThreadMember>;
    getThreadMembers(channelID: string, options?: GetThreadMembersOptions): Promise<ThreadMember[]>;
    getVoiceRegions(guildID?: string): Promise<VoiceRegion[]>;
    getWebhook(webhookID: string, token?: string): Promise<Webhook>;
    getWebhookMessage(webhookID: string, token: string, messageID: string): Promise<Message<AnyGuildTextableChannel>>;
    joinThread(channelID: string, userID?: string): Promise<void>;
    joinVoiceChannel(channelID: string, options?: JoinVoiceChannelOptions): Promise<VoiceConnection>;
    kickGuildMember(guildID: string, userID: string, reason?: string): Promise<void>;
    leaveGuild(guildID: string): Promise<void>;
    leaveThread(channelID: string, userID?: string): Promise<void>;
    leaveVoiceChannel(channelID: string): void;
    off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    pinMessage(channelID: string, messageID: string): Promise<void>;
    pruneMembers(guildID: string, options?: PruneMemberOptions): Promise<number>;
    purgeChannel(channelID: string, options: PurgeChannelOptions): Promise<number>;
    /** @deprecated */
    purgeChannel(
      channelID: string,
      limit?: number,
      filter?: (m: Message<AnyGuildTextableChannel>) => boolean,
      before?: string,
      after?: string,
      reason?: string
    ): Promise<number>;
    removeGroupRecipient(groupID: string, userID: string): Promise<void>;
    removeGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    removeMessageReaction(channelID: string, messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReactionEmoji(channelID: string, messageID: string, reaction: string): Promise<void>;
    removeMessageReactions(channelID: string, messageID: string): Promise<void>;
    searchGuildMembers(guildID: string, query: string, limit?: number): Promise<Member[]>;
    sendChannelTyping(channelID: string): Promise<void>;
    setVoiceChannelStatus(channelID: string, status: string, reason?: string): Promise<void>;
    syncGuildIntegration(guildID: string, integrationID: string): Promise<void>;
    syncGuildTemplate(guildID: string, code: string): Promise<GuildTemplate>;
    unbanGuildMember(guildID: string, userID: string, reason?: string): Promise<void>;
    unpinMessage(channelID: string, messageID: string): Promise<void>;
    validateDiscoverySearchTerm(term: string): Promise<{ valid: boolean }>;
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    toString(): string;
  }

  export class Collection<T extends { id: string | number }> extends Map<string | number, T> {
    baseObject: new (...args: any[]) => T;
    limit?: number;
    constructor(baseObject: new (...args: any[]) => T, limit?: number);
    add(obj: T, extra?: unknown, replace?: boolean): T;
    every(func: (i: T) => boolean): boolean;
    filter(func: (i: T) => boolean): T[];
    find(func: (i: T) => boolean): T | undefined;
    map<R>(func: (i: T) => R): R[];
    random(): T | undefined;
    reduce<U>(func: (accumulator: U, val: T) => U, initialValue?: U): U;
    remove(obj: T | Uncached): T | null;
    some(func: (i: T) => boolean): boolean;
    update(obj: T, extra?: unknown, replace?: boolean): T;
  }

  export class Command implements CommandOptions, SimpleJSON {
    aliases: string[];
    argsRequired: boolean;
    caseInsensitive: boolean;
    cooldown: number;
    cooldownExclusions: CommandCooldownExclusions;
    cooldownMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    cooldownReturns: number;
    defaultSubcommandOptions: CommandOptions;
    deleteCommand: boolean;
    description: string;
    dmOnly: boolean;
    errorMessage: MessageContent | GenericCheckFunction<MessageContent>;
    fullDescription: string;
    fullLabel: string;
    guildOnly: boolean;
    hidden: boolean;
    hooks: Hooks;
    invalidUsageMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    label: string;
    parentCommand?: Command;
    permissionMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    reactionButtons: null | CommandReactionButtons[];
    reactionButtonTimeout: number;
    requirements: CommandRequirements;
    restartCooldown: boolean;
    subcommandAliases: { [alias: string]: string };
    subcommands: { [s: string]: Command };
    usage: string;
    constructor(label: string, generate: CommandGenerator, options?: CommandOptions);
    cooldownCheck(msg: Message): boolean;
    cooldownExclusionCheck(msg: Message): boolean;
    executeCommand(msg: Message, args: string[]): Promise<GeneratorFunctionReturn>;
    permissionCheck(msg: Message): Promise<boolean>;
    process(args: string[], msg: Message): Promise<void | GeneratorFunctionReturn>;
    registerSubcommand(label: string, generator: CommandGenerator, options?: CommandOptions): Command;
    registerSubcommandAlias(alias: string, label: string): void;
    unregisterSubcommand(label: string): void;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }

  export class CommandClient extends Client {
    activeMessages: { [s: string]: ActiveMessages };
    commandAliases: { [s: string]: string };
    commandOptions: CommandClientOptions;
    commands: { [s: string]: Command };
    guildPrefixes: { [s: string]: string | string[] };
    preReady?: true;
    constructor(token: string, options: ClientOptions, commandOptions?: CommandClientOptions);
    checkPrefix(msg: Message): string;
    onMessageCreate(msg: Message): Promise<void>;
    onMessageReactionEvent(msg: Message, emoji: Emoji, reactor: Member | Uncached | string): Promise<void>;
    registerCommand(label: string, generator: CommandGenerator, options?: CommandOptions): Command;
    registerCommandAlias(alias: string, label: string): void;
    registerGuildPrefix(guildID: string, prefix: string[] | string): void;
    resolveCommand(label: string): Command;
    unregisterCommand(label: string): void;
    unwatchMessage(id: string, channelID: string): void;
    toString(): string;
  }

  export class DiscordHTTPError extends Error {
    code: number;
    headers: IncomingHttpHeaders;
    name: "DiscordHTTPError";
    req: ClientRequest;
    res: IncomingMessage;
    response: HTTPResponse;
    constructor(req: ClientRequest, res: IncomingMessage, response: HTTPResponse, stack: string);
    flattenErrors(errors: HTTPResponse, keyPrefix?: string): string[];
  }

  export class DiscordRESTError extends Error {
    code: number;
    headers: IncomingHttpHeaders;
    name: string;
    req: ClientRequest;
    res: IncomingMessage;
    response: HTTPResponse;
    constructor(req: ClientRequest, res: IncomingMessage, response: HTTPResponse, stack: string);
    flattenErrors(errors: HTTPResponse, keyPrefix?: string): string[];
  }

  export class DMChannel extends Channel implements Pinnable {
    lastMessageID: string | null;
    lastPinTimestamp: number | null;
    messages: Collection<Message<this>>;
    recipients: Collection<User>;
    type: Constants["ChannelTypes"]["DM"];
    constructor(data: BaseData, client: Client);
    addMessageReaction(messageID: string, reaction: string): Promise<void>;
    createMessage(content: MessageContent, file?: FileContent | FileContent[]): Promise<Message<this>>;
    delete(): Promise<DMChannel>;
    deleteMessage(messageID: string): Promise<void>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<this>>;
    getMessage(messageID: string): Promise<Message<this>>;
    getMessageReaction(messageID: string, reaction: string, options: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getMessageReaction(messageID: string, reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    getMessages(options: GetMessagesOptions): Promise<Message<this>[]>;
    /** @deprecated */
    getMessages(limit?: number, before?: string, after?: string, around?: string): Promise<Message<this>[]>;
    getPins(): Promise<Message<this>[]>;
    pinMessage(messageID: string): Promise<void>;
    removeMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    removeMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    sendTyping(): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
    unsendMessage(messageID: string): Promise<void>;
  }

  export class ExtendedUser extends User {
    email: string;
    mfaEnabled: boolean;
    premiumType: PremiumTypes;
    verified: boolean;
  }

  export class ForumChannel extends MediaChannel {
    defaultForumLayout: ForumLayoutTypes;
  }

  export class GroupChannel extends Channel {
    applicationID: string;
    icon: string | null;
    iconURL: string | null;
    lastMessageID: string | null;
    lastPinTimestamp: number | null;
    managed: boolean;
    name: string;
    ownerID: string;
    recipients: Collection<User>;
    type: Constants["ChannelTypes"]["GROUP_DM"];
    addRecipient(userID: string, options: GroupRecipientOptions): Promise<void>;
    delete(): Promise<GroupChannel>;
    dynamicIconURL(format?: ImageFormat, size?: number): string | null;
    edit(options: EditGroupChannelOptions): Promise<GroupChannel>;
    removeRecipient(userID: string): Promise<void>;
  }

  export class Guild extends Base {
    afkChannelID: string | null;
    afkTimeout: number;
    applicationID: string | null;
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    autoRemoved?: boolean;
    banner: string | null;
    bannerURL: string | null;
    channels: Collection<AnyGuildChannel>;
    createdAt: number;
    defaultNotifications: DefaultNotifications;
    description: string | null;
    discoverySplash: string | null;
    discoverySplashURL: string | null;
    emojiCount?: number;
    emojis: Emoji[];
    events: Collection<GuildScheduledEvent>;
    explicitContentFilter: ExplicitContentFilter;
    features: GuildFeatures[];
    icon: string | null;
    iconURL: string | null;
    id: string;
    joinedAt: number;
    large: boolean;
    maxMembers?: number;
    maxPresences?: number | null;
    maxStageVideoChannelUsers?: number;
    maxVideoChannelUsers?: number;
    memberCount: number;
    members: Collection<Member>;
    mfaLevel: MFALevel;
    name: string;
    /** @deprecated */
    nsfw: boolean;
    nsfwLevel: NSFWLevel;
    ownerID: string;
    preferredLocale: LocaleStrings;
    premiumProgressBarEnabled: boolean;
    premiumSubscriptionCount?: number;
    premiumTier: PremiumTier;
    primaryCategory?: DiscoveryCategory;
    primaryCategoryID?: number;
    publicUpdatesChannelID: string | null;
    roles: Collection<Role>;
    rulesChannelID: string | null;
    safetyAlertsChannelID: string | null;
    shard: Shard;
    splash: string | null;
    splashURL: string | null;
    stageInstances: Collection<StageInstance>;
    stickers?: Sticker[];
    systemChannelFlags: number;
    systemChannelID: string | null;
    threads: Collection<ThreadChannel>;
    unavailable: boolean;
    vanityURL: string | null;
    verificationLevel: VerificationLevel;
    voiceStates: Collection<VoiceState>;
    welcomeScreen?: WelcomeScreen;
    widgetChannelID?: string | null;
    widgetEnabled?: boolean;
    constructor(data: BaseData, client: Client);
    addDiscoverySubcategory(categoryID: string, reason?: string): Promise<DiscoverySubcategoryResponse>;
    addMember(userID: string, accessToken: string, options?: AddGuildMemberOptions): Promise<void>;
    addMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    banMember(userID: string, options?: BanMemberOptions): Promise<void>;
    /** @deprecated */
    banMember(userID: string, deleteMessageDays?: number, reason?: string): Promise<void>;
    bulkEditCommands<T extends ApplicationCommandTypes>(commands: ApplicationCommandBulkEditOptions<true, T>[]): Promise<ApplicationCommand<true, T>[]>;
    createAutoModerationRule(rule: CreateAutoModerationRuleOptions): Promise<AutoModerationRule>;
    createChannel(name: string): Promise<TextChannel>;
    createChannel<T extends GuildChannelTypes>(name: string, type: T, options?: CreateChannelOptions): Promise<ChannelTypeConversion<T>>;
    /** @deprecated */
    createChannel<T extends GuildChannelTypes>(name: string, type: T, options?: CreateChannelOptions | string): Promise<ChannelTypeConversion<T>>;
    createCommand<T extends ApplicationCommandTypes>(command: ApplicationCommandCreateOptions<true, T>): Promise<ApplicationCommand<true, T>>;
    createEmoji(options: { image: string; name: string; roles?: string[] }, reason?: string): Promise<Emoji>;
    createRole(options: RoleOptions, reason?: string): Promise<Role>;
    createRole(options: Role, reason?: string): Promise<Role>;
    createScheduledEvent<T extends GuildScheduledEventEntityTypes>(event: GuildScheduledEventOptions<T>, reason?: string): Promise<GuildScheduledEvent<T>>;
    createSticker(options: CreateStickerOptions, reason?: string): Promise<Sticker>;
    createTemplate(name: string, description?: string | null): Promise<GuildTemplate>;
    delete(): Promise<void>;
    deleteAutoModerationRule(ruleID: string, reason?: string): Promise<void>;
    deleteCommand(commandID: string): Promise<void>;
    deleteDiscoverySubcategory(categoryID: string, reason?: string): Promise<void>;
    deleteEmoji(emojiID: string, reason?: string): Promise<void>;
    deleteIntegration(integrationID: string): Promise<void>;
    deleteRole(roleID: string): Promise<void>;
    deleteScheduledEvent(eventID: string): Promise<void>;
    deleteSticker(stickerID: string, reason?: string): Promise<void>;
    deleteTemplate(code: string): Promise<GuildTemplate>;
    dynamicBannerURL(format?: ImageFormat, size?: number): string | null;
    dynamicDiscoverySplashURL(format?: ImageFormat, size?: number): string | null;
    dynamicIconURL(format?: ImageFormat, size?: number): string | null;
    dynamicSplashURL(format?: ImageFormat, size?: number): string | null;
    edit(options: GuildOptions, reason?: string): Promise<Guild>;
    editAutoModerationRule(ruleID: string, options: EditAutoModerationRuleOptions): Promise<AutoModerationRule>;
    editChannelPositions(channelPositions: ChannelPosition[]): Promise<void>;
    editCommand<T extends ApplicationCommandTypes>(commandID: string, command: ApplicationCommandEditOptions<true, T>): Promise<ApplicationCommand<true, T>>;
    editCommandPermissions(permissions: ApplicationCommandPermissions[], reason?: string): Promise<GuildApplicationCommandPermissions[]>;
    editDiscovery(options?: DiscoveryOptions): Promise<DiscoveryMetadata>;
    editEmoji(emojiID: string, options: { name: string; roles?: string[] }, reason?: string): Promise<Emoji>;
    editMember(memberID: string, options: MemberOptions, reason?: string): Promise<Member>;
    editMFALevel(level: MFALevel, reason?: string): Promise<MFALevelResponse>;
    /** @deprecated */
    editNickname(nick: string): Promise<void>;
    editOnboarding(options: GuildOnboardingOptions, reason?: string): Promise<GuildOnboarding>;
    editRole(roleID: string, options: RoleOptions): Promise<Role>;
    editScheduledEvent<T extends GuildScheduledEventEntityTypes>(eventID: string, event: GuildScheduledEventEditOptions<T>, reason?: string): Promise<GuildScheduledEvent<T>>;
    editSticker(stickerID: string, options?: EditStickerOptions, reason?: string): Promise<Sticker>;
    editTemplate(code: string, options: GuildTemplateOptions): Promise<GuildTemplate>;
    editVanity(code: string | null): Promise<GuildVanity>;
    editVoiceState(options: VoiceStateOptions, userID?: string): Promise<void>;
    editWelcomeScreen(options: WelcomeScreenOptions): Promise<WelcomeScreen>;
    editWidget(options: WidgetOptions): Promise<Widget>;
    fetchAllMembers(timeout?: number): Promise<number>;
    fetchMembers(options?: RequestGuildMembersOptions): Promise<Member[]>;
    getActiveThreads(): Promise<ListedGuildThreads>;
    getAuditLog(options?: GetGuildAuditLogOptions): Promise<GuildAuditLog>;
    /** @deprecated */
    getAuditLogs(limit?: number, before?: string, actionType?: number, userID?: string): Promise<GuildAuditLog>;
    getAutoModerationRule(guildID: string, ruleID: string): Promise<AutoModerationRule>;
    getAutoModerationRules(guildID: string): Promise<AutoModerationRule[]>;
    getBan(userID: string): Promise<GuildBan>;
    getBans(options?: GetGuildBansOptions): Promise<GuildBan[]>;
    getCommand(commandID: string): Promise<ApplicationCommand<true>>;
    getCommandPermissions(): Promise<GuildApplicationCommandPermissions[]>;
    getCommands(): Promise<ApplicationCommand<true>[]>;
    getDiscovery(): Promise<DiscoveryMetadata>;
    /** @deprecated */
    getEmbed(): Promise<Widget>;
    getIntegrations(): Promise<GuildIntegration>;
    getInvites(): Promise<Invite[]>;
    getOnboarding(): Promise<GuildOnboarding>;
    getPruneCount(options?: GetPruneOptions): Promise<number>;
    getRESTChannels(): Promise<AnyGuildChannel[]>;
    getRESTEmoji(emojiID: string): Promise<Emoji>;
    getRESTEmojis(): Promise<Emoji[]>;
    getRESTMember(memberID: string): Promise<Member>;
    getRESTMembers(options?: GetRESTGuildMembersOptions): Promise<Member[]>;
    /** @deprecated */
    getRESTMembers(limit?: number, after?: string): Promise<Member[]>;
    getRESTRoles(): Promise<Role[]>;
    getRESTScheduledEvent(eventID: string): Promise<GuildScheduledEvent>;
    getRESTSticker(stickerID: string): Promise<Sticker>;
    getRESTStickers(): Promise<Sticker[]>;
    getScheduledEvents(options?: GetGuildScheduledEventOptions): Promise<GuildScheduledEvent[]>;
    getScheduledEventUsers(eventID: string, options?: GetGuildScheduledEventUsersOptions): Promise<GuildScheduledEventUser[]>;
    getTemplates(): Promise<GuildTemplate[]>;
    getVanity(): Promise<GuildVanity>;
    getVoiceRegions(): Promise<VoiceRegion[]>;
    getWebhooks(): Promise<Webhook[]>;
    getWelcomeScreen(): Promise<WelcomeScreen>;
    getWidget(): Promise<WidgetData>;
    getWidgetImageURL(style?: GuildWidgetStyles): string;
    getWidgetSettings(): Promise<Widget>;
    kickMember(userID: string, reason?: string): Promise<void>;
    leave(): Promise<void>;
    leaveVoiceChannel(): void;
    permissionsOf(memberID: string | Member | MemberRoles): Permission;
    pruneMembers(options?: PruneMemberOptions): Promise<number>;
    removeMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    searchMembers(query: string, limit?: number): Promise<Member[]>;
    syncTemplate(code: string): Promise<GuildTemplate>;
    unbanMember(userID: string, reason?: string): Promise<void>;
  }

  export class GuildAuditLogEntry extends Base {
    actionType: number;
    after: { [key: string]: unknown } | null;
    before: { [key: string]: unknown } | null;
    channel?: AnyGuildChannel | Uncached;
    count?: number;
    deleteMemberDays?: number;
    guild: Guild | Uncached;
    id: string;
    member?: Member | Uncached;
    membersRemoved?: number;
    message?: Message<AnyGuildTextableChannel> | Uncached;
    reason: string | null;
    role?: Role | { id: string; name: string };
    status?: string;
    target?: Guild | AnyGuildChannel | Member | Role | Invite | Emoji | Sticker | Message<AnyGuildTextableChannel> | null;
    targetID: string;
    user: User | Uncached;
    constructor(data: BaseData, guild: Guild);
  }

  export class GuildChannel extends Channel {
    flags: number;
    guild: Guild;
    name: string;
    parentID: string | null;
    type: GuildChannelTypes;
    delete(reason?: string): Promise<AnyGuildChannel>;
    edit(options: EditGuildChannelOptions, reason?: string): Promise<this>;
    permissionsOf(memberID: string | Member | MemberRoles): Permission;
  }

  export class GuildIntegration extends Base {
    account: { id: string; name: string };
    application?: IntegrationApplication;
    createdAt: number;
    enabled: boolean;
    enableEmoticons?: boolean;
    expireBehavior?: GuildIntegrationExpireBehavior;
    expireGracePeriod?: number;
    id: string;
    name: string;
    revoked?: boolean;
    roleID?: string;
    subscriberCount?: number;
    syncedAt?: number;
    syncing?: boolean;
    type: GuildIntegrationTypes;
    user?: User;
    constructor(data: BaseData, guild: Guild);
    delete(): Promise<void>;
  }

  export class GuildPreview extends Base {
    approximateMemberCount: number;
    approximatePresenceCount: number;
    description: string | null;
    discoverySplash: string | null;
    discoverySplashURL: string | null;
    emojis: Emoji[];
    features: GuildFeatures[];
    icon: string | null;
    iconURL: string | null;
    id: string;
    name: string;
    splash: string | null;
    splashURL: string | null;
    constructor(data: BaseData, client: Client);
    dynamicDiscoverySplashURL(format?: ImageFormat, size?: number): string | null;
    dynamicIconURL(format?: ImageFormat, size?: number): string | null;
    dynamicSplashURL(format?: ImageFormat, size?: number): string | null;
  }

  export class GuildScheduledEvent<T extends GuildScheduledEventEntityTypes = GuildScheduledEventEntityTypes> extends Base {
    channelID: T extends Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"] ? null : PossiblyUncachedSpeakableChannel;
    creator?: User;
    description?: string;
    entityID: string | null;
    entityMetadata: T extends Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"] ? Required<GuildScheduledEventMetadata> : null;
    entityType: T;
    guild: PossiblyUncachedGuild;
    id: string;
    image?: string;
    name: string;
    privacyLevel: GuildScheduledEventPrivacyLevel;
    scheduledEndTime: T extends Constants["GuildScheduledEventEntityTypes"]["EXTERNAL"] ? number : number | null;
    scheduledStartTime: number;
    status: GuildScheduledEventStatus;
    userCount?: number;
    delete(): Promise<void>;
    edit<U extends GuildScheduledEventEntityTypes>(event: GuildScheduledEventEditOptions<U>, reason?: string): Promise<GuildScheduledEvent<U>>;
    getUsers(options?: GetGuildScheduledEventUsersOptions): Promise<GuildScheduledEventUser[]>;
  }

  export class GuildTemplate {
    code: string;
    createdAt: number;
    creator: User;
    description: string | null;
    isDirty: string | null;
    name: string;
    serializedSourceGuild: Guild;
    sourceGuild: Guild | Uncached;
    updatedAt: number;
    usageCount: number;
    constructor(data: BaseData, client: Client);
    createGuild(name: string, icon?: string): Promise<Guild>;
    delete(): Promise<GuildTemplate>;
    edit(options: GuildTemplateOptions): Promise<GuildTemplate>;
    sync(): Promise<GuildTemplate>;
    toJSON(props?: string[]): JSONCache;
  }

  export class GuildTextableChannel extends GuildChannel {
    lastMessageID: string | null;
    messages: Collection<Message<this>>;
    rateLimitPerUser: number;
    type: GuildTextChannelTypes | GuildVoiceChannelTypes | GuildThreadChannelTypes;
    constructor(data: BaseData, client: Client, messageLimit?: number);
    addMessageReaction(messageID: string, reaction: string): Promise<void>;
    createMessage(content: MessageContent, file?: FileContent | FileContent[]): Promise<Message<this>>;
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    deleteMessages(messageIDs: string[], reason?: string): Promise<void>;
    edit(options: EditGuildTextableChannelOptions, reason?: string): Promise<this>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<this>>;
    endPoll(messageID: string): Promise<Message<this>>;
    getMessage(messageID: string): Promise<Message<this>>;
    getMessageReaction(messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getMessageReaction(messageID: string, reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    getMessages(options?: GetMessagesOptions): Promise<Message<this>[]>;
    /** @deprecated */
    getMessages(limit?: number, before?: string, after?: string, around?: string): Promise<Message<this>[]>;
    getPollAnswerVoters(messageID: string, answerID: string, options?: GetPollAnswerVotersOptions): Promise<User[]>;
    purge(options: PurgeChannelOptions): Promise<number>;
    /** @deprecated */
    purge(limit: number, filter?: (message: Message<this>) => boolean, before?: string, after?: string, reason?: string): Promise<number>;
    removeMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReactionEmoji(messageID: string, reaction: string): Promise<void>;
    removeMessageReactions(messageID: string): Promise<void>;
    sendTyping(): Promise<void>;
    unsendMessage(messageID: string): Promise<void>;
  }

  export class MediaChannel extends GuildChannel implements Invitable, Permissionable {
    availableTags: ForumTag[];
    defaultAutoArchiveDuration: AutoArchiveDuration;
    defaultReactionEmoji: DefaultReactionEmoji;
    defaultSortOrder: SortOrderTypes;
    defaultThreadRateLimitPerUser: number;
    lastMessageID: string | null;
    nsfw: boolean;
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    rateLimitPerUser: number;
    threads: PublicThreadChannel<true>[];
    topic?: string;
    createInvite(options?: CreateInviteOptions, reason?: string): Promise<Invite<"withMetadata", this>>;
    createThread(options: CreateForumThreadOptions, file?: FileContent | FileContent[]): Promise<PublicThreadChannel<true>>;
    createWebhook(options: WebhookCreateOptions, reason?: string): Promise<Webhook>;
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    edit(options: EditForumChannelOptions, reason?: string): Promise<this>;
    editPermission(overwriteID: string, allow: PermissionValueTypes, deny: PermissionValueTypes, type: PermissionType, reason?: string): Promise<PermissionOverwrite>;
    getArchivedThreads(options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PublicThreadChannel<true>>>;
    getInvites(): Promise<Invite<"withMetadata", this>[]>;
    getWebhooks(): Promise<Webhook[]>;
  }

  //Interactions
  export class AutocompleteInteraction<T extends PossiblyUncachedTextableChannel = TextableChannel> extends Interaction {
    appPermissions?: Permission;
    channel: T;
    data: AutocompleteInteractionData;
    guildID: T extends AnyGuildChannel ? string : undefined;
    member: T extends AnyGuildChannel ? Member : undefined;
    type: Constants["InteractionTypes"]["APPLICATION_COMMAND_AUTOCOMPLETE"];
    user: T extends AnyGuildChannel ? undefined : User;
    acknowledge(choices: ApplicationCommandOptionChoice[]): Promise<void>;
    result(choices: ApplicationCommandOptionChoice[]): Promise<void>;
  }

  export class Interaction extends Base {
    acknowledged: boolean;
    applicationID: string;
    id: string;
    token: string;
    type: number;
    version: number;
    static from(data: BaseData): AnyInteraction;
  }

  export class PingInteraction extends Interaction {
    type: Constants["InteractionTypes"]["PING"];
    acknowledge(): Promise<void>;
    pong(): Promise<void>;
  }

  export class CommandInteraction<T extends PossiblyUncachedTextableChannel = TextableChannel> extends Interaction {
    appPermissions?: Permission;
    channel: T;
    data: CommandInteractionData;
    guildID: T extends AnyGuildChannel ? string : undefined;
    member: T extends AnyGuildChannel ? Member : undefined;
    type: Constants["InteractionTypes"]["APPLICATION_COMMAND"];
    user: T extends AnyGuildChannel ? undefined : User;
    acknowledge(flags?: number): Promise<void>;
    createFollowup(content: string | InteractionContent, file?: FileContent | FileContent[]): Promise<Message>;
    createMessage(content: string | InteractionContent, file?: FileContent | FileContent[]): Promise<void>;
    createModal(content: InteractionModal): Promise<void>;
    defer(flags?: number): Promise<void>;
    deleteMessage(messageID: string): Promise<void>;
    deleteOriginalMessage(): Promise<void>;
    editMessage(messageID: string, content: string | InteractionContentEdit, file?: FileContent | FileContent[]): Promise<Message<T>>;
    editOriginalMessage(content: string | InteractionContentEdit, file?: FileContent | FileContent[]): Promise<Message<T>>;
    getOriginalMessage(): Promise<Message<T>>;
  }

  export class ComponentInteraction<T extends PossiblyUncachedTextableChannel = TextableChannel> extends Interaction {
    appPermissions?: Permission;
    channel: T;
    data: ComponentInteractionButtonData | ComponentInteractionSelectMenuData;
    guildID: T extends AnyGuildChannel ? string : undefined;
    member: T extends AnyGuildChannel ? Member : undefined;
    message: Message<T>;
    type: Constants["InteractionTypes"]["MESSAGE_COMPONENT"];
    user: T extends AnyGuildChannel ? undefined : User;
    acknowledge(): Promise<void>;
    createFollowup(content: string | InteractionContent, file?: FileContent | FileContent[]): Promise<Message>;
    createMessage(content: string | InteractionContent, file?: FileContent | FileContent[]): Promise<void>;
    createModal(content: InteractionModal): Promise<void>;
    defer(flags?: number): Promise<void>;
    deferUpdate(): Promise<void>;
    deleteMessage(messageID: string): Promise<void>;
    deleteOriginalMessage(): Promise<void>;
    editMessage(messageID: string, content: string | InteractionContentEdit, file?: FileContent | FileContent[]): Promise<Message<T>>;
    editOriginalMessage(content: string | InteractionContentEdit, file?: FileContent | FileContent[]): Promise<Message<T>>;
    editParent(content: InteractionContentEdit, file?: FileContent | FileContent[]): Promise<void>;
    getOriginalMessage(): Promise<Message<T>>;
  }

  export class UnknownInteraction<T extends PossiblyUncachedTextableChannel = TextableChannel> extends Interaction {
    appPermissions?: Permission;
    channel?: T;
    data?: unknown;
    guildID: T extends AnyGuildChannel ? string : undefined;
    member: T extends AnyGuildChannel ? Member : undefined;
    message?: Message<T>;
    type: number;
    user: T extends AnyGuildChannel ? undefined : User;
    acknowledge(data: InteractionOptions): Promise<void>;
    createFollowup(content: string | InteractionContent, file?: FileContent | FileContent[]): Promise<Message>;
    createMessage(content: string | InteractionContent, file?: FileContent | FileContent[]): Promise<void>;
    defer(flags?: number): Promise<void>;
    deferUpdate(): Promise<void>;
    deleteMessage(messageID: string): Promise<void>;
    deleteOriginalMessage(): Promise<void>;
    editMessage(messageID: string, content: string | InteractionContentEdit, file?: FileContent | FileContent[]): Promise<Message<T>>;
    editOriginalMessage(content: string | InteractionContentEdit, file?: FileContent | FileContent[]): Promise<Message<T>>;
    editParent(content: InteractionContentEdit, file?: FileContent | FileContent[]): Promise<void>;
    getOriginalMessage(): Promise<Message<T>>;
    pong(): Promise<void>;
    result(choices: ApplicationCommandOptionChoice[]): Promise<void>;
  }

  // If CT (count) is "withMetadata", it will not have count properties
  export class Invite<CT extends "withMetadata" | "withCount" | "withoutCount" = "withMetadata", CH extends InviteChannel = InviteChannel> extends Base {
    channel: CH;
    code: string;
    // @ts-ignore: Property is only not null when invite metadata is supplied
    createdAt: CT extends "withMetadata" ? number : null;
    expiresAt?: CT extends "withCount" ? number | null : null;
    guild: CT extends "withMetadata"
      ? Guild // Invite with Metadata always has guild prop
      : CH extends Extract<InviteChannel, GroupChannel> // Invite without Metadata
        ? never // If the channel is GroupChannel, there is no guild
        : CH extends Exclude<InviteChannel, InvitePartialChannel> // Invite without Metadata and not GroupChanel
          ? Guild // If the invite channel is not partial
          : Guild | Uncached | undefined; // If the invite channel is partial
    inviter?: User;
    maxAge: CT extends "withMetadata" ? number : null;
    maxUses: CT extends "withMetadata" ? number : null;
    memberCount: CT extends "withMetadata" | "withoutCount" ? null : number;
    presenceCount: CT extends "withMetadata" | "withoutCount" ? null : number;
    /** @deprecated */
    stageInstance: CH extends StageChannel ? InviteStageInstance : null;
    temporary: CT extends "withMetadata" ? boolean : null;
    uses: CT extends "withMetadata" ? number : null;
    constructor(data: BaseData, client: Client);
    delete(reason?: string): Promise<void>;
  }

  export class Member extends Base implements Presence {
    accentColor?: number | null;
    activities?: Activity[];
    avatar: string | null;
    avatarDecorationData?: AvatarDecorationData | null;
    avatarDecorationURL: string | null;
    avatarURL: string;
    banner?: string | null;
    bannerURL: string | null;
    bot: boolean;
    clientStatus?: ClientStatus;
    communicationDisabledUntil?: number | null;
    createdAt: number;
    defaultAvatar: string;
    defaultAvatarURL: string;
    discriminator: string;
    flags: number;
    game: Activity | null;
    globalName: string | null;
    guild: Guild;
    id: string;
    joinedAt: number | null;
    mention: string;
    nick: string | null;
    pending?: boolean;
    /** @deprecated */
    permission: Permission;
    permissions: Permission;
    premiumSince?: number | null;
    roles: string[];
    staticAvatarURL: string;
    status?: UserStatus;
    user: User;
    username: string;
    voiceState: VoiceState;
    constructor(data: BaseData, guild?: Guild, client?: Client);
    addRole(roleID: string, reason?: string): Promise<void>;
    ban(options?: BanMemberOptions): Promise<void>;
    /** @deprecated */
    ban(deleteMessageDays?: number, reason?: string): Promise<void>;
    dynamicAvatarURL(format?: ImageFormat, size?: number): string;
    edit(options: MemberOptions, reason?: string): Promise<void>;
    kick(reason?: string): Promise<void>;
    removeRole(roleID: string, reason?: string): Promise<void>;
    unban(reason?: string): Promise<void>;
  }

  export class Message<T extends PossiblyUncachedTextableChannel = TextableChannel> extends Base {
    activity?: MessageActivity;
    application?: MessageApplication;
    applicationID?: string;
    attachments: Attachment[];
    author: User;
    channel: T;
    channelMentions: string[];
    /** @deprecated */
    cleanContent: string;
    command?: Command;
    components?: ActionRow[];
    content: string;
    createdAt: number;
    editedTimestamp?: number;
    embeds: Embed[];
    flags: number;
    guildID: T extends GuildTextableWithThreads ? string : undefined;
    id: string;
    interaction: MessageInteraction | null;
    jumpLink: string;
    member: T extends GuildTextableWithThreads ? Member : null;
    mentionEveryone: boolean;
    mentions: User[];
    messageReference: MessageReference | null;
    pinned: boolean;
    poll?: Poll;
    prefix?: string;
    reactions: { [s: string]: Reaction };
    referencedMessage?: Message | null;
    roleMentions: string[];
    roleSubscriptionData?: RoleSubscriptionData;
    stickerItems?: StickerItems[];
    /** @deprecated */
    stickers?: Sticker[];
    timestamp: number;
    tts: boolean;
    type: number;
    webhookID: T extends GuildTextableWithThreads ? string | undefined : undefined;
    constructor(data: BaseData, client: Client);
    addReaction(reaction: string): Promise<void>;
    createThreadWithMessage(options: CreateThreadOptions): Promise<NewsThreadChannel | PublicThreadChannel>;
    crosspost(): Promise<T extends NewsChannel ? Message<NewsChannel> : never>;
    delete(reason?: string): Promise<void>;
    deleteWebhook(token: string): Promise<void>;
    edit(content: MessageContentEdit): Promise<Message<T>>;
    editWebhook(token: string, options: WebhookPayloadEdit): Promise<Message<T>>;
    getReaction(reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getReaction(reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    pin(): Promise<void>;
    removeReaction(reaction: string, userID?: string): Promise<void>;
    removeReactionEmoji(reaction: string): Promise<void>;
    removeReactions(): Promise<void>;
    unpin(): Promise<void>;
  }

  export class ModalSubmitInteraction<T extends PossiblyUncachedTextableChannel = TextableChannel> extends Interaction {
    channel: T;
    data: ModalSubmitInteractionData;
    guildID: T extends AnyGuildChannel ? string : undefined;
    member: T extends AnyGuildChannel ? Member : undefined;
    type: Constants["InteractionTypes"]["MODAL_SUBMIT"];
    user: T extends AnyGuildChannel ? undefined : User;
    acknowledge(): Promise<void>;
    createFollowup(content: string | InteractionContent, file?: FileContent | FileContent[]): Promise<Message>;
    createMessage(content: string | InteractionContent, file?: FileContent | FileContent[]): Promise<void>;
    defer(flags?: number): Promise<void>;
    deferUpdate(): Promise<void>;
    deleteMessage(messageID: string): Promise<void>;
    deleteOriginalMessage(): Promise<void>;
    editMessage(messageID: string, content: string | InteractionContentEdit, file?: FileContent | FileContent[]): Promise<Message>;
    editOriginalMessage(content: string | InteractionContentEdit, file?: FileContent | FileContent[]): Promise<Message>;
    editParent(content: InteractionContentEdit, file?: FileContent | FileContent[]): Promise<void>;
    getOriginalMessage(): Promise<Message>;
  }

  // News channel rate limit is always 0
  export class NewsChannel extends TextChannel {
    rateLimitPerUser: 0;
    type: Constants["ChannelTypes"]["GUILD_NEWS"];
    crosspostMessage(messageID: string): Promise<Message<this>>;
    edit(options: EditNewsChannelOptions, reason?: string): Promise<this>;
    follow(webhookChannelID: string): Promise<ChannelFollow>;
  }

  export class NewsThreadChannel extends ThreadChannel {
    type: Constants["ChannelTypes"]["GUILD_NEWS_THREAD"];
  }

  export class Permission extends Base {
    allow: bigint;
    deny: bigint;
    json: Record<keyof Constants["Permissions"], boolean>;
    constructor(allow: number | string | bigint, deny?: number | string | bigint);
    has(permission: keyof Constants["Permissions"] | bigint): boolean;
  }

  export class PermissionOverwrite extends Permission {
    id: string;
    type: PermissionType;
    constructor(data: Overwrite);
  }

  export class Piper extends EventEmitter {
    converterCommand: ConverterCommand;
    dataPacketCount: number;
    encoding: boolean;
    libopus: boolean;
    opus: OpusScript | null;
    opusFactory: () => OpusScript;
    volumeLevel: number;
    constructor(converterCommand: string, opusFactory: OpusScript);
    addDataPacket(packet: unknown): void;
    encode(source: string | Stream, options: VoiceResourceOptions): boolean;
    getDataPacket(): Buffer;
    reset(): void;
    resetPackets(): void;
    setVolume(volume: number): void;
    stop(e: Error, source: Duplex): void;
  }

  export class PrivateThreadChannel extends ThreadChannel {
    threadMetadata: PrivateThreadMetadata;
    type: Constants["ChannelTypes"]["GUILD_PRIVATE_THREAD"];
  }

  /** Generic T is true if the PublicThreadChannel's parent channel is a Forum Channel */
  export class PublicThreadChannel<T = false> extends ThreadChannel {
    appliedTags: T extends true ? string[] : never;
    type: GuildPublicThreadChannelTypes;
  }

  export class RequestHandler implements SimpleJSON {
    globalBlock: boolean;
    latencyRef: LatencyRef;
    options: RequestHandlerOptions;
    ratelimits: { [route: string]: SequentialBucket };
    readyQueue: (() => void)[];
    userAgent: string;
    constructor(client: Client, options?: RequestHandlerOptions);
    /** @deprecated */
    constructor(client: Client, forceQueueing?: boolean);
    globalUnblock(): void;
    request(method: RequestMethod, url: string, auth?: boolean, body?: { [s: string]: unknown }, file?: FileContent, _route?: string, short?: boolean): Promise<unknown>;
    routefy(url: string, method: RequestMethod): string;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }

  export class Role extends Base {
    color: number;
    createdAt: number;
    flags: number;
    guild: Guild;
    hoist: boolean;
    icon: string | null;
    iconURL: string | null;
    id: string;
    json: Partial<Record<Exclude<keyof Constants["Permissions"], "all" | "allGuild" | "allText" | "allVoice">, boolean>>;
    managed: boolean;
    mention: string;
    mentionable: boolean;
    name: string;
    permissions: Permission;
    position: number;
    tags?: RoleTags;
    unicodeEmoji: string | null;
    constructor(data: BaseData, guild: Guild);
    delete(reason?: string): Promise<void>;
    edit(options: RoleOptions, reason?: string): Promise<Role>;
    editPosition(position: number): Promise<void>;
  }

  export class SequentialBucket {
    latencyRef: LatencyRef;
    limit: number;
    processing: boolean;
    remaining: number;
    reset: number;
    constructor(limit: number, latencyRef?: LatencyRef);
    check(override?: boolean): void;
    queue(func: (cb: () => void) => void, short?: boolean): void;
  }

  export class Shard extends EventEmitter implements SimpleJSON {
    client: Client;
    connectAttempts: number;
    connecting: boolean;
    connectTimeout: NodeJS.Timeout | null;
    discordServerTrace?: string[];
    getAllUsersCount: { [guildID: string]: boolean };
    getAllUsersLength: number;
    getAllUsersQueue: string;
    globalBucket: Bucket;
    guildCreateTimeout: NodeJS.Timeout | null;
    heartbeatInterval: NodeJS.Timeout | null;
    id: number;
    lastHeartbeatAck: boolean;
    lastHeartbeatReceived: number | null;
    lastHeartbeatSent: number | null;
    latency: number;
    preReady: boolean;
    presence: ClientPresence;
    presenceUpdateBucket: Bucket;
    ready: boolean;
    reconnectInterval: number;
    requestMembersPromise: { [s: string]: RequestMembersPromise };
    resumeURL: string | null;
    seq: number;
    sessionID: string | null;
    status: "connecting" | "disconnected" | "handshaking" | "identifying" | "ready" | "resuming";
    ws: WebSocket | BrowserWebSocket | null;
    constructor(id: number, client: Client);
    checkReady(): void;
    connect(): void;
    createGuild(_guild: Guild): Guild;
    disconnect(options?: { reconnect?: boolean | "auto" }, error?: Error): void;
    editAFK(afk: boolean): void;
    editStatus(status: SelfStatus, activities?: ActivityPartial<ActivityType>[] | ActivityPartial<ActivityType>): void;
    editStatus(activities?: ActivityPartial<ActivityType>[] | ActivityPartial<ActivityType>): void;
    // @ts-ignore: Method override
    emit(event: string, ...args: any[]): void;
    emit<K extends keyof ShardEvents>(event: K, ...args: ShardEvents[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
    getGuildMembers(guildID: string, timeout: number): void;
    hardReset(): void;
    heartbeat(normal?: boolean): void;
    identify(): void;
    initializeWS(): void;
    off<K extends keyof ShardEvents>(event: K, listener: (...args: ShardEvents[K]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    once<K extends keyof ShardEvents>(event: K, listener: (...args: ShardEvents[K]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    onPacket(packet: RawPacket): void;
    requestGuildMembers(guildID: string, options?: RequestGuildMembersOptions): Promise<Member[]>;
    reset(): void;
    restartGuildCreateTimeout(): void;
    resume(): void;
    sendStatusUpdate(): void;
    sendWS(op: number, _data: Record<string, unknown>, priority?: boolean): void;
    wsEvent(packet: Required<RawPacket>): void;
    on<K extends keyof ShardEvents>(event: K, listener: (...args: ShardEvents[K]) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    toJSON(props?: string[]): JSONCache;
  }

  export class ShardManager extends Collection<Shard> implements SimpleJSON {
    buckets: Map<number, number>;
    connectQueue: Shard[];
    connectTimeout: NodeJS.Timer | null;
    constructor(client: Client, options: ShardManagerOptions);
    connect(shard: Shard): void;
    spawn(id: number): void;
    tryConnect(): void;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }

  export class SharedStream extends EventEmitter {
    bitrate: number;
    channels: number;
    current?: VoiceStreamCurrent;
    ended: boolean;
    frameDuration: number;
    piper: Piper;
    playing: boolean;
    samplingRate: number;
    speaking: boolean;
    voiceConnections: Collection<VoiceConnection>;
    volume: number;
    add(connection: VoiceConnection): void;
    emit<K extends keyof StreamEvents>(event: K, ...args: StreamEvents[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
    off<K extends keyof StreamEvents>(event: K, listener: (...args: StreamEvents[K]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    once<K extends keyof StreamEvents>(event: K, listener: (...args: StreamEvents[K]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    play(resource: ReadableStream | string, options?: VoiceResourceOptions): void;
    remove(connection: VoiceConnection): void;
    setSpeaking(value: boolean): void;
    setVolume(volume: number): void;
    stopPlaying(): void;
    on<K extends keyof StreamEvents>(event: K, listener: (...args: StreamEvents[K]) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export class StageChannel extends VoiceChannel {
    type: Constants["ChannelTypes"]["GUILD_STAGE_VOICE"];
    createInstance(options: StageInstanceOptions): Promise<StageInstance>;
    deleteInstance(): Promise<void>;
    editInstance(options: StageInstanceOptions): Promise<StageInstance>;
    getInstance(): Promise<StageInstance>;
  }

  export class StageInstance extends Base {
    channel: StageChannel | Uncached;
    client: Client;
    discoverableDisabled: boolean;
    guild: Guild | Uncached;
    privacyLevel: StageInstancePrivacyLevel;
    topic: string;
    constructor(data: BaseData, client: Client);
    delete(): Promise<void>;
    edit(options: StageInstanceOptions): Promise<StageInstance>;
    update(data: BaseData): void;
  }

  export class TextChannel extends GuildTextableChannel implements Invitable, Permissionable, Pinnable {
    defaultAutoArchiveDuration: AutoArchiveDuration;
    lastPinTimestamp: number | null;
    nsfw: boolean;
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    topic: string | null;
    type: GuildTextChannelTypes;
    createInvite(options?: CreateChannelInviteOptions, reason?: string): Promise<Invite<"withMetadata", this>>;
    createThread(options: CreateThreadWithoutMessageOptions): Promise<AnyThreadChannel>;
    createThreadWithMessage(messageID: string, options: CreateThreadOptions): Promise<NewsThreadChannel | PublicThreadChannel>;
    /** @deprecated */
    createThreadWithoutMessage(options: CreateThreadWithoutMessageOptions): Promise<AnyThreadChannel>;
    createWebhook(options: WebhookCreateOptions, reason?: string | undefined): Promise<Webhook>;
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    edit(options: EditTextChannelOptions, reason?: string): Promise<this>;
    editPermission(overwriteID: string, allow: PermissionValueTypes, deny: PermissionValueTypes, type: PermissionType, reason?: string): Promise<PermissionOverwrite>;
    getArchivedThreads(type: "private", options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PrivateThreadChannel>>;
    getArchivedThreads(type: "public", options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PublicThreadChannel>>;
    getInvites(): Promise<Invite<"withMetadata", this>[]>;
    getJoinedPrivateArchivedThreads(options: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PrivateThreadChannel>>;
    getPins(): Promise<Message<this>[]>;
    getWebhooks(): Promise<Webhook[]>;
    pinMessage(messageID: string): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
  }

  export class ThreadChannel extends GuildTextableChannel implements Pinnable {
    lastPinTimestamp: number | null;
    member?: ThreadMember;
    memberCount: number;
    members: Collection<ThreadMember>;
    messageCount: number;
    ownerID: string;
    threadMetadata: ThreadMetadata;
    totalMessageSent: number;
    type: GuildThreadChannelTypes;
    constructor(data: BaseData, client: Client);
    edit(options: EditThreadChannelOptions, reason?: string): Promise<this>;
    getMember(userID: string, withMember?: boolean): Promise<ThreadMember>;
    getMembers(options?: GetThreadMembersOptions): Promise<ThreadMember[]>;
    getPins(): Promise<Message<this>[]>;
    join(userID?: string): Promise<void>;
    leave(userID?: string): Promise<void>;
    pinMessage(messageID: string): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
  }

  export class ThreadMember extends Base {
    flags: number;
    guildMember?: Member;
    joinTimestamp: number;
    threadID: string;
    constructor(data: BaseData, client: Client);
    leave(): Promise<void>;
    update(data: BaseData): void;
  }

  export class UnavailableGuild extends Base {
    createdAt: number;
    id: string;
    shard: Shard;
    unavailable: boolean;
    constructor(data: BaseData, client: Client);
  }

  export class User extends Base {
    accentColor?: number | null;
    avatar: string | null;
    avatarDecorationData?: AvatarDecorationData | null;
    avatarDecorationURL: string | null;
    avatarURL: string;
    banner?: string | null;
    bannerURL: string | null;
    bot: boolean;
    createdAt: number;
    defaultAvatar: string;
    defaultAvatarURL: string;
    discriminator: string;
    globalName: string | null;
    id: string;
    mention: string;
    publicFlags?: number;
    staticAvatarURL: string;
    system: boolean;
    username: string;
    constructor(data: BaseData, client: Client);
    dynamicAvatarURL(format?: ImageFormat, size?: number): string;
    dynamicBannerURL(format?: ImageFormat, size?: number): string | null;
    getDMChannel(): Promise<DMChannel>;
  }

  export class VoiceChannel extends GuildTextableChannel implements Invitable, Permissionable {
    bitrate: number;
    nsfw: boolean;
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    rtcRegion: string | null;
    status?: string;
    type: GuildVoiceChannelTypes;
    userLimit: number;
    videoQualityMode: VideoQualityMode;
    voiceMembers: Collection<Member>;
    createInvite(options?: CreateInviteOptions, reason?: string): Promise<Invite<"withMetadata", this>>;
    createWebhook(options: WebhookCreateOptions, reason?: string | undefined): Promise<Webhook>;
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    editPermission(overwriteID: string, allow: PermissionValueTypes, deny: PermissionValueTypes, type: PermissionType, reason?: string): Promise<PermissionOverwrite>;
    getInvites(): Promise<Invite<"withMetadata", this>[]>;
    getWebhooks(): Promise<Webhook[]>;
    join(options?: JoinVoiceChannelOptions): Promise<VoiceConnection>;
    leave(): void;
    setStatus(status: string, reason?: string): Promise<void>;
  }

  export class VoiceConnection extends EventEmitter implements SimpleJSON {
    bitrate: number;
    channelID: string | null;
    channels: number;
    connecting: boolean;
    connectionTimeout: NodeJS.Timeout | null;
    current?: VoiceStreamCurrent | null;
    ended?: boolean;
    endpoint: URL;
    frameDuration: number;
    frameSize: number;
    heartbeatInterval: NodeJS.Timeout | null;
    id: string;
    mode?: string;
    modes?: string;
    /** Optional dependencies OpusScript (opusscript) or OpusEncoder (@discordjs/opus) */
    opus: { [userID: string]: unknown };
    opusOnly: boolean;
    paused: boolean;
    pcmSize: number;
    piper: Piper;
    playing: boolean;
    ready: boolean;
    receiveStreamOpus?: VoiceDataStream | null;
    receiveStreamPCM?: VoiceDataStream | null;
    reconnecting: boolean;
    resuming: boolean;
    samplingRate: number;
    secret: Buffer;
    sendBuffer: Buffer;
    sendNonce: Buffer;
    sequence: number;
    shard: Shard | Record<string, never>;
    shared: boolean;
    speaking: boolean;
    ssrc?: number;
    ssrcUserMap: { [s: number]: string };
    timestamp: number;
    udpIP?: string;
    udpPort?: number;
    udpSocket: DgramSocket | null;
    volume: number;
    ws: BrowserWebSocket | WebSocket | null;
    constructor(id: string, options?: { shard?: Shard; shared?: boolean; opusOnly?: boolean });
    connect(data: VoiceConnectData): NodeJS.Timer | void;
    disconnect(error?: Error, reconnecting?: boolean): void;
    emit<K extends keyof VoiceEvents>(event: K, ...args: VoiceEvents[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
    heartbeat(): void;
    off<K extends keyof VoiceEvents>(event: K, listener: (...args: VoiceEvents[K]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    once<K extends keyof VoiceEvents>(event: K, listener: (...args: VoiceEvents[K]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    pause(): void;
    play(resource: ReadableStream | string, options?: VoiceResourceOptions): void;
    receive(type: "opus" | "pcm"): VoiceDataStream;
    registerReceiveEventHandler(): void;
    resume(): void;
    sendAudioFrame(frame: Buffer): void;
    sendUDPPacket(packet: Buffer): void;
    sendWS(op: number, data: Record<string, unknown>): void;
    setSpeaking(value: boolean): void;
    setVolume(volume: number): void;
    stopPlaying(): void;
    switchChannel(channelID: string): void;
    updateVoiceState(selfMute: boolean, selfDeaf: boolean): void;
    on<K extends keyof VoiceEvents>(event: K, listener: (...args: VoiceEvents[K]) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    toJSON(props?: string[]): JSONCache;
  }

  export class VoiceConnectionManager<T extends VoiceConnection = VoiceConnection> extends Collection<T> implements SimpleJSON {
    constructor(vcObject: new () => T);
    join(guildID: string, channelID: string, options: VoiceResourceOptions): Promise<VoiceConnection>;
    leave(guildID: string): void;
    switch(guildID: string, channelID: string): void;
    voiceServerUpdate(data: VoiceServerUpdateData): void;
    toJSON(props?: string[]): JSONCache;
  }

  export class VoiceDataStream extends EventEmitter {
    type: "opus" | "pcm";
    constructor(type: string);
    on(event: "data", listener: (data: Buffer, userID: string, timestamp: number, sequence: number) => void): this;
  }

  export class VoiceState extends Base {
    channelID: string | null;
    createdAt: number;
    deaf: boolean;
    id: string;
    mute: boolean;
    requestToSpeakTimestamp: number | null;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
    sessionID: string | null;
    suppress: boolean;
    constructor(data: BaseData);
  }
}

export = Eris;
