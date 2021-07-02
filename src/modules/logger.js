import { enums } from "./enums";

const config = {
  disabledModules: [
    enums.module.numbers,
    enums.module.buildings,
    enums.module.gameState,
    enums.module.storage,
    enums.module.toast,
    enums.module.ui,
    enums.module.game,
  ]
};

const _logger = {};

_logger.traceModuleLoad = (module) => {
  console.log(`Module "${module}" loaded`);
}

_logger.trace = (message, ...args) => {
  console.log(message, ...args);
}



class LoggerInstance {
  constructor(module) {
    this._module = module;
    this._enabled = config.disabledModules.indexOf(module) === -1;
    
    if(this._enabled) {
      _logger.traceModuleLoad(this._module);
    }
  }

  traceMethod = (method, ...args) => {
    if(!this._canLog()) { return; }
    let append = (args?.length ?? 0) === 0 ? 'called' : '';
    _logger.trace(`${this._module}.${method}() :: ${append}`, ...args);
  }

  _canLog = () => {
    if(!this._enabled) { return false; }

    return true;
  }
}

const _getInstance = (module) => {
  return new LoggerInstance(module);
}

export const loggerFactory = {
  getInstance: _getInstance
};
