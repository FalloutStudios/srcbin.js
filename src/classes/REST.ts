import type { APIOptions } from '../structures/APIOptions.js';
import type { APIResponse } from '../structures/APIResponse.js';

export class REST implements REST.Options {
    public accessToken?: string;
    public base: string;
    public fetch: REST.Fetch;
    public options: Omit<RequestInit, 'method'>;

    constructor(options?: REST.Options) {
        this.accessToken = options?.accessToken;
        this.base = options?.base ?? 'https://sourceb.in';
        this.fetch = options?.fetch ?? fetch;
        this.options = options?.options ?? {};
    }

    public async getUser(options?: REST.Options['options']): Promise<APIResponse.GetUser> {
        const response = await this.fetch(
            `${this.base}/api/user`,
            this.mergeOptions(this.options, options, {
                headers: {
                    'Accept': 'application/json',
                },
                method: 'GET',
            })
        );

        return response.json();
    }

    public async getUserBins(options?: REST.Options['options']): Promise<APIResponse.GetBin[]> {
        const response = await this.fetch(
            `${this.base}/api/user/bins`,
            this.mergeOptions(this.options, options, {
                headers: {
                    'Accept': 'application/json',
                },
                method: 'GET',
            })
        );

        return response.json();
    }

    public async getBin(key: string, options?: REST.Options['options']): Promise<APIResponse.GetBin> {
        const response = await this.fetch(
            `${this.base}/api/bins/${key}`,
            this.mergeOptions(this.options, options, {
                headers: {
                    'Accept': 'application/json',
                },
                method: 'GET',
            })
        );

        return response.json();
    }

    public async deleteBin(key: string, options?: REST.Options['options']): Promise<APIResponse.DeleteBin> {
        const response = await this.fetch(
            `${this.base}/api/bins/${key}`,
            this.mergeOptions(this.options, options, {
                headers: {
                    'Accept': 'application/json',
                },
                method: 'DELETE',
            })
        );

        return response.json();
    }

    public async createBin(bin: APIOptions.Bin, options?: REST.Options['options']): Promise<APIResponse.CreateBin> {
        const response = await this.fetch(
            `${this.base}/api/bins`,
            this.mergeOptions(this.options, options, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(bin),
            })
        );

        return response.json();
    }

    public async getBinContent(key: string, options?: REST.Options['options']): Promise<string> {
        const response = await this.fetch(
            `${this.base}/api/bins/${key}/content`,
            this.mergeOptions(this.options, options, {
                headers: {
                    'Accept': 'plain/text',
                },
                method: 'GET',
            })
        );

        return response.text();
    }

    private mergeOptions(...options: (RequestInit|undefined)[]): RequestInit {
        const opts = { ...options.reduce((a, b) => ({ ...a, ...b }), {}) };

        opts.headers = new Headers(opts.headers);
        opts.headers.set('Cookie', `access_token=${this.accessToken};${opts.headers?.get('Cookie') ?? ''}`);

        return opts;
    }
}

export namespace REST {
    export interface Options {
        accessToken?: string;
        base?: string;
        fetch?: Fetch;
        options?: Omit<RequestInit, 'method'>;
    }

    export type Fetch = (url: RequestInfo|URL, init?: RequestInit) => Promise<Response>;
}