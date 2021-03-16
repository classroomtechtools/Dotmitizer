import DotObject from 'dot-object';

function Interface_ (name='', params={}) {
  class I_ {
    constructor (n, p) {
      this.name = `dottie.${n}`;
      this.params = p;
    }

    get req() {
      throw Error(`Missing at least one required parameter for ${this.name}: ${Object.keys(this.params)}`);
    }

    extra(kwargs) {
      if (Object.entries(kwargs).length > 0)
        throw Error(`Extra parameters passed to ${this.name}: ${Object.entries(kwargs)}`);
    }

    typecheck(args) {
      // arguments is an object-like array, need to flatten it so that we represent it as viewed from function scope
      let argObj = {};
      for (const prop in args) {
        argObj = {...argObj, ...args[prop]};
      }

      // now that both have matching types, let's go
      for (const prop in this.params) {
        if (this.params[prop] === 'any') continue;  // type of 'any' special meaning is to skip it
        if (this.params[prop] === 'array') {
          if (!Array.isArray(argObj[prop])) throw new Error(`Type mismatch in ${this.name}: "${prop}". Expected array but got ${typeof(argObj)}`);
        } else if (typeof(argObj[prop]) !== this.params[prop]) {
          throw new Error(`Type mismatch in ${this.name}: "${prop}". Expected ${typeof(this.params[prop])} but got ${typeof(argObj)}`);
        }
      }
    }
  }
  return new I_(name, params);
}


// create interfaces that allows us to enforce type checks
const MoveI = Interface_('move', {sourcePath: 'string', destPath: 'string', obj: 'object'});
const CopyI = Interface_('copy', {obj: 'object', sourcePath: 'string', target: 'object', destPath: 'string'});
const TransferI = Interface_('transfer', {sourcePath: 'string', destPath: 'string', obj: 'object', target: 'object'});
const ExpandI = Interface_('expand', {obj: 'object'});
const GetI = Interface_('get', {path: 'string', obj: 'object'});
const SetI = Interface_('set', {path: 'string', obj: 'object', value: 'any'});
const DeleteI = Interface_('delete', {path: 'string', obj: 'object'});
const RemoveI = Interface_('remove', {path: 'string', obj: 'object'});
const TransformI = Interface_('transform', {recipe: 'object', obj: 'object'});
const DotI = Interface_('dot', {obj: 'object'});
const JsonsI = Interface_('jsons', {jsons: 'array'});
const RowsI = Interface_('rows', {rows: 'array'});

/**
 * Internal class object. Global methods interface with these methods. If `augment` is used, these methods are augmented to Objects and Arrays with these function signatures.
 * @class
 */
class Dottie {

  /**
   * No instances are made, all these methods are static
   */
  constructor () {

  }

  /**
   * @see {@link move}
   * @param {Object} namedParameters
   * @param {String} namedParameters.sourcePath
   * @param {String} namedParameters.destPath
   * @param {Object} namedParameters.obj
   * @return {Object}
   */
  static move ({sourcePath=MoveI.req, destPath=MoveI.req, obj=MoveI.req, ...kwargs}={}) {
    MoveI.extra(kwargs);
    MoveI.typecheck(arguments);
    return DotObject.move(sourcePath, destPath, obj);
  }

  /**
   * @see {@link copy}
   * @param {Object} namedParameters
   * @param {Object} namedParameters.obj
   * @param {String} namedParameters.sourcePath
   * @param {String} namedParameters.target
   * @param {String} namedParameters.destPath
   * @return {Object}
   */
  static copy ({obj=CopyI.req, sourcePath=CopyI.req, target=CopyI.req, destPath=CopyI.req, ...kwargs}={}) {
    CopyI.extra(kwargs);
    CopyI.typecheck(arguments);
    return DotObject.copy(sourcePath, destPath, obj, target);
  }

  /**
   * @see {@link transfer}
   * @param {Object} namedParameters
   * @param {String} namedParameters.sourcePath
   * @param {String} namedParameters.destPath
   * @param {Object} namedParameters.obj
   * @param {Object} namedParameters.target
   * @return {Object}
   */
  static transfer ({sourcePath=TransferI.req, destPath=TransferI.req, obj=TransferI.req, target=TransferI.req, ...kwargs}={}) {
    TransferI.extra(kwargs);
    TransferI.typecheck(arguments);
    return DotObject.transfer(sourcePath, destPath, obj, target);
  }

  /**
   * @see {@link expand}
   * @param {Object} namedParameters
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static expand ({obj=ExpandI.req, ...kwargs}={}) {
    ExpandI.extra(kwargs);
    ExpandI.typecheck(arguments);
    return DotObject.object(obj);
  }

  /**
   * @see {@link get}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Object} namedParameters.obj
   * @returns {Any}
   */
  static get ({path=GetI.req, obj=GetI.req, ...kwargs}={}) {
    GetI.extra(kwargs);
    GetI.typecheck(arguments);
    const result = DotObject.pick(path, obj);
    if (result === undefined) return null;
    return result;
  }

