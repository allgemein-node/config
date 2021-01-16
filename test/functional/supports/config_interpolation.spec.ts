import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import {Config} from '../../../src/config/Config';


@suite('supports/InterpolationSupports used in ConfigSupport')
class ConfigInterpolationTests {


  @test
  'config support interpolation'() {
    process.argv.push('--configfile', __dirname + '/../testfolders/file/config/default.json');
    Config['$self'] = null;
    Config.options({
      configs: [
        {type: 'file', file: '${argv.configfile}'}
      ]
    });

    // console.log(inspect(Config.jarsData,false,10))

    expect(Config.get('hallo')).to.eq('welt');

  }

}
