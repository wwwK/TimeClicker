import gameDom from "./dom";

let toastId = 1;
let toasts = {};

const _toast = (titleOrOptions, body, timeout) => {
  let _safeTitle = titleOrOptions;
  let _safeTimeout = timeout ?? 5000;
  const currentToastId = toastId++;

  if(typeof titleOrOptions === 'object') {
    _safeTitle = titleOrOptions?.title ?? '';
    _safeTimeout = ((titleOrOptions?.timeout ?? undefined) ?? timeout) ?? 5000;
    body = (titleOrOptions?.body ?? body) ?? '';
  }

  const _toast = document.createElement('div');
  _toast.setAttribute('class', 'toast');
  _toast.setAttribute('data-toast-id', currentToastId);

  const _title = document.createElement('div');
  _title.setAttribute('class', 'title');
  _title.innerHTML = _safeTitle;
  _toast.appendChild(_title);

  const _body = document.createElement('div');
  _body.setAttribute('class', 'body');
  _body.innerHTML = body;
  _toast.appendChild(_body);

  gameDom.toaster.appendChild(_toast);
  toasts[currentToastId] = {
    timeout: setTimeout(() => { _clearToast(currentToastId); }, _safeTimeout),
    ref: _toast
  };
}

const _clearToast = (toastId) => {
  if(!toasts.hasOwnProperty(toastId)) {
    return;
  }

  toasts[toastId].ref?.parentNode?.removeChild(toasts[toastId].ref);
  delete toasts[toastId];
}

document.addEventListener('click', e => {
  if(!e?.target?.parentElement?.classList?.contains('toast')) {
    return;
  }

  const toast = e.target.parentElement;
  const toastId = parseInt(toast?.dataset?.toastId ?? '0');
  if(isNaN(toastId) || toastId === 0) {
    return;
  }

  if(!toasts.hasOwnProperty(toastId)) {
    return;
  }

  clearTimeout(toasts[toastId].timeout);
  _clearToast(toastId);
});

export const toast = {
  show: _toast
};