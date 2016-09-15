export const selectToasts = state => {
  return state.toaster.toastOrder.map(id => state.toaster.toasts[id]);
}
