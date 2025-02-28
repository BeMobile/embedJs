import 'dotenv/config';
import { RAGApplicationBuilder, TextLoader } from '@llm-tools/embedjs';
import { OpenAi, OpenAiEmbeddings } from '@llm-tools/embedjs-openai';
import { WebLoader } from '@llm-tools/embedjs-loader-web';
import { QdrantDb } from '@llm-tools/embedjs-qdrant';

const ragApplication = await new RAGApplicationBuilder()
    .setModel(new OpenAi({ model: 'gpt-4o-mini-2024-07-18', maxTokens: 8192 }))
    .setEmbeddingModel(new OpenAiEmbeddings())
    .setVectorDatabase(
        new QdrantDb({
            url: 'http://localhost:6333',
            clusterName: 'develop',
            apiKey: '123',
        }),
    )
    .build();

await ragApplication.addLoader(
    new WebLoader({
        urlOrContent: 'https://www.forbes.com/profile/elon-musk',
        metadata: { customType: 'general' },
    }),
);
await ragApplication.addLoader(
    new TextLoader({
        text: 'Elon Musk is the CEO of Tesla\nElon Musk is the CEO of SpaceX',
        splitByLine: true,
        metadata: { customFarmId: 'manual' },
    }),
);

await ragApplication.query('Elon Musk is the CEO of?', {
    filterMatch: { customFarmId: 'manual', customType: 'general' },
});
