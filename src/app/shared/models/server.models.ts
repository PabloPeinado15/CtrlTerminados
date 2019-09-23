export interface ServerResponse {
  responseCode: number;
  responseDesc: {
    deleted: number;
    errors: number;
    generated_keys?: Array<string>;
    inserted: number;
    replaced: number;
    skipped: number;
    unchanged: number;
  };
}
