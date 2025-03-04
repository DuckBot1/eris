"use strict";

const Base = require("./Base");
const Endpoints = require("../rest/Endpoints");

/**
 * Represents a user
 * @prop {Number?} accentColor The user's banner color, or null if no banner color (REST only)
 * @prop {String?} avatar The hash of the user's avatar, or null if no avatar
 * @prop {Object?} avatarDecorationData The data of the user's avatar decoration, including the asset and sku ID, or null if no avatar decoration
 * @prop {String?} avatarDecorationURL The URL of the user's avatar decoration
 * @prop {String} avatarURL The URL of the user's avatar which can be either a JPG or GIF
 * @prop {String?} banner The hash of the user's banner, or null if no banner (REST only)
 * @prop {String?} bannerURL The URL of the user's banner
 * @prop {Boolean} bot Whether the user is an OAuth bot or not
 * @prop {Number} createdAt Timestamp of the user's creation
 * @prop {String} defaultAvatar The hash for the default avatar of a user if there is no avatar set
 * @prop {String} defaultAvatarURL The URL of the user's default avatar
 * @prop {String} discriminator The discriminator of the user. If they've migrated to the new username system, this will be "0"
 * @prop {String?} globalName The user's display name, if it is set. For bots, this is the application name
 * @prop {String} id The ID of the user
 * @prop {String} mention A string that mentions the user
 * @prop {Number?} publicFlags Publicly visible flags for this user
 * @prop {String} staticAvatarURL The URL of the user's avatar (always a JPG)
 * @prop {Boolean} system Whether the user is an official Discord system user (e.g. urgent messages)
 * @prop {String} username The username of the user
 */
class User extends Base {
    constructor(data, client) {
        super(data.id);
        if(!client) {
            this._missingClientError = new Error("Missing client in constructor"); // Preserve constructor callstack
        }
        this._client = client;
        this.bot = !!data.bot;
        this.system = !!data.system;
        this.update(data);
    }

    update(data) {
        if(data.avatar !== undefined) {
            this.avatar = data.avatar;
        }
        if(data.username !== undefined) {
            this.username = data.username;
        }
        if(data.global_name !== undefined) {
            this.globalName = data.global_name;
        }
        if(data.discriminator !== undefined) {
            this.discriminator = data.discriminator;
        }
        if(data.public_flags !== undefined) {
            this.publicFlags = data.public_flags;
        }
        if(data.banner !== undefined) {
            this.banner = data.banner;
        }
        if(data.accent_color !== undefined) {
            this.accentColor = data.accent_color;
        }
        if(data.avatar_decoration_data !== undefined) {
            this.avatarDecorationData = data.avatar_decoration_data;
        }
    }

    get avatarDecorationURL() {
        if(!this.avatarDecorationData) {
            return null;
        }
        if(this._missingClientError) {
            throw this._missingClientError;
        }
        return this._client._formatImage(Endpoints.USER_AVATAR_DECORATION(this.avatarDecorationData.asset));
    }

    get avatarURL() {
        if(this._missingClientError) {
            throw this._missingClientError;
        }
        return this.avatar ? this._client._formatImage(Endpoints.USER_AVATAR(this.id, this.avatar)) : this.defaultAvatarURL;
    }

    get bannerURL() {
        if(!this.banner) {
            return null;
        }
        if(this._missingClientError) {
            throw this._missingClientError;
        }
        return this._client._formatImage(Endpoints.BANNER(this.id, this.banner));
    }

    get defaultAvatar() {
        return this.discriminator === "0" ? (this.id >> 22) % 6 : this.discriminator % 5;
    }

    get defaultAvatarURL() {
        return `${Endpoints.CDN_URL}${Endpoints.DEFAULT_USER_AVATAR(this.defaultAvatar)}.png`;
    }

    get mention() {
        return `<@${this.id}>`;
    }

    get staticAvatarURL() {
        if(this._missingClientError) {
            throw this._missingClientError;
        }
        return this.avatar ? this._client._formatImage(Endpoints.USER_AVATAR(this.id, this.avatar), "jpg") : this.defaultAvatarURL;
    }

    /**
     * Get the user's avatar with the given format and size
     * @arg {String} [format] The filetype of the avatar ("jpg", "jpeg", "png", "gif", or "webp")
     * @arg {Number} [size] The size of the avatar (any power of two between 16 and 4096)
     * @returns {String}
     */
    dynamicAvatarURL(format, size) {
        if(!this.avatar) {
            return this.defaultAvatarURL;
        }
        if(this._missingClientError) {
            throw this._missingClientError;
        }
        return this._client._formatImage(Endpoints.USER_AVATAR(this.id, this.avatar), format, size);
    }

    /**
     * Get the user's banner with the given format and size
     * @arg {String} [format] The filetype of the banner ("jpg", "jpeg", "png", "gif", or "webp")
     * @arg {Number} [size] The size of the banner (any power of two between 16 and 4096)
     * @returns {String?}
     */
    dynamicBannerURL(format, size) {
        if(!this.banner) {
            return null;
        }
        if(this._missingClientError) {
            throw this._missingClientError;
        }
        return this._client._formatImage(Endpoints.BANNER(this.id, this.banner), format, size);
    }

    /**
     * Get a DM channel with the user, or create one if it does not exist
     * @returns {Promise<DMChannel>}
     */
    getDMChannel() {
        return this._client.getDMChannel.call(this._client, this.id);
    }

    toJSON(props = []) {
        return super.toJSON([
            "accentColor",
            "avatar",
            "avatarDecorationData",
            "banner",
            "bot",
            "discriminator",
            "globalName",
            "publicFlags",
            "system",
            "username",
            ...props
        ]);
    }
}

module.exports = User;
