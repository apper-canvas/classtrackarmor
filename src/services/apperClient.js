class ApperClientSingleton {
  constructor() {
    if (ApperClientSingleton.instance) {
      return ApperClientSingleton.instance;
    }
    
    this._client = null;
    this._isInitializing = false;
    ApperClientSingleton.instance = this;
  }

  async getInstance() {
    if (this._client) {
      return this._client;
    }

    if (this._isInitializing) {
      // Wait for initialization to complete
      while (this._isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return this._client;
    }

    return this._initializeClient();
  }

  async _initializeClient() {
    this._isInitializing = true;
    
    try {
      // Check if SDK is available
      if (!window.ApperSDK) {
        console.error('ApperSDK not available');
        return null;
      }

      const { ApperClient } = window.ApperSDK;
      
      this._client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      return this._client;
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      return null;
    } finally {
      this._isInitializing = false;
    }
  }

  reset() {
    this._client = null;
    this._isInitializing = false;
  }
}

const apperClientInstance = new ApperClientSingleton();

export const getApperClient = async () => {
  return await apperClientInstance.getInstance();
};

export default getApperClient;