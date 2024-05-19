import { CommentsI } from "./comments.interface";

export interface PublicationI {
    content: string;
    vote_count: number;
    comments: CommentsI[];
  }
  