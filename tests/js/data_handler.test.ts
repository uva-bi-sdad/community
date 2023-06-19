import {describe, expect, test} from '@jest/globals'
import DataHandler from '../../js/data_handler'

const data = new DataHandler(void 0, void 0, {
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
  test('variables are mapped', function () {
    expect(Object.keys(data.variables)).toStrictEqual(['variable_name1', 'variable_name2'])
  })
  test('entities are mapped', function () {
    expect(Object.keys(data.entities)).toStrictEqual(['id1a', 'id2a', 'id1b', 'id2b'])
  })
})

describe('when exporting data...', function () {
  test('the default works', async function () {
    const res = await data.export()
    expect(res.headers['Content-Disposition']).toStrictEqual(
      'attachment; filename=export_2010-2011_2-variables_8x5.csv'
    )
    expect(res.body).toStrictEqual(
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
  test('variable selection works', async function () {
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
      res1 = await data.export({include: 'variable_name1'}),
      res2 = await data.export({exclude: 'variable_name2'})
    expect(res1.body).toStrictEqual(target)
    expect(res2.body).toStrictEqual(target)
  })
  test('tall table and tsv file formats work', async function () {
    const res = await data.export({table_format: 'tall', file_format: 'tsv'})
    expect(res.headers['Content-Disposition']).toEqual('attachment; filename=export_2010-2011_2-variables_12x5.tsv')
    expect(res.body).toEqual(
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
  test('variable filtering works', async function () {
    const res = await data.export('variable_name2[mean]>=40')
    expect(res.body).toEqual(
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id1b","id1b",2011,20,50\n' +
        '"id2b","id2b",2010,20,NA\n' +
        '"id2b","id2b",2011,30,40'
    )
  })
  test('variable filtering with a time component works ', async function () {
    const res = await data.export('variable_name2[2011]<10')
    expect(res.body).toEqual(
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1a","id1a",2010,1,NA\n' +
        '"id1a","id1a",2011,2,5\n' +
        '"id2a","id2a",2010,2,NA\n' +
        '"id2a","id2a",2011,3,4'
    )
  })
  test('dataset filtering works', async function () {
    const res = await data.export('dataset=b')
    expect(res.body).toEqual(
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id1b","id1b",2011,20,50\n' +
        '"id2b","id2b",2010,20,NA\n' +
        '"id2b","id2b",2011,30,40'
    )
  })
  test('feature filtering works', async function () {
    const res = await data.export('id=id1b,id2b')
    expect(res.body).toEqual(
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id1b","id1b",2011,20,50\n' +
        '"id2b","id2b",2010,20,NA\n' +
        '"id2b","id2b",2011,30,40'
    )
  })
  test('time filtering with tall format works', async function () {
    var res = await data.export('table_format=tall&time_range=2010')
    expect(res.body).toEqual(
      'ID,Name,time,variable,value\n' +
        '"id1a","id1a",2010,"variable_name1",1\n' +
        '"id2a","id2a",2010,"variable_name1",2\n' +
        '"id1b","id1b",2010,"variable_name1",10\n' +
        '"id2b","id2b",2010,"variable_name1",20'
    )
  })
  test('time filtering with mixed format works', async function () {
    var res = await data.export('time_range=2010')
    expect(res.body).toEqual(
      'ID,Name,time,variable_name1,variable_name2\n' +
        '"id1a","id1a",2010,1,NA\n' +
        '"id2a","id2a",2010,2,NA\n' +
        '"id1b","id1b",2010,10,NA\n' +
        '"id2b","id2b",2010,20,NA'
    )
  })
  test('time filtering with wide format works', async function () {
    var res = await data.export('table_format=wide&time_range=2011')
    expect(res.body).toEqual(
      'ID,Name,variable_name1_2011,variable_name2_2011\n' +
        '"id1a","id1a",2,5\n' +
        '"id2a","id2a",3,4\n' +
        '"id1b","id1b",20,50\n' +
        '"id2b","id2b",30,40'
    )
  })
})
