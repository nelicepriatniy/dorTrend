const tabs = document.querySelectorAll('.tab-item');
const blocks = document.querySelectorAll('.tab-block');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    // убрать active у всех табов
    tabs.forEach(t => t.classList.remove('active'));
    // убрать active у всех блоков
    blocks.forEach(b => b.classList.remove('active'));

    // добавить active текущему табу
    tab.classList.add('active');

    // найти и показать нужный блок
    const currentBlock = document.querySelector(
      `.tab-block[data-tab="${tabName}"]`
    );

    if (currentBlock) {
      currentBlock.classList.add('active');
    }
  });
});
