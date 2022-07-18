import * as _ from 'lodash';
import {IDirectoryConfigOptions} from './IDirectoryConfigOptions';
import {ConfigJar} from '../ConfigJar';
import {Utils} from '../../utils/Utils';
import {IFilePath} from './IFilePath';
import {IFileConfigOptions} from './IFileConfigOptions';
import {
  DEFAULT_JAR_NAME,
  NAMING_BY_DIRECTORY,
  NAMING_BY_DIRECTORYPATH,
  NAMING_BY_FILENAME,
  NAMING_BY_FULLPATH,
  NamingResolvePattern,
  SELECTOR_SEPARATOR
} from '../../types';
import {ConfigSupport} from '../ConfigSupport';
import multimatch from 'multimatch';
import {FileConfig} from './FileConfig';
import {IConfigData} from '../IConfigData';
import {PlatformUtils} from '@allgemein/base';


/**
 * Load config
 */
export class DirectoryConfig extends ConfigSupport<IDirectoryConfigOptions> {

  static DEFAULT_DIRECTORY_OPTIONS: IDirectoryConfigOptions = {

    namespace: DEFAULT_JAR_NAME,

    dirname: null,

    namespaceing: null,

    namespaceSeparator: '.',

    patternSeparator: '-',

    prefixing: null,

    suffixPattern: []

  };


  constructor(options: IDirectoryConfigOptions, jarsData: IConfigData[] = []) {
    super(_.defaultsDeep(options, DirectoryConfig.DEFAULT_DIRECTORY_OPTIONS), jarsData);
  }

  type(): string {
    return 'directory';
  }

  listFilesInDirectory(): IFileConfigOptions[] {
    const dirname = PlatformUtils.pathNormAndResolve(this.$options.dirname);
    if (!PlatformUtils.fileExist(dirname) || !PlatformUtils.isDir(dirname)) {
      throw new Error('wrong directory ' + dirname);
    }
    const list: string[] = PlatformUtils.load('glob').sync(dirname + '/**');
    const regex: string = Utils.escapeRegExp(this.$options.patternSeparator);

    const patternRegex = new RegExp(regex, 'g');
    const files: IFileConfigOptions[] = [];
    const self = this;

    list.forEach(file_or_dir => {
      let path = file_or_dir.replace(dirname + '', '');

      if (!path) {
        // equals dirname
        return;
      }

      path = path.replace(/^\//, '');
      if (self.$options.exclude && self.$options.exclude.length > 0) {
        // findes if path is excluded
        const result = multimatch([path], self.$options.exclude);
        if (result.length && result[0] === path) {
          return;
        }
      }

      const is_file = PlatformUtils.isFile(file_or_dir);
      const paths = path.replace(/^\//, '').split('/');

      if (is_file) {
        const filename_ext = paths.pop();
        const filename = PlatformUtils.filename(filename_ext);

        if (!patternRegex.test(filename)) {

          const file: IFilePath = {
            dirname: file_or_dir.replace(filename_ext, ''),
            filename: filename,
            type: PlatformUtils.pathExtname(filename_ext, false)
          };

          const fileCfg: IFileConfigOptions = {
            namespace: this.$options.namespace ? this.$options.namespace : DEFAULT_JAR_NAME,
            file: file,
            pattern: []
          };

          const prefixing = DirectoryConfig.resolveName(self.$options.prefixing, paths, filename, SELECTOR_SEPARATOR);
          if (prefixing) {
            fileCfg.prefix = prefixing;
          }

          const namespacing = DirectoryConfig.resolveName(self.$options.namespaceing, paths, filename, self.$options.namespaceSeparator);
          if (namespacing) {
            fileCfg.namespace = namespacing;
          }

          if (this.$options.suffixPattern) {
            this.$options.suffixPattern.forEach(pattern => {
              const _paths = [filename, pattern];
              fileCfg.pattern.push(_paths.join(self.$options.patternSeparator));
            });
          }
          files.push(fileCfg);
        }
      } else {

      }

    });

    return files;
  }

  static resolveName(named: NamingResolvePattern, paths: string[], filename: string, separator: string = '.'): string {
    let v = null;
    if (named) {
      const _paths = Utils.clone(paths);
      switch (named) {
        case NAMING_BY_DIRECTORY:
          v = _paths.pop();
          break;
        case NAMING_BY_DIRECTORYPATH:
          v = _paths.join(separator);
          break;
        case NAMING_BY_FILENAME:
          v = filename;
          break;
        case NAMING_BY_FULLPATH:
          _paths.push(filename);
          v = _paths.join(separator);
          break;
      }
    }
    return v;
  }


  create(): ConfigJar[] {
    const files = this.listFilesInDirectory();
    const jars: { [k: string]: ConfigJar } = {};

    files.forEach(_options => {
      const fileCfg = new FileConfig(_options);
      const jar = fileCfg.create();
      if (jars[jar.namespace]) {
        jars[jar.namespace].merge(jar.data);
        jars[jar.namespace].sources(jar.sources());
      } else {
        jars[jar.namespace] = jar;
      }

    });

    const _jars: ConfigJar[] = [];
    Object.keys(jars).forEach(_k => {
      _jars.push(jars[_k]);
    });

    return _jars;
  }

}
