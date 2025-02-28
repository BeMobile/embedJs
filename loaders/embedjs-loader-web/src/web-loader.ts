import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import createDebugMessages from 'debug';
import { convert } from 'html-to-text';
import md5 from 'md5';

import { BaseLoader } from '@llm-tools/embedjs-interfaces';
import { isValidURL, truncateCenterString, cleanString, getSafe } from '@llm-tools/embedjs-utils';

type CustomMetadata = Record<`custom${string}`, string>;

export class WebLoader extends BaseLoader<{ type: 'WebLoader' }> {
    private readonly debug = createDebugMessages('embedjs:loader:WebLoader');
    private readonly urlOrContent: string;
    private readonly isUrl: boolean;
    private readonly metadata?: CustomMetadata;

    constructor({
        urlOrContent,
        chunkSize,
        chunkOverlap,
        metadata,
    }: {
        urlOrContent: string;
        chunkSize?: number;
        chunkOverlap?: number;
        /** Metadata associated with the text. The metadata should start with `custom`. */
        metadata?: CustomMetadata;
    }) {
        super(`WebLoader_${md5(urlOrContent)}`, { urlOrContent }, chunkSize ?? 2000, chunkOverlap ?? 0);

        this.isUrl = isValidURL(urlOrContent) ? true : false;
        this.urlOrContent = urlOrContent;
        this.metadata = metadata || undefined;
    }

    override async *getUnfilteredChunks() {
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });

        try {
            const data = this.isUrl ? (await getSafe(this.urlOrContent, { format: 'text' })).body : this.urlOrContent;

            const text = convert(data, {
                wordwrap: false,
                preserveNewlines: false,
            }).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

            const tuncatedObjectString = this.isUrl ? undefined : truncateCenterString(this.urlOrContent, 50);

            const chunks = await chunker.splitText(cleanString(text));
            for (const chunk of chunks) {
                yield {
                    pageContent: chunk,
                    metadata: {
                        ...this.metadata,
                        type: 'WebLoader' as const,
                        source: this.isUrl ? this.urlOrContent : tuncatedObjectString,
                    },
                };
            }
        } catch (e) {
            this.debug('Could not parse input', this.urlOrContent, e);
        }
    }
}
