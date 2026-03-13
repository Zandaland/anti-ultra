(function initExtensionApi(globalScope) {
  const extensionRoot = globalScope.browser ?? globalScope.chrome;
  const promiseBasedApi = typeof globalScope.browser !== "undefined";
  const syncArea = extensionRoot?.storage?.sync ?? null;
  const localArea = extensionRoot?.storage?.local ?? null;

  let storageArea = syncArea || localArea;
  let storageAreaName = syncArea ? "sync" : "local";

  function useLocalStorage() {
    if (!localArea || storageArea === localArea) {
      return false;
    }

    storageArea = localArea;
    storageAreaName = "local";
    return true;
  }

  function getWithArea(area, defaults, callback, onFailure) {
    if (!area?.get) {
      callback(defaults);
      return;
    }

    if (promiseBasedApi) {
      area.get(defaults).then(callback).catch(onFailure);
      return;
    }

    try {
      area.get(defaults, (result) => {
        const lastError = extensionRoot?.runtime?.lastError;
        if (lastError) {
          onFailure(new Error(lastError.message));
          return;
        }

        callback(result);
      });
    } catch (error) {
      onFailure(error);
    }
  }

  function setWithArea(area, values, callback, onFailure) {
    if (!area?.set) {
      callback();
      return;
    }

    if (promiseBasedApi) {
      area.set(values).then(() => callback()).catch(onFailure);
      return;
    }

    try {
      area.set(values, () => {
        const lastError = extensionRoot?.runtime?.lastError;
        if (lastError) {
          onFailure(new Error(lastError.message));
          return;
        }

        callback();
      });
    } catch (error) {
      onFailure(error);
    }
  }

  function get(defaults, callback) {
    const currentArea = storageArea;

    getWithArea(
      currentArea,
      defaults,
      callback,
      () => {
        if (currentArea !== localArea && useLocalStorage()) {
          getWithArea(localArea, defaults, callback, () => callback(defaults));
          return;
        }

        callback(defaults);
      }
    );
  }

  function set(values, callback = () => {}) {
    const currentArea = storageArea;

    setWithArea(
      currentArea,
      values,
      callback,
      () => {
        if (currentArea !== localArea && useLocalStorage()) {
          setWithArea(localArea, values, callback, () => callback());
          return;
        }

        callback();
      }
    );
  }

  globalScope.extensionApi = {
    get(defaults, callback) {
      get(defaults, callback);
    },
    getStorageAreaName() {
      return storageAreaName;
    },
    onStorageChanged(listener) {
      extensionRoot?.storage?.onChanged?.addListener(listener);
    },
    set(values, callback) {
      set(values, callback);
    }
  };
})(globalThis);
