import {suite, test} from "@testdeck/mocha";
import {expect} from "chai";

import {Config} from "../../src/config/Config";
import {Utils} from "../../src/utils/Utils";
import * as _ from 'lodash'
import {FileConfig} from "../../src/config/handler";
import {IFileConfigOptions} from "../../src/config/handler/IFileConfigOptions";
import {FileSupport} from "../../src/filesupport/FileSupport";
import {PlatformUtils} from "@allgemein/base";

@suite('fixtures/issues_180104')
class Tests {

  @test
  'filename with interpolations is wrongly used'() {
    let filename = PlatformUtils.filename('./${argv.configfile}');
    expect(filename).to.eq('${argv.configfile}');

    filename = PlatformUtils.filename('./${argv.configfile}.json');
    expect(filename).to.eq('${argv.configfile}');

    filename = PlatformUtils.filename('./${argv.configfile}.j.son');
    expect(filename).to.eq('${argv.configfile}.j');

    filename = PlatformUtils.filename('./${app.name}--${env.stage}');
    expect(filename).to.eq('${app.name}--${env.stage}');
  }

  @test
  'extensions with interpolations are wrongly used'() {
    let ext = PlatformUtils.pathExtname('./${argv.configfile}.json');
    expect(ext).to.eq('.json');

    ext = PlatformUtils.pathExtname('./file.json');
    expect(ext).to.eq('.json');

  }


  @test
  'wrong filetype detection in patterns'() {
    FileSupport.reload();
    Config.clear();

    // Normalize
    let cfg = new FileConfig(<IFileConfigOptions>{ file: './${argv.configfile}'});
    let erg = cfg['explodeFilePath']('./${argv.configfile}');
    expect(erg).to.deep.eq({
      dirname: PlatformUtils.pathResolve('.'),
      filename: '${argv.configfile}',
      type: ''
    })

    erg = cfg['explodeFilePath']('./test/${app.name}--${env.stage}');
    expect(erg).to.deep.eq({
      dirname: PlatformUtils.pathResolve('./test'),
      filename: '${app.name}--${env.stage}',
      type: ''
    })

    erg = cfg['explodeFilePath']('./test/${app.name}--${env.stage}.json');
    expect(erg).to.deep.eq({
      dirname: PlatformUtils.pathResolve('./test'),
      filename: '${app.name}--${env.stage}',
      type: '.json'
    })
  }

}
