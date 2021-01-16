import {suite, test} from '@testdeck/mocha';
import {JsonFileSupport} from '../../../src/filesupport/types/JsonFileSupport';
import {FileSupport} from '../../../src/filesupport/FileSupport';


@suite('filesupport/FileSupport')
class FileSupportTests {

  @test
  'load predefined types'() {
    // Default
    let test = new JsonFileSupport();
    let res = FileSupport.reload();
  }


}
