export const storage = {
    setParentId: (id: string) => sessionStorage.setItem("parentId", id),
    getParentId: () => sessionStorage.getItem("parentId"),
    setChildId: (id: string) => sessionStorage.setItem("childId", id),
    getChildId: () => sessionStorage.getItem("childId"),
    clearAll: () => sessionStorage.clear(),
};
