// import {merge, mergeDeep} from "typescript-object-utils";
// import * as merge from 'deepmerge'
import * as _ from 'lodash';
import {Interpolation} from "@allgemein/base/utils/Interpolation";


export class Utils {

  /**
   * https://stackoverflow.com/questions/1960473/unique-values-in-an-array
   * @param arr
   * @returns {any[]}
   */
  static unique_array(arr: any[]): any[] {
    return arr.filter((v, i, a) => a.indexOf(v) === i);
  }

  static escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  static clone(obj: any) {
    return _.cloneDeep(obj);
  }

  /*
  static mergeArray(dest: any[], source: any[], options?: merge.Options) {
    let res = _.concat(dest, source);
    return Utils.uniqArr(res)
  }
*/

  static uniqArr(res: any[]) {
    return _.uniqBy(res, (entry: any) => {
      let x = null;
      if (_.isFunction(entry)) {
        x = entry.toString();
      } else {
        x = JSON.stringify(entry);
      }
      return x;
    });
  }


  static merge(...args: any[]): any {
    const first = _.cloneDeep(args.shift());
    return _.mergeWith(first, ...args, (dest: any, source: any) => {
      if (_.isArray(dest)) {
        const res = _.concat(dest, source);
        return Utils.uniqArr(res);
      } else if (_.isPlainObject(dest)) {
        return Utils.merge(dest, source);
      } else {
        return source;
      }

    });
    // return merge.all(args, {arrayMerge: this.mergeArray})
    // return _.merge(...args);//merge.all(args)
    /*
     let tmp:any={}
     args.forEach(_x => {tmp = mergeDeep(tmp,_x)})
     return tmp
     */
  }

  // static walk(root: any, fn: Function) {
  //   function walk(obj: any, location: any[] = []) {
  //     if (obj === null || obj === undefined) {
  //       return;
  //     }
  //
  //     Object.keys(obj).forEach((key) => {
  //
  //       // Value is an array, call walk on each item in the array
  //       if (Array.isArray(obj[key])) {
  //         obj[key].forEach((el: any, j: number) => {
  //           fn({
  //             value: el,
  //             key: key,
  //             index: j,
  //             location: [...location, ...[key], ...[j]],
  //             parent: obj,
  //             isLeaf: false
  //           });
  //           walk(el, [...location, ...[key], ...[j]]);
  //         });
  //
  //         // Value is an object, walk the keys of the object
  //       } else if (typeof obj[key] === 'object') {
  //         fn({
  //           value: obj[key],
  //           key: key,
  //           parent: obj,
  //           index: null,
  //           location: [...location, ...[key]],
  //           isLeaf: false
  //         });
  //         walk(obj[key], [...location, ...[key]]);
  //
  //         // We've reached a leaf node, call fn on the leaf with the location
  //       } else {
  //         fn({
  //           value: obj[key],
  //           key: key,
  //           parent: obj,
  //           index: null,
  //           location: [...location, ...[key]],
  //           isLeaf: true
  //         });
  //       }
  //     });
  //   }
  //
  //   walk(root);
  // }

  static get(arr: any, path: string = null): any {
    return Interpolation.get(arr, path);
    // if (path) {
    //   const paths = path.split('.');
    //   let first: string | number = paths.shift();
    //   if (/^[1-9]+\d*$/.test(first)) {
    //     first = parseInt(first);
    //   }
    //   if (arr.hasOwnProperty(first)) {
    //     const pointer: any = arr[first];
    //     if (paths.length === 0) {
    //       return pointer;
    //     } else {
    //       return Utils.get(pointer, paths.join('.'));
    //     }
    //   } else {
    //     // not found
    //     return null;
    //   }
    //
    // }
    // return arr;
  }

  static splitTyped(arr: string, sep: string = '.'): any[] {
    const paths = arr.split('.');
    const normPaths: any[] = [];
    paths.forEach(function (_x) {
      if (typeof _x === 'string' && /\d+/.test(_x)) {
        normPaths.push(parseInt(_x));
      } else {
        normPaths.push(_x);
      }

    });
    return normPaths;
  }

  static set(arr: any, path: string | any[], value: any): boolean {
    let paths = null;
    let first: string | number = null;

    if (typeof path === 'string') {
      paths = Utils.splitTyped(path);
    } else {
      paths = path;
    }
    first = paths.shift();
    const next = paths.length > 0 ? paths[0] : null;


    if (!arr.hasOwnProperty(first)) {
      // new, key doesn't exists
      if (typeof next === 'number') {
        // if next value is a number then this must be an array!
        arr[first] = [];
      } else {
        arr[first] = {};
      }
    } else {
      if (Array.isArray(arr)) {
        if (!(typeof first === 'number')) {
          return false;
        }
      } else if (Array.isArray(arr[first])) {
        if (!(typeof next === 'number')) {
          return false;
        }
      } else if (!Utils.isObject(arr[first])) {
        // primative
        if (Utils.isObject(value)) {
          return false;
        }
      } else {
        if (typeof next === 'number') {
          // must be array
          if (!Array.isArray(arr[first])) {
            return false;
          }
        }
      }
    }

    if (paths.length > 0) {
      return Utils.set(arr[first], paths, value);
    } else {
      arr[first] = value;
      return true;
    }
  }

  static isArray(o: any) {
    return _.isArray(o);
  }

  static isObject(o: any) {
    return _.isObject(o);
  }


  static isString(o: any) {
    return _.isString(o);
  }


  static isEmpty(o: any) {
    return _.isEmpty(o);
  }
}
