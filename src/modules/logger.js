import { enums } from "./enums";

const config = {
  enabled: true,
  disabledModules: [
    // enums.module.numbers,
    // enums.module.buildings,
    // enums.module.gameState,
    // enums.module.storage,
    // enums.module.toaster,
    // enums.module.ui,
    // enums.module.game,
    // enums.module.gameSave,
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

_logger.error = (message, ...args) => {
  if(!_logger.canLog(enums.severity.Trace)) { return; }
  console.error(message, ...args);
}


class LoggerInstance {
  constructor(module) {
    this._module = module;

    // Handle disabling this logger instance
    this._enabled = config.disabledModules.indexOf(module) === -1;
    if(config.enabled === false) { this._enabled = false; }
    
    if(this._enabled && config.traceModuleLoad) {
      _logger.trace(`Module "${this._module}" loaded`);
    }
  }

  traceMethod = (method, ...args) => {
    if(!this._canLog()) { return; }
    let append = (args?.length ?? 0) === 0 ? 'called' : '';
    _logger.trace(`${this._module}.${method}() :: ${append}`, ...args);
  }

  error = (method, error) => {
    if(!this._canLog()) { return; }
    _logger.error(`${this._module}.${method}() :: ${error}`);
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

export const devLogger = {
  huge(message) {
    console.log(`%c${message}`, 'font-size: 36px');
  }
};
