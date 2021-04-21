enum STORAGE {
  CHANNELS = 'CHANNELS',
  CLIENT_ID = 'CLIENT_ID',
  AUTHORIZATION = 'AUTHORIZATION',
}

export const GetChannels = (): string[] => {
  const channelsParsed = JSON.parse(localStorage.getItem(STORAGE.CHANNELS) || '[]');
  return channelsParsed;
};

export const AddChannels = (channel: string): string[] => {
  const channels = GetChannels();
  if (channels.find((v) => v === channel)) return channels;
  channels.push(channel);
  localStorage.setItem(STORAGE.CHANNELS, JSON.stringify(channels));
  return channels;
};

export const RemoveChannels = (channel: string): string[] => {
  const channels = GetChannels();
  const newChannels = channels.filter((v: string) => v !== channel);
  localStorage.setItem(STORAGE.CHANNELS, JSON.stringify(newChannels));
  return newChannels;
};

export const GetClientId = (): string => localStorage.getItem(STORAGE.CLIENT_ID) || '';

export const GetAuthorization = (): string => localStorage.getItem(STORAGE.AUTHORIZATION) || '';

export const SetClientId = (id: string) => localStorage.setItem(STORAGE.CLIENT_ID, id);

export const SetAuthorization = (v: string) => localStorage.setItem(STORAGE.AUTHORIZATION, v);
