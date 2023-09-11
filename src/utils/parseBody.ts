export async function parseBody(body: ReadableStream<any> | null): Promise<any> {
    if (!body) return;

    const reader = body.getReader();
    const decoder = new TextDecoder();
    const chunks: Array<any> = [];
  
    async function read() {
      const { done, value } = await reader.read();
  
      if (done) {
        return JSON.parse(chunks.join(''));
      }
  
      const chunk = decoder.decode(value);
      chunks.push(chunk);
      return read();
    }
  
    return read();
  }