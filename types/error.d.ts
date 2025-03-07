export interface SearchError extends Error {
  code?: string;
  status?: number;
}

export interface TrendsError extends Error {
  code?: string;
  status?: number;
}
