declare module "papaparse" {
  export interface ParseError {
    type: string;
    code: string;
    message: string;
    row: number;
  }

  export interface ParseMeta {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
    fields?: string[];
  }

  export interface ParseResult<T = any> {
    data: T[];
    errors: ParseError[];
    meta: ParseMeta;
  }

  export interface ParseConfig<T = any> {
    header?: boolean;
    skipEmptyLines?: boolean | "greedy";
    dynamicTyping?: boolean;
    delimiter?: string;
    newline?: string;
    encoding?: string;
    quoteChar?: string;
    escapeChar?: string;
    comments?: boolean | string;
    complete?: (results: ParseResult<T>, file?: File) => void;
    error?: (error: Error, file?: File) => void;
    transformHeader?: (header: string, index: number) => string;
    transform?: (value: string, field: string | number) => any;
  }

  export interface PapaParse {
    parse<T = any>(
      input: string,
      config?: ParseConfig<T>
    ): ParseResult<T>;

    parse<T = any>(
      input: File,
      config?: ParseConfig<T>
    ): void;

    unparse<T = any>(
      data: T[] | object,
      config?: any
    ): string;
  }

  const Papa: PapaParse;

  export default Papa;
}
