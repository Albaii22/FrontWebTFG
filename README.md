# Angular Social Media App

This Angular Social Media App is a project aimed at building a social media platform where users can register, login, create publications, comment on publications, like publications, and view other users' profiles.

## Project Structure

The project follows a typical Angular application structure with components, services, guards, interfaces, and routes organized into different modules.

### Components
- **LoginComponent**: Responsible for user login functionality.
- **RegisterComponent**: Handles user registration.
- **HomeComponent**: Displays the home page with user publications.
- **ProfileComponent**: Shows the user's profile page.
- **UsersViewComponent**: Displays a view for all users.
- **NewPostComponent**: Provides a modal for creating a new publication.
- **EditPostComponent**: Allows users to edit their publications.
- **CommentComponent**: Modal for commenting on publications.
- **AboutmeComponent**: Modal for updating user profile information.

### Services
- **AuthService**: Manages authentication-related functionalities like login and registration.
- **TokenService**: Handles token management, including setting, getting, and removing tokens.
- **UserService**: Handles user-related functionalities like fetching user data, updating profiles, and retrieving user information from tokens.
- **PublicationsService**: Responsible for CRUD operations related to user publications, including creating, updating, deleting, and fetching publications.
- **CommentsService**: Handles CRUD operations related to comments on publications.

### Guards
- **AuthGuard**: Ensures that only authenticated users can access certain routes like home, profile, and user view.

### Interceptors
- **interceptorJwtInterceptor**: Intercepts HTTP requests to add JWT tokens to the authorization headers for authenticated users.

## Key Features

- **Authentication**: Users can register and log in securely using JWT tokens.
- **User Profile Management**: Users can update their profiles, including profile pictures and about me sections.
- **Publication Management**: Users can create, edit, and delete their publications.
- **Comments and Likes**: Users can comment on and like publications.
- **User Interaction**: Users can view other users' profiles, follow/unfollow users, and interact with their publications.

## Installation and Usage

To run the application:
1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Run the Angular application using `ng serve`.

Ensure that the backend API server is running and accessible at `http://localhost:8082`, as the frontend makes HTTP requests to this endpoint.

## Further Improvements

- **Security Enhancements**: Implement additional security measures like input validation, CSRF protection, and secure storage of tokens.
- **Error Handling**: Improve error handling by providing user-friendly error messages and logging errors more comprehensively.
- **Performance Optimization**: Optimize the application for better performance, especially in fetching and displaying large datasets.
- **UI/UX Enhancements**: Improve the user interface and experience to make the application more intuitive and visually appealing.
- **Testing**: Write comprehensive unit and integration tests to ensure the reliability and stability of the application.
- **Documentation**: Enhance code documentation to improve readability and maintainability, including inline comments, JSDoc comments, and a detailed README.

## Conclusion

The Angular Social Media App is a comprehensive project that demonstrates various aspects of building a modern web application using Angular. With its features and functionalities, it provides a solid foundation for further development and customization to meet specific requirements.
