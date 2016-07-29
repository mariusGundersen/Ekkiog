import EventSaga from 'event-saga';

const MAX_UNMOVED_DISTANCE = 5;
const MAX_TAP_TIME = 100;
const MIN_LONG_TOUCH_TIME = 1000;

export default class saga{
  constructor(eventEmitter){
    const saga = new EventSaga(eventEmitter);

    saga.createOn('touchStart', function(data){
      this.data = {
        moved: false,
        maybeTap: true,
        start: {
          x: data.x,
          y: data.y
        },
        x: data.x,
        y: data.y
      };

      this.emit('pointer-down', {
        pointer: this.id,
        x: data.x,
        y: data.y
      });

      this.setTimeout('tapTooSlow', MAX_TAP_TIME);
      this.setTimeout('touchLong', {
        x: data.x,
        y: data.y
      }, MIN_LONG_TOUCH_TIME);

    });

    saga.on('touchMove', function(data){
      this.data.x = data.x;
      this.data.y = data.y;

      this.emit('pointer-move', {
        pointer: this.id,
        x: data.x,
        y: data.y
      });

      if(!this.data.moved){
        this.data.moved = Math.abs(data.x - this.data.start.x) > MAX_UNMOVED_DISTANCE
                       || Math.abs(data.y - this.data.start.y) > MAX_UNMOVED_DISTANCE;
        if(this.data.moved){
          this.clearTimeout('touchLong');
        }
      }
    });

    saga.on('tapTooSlow', function(data){
      this.data.maybeTap = false;
    });

    saga.on('touchLong', function (data) {
      this.emit('pointer-up', {
        pointer: this.id,
        x: data.x,
        y: data.y
      });

      this.emit('longPress', {
        pointer: this.id,
        x: data.x,
        y: data.y
      });
    });

    saga.on('touchEnd', function(data){
      if(this.data.maybeTap && !this.data.moved){
        this.emit('tap', {
          x: data.x,
          y: data.y
        });
      }

      this.emit('pointer-up', {
        pointer: this.id,
        x: data.x,
        y: data.y
      });

      this.done();
    });
  }
}