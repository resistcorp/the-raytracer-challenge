import {epsilonEquals} from  "../src/lib.js";

function makeMatrix(cols, rows, values){
  //TODO: check that values are cols*rows floats
  let data = new Float32Array(values);
  let ret = Object.create(MatrixPrototype);
  return Object.assign(ret, {data, cols, rows});

}

export function M2x2(...values) {
  return makeMatrix(2, 2, values);
}
export function M3x3(...values) {
  return makeMatrix(3, 3, values);
}
export function M4x4(...values) {
  return makeMatrix(4, 4, values);
}

export function matricesEqual(a, b){
  if(a.cols != b.cols || a.rows != b.rows)
    return false;
  for(let i = 0; i < a.cols * a.rows; ++i){
    if (!epsilonEquals(a.data[i], b.data[i]))
      return false;
  }
  return true;
}

const MatrixPrototype = {
  cols : NaN,
  rows : NaN,
  data : null,//TODO: maybe actually make matrices be this array with 
  get : function (row, col){
    return this.data[row * this.cols + col];
  },
  set : function (row, col, val){
    this.data[row * this.cols + col] = val;
  },
  row : function (row){
    let ret = [];
    //TODO: this is just a slice op
    for(let col = 0; col < this.cols; ++col)
      ret.push(this.get(row, col));
    return ret;
  },
  col : function (col){
    let ret = [];
    //TODO: this is just a (cols) stride iteration
    for(let row = 0; row < this.rows; ++row)
      ret.push(this.get(row, col));
    return ret;
  },
  mul : function (b){
    let a = this;
    let values = [];
    if(b.rows != a.cols)
      return undefined;
    for(let row = 0; row < b.rows; ++row){
      let rowA = a.row(row);
      for(let col = 0; col < b.cols; ++col){
        let colB = b.col(col);
        let val = colB.reduce((acc, v, i) => acc + v * rowA[i], 0);
        values.push(val);
      }
    }
    return makeMatrix(b.cols, b.rows, values);
  }
};
