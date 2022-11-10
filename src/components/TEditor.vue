<template>
    <div>
      <vue3-tinymce v-model="myValue" :setting="setting" />
    </div>
  </template>
  
  <script lang="ts" setup>
  // 引入组件
  import { reactive, toRefs, watch } from 'vue';
  import {useStore} from 'vuex'
  
  const props = defineProps({
    value: {
      type: String,
      default: () => {
        return '';
      },
    },
  });
  
  const emits = defineEmits({
    input: null,
  });
  
  const { getters } = useStore();
  
  const { myValue, setting } = toRefs(
    reactive({
      myValue: props.value,
      // editor 配置项
      setting: {
        height: 400, // editor 高度
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
  
        plugins:
          'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help  autosave autoresize',
        toolbar:
          ' fontselect fontsizeselect | forecolor backcolor bold italic underline strikethrough link | image media alignleft aligncenter alignright alignjustify  | \
           code undo redo restoredraft | cut copy paste pastetext  anchor | \
           outdent indent | styleselect formatselect  |  bullist numlist | \
           blockquote subscript superscript removeformat | table  charmap hr pagebreak insertdatetime print preview | fullscreen ',
  
        branding: false,
        paste_data_images: true, // 设置为“true”将允许粘贴图像，而将其设置为“false”将不允许粘贴图
        // plugin_preview_width: 375, // 预览宽度 plugin_preview_height: 668,
        content_style: `img {max-width:100%;height:auto}`,
  
        images_upload_handler: (blobInfo: any, success: any, failure: any) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64();
          console.log('img', img);
          if (blobInfo.blob().size > 1000000) {
              failure("单张图片大小不能超过1000k");
              return;
          } else {
              success(img);
          }
        },
      },
    })
  );
  
  watch(
    () => props.value,
    (newValue) => {
      myValue.value = newValue;
    }
  );
  
  watch(
    () => myValue.value,
    (newValue) => {
      emits('input', newValue);
    }
  );
  
  </script>
  <style lang="scss" scoped>
  // 在使用过程中发现以上的setting下的height不生效，可以在这里深度的修改样式。
  :deep(.tox-tinymce) {
    min-height: 400px;
  }
  </style>