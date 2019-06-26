export default class LoadingSavedData {
  constructor(mainCanvas, resizeCanvas) {
    this.mainCanvas = mainCanvas;
    this.saveData = this.saveData.bind(this);
    this.resizeCanvas = resizeCanvas;

    window.addEventListener('beforeunload', this.saveData);

    if (localStorage.listFrames) {
      // this.loadData();
      localStorage.clear();
    }
  }

  static JSONFramesConversion(list) {
    const result = [];

    list.forEach((item) => {
      const frame = item;

      if (frame.state === 'active') {
        frame.savingStateSectors();
      }

      const data = {
        listSectors: frame.listSectors,
        quantityLayer: frame.quantityLayer,
      };

      result.push(JSON.stringify(data));
    });

    return JSON.stringify(result);
  }

  saveSizeCanvas() {
    const sizeCanvas = {
      width: this.mainCanvas.quantitySectorsX,
      heihgt: this.mainCanvas.quantitySectorsY,
    };

    localStorage.setItem('sizeCanvas', JSON.stringify(sizeCanvas));
  }

  saveData() {
    const JSONListFrames = LoadingSavedData.JSONFramesConversion(this.mainCanvas.listFrames);

    this.saveSizeCanvas();
    localStorage.setItem('listFrames', JSONListFrames);
  }

  loadData() {
    const listFrames = JSON.parse(localStorage.listFrames);
    const initFrame = this.mainCanvas.listFrames[0];
    initFrame.framesContainer.removeChild(initFrame.frameContent);
    this.mainCanvas.listFrames.splice(0, 1);

    listFrames.forEach((item, index) => {
      const data = JSON.parse(item);
      const { listSectors } = data;
      const { quantityLayer } = data;

      this.mainCanvas.createFrame(false);

      const frame = this.mainCanvas.listFrames[index];

      frame.listSectors = listSectors;
      frame.quantityLayer = quantityLayer;
    });

    if (localStorage.sizeCanvas) {
      const sizeCanvas = JSON.parse(localStorage.sizeCanvas);

      this.resizeCanvas.inputSizeX.value = +sizeCanvas.width;
      this.resizeCanvas.inputSizeY.value = +sizeCanvas.heihgt;
      this.resizeCanvas.changeSizeCanvas();
    }
  }
}
