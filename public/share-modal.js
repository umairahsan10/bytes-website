(() => {
  const initShareModal = () => {
    const triggers = document.querySelectorAll('[data-share-modal-trigger]');
    const modal = document.querySelector('[data-share-modal]');
    const closeBtn = document.querySelector('[data-share-modal-close]');

    if (!modal || triggers.length === 0) return;

    const openModal = () => {
      modal.classList.add('is-open');
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', openModal);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShareModal);
  } else {
    initShareModal();
  }
})();
