export const useEditor = () => {
  const isEditing = useState('isEditing', () => false);
  const disableActions = useState('disableActions', () => true);
  const isEditingEnabled = useState('isEditingEnabled', () => true);
  const displayBlockList = useState('displayBlockList', () => false);
  return { isEditing, isEditingEnabled, disableActions, displayBlockList };
};
