import { createServerClusters, createServerSymbols, makeClustersFormat } from './helpers';
import { ServerSymbol, ServerWin } from './types';

export type InitRequestData = {
  readonly cols: number;
  readonly rows: number;
  readonly symbols: number;
  readonly size: number;
};

export type InitResponseData = {
  readonly symbols: ReadonlyArray<ServerSymbol>;
  readonly win: ServerWin | null;
};

// server request emulator
export function fetchData(initData: InitRequestData): Promise<InitResponseData> {
  const { cols, rows, symbols, size } = initData;
  const serverSymbols = createServerSymbols(cols, rows, symbols);
  const serverClusters = createServerClusters(serverSymbols);
  const clusters = makeClustersFormat(size, serverClusters);
  const win: ServerWin = {
    clusters,
    totalWin: clusters.reduce((acc, { currentWin }) => acc + currentWin, 0),
  };
  return Promise.resolve({ symbols: serverSymbols.flat(), win });
}
