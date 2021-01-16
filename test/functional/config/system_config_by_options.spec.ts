import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import {Config} from '../../../src/config/Config';


@suite('config/handler/SystemConfig loaded by Config.options')
class SystemConfigTests {


  /**
   * SystemConfig is defined in the default options
   */
  @test
  'load by default'() {
    Config['$self'] = null;
    Config.options();
    let res = Config.hasJar('system');
    expect(res).to.be.true;
  }

  @test
  'load by options'() {
    Config['$self'] = null;
    Config.options({handlers: ['./src/config/handler/SystemConfig.ts'], configs: [{type: 'system'}]});
    let res = Config.hasJar('system');
    expect(res).to.be.true;
  }
}
