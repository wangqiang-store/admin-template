<template>
  <el-table
    :data="tableData"
    :border="isborder"
    style="width: 100%"
    :row-key="getRowKey"
    :ref="refsName"
    :fit="true"
    :row-style="rowStyle"
    :cell-style="cellStyle"
    :header-cell-style="headerCellStyle"
    @selection-change="handleSelectionChange"
    class="table"
  >
    <template
      v-for="(item, index) of renderTable"
      :key="index"
    >
      <!-- slot -->
      <el-table-column
        :label="item.label"
        v-if="item.type === 'slot'"
        :reserve-selection="true"
        :width="item.width || ''"
      >
        <template v-slot="scope">
          <slot
            :name="item.slotName"
            :row="scope.row"
          ></slot>
        </template>
      </el-table-column>

      <!-- 多选 -->
      <el-table-column
        v-if="item.type === 'selection'"
        type="selection"
        :reserve-selection="true"
        width="55"
      >
      </el-table-column>

      <!-- 展开行 -->
      <el-table-column
        v-if="item.type === 'expand'"
        type="expand"
        width="50"
        #default="scoped"
        @click="handleClickColumn(scoped.row)"
      >
        <el-table
          :data="scoped.row[item.dataName]"
          :border="isborder"
          style="width: 100%; margin-top: 10px"
        >
          <template
            v-for="(val, index) of randerExpandTable"
            :key="index"
          >
            <!-- 文本 -->
            <el-table-column
              :label="val.label"
              :show-overflow-tooltip="true"
              :prop="val.prop"
              :formatter="val.formatter"
              :sortable="val.sortable"
              align="center"
              v-if="val.type === 'text'"
            >
            </el-table-column>

            <!-- switch -->
            <el-table-column
              :label="val.label"
              :prop="val.prop"
              v-if="val.type === 'switch'"
              #default="scoped"
              align="center"
            >
              <el-switch
                v-model="scoped.row[val.prop]"
                :active-color="val.color || '#13ce66'"
                @change="handleEmitChange(scoped.row)"
              >
              </el-switch>
            </el-table-column>

            <!-- tag -->
            <el-table-column
              :label="val.label"
              :prop="val.prop"
              v-if="val.type === 'tag'"
              align="center"
              #default="scoped"
            >
              <el-tag :type="val.tagType">{{ scoped.row[val.prop] }}</el-tag>
            </el-table-column>
          </template>
        </el-table>
      </el-table-column>

      <!-- 文本 -->
      <el-table-column
        :label="item.label"
        :show-overflow-tooltip="item.tooltip === false ? item.tooltip : true"
        :prop="item.prop"
        :formatter="item.formatter"
        :="item.sortable"
        align="center"
        v-if="item.type === 'text'"
        :fixed="item.fixed"
        :width="item.width || ''"
      >
      </el-table-column>

      <!-- 多行文本 -->
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        :sortable="item.sortable"
        align="center"
        v-if="item.type === 'multilineText'"
        :fixed="item.fixed"
        #default="scoped"
      >
        <div v-html="item.formatter(scoped.row)"></div>
      </el-table-column>

      <!-- 多段文本 -->
      <el-table-column
        :label="item.label"
        :show-overflow-tooltip="true"
        :prop="item.prop"
        :sortable="item.sortable"
        align="center"
        v-if="item.type === 'moreText'"
        :fixed="item.fixed"
        #default="scoped"
      >
        <span>{{ item.formatter(scoped.row) }}</span>
      </el-table-column>

      <!-- switch -->
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        v-if="item.type === 'switch'"
        #default="scoped"
        align="center"
      >
        <el-switch
          :disabled="
            item.condition ? item.condition(scoped.row).isdisable : false
          "
          v-model="scoped.row[item.prop]"
          :active-color="item.color || '#13ce66'"
          @change="handleEmitChange(scoped.row, item)"
        >
        </el-switch>
      </el-table-column>

      <!-- tag -->
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        v-if="item.type === 'tag'"
        :show-overflow-tooltip="false"
        align="center"
        #default="scoped"
        :min-width="item.moreTag ? 130 : 80"
        :width="item.width"
      >
        <template v-if="item.moreTag">
          <div
            style="display: flex; justify-content: center"
            class="tag"
          >
            <el-tag
              v-for="(val, index) of item.formatter(scoped.row)"
              :key="'tag' + index"
              :type="val.tagType"
              :effect="val.effect || 'light'"
            >{{ val.text }}</el-tag>
          </div>
        </template>
        <el-tag
          v-else
          :type="item.formatter(scoped.row).tagType"
          :effect="item.formatter(scoped.row).effect || 'light'"
        >{{ item.formatter(scoped.row).text }}</el-tag>
      </el-table-column>

      <!-- image -->
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        v-if="item.type === 'image'"
        align="center"
        #default="scoped"
      >
        <div v-if="item.moreImage">
          <el-image
            v-for="val of scoped.row[item.prop]"
            :key="val.id"
            :src="IMG_FILE + val[item.value]"
            :fit="item.fit || 'cover'"
            style="height:90px"
          ></el-image>
        </div>

        <el-image
          v-else
          :src="IMG_FILE + scoped.row[item.prop]"
          :fit="item.fit || 'cover'"
          style="height:90px"
          @click="handlePreview()"
          :class="isPreview && 'pointer'"
        ></el-image>

      </el-table-column>

      <!-- file -->
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        v-if="item.type === 'file'"
        align="center"
        #default="scoped"
      >
        <div
          v-if="item.moreFile"
          class="d_felx d_flex_column"
        >
          <a
            v-for="val of scoped.row[item.prop]"
            :key="val.id"
            :href="val[item.href]"
            target="_blank"
            style="display:block"
            class="mb-5 text-ellipsis"
            :title="val[item.name]"
          >
            {{val[item.name]}}
          </a>
        </div>
        <a
          v-else
          :href="scoped.row[item.href]"
          target="_blank"
          class="text-ellipsis"
          :title="scoped.row[item.name]"
        >
          {{scoped.row[item.name]}}
        </a>
      </el-table-column>

      <!-- button -->
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        #default="scoped"
        v-if="item.type === 'handle' && btnList.some(item=>  item.isShow)"
        align="center"
      >
        <div class="d_flex d_flex_c">
          <el-button
            v-for="(val, i) of btnList"
            :key="i"
            :type="val.condition ? val.condition(scoped.row).type : val.type"
            @click="handleBtnEvent(scoped.row, val)"
            :disabled="val.condition ? val.condition(scoped.row).isdisable : ( val.isdisable  ? typeof val.isdisable === 'function' ? val.isdisable() :
           val.isdisable : false)"
            :plain="val.plain ? val.plain : false"
            :size="val.condition ? val.condition(scoped.row).size : val.size"
            v-show="val.isShow"
          >
            {{ val.condition ? val.condition(scoped.row).text : val.text }}
          </el-button>
        </div>
      </el-table-column>

      <!--icon-button -->
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        v-if="item.type === 'iconHandle' && iconList.some(item=>  item.isShow)"
        align="center"
        #default="scoped"
      >
        <div class="d_flex d_flex_c">
          <template
            v-for="(val, i) of iconList"
            :key="i"
          >
            <el-tooltip
              class="item"
              effect="light"
              :content="val.condition ? val.condition(scoped.row).text : val.text"
              placement="top"
              v-if="val.isShow"
            > 
              <i
                class="iconfont"
                :class="val.condition ? val.condition(scoped.row).icon : val.icon"
                @click="handleBtnEvent(scoped.row, val)"
                :style="{ color: val.condition ? val.condition(scoped.row).color : val.color}"
              >
              </i>
            </el-tooltip>
          </template>
        </div>
      </el-table-column>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
