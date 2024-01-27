export type LoginAuthResponseFailure = {
  error: string;
  error_description: string;
  state: string;
};

export type LoginAuthRequestSuccess = {
  code: string;
};

export type LoginAuthResponse<T extends 'success' | 'failure' | 'any' = 'any'> = T extends 'success'
  ? LoginAuthRequestSuccess
  : T extends 'failure'
    ? LoginAuthResponseFailure
    : LoginAuthRequestSuccess | LoginAuthResponseFailure;

export const isLoginAuthResponseSuccess = (response: LoginAuthResponse): response is LoginAuthRequestSuccess => 'code' in response;
