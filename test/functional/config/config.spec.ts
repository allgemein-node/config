import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import * as os from 'os';

import {Config} from '../../../src/config/Config';
import {ConfigJar} from '../../../src/config/ConfigJar';
import {IConfigData} from '../../../src/config/IConfigData';


@suite('config/Config')
class ConfigTests {


  @test
  'default initialization'() {
    // load default
    Config.clear();
    Config.options();
    expect(Config.instance()['$options'].configs[0].type).to.eq('system');

    Config.clear();
    Config.options({configs: []});
    expect(Config.instance()['$options'].configs.length).to.eq(1);

    Config.clear();
    Config.options({configs: []}, false);

    const instance = Config.instance();
    expect(instance['$options'].configs.length).to.eq(0);
    expect(instance['$options'].handlers.length).to.not.eq(0);
    expect(instance['$options'].fileSupport.length).to.not.eq(0);

    Config.clear();
    const options = Config.options();
    expect(options.configs.length).to.eq(1);
    expect(options.configs).to.deep.include({type: 'system', state: true});

  }


  @test
  'functional'() {
    Config.clear();

    const inst = Config.instance();
    expect(inst['$options'].configs.length).to.eq(1);
    expect(inst['$options'].configs[0].type).to.eq('system');

    expect(Config.hasJar('system')).to.be.true;
    expect(Config.hasJar('default')).to.be.false;

    expect(inst['$jars']['system']['_source'][0]['source']).to.eq('os');
    expect(inst['$jars']['system']['_source'][1]['source']).to.eq('env');
    expect(inst['$jars']['system']['_source'][2]['source']).to.eq('argv');

    // test method jars
    const jars: ConfigJar[] = Config.jars;
    expect(jars.length).to.eq(1);
    expect(jars[0].namespace).to.eq('system');

    // test method jarsData
    const jarsData: IConfigData[] = Config.jarsData;
    expect(jarsData.length).to.eq(1);
    expect(jarsData[0]['os']['hostname']).to.eq(os.hostname());

    // test method get
    expect(Config.get('os').hostname).to.eq(os.hostname());
    expect(Config.get('os.hostname')).to.eq(os.hostname());
    expect(Config.get('os.hostname', 'system')).to.eq(os.hostname());

    // test method set
    expect(Config.set('env.hallo', 'welt', 'system')).to.be.true;
    expect(Config.get('env.hallo')).to.eq('welt');

    expect(Config.set('env.hallo_welt', 'ja')).to.be.true;
    expect(Config.get('env.hallo_welt')).to.eq('ja');

    expect(Config.hasJar('default')).to.be.true;

    // Returns all without system
    const all = Config.get();
    expect(all).has.length(1);
    expect(all[0]).to.deep.include({env: {hallo_welt: 'ja'}});

    // Use fallback for get
    expect(Config.get('env.not_exists', 'NOT_FOUND')).to.eq('NOT_FOUND');


  }

}
