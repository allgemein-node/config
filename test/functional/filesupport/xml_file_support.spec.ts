import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import {XmlFileSupport} from '../../../src/filesupport/types/XmlFileSupport';


//import * as config from 'config';


@suite('filesupport/types/XmlFileSupport')
class XmlCfgReaderTests {


  @test
  'libaries must exist'() {
    let reader = new XmlFileSupport();
    reader.requirements();
  }

  @test
  'parse simple xml'() {
    let reader = new XmlFileSupport();
    reader.requirements();
    let data = reader.parse('<xml><hallo>welt</hallo></xml>');
    expect(data).to.deep.eq({hallo: 'welt'});
  }

}
