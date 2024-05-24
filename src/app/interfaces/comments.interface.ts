export interface CommentsI {
    content: string, // Defines the content of the comment.
    timestamp: string; // Specifies the timestamp of when the comment was made.
    userId: number, // Identifies the user who made the comment.
    publicationId: number, // Identifies the publication to which the comment belongs.
}
