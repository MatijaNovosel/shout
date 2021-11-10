<template>
  <canvas
    :width="state.canvasWidth"
    :height="state.canvasHeight"
    ref="canvas"
    @dragover.prevent
    @drop="onDrop"
    @mousedown="onDragStart"
    @mouseup="onDragEnd"
    @mousemove="onMouseMove"
    @click="clicked"
    v-bind:class="state.cursor"
  />
  <input type="file" ref="filePicker" @change="fileSelected" hidden />
</template>

<script>
import { defineComponent, reactive, computed, watch, onMounted, ref } from "vue";

const drawRoundedRect = (context, x, y, width, height, borderRadius) => {
  if (borderRadius === 0) {
    context.rect(x, y, width, height);
  } else {
    const widthMinusRad = width - borderRadius;
    const heightMinusRad = height - borderRadius;
    context.translate(x, y);
    context.arc(borderRadius, borderRadius, borderRadius, Math.PI, Math.PI * 1.5);
    context.lineTo(widthMinusRad, 0);
    context.arc(widthMinusRad, borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2);
    context.lineTo(width, heightMinusRad);
    context.arc(widthMinusRad, heightMinusRad, borderRadius, Math.PI * 2, Math.PI * 0.5);
    context.lineTo(borderRadius, height);
    context.arc(borderRadius, heightMinusRad, borderRadius, Math.PI * 0.5, Math.PI);
    context.translate(-x, -y);
  }
};

