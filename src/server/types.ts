export type Position = {
  readonly x: number;
  readonly y: number;
};

export type ServerSymbol = {
  readonly id: number;
  readonly position: Position;
};

export type ServerCluster = {
  readonly currentWin: number;
  readonly symbols: ReadonlyArray<ServerSymbol>;
};

export type ServerWin = {
  readonly totalWin: number;
  readonly clusters: ReadonlyArray<ServerCluster>;
};
