export {};
declare global {
  namespace Express {
    interface Request {
      service_provider_user_id: number;
      service_provider_id : number;
      supplier_id : number;
    }
  }
}
