import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { EnvService } from '@app/shared/services/env.service';



export function convertUrlToPlaceholderPath(url: string) {
  var envService = EnvService.instance;
  const {fileDynamicPlaceholder, fileDynamicPlaceholderUrl} = envService.configuration ?? environment;
  return url?.replace(new RegExp(fileDynamicPlaceholderUrl, 'g'), fileDynamicPlaceholder);
}

export function convertPlaceholderPathToUrl(path: string) {
  var envService = EnvService.instance;
  const {fileDynamicPlaceholder, fileDynamicPlaceholderUrl} = envService.configuration ?? environment;
  return path?.replace(new RegExp(fileDynamicPlaceholder, 'g'), fileDynamicPlaceholderUrl);
}
