import { Conversation, LoaderListEntry, Message } from '../types.js';

export interface BaseStore {
    init(): Promise<void>;

    addLoaderMetadata(loaderId: string, value: LoaderListEntry): Promise<void>;
    getLoaderMetadata(loaderId: string): Promise<LoaderListEntry>;
    hasLoaderMetadata(loaderId: string): Promise<boolean>;
    getAllLoaderMetadata(): Promise<LoaderListEntry[]>;

    loaderCustomSet<T extends Record<string, unknown>>(loaderId: string, key: string, value: T): Promise<void>;
    loaderCustomGet<T extends Record<string, unknown>>(key: string): Promise<T>;
    loaderCustomHas(key: string): Promise<boolean>;
    loaderCustomDelete(key: string): Promise<void>;
    deleteLoaderMetadataAndCustomValues(loaderId: string): Promise<void>;

    addConversation(conversationId: string, userId: string): Promise<void>;
    getConversation(conversationId: string, userId: string): Promise<Conversation>;
    hasConversation(conversationId: string, userId: string): Promise<boolean>;
    deleteConversation(conversationId: string, userId: string): Promise<void>;
    addEntryToConversation(conversationId: string, entry: Message, userId: string): Promise<void>;
    clearConversations(): Promise<void>;
}
