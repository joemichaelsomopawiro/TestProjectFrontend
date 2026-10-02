import { ref } from 'vue';

export const dialogState = ref({
  visible: false,
  title: 'Pemberitahuan',
  message: '',
  showCancel: false,
  onConfirm: null,
  onCancel: null
});

export function useDialog() {
  const showDialog = (options) => {
    dialogState.value = {
      visible: true,
      title: options.title || 'Pemberitahuan',
      message: options.message || '',
      showCancel: options.showCancel || false,
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null
    };
  };

  const showAlert = (message, title = 'Pemberitahuan') => {
    return new Promise((resolve) => {
      showDialog({
        title,
        message,
        showCancel: false,
        onConfirm: () => resolve(true)
      });
    });
  };

  const showConfirm = (message, title = 'Konfirmasi') => {
    return new Promise((resolve) => {
      showDialog({
        title,
        message,
        showCancel: true,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  };

  const closeDialog = () => {
    dialogState.value.visible = false;
  };

  return {
    dialogState,
    showDialog,
    showAlert,
    showConfirm,
    closeDialog
  };
}

