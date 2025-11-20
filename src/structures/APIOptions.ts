import type { LanguageType } from '../helpers/constants.js';

export namespace APIOptions {
    export interface Bin {
        title?: string;
        description?: string;
        files: BinFile[];
    }

    export interface BinFile {
        name?: string;
        content: string;
        languageId?: LanguageType|number;
    }
}