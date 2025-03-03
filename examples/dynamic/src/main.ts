import 'dotenv/config';
import { RAGApplicationBuilder, UrlLoader } from '@betalent/embedjs';
import { OpenAi, OpenAiEmbeddings } from '@betalent/embedjs-openai';
import { HNSWDb } from '@betalent/embedjs-hnswlib';

const llmApplication = await new RAGApplicationBuilder()
    .setModel(new OpenAi({ modelName: 'gpt-4o' }))
    .setEmbeddingModel(new OpenAiEmbeddings())
    .setVectorDatabase(new HNSWDb())
    .build();

await llmApplication.addLoader(new UrlLoader({ url: 'https://en.wikipedia.org/wiki/Tesla,_Inc.' }));

console.log(await llmApplication.query('Who founded Tesla?'));
