/** 生成卷积混响脉冲响应；指数衰减 + 3200Hz 单极平滑 */
export function makeImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let smoothed = 0;
    const alpha = 1 - Math.exp((-2 * Math.PI * 3200) / ctx.sampleRate);
    for (let i = 0; i < length; i++) {
      const noise = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      smoothed += alpha * (noise - smoothed);
      data[i] = smoothed;
    }
  }
  return buffer;
}

export function makeWhiteNoise(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** 深空低频底噪：2 声道布朗噪声 */
export function makeAmbienceBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buffer;
}
