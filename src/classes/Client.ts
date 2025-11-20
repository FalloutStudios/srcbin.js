import { Collection } from '@discordjs/collection';
import { REST } from './REST.js';
import { Bin } from './Bin.js';
import type { APIResponse } from '../structures/APIResponse.js';
import type { APIOptions } from '../structures/APIOptions.js';

export class Client {
    public rest: REST;
    public cache: Collection<string, Bin>|null;
    public user: APIResponse.GetUser|null = null;

    public autoFetchFiles: boolean;

    constructor(options?: Client.Options) {
        this.rest = new REST(options);
        this.cache = options?.cache === true ? new Collection() : options?.cache || null;
        this.autoFetchFiles = options?.autoFetchFiles ?? false;
    }

    public async getUser(options?: REST.Options['options'] & { force?: boolean; }): Promise<APIResponse.GetUser> {
        if (options?.force != true && this.user) {
            return this.user;
        }

        return this.rest.getUser(options);
    }

    public async createBin(bin: APIOptions.Bin, options?: REST.Options['options'] & { autoFetchFiles?: boolean; }): Promise<Bin> {
        const data = await this.rest.createBin(bin, options);

        return this.getBin(data.key, options);
    }

    public async getUserBins(options?: REST.Options['options'] & { autoFetchFiles?: boolean; }): Promise<Bin[]> {
        return Promise.all((await this.rest.getUserBins(options)).map(bin => this._resolveBin(bin, options)));
    }

    public async getBin(key: string, options?: REST.Options['options'] & { force?: boolean; autoFetchFiles?: boolean; }): Promise<Bin> {
        let bin = this.cache?.get(key);
        if (bin && options?.force !== true) return bin;

        return this._resolveBin(await this.rest.getBin(key, options), options);
    }

    private async _resolveBin(data: APIResponse.GetBin, options?: REST.Options['options'] & { autoFetchFiles?: boolean; }): Promise<Bin> {
        let bin: Bin = this.cache?.get(data.key) ?? new Bin(this, data);

        Bin._patch(bin, data);
        Reflect.set(bin, 'client', this);

        if (this.autoFetchFiles ?? this.autoFetchFiles) {
            await Promise.all(bin.files.map(f => f.fetch(options)));
        }

        if (this.cache) this.cache.set(data.key, bin);

        return bin;
    }

}

export namespace Client {
    export interface Options extends REST.Options {
        cache?: boolean|Collection<string, Bin>;
        autoFetchFiles?: boolean;
    }
}