import { getCurrentInstance } from 'vue';
import { IMG_FILE } from '@/api/common';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
/**
 * @props {
 *   tableData  表格数据
 *   isborder   表格边框
 *   renderTable  自定义渲染表格
 *        @params  item  {
 *          label 文本
 *          prop  属性
 *          tooltip  文本过长隐藏
 *          width  表格列的宽度
 *          type  控制表格列显示类型
 *          moreFile  是否该列多文件显示
 *          href  文件路径
 *          fit  图片显示效果
 *          value  多图片列 为 二级 子属性值  下拉选择列 为 传递后端 属性值
 *        }
 *   btnList  表格操作按钮
 *        @params  val {
 *          type  按钮类型
 *          isdisabled  是否禁用按钮
 *          plain  主题风格
 *          size  按钮大小
 *          isShow  是否显示按钮
 *          text  按钮文本
 *          condittion 方法 自定义按钮
 *        }
 *   iconList  表格图标操作按钮
 *   randerExpandTable  表格折叠行自定义渲染
 *   refsName  ref名称
 *   rowStyle 表格单独行的 style
 *   cellStyle  单元格的style
 *   headerCellStyle  表格头部样式
 *   isPreview 是否开启预览图片
 * }
 */
let props = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
  isborder: {
    type: Boolean,
    default: false,
  },
  renderTable: {
    type: Array,
    default: [],
  },
  btnList: {
    type: Array,
    default: [],
  },
  iconList: {
    type: Array,
    default: [],
  },
  randerExpandTable: {
    type: Array,
    default: [],
  },
  refsName: {
    type: String,
    default: '',
  },
  rowStyle: {
    type: Function,
    default: () => {},
  },
  cellStyle: {
    type: Function,
    default: () => {},
  },
  headerCellStyle: {
    type: Object,
    default: {},
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
});

// 定义抛出的事件名称
let emit = defineEmits([
  'handleSelectionChange',
  'handleBtnEvent',
  'handleEmitChange',
  'handleClickColumn',
]);

// 获取vue实例化对象
let { proxy }: any = getCurrentInstance();
let handleSelectionChange = (val: any): void => {
  emit('handleSelectionChange', val);
};
let handleBtnEvent = (row: any, val: any): void => {
  emit('handleBtnEvent', { row, val });
};
let handleEmitChange = (val: any, item: any): void => {
  emit('handleEmitChange', val, item);
};
let handleClickColumn = (row: any) => {
  emit('handleClickColumn', row);
};
let getRowKey = (row: any) => {
  return row.id + '';
};
let clearSelection = () => {
  proxy.$refs[props.refsName].clearSelection();
};

// 预览图片
let handlePreview = () => {
  if (props.isPreview) {
    var imageTable = document.querySelector('.table') as HTMLElement;
    new Viewer(imageTable, {
      toolbar: {
        zoomIn: 4,
        zoomOut: 4,
        oneToOne: 4,
        reset: 4,
        prev: 4,
        play: {
          show: 4,
          size: 'large',
        },
        next: 4,
        rotateLeft: 4,
        rotateRight: 4,
        flipHorizontal: 4,
        flipVertical: 4,
      },
    });
  }
};

// 导出子模块 方法、变量 可供父模块访问
defineExpose({
  clearSelection,
});
</script>
<style lang="scss" scoped>
.tag {
  .el-tag {
    margin-right: 5px;
  }
  &:last-child {
    margin-right: -5px;
  }
}
.pointer {
  cursor: pointer;
}
.iconfont {
  cursor: pointer;
  font-size: 20px;
  margin: 0 10px 0 10px;
}
a {
  text-decoration: none;
  color: #33a6dc;
}
</style>