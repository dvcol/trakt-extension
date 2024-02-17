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

export const isLoginAuthResponseSuccess = <T extends Record<string, unknown>>(
  response: LoginAuthResponse | T,
): response is LoginAuthRequestSuccess & T => 'code' in response;
