import { Conversation, LoaderListEntry, Message, QueryResponse } from '../types.js';

export interface BaseStore<CustomFieldsType extends Record<string, unknown> = Record<string, unknown>> {
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

    addConversation(conversationId: string, customFields: CustomFieldsType, userEntry: Message): Promise<void>;
    getConversation(conversationId: string, customFields: CustomFieldsType): Promise<Conversation>;
    hasConversation(conversationId: string, customFields: CustomFieldsType): Promise<boolean>;
    deleteConversation(conversationId: string, customFields: CustomFieldsType): Promise<void>;
    addEntryToConversation(
        conversationId: string,
        entry: Message,
        customFields: CustomFieldsType,
        tokenUse?: QueryResponse['tokenUse'],
    ): Promise<void>;
    clearConversations(): Promise<void>;
}
