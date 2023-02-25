export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserStructure extends UserCredentials {
  email: string;
}

export interface UserRegisterCredentials extends UserStructure {
  passwordConfirmation: string;
  location: string;
  age: string;
  avatar: string;
}
