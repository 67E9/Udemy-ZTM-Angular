import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
//the purpose of this pipe is to circumvent the angular sanitization securtiy feature for URLs, which can be considered safe by the dev
//use with caution! this is only intended for internal URLs
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer){  }

  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
