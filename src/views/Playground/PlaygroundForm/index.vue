<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('app.pls.create.title')"
    destroy-on-close
    center
    width="380px"
    modal-class="mtk-dialog"
    @closed="handleDialogClose"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="top">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item class="mb-30px" prop="name" :label="t('app.pls.create.name')">
            <el-input v-model="formData.name" clearable :placeholder="t('app.pls.create.placeholder')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="mb-30px" prop="folder" :label="t('app.pls.create.folder')">
            <el-tree-select
              node-key="path"
              :props="{ label: 'name' }"
              v-model="formData.folder"
              :data="filterFolders(tree)"
              :render-after-expand="false"
            >
              <template #default="{ data }">
                <span>{{ t(`playgrounds.${data.path?.split('/')?.join('.')}.title`) }}</span>
              </template>
              <template #label="{ value }">
                <span>{{ t(`playgrounds.${value?.split('/')?.join('.')}.title`) }}</span>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">{{ t('app.actions.cancel') }}</el-button>
      <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">
        {{ t('app.actions.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { extend } from 'lodash-es';
  import { ElMessage, FormInstance, FormRules } from 'element-plus';
  import { filterFolders, updatePlayground } from '@/api/graphql';
  import type { ReplStore } from '@vue/repl';
  import { useI18n } from 'vue-i18n';
  import { buildCommit } from '@/views/Playground/Download/download';
  import { to } from '@/utils/to';

  interface ICreateReq {
    name: string;
    folder: string;
  }

  const props = withDefaults(
    defineProps<{
      visible: boolean;
      data?: any;
      tree?: any[];
      store: ReplStore;
    }>(),
    {
      visible: false,
      tree: () => [],
    },
  );

  const { t } = useI18n();

  const DEFAULT_FORM_DATA = {
    name: '',
    folder: '',
  };
  const dialogVisible = ref<boolean>(props.visible);
  const [loading, setLoading] = useState(false);
  const formRef = ref<FormInstance | null>(null);
  const formData = ref<ICreateReq>(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)));
  const formRules: FormRules<Pick<ICreateReq, 'name' | 'folder'>> = {
    name: [{ required: true, trigger: 'blur', message: t('app.tips.validate.playgroundName') }],
    folder: [{ required: true, trigger: 'change', message: t('app.tips.validate.playgroundFolder') }],
  };

  const emits = defineEmits(['update:visible', 'change']);

  const resetForm = () => {
    formRef.value?.clearValidate();
    formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA));
  };

  const handleCancel = () => {
    dialogVisible.value = false;
    resetForm();
    emits('update:visible', false);
    emits('change', false);
  };

  const handleDialogClose = () => {
    handleCancel();
  };

  const handleCreateOrUpdate = async () => {
    const valid = await formRef.value?.validate();

    if (!valid) return console.error(t('app.tips.validate.fail'), formData);
    setLoading(true);

    // 获取所有文件
    const content = buildCommit(props.store);

    const [error, res] = await to(updatePlayground(`${formData.value?.folder}/${formData.value.name}`, content, false));

    if (!error) {
      ElMessage.success(t('app.tips.result.success'));
      handleCancel();
      setLoading(false);
    } else {
      console.log(error);
      setLoading(false);
    }
  };

  watch(
    () => props.visible,
    (v: boolean) => {
      dialogVisible.value = v;
      if (v && props.data) {
        const data = JSON.parse(JSON.stringify(props.data));
        extend(DEFAULT_FORM_DATA, { folder: data.fullPath });
        formData.value = DEFAULT_FORM_DATA;
      }
    },
  );
</script>

<style lang="less" scoped>
  .form-wrap {
    display: flex;

    .disable-flex {
      :deep(.el-form-item__content) {
        display: block;
      }
    }
  }
</style>
