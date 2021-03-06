import { Affiliation } from "./affiliation";

export interface PaperAuthor {
  id: number;
  order: number;
  name: string;
  organization: string;
  hindex: number;
  affiliation: Affiliation;
}
