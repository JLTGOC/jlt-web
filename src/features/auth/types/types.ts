export type LoginServiceId = "customs" | "business" | "logistics";

export interface LoginService {
  id: LoginServiceId;
  label: string;
  logos: {
    light: string;
    dark: string;
  };
  redirectTo: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  serviceId: LoginServiceId;
}
