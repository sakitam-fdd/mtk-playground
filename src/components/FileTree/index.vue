<template>
  <div class="file-tree">
    <ul role="tree" aria-label="file tree" class="tree">
      <li v-for="item in data" class="tree-item" tabindex="-1" :id="item.id">
        <div
          class="tree-item-container"
          style="--level: 1; content-visibility: auto; contain-intrinsic-size: auto 2rem"
        >
          <div style="grid-area: spacer; display: flex">
            <div style="width: 100%; display: flex"></div>
          </div>
          <div class="tree-item-toggle tree-item-toggle--hover tree-item-toggle--end">
            <span class="i-octicon:chevron-right-12"></span>
          </div>
          <div id=":r8d:" class="tree-item-content">
            <div class="PRIVATE_VisuallyHidden" aria-hidden="true" id=":r8e:"></div>
            <div class="tree-item-visual" aria-hidden="true">
              <div class="tree-directory-icon">
                <span class="i-octicon:file-directory-fill-24"></span>
              </div>
            </div>
            <span class="tree-item-content-text">
              <span>.github</span>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      data?: any[];
    }>(),
    {
      data: () => [],
    },
  );
</script>

<style lang="less" scoped>
  .tree {
    list-style: none;
    padding: 0px;
    margin: 0px;

    &-item {
      outline: none;

      &-container {
        --level: 1;
        --toggle-width: 1rem;
        --min-item-height: 2rem;
        position: relative;
        display: grid;
        --leading-action-width: calc(var(--has-leading-action, 0) * 1.5rem);
        --spacer-width: calc(calc(var(--level) - 1) * (var(--toggle-width) / 2));
        grid-template-columns: var(--spacer-width) var(--leading-action-width) var(--toggle-width) 1fr;
        grid-template-areas: 'spacer leadingAction toggle content';
        width: 100%;
        font-size: 14px;
        color: var(--fgColor-default, var(--color-fg-default, #1f2328));
        border-radius: 6px;
        cursor: pointer;
      }

      &-toggle {
      }
    }
  }
</style>
