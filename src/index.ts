import { BinBuilder } from './classes/builders/BinBuilder.js';
import { SourcebinURL } from './types/options.js';
import { APIBinData } from './types/apiTypes.js';
import { Client } from './classes/Client.js';
import { Bin } from './classes/Bin.js';

export * from './classes/builders/BinBuilder.js';
export * from './classes/builders/BinFileBuilder.js';
export * from './classes/Bin.js';
export * from './classes/BinFile.js';
export * from './classes/Client.js';
export * from './classes/REST.js';
export * from './types/apiTypes.js';
export * from './types/languages.js';
export * from './types/options.js';

/**
 * @param bin Bin data
 */
export const create = (bin: APIBinData|BinBuilder) => Client.createBin(bin);

/**
 * @param key Bin key or url
 */
export const get = async (key: string) => new Bin(await Client.getBin(key));

/**
 * @param key Bin key or url
 * @param index Bin file index
 */
export const fetchContent = (key: string, index: number = 0) => Client.getBinContent(key, index);

/**
 * @param url Could be a sourcebin url
 */
export const isSourcebin = (url: string): url is SourcebinURL => Client.isSourcebinURL(url);

/**
 * @param url Sourcebin url
 */
export const getKeyFromURL = (url: string) => Client.getKeyFromURL(url);
