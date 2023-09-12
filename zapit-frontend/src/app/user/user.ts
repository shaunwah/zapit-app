export interface User {
  id?: number;
  email: string;
  displayName: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  roles?: string;
  isDeleted?: boolean;
  createdOn?: string;
  updatedOn?: string;
}
