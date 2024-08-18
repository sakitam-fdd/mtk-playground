<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增示例"
    destroy-on-close
    center
    width="380px"
    modal-class="mtk-dialog"
    @closed="handleDialogClose"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="top">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item class="mb-30px" prop="name" label="示例名称">
            <el-input v-model="formData.name" clearable placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="mb-30px" prop="folder" label="所属目录">
            <el-tree-select
              node-key="fullPath"
              :props="{ label: 'path' }"
              v-model="formData.folder"
              :data="filterFolders(tree)"
              :render-after-expand="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { extend } from 'lodash-es';
  import { ElMessage, FormInstance, FormRules } from 'element-plus';
  import { buildBranch, createBranch, createFile, isSuccess, filterFolders } from '@/api/github';
  import type { ReplStore } from '@vue/repl';
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

  const DEFAULT_FORM_DATA = {
    name: '',
    folder: '',
  };
  const dialogVisible = ref<boolean>(props.visible);
  const [loading, setLoading] = useState(false);
  const formRef = ref<FormInstance | null>(null);
  const formData = ref<ICreateReq>(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)));
  const formRules: FormRules<Pick<ICreateReq, 'name' | 'folder'>> = {
    name: [{ required: true, trigger: 'blur', message: '请输入示例名称' }],
    folder: [{ required: true, trigger: 'change', message: '请选择所属目录' }],
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

    if (!valid) return console.error('表单校验不通过', formData);
    setLoading(true);

    const content = buildCommit(props.store);

    const branch = buildBranch();

    const [error, data] = await to(createBranch({ branchName: branch }));

    if (!error && isSuccess(data)) {
      const [e] = await to(
        createFile(content, {
          branch,
          folder: `${formData.value?.folder}/${formData.value.name}`,
        }),
      );

      if (!e) {
        ElMessage.success('操作成功');
        handleCancel();
        setLoading(false);
      } else {
        setLoading(false);
      }
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
