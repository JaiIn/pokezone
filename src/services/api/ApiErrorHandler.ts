export class ApiErrorHandler {
  static handleApiError(error: any, context: string): never {
    console.error(`API Error in ${context}:`, error);
    throw new Error(`Failed to ${context}.`);
  }
  
  static async safeApiCall<T>(
    apiCall: () => Promise<T>, 
    errorContext: string,
    fallback?: T
  ): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      console.error(`${errorContext}:`, error);
      if (fallback !== undefined) return fallback;
      throw new Error(`Failed to ${errorContext.toLowerCase()}.`);
    }
  }
}
