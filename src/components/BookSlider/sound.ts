let audio: HTMLAudioElement | null = null;
let soundEnabled = false;

export const initializeAudio = (): void => {
  // Audio file not found - commenting out for now
  // if (!audio) {
  //   audio = new Audio("/audios/page-flip-01a.mp3");
  // }
};

export const enableSound = (): void => {
  soundEnabled = true;
  
  // Audio functionality temporarily disabled due to missing file
  // if (audio) {
  //   audio.volume = 0;
  //   audio.play()
  //     .then(() => {
  //       audio?.pause();
  //       if (audio) {
  //         audio.currentTime = 0;
  //         audio.volume = 1;
  //       }
  //     })
  //     .catch(error => {
    
  //     });
  // }
};

export const disableSound = (): void => {
  soundEnabled = false;
};

export const toggleSound = (): boolean => {
  if (soundEnabled) {
    disableSound();
  } else {
    enableSound();
  }
  return soundEnabled;
};

export const isSoundEnabled = (): boolean => {
  return soundEnabled;
};

export const playPageFlipSound = (): void => {
  if (!soundEnabled) {
    return;
  }
  
  // Audio file not found - commenting out for now
  // if (!audio) {
  //   audio = new Audio("/audios/page-flip-01a.mp3");
  // }
  
  // const soundToPlay = audio.cloneNode() as HTMLAudioElement;
  
  // soundToPlay.play().catch(error => {

  // });
}; 