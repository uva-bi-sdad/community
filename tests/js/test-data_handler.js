var assert = require('assert'),
  DataHandler = require('../../dev/data_handler.js'),
  data = new DataHandler({metadata: {datasets: ['a', 'b']}}, void 0, {
    a: {
      id1a: {
        X1: [1, 2],
        X2: 5,
      },
      id2a: {
        X1: [2, 3],
        X2: 4,
      },
      _meta: {
        time: {name: 'time', value: [2010, 2011]},
        variables: {
          variable_name1: {code: 'X1', time_range: [0, 1]},
          variable_name2: {code: 'X2', time_range: [1, 1]},
        },
      },
    },
    b: {
      id1b: {
        X1: [10, 20],
        X2: 50,
      },
      id2b: {
        X1: [20, 30],
        X2: 40,
      },
      _meta: {
        time: {name: 'time', value: [2010, 2011]},
        variables: {
          variable_name1: {code: 'X1', time_range: [0, 1]},
          variable_name2: {code: 'X2', time_range: [1, 1]},
        },
      },
    },
  })

describe('when the data handler is initialized...', function () {
  it('variables are mapped', function () {
    assert.deepStrictEqual(Object.keys(data.variables), ['variable_name1', 'variable_name2'])
  })
  it('entities are mapped', function () {
    assert.deepStrictEqual(Object.keys(data.entities), ['id1a', 'id2a', 'id1b', 'id2b'])
  })
})

describe('when exporting data...', async function () {
  it('the default works', async function () {
    const res = await data.export()
    assert.strictEqual(res.headers['Content-Disposition'], 'attachment; filename=data_export.csv')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1a","id1a",2010,1,NA\n' +
        '"id1a","id1a",2011,2,5\n' +
        '"id2a","id2a",2010,2,NA\n' +
        '"id2a","id2a",2011,3,4\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id1b","id1b",2011,20,50\n' +
        '"id2b","id2b",2010,20,NA\n' +
        '"id2b","id2b",2011,30,40'
    )
  })
  it('variable selection works', async function () {
    const target =
        'ID,Name,time,variable_name1\n' +
        '"id1a","id1a",2010,1\n' +
        '"id1a","id1a",2011,2\n' +
        '"id2a","id2a",2010,2\n' +
        '"id2a","id2a",2011,3\n' +
        '"id1b","id1b",2010,10\n' +
        '"id1b","id1b",2011,20\n' +
        '"id2b","id2b",2010,20\n' +
        '"id2b","id2b",2011,30',
      res1 = await data.export({include: ['variable_name1']}),
      res2 = await data.export({exclude: ['variable_name2']})
    assert.strictEqual(res1.body, target)
    assert.strictEqual(res2.body, target)
  })
  it('tall table and tsv file formats work', async function () {
    const res = await data.export({table_format: 'tall', file_format: 'tsv'})
    assert.strictEqual(res.headers['Content-Disposition'], 'attachment; filename=data_export.tsv')
    assert.strictEqual(
      res.body,
      'ID\tName\ttime\tvariable\tvalue\n' +
        '"id1a"\t"id1a"\t2010\t"variable_name1"\t1\n' +
        '"id1a"\t"id1a"\t2011\t"variable_name1"\t2\n' +
        '"id1a"\t"id1a"\t2011\t"variable_name2"\t5\n' +
        '"id2a"\t"id2a"\t2010\t"variable_name1"\t2\n' +
        '"id2a"\t"id2a"\t2011\t"variable_name1"\t3\n' +
        '"id2a"\t"id2a"\t2011\t"variable_name2"\t4\n' +
        '"id1b"\t"id1b"\t2010\t"variable_name1"\t10\n' +
        '"id1b"\t"id1b"\t2011\t"variable_name1"\t20\n' +
        '"id1b"\t"id1b"\t2011\t"variable_name2"\t50\n' +
        '"id2b"\t"id2b"\t2010\t"variable_name1"\t20\n' +
        '"id2b"\t"id2b"\t2011\t"variable_name1"\t30\n' +
        '"id2b"\t"id2b"\t2011\t"variable_name2"\t40'
    )
  })
  it('variable filtering works', async function () {
    const res = await data.export('variable_name2[mean]>=40')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id1b","id1b",2011,20,50\n' +
        '"id2b","id2b",2010,20,NA\n' +
        '"id2b","id2b",2011,30,40'
    )
  })
  it('variable filtering with a time component works ', async function () {
    const res = await data.export('variable_name2[2011]<10')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1a","id1a",2010,1,NA\n' +
        '"id1a","id1a",2011,2,5\n' +
        '"id2a","id2a",2010,2,NA\n' +
        '"id2a","id2a",2011,3,4'
    )
  })
  it('dataset filtering works', async function () {
    const res = await data.export('dataset=b')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id1b","id1b",2011,20,50\n' +
        '"id2b","id2b",2010,20,NA\n' +
        '"id2b","id2b",2011,30,40'
    )
  })
  it('feature filtering works', async function () {
    const res = await data.export('id=id1b,id2b')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id1b","id1b",2011,20,50\n' +
        '"id2b","id2b",2010,20,NA\n' +
        '"id2b","id2b",2011,30,40'
    )
  })
  it('time filtering with tall format works', async function () {
    var res = await data.export('table_format=tall&time_range=2010')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable,value\n' +
        '"id1a","id1a",2010,"variable_name1",1\n' +
        '"id2a","id2a",2010,"variable_name1",2\n' +
        '"id1b","id1b",2010,"variable_name1",10\n' +
        '"id2b","id2b",2010,"variable_name1",20'
    )
  })
  it('time filtering with mixed format works', async function () {
    var res = await data.export('time_range=2010')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1a","id1a",2010,1,NA\n' +
        '"id2a","id2a",2010,2,NA\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id2b","id2b",2010,20,NA'
    )
  })
  it('time filtering with wide format works', async function () {
    var res = await data.export('table_format=wide&time_range=2011')
    assert.strictEqual(
      res.body,
      'ID,Name,variable_name1_2011,variable_name2_2011\n' +
        '"id1a","id1a",2,5\n' +
        '"id2a","id2a",3,4\n' +
        '"id1b","id1b",20,50\n' +
        '"id2b","id2b",30,40'
    )
  })
})
