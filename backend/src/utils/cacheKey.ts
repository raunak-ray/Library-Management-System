export const generateBooksCacheKey = (query: any) => {
    const { title, author, category, sort } = query;
  
    const parts = ["books"];
  
    if (title) parts.push(`title:${title}`);
    if (author) parts.push(`author:${author}`);
    if (category) parts.push(`category:${category}`);
    if (sort) parts.push(`sort:${sort}`);
  
    if (parts.length === 1) parts.push("all");
  
    return parts.join(":").toLowerCase();
  };

