<template>
  <el-form
    :model="formData"
    :rules="rules"
    :ref="refForm"
    :label-width="labelWidth + 'px'"
    class="elForm"
    :style="styles"
  >
    <template
      v-for="(item,index) of renderFormArr"
      :key="index"
    >
      <!-- solt -->
      <el-form-item
        :label="item.label"
        v-if="item.type==='slot'"
        :prop="item.prop"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <slot :name="item.slotName"></slot>
      </el-form-item>

      <!-- 输入框 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="item.type==='input' && (item.condition ? item.condition(formData) : true)"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <el-input
          v-model="formData[item.prop]"
          :type="item.inputType || 'text'"
          :placeholder="item.placeholder"
          :disabled="isDisable ? isDisable : item.disabled"
          :clearable="item.clearable"
        >
          <template
            v-if="item.prepend"
            #prepend
          >{{item.prepend}}</template>
          <template
            v-if="item.append"
            #append
          >{{item.append}}</template>
        </el-input>
      </el-form-item>

      <!-- 选择框 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="item.type==='select' && (item.condition ? item.condition(formData) : true)"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <el-select
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          :filterable="item.filterable || false"
          :disabled="isDisable ? isDisable : item.disabled"
          @change="handleChange(formData,item)"
          :multiple="item.multiple || false"
          :clearable="item.clearable || false"
          :collapse-tags="item.collapseTags || false"
        >
          <el-option
            v-for="(opt,i) of options[item.prop]"
            :key="i"
            :label="opt[item.title]"
            :value="opt[item.value]"
            :disabled="opt.disabled"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 时间选择框 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="item.type==='date'"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <el-date-picker
          v-model="formData[item.prop]"
          :type="item.dateType || 'datetime'"
          :placeholder="item.placeholder"
          :disabled="isDisable ? isDisable : item.disabled"
        >
        </el-date-picker>
      </el-form-item>

      <!-- switch按钮 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="item.type==='switch'"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <el-switch
          v-model="formData[item.prop]"
          :disabled="isDisable ? isDisable : item.disabled"
        ></el-switch>
      </el-form-item>

      <!-- 复选框 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="item.type==='checkbox'"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <el-checkbox-group
          v-model="formData[item.prop]"
          :disabled="isDisable ? isDisable : item.disabled"
        >
          <el-checkbox
            v-for="(val,i) of checkboxs[item.prop]"
            :key="i"
            :label="val[item.value]"
          >{{val[item.title]}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 单选框 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="item.type==='radio'"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <el-radio-group
          v-model="formData[item.prop]"
          :disabled="isDisable ? isDisable : item.disabled"
          @change="handleChangeRadio(formData[item.prop],item)"
        >
          <el-radio
            v-for="(val,i) of radios[item.prop]"
            :key="i"
            :label="val[item.value]"
          >{{val[item.title]}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 远程搜索 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="item.type==='autocomplete'"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <el-autocomplete
          v-model="formData[item.prop]"
          :fetch-suggestions="item.querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          :disabled="isDisable ? isDisable : item.disabled"
        ></el-autocomplete>
      </el-form-item>

      <!-- 标签 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="item.type==='tag'"
        :style="item.style ? item.style : '' "
        :label-width="item.labelWidth"
      >
        <el-tag
          class="tag"
          type="info"
        >
          {{formData[item.props] === item.value ? item.filter(formData[item.prop]) : "无"}}
          <i
            class="el-icon-info"
            v-if="!formData[item.prop]"
          ></i>
          <i
            class="el-icon-info"
            v-if="formData[item.props] !== item.value"
          ></i>
        </el-tag>
      </el-form-item>
    </template>
  </el-form>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from 'vue';
const { proxy }: any = getCurrentInstance();
let props = defineProps({
  styles: {
    type: Object,
    defaule: {},
  },
  // 渲染表单数组
  renderFormArr: {
    type: Array,
    default: [],
  },
  // 表单数据
  formData: {
    type: Object,
    default: {},
  },
  // 验证规则
  rules: {
    type: Object,
    default: {},
  },
  // 字段宽度
  labelWidth: {
    type: Number,
    default: 100,
  },
  // 选择框option数组
  options: {
    type: Object,
    default: {},
  },
  // 复选框
  checkboxs: {
    type: Object,
    default: {},
  },
  // 单选框
  radios: {
    type: Object,
    default: {},
  },
  // 表单ref
  refForm: {
    type: String,
    default: '',
  },
  // 是否全部禁用
  isDisable: {
    type: Boolean,
    default: false,
  },
});
let emits = defineEmits([
  'handleSelect',
  'handleChangeRadio',
  'handleChange',
  'handleChangeDate',
]);
let submitForm = () => {
  return proxy.$refs[props.refForm].validate();
};
let resetForm: any = () => {
  proxy.$refs[props.refForm].resetFields();
};
let clearForm: any = () => {
  proxy.$refs[props.refForm].clearValidate();
};
let validateField: any = (name: string) => {
  proxy.$refs[props.refForm].validateField(name);
};
let handleSelect = (item: any) => {
  emits('handleSelect', item);
};
let handleChangeRadio = (data: any, item: any) => {
  emits('handleChangeRadio', { data, item });
};
let handleChange = (formdata: any, item: any) => {
  emits('handleChange', { formdata, item });
};
let handleChangeDate = (data: any, item: any) => {
  emits('handleChangeDate', { data, item });
};

defineExpose({
  submitForm,
  resetForm,
  clearForm,
  validateField,
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.elForm {
  .tag {
    font-size: 14px;
    font-weight: 600;
    color: #282c34;
  }
  :v-deep .el-textarea__inner {
    height: 180px;
  }
  :v-deep .el-select {
    width: 100%;
  }
  :v-deep .el-input {
    width: 100%;
  }
  :v-deep .el-date-editor {
    width: 100%;
  }
}
</style>
