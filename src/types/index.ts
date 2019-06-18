type OptItem = string | number

export type Opts = OptItem[]

interface OptHandler {
  <T>(value: OptItem, T): OptItem | T;
}
export type Args = [string, string, OptHandler?, any?]

export interface Exector {
  name: string;
  beforeExec?(...Opts): string | void;
  exec(...Opts): Promise<void> | void;
  onHelp?(...Opts): string;
  typeDesc?: string;
}

export interface Config extends Exector {
  type: string;
  beforeRegiste?(): [string, Args][];
  useOpts: string[];
  rewrite?: boolean;
}
