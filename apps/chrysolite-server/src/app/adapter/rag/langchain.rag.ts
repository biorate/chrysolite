import { Injectable, OnModuleInit } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { RagDrivenPort } from '@/app/application/ports';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOllamaInput, ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { pull } from 'langchain/hub';
import { AgentExecutor } from 'langchain/agents';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import {
  AnnotationRoot,
  Annotation,
  StateGraph,
  CompiledStateGraph,
} from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import {
  RecursiveCharacterTextSplitter,
  RecursiveCharacterTextSplitterParams,
} from '@langchain/textsplitters';

@Injectable()
export class LangchainRagAdapter implements RagDrivenPort, OnModuleInit {
  @inject(Types.Config) protected config: IConfig;

  protected llm!: ChatOllama;

  protected embeddings!: OllamaEmbeddings;

  protected splitter!: RecursiveCharacterTextSplitter;

  protected store!: MemoryVectorStore;

  protected promptTemplate!: ChatPromptTemplate;

  protected graph!: CompiledStateGraph<any, any, any>;

  protected inputStateAnnotation!: AnnotationRoot<{
    question: typeof Annotation<string>;
  }>;

  protected mcpClient: MultiServerMCPClient;

  protected agent: any;

  protected stateAnnotation!: AnnotationRoot<{
    question: typeof Annotation<string>;
    context: typeof Annotation<Document[]>;
    tool_output: typeof Annotation<string>;
    answer: typeof Annotation<string>;
  }>;

  public async invoke(req: string) {
    const res = await this.graph.invoke({
      question: `
        Ты - ассистент, который должен эффективно использовать инструменты.
        Если ты уже получал данные по определенному запросу, не запрашивай их снова.
        Вместо этого используй полученную ранее информацию. Вопрос: 
        ${req}`,
    });
    return <string>res.answer;

    // const result = await this.executor.invoke({
    //   input: req,
    // });
    // const result = await this.agent.invoke({
    //   messages: [{ role: 'user', content: req }],
    // });
    // const answer = [];
    // console.log(result);
    // for (let i = result?.messages.length; i--; )
    //   answer.push({
    //     [result?.messages[i].constructor.name]: result?.messages[i]?.content,
    //   });
    // return answer;
  }

  protected async init() {
    this.llm = new ChatOllama(
      this.config.get<ChatOllamaInput>('LangchainRagAdapter.llm', {
        // model: 'deepseek-r1:8b',
        // baseUrl: 'http://db2:11434',
        model: 'qwen2',
      }),
    );
    this.embeddings = new OllamaEmbeddings(
      this.config.get<ChatOllamaInput>('LangchainRagAdapter.embeddings', {
        model: 'nomic-embed-text',
      }),
    );
    this.splitter = new RecursiveCharacterTextSplitter(
      this.config.get<Partial<RecursiveCharacterTextSplitterParams>>(
        'LangchainRagAdapter.splitter',
        {
          chunkSize: 768,
          chunkOverlap: 200,
        },
      ),
    );
    this.mcpClient = new MultiServerMCPClient({
      throwOnLoadError: true,
      prefixToolNameWithServerName: false,
      additionalToolNamePrefix: '',
      useStandardContentBlocks: true,
      mcpServers: {
        local: {
          url: 'http://localhost:3000/mcp',
          automaticSSEFallback: false,
        },
      },
    });
    this.store = new MemoryVectorStore(this.embeddings);
    this.promptTemplate = await pull<ChatPromptTemplate>('rlm/rag-prompt');
    this.inputStateAnnotation = Annotation.Root({
      question: Annotation<string>,
    });
    this.stateAnnotation = Annotation.Root({
      question: Annotation<string>,
      context: Annotation<Document[]>,
      tool_output: Annotation<string>,
      answer: Annotation<string>,
    });
    this.agent = createReactAgent({
      llm: this.llm,
      tools: await this.mcpClient.getTools(),
    });
    this.graph = new StateGraph(this.stateAnnotation)
      // .addNode('retrieve', this.retrieve.bind(this))
      .addNode('mcp_tools', this.mcpTools.bind(this))
      .addNode('generate', this.generate.bind(this))
      // .addConditionalEdges('retrieve', this.shouldUseMcpTools.bind(this), {
      //   mcp_tools: 'mcp_tools',
      //   generate: 'generate',
      // })
      .addEdge('__start__', 'mcp_tools')
      .addEdge('mcp_tools', 'generate')
      .addEdge('generate', '__end__')
      .compile();
  }

  public async onModuleInit() {
    setTimeout(() => this.init());
  }

  // protected async shouldUseMcpTools(state: typeof this.stateAnnotation.State) {
  //   if (state.context.length === 0) return 'mcp_tools';
  //   const relevanceThreshold = 0.7; // TODO:
  //   const relevanceScores = await this.calculateRelevanceScores(
  //     state.question,
  //     state.context,
  //   );
  //   const avgRelevance =
  //     relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length;
  //   // return avgRelevance < relevanceThreshold ? 'mcp_tools' : 'generate';
  //   return 'mcp_tools';
  // }

  // protected async calculateRelevanceScores(question: string, documents: Document[]) {
  //   const questionEmbedding = await this.embeddings.embedQuery(question);
  //   const scores = [];
  //   for (const doc of documents) {
  //     const docEmbedding = await this.embeddings.embedQuery(doc.pageContent);
  //     const similarity = this.cosineSimilarity(questionEmbedding, docEmbedding);
  //     scores.push(similarity);
  //   }
  //   return scores;
  // }

  // protected cosineSimilarity(a: number[], b: number[]) {
  //   const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  //   const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  //   const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  //   return dotProduct / (magnitudeA * magnitudeB);
  // }

  protected async mcpTools(state: typeof this.stateAnnotation.State) {
    // const input = `
    //   Используя доступные инструменты, ответь на вопрос: ${state.question}.
    //   Контекст: ${state.context.map((doc) => doc.pageContent).join('\n')}
    // `;
    const result = await this.agent.invoke({
      messages: [{ role: 'user', content: state.question }],
    });
    let answer = '';
    for (let i = result?.messages.length; i--; )
      if (result?.messages[i]?.content)
        answer +=
          result?.messages[i].constructor.name +
          ': ' +
          result?.messages[i]?.content +
          '\n';
    return {
      answer,
      context: state.context,
    };
  }

  protected async retrieve(state: typeof this.inputStateAnnotation.State) {
    return { context: await this.store.similaritySearch(state.question) };
  }

  protected async generate(state: typeof this.stateAnnotation.State) {
    if (!state.answer) return { answer: '' };
    const messages = await this.promptTemplate.invoke({
      question: state.question,
      context: `
        Ты - ассистент. Твоя задача — быть максимально 
        полезным, предоставляя только фактическую информацию. Ты должен быть 
        дружелюбным, но не слишком болтливым. Контекстная информация приведена 
        ниже. Учитывая контекстную информацию и не имея предварительных знаний, 
        дай ответ на запрос. Отвечай на русском: 
        ${state.answer}`,
    });
    const response = await this.llm.invoke(messages);
    return { answer: response.content };
  }
}
