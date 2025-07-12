const getPathByLang = (lang: string, path: string): string => {
    const currentPath = path.split("/").slice(2).join("/");
    return `/${lang}/${currentPath || "discover"}`;
};

export default getPathByLang;
