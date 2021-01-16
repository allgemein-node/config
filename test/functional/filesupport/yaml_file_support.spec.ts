import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';

import {YamlFileSupport} from '../../../src/filesupport/types/YamlFileSupport';


@suite('filesupport/types/YamlFileSupport')
class YamlSupportTests {


  @test
  'libaries must exist'() {
    let reader = new YamlFileSupport();
    reader.requirements();
  }

  @test
  'supports types'() {
    let reader = new YamlFileSupport();
    let types = reader.supportedTypes();
    expect(Array.isArray(types)).to.be.true;
    expect(types).to.contain('yml');
    expect(types).to.contain('yaml');
  }

  @test
  'parse simple'() {
    let reader = new YamlFileSupport();
    let data = reader.parse('hallo: welt');
    expect(data).to.deep.eq({hallo: 'welt'});
  }

}
