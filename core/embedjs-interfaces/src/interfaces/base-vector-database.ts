import { ExtractChunkData, InsertChunkData } from '../types.js';

export interface BaseVectorDatabase {
    init({ dimensions }: { dimensions: number }): Promise<void>;
    insertChunks(chunks: InsertChunkData[]): Promise<number>;
    similaritySearch(query: number[], k: number, filterMatch?: Record<string, string>): Promise<ExtractChunkData[]>;
    getVectorCount(): Promise<number>;

    deleteKeys(uniqueLoaderId: string): Promise<boolean>;
    reset(): Promise<void>;
}
