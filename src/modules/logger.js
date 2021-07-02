import { enums } from "./enums";

const config = {
  disabledModules: [
    // enums.module.numbers,
    // enums.module.buildings,
    // enums.module.gameState,
    // enums.module.storage,
    // enums.module.toast,
    // enums.module.ui,
    // enums.module.game,
  ],
  minSeverity: enums.severity.Trace,
  traceModuleLoad: true
};

const _logger = {};

_logger.canLog = (severity) => {
  return severity >= config.minSeverity;
}

_logger.trace = (message, ...args) => {
  if(!_logger.canLog(enums.severity.Trace)) { return; }
  console.log(message, ...args);
}


class LoggerInstance {
  constructor(module) {
    this._module = module;
    this._enabled = config.disabledModules.indexOf(module) === -1;
    
    if(this._enabled && config.traceModuleLoad) {
      _logger.trace(`Module "${this._module}" loaded`);
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
