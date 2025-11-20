import type { APIResponse } from '../structures/APIResponse.js';
import { BinFile } from './BinFile.js';
import type { Client } from './Client.js';
import type { REST } from './REST.js';

export class Bin implements APIResponse.GetBin {
    public _id!: string;
    public hits!: number;
    public key!: string;
    public title?: string;
    public description?: string;
    public files: BinFile[] = [];
    public created!: string;

    get createdAt() {
        return new Date(this.created);
    }

    constructor(public readonly client: Client, data: APIResponse.GetBin) {
        this._patch(data);
    }

    public async fetch(options?: REST['options']): Promise<this> {
        const data = this.client.rest.getBin(this.key, options);
        return data.then(bin => this._patch(bin));
    }

    public async fetchFiles(options?: REST['options'] & { force?: boolean; }): Promise<this> {
        await Promise.all(this.files.map(file => file.fetch(options)));
        return this;
    }

    public async delete(options?: REST['options']): Promise<APIResponse.DeleteBin> {
        return this.client.rest.deleteBin(this.key, options);
    }

    private _patch(data: APIResponse.GetBin): this {
        Object.assign(this, data);

        this.files = this.files.map(file => new BinFile(this, file));
        return this;
    }

    public static _patch(bin: Bin, data: APIResponse.GetBin): Bin {
        return bin._patch(data);
    }
}