  /**
   * @see {@link set}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Any} namedParameters.value
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static set ({path=SetI.req, value=SetI.req, obj=SetI.req, ...kwargs}={}) {
    SetI.extra(kwargs);
    SetI.typecheck(arguments);
    return DotObject.str(path, value, obj);
  }

  /**
   * @see {@link delete_}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static delete ({path=DeleteI.req, obj=DeleteI.req, ...kwargs}={}) {
    DeleteI.extra(kwargs);
    DeleteI.typecheck(arguments);
    return DotObject.delete(path, obj);
  }

  /**
   * @see {@link remove}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static remove ({path=RemoveI.req, obj=RemoveI.req, ...kwargs}={}) {
    RemoveI.extra(kwargs);
    RemoveI.typecheck(arguments);
    return DotObject.remove(path, obj);
  }

  /**
   * @see {@link set}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Any} namedParameters.value
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static transform ({recipe=TransformI.req, obj=TransformI.req, ...kwargs}={}) {
    TransformI.extra(kwargs);
    TransformI.typecheck(arguments);
    return DotObject.transform(recipe, obj);
  }

  /**
   * @see {@link dot}
   * @param {Object} namedParameters
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static dot ({obj=DotI.req, ...kwargs}={}) {
    DotI.extra(kwargs);
    DotI.typecheck(arguments);
    return DotObject.dot(obj);
  }

  /**
   * @see {@link jsonsToRows}
   * @param {Object} namedParameters
   * @param {Object[]} namedParameters.jsons
   * @returns {Array[]}
   */
  static jsonsToRows ({jsons=JsonsI.req, ...kwargs}={}) {
    JsonsI.extra(kwargs);
    JsonsI.typecheck(arguments);
    const headers = [];
    const values = [];

    // save values as dotted objects and store headers
    // remove any nulls
    for (const json of jsons) {
      const value = DotObject.dot(json);
      for (const [k, v] of Object.entries(value)) {
        if (v === null) {
          delete value[k];
        }
      }
      headers.push(Object.keys(value));
      values.push(value);
    }

    // row1 will consist of unique header columns, sorted alphabetically with id first
    // use array generics for most efficient manner of doing this
    const row1 = [...new Set([].concat(...headers))];
    row1.sort();
    const idx = row1.indexOf('id');
    if (idx !== -1) {
      row1.splice(idx, 1);
      row1.splice(0, 0, 'id');
    }

    // the rest of the rows consits of the values in each column, or null if not present
    const rows = values.map(value => row1.map(column => value[column] || null));

    // concat the arrays efficiently for return
    return [row1, ...rows];
  }

  /**
   * @see {@link rowsToJsons}
   * @param {Object} namedParameters
   * @param {Any[][]} namedParameters.rows
   * @returns {Any[]}
   */
  static rowsToJsons ({rows=RowsI.req, ...kwargs}={}) {
    RowsI.extra(kwargs);
    RowsI.typecheck(arguments);
    const headers = rows[0];
    const objects = [];

    // go through row 1 to end
    for (const row of rows.slice(1)) {
      const dotted = row.reduce(
        function (acc, value, idx) {
          // safeguard if for some reason empty string for column or null
          const column = headers[idx] || null;
          if (!column) return acc;

          // set and return
          acc[column] = value;
          return acc;
        }, {}
      );
      const obj = DotObject.object(dotted);
      objects.push(obj);
    }
    return objects;
  }

  /*
    Sets up {}.dottie and [].dottie methods
    @param {Any} O - Pass your `Object`
    @param {Any} A - Pass your `Array`
   */
  static augment (O=null, A=null) {
    if (O === null) O = Object;
    if (A === null) A = Array;
    const me = this;
    !A.prototype.dottie && Object.defineProperty(A.prototype, 'dottie', {
      get: function () {
        return {
          jsonsToRows: ({...kwargs}={}) => {
            return me.jsonsToRows({jsons:this});
          },
          rowsToJsons: ({...kwargs}={}) => {
            return me.rowsToJsons({rows: this});
          }
        };
      }
    });

    !O.prototype.dottie && Object.defineProperty(O.prototype, 'dottie', {
      get: function () {
        return {
          set: ({path, value}={}) => {
            return DotObject.str(path, value, this);
          },
          get: ({path}={}) => {
            return DotObject.pick(path, this);
          },
          move: ({path, destPath}={}) => {
            return DotObject.move(path, destPath, this);
          },
          copy: ({path, destPath, target}={}) => {
            return DotObject.copy(path, destPath, this, target);
          },
          transfer: ({path, destPath, target}={}) => {
            return DotObject.transfer(path, destPath, this, target);
          },
          expand: () => {
            return DotObject.object(this);
          },
          delete: ({path}={}) => {
            return DotObject.delete(path, this);
          },
          remove: ({path}) => {
            return DotObject.remove(path, this);
          },
          transform: ({recipe}={}) => {
            return DotObject.transform(recipe, this);
          },
          dot: ({target, path}={}) => {
            return DotObject.dot(this, target, path);
          }
        };
      }
    });
  }

}

export {Dottie};
