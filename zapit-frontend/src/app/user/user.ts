export interface User {
  id?: number;
  emailAddress: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  roles?: string;
  isDeleted?: boolean;
  createdOn?: number;
  updatedOn?: number;
}
