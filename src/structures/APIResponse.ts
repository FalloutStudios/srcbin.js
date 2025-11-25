import type { LanguageType } from '../helpers/constants.js';

export namespace APIResponse {
    export interface CreateBin {
        key: string;
        languages: LanguageType[];
    }

    export interface GetBin {
        _id: string;
        hits: number;
        key: string;
        title?: string;
        description?: string;
        files: GetBinFile[];
        created: string;
    }

    export interface GetBinFile {
        name?: string;
        languageId: LanguageType|number;
    }

    export interface DeleteBin {
        success: boolean;
    }

    export interface GetUser {
        username: string;
        about: {
            avatarURL?: string;
            bio?: string;
            website?: string;
            location?: string;
        };
        oauth: {
            discord?: string;
            github?: string;
        };
        plan: string;
        createdAt: string;
    }
}