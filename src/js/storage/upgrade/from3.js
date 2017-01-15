export default function upgradeFrom3(db){
  return db.transaction
    .objectStore('components')
    .put({
      name: 'xor',
      source: makeXOR()
    });
}


function makeXOR(){
  return {
    width: 3,
    height: 5,
    inputs: [
      {
        x: 0,
        y: 1,
        dx: -1,
        dy: 0
      },
      {
        x: 0,
        y: 3,
        dx: -1,
        dy: 0
      }
    ],
    outputs: [
      {
        x: 2,
        y: 2,
        dx: 1,
        dy: 0,
        gate: 3
      }
    ],
    gates: [
      {
        inputA: {
          type: 'input',
          index: 0
        },
        inputB: {
          type: 'input',
          index: 1
        }
      },
      {
        inputA: {
          type: 'input',
          index: 0
        },
        inputB: {
          type: 'gate',
          index: 0
        }
      },
      {
        inputA: {
          type: 'gate',
          index: 0
        },
        inputB: {
          type: 'input',
          index: 1
        }
      },
      {
        inputA: {
          type: 'gate',
          index: 1
        },
        inputB: {
          type: 'gate',
          index: 2
        }
      }
    ]
  };
}