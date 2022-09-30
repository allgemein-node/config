import {IConfigData} from '../config/IConfigData';
import {Utils} from '../utils/Utils';
import {Interpolation} from "@allgemein/base/utils/Interpolation";

const REGEX = /\${[^}]+}/g;


export class InterpolationSupport {

  static exec(data: IConfigData, ...lookup: any[]): void {
    return Interpolation.exec(data,...lookup);
    //
    // if (!lookup.length) {
    //   lookup = [data];
    // } else {
    //   if (Array.isArray(lookup[0])) {
    //     lookup = lookup[0];
    //   }
    // }
    //
    // Utils.walk(data, (x: any) => {
    //   let v = x.value;
    //   if (typeof v === 'string' && REGEX.test(v)) {
    //     const match = v.match(REGEX);
    //     match.forEach(_match => {
    //       const content = _match.replace(/^\${|}$/g, '');
    //       const splits = content.split(':-', 2);
    //       const path = splits.shift();
    //       const hasFallback = splits.length > 0;
    //       const fallback = splits.shift();
    //       let _value = null;
    //
    //       for (let i = 0; i < lookup.length; i++) {
    //         _value = Utils.get(lookup[i], path);
    //         if (_value) {
    //           break;
    //         }
    //       }
    //
    //       if (_value) {
    //         if (x.index !== null) {
    //           x.parent[x.key][x.index] = v = v.replace(_match, _value);
    //         } else {
    //           x.parent[x.key] = v = v.replace(_match, _value);
    //         }
    //       } else {
    //         if (hasFallback) {
    //           if (x.index !== null) {
    //             x.parent[x.key][x.index] = v = v.replace(_match, fallback);
    //           } else {
    //             x.parent[x.key] = v = v.replace(_match, fallback);
    //           }
    //         }
    //       }
    //     });
    //   }
    // });

  }

}
