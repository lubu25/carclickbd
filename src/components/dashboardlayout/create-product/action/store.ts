import { createFileObject, getStoreAbleFile } from "@/utils/file";
import { getFromLocalStorageAsParse, setToLocalStorageAsStringify } from "@/utils/local-storage";
import productStorageKey from "../../product.storage-key";
import { ISecondStepStoreAbleData, IStoreAbleData } from "../type/type";

 

// cooking product media storable data for localstorage
export const getProductMediaStoreAbleData = async (
  storeAbleData: ISecondStepStoreAbleData
): Promise<IStoreAbleData[] | undefined> => {
  if (typeof window === "undefined") return;

  const mainPhotoUrl = await getStoreAbleFile(storeAbleData.mainPhotoFile);
  const otherPhotosUrls = await Promise.all(
    storeAbleData.otherPhotoFiles.map(getStoreAbleFile)
  );
 

  const data: IStoreAbleData[] = [
    {
      key: productStorageKey.MAIN_PHOTO,
      value: mainPhotoUrl,
    },
    {
      key: productStorageKey.OTHER_PHOTOS,
      value: otherPhotosUrls,
    },

    {
      key: productStorageKey.VIDEO_LINKS,
      value: storeAbleData.videoLinks,
    },
  ];

  return data;
};

// storing product media to localstorage
const storeProductMediaToLocalStorage = async (
  storeDataAbleData: ISecondStepStoreAbleData
) => {
  if (typeof window === "undefined") return;

  const storeAbleData = await getProductMediaStoreAbleData(storeDataAbleData);
  storeToLocalStorage(storeAbleData as IStoreAbleData[]);
};

// Helper to parse and map data from localStorage
const loadFromLocalStorage = async <T>(
  key: string,
  prefix: string,
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  form: any,
  formFieldName: string
) => {
  try {
    const savedData = getFromLocalStorageAsParse(key) || [];
    const fileObjects = savedData.map((url: string, index: number) =>
      createFileObject(url, `${prefix}-${index}`)
    );
    setState(fileObjects);
    form.setFieldsValue({ [formFieldName]: fileObjects });
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
  }
};

// Main function using the reusable helper
const loadProductMediaFromLocalStorage = async (
  form: any,
  stateSetters: {
    mainPhoto: React.Dispatch<React.SetStateAction<File | null>>;
    otherPhotos: React.Dispatch<React.SetStateAction<File[]>>;
    videoLinks: React.Dispatch<React.SetStateAction<string[]>>;
  }
) => {
  if (typeof window === "undefined") return;

  // Destructure state setters for readability
  const {
    mainPhoto: setMainPhotoFile,
    otherPhotos: setOtherPhotos,
    videoLinks: setVideoLinks,
  } = stateSetters;

  // Load main photo
  const savedMainPhoto = getFromLocalStorageAsParse(
    productStorageKey.MAIN_PHOTO
  );

  if (savedMainPhoto) {
    const mainPhotoFile = createFileObject(savedMainPhoto, "main-photo", "-1");
    setMainPhotoFile(mainPhotoFile as any);
    form.setFieldsValue({ mainPhoto: [mainPhotoFile] });
  }

  // Load other data using the reusable helper
  await loadFromLocalStorage(
    productStorageKey.OTHER_PHOTOS,
    "other",
    setOtherPhotos,
    form,
    "otherPhotos"
  );


  // Load video links
  const savedVideoLinks =
    getFromLocalStorageAsParse(productStorageKey.VIDEO_LINKS) || [];
  setVideoLinks(savedVideoLinks);
  form.setFieldsValue({ videoLinks: savedVideoLinks });
};

export const productMedia = {
  getProductMediaStoreAbleData,
  storeProductMediaToLocalStorage,
  loadProductMediaFromLocalStorage,
};

export const storeToLocalStorage =async (data: IStoreAbleData[]) => {
  return await data.forEach((d) => setToLocalStorageAsStringify(d.key, d.value));
};

 