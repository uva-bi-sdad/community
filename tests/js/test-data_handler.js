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
        time: {name: 'time', value: [0, 1]},
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
        time: {name: 'time', value: [0, 1]},
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
    assert.deepStrictEqual(Object.keys(data.entities), ['id1b', 'id2b', 'id1a', 'id2a'])
  })
})

describe('when exporting data...', async function () {
  it('the default works', async function () {
    const res = await data.export()
    assert.strictEqual(res.headers['Content-Disposition'], 'attachment; filename=data_export.csv')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        'id1b,id1b,0,10,NA\n' +
        'id1b,id1b,1,20,50\n' +
        'id2b,id2b,0,20,NA\n' +
        'id2b,id2b,1,30,40\n' +
        'id1a,id1a,0,1,NA\n' +
        'id1a,id1a,1,2,5\n' +
        'id2a,id2a,0,2,NA\n' +
        'id2a,id2a,1,3,4'
    )
  })
  it('variable selection works', async function () {
    const target =
        'ID,Name,time,variable_name1\n' +
        'id1b,id1b,0,10\n' +
        'id1b,id1b,1,20\n' +
        'id2b,id2b,0,20\n' +
        'id2b,id2b,1,30\n' +
        'id1a,id1a,0,1\n' +
        'id1a,id1a,1,2\n' +
        'id2a,id2a,0,2\n' +
        'id2a,id2a,1,3',
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
        'id1b\tid1b\t0\t"variable_name1"\t10\n' +
        'id1b\tid1b\t1\t"variable_name1"\t20\n' +
        'id1b\tid1b\t1\t"variable_name2"\t50\n' +
        'id2b\tid2b\t0\t"variable_name1"\t20\n' +
        'id2b\tid2b\t1\t"variable_name1"\t30\n' +
        'id2b\tid2b\t1\t"variable_name2"\t40\n' +
        'id1a\tid1a\t0\t"variable_name1"\t1\n' +
        'id1a\tid1a\t1\t"variable_name1"\t2\n' +
        'id1a\tid1a\t1\t"variable_name2"\t5\n' +
        'id2a\tid2a\t0\t"variable_name1"\t2\n' +
        'id2a\tid2a\t1\t"variable_name1"\t3\n' +
        'id2a\tid2a\t1\t"variable_name2"\t4'
    )
  })
  it('variable filtering works', async function () {
    const res = await data.export('variable_name2[mean]>=40')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        'id1b,id1b,0,10,NA\n' +
        'id1b,id1b,1,20,50\n' +
        'id2b,id2b,0,20,NA\n' +
        'id2b,id2b,1,30,40'
    )
  })
  it('dataset filtering works', async function () {
    const res = await data.export('dataset=b')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        'id1b,id1b,0,10,NA\n' +
        'id1b,id1b,1,20,50\n' +
        'id2b,id2b,0,20,NA\n' +
        'id2b,id2b,1,30,40'
    )
  })
  it('feature filtering works', async function () {
    const res = await data.export('id=id1b,id2b')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        'id1b,id1b,0,10,NA\n' +
        'id1b,id1b,1,20,50\n' +
        'id2b,id2b,0,20,NA\n' +
        'id2b,id2b,1,30,40'
    )
  })
  it('time filtering with tall format works', async function () {
    var res = await data.export('table_format=tall&time_range=0')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable,value\n' +
        'id1b,id1b,0,"variable_name1",10\n' +
        'id2b,id2b,0,"variable_name1",20\n' +
        'id1a,id1a,0,"variable_name1",1\n' +
        'id2a,id2a,0,"variable_name1",2'
    )
  })
  it('time filtering with mixed format works', async function () {
    var res = await data.export('time_range=0')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        'id1b,id1b,0,10,NA\n' +
        'id2b,id2b,0,20,NA\n' +
        'id1a,id1a,0,1,NA\n' +
        'id2a,id2a,0,2,NA'
    )
  })
  it('time filtering with wide format works', async function () {
    var res = await data.export('table_format=wide&time_range=1')
    assert.strictEqual(
      res.body,
      'ID,Name,variable_name1_1,variable_name2_1\n' +
        'id1b,id1b,20,50\n' +
        'id2b,id2b,30,40\n' +
        'id1a,id1a,2,5\n' +
        'id2a,id2a,3,4'
    )
  })
})
