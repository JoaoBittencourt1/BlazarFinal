export interface User {
  user: {
    id: string;
    email: string;
    user_metadata?: {
      avatar_blob: string;
      avatar_url: string;
      fullname: string;
    };
  };
  recoverPassword: boolean;
}
