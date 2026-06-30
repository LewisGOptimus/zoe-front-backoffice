import { defineStore } from 'pinia';
import { capitalizeFirstLetter } from '~/shared/utils/format';
import type { DocumentType } from '~/core/documentType/types/documentType.interface';
import { useDocumentTypeService } from '~/core/documentType/services/documentType.service';

export const useDocumentTypeStore = defineStore('documentType', () => {
  const documentTypeSvc = useDocumentTypeService();

  const documentTypes = ref<DocumentType[]>([]);

  const setDocumentTypes = (payload: DocumentType[]) => {
    documentTypes.value = payload.map((item) => ({
      ...item,
      name: capitalizeFirstLetter(item.name),
    }));
  };

  const getDocumentTypes = async (force = false) => {
    if (documentTypes.value.length > 0 && !force) return;
    const { response } = await documentTypeSvc.getDocumentTypes();
    setDocumentTypes(response || []);
  };

  const clear = () => {
    documentTypes.value = [];
  };

  return {
    documentTypes,
    getDocumentTypes,
    clear,
  };
});
