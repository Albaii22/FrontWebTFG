import { CommentsI } from "./comments.interface";

export interface PublicationI {
    id: number;
    user_id: number;
    content: string;
    vote_count: number;
    timestamp: string;
    comments: CommentsI[];
  }
  