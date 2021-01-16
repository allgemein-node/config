import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import {JsonFileSupport} from '../../../src/filesupport/types/JsonFileSupport';


@suite('filesupport/types/JsonFileSupport')
class JsonSupportTests {


  @test
  'parse simple json'() {
    let reader = new JsonFileSupport();
    let data = reader.parse('{"hallo":"welt"}');
    expect(data).to.deep.eq({hallo: 'welt'});
  }

}
