import { CommentsI } from "./comments.interface";

export interface PublicationI {
    id: number; // Identifier for the publication.
    user_id: number; // Identifier for the user who published it.
    content: string; // Content of the publication.
    vote_count: number; // Number of votes received by the publication.
    timestamp: string; // Timestamp indicating when the publication was made.
    comments: CommentsI[]; // Array of comments associated with the publication.
    liked_by_user: boolean; // Indicates whether the current user has liked the publication.
    likedBy: number[]; // Array of user IDs who have liked the publication.
}
