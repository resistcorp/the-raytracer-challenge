import {epsilonEquals} from  "../src/lib.js";
import Tuples from  "../src/tuples.js";
const {dot, tuple} = Tuples;

function makeMatrix(cols, rows, values){
  if(values.length != cols * rows)
    console.warn("invalid matrix size");
  if(values.some(v => isNaN(v)))
    console.warn("invalid matrix value");
  let data = new Float64Array(values);

  let ret = Object.create(MatrixPrototype);
  let properties = { data, cols, rows, determinant: getDetMethod(cols, rows) };
  if(cols === 4 && rows === 4)
    properties.transform = t => transform(t, ret);
  return Object.assign(ret, properties);
}

//TODO: maybe roll these 3 methods back into matrix prototype
function getDetMethod(cols, rows){
  if(rows == 2 && cols == 2)
    return det2x2;
  return undefDeterminant;
}

function undefDeterminant(){
  let sum = 0;
  for (let col = 0; col < this.cols; ++col){
    sum += this.data[col] * this.cofactor(0, col);
  }
  return sum;
}

function det2x2() {
  let [a, b, c, d] = this.data;
  return a * d - c * b;
}

export function M2x2(...values) {
  return makeMatrix(2, 2, values);
}
M2x2.identity = () => M2x2(
    1.0, 0.0,
    0.0, 1.0,
  );
export function M3x3(...values) {
  return makeMatrix(3, 3, values);
}
M3x3.identity = () => M3x3(
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
  );
export function M4x4(...values) {
  return makeMatrix(4, 4, values);
}
M4x4.identity = () => M4x4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );

export function translation(x, y, z){
  return M4x4(
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1,
  );
}
export function scaling(x, y, z){
  return M4x4(
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1,
  );
}
export function rotation_x(angle_in_radians){
  let s = Math.sin(angle_in_radians);
  let c = Math.cos(angle_in_radians);
  return M4x4(
    1, 0, 0, 0,
    0, c,-s, 0,
    0, s, c, 0,
    0, 0, 0, 1,
  );
}
export function rotation_y(angle_in_radians){
  let s = Math.sin(angle_in_radians);
  let c = Math.cos(angle_in_radians);
  return M4x4(
    c, 0, s, 0,
    0, 1, 0, 0,
   -s, 0, c, 0,
    0, 0, 0, 1,
  );
}
export function rotation_z(angle_in_radians){
  let s = Math.sin(angle_in_radians);
  let c = Math.cos(angle_in_radians);
  return M4x4(
    c,-s, 0, 0,
    s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  );
}
export function shearing(xtoy, xtoz, ytox, ytoz, ztox, ztoy){
  return M4x4(
    1.0,xtoy,xtoz, 0.0,
    ytox,1.0,ytoz, 0.0,
    ztox,ztoy,1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );
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
  computeColumns : function (){
    let ret = [];
    for(let i = 0; i < this.cols; ++i){
      ret.push(this.col(i));
    }
    return ret;
  },
  computeRows : function (){
    let ret = [];
    for(let i = 0; i < this.rows; ++i){
      ret.push(this.row(i));
    }
    return ret;
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
  invertible : function (){
    return this.determinant() !== 0;
  },
  
  inversed : function (){
    if(!this.invertible()){
      console.console.warn("tried to invert non-invertible matrix");
      return undefined
    }
    let inv = makeMatrix(this.rows, this.cols, this.data.map(v => 0.0));
    let determinant = this.determinant();

    for(let col = 0; col < this.cols; ++col){
      for(let row = 0; row < this.rows; ++row){
        //inverse row and col to transpose
        inv.set(row, col, this.cofactor(col, row) / determinant);
      }
    }
    return inv;
  },
  
  transposed : function (){
    let {rows, cols} = this;
    if(rows !== cols){
      console.warn(`tried to transpose non-square matrix : ${cols}x${rows}`)
      return undefined;
    }
    let values = [];
    for(let col = 0; col < cols; ++col)
      values.push(...this.col(col));
    return makeMatrix(cols, rows, values);
  },

  mul : function (b){
    let a = this;
    let values = [];
    if(b.rows !== a.cols){
      console.warn(`tried to multiply incompatible matrices : ${a.cols}x${a.rows} vs. ${b.cols}x${b.rows}`)
      return undefined;
    }
    for(let row = 0; row < b.rows; ++row){
      let rowA = a.row(row);
      for(let col = 0; col < b.cols; ++col){
        let colB = b.col(col);
        let val = colB.reduce((acc, v, i) => acc + v * rowA[i], 0);
        values.push(val);
      }
    }
    return makeMatrix(b.cols, b.rows, values);
  },

  minor : function(i, j){
    return this.subMatrix(i, j).determinant();
  },

  cofactor : function(i, j){
    //TODO: this works for 3x3, no idea if it extends to other sizes
    let minor = this.minor(i, j);
    if( (i+j) % 2 == 1 )
      return -minor;
    return minor;
  },

  subMatrix : function(rowToRemove, colToRemove){
    let values = [];
    this.computeRows().forEach((row, rowI) => {
      if(rowI !== rowToRemove){
        values.push(...row.filter((v, colI)=>colI != colToRemove))
      }
    });
    return makeMatrix(this.cols-1, this.rows-1, values);
  }
};

//TODO: this is very inefficient. replace when tuples are M1x4
export function transform(t, matrix4x4) {
  return tuple(
    dot(t, tuple(...matrix4x4.row(0))),
    dot(t, tuple(...matrix4x4.row(1))),
    dot(t, tuple(...matrix4x4.row(2))),
    dot(t, tuple(...matrix4x4.row(3)))
  );
}
