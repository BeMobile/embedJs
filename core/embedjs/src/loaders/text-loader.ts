import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import md5 from 'md5';

import { BaseLoader } from '@betalent/embedjs-interfaces';
import { truncateCenterString, cleanString } from '@betalent/embedjs-utils';

type CustomMetadata = Record<`custom${string}`, string>;

export class TextLoader extends BaseLoader<{ type: 'TextLoader' }> {
    private readonly text: string;
    private readonly metadata?: CustomMetadata;
    private readonly splitByLine: boolean;

    constructor({
        text,
        chunkSize,
        chunkOverlap,
        metadata,
        splitByLine,
    }: {
        text: string;
        chunkSize?: number;
        chunkOverlap?: number;
        /** Metadata associated with the text. The metadata should start with `custom`. */
        metadata?: CustomMetadata;
        splitByLine?: boolean;
    }) {
        super(
            `TextLoader_${md5(`${text}${cleanString(JSON.stringify(metadata))}`)}`,
            { text: truncateCenterString(text, 50) },
            chunkSize ?? 300,
            chunkOverlap ?? 0,
        );
        this.text = text;
        this.metadata = metadata || undefined;
        this.splitByLine = splitByLine || false;
    }

    override async *getUnfilteredChunks() {
        const truncatedObjectString = truncateCenterString(this.text, 50);
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        let chunks: string[];
        if (this.splitByLine) {
            chunks = this.text.split('\n').map((d) => cleanString(d));
        } else {
            chunks = await chunker.splitText(cleanString(this.text));
        }

        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                metadata: {
                    ...this.metadata,
                    type: 'TextLoader' as const,
                    source: truncatedObjectString,
                    textId: this.uniqueId,
                },
            };
        }
    }
}
