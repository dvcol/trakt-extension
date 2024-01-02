export const TraktResponseCode = {
  /** Success */
  Success: 200,
  /** Success - new resource created (POST) */
  PostSuccess: 201,
  /**	Success - no content to return (DELETE) */
  DeleteSuccess: 204,
  /** Bad Request - request couldn't be parsed */
  BadRequest: 400,
  /** Unauthorized - OAuth must be provided */
  Unauthorized: 401,
  /** Forbidden - invalid API key or unapproved app */
  Forbidden: 403,
  /** Not Found - method exists, but no record found */
  NotFound: 404,
  /** Method Not Found - method doesn't exist */
  MethodNotFound: 405,
  /** Conflict - resource already created */
  Conflict: 409,
  /** Precondition Failed - use application/json content type */
  PreconditionFailed: 412,
  /** Account Limit Exceeded - list count, item count, etc */
  AccountLimitExceeded: 420,
  /** Unprocessable Entity - validation errors */
  UnprocessableEntity: 422,
  /** Locked User Account - have the user contact support */
  LockedUserAccount: 423,
  /** VIP Only - user must upgrade to VIP */
  VIPOnly: 426,
  /** Rate Limit Exceeded */
  RateLimitExceeded: 429,
  /** Server Error - please open a support ticket */
  ServerError: 500,
  /** Service Unavailable - Bad Gateway - server overloaded (try again in 30s) */
  BadGateway: 502,
  /** Service Unavailable - server overloaded (try again in 30s) */
  ServiceUnavailable: 503,
  /** Service Unavailable - Gateway Timeout - server overloaded (try again in 30s) */
  GatewayTimeout: 504,
  /** Service Unavailable - Cloudflare error */
  CloudflareError: 520,
  /** Service Unavailable - Web server is down - Cloudflare error */
  WebServerIsDown: 521,
  /** Service Unavailable - Cloudflare error */
  TCPError: 522,
};
