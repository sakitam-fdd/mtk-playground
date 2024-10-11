<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formData.id === undefined ? t('app.pls.create.short') : t('app.pls.edit.title')"
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
          <el-form-item class="mb-30px" prop="playgroundType" :label="t('app.pls.create.type')">
            <el-select v-model="formData.playgroundType" clearable :placeholder="t('app.pls.create.selectPlaceholder')">
              <el-option
                v-for="playgroundType in appStore.playgroundTypes"
                :key="playgroundType.id"
                :label="playgroundType.label"
                :value="playgroundType.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">
        {{ t('app.actions.cancel') }}
      </el-button>
      <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">
        {{ t('app.actions.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, toRaw } from 'vue';
  import { extend } from 'lodash-es';
  import { useI18n } from 'vue-i18n';
  import { ElMessage, FormInstance, FormRules } from 'element-plus';
  import { useAppStore } from '@/store/modules';
  import { createFolder, updateFolder } from '@/api/graphql';

  interface ICreateReq {
    name: string;
    playgroundType: string;
    id?: string;
  }

  const props = withDefaults(
    defineProps<{
      visible: boolean;
      current: any;
      data?: any;
    }>(),
    {
      visible: false,
    },
  );

  const { t } = useI18n();

  const DEFAULT_FORM_DATA = {
    name: '',
    playgroundType: '',
  };
  const dialogVisible = ref<boolean>(props.visible);
  const [loading, setLoading] = useState(false);
  const formRef = ref<FormInstance | null>(null);
  const formData = ref<ICreateReq>(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)));
  const formRules: FormRules<Pick<ICreateReq, 'name' | 'playgroundType'>> = {
    name: [{ required: true, trigger: 'blur', message: t('app.tips.validate.playgroundName') }],
    playgroundType: [{ required: true, trigger: 'change', message: t('app.tips.validate.playgroundType') }],
  };

  const emits = defineEmits(['update:visible', 'change']);
  const appStore = useAppStore();

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

  const handleCreateOrUpdate = () => {
    formRef.value?.validate((valid: boolean, fields) => {
      if (!valid) return console.error(t('app.tips.validate.fail'), fields);
      setLoading(true);
      const api = formData.value.id === undefined ? createFolder : updateFolder;
      api({
        ...toRaw(formData.value),
        sha: appStore.playgroundTypes.find((p) => p.label === formData.value.playgroundType)?.sha,
      })
        .then(() => {
          ElMessage.success(t('app.tips.result.success'));
          handleCancel();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  watch(
    () => props.visible,
    (v: boolean) => {
      dialogVisible.value = v;
      if (v && props.data) {
        const data = JSON.parse(JSON.stringify(props.data));
        extend(DEFAULT_FORM_DATA, data);
        formData.value = data;
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
