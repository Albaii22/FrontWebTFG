import { CommentsI } from "./comments.interface";

export interface PublicationI {
    content: string;
    vote_count: number;
    timestamp: string;
    comments: CommentsI[];
  }
  