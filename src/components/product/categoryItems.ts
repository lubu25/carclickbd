export const getItems = (photosByCategory: any) => {
  const items = [
    {
      key: "all",
      label: `All Photos (${photosByCategory.all.length})`,
    },
    {
      key: "exterior",
      label: `Exterior (${photosByCategory.exterior.length})`,
    },
    {
      key: "interior",
      label: `Interior (${photosByCategory.interior.length})`,
    },
    {
      key: "others",
      label: `Others (${photosByCategory.others.length})`,
    },
  ];

  return items;
};
