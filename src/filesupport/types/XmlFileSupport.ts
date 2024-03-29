import {IConfigData} from '../../config/IConfigData';
import {IFileSupport} from '../IFileSupport';
import {PlatformUtils} from '@allgemein/base';

let XML: any;

export class XmlFileSupport implements IFileSupport{

  requirements(): void {
    PlatformUtils.load('x2js');
  }

  supportedTypes(): string | string[] {
    return 'xml';
  }

  parse(content: string): IConfigData{
    if(!XML){
      XML = PlatformUtils.load('x2js');
    }
    const x2js = new XML();
    let rawConfig: IConfigData = x2js.xml2js(content);
    const rootKeys = Object.keys(rawConfig);
    if(rootKeys.length == 1) {
      rawConfig = rawConfig[rootKeys[0]];
    }
    return rawConfig;
  }

}
