export interface IRequest {
    sourceIp:any;
    prefered_Language:any;
    entityId: any;
    deviceId: any;
    map: any;
  }

export interface IStatus {
    SUCCESS: number,
    ERR_CODE_BAD_REQUEST: number,
    ERR_CODE_UNAUTHORIZED: number,
    ERR_CODE_FORBIDDEN: number,
    ERR_CODE_NOT_FOUND: number,
    ERR_CODE_METHOD_NOT_ALLOWED: number,
    ERR_CODE_SERVER_ERROR: number,
    ERR_CODE_SERVER_UNAVAILABLE: number,
    ERR_CODE_TIMEOUT: number,
    ERR_CODE_UNKNOWN: number,
}

