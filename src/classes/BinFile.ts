import { LanguageType } from '../helpers/constants.js';
import type { APIOptions } from '../structures/APIOptions.js';
import type { APIResponse } from '../structures/APIResponse.js';
import type { Bin } from './Bin.js';
import type { REST } from './REST.js';

export class BinFile implements APIResponse.GetBinFile {
    public name?: string;
    public languageId!: APIResponse.GetBinFile['languageId'];
    public content: string|null = null;

    public language() {
        return typeof this.languageId === 'number' ? LanguageType[this.languageId] : this.languageId;
    }

    constructor(public readonly bin: Bin, data: APIResponse.GetBinFile) {
        Object.assign(this, data);
    }

    public async fetch(options?: REST['options'] & { force?: boolean; }): Promise<string> {
        if (options?.force != true && this.content !== null) {
            return this.content;
        }

        return this.bin.client.rest.getBinContent(this.bin.key, options);
    }

    public toJSON(full?: false): APIResponse.GetBinFile
    public toJSON(full?: true): APIOptions.BinFile
    public toJSON(full?: boolean): APIResponse.GetBinFile|APIOptions.BinFile
    public toJSON(full: boolean = false): APIResponse.GetBinFile|APIOptions.BinFile {
        return {
            name: this.name,
            languageId: this.languageId,
            ...(full ? { content: this.content || '' } : {})
        };
    }
}