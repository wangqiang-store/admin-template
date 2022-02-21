<template>
  <div v-if="isUploadImage">
    <el-upload
      :action="IMG_URL"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUploadImage"
      :headers="getItemtoken"
      ref="uploadRef"
      :disabled="disabled"
      :multiple="multiple"
      :file-list="fileList"
      name="file"
      :class="fileList.length > 0 ? 'uploadImage' : ''"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img
        :src="dialogImageUrl"
        alt=""
      />
    </el-dialog>
  </div>
  <div
    v-else
    style="width: 100%; align-item: center"
    :style="{ display: isFlex ? 'flex' : 'block' }"
  >
    <div style="margin-right: 10px; display: flex; flex-wrap: wrap">
      <!-- <video
        v-if="videoList.videoPath !='' && videoFlag == false && !multiple"
        :src="videoList.videoPath"
        class="avatar"
        controls
      >您的浏览器不支持视频播放</video> -->
      <template v-if="videoList.length > 0 && videoFlag == false && refreshVideo">
        <div
          v-for="(item, index) of videoLists"
          :key="index"
          style="position: relative"
          class="videoBoxs mr-10"
        >
          <i
            class="el-icon-delete-solid"
            @click="deleteSolid(index)"
            v-show="!disabled"
          ></i>
          <!-- <video
            style="margin-right:10px"
            :src="item.path"
            class="avatar"
            controls
          >您的浏览器不支持视频播放</video> -->
          <video
            id="my-video"
            class="video-js vjs-default-skin"
            controls
            preload="auto"
            v-if="item.path"
          >
            <source :src="item.path" />
            <!-- type="application/x-mpegURL" -->
          </video>
        </div>
      </template>
      <el-progress
        v-if="videoFlag == true"
        type="circle"
        :percentage="videoUploadPercent"
        style="margin-top: 30px"
      ></el-progress>
    </div>
    <!-- action必选参数, 上传的地址 -->
    <el-upload
      :action="VIDEO_URL"
      :headers="getItemtoken"
      list-type="picture-card"
      :show-file-list="false"
      :on-success="handleVideoSuccess"
      :before-upload="beforeUploadVideo"
      :on-progress="uploadVideoProcess"
      :disabled="disabled"
      :multiple="multiple"
      v-if="!videoList.length > 0 || multiple"
    >
      <i class="el-icon-plus"></i>
      <template #tip>
        <div
          class="el-upload__tip"
          v-if="tip"
        >{{ tip }}</div>
      </template>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import { IMG_FILE, IMG_URL, VIDEO_URL } from '@/api/common/index';
import { ElMessage } from 'element-plus';
let props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  imageList: {
    type: Array,
    default: [],
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 判断是否上传图片否则视频
  isUploadImage: {
    type: Boolean,
    default: true,
  },
  // 视频
  videoList: {
    type: Array,
    default: [],
  },
  // 是否弹性布局
  isFlex: {
    type: Boolean,
    default: true,
  },
  tip: {
    type: String,
    default: '',
  },
});
// 定义抛出的事件名称
let emits = defineEmits([
  'uploadSuccess',
  'uploadVideoSuccess',
  'deleteSolid',
  'uploadRemove',
]);
// 获取vue实例化对象
const { proxy }: any = getCurrentInstance();
let dialogVisible = ref(false);
let videoFlag = ref(false);
let videoUploadPercent = ref<string | number>('');
let fileList = ref(props.imageList);
let videoLists = ref(props.videoList);
let dialogImageUrl = ref('');
let myVideo: any = ref();
let refreshVideo = ref(true);
let handleRemove = (file: any, fileList: any) => {
  // console.log(file, fileList);
  // fileList = [];
  emits('uploadRemove', file, fileList);
};
let handlePictureCardPreview = (file: any) => {
  dialogVisible.value = true;
  dialogImageUrl.value = file.url;
};
// 限制图片上传格式
let beforeUploadImage = (file: any) => {
  if (['image/jpg', 'image/png', 'image/jpeg'].indexOf(file.type) == -1) {
    proxy.$message.error('请上传正确的图片格式');
    return false;
  }
};
// 上传图片成功
let handleUploadSuccess = (res: any) => {
  // fileList = [];
  // fileList.push({ url: IMG_FILE + res.data.path });
  emits('uploadSuccess', res);
};
// 上传视频成功
let handleVideoSuccess = (res: any) => {
  videoFlag.value = false;
  videoUploadPercent.value = 0;
  // setTimeout(() => {
  //   METHODS.initVideo();
  // }, 1000);
  // if (myVideo) {
  //   myVideo.dispose(); // 该方法会重置videojs的内部状态并移除dom
  // }
  emits('uploadVideoSuccess', res);
};
// 显示视频上传进度条
let uploadVideoProcess = (event: any) => {
  videoFlag.value = true;
  videoUploadPercent.value = Math.floor(event.percent);
};
// 判断视频格式、大小
let beforeUploadVideo = (file: any) => {
  const isLt10M = file.size / 1024 / 1024 < 500;
  if (
    [
      'video/mp4',
      'video/ogg',
      'video/flv',
      'video/avi',
      'video/wmv',
      'video/rmvb',
    ].indexOf(file.type) == -1
  ) {
    proxy.$message.error('请上传正确的视频格式');
    return false;
  }
  if (!isLt10M) {
    proxy.$message.error('上传视频大小不能超过10MB哦!');
    return false;
  }
};
// 删除视频
let deleteSolid = (index: number) => {
  emits('deleteSolid', index);
};
let initVideo = () => {
  //初始化视频方法
  nextTick(() => {
    myVideo = proxy.$video(
      'my-video',
      {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        controlBar: true,
      }
      // function () {
      //   myVideo.play();
      // }
    );
  });
};
let disposeVideo = () => {
  myVideo && myVideo.dispose();
};
// 清空上传文件列表
let handleClearFiles = () => {
  proxy.$refs['uploadRef'].clearFiles();
};
let getItemtoken = computed(() => {
  return {
    Authorization: localStorage.getItem('Admin-Token'),
  };
});
watch(
  () => props.imageList,
  (newData, oldData) => {
    fileList.value = newData;
  }
);
onMounted(() => {
  setTimeout(() => {
    if (props.videoList.length > 0) {
      initVideo();
    }
  }, 100);
});
onUnmounted(() => {
  // if (myVideo) {
  //   myVideo.dispose(); // 该方法会重置videojs的内部状态并移除dom
  // }
});
watch(
  () => props.videoList,
  () => {
    videoLists.value = props.videoList;
    refreshVideo.value = false;
    nextTick(() => {
      refreshVideo.value = true;
    });

    // setTimeout(() => {
    //   if (props.videoList.length > 0) {
    //     METHODS.initVideo();
    //   }
    // }, 1000);
  },
  {
    deep: true,
  }
);
</script>
<style lang="scss" scoped>
.avatar {
  /* width: 100%; */
  height: 150px;
  box-sizing: border-box;
}
.el-icon-delete-solid {
  padding: 15px;
  position: absolute;
  right: 10px;
  top: 30%;
  z-index: 10000;
  color: lightcoral;
}
:v-deep .el-overlay {
  z-index: 999999 !important;
}
:v-deep .el-dialog__body {
  width: 100%;
  z-index: 9999;
  img {
    width: 100%;
  }
}
#my-video,
.videoBoxs {
  width: 200px;
  height: 150px;
  margin-bottom: 5px;
}
.videoBoxs {
  background: #282c34;
}
.uploadImage :v-deep .el-upload {
  display: none;
}
</style>