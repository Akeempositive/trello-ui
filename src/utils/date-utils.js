export const formatDate = (date) => {
    return new Date(date).toString().substring(0, 15);
}