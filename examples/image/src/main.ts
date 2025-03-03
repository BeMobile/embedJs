import 'dotenv/config';
import path from 'node:path';
import { RAGApplicationBuilder, SIMPLE_MODELS } from '@betalent/embedjs';
import { ImageLoader } from '@betalent/embedjs-loader-image';
import { OpenAiEmbeddings } from '@betalent/embedjs-openai';
import { HNSWDb } from '@betalent/embedjs-hnswlib';

const ragApplication = await new RAGApplicationBuilder()
    .setModel(SIMPLE_MODELS.OPENAI_GPT4_O)
    .setEmbeddingModel(new OpenAiEmbeddings())
    .setVectorDatabase(new HNSWDb())
    .build();

const imagePath = path.resolve('./examples/image/assets/test.jpg');
await ragApplication.addLoader(new ImageLoader({ filePathOrUrl: imagePath }));

await ragApplication.query('How does deep learning relate to artifical intelligence');
