const config = {

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

    _logger.traceModuleLoad(this._module);
  }

  traceMethod = (method, ...args) => {
    let append = (args?.length ?? 0) === 0 ? ' called' : '';
    _logger.trace(`[${this._module}.${method}()]${append}`, ...args);
  }
}

const _getInstance = (module) => {
  return new LoggerInstance(module);
}

export const loggerFactory = {
  getInstance: _getInstance
};
