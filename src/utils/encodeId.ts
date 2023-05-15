export const encodeId = (id: string, lengthShow = 5, length = 8) => {
    const sliceId = id.slice(-lengthShow);
    return sliceId.padStart(length, "*");
};
