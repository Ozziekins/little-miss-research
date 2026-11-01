export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

/** Use the native share sheet where available, otherwise copy the link. */
export async function shareOrCopy(data: { title: string; text?: string; url: string }): Promise<ShareResult> {
  if (navigator.share && matchMedia('(pointer: coarse)').matches) {
    try {
      await navigator.share(data);
      return 'shared';
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') return 'cancelled';
    }
  }
  try {
    await navigator.clipboard.writeText(data.url);
    return 'copied';
  } catch {
    window.prompt('Copy this link:', data.url);
    return 'failed';
  }
}
