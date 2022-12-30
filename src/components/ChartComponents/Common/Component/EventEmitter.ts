import type { ECharts } from 'echarts';

class EventEmitter {
  constructor() {
    window.addEventListener('resize', this.resize);
  }

  emitters: any[] = [];

  dispose = () => {
    window.removeEventListener('resize', this.resize);
  };

  resize = () => {
    this.emitters.forEach((emitter) => {
      const { instance, action } = emitter;
      instance.resize();
    });
  };

  push = (instance: ECharts, action?: any) => {
    this.emitters.push({
      instance,
      action,
    });
  };

  pop = (instance: ECharts) => {
    this.emitters = this.emitters.filter((item) => item.instance !== instance);
  };
}

export default new EventEmitter();
