const useRequest = () => {
  const request = async (url: string, method: string, data: any) => {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(data),
    });
    return response.json();
  };

  return { request };
};

export default useRequest;
