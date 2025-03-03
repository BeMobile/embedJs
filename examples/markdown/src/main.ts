import 'dotenv/config';
import { LocalPathLoader, RAGApplicationBuilder } from '@betalent/embedjs';
import { OpenAi, OpenAiEmbeddings } from '@betalent/embedjs-openai';
import { HNSWDb } from '@betalent/embedjs-hnswlib';

const llmApplication = await new RAGApplicationBuilder()
    .setModel(new OpenAi({ modelName: 'gpt-4o' }))
    .setEmbeddingModel(new OpenAiEmbeddings())
    .setVectorDatabase(new HNSWDb())
    .build();

await llmApplication.addLoader(new LocalPathLoader({ path: './docs' }));
console.log(await llmApplication.query('How do you create an embedJs application?'));
