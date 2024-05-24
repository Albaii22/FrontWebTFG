export interface userI {
    id: number, // Identifier for the user.
    username: string, // Username of the user.
    profileImageUrl?: string; // Optional URL for the user's profile image.
    email: string, // Email address of the user.
    aboutMe: string, // Description provided by the user.
    registration_date: Date, // Date when the user registered.
}
