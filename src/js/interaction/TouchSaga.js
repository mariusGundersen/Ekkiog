import EventSaga from 'event-saga';

export default class saga{
  constructor(eventEmitter){
    const saga = new EventSaga(eventEmitter);

    saga.createOn('touchStart', function(data){
      this.data.x = data.x;
      this.data.y = data.y;
      this.data.moved = false;
      this.data.maybeTap = true;
      this.setTimeout('tapTooSlow', 100);
      this.emit('pointer-down', {
        id: 'pointer',
        pointer: this.id,
        x: data.x,
        y: data.y
      });
    });

    saga.on('touchMove', function(data){
      const dx = data.x - this.data.x;
      const dy = data.y - this.data.y;
      this.data.x = data.x;
      this.data.y = data.y;
      this.data.moved = true;
      this.emit('pointer-move', {
        id: 'pointer',
        pointer: this.id,
        x: data.x,
        y: data.y,
        dx,
        dy
      });
    });

    saga.on('tapTooSlow', function(data){
      this.data.maybeTap = false;
    });

    saga.on('touchEnd', function(data){
      if(this.data.maybeTap){
        this.emit('tap', data);
      }

      this.emit('pointer-up', {
        id: 'pointer',
        pointer: this.id,
        x: data.x,
        y: data.y
      });

      this.done();
    });
  }
}