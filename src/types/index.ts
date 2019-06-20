type OptItem = string | number

export type Opts = OptItem[]

interface OptHandler {
  <T>(value: OptItem, res?: T): OptItem | T;
}
export type Args = [string, string, (OptHandler | any)?, any?]

export interface Exector {
  name: string;
  beforeExec?(...args: Opts): string | void;
  exec(...args: Opts): Promise<void> | void;
  onHelp?(...args: Opts): string;
  desc?: string;
}

export interface Config extends Exector {
  type: string;
  beforeRegiste?(): [string, Args][];
  useOpts: string[];
  rewrite?: boolean;
  typeDesc?: string;
  isSingle?: boolean;
}

export type CmdArg = [string, string, boolean]; // name desc isSingle
export interface CmdData {
  desc: string;
  data: Exector[];
  isSingle: boolean;
}

export interface ConfKey<T> {
  type: (c: {new(): T}) => T;
  defaultValue?: T;
  check?: (item: T) => boolean; // item is T;
}

export type ConfKeys = {
  [prop in keyof Config]?: ConfKey<Config[prop]>;
};

export type CmdPkg = Config | (() => Config);

