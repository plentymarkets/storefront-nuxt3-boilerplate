export const useEditor = () => {
  const isEditing = useState('isEditing', () => false);
  const isEditingEnabled = useState('isEditingEnabled', () => true);
  return { isEditing, isEditingEnabled };
};
