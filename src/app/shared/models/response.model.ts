export interface IResponse {
  responseSuccess: boolean;
  responseDesc: any | {
    deleted: number;
    errors: number;
    generated_keys?: Array<string>;
    inserted: number;
    replaced: number;
    skipped: number;
    unchanged: number;
  };
}
