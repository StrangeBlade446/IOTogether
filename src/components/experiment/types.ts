export type ExperimentState = {
  connected: [boolean, boolean]; // [0: keeper, 1: seeker]
  connectedSocket: 'keeper' | 'seeker' | null;
  dragging: boolean;
  nearSocket: number | null;
  ready: boolean;
};

export type ExperimentHandle = {
  reset: () => void;
  connectTo: (socketIndex: number) => void;
  adjustDepth: (delta: number) => void;
  setSound: (value: boolean) => void;
};