export default defineComponent({
  name: "avatar-editor",
  emits: ["image-ready"],
  props: {
    image: {
      type: String,
      default: ""
    },
    border: {
      type: Number,
      default: 25
    },
    borderRadius: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    color: {
      type: Array,
      default: function () {
        return [0, 0, 0, 0.5];
      }
    },
    setScaleTrigger: {
      type: Number
    }
  },
  setup(props, { emit }) {
    const canvas = ref(null);
    const filePicker = ref(null);

    const state = reactive({
      cursor: "cursorPointer",
      scale: 1,
      canvas: null,
      context: null,
      dragged: false,
      imageLoaded: false,
      changed: false,
      state: {
        drag: false,
        my: null,
        mx: null,
        image: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          resource: null
        }
      },
      canvasWidth: computed(() => {
        return getDimensions().canvas.width;
      }),
      canvasHeight: computed(() => {
        return getDimensions().canvas.height;
      })
    });

    const paint = () => {
      state.context.save();
      state.context.translate(0, 0);
      state.context.fillStyle = "rgba(" + props.color.slice(0, 4).join(",") + ")";
      let borderRadius = props.borderRadius;
      const dimensions = getDimensions();
      const borderSize = dimensions.border;
      const height = dimensions.canvas.height;
      const width = dimensions.canvas.width;
      // Clamp border radius between zero (perfect rectangle) and half the size without borders (perfect circle or "pill")
      borderRadius = Math.max(borderRadius, 0);
      borderRadius = Math.min(borderRadius, width / 2 - borderSize, height / 2 - borderSize);
      state.context.beginPath();
      // Inner rect, possibly rounded
      drawRoundedRect(
        state.context,
        borderSize,
        borderSize,
        width - borderSize * 2,
        height - borderSize * 2,
        borderRadius
      );
      state.context.rect(width, 0, -width, height); // outer rect, drawn "counterclockwise"
      state.context.fill("evenodd");
      state.context.restore();
    };

    const svgToImage = (rawSVG) => {
      const svg = new Blob([rawSVG], { type: "image/svg+xml;charset=utf-8" }),
        domURL = URL || self.webkitURL,
        url = domURL.createObjectURL(svg),
        img = new Image();
      img.src = url;
      return img;
    };

    const getDimensions = () => {
      return {
        width: props.width,
        height: props.height,
        border: props.border,
        canvas: {
          width: props.width + props.border * 2,
          height: props.height + props.border * 2
        }
      };
    };

    const getInitialSize = (width, height) => {
      let newHeight;
      let newWidth;
      const dimensions = getDimensions();
      const canvasRatio = dimensions.height / dimensions.width;
      const imageRatio = height / width;
      if (canvasRatio > imageRatio) {
        newHeight = getDimensions().height;
        newWidth = width * (newHeight / height);
      } else {
        newWidth = getDimensions().width;
        newHeight = height * (newWidth / width);
      }
      return {
        height: newHeight,
        width: newWidth,
        x: 0,
        y: 0,
        resource: null
      };
    };

    const handleImageReady = (image) => {
      const imageState = getInitialSize(image.width, image.height);
      imageState.resource = image;
      const oldState = state.state;
      oldState.drag = false;
      oldState.image = imageState;
      state.state.image.x = 0;
      state.state.image.y = 0;
      state.state.image.resource = image;
      state.state.image.width = imageState.width;
      state.state.image.height = imageState.height;
      state.state.drag = false;
      state.scale = 1;
      emit("image-ready", state.scale);
      state.imageLoaded = true;
      state.cursor = "cursorGrab";
    };

    const loadImage = (imageURL) => {
      const imageObj = new Image();
      imageObj.onload = function () {
        handleImageReady(imageObj);
      };
      if (!isDataURL(imageURL)) {
        imageObj.crossOrigin = "anonymous";
      }
      imageObj.src = imageURL;
    };

    const onDrop = (e) => {
      e = e || window.event;
      e.stopPropagation();
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files.length) {
        const reader = new FileReader();
        const file = e.dataTransfer.files[0];
        state.changed = true;
        reader.onload = (e) => loadImage(e.target.result);
        reader.readAsDataURL(file);
      }
    };

    const onDragStart = (e) => {
      e = e || window.event;
      e.preventDefault();
      state.state.drag = true;
      state.state.mx = null;
      state.state.my = null;
      state.cursor = "cursorGrabbing";
    };

    const onDragEnd = (e) => {
      if (state.state.drag) {
        state.state.drag = false;
        state.cursor = "cursorPointer";
      }
    };

    const onMouseMove = (e) => {
      e = e || window.event;
      if (state.state.drag === false) {
        return;
      }
      state.dragged = true;
      state.changed = true;
      const imageState = state.state.image;
      const lastX = imageState.x;
      const lastY = imageState.y;
      const mousePositionX = e.targetTouches ? e.targetTouches[0].pageX : e.clientX;
      const mousePositionY = e.targetTouches ? e.targetTouches[0].pageY : e.clientY;
      const newState = { mx: mousePositionX, my: mousePositionY, image: imageState };
      if (state.state.mx && state.state.my) {
        const xDiff = (state.state.mx - mousePositionX) / state.scale;
        const yDiff = (state.state.my - mousePositionY) / state.scale;
        imageState.y = getBoundedY(lastY - yDiff, state.scale);
        imageState.x = getBoundedX(lastX - xDiff, state.scale);
      }
      state.state.mx = newState.mx;
      state.state.my = newState.my;
      state.state.image = imageState;
    };

    const isDataURL = (str) => {
      if (str === null) {
        return false;
      }

      // /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@\/?%\s]*\s*$/i;

      const regex =
        /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@?%\s]*\s*$/i;
      return !!str.match(regex);
    };

    const getBoundedX = (x, scale) => {
      const image = state.state.image;
      const dimensions = getDimensions();
      let widthDiff = Math.floor((image.width - dimensions.width / scale) / 2);
      widthDiff = Math.max(0, widthDiff);
      return Math.max(-widthDiff, Math.min(x, widthDiff));
    };

    const getBoundedY = (y, scale) => {
      const image = state.state.image;
      const dimensions = getDimensions();
      let heightDiff = Math.floor((image.height - dimensions.height / scale) / 2);
      heightDiff = Math.max(0, heightDiff);
      return Math.max(-heightDiff, Math.min(y, heightDiff));
    };

    const paintImage = (context, image, border) => {
      if (image.resource) {
        const position = calculatePosition(image, border);
        context.save();
        context.globalCompositeOperation = "destination-over";
        context.drawImage(image.resource, position.x, position.y, position.width, position.height);
        context.restore();
      }
    };

    const calculatePosition = (image, border) => {
      const img = image || state.state.image;
      const dimensions = getDimensions();
      const width = img.width * state.scale;
      const height = img.height * state.scale;
      const widthDiff = (width - dimensions.width) / 2;
      const heightDiff = (height - dimensions.height) / 2;
      const x = img.x * state.scale - widthDiff + border;
      const y = img.y * state.scale - heightDiff + border;
      return {
        x,
        y,
        height,
        width
      };
    };

    const redraw = () => {
      state.context.clearRect(0, 0, getDimensions().canvas.width, getDimensions().canvas.height);
      paint();
      paintImage(state.context, state.state.image, props.border);
    };

    const getImage = () => {
      const cropRect = getCroppingRect();
      const image = state.state.image;
      // Get actual pixel coordinates
      cropRect.x *= image.resource.width;
      cropRect.y *= image.resource.height;
      cropRect.width *= image.resource.width;
      cropRect.height *= image.resource.height;
      // Create a canvas with the correct dimensions
      const canvas = document.createElement("canvas");
      canvas.width = cropRect.width;
      canvas.height = cropRect.height;
      // Draw the full-size image at the correct position,
      // The image gets truncated to the size of the canvas.
      canvas.getContext("2d").drawImage(image.resource, -cropRect.x, -cropRect.y);
      return canvas;
    };

    const getImageScaled = () => {
      const { width, height } = getDimensions();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      // Don't paint a border here, as it is the resulting image
      paintImage(canvas.getContext("2d"), state.state.image, 0);
      return canvas;
    };

    const getCroppingRect = () => {
      const dim = getDimensions();
      const frameRect = { x: dim.border, y: dim.border, width: dim.width, height: dim.height };
      const imageRect = calculatePosition(state.state.image, dim.border);
      return {
        x: (frameRect.x - imageRect.x) / imageRect.width,
        y: (frameRect.y - imageRect.y) / imageRect.height,
        width: frameRect.width / imageRect.width,
        height: frameRect.height / imageRect.height
      };
    };

    const clicked = () => {
      if (state.dragged) {
        state.dragged = false;
      } else {
        filePicker.value.click();
      }
    };

    const changeScale = (sc) => {
      state.changed = true;
      state.scale = sc;
    };

    const fileSelected = (e) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const reader = new FileReader();
      state.changed = true;
      reader.onload = (e) => {
        loadImage(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    };

    watch(
      () => state.state,
      () => {
        if (state.imageLoaded) {
          redraw();
        }
      },
      {
        deep: true
      }
    );

    watch(
      () => state.scale,
      () => {
        if (state.imageLoaded) {
          redraw();
        }
      }
    );

    watch(
      () => props.setScaleTrigger,
      (val) => {
        changeScale(val);
      }
    );

    onMounted(() => {
      state.context = canvas.value.getContext("2d");
      paint();
      if (!props.image) {
        const placeholder = svgToImage(
          "<svg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 65 65'><defs><style>.cls-1{fill:#999;}</style></defs><title>Upload_Upload</title><path class='cls-1' d='M32.5,1A31.5,31.5,0,1,1,1,32.5,31.54,31.54,0,0,1,32.5,1m0-1A32.5,32.5,0,1,0,65,32.5,32.5,32.5,0,0,0,32.5,0h0Z'/><polygon class='cls-1' points='41.91 28.2 32.59 18.65 23.09 28.39 24.17 29.44 31.87 21.54 31.87 40.05 33.37 40.05 33.37 21.59 40.83 29.25 41.91 28.2'/><polygon class='cls-1' points='40.66 40.35 40.66 44.35 24.34 44.35 24.34 40.35 22.34 40.35 22.34 44.35 22.34 46.35 24.34 46.35 40.66 46.35 42.66 46.35 42.66 44.35 42.66 40.35 40.66 40.35'/></svg>"
        );
        placeholder.onload = () => {
          const x = state.canvasWidth / 2 - props.width / 2;
          const y = state.canvasHeight / 2 - props.height / 2;
          state.context.drawImage(placeholder, x, y, props.width, props.height);
        };
      } else {
        loadImage(props.image);
      }
    });

    return {
      state,
      canvas,
      fileSelected,
      clicked,
      onDrop,
      onDragStart,
      onDragEnd,
      onMouseMove,
      filePicker
    };
  }
});
</script>

<style type="text/css">
.cursorPointer {
  cursor: pointer;
}
.cursorGrab {
  cursor: grab;
  cursor: -webkit-grab;
  cursor: -moz-grab;
}
.cursorGrabbing {
  cursor: grabbing;
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
}
</style>
