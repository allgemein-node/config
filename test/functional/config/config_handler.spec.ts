import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';

import {ConfigHandler} from '../../../src/config/ConfigHandler';


@suite('config/ConfigHandler')
class ConfigHandlerTests {


  @test
  'reloading handler'() {
    ConfigHandler.reload();
    expect(ConfigHandler.amount()).to.not.eq(0);

  }

}
