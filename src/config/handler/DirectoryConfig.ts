import {IDirectoryConfigOptions} from "./IDirectoryConfigOptions";
import {ConfigJar} from "../ConfigJar";
import {PlatformTools} from "../../utils/PlatformTools";

import {Utils} from "../../utils/Utils";
import {IFilePath} from "./IFilePath";
import {IFileConfigOptions} from "./IFileConfigOptions";
import {
    NAMING_BY_DIRECTORY,
    NAMING_BY_DIRECTORYPATH,
    NAMING_BY_FILENAME,
    NAMING_BY_FULLPATH,
    DEFAULT_JAR_NAME, SELECTOR_SEPARATOR, NamingResolvePattern
} from "../../types";
import {ConfigSupport} from "../ConfigSupport";
import * as multimatch from "multimatch";
import {FileConfig} from "./FileConfig";


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

    }



    constructor(options: IDirectoryConfigOptions) {
        super(Utils.merge(DirectoryConfig.DEFAULT_DIRECTORY_OPTIONS, options))
    }

    type(): string {
        return 'directory'
    }

    listFilesInDirectory(): IFileConfigOptions[] {
        let dirname = PlatformTools.pathNormAndResolve(this.$options.dirname)
        if (!PlatformTools.fileExist(dirname) || !PlatformTools.isDir(dirname)) {
            throw new Error('wrong directory ' + dirname)
        }
        let list: string[] = PlatformTools.load("glob").sync(dirname + '/**')
        let regex: string = Utils.escapeRegExp(this.$options.patternSeparator);

        let patternRegex = new RegExp(regex, 'g');
        let files: IFileConfigOptions[] = []
        let self = this

        list.forEach(file_or_dir => {
            let path = file_or_dir.replace(dirname + '', '')

            if (!path) {
                // equals dirname
                return;
            }

            path = path.replace(/^\//, '')
            if(self.$options.exclude && self.$options.exclude.length > 0){
                // findes if path is excluded
                let result = multimatch([path],self.$options.exclude)
                if(result.length && result[0] == path){
                    return
                }
            }

            let is_file = PlatformTools.isFile(file_or_dir)
            let paths = path.replace(/^\//, '').split('/')

            if (is_file) {
                let filename_ext = paths.pop()
                let filename = PlatformTools.filename(filename_ext)

                if (!patternRegex.test(filename)) {

                    let file: IFilePath = {
                        dirname: file_or_dir.replace(filename_ext, ''),
                        filename: filename,
                        type: PlatformTools.pathExtname(filename_ext, false)
                    }

                    let fileCfg: IFileConfigOptions = {
                        namespace: DEFAULT_JAR_NAME,
                        file: file,
                        pattern: []
                    }

                    let prefixing = DirectoryConfig.resolveName(self.$options.prefixing, paths, filename, SELECTOR_SEPARATOR)
                    if (prefixing) {
                        fileCfg.prefix = prefixing
                    }

                    let namespacing = DirectoryConfig.resolveName(self.$options.namespaceing, paths, filename, self.$options.namespaceSeparator)
                    if (namespacing) {
                        fileCfg.namespace = namespacing
                    }

                    if (this.$options.suffixPattern) {
                        this.$options.suffixPattern.forEach(pattern => {
                            let _paths = [filename, pattern]
                            fileCfg.pattern.push(_paths.join(self.$options.patternSeparator))
                        })
                    }
                    files.push(fileCfg)
                }
            } else {

            }

        })

        return files
    }

    static resolveName(named: NamingResolvePattern, paths: string[], filename: string, separator: string = '.'): string {
        let v = null
        if (named) {
            let _paths = Utils.clone(paths)
            switch (named) {
                case NAMING_BY_DIRECTORY:
                    v = _paths.pop()
                    break;
                case NAMING_BY_DIRECTORYPATH:
                    v = _paths.join(separator)
                    break;
                case NAMING_BY_FILENAME:
                    v = filename
                    break;
                case NAMING_BY_FULLPATH:
                    _paths.push(filename)
                    v = _paths.join(separator)
                    break;
            }
        }
        return v
    }


    create(): ConfigJar[] {
        let files = this.listFilesInDirectory()
        let jars:{[k:string]:ConfigJar} = {}

        files.forEach(_options => {
            let fileCfg = new FileConfig(_options)
            let jar = fileCfg.create()
            jars[jar.namespace] = jar
        })

        let _jars:ConfigJar[] = []
        Object.keys(jars).forEach(_k => {
            _jars.push(jars[_k])
        })

        return _jars
    }

}
