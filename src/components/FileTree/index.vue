<template>
  <ul role="tree" aria-label="file tree" class="tree">
    <li
      v-for="item in data"
      :class="['tree-item', menuKey === item.path ? 'selected' : '']"
      tabindex="-1"
      :key="item.path"
      :id="item.path"
    >
      <div class="tree-item-label" :style="{ paddingLeft: depth * 24 + 'px' }" @click="handleItem(item, depth)">
        <span class="tree-item-label-content">
          <div>
            <el-icon v-if="item.icon" class="vertical-text-top pt-4px" size="14">
              <component :is="item.icon"></component>
            </el-icon>
            <span :class="['label', item.icon ? 'ml-10px' : 'ml-0']">{{ item.path }}</span>
          </div>
        </span>
        <span
          v-if="item.children && item.children.length > 0"
          :class="['tree-item-arrow', item.collapse ? 'collapsed' : 'expand']"
        ></span>
      </div>

      <FileTree
        v-if="item.children && item.children.length > 0"
        :menu-key="menuKey"
        :data="item.children"
        :class="[item.collapse || isUndefined(item.collapse) ? 'hidden' : 'show']"
        :depth="depth + 1"
        @change="onChange"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { isUndefined } from 'lodash-es';

  defineOptions({
    name: 'FileTree',
  });

  withDefaults(
    defineProps<{
      menuKey?: string;
      data?: any[];
      depth?: number;
    }>(),
    {
      data: () => [],
      depth: 1,
    },
  );

  const emits = defineEmits(['update:modelValue', 'change']);

  const onChange = (item, depth: number) => {
    emits('update:modelValue', item, depth);
    emits('change', item, depth);
  };

  const handleItem = (item, depth) => {
    item.collapse = !item.collapse;

    if (depth >= 2) {
      onChange(item, depth);
    }
  };
</script>

<style lang="less" scoped>
  .tree {
    list-style: none;
    padding: 0px;
    margin: 0px;
    width: 100%;
    box-shadow: none;
    border: none;
    box-sizing: border-box;
    font-variant: tabular-nums;
    line-height: 1.5715;
    font-size: 14px;
    text-align: left;
    outline: none;
    color: var(--m-text-color);
    transition:
      background 0.3s,
      width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;

    &-item {
      outline: none;
      box-sizing: border-box;
      transition:
        border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);

      &-label {
        position: relative;
        height: 40px;
        width: calc(100% + 1px);
        line-height: 40px;
        display: flex;
        align-items: center;
        margin-top: 4px;
        margin-bottom: 4px;
        padding: 0 34px 0 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        transition:
          border-color 0.3s,
          background 0.3s,
          padding 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);

        &-content {
          flex: auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color .3s;

          .label {
            display: inline-block;
            width: calc(100% - 16px);
            opacity: 1;
            vertical-align: bottom;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition:
              opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
              margin 0.3s,
              color 0.3s;
          }
        }

        &:hover {
          color: var(--el-color-primary);
        }
      }

      &-arrow {
        position: absolute;
        top: 50%;
        right: 16px;
        width: 10px;
        flex: none;
        transform: translateY(-2px);
        transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

        &:after,
        &:before {
          position: absolute;
          width: 6px;
          height: 1.5px;
          background-color: currentcolor;
          border-radius: 2px;
          transition:
            background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
            transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
            top 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
            color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          content: '';
        }

        &.collapsed {
          &:after {
            transform: rotate(45deg) translate(-2.5px);
          }

          &:before {
            transform: rotate(-45deg) translate(2.5px);
          }
        }

        &.expand {
          &:after {
            transform: rotate(-45deg) translate(-2.5px);
          }

          &:before {
            transform: rotate(45deg) translate(2.5px);
          }
        }
      }

      &.selected {
        color: var(--el-color-primary);
      }
    }

    &.hidden {
      display: none;
    }

    &.show {
      display: block;
    }
  }
</style>
