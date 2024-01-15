import { ServerCluster, ServerSymbol } from './types';
import { getRandomInt } from './utils';

export function createSymbol(x: number, y: number, id: number): ServerSymbol {
  return { id, position: { x, y } };
}

export function createServerSymbols(
  cols: number,
  rows: number,
  symbols: number,
): ReadonlyArray<ReadonlyArray<ServerSymbol>> {
  return new Array(cols).fill(0).map((_, col) => {
    return new Array(rows).fill(0).map((_, row) => {
      return createSymbol(col, row, getRandomInt(1, symbols));
    });
  });
}

export function createServerClusters(
  symbols: ReadonlyArray<ReadonlyArray<ServerSymbol>>,
): ReadonlyArray<ReadonlyArray<ServerSymbol>> {
  const visitedSymbols = new Set<ServerSymbol>();
  const currentSymbols = new Set<ServerSymbol>();
  const addSymbol = (id: number, symbol?: ServerSymbol): ReadonlyArray<ServerSymbol> => {
    const clusters = new Array<ServerSymbol>();
    if (!symbol) return clusters;
    if (currentSymbols.has(symbol)) return clusters;
    if (symbol.id !== id) {
      currentSymbols.add(symbol);
      return clusters;
    }
    visitedSymbols.add(symbol);
    currentSymbols.add(symbol);
    clusters.push(symbol);
    const { x, y } = symbol.position;
    clusters.push(...addSymbol(id, symbols[x]?.[y - 1]));
    clusters.push(...addSymbol(id, symbols[x]?.[y + 1]));
    clusters.push(...addSymbol(id, symbols[x - 1]?.[y]));
    clusters.push(...addSymbol(id, symbols[x + 1]?.[y]));
    return clusters;
  };
  return symbols.flatMap((rows) => {
    return rows
      .map<ReadonlyArray<ServerSymbol> | undefined>((symbol) => {
        if (visitedSymbols.has(symbol)) return;
        currentSymbols.clear();
        visitedSymbols.add(symbol);
        return addSymbol(symbol.id, symbol);
      })
      .filter((data): data is ReadonlyArray<ServerSymbol> => !!data);
  });
}

export function makeClustersFormat(
  size: number,
  clusters: ReadonlyArray<ReadonlyArray<ServerSymbol>>,
): ReadonlyArray<ServerCluster> {
  return clusters
    .filter((cluster) => cluster.length >= size)
    .map((cluster) => ({ symbols: cluster, currentWin: cluster.length * 100 }));
}
