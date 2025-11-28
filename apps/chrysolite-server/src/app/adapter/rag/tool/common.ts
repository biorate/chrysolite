import { z, ZodType } from 'zod';
import { Singleton } from '@biorate/singleton';
import { InferInteropZodInput } from '@langchain/core/utils/types';
import { tool } from '@langchain/core/tools';

export abstract class CommonTool extends Singleton {
  public static get<T extends CommonTool>() {
    return this.instance<T>().tool;
  }

  #tool: ReturnType<typeof tool>;

  protected get name() {
    return this.constructor.name;
  }

  protected get tool() {
    if (!this.#tool)
      this.#tool = tool(this.execute.bind(this), {
        name: this.name,
        description: this.description,
        schema: this.schema,
      });
    return this.#tool;
  }

  protected abstract description: string;

  protected abstract schema: unknown;

  protected abstract execute(data: InferInteropZodInput<ZodType>): Promise<string>;
}
