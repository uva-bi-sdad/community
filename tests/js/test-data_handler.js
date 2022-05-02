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
        time: {name: 'time', value: ['t0', 't1']},
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
        time: {name: 'time', value: ['t0', 't1']},
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
        'id1b,id1b,t0,10,NA\n' +
        'id1b,id1b,t1,20,50\n' +
        'id2b,id2b,t0,20,NA\n' +
        'id2b,id2b,t1,30,40\n' +
        'id1a,id1a,t0,1,NA\n' +
        'id1a,id1a,t1,2,5\n' +
        'id2a,id2a,t0,2,NA\n' +
        'id2a,id2a,t1,3,4'
    )
  })
  it('variable selection works', async function () {
    const target =
        'ID,Name,time,variable_name1\n' +
        'id1b,id1b,t0,10\n' +
        'id1b,id1b,t1,20\n' +
        'id2b,id2b,t0,20\n' +
        'id2b,id2b,t1,30\n' +
        'id1a,id1a,t0,1\n' +
        'id1a,id1a,t1,2\n' +
        'id2a,id2a,t0,2\n' +
        'id2a,id2a,t1,3',
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
        'id1b\tid1b\tt0\t"variable_name1"\t10\n' +
        'id1b\tid1b\tt1\t"variable_name1"\t20\n' +
        'id1b\tid1b\tt1\t"variable_name2"\t50\n' +
        'id2b\tid2b\tt0\t"variable_name1"\t20\n' +
        'id2b\tid2b\tt1\t"variable_name1"\t30\n' +
        'id2b\tid2b\tt1\t"variable_name2"\t40\n' +
        'id1a\tid1a\tt0\t"variable_name1"\t1\n' +
        'id1a\tid1a\tt1\t"variable_name1"\t2\n' +
        'id1a\tid1a\tt1\t"variable_name2"\t5\n' +
        'id2a\tid2a\tt0\t"variable_name1"\t2\n' +
        'id2a\tid2a\tt1\t"variable_name1"\t3\n' +
        'id2a\tid2a\tt1\t"variable_name2"\t4'
    )
  })
  it('variable filtering works', async function () {
    const res = await data.export('variable_name1[mean]>10')
    assert.strictEqual(
      res.body,
      'ID,Name,time,variable_name1,variable_name2\n' +
        'id1b,id1b,t0,10,NA\n' +
        'id1b,id1b,t1,20,50\n' +
        'id2b,id2b,t0,20,NA\n' +
        'id2b,id2b,t1,30,40'
    )
  })
})
