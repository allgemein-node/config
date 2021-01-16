import {IConfigData} from "../config/IConfigData";

export interface IFileSupport {

    requirements?(done?:Function):void

    supportedTypes():string|string[];

    read?(path: string):IConfigData;

    parse?(content:string):IConfigData;

}
