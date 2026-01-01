export interface RegisterDTO {
  FName: string;
  LName: string;
  Email: string;
  Password: string;
  ConfirmedPassword: string;
  OTP?:string;
  ProfilePic?: string | null;
}


export interface LoginDTO {
  email: string;
  password: string;
}


export interface UserProfileDTO {
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
}

/////////////////////////////////////////////////

export interface ForgetPasswordDTO {
  email: string;
}

export interface VerifyCodeDTO {
  email: string;
  code: string;
}

export interface ResetPasswordCodeDTO {
  email: string;
  confirmPassword: string;
}


/////////////////////////////////////////////////
