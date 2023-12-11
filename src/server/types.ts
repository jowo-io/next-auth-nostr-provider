export type ClientSession = {
  data: {
    k1: string;
    lnurl: string;
  };
  intervals: {
    poll: number;
    create: number;
  };
  query: {
    state: string;
    redirectUri: string;
  };
};
