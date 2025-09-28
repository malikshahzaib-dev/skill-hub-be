interface MyError {
  statusCode: number;
  status?: string;
  isOperational?: boolean;
  path: string;
  value: string;
  code: number;
  keyValue: {
    [key: string]: string;
  };
  errors: Error[];    
}

class AppError extends Error implements MyError {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
  status?: string | undefined;
  path: string = "";
  value: string = "";
  code: number = 0;
  keyValue: { [key: string]: string } = {};
  errors: Error[] = [];
}

export default AppError;
