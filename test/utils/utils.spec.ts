
import * as mocha from 'mocha';
describe('',()=>{})


import {suite, test, slow, timeout, pending} from "mocha-typescript";
import {expect} from "chai";
import {inspect} from "util";
import {ConfigJar} from "../../src/config/ConfigJar";
import {FileSupport} from "../../src/filesupport/FileSupport";
import {Utils} from "../../src/utils/Utils";


//import * as config from 'config';



@suite('utils/Utils')
class UtilsTests {

    @test
    'set' () {
        // set first value x=1
        let x:any = {}
        let z = Utils.set(x,'x',1)
        expect(z).to.be.true
        expect(x).to.deep.eq({x:1})

        // set first value y=2
        z = Utils.set(x,'y',2)
        expect(z).to.be.true
        expect(x).to.deep.eq({x:1,y:2})

        z = Utils.set(x,'z.0',3)
        expect(z).to.be.true
        expect(x).to.deep.eq({x:1,y:2,z:[3]})

        z = Utils.set(x,'z.1',4)
        expect(z).to.be.true
        expect(x).to.deep.eq({x:1,y:2,z:[3,4]})

        // Override existing as array
        z = Utils.set(x,'z.1',5)
        expect(z).to.be.true
        expect(x).to.deep.eq({x:1,y:2,z:[3,5]})

        // Override failed wrong type
        z = Utils.set(x,'z',5)
        expect(z).to.be.false
        expect(x).to.deep.eq({x:1,y:2,z:[3,5]})

        // set array y.0 => create array
        // set array z.x => create object


/*
        z = Utils.set(x,'z',3)
        expect(z).to.be.true
        expect(x).to.deep.eq({x:2,y:1,z:3})

        // Override?
        /*
        z = Utils.set(x,'x.y',2)
        expect(z).to.be.true
        expect(x).to.deep.eq({x:{y:2},y:1})
*/
    }

    @test
    'get' () {
        let x:any = {x:1,y:1}
        let z = Utils.get(x,'x')
        expect(z).to.eq(1)

        x = {x:{y:2}}
        z = Utils.get(x,'x.y')
        expect(z).to.eq(2)

        x = {x:{y:['test']}}
        z = Utils.get(x,'x.y.0')
        expect(z).to.eq('test')

        x = {x:{y:['test']}}
        z = Utils.get(x,'x.y.1')
        expect(z).to.null
    }

    @test
    'walk' () {
        let x:any = {x:1,y:1}
        Utils.walk(x,(data:any) => {
            data.parent[data.key] = 2
        })
        expect(x).to.deep.eq({x:2,y:2})

    }


    @test
    'merge' (){
        // Combine two arrays
        let x:any = {x:1}
        let y:any = {y:1}
        let z:any = Utils.merge(x,y)
        expect(z).to.deep.eq({x:1,y:1})

        // Override first with second
        x = {x:1}
        y = {x:2}
        z = Utils.merge(x,y)
        expect(z).to.deep.eq({x:2})

        // Array merge
        x = {x:['asd']}
        y = {x:['cbd']}
        z = Utils.merge(x,y)
        expect(z).to.deep.eq({x:['asd','cbd']})

        // Array object merge
        x = {x:[{z:2}]}
        y = {x:[{z:2}]}
        z = Utils.merge(x,y)
        expect(z).to.deep.eq(x)

        // Array object merge
        x = {x:[{z:2}]}
        y = {x:[{y:2}]}
        z = Utils.merge(x,y)
        expect(z).to.deep.eq({x:[{z:2,y:2}]})

        // Array object merge
        x = {x:[{z:2}]}
        y = {x:[{},{y:2}]}
        z = Utils.merge(x,y)
        expect(z).to.deep.eq({x:[{z:2},{y:2}]})

        // deep merge
        x = {x:{d:1,c:1,e:{a:1,b:2}}}
        y = {x:{d:1,c:1,e:{a:2}}}
        z = Utils.merge(x,y)
        expect(z).to.deep.eq({x:{d:1,c:1,e:{a:2,b:2}}})

    }

    @test
    'clone' (){
        let x:any = {x:1}
        let y:any = Utils.clone(x)

        expect(x).to.not.eq(y)
        expect(x).to.deep.eq(y)
    }

}